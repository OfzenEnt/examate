import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export const ExamScreen = () => {
  return (
    <ScrollView className="flex-1 bg-white pt-20 px-8">
      <Text className="text-3xl font-bold text-blue-700 mb-8">Exams</Text>
      
      <View className="bg-white rounded-2xl shadow-md p-4 border border-gray-200 mb-4">
        <Text className="text-lg font-semibold text-black mb-2">Current Exam</Text>
        <Text className="text-gray-600">Data Structures - Sessional 01</Text>
        <Text className="text-gray-500">Hall: RTB-301 | Time: 10:00 AM - 1:00 PM</Text>
      </View>
      
      <View className="bg-white rounded-2xl shadow-md p-4 border border-gray-200">
        <Text className="text-lg font-semibold text-black mb-2">Upcoming Exams</Text>
        <Text className="text-gray-600">DBMS - Sessional 02</Text>
        <Text className="text-gray-500">Tomorrow | Hall: RTB-302</Text>
      </View>
      
      <View className="h-20" />
    </ScrollView>
  );
};