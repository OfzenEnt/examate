import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, TextInput, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { facultyAPI } from '../utils/api';
import { CustomAlert } from '../components/ui/CustomAlert';

export const FacultyScreen = () => {
  const [faculty, setFaculty] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newFaculty, setNewFaculty] = useState({
    emp_id: '',
    faculty_name: '',
    faculty_email: '',
    faculty_phone: ''
  });
  const [updateFaculty, setUpdateFaculty] = useState({});
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', buttons: [] });

  useEffect(() => {
    loadFaculty();
  }, []);

  const loadFaculty = async () => {
    try {
      const response = await facultyAPI.getFaculty();
      setFaculty(response.faculty || []);
    } catch (error) {
      console.error('Failed to load faculty:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFaculty();
  };

  const createFaculty = async () => {
    if (!newFaculty.emp_id || !newFaculty.faculty_name || !newFaculty.faculty_email) {
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'Please fill all required fields',
        buttons: [{ text: 'OK' }]
      });
      return;
    }
    
    try {
      await facultyAPI.createFaculty(newFaculty);
      setShowCreateModal(false);
      setNewFaculty({
        emp_id: '',
        faculty_name: '',
        faculty_email: '',
        faculty_phone: ''
      });
      loadFaculty();
      setAlertConfig({
        visible: true,
        title: 'Success',
        message: 'Faculty created successfully',
        buttons: [{ text: 'OK' }]
      });
    } catch (error) {
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'Failed to create faculty',
        buttons: [{ text: 'OK' }]
      });
    }
  };

  const updateFacultyData = async () => {
    try {
      await facultyAPI.updateFaculty(selectedFaculty.emp_id, updateFaculty);
      setShowUpdateModal(false);
      setSelectedFaculty(null);
      loadFaculty();
      setAlertConfig({
        visible: true,
        title: 'Success',
        message: 'Faculty updated successfully',
        buttons: [{ text: 'OK' }]
      });
    } catch (error) {
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'Failed to update faculty',
        buttons: [{ text: 'OK' }]
      });
    }
  };

  const deleteFaculty = async (empId) => {
    try {
      await facultyAPI.deleteFaculty(empId);
      setSelectedFaculty(null);
      loadFaculty();
      setAlertConfig({
        visible: true,
        title: 'Success',
        message: 'Faculty deleted successfully',
        buttons: [{ text: 'OK' }]
      });
    } catch (error) {
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'Failed to delete faculty',
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
        <Text className="text-3xl font-bold text-blue-700">Faculty</Text>
        <TouchableOpacity 
          className="bg-blue-600 px-4 py-2 rounded-lg flex-row items-center"
          onPress={() => setShowCreateModal(true)}
        >
          <Icon name="add" size={20} color="white" />
          <Text className="text-white ml-1 font-medium">Create</Text>
        </TouchableOpacity>
      </View>
      
      <View>
        <Text className="text-blue-600 font-semibold mb-2 text-2xl">All Faculty</Text>
        {faculty.length > 0 ? (
          faculty.map((member, index) => (
            <TouchableOpacity
              key={member.emp_id}
              className="bg-white rounded-lg p-4 mb-3 border border-gray-100"
              onPress={() => setSelectedFaculty(member)}
            >
              <Text className="text-black font-semibold text-lg">{member.faculty_name}</Text>
              <Text className="text-gray-600">ID: {member.emp_id}</Text>
              <Text className="text-gray-500 text-sm">{member.faculty_email}</Text>
              {member.faculty_phone && (
                <Text className="text-gray-500 text-sm">{member.faculty_phone}</Text>
              )}
            </TouchableOpacity>
          ))
        ) : (
          <View className="bg-white rounded-lg p-4 border border-gray-100">
            <Text className="text-gray-500 text-center">No faculty found</Text>
          </View>
        )}
      </View>

      <Modal visible={selectedFaculty !== null && !showUpdateModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-center px-4">
          <View className="bg-white rounded-lg p-6">
            <Text className="text-xl font-bold mb-4">Faculty Details</Text>
            
            <Text className="text-gray-600 mb-2">Employee ID: {selectedFaculty?.emp_id}</Text>
            <Text className="text-gray-600 mb-2">Name: {selectedFaculty?.faculty_name}</Text>
            <Text className="text-gray-600 mb-2">Email: {selectedFaculty?.faculty_email}</Text>
            <Text className="text-gray-600 mb-4">Phone: {selectedFaculty?.faculty_phone || 'N/A'}</Text>
            
            <View className="flex-row justify-between">
              <TouchableOpacity 
                className="bg-blue-600 px-4 py-2 rounded-lg flex-1 mr-1"
                onPress={() => {
                  setUpdateFaculty({
                    faculty_name: selectedFaculty.faculty_name,
                    faculty_email: selectedFaculty.faculty_email,
                    faculty_phone: selectedFaculty.faculty_phone
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
                    title: 'Delete Faculty',
                    message: 'Are you sure you want to delete this faculty member?',
                    buttons: [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Delete', style: 'destructive', onPress: () => deleteFaculty(selectedFaculty.emp_id) }
                    ]
                  });
                }}
              >
                <Text className="text-white text-center font-medium">Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-gray-300 px-4 py-2 rounded-lg flex-1 ml-1"
                onPress={() => setSelectedFaculty(null)}
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
            <Text className="text-xl font-bold mb-4">Create New Faculty</Text>
            
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Employee ID"
              value={newFaculty.emp_id}
              onChangeText={(text) => setNewFaculty({...newFaculty, emp_id: text})}
            />
            
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Faculty Name"
              value={newFaculty.faculty_name}
              onChangeText={(text) => setNewFaculty({...newFaculty, faculty_name: text})}
            />
            
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Email"
              keyboardType="email-address"
              value={newFaculty.faculty_email}
              onChangeText={(text) => setNewFaculty({...newFaculty, faculty_email: text})}
            />
            
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Phone (Optional)"
              keyboardType="phone-pad"
              value={newFaculty.faculty_phone}
              onChangeText={(text) => setNewFaculty({...newFaculty, faculty_phone: text})}
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
                onPress={createFaculty}
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
            <Text className="text-xl font-bold mb-4">Update Faculty</Text>
            
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Faculty Name"
              value={updateFaculty.faculty_name}
              onChangeText={(text) => setUpdateFaculty({...updateFaculty, faculty_name: text})}
            />
            
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Email"
              keyboardType="email-address"
              value={updateFaculty.faculty_email}
              onChangeText={(text) => setUpdateFaculty({...updateFaculty, faculty_email: text})}
            />
            
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Phone"
              keyboardType="phone-pad"
              value={updateFaculty.faculty_phone}
              onChangeText={(text) => setUpdateFaculty({...updateFaculty, faculty_phone: text})}
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
                onPress={updateFacultyData}
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