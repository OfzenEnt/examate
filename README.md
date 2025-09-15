# Examate - Exam Cell Automation System

A comprehensive exam cell automation system designed to streamline the entire examination process from scheduling to invigilation management.

## 🎯 Overview

Examate automates the complex processes of exam cell management including:
- Exam scheduling and room allocation
- Student seating arrangements
- Invigilator assignments
- Attendance tracking
- Real-time exam monitoring

## 🏗️ Architecture

### Backend (Node.js/Express)
- **Database**: MySQL with utf8mb4_0900_ai_ci collation
- **Authentication**: JWT with refresh tokens
- **File Processing**: Excel/CSV upload support
- **API**: RESTful endpoints with role-based access

### Mobile App (React Native/Expo)
- **Framework**: React Native with Expo
- **Styling**: TailwindCSS with NativeWind
- **State Management**: React Context
- **Navigation**: Role-based dashboard system

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MySQL (v8.0+)
- Expo CLI
- Android Studio/Xcode (for mobile development)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure database credentials in .env
mysql -u root -p < examate.sql
npm start
```

### Mobile App Setup
```bash
cd mobile
npm install
npx expo start
```

## 👥 User Roles

| Role | ID | Permissions |
|------|----|-----------| 
| Exam Controller | 0 | Full system access |
| Exam Coordinator | 1 | Exam management, assignments |
| Invigilator | 2 | View assignments, mark attendance |
| HoD | 3 | Department oversight |

## 📱 Features

### For Exam Coordinators
- Create and schedule exams
- Allocate rooms and seating
- Assign invigilators
- Upload student/course data
- Generate reports

### For Invigilators
- View assigned invigilation duties
- Real-time exam status tracking
- Mark student attendance
- Access exam details and room information

### For Students
- View exam schedules
- Check seat allocations
- Attendance status

## 🗄️ Database Schema

Key entities:
- **Users**: Faculty, students, coordinators
- **Courses**: Academic courses with department mapping
- **Exams**: Scheduled examinations
- **Rooms**: Physical examination venues
- **Seating**: Student-room-exam allocations
- **Attendance**: Real-time attendance tracking

## 🔐 Security

- JWT-based authentication with refresh tokens
- Role-based access control
- Token blacklisting for secure logout
- Password hashing with bcrypt
- Input validation and sanitization

## 📊 API Endpoints

Base URL: `http://localhost:5000`

### Authentication
- `POST /auth/login` - User login
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - Secure logout

### Core Management
- `GET /api/courses` - Course management
- `GET /api/exams` - Exam scheduling
- `GET /api/rooms` - Room allocation
- `GET /api/students` - Student management
- `POST /api/uploads` - Bulk data upload

See [API Documentation](backend/docs/API_DOCUMENTATION.md) for complete endpoint details.

## 📁 Project Structure

```
examate/
├── backend/                 # Node.js API server
│   ├── config/             # Database configuration
│   ├── routes/             # API route handlers
│   ├── middleware/         # Authentication & validation
│   ├── utils/              # Helper functions
│   └── docs/               # API documentation
├── mobile/                 # React Native app
│   ├── screens/            # App screens
│   ├── components/         # Reusable components
│   ├── contexts/           # State management
│   ├── utils/              # API client & utilities
│   └── assets/             # Images & resources
└── uploads/                # File upload storage
```

## 🔧 Configuration

### Environment Variables (.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=examate
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
PORT=5000
```

## 📱 Mobile App Screens

- **Login**: Role-based authentication
- **Coordinator Dashboard**: Exam management interface
- **Invigilator Dashboard**: Assignment tracking
- **Exam Details**: Real-time exam information
- **Room Details**: Seating arrangements
- **Reports**: Analytics and summaries

## 🛠️ Development

### Adding New Features
1. Backend: Add routes in `/routes` directory
2. Database: Update schema in `examate.sql`
3. Mobile: Create screens in `/screens` directory
4. API: Update documentation

### Testing
- Backend API testing routes available in `/testing`
- Mobile app testing with Expo development client

## 📄 License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

## 📞 Support

For technical support or feature requests, please refer to the project documentation or create an issue in the repository.