import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Modal,
  BackHandler,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { examAPI } from "../utils/api";
import { ExamCard } from "../components/ui/ExamCard";
import { CustomAlert } from "../components/ui/CustomAlert";
import { useDashboard } from "../contexts/DashboardContext";
import { ExamDetailsScreen } from "./ExamDetailsScreen";

export const ExamScreen = () => {
  const { dashboardData, refreshExams } = useDashboard();
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [newExam, setNewExam] = useState({
    course_code: "",
    exam_date: "",
    exam_type: "1",
    exam_slot: "0",
    start_time: "10:30",
    end_time: "12:00",
  });
  const [updateExam, setUpdateExam] = useState({});
  const [courseSearch, setCourseSearch] = useState('');
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', buttons: [] });
  const [showExamDetails, setShowExamDetails] = useState(false);
  const [selectedExamForDetails, setSelectedExamForDetails] = useState(null);

  useEffect(() => {
    const backAction = () => {
      if (showExamDetails) {
        setShowExamDetails(false);
        setSelectedExamForDetails(null);
        return true;
      }
      if (showCreateModal) {
        setShowCreateModal(false);
        return true;
      }
      if (showUpdateModal) {
        setShowUpdateModal(false);
        return true;
      }
      if (selectedExam) {
        setSelectedExam(null);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [showExamDetails, showCreateModal, showUpdateModal, selectedExam]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshExams();
    setRefreshing(false);
  };

  const createExam = async () => {
    if (!newExam.course_code || !newExam.exam_date) {
      setAlertConfig({
        visible: true,
        title: "Error",
        message: "Please fill all required fields",
        buttons: [{ text: "OK" }]
      });
      return;
    }

    try {
      await examAPI.createExam(newExam);
      setShowCreateModal(false);
      setNewExam({
        course_code: "",
        exam_date: "",
        exam_type: "1",
        exam_slot: "0",
        start_time: "10:30",
        end_time: "12:00",
      });
      refreshExams();
      setAlertConfig({
        visible: true,
        title: "Success",
        message: "Exam created successfully",
        buttons: [{ text: "OK" }]
      });
    } catch (error) {
      setAlertConfig({
        visible: true,
        title: "Error",
        message: "Failed to create exam",
        buttons: [{ text: "OK" }]
      });
    }
  };

  const updateExamData = async () => {
    if (!updateExam.course_code || !updateExam.exam_date) {
      setAlertConfig({
        visible: true,
        title: "Error",
        message: "Please fill all required fields",
        buttons: [{ text: "OK" }]
      });
      return;
    }

    try {
      await examAPI.updateExam(selectedExam.course_code, updateExam);
      setShowUpdateModal(false);
      setSelectedExam(null);
      refreshExams();
      setAlertConfig({
        visible: true,
        title: "Success",
        message: "Exam updated successfully",
        buttons: [{ text: "OK" }]
      });
    } catch (error) {
      console.error("Failed to update exam:", error);
      setAlertConfig({
        visible: true,
        title: "Error",
        message: error.message || "Failed to update exam",
        buttons: [{ text: "OK" }]
      });
    }
  };

  const deleteExam = async (examId) => {
    try {
      await examAPI.deleteExam(examId);
      setSelectedExam(null);
      refreshExams();
      setAlertConfig({
        visible: true,
        title: "Success",
        message: "Exam deleted successfully",
        buttons: [{ text: "OK" }]
      });
    } catch (error) {
      setAlertConfig({
        visible: true,
        title: "Error",
        message: "Failed to delete exam",
        buttons: [{ text: "OK" }]
      });
    }
  };

  const getIndianDate = () => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istTime = new Date(now.getTime() + istOffset);
    return istTime.toISOString().split('T')[0];
  };

  const getCurrentIndianTime = () => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + istOffset);
    return istTime.toTimeString().split(' ')[0].substring(0, 5); // HH:MM format
  };

  const isExamOngoing = (exam) => {
    if (exam.exam_date !== getIndianDate()) return false;
    const currentTime = getCurrentIndianTime();
    return currentTime >= exam.start_time && currentTime <= exam.end_time;
  };

  const isToday = (dateString) => {
    return dateString === getIndianDate();
  };

  const currentExams = dashboardData.exams.filter((exam) => isToday(exam.exam_date));
  const upcomingExams = dashboardData.exams.filter(
    (exam) => exam.exam_date > getIndianDate()
  );

  const handleExamCardPress = (exam) => {
    setSelectedExamForDetails(exam);
    setShowExamDetails(true);
  };

  if (showExamDetails && selectedExamForDetails) {
    return (
      <ExamDetailsScreen 
        exam={selectedExamForDetails} 
        onBack={() => {
          setShowExamDetails(false);
          setSelectedExamForDetails(null);
        }}
      />
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white pt-20 px-8"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="flex-row justify-between items-center mb-8">
        <Text className="text-3xl font-bold text-blue-700">Exams</Text>
        <TouchableOpacity
          className="bg-blue-600 px-4 py-2 rounded-lg flex-row items-center"
          onPress={() => setShowCreateModal(true)}
        >
          <Icon name="add" size={20} color="white" />
          <Text className="text-white ml-1 font-medium">Create</Text>
        </TouchableOpacity>
      </View>

      <View className="mb-4">
        <Text className="text-blue-600 font-semibold mb-2 text-2xl">
          Current Exams {currentExams.some(exam => isExamOngoing(exam)) && "(Ongoing)"}
        </Text>
        {currentExams.length > 0 ? (
          currentExams.map((exam, index) => (
            <View key={exam.course_code} className="mb-3">
              <ExamCard
                exam={exam}
                onPress={handleExamCardPress}
              />
              <TouchableOpacity 
                className="bg-gray-100 p-2 rounded-b-lg border-t border-gray-200"
                onPress={() => setSelectedExam(exam)}
              >
                <Text className="text-center text-blue-600 font-medium">Manage Exam</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View className="bg-white rounded-lg p-4 border border-gray-100">
            <Text className="text-gray-500 text-center">
              No exams scheduled for today
            </Text>
          </View>
        )}
      </View>

      <View>
        <Text className="text-blue-600 font-semibold mb-2 text-2xl">
          Upcoming Exams
        </Text>
        {upcomingExams.length > 0 ? (
          upcomingExams
            .slice(0, 5)
            .map((exam, index) => (
              <View key={exam.course_code} className="mb-3">
                <ExamCard
                  exam={exam}
                  onPress={handleExamCardPress}
                />
                <TouchableOpacity 
                  className="bg-gray-100 p-2 rounded-b-lg border-t border-gray-200"
                  onPress={() => setSelectedExam(exam)}
                >
                  <Text className="text-center text-blue-600 font-medium">Manage Exam</Text>
                </TouchableOpacity>
              </View>
            ))
        ) : (
          <View className="bg-white rounded-lg p-4 border border-gray-100">
            <Text className="text-gray-500 text-center">No upcoming exams</Text>
          </View>
        )}
      </View>

      <Modal
        visible={selectedExam !== null && !showUpdateModal}
        transparent
        animationType="slide"
      >
        <View className="flex-1 bg-black/50 justify-center px-4">
          <View className="bg-white rounded-lg p-6">
            <Text className="text-xl font-bold mb-4">Exam Details</Text>

            <Text className="text-gray-600 mb-2">
              Course Code: {selectedExam?.course_code}
            </Text>
            <Text className="text-gray-600 mb-2">
              Date: {selectedExam?.exam_date}
            </Text>
            <Text className="text-gray-600 mb-2">
              Type:{" "}
              {selectedExam?.exam_type === "1"
                ? "Sessional-I"
                : selectedExam?.exam_type === "2"
                  ? "Sessional-II"
                  : "Semester"}
            </Text>
            <Text className="text-gray-600 mb-2">
              Time: {selectedExam?.start_time} - {selectedExam?.end_time}
            </Text>
            <Text className="text-gray-600 mb-4">
              Created by: {selectedExam?.created_by}
            </Text>

            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-blue-600 px-4 py-2 rounded-lg flex-1 mr-1"
                onPress={() => {
                  setUpdateExam({
                    course_code: selectedExam.course_code,
                    exam_date: selectedExam.exam_date,
                    exam_type: selectedExam.exam_type,
                    exam_slot: selectedExam.exam_slot,
                    start_time: selectedExam.start_time,
                    end_time: selectedExam.end_time,
                  });
                  setShowUpdateModal(true);
                }}
              >
                <Text className="text-white text-center font-medium">
                  Update
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-red-600 px-4 py-2 rounded-lg flex-1 mx-1"
                onPress={() => {
                  setAlertConfig({
                    visible: true,
                    title: "Delete Exam",
                    message: "Are you sure you want to delete this exam?",
                    buttons: [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: () => deleteExam(selectedExam.course_code),
                      },
                    ]
                  });
                }}
              >
                <Text className="text-white text-center font-medium">
                  Delete
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-gray-300 px-4 py-2 rounded-lg flex-1 ml-1"
                onPress={() => {
                  setSelectedExam(null);
                  setShowUpdateModal(false);
                }}
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
            <Text className="text-xl font-bold mb-4">Create New Exam</Text>

            <View className="border border-gray-300 rounded-lg p-3 mb-3">
              <Text className="text-gray-600 mb-2">Course Code</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-2 mb-2"
                placeholder="Search courses..."
                value={courseSearch}
                onChangeText={setCourseSearch}
              />
              <ScrollView style={{ maxHeight: 128 }} nestedScrollEnabled={true}>
                {dashboardData.courses
                  .filter(course => 
                    course.course_code.toLowerCase().includes(courseSearch.toLowerCase()) ||
                    course.course_name.toLowerCase().includes(courseSearch.toLowerCase())
                  )
                  .map((course) => (
                    <TouchableOpacity
                      key={course.course_code}
                      className={`p-2 rounded mb-1 ${newExam.course_code === course.course_code ? 'bg-blue-600' : 'bg-gray-100'}`}
                      onPress={() => {
                        setNewExam({...newExam, course_code: course.course_code});
                        setCourseSearch('');
                      }}
                    >
                      <Text className={newExam.course_code === course.course_code ? 'text-white text-sm' : 'text-gray-700 text-sm'}>
                        {course.course_code} - {course.course_name}
                      </Text>
                    </TouchableOpacity>
                  ))
                }
              </ScrollView>
              {newExam.course_code && (
                <Text className="text-blue-600 text-sm mt-2">Selected: {newExam.course_code}</Text>
              )}
            </View>

            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Exam Date (YYYY-MM-DD)"
              placeholderTextColor="#9CA3AF"
              value={newExam.exam_date}
              onChangeText={(text) =>
                setNewExam({ ...newExam, exam_date: text })
              }
            />

            <View className="border border-gray-300 rounded-lg p-3 mb-3">
              <Text className="text-gray-600 mb-2">Exam Type</Text>
              <View className="flex-row">
                {[
                  { id: "1", label: "Sessional-I" },
                  { id: "2", label: "Sessional-II" },
                  { id: "3", label: "Semester" },
                ].map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    className={`px-3 py-1 rounded mr-2 ${newExam.exam_type === type.id ? "bg-blue-600" : "bg-gray-200"}`}
                    onPress={() =>
                      setNewExam({ ...newExam, exam_type: type.id })
                    }
                  >
                    <Text
                      className={
                        newExam.exam_type === type.id
                          ? "text-white"
                          : "text-gray-700"
                      }
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="border border-gray-300 rounded-lg p-3 mb-3">
              <Text className="text-gray-600 mb-2">Exam Slot</Text>
              <View className="flex-row">
                <TouchableOpacity
                  className={`px-3 py-1 rounded mr-2 ${newExam.exam_slot === "0" ? "bg-blue-600" : "bg-gray-200"}`}
                  onPress={() =>
                    setNewExam({
                      ...newExam,
                      exam_slot: "0",
                      start_time: "10:30",
                      end_time: "12:00",
                    })
                  }
                >
                  <Text
                    className={
                      newExam.exam_slot === "0" ? "text-white" : "text-gray-700"
                    }
                  >
                    Morning (FN)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`px-3 py-1 rounded ${newExam.exam_slot === "1" ? "bg-blue-600" : "bg-gray-200"}`}
                  onPress={() =>
                    setNewExam({
                      ...newExam,
                      exam_slot: "1",
                      start_time: "14:00",
                      end_time: "15:30",
                    })
                  }
                >
                  <Text
                    className={
                      newExam.exam_slot === "1" ? "text-white" : "text-gray-700"
                    }
                  >
                    Afternoon (AN)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row mb-3">
              <TextInput
                className="border border-gray-300 rounded-lg p-3 flex-1 mr-2"
                placeholder="Start Time"
                placeholderTextColor="#9CA3AF"
                value={newExam.start_time}
                onChangeText={(text) =>
                  setNewExam({ ...newExam, start_time: text })
                }
              />
              <TextInput
                className="border border-gray-300 rounded-lg p-3 flex-1 ml-2"
                placeholder="End Time"
                placeholderTextColor="#9CA3AF"
                value={newExam.end_time}
                onChangeText={(text) =>
                  setNewExam({ ...newExam, end_time: text })
                }
              />
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
                onPress={createExam}
              >
                <Text className="text-white text-center font-medium">
                  Create
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showUpdateModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-center px-4">
          <View className="bg-white rounded-lg p-6">
            <Text className="text-xl font-bold mb-4">Update Exam</Text>

            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Course Code"
              placeholderTextColor="#9CA3AF"
              value={updateExam.course_code}
              onChangeText={(text) =>
                setUpdateExam({ ...updateExam, course_code: text })
              }
            />

            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Exam Date (YYYY-MM-DD)"
              placeholderTextColor="#9CA3AF"
              value={updateExam.exam_date}
              onChangeText={(text) =>
                setUpdateExam({ ...updateExam, exam_date: text })
              }
            />

            <View className="border border-gray-300 rounded-lg p-3 mb-3">
              <Text className="text-gray-600 mb-2">Exam Type</Text>
              <View className="flex-row">
                {[
                  { id: "1", label: "Sessional-I" },
                  { id: "2", label: "Sessional-II" },
                  { id: "3", label: "Semester" },
                ].map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    className={`px-3 py-1 rounded mr-2 ${updateExam.exam_type === type.id ? "bg-blue-600" : "bg-gray-200"}`}
                    onPress={() =>
                      setUpdateExam({ ...updateExam, exam_type: type.id })
                    }
                  >
                    <Text
                      className={
                        updateExam.exam_type === type.id
                          ? "text-white"
                          : "text-gray-700"
                      }
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="border border-gray-300 rounded-lg p-3 mb-3">
              <Text className="text-gray-600 mb-2">Exam Slot</Text>
              <View className="flex-row">
                <TouchableOpacity
                  className={`px-3 py-1 rounded mr-2 ${updateExam.exam_slot === "0" ? "bg-blue-600" : "bg-gray-200"}`}
                  onPress={() =>
                    setUpdateExam({ ...updateExam, exam_slot: "0" })
                  }
                >
                  <Text
                    className={
                      updateExam.exam_slot === "0"
                        ? "text-white"
                        : "text-gray-700"
                    }
                  >
                    Morning (FN)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`px-3 py-1 rounded ${updateExam.exam_slot === "1" ? "bg-blue-600" : "bg-gray-200"}`}
                  onPress={() =>
                    setUpdateExam({ ...updateExam, exam_slot: "1" })
                  }
                >
                  <Text
                    className={
                      updateExam.exam_slot === "1"
                        ? "text-white"
                        : "text-gray-700"
                    }
                  >
                    Afternoon (AN)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row mb-3">
              <TextInput
                className="border border-gray-300 rounded-lg p-3 flex-1 mr-2"
                placeholder="Start Time"
                placeholderTextColor="#9CA3AF"
                value={updateExam.start_time}
                onChangeText={(text) =>
                  setUpdateExam({ ...updateExam, start_time: text })
                }
              />
              <TextInput
                className="border border-gray-300 rounded-lg p-3 flex-1 ml-2"
                placeholder="End Time"
                placeholderTextColor="#9CA3AF"
                value={updateExam.end_time}
                onChangeText={(text) =>
                  setUpdateExam({ ...updateExam, end_time: text })
                }
              />
            </View>

            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                className="bg-gray-300 px-4 py-2 rounded-lg flex-1 mr-2"
                onPress={() => {
                  setShowUpdateModal(false);
                }}
              >
                <Text className="text-center font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-600 px-4 py-2 rounded-lg flex-1 ml-2"
                onPress={updateExamData}
              >
                <Text className="text-white text-center font-medium">
                  Update
                </Text>
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