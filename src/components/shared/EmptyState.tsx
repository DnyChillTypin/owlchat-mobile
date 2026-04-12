import React from "react";
import { View, Text, ViewProps } from "react-native";

interface EmptyStateProps extends ViewProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, icon, style, ...props }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-6" style={style} {...props}>
      {icon && <View className="mb-4 opacity-70">{icon}</View>}
      <Text className="text-xl font-semibold text-foreground text-center mb-2">{title}</Text>
      {description && (
        <Text className="text-sm text-muted-foreground text-center max-w-[80%]">{description}</Text>
      )}
    </View>
  );
}
