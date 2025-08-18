import React from 'react';
import { View, Text, TouchableOpacity, Modal, StatusBar } from 'react-native';

export const CustomAlert = ({ visible, title, message, buttons = [], onClose }) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-2xl mx-8 min-w-72 max-w-80">
          <View className="px-6 pt-6 pb-4">
            {title && (
              <Text className="text-lg font-semibold text-center text-gray-900 mb-2">
                {title}
              </Text>
            )}
            {message && (
              <Text className="text-sm text-center text-gray-600 leading-5">
                {message}
              </Text>
            )}
          </View>
          
          <View className="border-t border-gray-200">
            {buttons.map((button, index) => (
              <View key={index}>
                <TouchableOpacity
                  className="py-3 px-6"
                  onPress={() => {
                    button.onPress?.();
                    onClose();
                  }}
                >
                  <Text className={`text-center text-base ${
                    button.style === 'destructive' 
                      ? 'text-red-500 font-medium' 
                      : button.style === 'cancel'
                      ? 'text-gray-500'
                      : 'text-blue-500 font-medium'
                  }`}>
                    {button.text}
                  </Text>
                </TouchableOpacity>
                {index < buttons.length - 1 && (
                  <View className="border-t border-gray-200" />
                )}
              </View>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const showAlert = (title, message, buttons = [{ text: 'OK' }]) => {
  // This would need to be implemented with a global state manager
  // For now, we'll create a hook-based solution
};