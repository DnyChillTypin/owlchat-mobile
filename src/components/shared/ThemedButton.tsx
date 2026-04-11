import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator } from 'react-native';

interface ThemedButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  loading?: boolean;
  className?: string;
  textClassName?: string;
}

export function ThemedButton({ 
  title, 
  variant = 'primary', 
  loading = false, 
  className = "", 
  textClassName = "",
  disabled,
  ...props 
}: ThemedButtonProps) {
  const variants = {
    primary: "bg-primary border-primary",
    secondary: "bg-secondary border-secondary",
    outline: "bg-transparent border-border",
    ghost: "bg-transparent border-transparent",
    destructive: "bg-destructive border-destructive",
  };

  const textVariants = {
    primary: "text-primary-foreground",
    secondary: "text-secondary-foreground",
    outline: "text-foreground",
    ghost: "text-foreground",
    destructive: "text-destructive-foreground",
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity 
      className={`px-6 py-3 rounded-lg border flex-row justify-center items-center ${variants[variant]} ${isDisabled ? 'opacity-50' : ''} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text className={`font-bold text-center ${textVariants[variant]} ${textClassName}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
