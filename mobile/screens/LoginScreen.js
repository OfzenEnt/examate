import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { authAPI } from "../utils/api";
import { CustomAlert } from "../components/ui/CustomAlert";
import { useAlert } from "../hooks/useAlert";

export const LoginScreen = ({ onLogin }) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  const handleLogin = async () => {
    if (!userId || !password) {
      showAlert("Error", "Please enter both User ID and Password");
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login({ user_id: userId, password });
      await onLogin(response.user, response.accessToken, response.refreshToken);
    } catch (error) {
      showAlert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    showAlert(
      "Forgot Password",
      "Please contact your administrator to reset your password."
    );
  };

  return (
    <View className="flex-1 justify-center items-center bg-white pb-6 px-8">
      <Image
        source={require("../assets/splash.gif")}
        className="w-32 h-32 mb-8"
        resizeMode="contain"
      />

      <Text className="text-2xl font-bold mb-8 text-gray-800">
        Welcome Back
      </Text>

      {/* User ID */}
      <View className="w-full mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-2">User ID</Text>
        <TextInput
          placeholder="Enter your User ID"
          placeholderTextColor="#9CA3AF"
          value={userId}
          onChangeText={setUserId}
          className="w-full border border-gray-300 rounded-lg px-4 py-3"
        />
      </View>

      {/* Password */}
      <View className="w-full mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
        <View className="relative">
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            className="w-full border border-gray-300 text-black rounded-lg px-4 py-3 pr-12"
          />
          <TouchableOpacity
            className="absolute right-3 top-3 justify-center"
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text className="text-blue-500 font-semibold text-sm">
              {showPassword ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Forgot Password */}
      <View className="w-full flex-row justify-end mb-4">
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text className="text-blue-500 text-sm">Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className={`w-full rounded-lg py-3 mb-4 ${loading ? "bg-gray-400" : "bg-blue-500"}`}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text className="text-white text-center font-semibold">
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      <CustomAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        buttons={alert.buttons}
        onClose={hideAlert}
      />
    </View>
  );
};
