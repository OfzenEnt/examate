import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { assignmentAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { InvigilationDetailsScreen } from './InvigilationDetailsScreen';

export const InvigilatorDashboard = () => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [myInvigilations, setMyInvigilations] = useState([]);
  const [selectedInvigilation, setSelectedInvigilation] = useState(null);
  const [showInvigilationDetails, setShowInvigilationDetails] = useState(false);

  const loadMyInvigilations = async () => {
    try {
      const response = await assignmentAPI.getMyInvigilations();
      setMyInvigilations(response.invigilations || []);
    } catch (error) {
      console.error('Failed to load invigilations:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMyInvigilations();
    
    const backAction = () => {
      if (showInvigilationDetails) {
        setShowInvigilationDetails(false);
        setSelectedInvigilation(null);
        return true;
      }
      return false; // Allow app to close
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [showInvigilationDetails]);

  if (showInvigilationDetails && selectedInvigilation) {
    return (
      <InvigilationDetailsScreen 
        invigilation={selectedInvigilation} 
        onBack={() => {
          setShowInvigilationDetails(false);
          setSelectedInvigilation(null);
        }}
      />
    );
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMyInvigilations();
  };

  const getStatusColor = (examDate, startTime, endTime) => {
    if (!examDate || !startTime || !endTime) return 'text-gray-600';
    
    const now = new Date();
    const utcOffset = now.getTimezoneOffset() * 60000;
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(now.getTime() + utcOffset + istOffset);
    const today = istNow.toISOString().split('T')[0];
    const currentTime = istNow.getHours().toString().padStart(2, '0') + ':' + istNow.getMinutes().toString().padStart(2, '0');
    
    console.log('Status check:', { examDate, today, startTime, endTime, currentTime });
    
    if (examDate > today) {
      return 'text-blue-600';
    } else if (examDate === today) {
      if (currentTime < startTime) {
        return 'text-blue-600';
      } else if (currentTime >= startTime && currentTime <= endTime) {
        return 'text-orange-600';
      } else {
        return 'text-green-600';
      }
    } else {
      return 'text-green-600';
    }
  };

  const getStatusText = (examDate, startTime, endTime) => {
    if (!examDate || !startTime || !endTime) return 'Unknown';
    
    const now = new Date();
    const utcOffset = now.getTimezoneOffset() * 60000;
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(now.getTime() + utcOffset + istOffset);
    const today = istNow.toISOString().split('T')[0];
    const currentTime = istNow.getHours().toString().padStart(2, '0') + ':' + istNow.getMinutes().toString().padStart(2, '0');
    
    if (examDate > today) {
      return 'Upcoming';
    } else if (examDate === today) {
      if (currentTime < startTime) {
        return 'Upcoming';
      } else if (currentTime >= startTime && currentTime <= endTime) {
        return 'Ongoing';
      } else {
        return 'Completed';
      }
    } else {
      return 'Completed';
    }
  };

  return (
    <ScrollView 
      className="flex-1 bg-gray-50 pt-20 px-8"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="mb-8">
        <Text className="text-3xl font-bold text-blue-700">Invigilator Dashboard</Text>
        <Text className="text-gray-500 mt-2">Welcome, {user?.name}</Text>
      </View>

      <View className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
        <Text className="text-xl font-bold text-black mb-4">Today's Overview</Text>
        
        <View className="flex-row justify-between">
          <View className="items-center flex-1">
            <View className="bg-blue-100 p-4 rounded-full mb-2">
              <Icon name="assignment" size={24} color="#1D4ED8" />
            </View>
            <Text className="text-2xl font-bold text-blue-600">{myInvigilations.length}</Text>
            <Text className="text-gray-500 text-sm">Total Invigilations</Text>
          </View>
          
          <View className="items-center flex-1">
            <View className="bg-green-100 p-4 rounded-full mb-2">
              <Icon name="event-seat" size={24} color="#059669" />
            </View>
            <Text className="text-2xl font-bold text-green-600">
              {myInvigilations.reduce((sum, invigilation) => sum + invigilation.student_count, 0)}
            </Text>
            <Text className="text-gray-500 text-sm">Students to Monitor</Text>
          </View>
        </View>
      </View>

      <View>
        <Text className="text-blue-600 font-semibold mb-4 text-2xl">My Invigilations</Text>
        
        {myInvigilations.length > 0 ? (
          myInvigilations.map((invigilation, index) => (
            <TouchableOpacity 
              key={invigilation.exam} 
              className="bg-white rounded-lg p-4 mb-3 border border-gray-100"
              onPress={() => {
                setSelectedInvigilation(invigilation);
                setShowInvigilationDetails(true);
              }}
            >
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                  <Text className="text-black font-semibold text-lg">{invigilation.course_code}</Text>
                  <Text className="text-gray-600">Room: {invigilation.room_id}</Text>
                </View>
                <Text className={`font-medium ${getStatusColor(invigilation.exam_date, invigilation.start_time, invigilation.end_time)}`}>
                  {getStatusText(invigilation.exam_date, invigilation.start_time, invigilation.end_time)}
                </Text>
              </View>
              
              <View className="flex-row items-center mb-1">
                <Icon name="calendar-today" size={16} color="#6b7280" />
                <Text className="text-gray-500 ml-2 text-sm">{invigilation.exam_date}</Text>
              </View>
              
              <View className="flex-row items-center mb-1">
                <Icon name="access-time" size={16} color="#6b7280" />
                <Text className="text-gray-500 ml-2 text-sm">{invigilation.start_time} - {invigilation.end_time}</Text>
              </View>
              
              <View className="flex-row items-center">
                <Icon name="group" size={16} color="#6b7280" />
                <Text className="text-gray-500 ml-2 text-sm">{invigilation.student_count} students</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="bg-white rounded-lg p-6 border border-gray-100">
            <View className="items-center">
              <Icon name="assignment" size={48} color="#9CA3AF" />
              <Text className="text-gray-500 text-center mt-2">No invigilations found</Text>
              <Text className="text-gray-400 text-center text-sm mt-1">
                You don't have any invigilation duties assigned yet
              </Text>
            </View>
          </View>
        )}
      </View>
      
      <View className="h-20" />
    </ScrollView>
  );
};