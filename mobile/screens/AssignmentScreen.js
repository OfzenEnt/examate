import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDashboard } from '../contexts/DashboardContext';
import { CustomAlert } from '../components/ui/CustomAlert';
import { ExamCard } from '../components/ui/ExamCard';

export const AssignmentScreen = () => {
  const { dashboardData } = useDashboard();
  const [selectedExam, setSelectedExam] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', buttons: [] });

  const handleExamSelect = (exam) => {
    setSelectedExam(exam);
    setShowAssignmentModal(true);
  };

  const handleSeatingArrangement = () => {
    setShowAssignmentModal(false);
    setAlertConfig({
      visible: true,
      title: 'Seating Arrangement',
      message: 'Starting automatic seating arrangement...',
      buttons: [{ text: 'OK' }]
    });
  };

  const handleInvigilatorAssignment = () => {
    setShowAssignmentModal(false);
    setAlertConfig({
      visible: true,
      title: 'Invigilator Assignment',
      message: 'Starting invigilator assignment...',
      buttons: [{ text: 'OK' }]
    });
  };

  return (
    <ScrollView className="flex-1 bg-white pt-20 px-8">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-blue-700">Exam Assignment</Text>
        <Text className="text-gray-500 mt-2">Select an exam to manage assignments</Text>
      </View>
      
      <View>
        <Text className="text-blue-600 font-semibold mb-2 text-2xl">Available Exams</Text>
        {dashboardData.exams.length > 0 ? (
          dashboardData.exams.map((exam, index) => (
            <ExamCard 
              key={exam.course_code} 
              exam={exam} 
              onPress={handleExamSelect}
            />
          ))
        ) : (
          <View className="bg-white rounded-lg p-4 border border-gray-100">
            <Text className="text-gray-500 text-center">No exams available</Text>
          </View>
        )}
      </View>

      <Modal visible={showAssignmentModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-center px-4">
          <View className="bg-white rounded-lg p-6">
            <Text className="text-xl font-bold mb-4">Assignment Options</Text>
            <Text className="text-gray-600 mb-6">
              Exam: {selectedExam?.course_code} - {selectedExam?.exam_date}
            </Text>
            
            <TouchableOpacity 
              className="bg-blue-600 p-4 rounded-lg mb-3 flex-row items-center"
              onPress={handleSeatingArrangement}
            >
              <Icon name="event-seat" size={24} color="white" />
              <View className="ml-3 flex-1">
                <Text className="text-white font-semibold text-lg">Seating Arrangement</Text>
                <Text className="text-blue-100 text-sm">Auto-allocate halls based on student count</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              className="bg-green-600 p-4 rounded-lg mb-6 flex-row items-center"
              onPress={handleInvigilatorAssignment}
            >
              <Icon name="supervisor-account" size={24} color="white" />
              <View className="ml-3 flex-1">
                <Text className="text-white font-semibold text-lg">Invigilator Assignment</Text>
                <Text className="text-green-100 text-sm">Assign faculty to examination halls</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-gray-300 px-4 py-2 rounded-lg"
              onPress={() => setShowAssignmentModal(false)}
            >
              <Text className="text-center font-medium">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
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