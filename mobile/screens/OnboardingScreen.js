import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

const onboardingData = [
  {
    image: require("../assets/onboarding/1.png"),
    text: "Welcome to ExamMate - Your exam automation companion",
  },
  {
    image: require("../assets/onboarding/2.png"),
    text: "Streamline your exam processes with smart automation",
  },
  {
    image: require("../assets/onboarding/3.png"),
    text: "Get started and transform your exam experience",
  },
];

export const OnboardingScreen = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  return (
    <View className="flex-1 bg-white px-8">
      <View className="flex-1 justify-center items-center">
        <Image
          source={onboardingData[currentIndex].image}
          className="w-64 h-64 mb-8"
          resizeMode="contain"
        />
        <Text className="text-lg text-center text-gray-700">
          {onboardingData[currentIndex].text}
        </Text>
      </View>

      <View className="flex-row justify-between items-center mb-16">
        <TouchableOpacity onPress={onComplete}>
          <Text className="text-gray-500  font-medium">Skip</Text>
        </TouchableOpacity>
        <View className="flex-row justify-center">
          {onboardingData.map((_, index) => (
            <View
              key={index}
              className={`w-2 h-2 rounded-full mx-1 ${
                index === currentIndex ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
          ))}
        </View>
        <TouchableOpacity
          onPress={handleNext}
          className="bg-blue-500 w-12 h-12 rounded-full justify-center items-center"
        >
          {currentIndex < onboardingData.length - 1 ? (
            <Text className="text-white text-xl font-bold">→</Text>
          ) : (
            <Text className="text-white text-lg font-bold">✓</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
