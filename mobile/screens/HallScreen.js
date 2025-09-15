import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, TextInput, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { roomAPI } from '../utils/api';
import { CustomAlert } from '../components/ui/CustomAlert';
import { useDashboard } from '../contexts/DashboardContext';

export const HallScreen = () => {
  const { dashboardData, refreshRooms } = useDashboard();
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newRoom, setNewRoom] = useState({
    room_id: '',
    room_type: 'Classroom',
    block_alias: '',
    n_rows: '6',
    n_columns: '9'
  });
  const [updateRoom, setUpdateRoom] = useState({});
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', buttons: [] });

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshRooms();
    setRefreshing(false);
  };

  const createRoom = async () => {
    if (!newRoom.room_id || !newRoom.block_alias) {
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'Please fill all required fields',
        buttons: [{ text: 'OK' }]
      });
      return;
    }
    
    try {
      await roomAPI.createRoom(newRoom);
      setShowCreateModal(false);
      setNewRoom({
        room_id: '',
        room_type: 'Classroom',
        block_alias: '',
        n_rows: '6',
        n_columns: '9'
      });
      refreshRooms();
      setAlertConfig({
        visible: true,
        title: 'Success',
        message: 'Room created successfully',
        buttons: [{ text: 'OK' }]
      });
    } catch (error) {
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'Failed to create room',
        buttons: [{ text: 'OK' }]
      });
    }
  };

  const updateRoomData = async () => {
    try {
      await roomAPI.updateRoom(selectedRoom.room_id, updateRoom);
      setShowUpdateModal(false);
      setSelectedRoom(null);
      refreshRooms();
      setAlertConfig({
        visible: true,
        title: 'Success',
        message: 'Room updated successfully',
        buttons: [{ text: 'OK' }]
      });
    } catch (error) {
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'Failed to update room',
        buttons: [{ text: 'OK' }]
      });
    }
  };

  const deleteRoom = async (roomId) => {
    try {
      await roomAPI.deleteRoom(roomId);
      setSelectedRoom(null);
      refreshRooms();
      setAlertConfig({
        visible: true,
        title: 'Success',
        message: 'Room deleted successfully',
        buttons: [{ text: 'OK' }]
      });
    } catch (error) {
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'Failed to delete room',
        buttons: [{ text: 'OK' }]
      });
    }
  };

  const getRoomStatusText = (status) => {
    return status === 0 ? 'Available' : 'Occupied';
  };

  const getRoomStatusColor = (status) => {
    return status === 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <ScrollView 
      className="flex-1 bg-white pt-20 px-8"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="flex-row justify-between items-center mb-8">
        <Text className="text-3xl font-bold text-blue-700">Halls</Text>
        <TouchableOpacity 
          className="bg-blue-600 px-4 py-2 rounded-lg flex-row items-center"
          onPress={() => setShowCreateModal(true)}
        >
          <Icon name="add" size={20} color="white" />
          <Text className="text-white ml-1 font-medium">Create</Text>
        </TouchableOpacity>
      </View>
      
      <View>
        <Text className="text-blue-600 font-semibold mb-2 text-2xl">All Rooms</Text>
        {dashboardData.rooms.length > 0 ? (
          dashboardData.rooms.map((room, index) => (
            <TouchableOpacity
              key={room.room_id}
              className="bg-white rounded-lg p-4 mb-3 border border-gray-100"
              onPress={() => setSelectedRoom(room)}
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-black font-semibold text-lg">Room {room.room_id}</Text>
                  <Text className="text-gray-600">Block: {room.block_alias}</Text>
                  <Text className="text-gray-500 text-sm">Type: {room.room_type}</Text>
                </View>
                <View className="items-end">
                  <Text className={`font-medium ${getRoomStatusColor(room.room_status)}`}>
                    {getRoomStatusText(room.room_status)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="bg-white rounded-lg p-4 border border-gray-100">
            <Text className="text-gray-500 text-center">No rooms found</Text>
            <Text className="text-gray-400 text-xs text-center mt-1">
              Rooms count: {dashboardData.rooms.length}
            </Text>
          </View>
        )}
      </View>

      <Modal visible={selectedRoom !== null && !showUpdateModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-center px-4">
          <View className="bg-white rounded-lg p-6">
            <Text className="text-xl font-bold mb-4">Room Details</Text>
            
            <Text className="text-gray-600 mb-2">Room ID: {selectedRoom?.room_id}</Text>
            <Text className="text-gray-600 mb-2">Block: {selectedRoom?.block_alias}</Text>
            <Text className="text-gray-600 mb-2">Type: {selectedRoom?.room_type}</Text>
            <Text className={`mb-4 font-medium ${getRoomStatusColor(selectedRoom?.room_status)}`}>
              Status: {getRoomStatusText(selectedRoom?.room_status)}
            </Text>
            
            <View className="flex-row justify-between">
              <TouchableOpacity 
                className="bg-blue-600 px-4 py-2 rounded-lg flex-1 mr-1"
                onPress={() => {
                  setUpdateRoom({
                    room_type: selectedRoom.room_type,
                    block_alias: selectedRoom.block_alias,
                    room_status: selectedRoom.room_status,
                    n_rows: selectedRoom.n_rows,
                    n_columns: selectedRoom.n_columns
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
                    title: 'Delete Room',
                    message: 'Are you sure you want to delete this room?',
                    buttons: [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Delete', style: 'destructive', onPress: () => deleteRoom(selectedRoom.room_id) }
                    ]
                  });
                }}
              >
                <Text className="text-white text-center font-medium">Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-gray-300 px-4 py-2 rounded-lg flex-1 ml-1"
                onPress={() => setSelectedRoom(null)}
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
            <Text className="text-xl font-bold mb-4">Create New Room</Text>
            
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Room ID"
              value={newRoom.room_id}
              onChangeText={(text) => setNewRoom({...newRoom, room_id: text})}
            />
            
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Block Alias"
              value={newRoom.block_alias}
              onChangeText={(text) => setNewRoom({...newRoom, block_alias: text})}
            />
            
            <View className="border border-gray-300 rounded-lg p-3 mb-3">
              <Text className="text-gray-600 mb-2">Room Type</Text>
              <View className="flex-row flex-wrap">
                {['Classroom', 'Lab', 'Auditorium', 'Seminar Hall'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    className={`px-3 py-1 rounded mr-2 mb-2 ${newRoom.room_type === type ? 'bg-blue-600' : 'bg-gray-200'}`}
                    onPress={() => setNewRoom({...newRoom, room_type: type})}
                  >
                    <Text className={newRoom.room_type === type ? 'text-white text-sm' : 'text-gray-700 text-sm'}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View className="flex-row justify-between mt-4">
              <TouchableOpacity 
                className="bg-gray-300 px-4 py-2 rounded-lg flex-1 mr-2"
                onPress={() => setShowCreateModal(false)}
              >
                <Text className="text-center font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-blue-600 px-4 py-2 rounded-lg flex-1 ml-2"
                onPress={createRoom}
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
            <Text className="text-xl font-bold mb-4">Update Room</Text>
            
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Block Alias"
              value={updateRoom.block_alias}
              onChangeText={(text) => setUpdateRoom({...updateRoom, block_alias: text})}
            />
            
            <View className="border border-gray-300 rounded-lg p-3 mb-3">
              <Text className="text-gray-600 mb-2">Room Type</Text>
              <View className="flex-row flex-wrap">
                {['Classroom', 'Lab', 'Auditorium', 'Seminar Hall'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    className={`px-3 py-1 rounded mr-2 mb-2 ${updateRoom.room_type === type ? 'bg-blue-600' : 'bg-gray-200'}`}
                    onPress={() => setUpdateRoom({...updateRoom, room_type: type})}
                  >
                    <Text className={updateRoom.room_type === type ? 'text-white text-sm' : 'text-gray-700 text-sm'}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="border border-gray-300 rounded-lg p-3 mb-3">
              <Text className="text-gray-600 mb-2">Room Status</Text>
              <View className="flex-row">
                <TouchableOpacity
                  className={`px-3 py-1 rounded mr-2 ${updateRoom.room_status === 0 ? 'bg-green-600' : 'bg-gray-200'}`}
                  onPress={() => setUpdateRoom({...updateRoom, room_status: 0})}
                >
                  <Text className={updateRoom.room_status === 0 ? 'text-white' : 'text-gray-700'}>Available</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`px-3 py-1 rounded ${updateRoom.room_status === 1 ? 'bg-red-600' : 'bg-gray-200'}`}
                  onPress={() => setUpdateRoom({...updateRoom, room_status: 1})}
                >
                  <Text className={updateRoom.room_status === 1 ? 'text-white' : 'text-gray-700'}>Occupied</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View className="flex-row justify-between mt-4">
              <TouchableOpacity 
                className="bg-gray-300 px-4 py-2 rounded-lg flex-1 mr-2"
                onPress={() => setShowUpdateModal(false)}
              >
                <Text className="text-center font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-blue-600 px-4 py-2 rounded-lg flex-1 ml-2"
                onPress={updateRoomData}
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