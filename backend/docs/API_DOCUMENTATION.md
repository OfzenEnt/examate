# Examate API Documentation

## Base URL: `http://localhost:5000`

## Authentication
All protected routes require `Authorization: Bearer <access_token>` header.

---

## 🔐 Authentication Routes (`/auth`)

### POST `/auth/login`
**Purpose**: Login user and get tokens  
**Takes**: 
```json
{
  "user_id": 123,
  "password": "password123"
}
```
**Returns**: 
```json
{
  "message": "Login successful",
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token",
  "user": {
    "id": 123,
    "name": "John Doe",
    "dept": "CSE",
    "programme": "BTech",
    "campus": "Main",
    "role": 1
  }
}
```

### POST `/auth/refresh`
**Purpose**: Get new access token using refresh token  
**Takes**: 
```json
{
  "refreshToken": "refresh_token"
}
```
**Returns**: 
```json
{
  "accessToken": "new_jwt_token",
  "refreshToken": "new_refresh_token"
}
```

### POST `/auth/logout`
**Purpose**: Logout user and invalidate tokens  
**Takes**: 
```json
{
  "refreshToken": "refresh_token"
}
```
**Headers**: `Authorization: Bearer <access_token>`  
**Returns**: 
```json
{
  "message": "Logout successful"
}
```

### POST `/auth/logout-all`
**Purpose**: Logout from all devices  
**Takes**: 
```json
{
  "userId": 123
}
```
**Returns**: 
```json
{
  "message": "Logged out from all devices",
  "refreshTokensInvalidated": 3
}
```

---

## 👥 User Management Routes (`/api/users`)

### POST `/api/users/create-faculty-user`
**Purpose**: Create new faculty user account  
**Auth**: Admin only (role 1)  
**Takes**: 
```json
{
  "user_id": 123,
  "password": "password123",
  "role": 2
}
```
**Returns**: 
```json
{
  "message": "Faculty user created successfully"
}
```

### GET `/api/users/get-faculty-users`
**Purpose**: Get all faculty users  
**Auth**: Admin only  
**Returns**: 
```json
{
  "success": true,
  "faculty_users": [
    {
      "user_id": 123,
      "role": 2,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### PUT `/api/users/update-faculty-user/:user_id`
**Purpose**: Update faculty user  
**Auth**: Admin only  
**Takes**: 
```json
{
  "password": "new_password",
  "role": 3
}
```
**Returns**: 
```json
{
  "message": "Faculty user updated successfully"
}
```

### DELETE `/api/users/delete-faculty-user/:user_id`
**Purpose**: Delete faculty user  
**Auth**: Admin only  
**Returns**: 
```json
{
  "message": "Faculty user deleted successfully"
}
```

### POST `/api/users/create-ec-user`
**Purpose**: Create exam coordinator user  
**Auth**: Admin only  
**Takes**: 
```json
{
  "user_id": 456,
  "name": "Jane Doe",
  "campus": "Main",
  "password": "password123",
  "role": 1
}
```
**Returns**: 
```json
{
  "message": "EC user created successfully"
}
```

### GET `/api/users/get-ec-users`
**Purpose**: Get all EC users  
**Auth**: Admin only  
**Returns**: 
```json
{
  "success": true,
  "ec_users": [
    {
      "user_id": 456,
      "name": "Jane Doe",
      "campus": "Main",
      "role": 1
    }
  ]
}
```

### PUT `/api/users/update-ec-user/:user_id`
**Purpose**: Update EC user  
**Auth**: Admin only  
**Takes**: 
```json
{
  "name": "Jane Smith",
  "campus": "Branch",
  "password": "new_password",
  "role": 0
}
```

### DELETE `/api/users/delete-ec-user/:user_id`
**Purpose**: Delete EC user  
**Auth**: Admin only  

---

## 📚 Course Routes (`/api/courses`)

### POST `/api/courses/create-course`
**Purpose**: Create new course (uses user's dept/programme/campus)  
**Auth**: Admin only  
**Takes**: 
```json
{
  "course_code": "CS101",
  "course_name": "Programming Fundamentals",
  "course_semester": 1
}
```
**Returns**: 
```json
{
  "message": "Course created successfully"
}
```

### GET `/api/courses/get-courses`
**Purpose**: Get courses from user's dept/programme/campus  
**Auth**: Required  
**Query Params**: `?course_semester=1` (optional)  
**Returns**: 
```json
{
  "success": true,
  "courses": [
    {
      "course_code": "CS101",
      "course_name": "Programming Fundamentals",
      "course_semester": 1,
      "course_dept": "CSE",
      "course_programme": "BTech",
      "course_campus": "Main"
    }
  ]
}
```

### GET `/api/courses/get-courses/:course_code`
**Purpose**: Get specific course details  
**Auth**: Required  
**Returns**: 
```json
{
  "success": true,
  "course": {
    "course_code": "CS101",
    "course_name": "Programming Fundamentals",
    "course_semester": 1
  }
}
```

### PUT `/api/courses/update-course/:course_code`
**Purpose**: Update course (only name and semester)  
**Auth**: Admin only  
**Takes**: 
```json
{
  "course_name": "Advanced Programming",
  "course_semester": 2
}
```

### DELETE `/api/courses/delete-course/:course_code`
**Purpose**: Delete course from user's scope  
**Auth**: Admin only  

---

## 🎓 Student Routes (`/api/students`)

### GET `/api/students/get-students`
**Purpose**: Get all students with filters  
**Auth**: Required  
**Query Params**: `?semester=1&student_sec=A&student_dept=CSE&student_programme=BTech&student_campus=Main&student_attendance=present&student_seat=R101-A1`  
**Returns**: 
```json
{
  "success": true,
  "students": [
    {
      "reg_no": "20CS001",
      "student_name": "Alice",
      "semester": 1,
      "student_dept": "CSE",
      "student_sec": 1,
      "student_programme": "BTech",
      "student_campus": "Main",
      "student_seat": "R101-A1",
      "student_attendance": "present"
    }
  ]
}
```

### GET `/api/students/get-students/:reg_no`
**Purpose**: Get specific student by registration number  
**Auth**: Required  
**Returns**: 
```json
{
  "success": true,
  "student": {
    "reg_no": "20CS001",
    "student_name": "Alice",
    "semester": 1
  }
}
```

### GET `/api/students/get-my-students`
**Purpose**: Get students from user's dept/programme/campus  
**Auth**: Required  
**Query Params**: `?student_sec=1` (optional)  
**Returns**: 
```json
{
  "success": true,
  "students": [...]
}
```

---

## 📝 Exam Routes (`/api/exams`)

### POST `/api/exams/create-exam`
**Purpose**: Create new exam  
**Auth**: Admin only  
**Takes**: 
```json
{
  "course_code": "CS101",
  "exam_date": "2024-01-15",
  "exam_type": 1,
  "exam_slot": 1,
  "start_time": "09:00:00",
  "end_time": "12:00:00"
}
```
**Returns**: 
```json
{
  "message": "Exam created successfully"
}
```

### GET `/api/exams/get-exams`
**Purpose**: Get all exams  
**Auth**: Required  
**Query Params**: `?semester=1` (optional)  
**Returns**: 
```json
{
  "success": true,
  "exams": [
    {
      "course_code": "CS101",
      "exam_type": 1,
      "exam_date": "2024-01-15",
      "exam_slot": 1,
      "start_time": "09:00:00",
      "end_time": "12:00:00",
      "created_by": "John Doe"
    }
  ]
}
```

### PUT `/api/exams/update-exam/:id`
**Purpose**: Update exam details  
**Auth**: Admin only  
**Takes**: 
```json
{
  "course_code": "CS102",
  "exam_date": "2024-01-16",
  "exam_type": 2,
  "exam_slot": 2,
  "start_time": "14:00:00",
  "end_time": "17:00:00"
}
```

### DELETE `/api/exams/delete-exam/:id`
**Purpose**: Delete exam  
**Auth**: Admin only  

---

## 🏢 Room Routes (`/api/rooms`)

### POST `/api/rooms/create-room`
**Purpose**: Create new room  
**Takes**: 
```json
{
  "room_id": "R101",
  "room_type": "classroom",
  "block_alias": "A",
  "room_status": 0,
  "n_rows": 6,
  "n_columns": 9
}
```
**Returns**: 
```json
{
  "message": "Room Created Successfully",
  "room_id": "R101"
}
```

### GET `/api/rooms/get-rooms`
**Purpose**: Get all rooms with filters  
**Query Params**: `?block_alias=A&room_type=classroom`  
**Returns**: 
```json
{
  "success": true,
  "rooms": [
    {
      "room_id": "R101",
      "room_type": "classroom",
      "block_alias": "A",
      "room_status": 0,
      "n_rows": 6,
      "n_columns": 9,
      "room_capacity": 54
    }
  ]
}
```

### GET `/api/rooms/get-rooms/:room_id`
**Purpose**: Get specific room details  
**Returns**: 
```json
{
  "success": true,
  "room": {
    "room_id": "R101",
    "room_type": "classroom",
    "block_alias": "A",
    "room_status": 0,
    "n_rows": 6,
    "n_columns": 9,
    "room_capacity": 54
  }
}
```

### PUT `/api/rooms/update-room/:room_id`
**Purpose**: Update room details  
**Takes**: 
```json
{
  "room_type": "lab",
  "block_alias": "B",
  "room_status": 1,
  "n_rows": 8,
  "n_columns": 10
}
```

### DELETE `/api/rooms/delete-room/:room_id`
**Purpose**: Delete room  
**Returns**: 
```json
{
  "message": "Room deleted successfully",
  "room_id": "R101"
}
```

---

## 📊 Sessional Exam Routes (`/api/sessional-exam`)

### POST `/api/sessional-exam/get-available-rooms`
**Purpose**: Get available rooms for exam in course's campus  
**Auth**: Admin only  
**Takes**: 
```json
{
  "course_code": "CS101"
}
```
**Returns**: 
```json
{
  "success": true,
  "course_code": "CS101",
  "campus": "Main",
  "available_rooms": [
    {
      "room_id": "R101",
      "room_type": "classroom",
      "block_alias": "A",
      "room_status": 0,
      "room_capacity": 54,
      "campus_alias": "Main"
    }
  ]
}
```

### POST `/api/sessional-exam/get-eligible-students`
**Purpose**: Get students eligible for exam (same semester, campus, no seat assigned)  
**Auth**: Admin only  
**Takes**: 
```json
{
  "course_code": "CS101"
}
```
**Returns**: 
```json
{
  "success": true,
  "course_code": "CS101",
  "semester": 1,
  "campus": "Main",
  "students": [
    {
      "reg_no": "20CS001",
      "student_name": "Alice",
      "semester": 1,
      "student_campus": "Main"
    }
  ]
}
```

### POST `/api/sessional-exam/allocate`
**Purpose**: Allocate students to room and update room status  
**Auth**: Admin only  
**Takes**: 
```json
{
  "course_code": "CS101",
  "room_id": "R101",
  "students": [
    {
      "reg_no": "20CS001",
      "student_seat": "R101-A1"
    }
  ]
}
```
**Returns**: 
```json
{
  "success": true,
  "message": "Room allocated successfully"
}
```

---

## 👨‍🏫 Coordinator Routes (`/api/exam-coordinator`)

### GET `/api/exam-coordinator/get-faculty`
**Purpose**: Get faculty from user's dept/programme/campus (excluding invigilators)  
**Auth**: Admin only  
**Returns**: 
```json
{
  "success": true,
  "faculty": [
    {
      "emp_id": 123,
      "faculty_name": "Dr. Smith",
      "faculty_dept": "CSE",
      "faculty_programme": "BTech",
      "faculty_campus": "Main"
    }
  ]
}
```

### POST `/api/exam-coordinator/invigilator-assignment/:room_id/:block`
**Purpose**: Assign invigilator to room  
**Auth**: Admin only  
**Takes**: 
```json
{
  "invigilator_id": 123
}
```
**Returns**: 
```json
{
  "success": true,
  "message": "Invigilator assigned successfully"
}
```

---

## 📤 Upload Routes (`/api/uploads`)

### POST `/api/uploads/upload-student-data`
**Purpose**: Upload student data from Excel/CSV file  
**Takes**: Form data with file field  
**Returns**: 
```json
{
  "message": "File processed and data inserted successfully!"
}
```

### POST `/api/uploads/upload-courses-data`
**Purpose**: Upload course data from Excel/CSV file  
**Takes**: Form data with file field  
**Returns**: 
```json
{
  "message": "Courses data processed and inserted successfully!"
}
```

---

## ✅ Attendance Routes

### POST `/mark-attendance`
**Purpose**: Mark attendance for multiple students  
**Takes**: 
```json
{
  "studentsList": ["20CS001", "20CS002", "20CS003"]
}
```
**Returns**: 
```json
{
  "success": true,
  "message": "Attendance marked successfully",
  "studentsMarked": 3
}
```

---

## 🏗️ Room Status Codes
- `0`: Completely free
- `1`: Completely filled  
- `2`: Partially filled

## 👤 User Roles
- `0`: Exam Controller
- `1`: Exam Coordinator  
- `2`: Invigilator
- `3`: HoD

## 📅 Date/Time Formats
- **Date**: `YYYY-MM-DD` (e.g., "2024-01-15")
- **Time**: `HH:MM:SS` (e.g., "09:00:00")

## 🔒 Authentication Notes
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Always include `Authorization: Bearer <token>` header for protected routes
- Use refresh endpoint to get new access token when expired