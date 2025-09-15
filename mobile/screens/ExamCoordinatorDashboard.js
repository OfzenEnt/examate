import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useDashboard } from "../contexts/DashboardContext";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { BottomNavBar } from "../components/ui/BottomNavBar";
import { ExamScreen } from "./ExamScreen";
import { HallScreen } from "./HallScreen";
import { ReportsScreen } from "./ReportsScreen";
import { ProfileScreen } from "./ProfileScreen";
import { CourseScreen } from "./CourseScreen";
import { FacultyScreen } from "./FacultyScreen";
import { StudentScreen } from "./StudentScreen";

import { ExamCard } from "../components/ui/ExamCard";
import { InvigilatorDashboard } from "./InvigilatorDashboard";

export const ExamCoordinatorDashboard = ({ user, onNavigateToAttendance }) => {
  const { logout } = useAuth();
  const { dashboardData, loading, refreshDashboard } = useDashboard();
  const [activeTab, setActiveTab] = useState("home");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const backAction = () => {
      if (activeTab === "home") {
        return false; // Allow app to close
      } else {
        setActiveTab("home");
        return true; // Navigate to home tab
      }
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [activeTab]);

  const quickActions = [
    {
      label: "Exam Management",
      icon: "assignment",
      color: "bg-purple-100 ",
      itemscolor: "#8440CF",
    },
    {
      label: "Course Management",
      icon: "book",
      color: "bg-green-100",
      itemscolor: "#059669",
    },
    {
      label: "Faculty Management",
      icon: "person",
      color: "bg-orange-100",
      itemscolor: "#EA580C",
    },
    {
      label: "Student Management",
      icon: "school",
      color: "bg-blue-100 ",
      itemscolor: "#0B5895",
    },
    {
      label: "My Invigilations",
      icon: "visibility",
      color: "bg-indigo-100",
      itemscolor: "#4F46E5",
    },
    {
      label: "Reports",
      icon: "bar-chart",
      color: "bg-emerald-100",
      itemscolor: "#0D9488",
    },
    {
      label: "Hall Management",
      icon: "business",
      color: "bg-yellow-100",
      itemscolor: "#D97706",
    },

    {
      label: "More",
      icon: "more-horiz",
      color: "bg-gray-200",
      itemscolor: "#8440CF",
    },
  ];

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case "exam":
        return <ExamScreen />;
      case "course":
        return <CourseScreen />;
      case "faculty":
        return <FacultyScreen />;
      case "student":
        return <StudentScreen />;

      case "hall":
        return <HallScreen />;
      case "reports":
        return <ReportsScreen />;
      case "invigilator":
        return <InvigilatorDashboard user={user} />;
      case "profile":
        return <ProfileScreen user={user} />;
      default:
        return (
          <ScrollView
            className="bg-white flex-1 pt-6 p-1"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={async () => {
                  setRefreshing(true);
                  await refreshDashboard();
                  setRefreshing(false);
                }}
                colors={['#1D4ED8']}
                tintColor="#1D4ED8"
                progressBackgroundColor="#ffffff"
              />
            }
          >
            <View className="flex-row items-center justify-between p-4 mt-10 ">
              <View className="flex-row items-center gap-2">
                <Image
                  source={require("../assets/prof_avatar.png")}
                  className="w-16 h-16 rounded-full"
                />
                <View>
                  <Text className="text-blue-600 font-semibold text-2xl">
                    Hi {user?.name || "Coordinator"}!
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    Streamline Your Entire Examination Process
                  </Text>
                </View>
              </View>
              <View className="relative">
                <Icon name="notifications" size={24} color="#f59e0b" />
                <View className="absolute top-[-4px] right-[-4px] bg-red-500 rounded-full w-4 h-4 items-center justify-center">
                  <Text className="text-white text-xs">1</Text>
                </View>
              </View>
            </View>

            <View className="flex-row justify-between p-4">
              <View className="flex-1 bg-white border border-gray-200 rounded-2xl p-4 mr-2">
                <View className="flex-row items-center gap-5 mb-2">
                  <Icon
                    name="assignment"
                    size={25}
                    color={"#8440CF"}
                    className="bg-[#FAF4FC] p-2 rounded-full"
                  />
                  <Text className="text-3xl font-bold">
                    {dashboardData.totalExams}
                  </Text>
                </View>
                <Text className="text-gray-500 mt-1 text-lg">
                  Total Active Exams
                </Text>
              </View>
              <View className="flex-1 bg-white border border-gray-200 rounded-lg p-4 ml-2">
                <View className="flex-row items-center gap-2 mb-2">
                  <Icon
                    name="apartment"
                    size={25}
                    color={"#458881"}
                    className="bg-[#EDF5FC] p-2 rounded-full"
                  />
                  <Text className=" text-3xl font-bold">
                    {dashboardData.availableHalls}
                  </Text>
                  <Text className="text-gray-500 mt-1 text-">
                    Available halls{" "}
                  </Text>
                </View>
                <Text className="text-gray-400 text-">
                  Ready for upcoming allocation
                </Text>
              </View>
            </View>

            <View className="p-4">
              <Text className="text-blue-600 font-semibold mb-2 text-2xl">
                Quick Action
              </Text>
              <View className="flex-row flex-wrap justify-between p-2">
                {quickActions.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    className="w-[30%] bg-white p-3 rounded-xl items-center mb-4 border border-gray-200 "
                    onPress={() => {
                      if (item.label === "Exam Management") {
                        setActiveTab("exam");
                      } else if (item.label === "Course Management") {
                        setActiveTab("course");
                      } else if (item.label === "Hall Management") {
                        setActiveTab("hall");
                      } else if (item.label === "Faculty Management") {
                        setActiveTab("faculty");
                      } else if (item.label === "Student Management") {
                        setActiveTab("student");
                      } else if (item.label === "My Invigilations") {
                        setActiveTab("invigilator");
                      }
                    }}
                  >
                    <View className={`${item.color} p-2 rounded-full mb-2`}>
                      <Icon
                        name={item.icon}
                        size={23}
                        color={`${item.itemscolor}`}
                      />
                    </View>
                    <Text className="text-center font-medium text-gray-700">
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mt-4 px-4">
              <Text className="text-blue-600 font-semibold mb-2 text-2xl">
                Upcoming Exams
              </Text>
              {dashboardData.upcomingExams.map((exam, index) => (
                <ExamCard key={index} exam={exam} />
              ))}
              {dashboardData.upcomingExams.length === 0 && (
                <Text className="text-gray-500 text-center py-4">
                  No upcoming exams
                </Text>
              )}
            </View>
            <View className="h-20" />
          </ScrollView>
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
