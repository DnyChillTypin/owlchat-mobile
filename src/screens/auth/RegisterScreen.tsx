import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { navigate } from '@/navigation/navigationRef';
import { authService } from '@/services/account-service';

export function RegisterScreen() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);


    const handleRegister = async () => {
        if (!email || !username || !password || password !== confirmPassword) {
            Alert.alert("Error", "Please check your inputs and try again.");
            return;
        }
        
        try {
            setLoading(true);
            const response = await authService.signup({
                username: username,
                email: email,
                password: password
            });

            const accountId = response?.id;
            if (!accountId) {
                throw new Error("No account ID returned from signup");
            }

            // Navigate to authenticate page with accountId and email
            navigate("Authenticate" as never, { accountId, email } as never);
        } catch (error: any) {
            const msg = error.response?.data?.message || error.message || "Registration failed. Please try again.";
            Alert.alert("Registration Error", msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-background">
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
                <View className="items-center mb-8">
                    <Image source={require('@/assets/owl-logo/black/owl-512.png')} className="w-24 h-24 mb-4" tintColor="#34B77B" />
                    <Text className="text-3xl font-bold text-foreground">Create account</Text>
                    <Text className="text-muted-foreground text-center mt-2">Enter your details to sign up</Text>
                </View>

                <View className="space-y-4">
                    <View>
                        <Text className="text-foreground font-medium mb-2">Email</Text>
                        <TextInput 
                            className="bg-card text-card-foreground border border-border rounded-lg px-4 py-3"
                            placeholder="m@example.com"
                            placeholderTextColor="#888"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View>
                        <Text className="text-foreground font-medium mb-2">Username</Text>
                        <TextInput 
                            className="bg-card text-card-foreground border border-border rounded-lg px-4 py-3"
                            placeholder="johndoe"
                            placeholderTextColor="#888"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />
                    </View>
                    
                    <View className="mt-4">
                        <Text className="text-foreground font-medium mb-2">Password</Text>
                        <TextInput 
                            className="bg-card text-card-foreground border border-border rounded-lg px-4 py-3"
                            placeholder="••••••••"
                            placeholderTextColor="#888"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    <View className="mt-4">
                        <Text className="text-foreground font-medium mb-2">Confirm Password</Text>
                        <TextInput 
                            className="bg-card text-card-foreground border border-border rounded-lg px-4 py-3"
                            placeholder="••••••••"
                            placeholderTextColor="#888"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                    </View>

                    <TouchableOpacity 
                        className="bg-primary rounded-lg py-4 mt-8 items-center"
                        onPress={handleRegister}
                    >
                        <Text className="text-primary-foreground font-bold text-lg">Create Account</Text>
                    </TouchableOpacity>

                    <View className="flex-row justify-center mt-6">
                        <Text className="text-muted-foreground">Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigate("Login")}>
                            <Text className="text-primary font-bold">Sign in</Text>
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
