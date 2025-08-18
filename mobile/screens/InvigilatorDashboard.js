import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { BottomNavBar } from '../components/ui/BottomNavBar';
import { ExamScreen } from './ExamScreen';
import { HallScreen } from './HallScreen';
import { ReportsScreen } from './ReportsScreen';
import { ProfileScreen } from './ProfileScreen';

export const InvigilatorDashboard = ({ user }) => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'exam':
        return <ExamScreen />;
      case 'hall':
        return <HallScreen />;
      case 'reports':
        return <ReportsScreen />;
      case 'profile':
        return <ProfileScreen user={user} />;
      default:
        return (
          <View className="flex-1 justify-center items-center bg-white px-8">
            <Text className="text-2xl font-bold mb-4 text-gray-800">Invigilator Dashboard</Text>
            <Text className="text-lg text-gray-600">Welcome, {user.name}</Text>
            <Text className="text-sm text-gray-500 mb-8">{user.dept} - {user.campus}</Text>
            
            <TouchableOpacity 
              className="bg-red-500 rounded-lg py-3 px-6 mb-20"
              onPress={logout}
            >
              <Text className="text-white font-semibold">Logout</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <>
      {renderScreen()}
      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </>
  );
};