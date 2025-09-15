import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, TextInput, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { courseAPI } from '../utils/api';
import { CustomAlert } from '../components/ui/CustomAlert';

export const CourseScreen = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [filters, setFilters] = useState({ semester: '' });
  const [newCourse, setNewCourse] = useState({
    course_code: '',
    course_name: '',
    course_semester: ''
  });
  const [updateCourse, setUpdateCourse] = useState({});
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', buttons: [] });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await courseAPI.getCourses(filters);
      setCourses(response.courses || []);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCourses();
  };

  const createCourse = async () => {
    if (!newCourse.course_code || !newCourse.course_name) {
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'Please fill all required fields',
        buttons: [{ text: 'OK' }]
      });
      return;
    }
    
    try {
      await courseAPI.createCourse(newCourse);
      setShowCreateModal(false);
      setNewCourse({
        course_code: '',
        course_name: '',
        course_semester: ''
      });
      loadCourses();
      setAlertConfig({
        visible: true,
        title: 'Success',
        message: 'Course created successfully',
        buttons: [{ text: 'OK' }]
      });
    } catch (error) {
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'Failed to create course',
        buttons: [{ text: 'OK' }]
      });
    }
  };

  const updateCourseData = async () => {
    try {
      await courseAPI.updateCourse(selectedCourse.course_code, updateCourse);
      setShowUpdateModal(false);
      setSelectedCourse(null);
      loadCourses();
      setAlertConfig({
        visible: true,
        title: 'Success',
        message: 'Course updated successfully',
        buttons: [{ text: 'OK' }]
      });
    } catch (error) {
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'Failed to update course',
        buttons: [{ text: 'OK' }]
      });
    }
  };

  const deleteCourse = async (courseCode) => {
    try {
      await courseAPI.deleteCourse(courseCode);
      setSelectedCourse(null);
      loadCourses();
      setAlertConfig({
        visible: true,
        title: 'Success',
        message: 'Course deleted successfully',
        buttons: [{ text: 'OK' }]
      });
    } catch (error) {
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'Failed to delete course',
        buttons: [{ text: 'OK' }]
      });
    }
  };

  const applyFilters = () => {
    loadCourses();
  };

  return (
    <ScrollView 
      className="flex-1 bg-white pt-20 px-8"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="flex-row justify-between items-center mb-8">
        <Text className="text-3xl font-bold text-blue-700">Courses</Text>
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
        <Text className="text-blue-600 font-semibold mb-2 text-2xl">All Courses</Text>
        {courses.length > 0 ? (
          courses.map((course, index) => (
            <TouchableOpacity
              key={course.course_code}
              className="bg-white rounded-lg p-4 mb-3 border border-gray-100"
              onPress={() => setSelectedCourse(course)}
            >
              <Text className="text-black font-semibold text-lg">{course.course_code}</Text>
              <Text className="text-gray-600">{course.course_name}</Text>
              <Text className="text-gray-500 text-sm">Semester: {course.course_semester}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <View className="bg-white rounded-lg p-4 border border-gray-100">
            <Text className="text-gray-500 text-center">No courses found</Text>
          </View>
        )}
      </View>

      <Modal visible={selectedCourse !== null && !showUpdateModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-center px-4">
          <View className="bg-white rounded-lg p-6">
            <Text className="text-xl font-bold mb-4">Course Details</Text>
            
            <Text className="text-gray-600 mb-2">Code: {selectedCourse?.course_code}</Text>
            <Text className="text-gray-600 mb-2">Name: {selectedCourse?.course_name}</Text>
            <Text className="text-gray-600 mb-4">Semester: {selectedCourse?.course_semester}</Text>
            
            <View className="flex-row justify-between">
              <TouchableOpacity 
                className="bg-blue-600 px-4 py-2 rounded-lg flex-1 mr-1"
                onPress={() => {
                  setUpdateCourse({
                    course_name: selectedCourse.course_name,
                    course_semester: selectedCourse.course_semester
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
                    title: 'Delete Course',
                    message: 'Are you sure you want to delete this course?',
                    buttons: [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Delete', style: 'destructive', onPress: () => deleteCourse(selectedCourse.course_code) }
                    ]
                  });
                }}
              >
                <Text className="text-white text-center font-medium">Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-gray-300 px-4 py-2 rounded-lg flex-1 ml-1"
                onPress={() => setSelectedCourse(null)}
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
            <Text className="text-xl font-bold mb-4">Create New Course</Text>
            
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Course Code"
              value={newCourse.course_code}
              onChangeText={(text) => setNewCourse({...newCourse, course_code: text})}
            />
            
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Course Name"
              value={newCourse.course_name}
              onChangeText={(text) => setNewCourse({...newCourse, course_name: text})}
            />
            
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Semester"
              value={newCourse.course_semester}
              onChangeText={(text) => setNewCourse({...newCourse, course_semester: text})}
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
                onPress={createCourse}
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
            <Text className="text-xl font-bold mb-4">Update Course</Text>
            
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Course Name"
              value={updateCourse.course_name}
              onChangeText={(text) => setUpdateCourse({...updateCourse, course_name: text})}
            />
            
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Semester"
              value={updateCourse.course_semester}
              onChangeText={(text) => setUpdateCourse({...updateCourse, course_semester: text})}
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
                onPress={updateCourseData}
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