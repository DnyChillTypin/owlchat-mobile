import React from 'react';
import { View, ViewProps } from 'react-native';

export function ThemedCard({ children, className = "", ...props }: ViewProps & { className?: string }) {
  return (
    <View 
      className={`bg-card rounded-xl border border-border p-4 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
