import { Linking, Image } from 'react-native';
import RNQRGenerator from 'rn-qr-generator';

export type UpiParams = {
  payeeVpa: string; // e.g. merchant@bank
  payeeName?: string;
  amount?: string; // decimal string
  txnNote?: string;
  currency?: 'INR';
  txnRef?: string; // unique reference
};

function buildUpiUri({
  payeeVpa,
  payeeName,
  amount,
  txnNote,
  currency = 'INR',
  txnRef,
}: UpiParams) {
  const params: Record<string, string> = { pa: payeeVpa, cu: currency };
  if (payeeName) params.pn = payeeName;
  if (amount) params.am = amount;
  if (txnNote) params.tn = txnNote;
  if (txnRef) params.tr = txnRef;
  const query = Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join('&');
  return `upi://pay?${query}`;
}

export async function openUpiApp(upi: UpiParams) {
  const uri = buildUpiUri(upi);
  // Some devices need the scheme checked before openURL
  const can = await Linking.canOpenURL(uri);
  if (!can) {
    throw new Error('No UPI app available to handle the request');
  }
  await Linking.openURL(uri);
}

export async function openUpiUri(upiUri: string) {
  console.log('Attempting to open UPI URI:', upiUri);

  try {
    // First try to check if we can open the URL
    const can = await Linking.canOpenURL(upiUri);
    console.log('Can open URL:', can);

    if (can) {
      await Linking.openURL(upiUri);
      console.log('Successfully opened UPI URI');
      return;
    }
  } catch (error) {
    console.log('Error checking/opening UPI URI:', error);
  }

  // Fallback: Try to open with generic UPI intent
  try {
    console.log('Trying fallback UPI opening methods...');
    await openUpiScanner();
    console.log('Successfully opened UPI app via fallback');
    return;
  } catch (fallbackError) {
    console.log('Fallback also failed:', fallbackError);
  }

  // If all else fails, try direct opening without canOpenURL check
  try {
    console.log('Trying direct opening without canOpenURL check...');
    await Linking.openURL(upiUri);
    console.log('Successfully opened UPI URI via direct method');
    return;
  } catch (directError) {
    console.log('Direct opening failed:', directError);
  }

  throw new Error(
    'Unable to open UPI app. Please make sure you have a UPI app installed (PhonePe, Paytm, Google Pay, BHIM, etc.)',
  );
}

// Best-effort: open a UPI app's scanner screen if available.
// We try known deep links for popular apps, falling back to the generic UPI intent.
export async function openUpiScanner() {
  const candidates = [
    'phonepe://scan',
    'phonepe://pay',
    'phonepe://',
    'paytmmp://scan',
    'paytmmp://cash_wallet?feature=scan_qr',
    'paytmmp://',
    'tez://upi/pay',
    'gpay://upi/pay',
    'gpay://',
    'bhim://upi/scanpay',
    'bhim://',
    'mobikwik://',
    'freecharge://',
    'upi://pay',
    'upi://',
  ];

  for (const uri of candidates) {
    try {
      const can = await Linking.canOpenURL(uri);
      if (can) {
        await Linking.openURL(uri);
        return;
      }
    } catch {}
  }
  throw new Error('No UPI app available to handle the request');
}

// More reliable cross-app approach: open UPI intent with only payee details
// so the user can enter amount manually. Many apps require at least `pa` and
// `cu` and will otherwise exit immediately.
export async function openUpiMinimalPay(payeeVpa: string, payeeName?: string) {
  const uri = buildUpiUri({ payeeVpa, payeeName, currency: 'INR' });
  const can = await Linking.canOpenURL(uri);
  if (can) {
    await Linking.openURL(uri);
    return;
  }
  // Fallback to scanner heuristics
  await openUpiScanner();
}

// Decode a bundled asset QR image and attempt to open the UPI URI within it.
// Provide the require() of the asset, e.g. decodeAssetQrAndPay(require('../../assets/QrCode.jpeg'))
export async function decodeAssetQrAndPay(asset: any) {
  console.log('decodeAssetQrAndPay called with asset:', asset);
  const resolved = Image.resolveAssetSource(asset);
  console.log('Resolved asset:', resolved);
  const imagePath = resolved?.uri;
  console.log('Image path:', imagePath);
  if (!imagePath) {
    throw new Error('Unable to resolve QR asset image');
  }

  try {
    // Try with uri first (for file:// paths)
    console.log('Attempting QR detection with uri:', imagePath);
    const detection = await RNQRGenerator.detect({ uri: imagePath });
    console.log('QR detection result:', detection);
    const values: string[] = detection?.values || [];
    console.log('QR values found:', values);
    const upiUri = values.find(
      v => typeof v === 'string' && v.startsWith('upi://'),
    );
    console.log('UPI URI found:', upiUri);

    if (upiUri) {
      console.log('Opening UPI URI:', upiUri);
      await openUpiUri(upiUri);
      return;
    }
  } catch (uriError) {
    console.log('URI detection failed:', uriError);
  }

  // If uri method failed or no UPI found, try base64 method
  try {
    console.log('Trying base64 method...');
    // For bundled assets, we might need to fetch and convert to base64
    const response = await fetch(imagePath);
    const blob = await response.blob();
    const reader = new FileReader();

    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove data:image/jpeg;base64, prefix
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
    });

    reader.readAsDataURL(blob);
    const base64Data = await base64Promise;

    console.log('Attempting QR detection with base64');
    const detection = await RNQRGenerator.detect({ base64: base64Data });
    console.log('QR detection result (base64):', detection);
    const values: string[] = detection?.values || [];
    console.log('QR values found (base64):', values);
    const upiUri = values.find(
      v => typeof v === 'string' && v.startsWith('upi://'),
    );
    console.log('UPI URI found (base64):', upiUri);

    if (upiUri) {
      console.log('Opening UPI URI (base64):', upiUri);
      await openUpiUri(upiUri);
      return;
    }
  } catch (base64Error) {
    console.log('Base64 detection failed:', base64Error);
  }

  throw new Error('No UPI data found in QR after trying both methods');
}
