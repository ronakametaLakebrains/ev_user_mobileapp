import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../../theme';

interface Transaction {
  id: number;
  paymentId: string;
  transactionId: number;
  amount: number;
  connectorName: string;
  chargerName: string;
  etbc: number;
  status: string;
  ectn: number;
  initialMeterValue: number;
  mobileNumber: string | null;
  emailId: string;
  createdAt: string;
  updatedAt: string;
}

interface UserInfo {
  mobileNumber: string | null;
  emailId: string;
}

interface TransactionData {
  success: boolean;
  refund: boolean;
  refundAmount: number;
  transactions: Transaction[];
  chargerName: string;
  userInfo: UserInfo;
}

export function TransactionDetailsScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { transactionData }: { transactionData: TransactionData } = route.params as any;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    // Convert from paisa to rupees (divide by 100)
    const amountInRupees = amount / 100;
    return `₹${amountInRupees.toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'failed':
        return '#F44336';
      default:
        return theme.colors.textSecondary;
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleGoHome = () => {
    navigation.navigate('Home' as never);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: theme.colors.textPrimary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Transaction Details
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Charger Info Card */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
            🔌 Charger Information
          </Text>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
              Charger Name:
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
              {transactionData.chargerName}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
              User Email:
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
              {transactionData.userInfo.emailId}
            </Text>
          </View>
          {transactionData.userInfo.mobileNumber && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Mobile Number:
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                {transactionData.userInfo.mobileNumber}
              </Text>
            </View>
          )}
        </View>

        {/* Refund Info Card */}
        {transactionData.refund && (
          <View style={styles.card}>
            <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
              💰 Refund Information
            </Text>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Refund Amount:
              </Text>
              <Text style={[styles.infoValue, { color: '#4CAF50', fontWeight: 'bold' }]}>
                {formatCurrency(transactionData.refundAmount)}
              </Text>
            </View>
          </View>
        )}

        {/* Transactions Card */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
            📊 Transaction History
          </Text>
          {transactionData.transactions.map((transaction, _index) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionHeader}>
                <Text style={[styles.transactionId, { color: theme.colors.textPrimary }]}>
                  Transaction #{transaction.transactionId}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(transaction.status) }]}>
                  <Text style={styles.statusText}>
                    {transaction.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.transactionDetails}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                    Payment ID:
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                    {transaction.paymentId}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                    Amount:
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.colors.primary, fontWeight: 'bold' }]}>
                    {formatCurrency(transaction.amount)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                    Connector:
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                    {transaction.connectorName}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                    ETBC (kWh):
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                    {(transaction.etbc / 1000).toFixed(2)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                    ECTN (kWh):
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                    {(transaction.ectn / 1000).toFixed(2)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                    Created:
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                    {formatDate(transaction.createdAt)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                    Updated:
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                    {formatDate(transaction.updatedAt)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={handleGoHome}
          >
            <Text style={[styles.buttonText, { color: 'white' }]}>
              🏠 Go to Home
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  transactionItem: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  transactionId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  transactionDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
