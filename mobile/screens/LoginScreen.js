import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export const LoginScreen = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white px-8">
      <Text className="text-2xl font-bold mb-8 text-gray-800">Login</Text>
      
      <TextInput
        placeholder="Email"
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4"
      />
      
      <TextInput
        placeholder="Password"
        secureTextEntry
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6"
      />
      
      <TouchableOpacity className="w-full bg-blue-500 rounded-lg py-3">
        <Text className="text-white text-center font-semibold">Login</Text>
      </TouchableOpacity>
    </View>
  );
};