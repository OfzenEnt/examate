import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export const ExamCard = ({ exam, onPress }) => {
  const getExamTypeText = (type) => {
    switch (String(type)) {
      case "1":
        return "Sessional-I";
      case "2":
        return "Sessional-II";
      case "3":
        return "Semester";
      default:
        return "Unknown";
    }
  };

  const getExamStatus = (examDate, startTime, endTime) => {
    if (!examDate || !startTime || !endTime) {
      return { text: 'Unknown', color: 'bg-gray-100 text-gray-600' };
    }
    
    // Get current IST time
    const now = new Date();
    const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
    const today = istTime.toISOString().split('T')[0];
    
    // Get current time in HH:MM format
    const hours = istTime.getUTCHours().toString().padStart(2, '0');
    const minutes = istTime.getUTCMinutes().toString().padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;
    
    // Convert time to minutes for proper comparison
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.substring(0, 5).split(':').map(Number);
      // If hour is 01-05, assume it's PM (13-17)
      const adjustedHours = hours >= 1 && hours <= 5 ? hours + 12 : hours;
      return adjustedHours * 60 + minutes;
    };
    
    const currentMinutes = timeToMinutes(currentTime);
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    
    if (examDate > today) {
      return { text: 'Upcoming', color: 'bg-blue-100 text-blue-600' };
    } else if (examDate === today) {
      if (currentMinutes < startMinutes) {
        return { text: 'Upcoming', color: 'bg-blue-100 text-blue-600' };
      } else if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
        return { text: 'Ongoing', color: 'bg-orange-100 text-orange-600' };
      } else {
        return { text: 'Completed', color: 'bg-green-100 text-green-600' };
      }
    } else {
      return { text: 'Completed', color: 'bg-green-100 text-green-600' };
    }
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-lg p-4 mb-3 border border-gray-100 flex-row items-center"
      onPress={() => onPress && onPress(exam)}
    >
      <View className="bg-purple-500 w-10 h-10 rounded-full items-center justify-center mr-3">
        <Text className="text-white font-semibold">
          {exam.course_code?.substring(0, 2) || "EX"}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-black font-semibold text-lg">
          {exam.course_code}
        </Text>
        <Text className="text-gray-500 text-sm">
          Type: {getExamTypeText(exam.exam_type)}
        </Text>
        <View className="flex-row items-center mt-1">
          <Icon name="calendar-today" size={16} color="#6b7280" />
          <Text className="text-sm text-gray-500 ml-1">{exam.exam_date}</Text>
          <Icon
            name="access-time"
            size={16}
            color="#6b7280"
            style={{ marginLeft: 12 }}
          />
          <Text className="text-sm text-gray-500 ml-1">
            {exam.start_time} - {exam.end_time}
          </Text>
        </View>
      </View>
      <View className={`px-2 py-1 rounded-full ml-2 ${getExamStatus(exam.exam_date, exam.start_time, exam.end_time).color.split(' ')[0]}`}>
        <Text className={`text-xs ${getExamStatus(exam.exam_date, exam.start_time, exam.end_time).color.split(' ')[1]}`}>
          {getExamStatus(exam.exam_date, exam.start_time, exam.end_time).text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
