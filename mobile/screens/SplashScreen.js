import React, { useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Image, Animated } from "react-native";

export const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <StatusBar style={"dark"} />
      <View className="justify-center">
        <Image
          source={require("../assets/splash.gif")}
          className="w-52 h-52"
          resizeMode="contain"
        />
      </View>
      <Animated.View
        className="-mt-6 justify-center"
        style={{
          opacity: fadeAnim,
        }}
      >
        <Image
          source={require("../assets/ExamMate_logo.png")}
          className="w-40 h-16"
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};
