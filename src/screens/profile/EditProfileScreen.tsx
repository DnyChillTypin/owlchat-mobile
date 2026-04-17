import React, { useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useUserProfileContext } from '@/providers/user-profile-provider';
import { ThemedInput } from '@/components/shared/ThemedInput';
import { ThemedButton } from '@/components/shared/ThemedButton';
import { navigate, goBack } from '@/navigation/navigationRef';

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  gender: z.boolean(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function EditProfileScreen() {
  const { profile, refreshProfile } = useUserProfileContext();
  const { updateProfile, loading } = useUserProfile();

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || '',
      gender: profile?.gender ?? true,
      dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '2000-01-01',
    }
  });

  // Watch gender to trigger re-renders for button styles
  const genderValue = useWatch({
    control,
    name: "gender",
  });

  const onSubmit = async (data: ProfileFormValues) => {
    if (!profile?.id) return;
    try {
      // Include existing email/phone because backend validates them
      const updateData = {
        ...data,
        email: profile.email || '',
        phoneNumber: profile.phoneNumber || '',
      };
      await updateProfile(profile.id, updateData);
      await refreshProfile();
      goBack(); // Immediately return to profile
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update profile");
    }
  };

  return (
    <ScrollView className="flex-1 bg-background p-6">
      <View className="mb-6">
        <Text className="text-sm font-bold text-muted-foreground uppercase mb-2 ml-1">Personal Information</Text>
        
        <View className="space-y-4">
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <ThemedInput
                label="Full Name"
                value={value}
                onChangeText={onChange}
                placeholder="Enter your name"
                error={errors.name?.message}
              />
            )}
          />

          <View className="mb-4">
            <Text className="text-foreground font-medium mb-2 ml-1">Gender</Text>
            <View className="flex-row space-x-3">
              <TouchableOpacity 
                onPress={() => setValue('gender', true)}
                className={`flex-1 py-3 items-center rounded-xl border ${genderValue === true ? 'bg-primary/10 border-primary' : 'bg-card border-border'}`}
              >
                <Text className={genderValue === true ? 'text-primary font-bold' : 'text-muted-foreground'}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setValue('gender', false)}
                className={`flex-1 py-3 items-center rounded-xl border ${genderValue === false ? 'bg-primary/10 border-primary' : 'bg-card border-border'}`}
              >
                <Text className={genderValue === false ? 'text-primary font-bold' : 'text-muted-foreground'}>Female</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Controller
            control={control}
            name="dateOfBirth"
            render={({ field: { onChange, value } }) => (
              <ThemedInput
                label="Date of Birth (YYYY-MM-DD)"
                value={value}
                onChangeText={onChange}
                placeholder="2000-01-01"
                error={errors.dateOfBirth?.message}
              />
            )}
          />
        </View>
      </View>

      <View className="mt-8 space-y-3">
        <ThemedButton 
          title="Save Changes" 
          onPress={handleSubmit(onSubmit)}
          loading={loading}
        />
        <ThemedButton 
          title="Cancel" 
          variant="secondary"
          onPress={() => goBack()}
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
}
