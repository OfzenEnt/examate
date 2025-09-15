import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, TextInput, Modal, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { studentAPI } from '../utils/api';
import { CustomAlert } from '../components/ui/CustomAlert';

export const StudentScreen = () => {
  const [students, setStudents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [filters, setFilters] = useState({ semester: '' });
  const [newStudent, setNewStudent] = useState({
    reg_no: '',
    student_name: '',
    semester: '',
    student_sec: ''
  });
  const [updateStudent, setUpdateStudent] = useState({});
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', buttons: [] });

  useEffect(() => {
    loadStudents();
    
    const backAction = () => {
      if (showCreateModal) {
        setShowCreateModal(false);
        return true;
      }
      if (showUpdateModal) {
        setShowUpdateModal(false);
        return true;
      }
      if (selectedStudent) {
        setSelectedStudent(null);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [showCreateModal, showUpdateModal, selectedStudent]);

  const loadStudents = async () => {
    try {
      const response = await studentAPI.getStudents(filters);
      setStudents(response.students || []);
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStudents();
  };

  const applyFilters = () => {
    loadStudents();
  };

  const createStudent = async () => {
    if (!newStudent.reg_no || !newStudent.student_name || !newStudent.semester) {
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'Please fill all required fields',
        buttons: [{ text: 'OK' }]
      });
      return;
    }
    
    try {
      await studentAPI.createStudent(newStudent);
      setShowCreateModal(false);
      setNewStudent({
        reg_no: '',
        student_name: '',
        semester: '',
        student_sec: ''
      });
      loadStudents();
      setAlertConfig({
        visible: true,
        title: 'Success',
        message: 'Student created successfully',
        buttons: [{ text: 'OK' }]
      });
    } catch (error) {
      const errorMessage = error.response?.error || error.message || 'Failed to create student';
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: errorMessage,
        buttons: [{ text: 'OK' }]
      });
    }
  };

  const updateStudentData = async () => {
    try {
      await studentAPI.updateStudent(selectedStudent.reg_no, updateStudent);
      setShowUpdateModal(false);
      setSelectedStudent(null);
      loadStudents();
      setAlertConfig({
        visible: true,
        title: 'Success',
        message: 'Student updated successfully',
        buttons: [{ text: 'OK' }]
      });
    } catch (error) {
      const errorMessage = error.response?.error || error.message || 'Failed to update student';
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: errorMessage,
        buttons: [{ text: 'OK' }]
      });
    }
  };

  const deleteStudent = async (regNo) => {
    try {
      await studentAPI.deleteStudent(regNo);
      setSelectedStudent(null);
      loadStudents();
      setAlertConfig({
        visible: true,
        title: 'Success',
        message: 'Student deleted successfully',
        buttons: [{ text: 'OK' }]
      });
    } catch (error) {
      const errorMessage = error.response?.error || error.message || 'Failed to delete student';
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: errorMessage,
        buttons: [{ text: 'OK' }]
      });
    }
  };

  return (
    <ScrollView 
      className="flex-1 bg-white pt-20 px-8"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="flex-row justify-between items-center mb-8">
        <Text className="text-3xl font-bold text-blue-700">Students</Text>
        <TouchableOpacity 
          className="bg-blue-600 px-4 py-2 rounded-lg flex-row items-center"
          onPress={() => setShowCreateModal(true)}
        >
          <Icon name="add" size={20} color="white" />
          <Text className="text-white ml-1 font-medium">Create</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
        <Text className="text-lg font-semibold mb-3">Filters</Text>
        <View className="mb-3">
          <Text className="text-gray-600 mb-1">Semester</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3"
            placeholder="Enter semester"
            value={filters.semester}
            onChangeText={(text) => setFilters({...filters, semester: text})}
          />
        </View>
        <TouchableOpacity 
          className="bg-blue-600 px-4 py-2 rounded-lg"
          onPress={applyFilters}
        >
          <Text className="text-white text-center font-medium">Apply Filters</Text>
        </TouchableOpacity>
      </View>
      
      <View>
        <Text className="text-blue-600 font-semibold mb-2 text-2xl">All Students</Text>
        {students.length > 0 ? (
          students.map((student, index) => (
            <TouchableOpacity
              key={student.reg_no}
              className="bg-white rounded-lg p-4 mb-3 border border-gray-100"
              onPress={() => setSelectedStudent(student)}
            >
              <Text className="text-black font-semibold text-lg">{student.student_name}</Text>
              <Text className="text-gray-600">Reg No: {student.reg_no}</Text>
              <Text className="text-gray-500 text-sm">Semester: {student.semester} | Section: {student.student_sec}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <View className="bg-white rounded-lg p-4 border border-gray-100">
            <Text className="text-gray-500 text-center">No students found</Text>
          </View>
        )}
      </View>

      <Modal visible={selectedStudent !== null && !showUpdateModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-center px-4">
          <View className="bg-white rounded-lg p-6">
            <Text className="text-xl font-bold mb-4">Student Details</Text>
            
            <Text className="text-gray-600 mb-2">Registration No: {selectedStudent?.reg_no}</Text>
            <Text className="text-gray-600 mb-2">Name: {selectedStudent?.student_name}</Text>
            <Text className="text-gray-600 mb-2">Semester: {selectedStudent?.semester}</Text>
            <Text className="text-gray-600 mb-4">Section: {selectedStudent?.student_sec}</Text>
            
            <View className="flex-row justify-between">
              <TouchableOpacity 
                className="bg-blue-600 px-4 py-2 rounded-lg flex-1 mr-1"
                onPress={() => {
                  setUpdateStudent({
                    student_name: selectedStudent.student_name,
                    semester: selectedStudent.semester,
                    student_sec: selectedStudent.student_sec
                  });
                  setShowUpdateModal(true);
                }}
              >
                <Text className="text-white text-center font-medium">Update</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-red-600 px-4 py-2 rounded-lg flex-1 mx-1"
                onPress={() => {
                  setAlertConfig({
                    visible: true,
                    title: 'Delete Student',
                    message: 'Are you sure you want to delete this student?',
                    buttons: [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Delete', style: 'destructive', onPress: () => deleteStudent(selectedStudent.reg_no) }
                    ]
                  });
                }}
              >
                <Text className="text-white text-center font-medium">Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-gray-300 px-4 py-2 rounded-lg flex-1 ml-1"
                onPress={() => setSelectedStudent(null)}
              >
                <Text className="text-center font-medium">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showCreateModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-center px-4">
          <View className="bg-white rounded-lg p-6">
            <Text className="text-xl font-bold mb-4">Create New Student</Text>
            
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Registration Number (e.g., 21AI001)"
              placeholderTextColor="#9CA3AF"
              value={newStudent.reg_no}
              onChangeText={(text) => setNewStudent({...newStudent, reg_no: text})}
            />
            
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Student Name (e.g., John Doe)"
              placeholderTextColor="#9CA3AF"
              value={newStudent.student_name}
              onChangeText={(text) => setNewStudent({...newStudent, student_name: text})}
            />
            
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Semester (e.g., 5)"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={newStudent.semester}
              onChangeText={(text) => setNewStudent({...newStudent, semester: text})}
            />
            
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Section (e.g., A)"
              placeholderTextColor="#9CA3AF"
              value={newStudent.student_sec}
              onChangeText={(text) => setNewStudent({...newStudent, student_sec: text})}
            />
            
            <View className="flex-row justify-between mt-4">
              <TouchableOpacity 
                className="bg-gray-300 px-4 py-2 rounded-lg flex-1 mr-2"
                onPress={() => setShowCreateModal(false)}
              >
                <Text className="text-center font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-blue-600 px-4 py-2 rounded-lg flex-1 ml-2"
                onPress={createStudent}
              >
                <Text className="text-white text-center font-medium">Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showUpdateModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-center px-4">
          <View className="bg-white rounded-lg p-6">
            <Text className="text-xl font-bold mb-4">Update Student</Text>
            
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Student Name (e.g., John Doe)"
              placeholderTextColor="#9CA3AF"
              value={updateStudent.student_name}
              onChangeText={(text) => setUpdateStudent({...updateStudent, student_name: text})}
            />
            
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Semester (e.g., 5)"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={updateStudent.semester}
              onChangeText={(text) => setUpdateStudent({...updateStudent, semester: text})}
            />
            
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Section (e.g., A)"
              placeholderTextColor="#9CA3AF"
              value={updateStudent.student_sec}
              onChangeText={(text) => setUpdateStudent({...updateStudent, student_sec: text})}
            />
            
            <View className="flex-row justify-between mt-4">
              <TouchableOpacity 
                className="bg-gray-300 px-4 py-2 rounded-lg flex-1 mr-2"
                onPress={() => setShowUpdateModal(false)}
              >
                <Text className="text-center font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-blue-600 px-4 py-2 rounded-lg flex-1 ml-2"
                onPress={updateStudentData}
              >
                <Text className="text-white text-center font-medium">Update</Text>
              </TouchableOpacity>
            </View>
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