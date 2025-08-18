import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export const BottomNavBar = ({ activeTab, onTabPress }) => {
  const tabs = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "exam", label: "Exam", icon: "📝" },
    { id: "reports", label: "Reports", icon: "📊" },
    { id: "hall", label: "Hall", icon: "🏛️" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  return (
    <View className="absolute bottom-0 left-0 right-0 pb-5 bg-white border-t border-gray-200 flex-row">
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          className="flex-1 items-center py-3"
          onPress={() => onTabPress(tab.id)}
        >
          <Text className="text-xl mb-1">{tab.icon}</Text>
          <Text
            className={`text-xs ${
              activeTab === tab.id
                ? "text-blue-500 font-semibold"
                : "text-gray-500"
            }`}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
