import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { BottomNavBar } from "../components/ui/BottomNavBar";
import { ExamScreen } from "./ExamScreen";
import { HallScreen } from "./HallScreen";
import { ReportsScreen } from "./ReportsScreen";
import { ProfileScreen } from "./ProfileScreen";

export const ExamCoordinatorDashboard = ({ user, onNavigateToAttendance }) => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("home");

  const quickActions = [
    {
      label: "Exam Management",
      icon: "assignment",
      color: "bg-purple-100 ",
      itemscolor: "#8440CF",
    },
    {
      label: "Student Management",
      icon: "school",
      color: "bg-blue-100 ",
      itemscolor: "#0B5895",
    },
    {
      label: "Invigilator Management",
      icon: "person",
      color: "bg-indigo-100",
      itemscolor: "blue",
    },
    {
      label: "Reports",
      icon: "bar-chart",
      color: "bg-emerald-100",
      itemscolor: "#0D9488",
    },
    {
      label: "Hall Allocation",
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

  const upcomingExams = [
    {
      subject: "Artificial Intelligence",
      code: "AR20 CSE – Semester 4",
      date: "Aug 15, 2025",
      time: "10:00 AM – 12:00 PM",
      initials: "AI",
    },
    {
      subject: "Artificial Intelligence",
      code: "AR20 CSE – Semester 4",
      date: "Aug 15, 2025",
      time: "10:00 AM – 12:00 PM",
      initials: "ML",
    },
  ];

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case "exam":
        return <ExamScreen />;
      case "hall":
        return <HallScreen />;
      case "reports":
        return <ReportsScreen />;
      case "profile":
        return <ProfileScreen user={user} />;
      default:
        return (
          <ScrollView className="bg-white flex-1 pt-6 p-1">
            <View className="flex-row items-center justify-between p-4 mt-10 ">
              <View className="flex-row items-center gap-2">
                <Image
                  source={require("../assets/prof_avatar.png")}
                  className="w-16 h-16 rounded-full"
                />
                <View>
                  <Text className="text-blue-600 font-semibold text-2xl">
                    Hi Srinivas Reddy!
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
                  <Text className="text-3xl font-bold">25</Text>
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
                  <Text className=" text-3xl font-bold">23</Text>
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
              {upcomingExams.map((exam, index) => (
                <View
                  key={index}
                  className="bg-white rounded-lg p-4 mb-3 border border-gray-100 flex-row items-center"
                >
                  <View className="bg-purple-500 w-10 h-10 rounded-full items-center justify-center mr-3">
                    <Text className="text-white font-semibold">
                      {exam.initials}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-black font-semibold text-lg">
                      {exam.subject}
                    </Text>
                    <Text className="text-gray-500 text-sm">{exam.code}</Text>
                    <View className="flex-row items-center mt-1">
                      <Icon name="calendar-today" size={16} color="#6b7280" />
                      <Text className="text-sm text-gray-500 ml-1">
                        {exam.date}
                      </Text>
                      <Icon
                        name="access-time"
                        size={16}
                        color="#6b7280"
                        style={{ marginLeft: 12 }}
                      />
                      <Text className="text-sm text-gray-500 ml-1">
                        {exam.time}
                      </Text>
                    </View>
                  </View>
                  <View className="bg-gray-200 px-2 py-1 rounded-full ml-2">
                    <Text className="text-gray-600 text-xs">Upcoming</Text>
                  </View>
                </View>
              ))}
            </View>
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
