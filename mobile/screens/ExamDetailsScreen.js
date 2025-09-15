import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CustomAlert } from '../components/ui/CustomAlert';
import { assignmentAPI } from '../utils/api';
import { RoomDetailsScreen } from './RoomDetailsScreen';

export const ExamDetailsScreen = ({ exam, onBack }) => {
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', buttons: [] });

  const [seatingData, setSeatingData] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showRoomDetails, setShowRoomDetails] = useState(false);

  useEffect(() => {
    loadSeatingData();
    
    const backAction = () => {
      if (showRoomDetails) {
        setShowRoomDetails(false);
        setSelectedRoom(null);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [showRoomDetails]);

  const loadSeatingData = async () => {
    try {
      const response = await assignmentAPI.getExamSeating(exam.course_code, exam.exam_date);
      setSeatingData(response.seating || []);
    } catch (error) {
      console.log('No seating data found');
    }
  };

  if (showRoomDetails && selectedRoom) {
    return (
      <RoomDetailsScreen 
        room={selectedRoom} 
        onBack={() => {
          setShowRoomDetails(false);
          setSelectedRoom(null);
        }}
      />
    );
  }

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
        <Text className="text-3xl font-bold text-blue-700">Exam Details</Text>
      </View>

      <View className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
        <Text className="text-2xl font-bold text-black mb-4">{exam.course_code}</Text>
        
        <View className="flex-row items-center mb-2">
          <Icon name="calendar-today" size={20} color="#6b7280" />
          <Text className="text-gray-600 ml-2">Date: {exam.exam_date}</Text>
        </View>
        
        <View className="flex-row items-center mb-2">
          <Icon name="access-time" size={20} color="#6b7280" />
          <Text className="text-gray-600 ml-2">Time: {exam.start_time} - {exam.end_time}</Text>
        </View>
        
        <View className="flex-row items-center mb-2">
          <Icon name="assignment" size={20} color="#6b7280" />
          <Text className="text-gray-600 ml-2">Type: {getExamTypeText(exam.exam_type)}</Text>
        </View>
        
        <View className="flex-row items-center">
          <Icon name="person" size={20} color="#6b7280" />
          <Text className="text-gray-600 ml-2">Created by: {exam.created_by}</Text>
        </View>
      </View>



      {seatingData.length > 0 && (
        <View className="mt-6">
          <Text className="text-blue-600 font-semibold mb-4 text-2xl">Seating Arrangement</Text>
          
          {seatingData.map((seat, index) => (
            <View key={seat.room_id} className="bg-white rounded-lg border border-gray-200 mb-3">
              <TouchableOpacity 
                className="p-4 flex-row justify-between items-center"
                onPress={() => {
                  setSelectedRoom(seat);
                  setShowRoomDetails(true);
                }}
              >
                <View className="flex-1">
                  <Text className="text-black font-semibold text-lg">Room {seat.room_id}</Text>
                  <Text className="text-gray-600">Students: {seat.student_count}</Text>
                  <Text className="text-gray-500 text-sm">
                    Invigilator: {seat.invigilator_name || 'Not assigned'}
                  </Text>
                </View>
                <Icon 
                  name="chevron-right" 
                  size={24} 
                  color="#6b7280" 
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
      />
      
      <View className="h-20" />
    </ScrollView>
  );
};