# Examate API Documentation

## Base URL
`http://localhost:5000`

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Role-based Access Control
- **Role 1**: Coordinator
- **Role 2**: Faculty/Invigilator  
- **Role 3**: Exam Cell (EC)

---

## Authentication APIs (`/auth`)

### POST `/auth/login`
**Description**: User login
**Authentication**: None required
**Request Body**:
```json
{
  "user_id": "string",
  "password": "string"
}
```
**Response**:
```json
{
  "message": "Login successful",
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token",
  "user": {
    "id": "user_id",
    "name": "faculty_name",
    "dept": "department",
    "programme": "programme",
    "campus": "campus",
    "role": 1
  }
}
```

### POST `/auth/refresh`
**Description**: Refresh access token
**Authentication**: None required
**Request Body**:
```json
{
  "refreshToken": "refresh_token"
}
```
**Response**:
```json
{
  "accessToken": "new_jwt_token",
  "refreshToken": "new_refresh_token"
}
```

### POST `/auth/logout`
**Description**: Logout user
**Authentication**: None required
**Request Body**:
```json
{
  "refreshToken": "refresh_token"
}
```
**Response**:
```json
{
  "message": "Logout successful"
}
```

### POST `/auth/logout-all`
**Description**: Logout from all devices
**Authentication**: None required
**Request Body**:
```json
{
  "userId": "user_id"
}
```
**Response**:
```json
{
  "message": "Logged out from all devices",
  "note": "Existing access tokens remain valid for up to 15 minutes",
  "refreshTokensInvalidated": 2
}
```

---

## Exam Management APIs (`/api/exams`)

### POST `/api/exams/create-exam`
**Description**: Create a new exam
**Authentication**: Required (Role 1 - Coordinator)
**Request Body**:
```json
{
  "course_code": "201AI2T02",
  "exam_date": "2024-01-15",
  "exam_type": "1",
  "exam_slot": "0",
  "start_time": "10:30",
  "end_time": "12:00"
}
```
**Response**:
```json
{
  "message": "Exam created successfully"
}
```

### GET `/api/exams/get-exams`
**Description**: Get all exams with optional filtering
**Authentication**: Required
**Query Parameters**:
- `semester` (optional): Filter by semester
**Response**:
```json
{
  "success": true,
  "exams": [
    {
      "id": 1,
      "course_code": "201AI2T02",
      "exam_type": "1",
      "exam_date": "2024-01-15",
      "exam_slot": "0",
      "start_time": "10:30:00",
      "end_time": "12:00:00",
      "created_by": "faculty_name"
    }
  ]
}
```

### PUT `/api/exams/update-exam/:id`
**Description**: Update an existing exam
**Authentication**: Required (Role 1 - Coordinator)
**Request Body**:
```json
{
  "course_code": "201AI2T02",
  "exam_date": "2024-01-15",
  "exam_type": "1",
  "exam_slot": "0",
  "start_time": "10:30",
  "end_time": "12:00"
}
```
**Response**:
```json
{
  "message": "Exam updated successfully"
}
```

### DELETE `/api/exams/delete-exam/:id`
**Description**: Delete an exam
**Authentication**: Required (Role 1 - Coordinator)
**Response**:
```json
{
  "message": "Exam deleted successfully"
}
```

---

## Room Management APIs (`/api/rooms`)

### POST `/api/rooms/create-room`
**Description**: Create a new room
**Authentication**: None required
**Request Body**:
```json
{
  "room_id": "A101",
  "room_type": "classroom",
  "block_alias": "A",
  "room_status": 0,
  "n_rows": 6,
  "n_columns": 9
}
```
**Response**:
```json
{
  "message": "Room Created Successfully",
  "room_id": "A101"
}
```

### GET `/api/rooms/get-rooms`
**Description**: Get all rooms with optional filtering
**Authentication**: None required
**Query Parameters**:
- `block_alias` (optional): Filter by block
- `room_type` (optional): Filter by room type
- `room_id` (optional): Filter by specific room ID
**Response**:
```json
{
  "success": true,
  "rooms": [
    {
      "room_id": "A101",
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

### GET `/api/rooms/rooms/my`
**Description**: Get rooms for user's campus
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "rooms": [
    {
      "room_id": "A101",
      "room_type": "classroom",
      "block_alias": "A",
      "room_status": 0,
      "n_rows": 6,
      "n_columns": 9,
      "room_capacity": 54,
      "campus_alias": "MAIN"
    }
  ]
}
```

### PUT `/api/rooms/update-room/:room_id`
**Description**: Update room details
**Authentication**: None required
**Request Body**:
```json
{
  "room_type": "lab",
  "block_alias": "A",
  "room_status": 1,
  "n_rows": 8,
  "n_columns": 10
}
```
**Response**:
```json
{
  "message": "Room updated successfully",
  "room_id": "A101"
}
```

### DELETE `/api/rooms/delete-room/:room_id`
**Description**: Delete a room
**Authentication**: None required
**Response**:
```json
{
  "message": "Room deleted successfully",
  "room_id": "A101"
}
```

---

## Student Management APIs (`/api/students`)

### GET `/api/students/get-students`
**Description**: Get all students with optional filtering
**Authentication**: Required
**Query Parameters**:
- `semester` (optional): Filter by semester
- `student_sec` (optional): Filter by section
- `student_dept` (optional): Filter by department
- `student_programme` (optional): Filter by programme
- `student_campus` (optional): Filter by campus
- `student_attendance` (optional): Filter by attendance
- `student_seat` (optional): Filter by seat assignment
**Response**:
```json
{
  "success": true,
  "students": [
    {
      "reg_no": "21AI001",
      "student_name": "John Doe",
      "semester": 3,
      "student_dept": "AI",
      "student_sec": "A",
      "student_programme": "B.Tech",
      "student_campus": "MAIN",
      "student_attendance": null,
      "student_seat": null
    }
  ]
}
```

### GET `/api/students/get-students/:reg_no`
**Description**: Get specific student by registration number
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "student": {
    "reg_no": "21AI001",
    "student_name": "John Doe",
    "semester": 3,
    "student_dept": "AI",
    "student_sec": "A",
    "student_programme": "B.Tech",
    "student_campus": "MAIN"
  }
}
```

---

## Coordinator APIs (`/api/exam-coordinator`)

### GET `/api/exam-coordinator/get-faculty`
**Description**: Get faculty members for coordinator's department/programme/campus
**Authentication**: Required (Role 1 - Coordinator)
**Response**:
```json
{
  "success": true,
  "faculty": [
    {
      "emp_id": "FAC001",
      "faculty_name": "Dr. Smith",
      "faculty_dept": "AI",
      "faculty_programme": "B.Tech",
      "faculty_campus": "MAIN"
    }
  ]
}
```

### POST `/api/exam-coordinator/invigilator-assignment/:room_id/:block`
**Description**: Assign invigilator to a room and block
**Authentication**: Required (Role 1 - Coordinator)
**Request Body**:
```json
{
  "invigilator_id": "FAC001"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Invigilator assigned successfully"
}
```

---

## Sessional Exam APIs (`/api/sessional-exam`)

### GET `/api/sessional-exam/exam-rooms-info`
**Description**: Get exam room information with optional course filtering
**Authentication**: Required (Role 1 - Coordinator)
**Query Parameters**:
- `course_code` (optional): Filter by course code
**Response**:
```json
{
  "success": true,
  "data": [
    {
      "room_id": "A101",
      "block": "A",
      "exams_list": ["201AI2T02", "201AI3T03"],
      "student_list": "student_data",
      "invigilator_id": "FAC001",
      "room_status": 1,
      "course_names": ["Linear Algebra for AI", "Machine Learning Fundamentals"]
    }
  ]
}
```

### POST `/api/sessional-exam/get-available-rooms`
**Description**: Get available rooms for a specific course
**Authentication**: Required (Role 1 - Coordinator)
**Request Body**:
```json
{
  "course_code": "201AI2T02"
}
```
**Response**:
```json
{
  "success": true,
  "course_code": "201AI2T02",
  "campus": "MAIN",
  "available_rooms": [
    {
      "room_id": "A101",
      "room_type": "classroom",
      "block_alias": "A",
      "room_status": 0,
      "campus_alias": "MAIN"
    }
  ]
}
```

### POST `/api/sessional-exam/get-eligible-students`
**Description**: Get students eligible for a specific course exam
**Authentication**: Required (Role 1 - Coordinator)
**Request Body**:
```json
{
  "course_code": "201AI2T02"
}
```
**Response**:
```json
{
  "success": true,
  "course_code": "201AI2T02",
  "semester": 3,
  "campus": "MAIN",
  "students": [
    {
      "reg_no": "21AI001",
      "student_name": "John Doe",
      "semester": 3,
      "student_campus": "MAIN",
      "seat_assigned": null
    }
  ]
}
```

### POST `/api/sessional-exam/allocate`
**Description**: Allocate students to a room for an exam
**Authentication**: Required (Role 1 - Coordinator)
**Query Parameters**:
- `invigilator_id` (optional): Invigilator ID
**Request Body**:
```json
{
  "course_code": "201AI2T02",
  "room_id": "A101",
  "block": "A",
  "students": [
    {
      "reg_no": "21AI001",
      "student_seat": "A1"
    }
  ]
}
```
**Response**:
```json
{
  "success": true,
  "message": "Room allocated successfully"
}
```

---

## User Management APIs (`/api/users`)

### POST `/api/users/create-faculty-user`
**Description**: Create a new faculty user
**Authentication**: Required (Role 1 - Coordinator)
**Request Body**:
```json
{
  "user_id": "FAC001",
  "password": "password123",
  "role": 2
}
```
**Response**:
```json
{
  "message": "Faculty user created successfully"
}
```

### GET `/api/users/get-faculty-users`
**Description**: Get all faculty users
**Authentication**: Required (Role 1 - Coordinator)
**Response**:
```json
{
  "success": true,
  "faculty_users": [
    {
      "user_id": "FAC001",
      "role": 2,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### PUT `/api/users/update-faculty-user/:user_id`
**Description**: Update faculty user
**Authentication**: Required (Role 1 - Coordinator)
**Request Body**:
```json
{
  "password": "newpassword123",
  "role": 2
}
```
**Response**:
```json
{
  "message": "Faculty user updated successfully"
}
```

### DELETE `/api/users/delete-faculty-user/:user_id`
**Description**: Delete faculty user
**Authentication**: Required (Role 1 - Coordinator)
**Response**:
```json
{
  "message": "Faculty user deleted successfully"
}
```

### POST `/api/users/create-ec-user`
**Description**: Create a new EC user
**Authentication**: Required (Role 3 - EC)
**Request Body**:
```json
{
  "user_id": "EC001",
  "name": "EC Admin",
  "campus": "MAIN",
  "password": "password123",
  "role": 3
}
```
**Response**:
```json
{
  "message": "EC user created successfully"
}
```

### GET `/api/users/get-ec-users`
**Description**: Get all EC users
**Authentication**: Required (Role 3 - EC)
**Response**:
```json
{
  "success": true,
  "ec_users": [
    {
      "user_id": "EC001",
      "name": "EC Admin",
      "campus": "MAIN",
      "role": 3
    }
  ]
}
```

### PUT `/api/users/update-ec-user/:user_id`
**Description**: Update EC user
**Authentication**: Required (Role 3 - EC)
**Request Body**:
```json
{
  "name": "Updated EC Admin",
  "campus": "MAIN",
  "password": "newpassword123",
  "role": 3
}
```
**Response**:
```json
{
  "message": "EC user updated successfully"
}
```

### DELETE `/api/users/delete-ec-user/:user_id`
**Description**: Delete EC user
**Authentication**: Required (Role 3 - EC)
**Response**:
```json
{
  "message": "EC user deleted successfully"
}
```

---

## Upload APIs (`/api/uploads`)

### POST `//api/uploads/upload-student-data`
**Description**: Upload student data via Excel file
**Authentication**: Required
**Content-Type**: `multipart/form-data`
**Request Body**: Form data with file field containing Excel file
**Response**:
```json
{
  "message": "File processed and data inserted successfully!"
}
```

### POST `/api/uploads/upload-courses-data`
**Description**: Upload courses data via Excel file
**Authentication**: Required
**Content-Type**: `multipart/form-data`
**Request Body**: Form data with file field containing Excel file
**Response**:
```json
{
  "message": "Courses data processed and inserted successfully!"
}
```

---

## Attendance APIs

### POST `/mark-attendance`
**Description**: Mark attendance for multiple students
**Authentication**: None required
**Request Body**:
```json
{
  "studentsList": ["21AI001", "21AI002", "21AI003"]
}
```
**Response**:
```json
{
  "success": true,
  "message": "Attendance marked successfully",
  "studentsMarked": 3
}
```

---

## Block APIs

### GET `/blocks`
**Description**: Get blocks for user's campus
**Authentication**: Required
**Response**:
```json
[
  {
    "block_alias": "A",
    "campus_alias": "MAIN",
    "block_name": "Academic Block A"
  }
]
```

---

## Health Check API

### GET `/api/health`
**Description**: Check API health status
**Authentication**: None required
**Response**: `"Examate API is Running"`

---

## Error Responses

All APIs may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Insufficient permissions."
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Notes

1. **Room Status Values**:
   - `0`: Completely free
   - `1`: Completely filled
   - `2`: Partially filled

2. **Exam Type Values**:
   - `1`: Sessional-I
   - `2`: Sessional-II
   - `3`: Semester

3. **Exam Slot Values**:
   - `0`: Morning (FN)
   - `1`: Afternoon (AN)

4. **File Upload Requirements**:
   - Excel files (.xlsx) are supported
   - Student data should include: reg_no, student_name, semester, student_dept, student_sec, student_programme, student_campus
   - Course data should include: course_code, course_name, course_semester, course_dept, course_programme, course_campus