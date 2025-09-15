import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const InvigilationDetailsScreen = ({ invigilation, onBack }) => {
  const getExamTypeText = (type) => {
    switch (String(type)) {
      case '1': return 'Sessional-I';
      case '2': return 'Sessional-II';
      case '3': return 'Semester';
      default: return 'Unknown';
    }
  };

  return (
    <ScrollView className="flex-1 bg-white pt-20 px-8">
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={onBack} className="mr-4">
          <Icon name="arrow-back" size={24} color="#1D4ED8" />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-blue-700">Invigilation Details</Text>
      </View>

      <View className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
        <Text className="text-2xl font-bold text-black mb-4">{invigilation.course_code}</Text>
        
        <View className="flex-row items-center mb-2">
          <Icon name="location-on" size={20} color="#6b7280" />
          <Text className="text-gray-600 ml-2">Room: {invigilation.room_id}</Text>
        </View>
        
        <View className="flex-row items-center mb-2">
          <Icon name="calendar-today" size={20} color="#6b7280" />
          <Text className="text-gray-600 ml-2">Date: {invigilation.exam_date}</Text>
        </View>
        
        <View className="flex-row items-center mb-2">
          <Icon name="access-time" size={20} color="#6b7280" />
          <Text className="text-gray-600 ml-2">Time: {invigilation.start_time} - {invigilation.end_time}</Text>
        </View>
        
        <View className="flex-row items-center mb-2">
          <Icon name="assignment" size={20} color="#6b7280" />
          <Text className="text-gray-600 ml-2">Type: {getExamTypeText(invigilation.exam_type)}</Text>
        </View>
        
        <View className="flex-row items-center">
          <Icon name="group" size={20} color="#6b7280" />
          <Text className="text-gray-600 ml-2">Students: {invigilation.student_count}</Text>
        </View>
      </View>

      <View>
        <Text className="text-blue-600 font-semibold mb-4 text-2xl">Students List</Text>
        
        {invigilation.students && invigilation.students.length > 0 ? (
          invigilation.students.map((student, index) => (
            <View key={student.reg_no} className="bg-white rounded-lg p-4 mb-3 border border-gray-100">
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-black font-semibold text-lg">{student.student_name}</Text>
                  <Text className="text-gray-500 text-sm">Reg No: {student.reg_no}</Text>
                </View>
                <Text className="text-blue-600 font-medium">#{index + 1}</Text>
              </View>
            </View>
          ))
        ) : (
          <View className="bg-white rounded-lg p-4 border border-gray-100">
            <Text className="text-gray-500 text-center">No students assigned</Text>
          </View>
        )}
      </View>
      
      <View className="h-20" />
    </ScrollView>
  );
};