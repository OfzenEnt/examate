import React, { createContext, useContext, useState, useEffect } from 'react';
import { examAPI, roomAPI, courseAPI } from '../utils/api';

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState({
    totalExams: 0,
    availableHalls: 0,
    upcomingExams: [],
    exams: [],
    courses: [],
    rooms: []
  });
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      const [examsResponse, roomsResponse, coursesResponse] = await Promise.all([
        examAPI.getExams(),
        roomAPI.getMyRooms(),
        courseAPI.getCourses()
      ]);
      
      setDashboardData({
        totalExams: examsResponse.exams?.length || 0,
        availableHalls: roomsResponse.rooms?.filter(room => room.room_status === 0).length || 0,
        upcomingExams: examsResponse.exams?.slice(0, 2) || [],
        exams: examsResponse.exams || [],
        courses: coursesResponse.courses || [],
        rooms: roomsResponse.rooms || []
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshExams = async () => {
    try {
      const response = await examAPI.getExams();
      setDashboardData(prev => ({
        ...prev,
        totalExams: response.exams?.length || 0,
        upcomingExams: response.exams?.slice(0, 2) || [],
        exams: response.exams || []
      }));
    } catch (error) {
      console.error('Failed to refresh exams:', error);
    }
  };

  const refreshCourses = async () => {
    try {
      const response = await courseAPI.getCourses();
      setDashboardData(prev => ({
        ...prev,
        courses: response.courses || []
      }));
    } catch (error) {
      console.error('Failed to refresh courses:', error);
    }
  };

  const refreshRooms = async () => {
    try {
      const response = await roomAPI.getMyRooms();
      console.log('Rooms response:', response);
      setDashboardData(prev => ({
        ...prev,
        availableHalls: response.rooms?.filter(room => room.room_status === 0).length || 0,
        rooms: response.rooms || []
      }));
    } catch (error) {
      console.error('Failed to refresh rooms:', error);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const refreshDashboard = async () => {
    await loadDashboardData();
  };

  return (
    <DashboardContext.Provider value={{
      dashboardData,
      loading,
      loadDashboardData,
      refreshDashboard,
      refreshExams,
      refreshCourses,
      refreshRooms
    }}>
      {children}
    </DashboardContext.Provider>
  );
};