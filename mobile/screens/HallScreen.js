import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export const HallScreen = () => {
  return (
    <ScrollView className="flex-1 bg-white pt-20 px-8">
      <Text className="text-3xl font-bold text-blue-700 mb-8">Hall Management</Text>
      
      <View className="bg-white rounded-2xl shadow-md p-4 border border-gray-200 mb-4">
        <Text className="text-lg font-semibold text-black mb-2">Current Hall</Text>
        <Text className="text-gray-600">RTB-301 - Computer Science Lab</Text>
        <Text className="text-gray-500">Capacity: 40 students</Text>
        <Text className="text-green-600 font-medium">Status: Active</Text>
      </View>
      
      <View className="bg-white rounded-2xl shadow-md p-4 border border-gray-200">
        <Text className="text-lg font-semibold text-black mb-2">Available Halls</Text>
        <Text className="text-gray-600">RTB-302 - Physics Lab</Text>
        <Text className="text-gray-600">RTB-303 - Chemistry Lab</Text>
      </View>
      
      <View className="h-20" />
    </ScrollView>
  );
};