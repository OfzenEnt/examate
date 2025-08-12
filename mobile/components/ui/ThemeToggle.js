import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

export const ThemeToggle = () => {
  const { themeMode, isDark, setThemeMode } = useTheme();

  const themes = [
    { mode: "system", label: "🌓 System" },
    { mode: "light", label: "☀️ Light" },
    { mode: "dark", label: "🌙 Dark" },
  ];

  return (
    <View className="flex-row rounded-xl">
      {themes.map(({ mode, label }) => {
        const isSelected = themeMode === mode;
        return (
          <TouchableOpacity
            key={mode}
            onPress={() => setThemeMode(mode)}
            className={`px-4 py-2 ${
              isSelected
                ? isDark
                  ? "bg-blue-600"
                  : "bg-blue-500"
                : isDark
                  ? "bg-gray-700"
                  : "bg-gray-200"
            }`}
          >
            <Text
              className={`font-medium ${
                isSelected
                  ? "text-white"
                  : isDark
                    ? "text-gray-300"
                    : "text-gray-700"
              }`}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
