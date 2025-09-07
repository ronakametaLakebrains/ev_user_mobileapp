import React, { forwardRef, useMemo } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { useTheme } from '../../theme';

export type InputProps = TextInputProps & {
  label?: string;
  errorText?: string;
  helperText?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  containerStyle?: any;
};

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, errorText, helperText, left, right, style, containerStyle, editable = true, ...rest },
  ref,
) {
  const { theme } = useTheme();
  const borderColor = useMemo(() => {
    if (errorText) return theme.colors.error;
    return theme.colors.inputBorder;
  }, [errorText, theme.colors.error, theme.colors.inputBorder]);

  return (
    <View style={containerStyle}>
      {label ? (
        <Text style={[styles.label, { color: theme.colors.textPrimary, marginBottom: theme.spacing.xs }]}>{label}</Text>
      ) : null}
      <View
        style={[
          styles.field,
          {
            backgroundColor: theme.colors.inputBackground,
            borderColor,
            borderRadius: theme.radius.md,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            opacity: editable ? 1 : 0.6,
          },
          theme.shadows.sm,
        ]}
      >
        {left ? <View style={[styles.adornment, { marginRight: theme.spacing.sm }]}>{left}</View> : null}
        <TextInput
          ref={ref}
          placeholderTextColor={theme.colors.inputPlaceholder}
          style={[
            styles.input,
            {
              color: theme.colors.textPrimary,
              fontSize: theme.typography.sizes.md,
            },
            style,
          ]}
          editable={editable}
          {...rest}
        />
        {right ? <View style={[styles.adornment, { marginLeft: theme.spacing.sm }]}>{right}</View> : null}
      </View>
      {errorText ? (
        <Text style={[styles.error, { color: theme.colors.error, marginTop: theme.spacing.xs }]}>{errorText}</Text>
      ) : helperText ? (
        <Text style={[styles.helper, { color: theme.colors.textSecondary, marginTop: theme.spacing.xs }]}>{helperText}</Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  label: { fontWeight: '600' },
  field: { flexDirection: 'row', alignItems: 'center', borderWidth: 1 },
  input: { flex: 1, paddingVertical: 0 },
  adornment: { alignItems: 'center', justifyContent: 'center' },
  helper: { fontSize: 12 },
  error: { fontSize: 12 },
});


