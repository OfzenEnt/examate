import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export const ReportsScreen = () => {
  return (
    <ScrollView className="flex-1 bg-white pt-20 px-8">
      <Text className="text-3xl font-bold text-blue-700 mb-8">Reports</Text>
      
      <TouchableOpacity className="bg-white rounded-2xl shadow-md p-4 border border-gray-200 mb-4">
        <Text className="text-lg font-semibold text-black mb-2">Attendance Report</Text>
        <Text className="text-gray-600">Generate attendance reports for exams</Text>
      </TouchableOpacity>
      
      <TouchableOpacity className="bg-white rounded-2xl shadow-md p-4 border border-gray-200 mb-4">
        <Text className="text-lg font-semibold text-black mb-2">Exam Summary</Text>
        <Text className="text-gray-600">View exam statistics and summaries</Text>
      </TouchableOpacity>
      
      <TouchableOpacity className="bg-white rounded-2xl shadow-md p-4 border border-gray-200">
        <Text className="text-lg font-semibold text-black mb-2">Hall Utilization</Text>
        <Text className="text-gray-600">Check hall usage and availability</Text>
      </TouchableOpacity>
      
      <View className="h-20" />
    </ScrollView>
  );
};