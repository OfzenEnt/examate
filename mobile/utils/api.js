import { logger } from "./logger";

const BASE_URL = "http://localhost:5000";

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const startTime = Date.now();

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body);
  }

  logger.info(`${config.method || "GET"} ${endpoint}`, {
    url,
    headers: config.headers,
    body: config.body ? JSON.parse(config.body) : undefined,
  });

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    const duration = Date.now() - startTime;

    if (!response.ok) {
      logger.error(
        `${config.method || "GET"} ${endpoint} - ${response.status}`,
        {
          status: response.status,
          error: data.message,
          duration: `${duration}ms`,
        }
      );
      const error = new Error(
        data.error || data.message || "API request failed"
      );
      error.response = data;
      throw error;
    }

    logger.info(`${config.method || "GET"} ${endpoint} - ${response.status}`, {
      status: response.status,
      duration: `${duration}ms`,
      response: data,
    });

    return data;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`${config.method || "GET"} ${endpoint} - FAILED`, {
      error: error.message,
      duration: `${duration}ms`,
    });
    throw error;
  }
};

const getAuthHeaders = async () => {
  const AsyncStorage =
    require("@react-native-async-storage/async-storage").default;
  const token = await AsyncStorage.getItem("accessToken");
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : {
        "Content-Type": "application/json",
      };
};

export const authAPI = {
  login: (credentials) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: credentials,
    }),

  logout: (tokens) =>
    apiRequest("/auth/logout", {
      method: "POST",
      body: tokens,
    }),

  refresh: (refreshToken) =>
    apiRequest("/auth/refresh", {
      method: "POST",
      body: { refreshToken },
    }),
};

export const examAPI = {
  getExams: async (semester) => {
    const headers = await getAuthHeaders();
    const query = semester ? `?semester=${semester}` : "";
    return apiRequest(`/api/exams/get-exams${query}`, { headers });
  },

  createExam: async (examData) => {
    const headers = await getAuthHeaders();
    return apiRequest("/api/exams/create-exam", {
      method: "POST",
      headers,
      body: examData,
    });
  },

  updateExam: async (id, examData) => {
    const headers = await getAuthHeaders();
    return apiRequest(`/api/exams/update-exam/${id}`, {
      method: "PUT",
      headers,
      body: examData,
    });
  },

  deleteExam: async (id) => {
    const headers = await getAuthHeaders();
    return apiRequest(`/api/exams/delete-exam/${id}`, {
      method: "DELETE",
      headers,
    });
  },
};

export const roomAPI = {
  getMyRooms: async () => {
    const headers = await getAuthHeaders();
    return apiRequest("/api/rooms/rooms/my", { headers });
  },

  createRoom: async (roomData) => {
    const headers = await getAuthHeaders();
    return apiRequest("/api/rooms/create-room", {
      method: "POST",
      headers,
      body: roomData,
    });
  },

  updateRoom: async (roomId, roomData) => {
    const headers = await getAuthHeaders();
    return apiRequest(`/api/rooms/update-room/${roomId}`, {
      method: "PUT",
      headers,
      body: roomData,
    });
  },

  deleteRoom: async (roomId) => {
    const headers = await getAuthHeaders();
    return apiRequest(`/api/rooms/delete-room/${roomId}`, {
      method: "DELETE",
      headers,
    });
  },
};

export const coordinatorAPI = {
  getFaculty: async () => {
    const headers = await getAuthHeaders();
    return apiRequest("/api/exam-coordinator/get-faculty", { headers });
  },

  assignInvigilator: async (roomId, block, invigilatorId) => {
    const headers = await getAuthHeaders();
    return apiRequest(
      `/api/exam-coordinator/invigilator-assignment/${roomId}/${block}`,
      {
        method: "POST",
        headers,
        body: { invigilator_id: invigilatorId },
      }
    );
  },
};

export const sessionalExamAPI = {
  getExamRoomsInfo: async (courseCode) => {
    const headers = await getAuthHeaders();
    const query = courseCode ? `?course_code=${courseCode}` : "";
    return apiRequest(`/api/sessional-exam/exam-rooms-info${query}`, {
      headers,
    });
  },

  allocateRoom: async (allocationData) => {
    const headers = await getAuthHeaders();
    return apiRequest("/api/sessional-exam/allocate", {
      method: "POST",
      headers,
      body: allocationData,
    });
  },
};

export const studentAPI = {
  getStudents: async (filters = {}) => {
    const headers = await getAuthHeaders();
    const query = new URLSearchParams(filters).toString();
    return apiRequest(`/api/students/get-students${query ? `?${query}` : ""}`, {
      headers,
    });
  },

  createStudent: async (studentData) => {
    const headers = await getAuthHeaders();
    return apiRequest("/api/students/create-student", {
      method: "POST",
      headers,
      body: studentData,
    });
  },

  updateStudent: async (regNo, studentData) => {
    const headers = await getAuthHeaders();
    return apiRequest(`/api/students/update-student/${regNo}`, {
      method: "PUT",
      headers,
      body: studentData,
    });
  },

  deleteStudent: async (regNo) => {
    const headers = await getAuthHeaders();
    return apiRequest(`/api/students/delete-student/${regNo}`, {
      method: "DELETE",
      headers,
    });
  },
};

export const courseAPI = {
  getCourses: async (filters = {}) => {
    const headers = await getAuthHeaders();
    const query = new URLSearchParams(filters).toString();
    return apiRequest(`/api/courses/get-courses${query ? `?${query}` : ""}`, {
      headers,
    });
  },

  createCourse: async (courseData) => {
    const headers = await getAuthHeaders();
    return apiRequest("/api/courses/create-course", {
      method: "POST",
      headers,
      body: courseData,
    });
  },

  updateCourse: async (courseCode, courseData) => {
    const headers = await getAuthHeaders();
    return apiRequest(`/api/courses/update-course/${courseCode}`, {
      method: "PUT",
      headers,
      body: courseData,
    });
  },

  deleteCourse: async (courseCode) => {
    const headers = await getAuthHeaders();
    return apiRequest(`/api/courses/delete-course/${courseCode}`, {
      method: "DELETE",
      headers,
    });
  },
};

export const facultyAPI = {
  getFaculty: async () => {
    const headers = await getAuthHeaders();
    return apiRequest("/api/faculty/get-faculty", { headers });
  },

  createFaculty: async (facultyData) => {
    const headers = await getAuthHeaders();
    return apiRequest("/api/faculty/create-faculty", {
      method: "POST",
      headers,
      body: facultyData,
    });
  },

  updateFaculty: async (empId, facultyData) => {
    const headers = await getAuthHeaders();
    return apiRequest(`/api/faculty/update-faculty/${empId}`, {
      method: "PUT",
      headers,
      body: facultyData,
    });
  },

  deleteFaculty: async (empId) => {
    const headers = await getAuthHeaders();
    return apiRequest(`/api/faculty/delete-faculty/${empId}`, {
      method: "DELETE",
      headers,
    });
  },
};

export const assignmentAPI = {
  invigilatorAssignment: async (examData) => {
    const headers = await getAuthHeaders();
    return apiRequest("/api/assignments/invigilator-assignment", {
      method: "POST",
      headers,
      body: examData,
    });
  },

  getExamSeating: async (courseCode, examDate) => {
    const headers = await getAuthHeaders();
    return apiRequest(`/api/seating/exam-seating/${courseCode}/${examDate}`, {
      headers,
    });
  },

  getMyInvigilations: async () => {
    const headers = await getAuthHeaders();
    return apiRequest("/api/invigilator/my-invigilations", {
      headers,
    });
  },
};
