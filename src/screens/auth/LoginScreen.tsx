import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useAuthContext } from '@/providers/auth-provider';
import { navigate } from '@/navigation/navigationRef';

export function LoginScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuthContext();


    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert("Error", "Please enter both username and password");
            return;
        }
        try {
            await login({ username, password });
            // navigation will automatically reroute because AuthProvider's isAuthenticated becomes true!
        } catch (error: any) {
            console.error("[Login] Error during login:", error);
            const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred.";
            Alert.alert("Login Error", errorMessage);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-background">
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
                <View className="items-center mb-8">
                    <Image source={require('@/assets/owl-logo/black/owl-512.png')} className="w-24 h-24 mb-4" tintColor="#34B77B" />
                    <Text className="text-3xl font-bold text-foreground">Welcome back</Text>
                    <Text className="text-muted-foreground text-center mt-2">Login to your OwlChat account</Text>
                </View>

                <View className="space-y-4">
                    <View>
                        <Text className="text-foreground font-medium mb-2">Username</Text>
                        <TextInput 
                            className="bg-card text-card-foreground border border-border rounded-lg px-4 py-3"
                            placeholder="m@example.com"
                            placeholderTextColor="#888"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />
                    </View>
                    
                    <View className="mt-4">
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-foreground font-medium">Password</Text>
                            <TouchableOpacity>
                                <Text className="text-primary text-sm font-medium">Forgot password?</Text>
                            </TouchableOpacity>
                        </View>
                        <TextInput 
                            className="bg-card text-card-foreground border border-border rounded-lg px-4 py-3"
                            placeholder="••••••••"
                            placeholderTextColor="#888"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    <TouchableOpacity 
                        className="bg-primary rounded-lg py-4 mt-8 items-center"
                        onPress={handleLogin}
                    >
                        <Text className="text-primary-foreground font-bold text-lg">Login</Text>
                    </TouchableOpacity>

                    <View className="flex-row justify-center mt-6">
                        <Text className="text-muted-foreground">Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigate("Register")}>
                            <Text className="text-primary font-bold">Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="mt-12">
                     <Text className="text-center text-muted-foreground text-xs">
                         By clicking continue, you agree to our Terms of Service and Privacy Policy.
                     </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
