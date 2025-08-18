import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export const ProfileScreen = ({ user }) => {
  const { logout } = useAuth();

  return (
    <ScrollView className="flex-1 bg-white pt-20 px-8">
      <Text className="text-3xl font-bold text-blue-700 mb-8">Profile</Text>
      
      <View className="items-center mb-8">
        <View className="bg-gray-100 rounded-full w-24 h-24 border border-blue-500 items-center justify-center mb-4">
          <Image
            source={require("../assets/prof_avatar.png")}
            className="w-20 h-20 rounded-full"
            resizeMode="cover"
          />
        </View>
        <Text className="text-2xl font-bold text-gray-800">{user?.name || 'Prof. Kumar'}</Text>
        <Text className="text-gray-600">{user?.dept || 'Computer Science'}</Text>
      </View>
      
      <View className="bg-white rounded-2xl shadow-md p-4 border border-gray-200 mb-4">
        <Text className="text-lg font-semibold text-black mb-2">User Information</Text>
        <Text className="text-gray-600">ID: {user?.id || 'EMP001'}</Text>
        <Text className="text-gray-600">Campus: {user?.campus || 'Main Campus'}</Text>
        <Text className="text-gray-600">Role: {user?.role === 0 ? 'Invigilator' : 'Exam Coordinator'}</Text>
      </View>
      
      <TouchableOpacity 
        className="bg-red-500 rounded-lg py-3 px-6 mb-20"
        onPress={logout}
      >
        <Text className="text-white font-semibold text-center">Logout</Text>
      </TouchableOpacity>
      
      <View className="h-20" />
    </ScrollView>
  );
};