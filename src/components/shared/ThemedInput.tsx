import React from "react";
import { TextInput, TextInputProps, View, Text } from "react-native";

interface ThemedInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export function ThemedInput({
  label,
  error,
  containerClassName = "",
  className = "",
  ...props
}: ThemedInputProps) {
  return (
    <View className={`mb-4 w-full ${containerClassName}`}>
      {label && <Text className="text-foreground text-sm font-medium mb-1.5">{label}</Text>}
      <TextInput
        placeholderTextColor="#888"
        className={`w-full px-4 py-3 bg-secondary text-foreground rounded-2xl border focus:border-border transition-colors ${
          error ? "border-destructive focus:border-destructive" : "border-border/50"
        } ${className}`}
        {...props}
      />
      {error && <Text className="text-destructive text-xs mt-1">{error}</Text>}
    </View>
  );
}
