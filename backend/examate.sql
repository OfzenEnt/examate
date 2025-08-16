-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 15, 2025 at 11:13 AM
-- Server version: 8.0.42-0ubuntu0.24.04.2
-- PHP Version: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `examate`
--

-- --------------------------------------------------------

--
-- Table structure for table `blocks`
--

CREATE TABLE `blocks` (
  `block_alias` varchar(255) NOT NULL,
  `block_name` varchar(255) NOT NULL,
  `campus_alias` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `blocks`
--

INSERT INTO `blocks` (`block_alias`, `block_name`, `campus_alias`) VALUES
('BGB', 'Billgates Bhavan', 'AUS'),
('CB', 'Cotton Bhavan', 'AUS'),
('KLB', 'KL Rao Bhavan', 'AUS'),
('RTB', 'Ratan Tata Bhavan', 'AUS');

-- --------------------------------------------------------

--
-- Table structure for table `campus`
--

CREATE TABLE `campus` (
  `campus_alias` varchar(255) NOT NULL,
  `campus_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `campus`
--

INSERT INTO `campus` (`campus_alias`, `campus_name`) VALUES
('ACET', 'Aditya College of Engineering & Technology'),
('ACOE', 'Aditya College of Engineering'),
('AEC', 'Aditya Engineering College'),
('AUS', 'Aditya University');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `course_code` varchar(255) NOT NULL,
  `course_name` varchar(255) NOT NULL,
  `course_semester` int NOT NULL,
  `course_dept` varchar(255) NOT NULL,
  `course_programme` varchar(255) NOT NULL,
  `course_campus` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`course_code`, `course_name`, `course_semester`, `course_dept`, `course_programme`, `course_campus`) VALUES
('201AI2T02', 'Linear Algebra for AI', 2, 'AIML', 'B.TECH', 'AEC'),
('201AI3T03', 'Machine Learning Fundamentals', 3, 'AIML', 'B.TECH', 'ACOE'),
('201AI4T06', 'Natural Language Processing', 4, 'AIML', 'B.TECH', 'AUS'),
('201AI5T04', 'Deep Learning', 5, 'AIML', 'B.TECH', 'AEC'),
('201CS2L01', 'Java Programming Lab', 2, 'CSE', 'DIPLOMA', 'ACET'),
('201CS3T01', 'Data Structures', 3, 'CSE', 'B.TECH', 'AEC'),
('201CS4T02', 'Operating Systems', 4, 'CSE', 'B.TECH', 'AUS'),
('201CS6T03', 'Cloud Computing', 6, 'CSE', 'B.TECH', 'ACET'),
('201EC4T05', 'Communication Systems', 4, 'ECE', 'B.TECH', 'ACOE'),
('201EC5T03', 'Digital Signal Processing', 5, 'ECE', 'B.TECH', 'ACOE'),
('201EC6L02', 'VLSI Design Lab', 6, 'ECE', 'B.TECH', 'AUS'),
('201EE3L02', 'Electrical Machines Lab', 3, 'EEE', 'B.TECH', 'AUS'),
('201EE6T01', 'Power Systems', 6, 'EEE', 'B.TECH', 'AUS'),
('201IT1L02', 'Python Programming Lab', 1, 'IT', 'B.TECH', 'AUS'),
('201IT2L03', 'Database Systems Lab', 2, 'IT', 'B.TECH', 'AEC'),
('201IT3L01', 'Web Development Lab', 3, 'IT', 'B.TECH', 'ACOE'),
('201ME1T02', 'Engineering Graphics', 1, 'MECH', 'DIPLOMA', 'AEC'),
('201ME2T03', 'Fluid Mechanics', 2, 'MECH', 'DIPLOMA', 'ACET'),
('201ME4L01', 'Thermodynamics Lab', 4, 'MECH', 'B.TECH', 'ACET'),
('201ME5T04', 'CAD/CAM', 5, 'MECH', 'B.TECH', 'ACOE');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `dept_alias` varchar(255) NOT NULL,
  `dept_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`dept_alias`, `dept_name`) VALUES
('AIML', 'Artificial Intelligence and Machine Learning'),
('CIVIL', 'Civil Engineering'),
('CSE', 'Computer Science Engineering'),
('ECE', 'Electronics and Communications Engineering'),
('EEE', 'Electrical and Electronics Engineering'),
('IT', 'Information Technology'),
('MECH', 'Mechanical Engineering');

-- --------------------------------------------------------

--
-- Table structure for table `ec_users`
--

CREATE TABLE `ec_users` (
  `user_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `campus` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `exams`
--

CREATE TABLE `exams` (
  `course_code` varchar(255) NOT NULL,
  `exam_type` int NOT NULL,
  `exam_date` date NOT NULL,
  `exam_slot` tinyint(1) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `created_by` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `faculty`
--

CREATE TABLE `faculty` (
  `emp_id` int NOT NULL,
  `faculty_name` varchar(255) NOT NULL,
  `faculty_dept` varchar(255) NOT NULL,
  `faculty_programme` varchar(255) NOT NULL,
  `faculty_campus` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `faculty`
--

INSERT INTO `faculty` (`emp_id`, `faculty_name`, `faculty_dept`, `faculty_programme`, `faculty_campus`) VALUES
(1001, 'Dr. Ananya Sharma', 'CSE', 'B.Tech', 'AEC'),
(1002, 'Prof. Ravi Teja', 'AIML', 'B.Tech', 'AEC'),
(1003, 'Dr. Meena Rao', 'IT', 'B.Tech', 'AEC'),
(1004, 'Mr. Harish Kumar', 'CSE', 'B.Tech', 'AEC'),
(1005, 'Kumar', 'AIML', 'B.Tech', 'AEC');

-- --------------------------------------------------------

--
-- Table structure for table `faculty_users`
--

CREATE TABLE `faculty_users` (
  `user_id` int NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `faculty_users`
--

INSERT INTO `faculty_users` (`user_id`, `password`, `role`, `created_at`) VALUES
(1001, '$2b$12$qdhMAdBZOnP/hpmIm5SnIu6zbqA.5Uaiv0PEHmWE/5/gSzgfhVmUe', 2, '2025-07-29 14:06:21'),
(1002, '$2b$12$qdhMAdBZOnP/hpmIm5SnIu6zbqA.5Uaiv0PEHmWE/5/gSzgfhVmUe\n', 2, '2025-07-29 14:06:21'),
(1003, '$2b$12$qdhMAdBZOnP/hpmIm5SnIu6zbqA.5Uaiv0PEHmWE/5/gSzgfhVmUe\n', 2, '2025-07-29 14:06:21'),
(1004, '$2b$12$qdhMAdBZOnP/hpmIm5SnIu6zbqA.5Uaiv0PEHmWE/5/gSzgfhVmUe\n', 2, '2025-07-29 14:06:21'),
(1005, '$2b$12$qdhMAdBZOnP/hpmIm5SnIu6zbqA.5Uaiv0PEHmWE/5/gSzgfhVmUe', 1, '2025-08-14 01:49:13');

-- --------------------------------------------------------

--
-- Table structure for table `programme`
--

CREATE TABLE `programme` (
  `programme_alias` varchar(255) NOT NULL,
  `programme_name` varchar(255) NOT NULL,
  `campus` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `programme`
--

INSERT INTO `programme` (`programme_alias`, `programme_name`, `campus`) VALUES
('B.TECH', 'Bachelor of Technology', 'AUS'),
('BBA', 'Bachelor of Business Administration', 'AUS'),
('DIPLOMA', 'Polytechnic Diploma', 'ACET'),
('MBA', 'Master of Business Administration', 'AUS');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int NOT NULL,
  `role` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role`) VALUES
(0, 'Exam_Controller'),
(1, 'Exam_Coordinator'),
(2, 'Invigilator'),
(3, 'HoD');

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `room_id` varchar(255) NOT NULL,
  `room_type` varchar(255) NOT NULL,
  `block_alias` varchar(255) NOT NULL,
  `room_status` tinyint NOT NULL DEFAULT '0',
  `n_rows` int NOT NULL,
  `n_columns` int NOT NULL,
  `room_capacity` int GENERATED ALWAYS AS ((`n_rows` * `n_columns`)) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `seating`
--

CREATE TABLE `seating` (
  `room_id` varchar(255) NOT NULL,
  `exams_list` varchar(255) NOT NULL,
  `student_list` json NOT NULL,
  `invigilator_id` int DEFAULT NULL,
  `block` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `reg_no` varchar(255) NOT NULL,
  `student_name` varchar(255) NOT NULL,
  `semester` int NOT NULL,
  `student_dept` varchar(255) NOT NULL,
  `student_sec` int DEFAULT NULL,
  `student_programme` varchar(255) NOT NULL,
  `student_campus` varchar(255) NOT NULL,
  `student_seat` varchar(255) DEFAULT NULL,
  `student_attendance` enum('present','absent') DEFAULT 'absent'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stud_users`
--

CREATE TABLE `stud_users` (
  `user_id` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blocks`
--
ALTER TABLE `blocks`
  ADD PRIMARY KEY (`block_alias`),
  ADD UNIQUE KEY `block_alias` (`block_alias`),
  ADD KEY `blocks_fk2` (`campus_alias`);

--
-- Indexes for table `campus`
--
ALTER TABLE `campus`
  ADD PRIMARY KEY (`campus_alias`),
  ADD UNIQUE KEY `campus_alias` (`campus_alias`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`course_code`),
  ADD UNIQUE KEY `course_code` (`course_code`),
  ADD KEY `courses_fk3` (`course_dept`),
  ADD KEY `courses_fk4` (`course_programme`),
  ADD KEY `courses_fk5` (`course_campus`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`dept_alias`),
  ADD UNIQUE KEY `dept_alias` (`dept_alias`);

--
-- Indexes for table `ec_users`
--
ALTER TABLE `ec_users`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `ec_users_fk2` (`campus`),
  ADD KEY `ec_users_fk4` (`role`);

--
-- Indexes for table `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`course_code`),
  ADD UNIQUE KEY `course_code` (`course_code`);

--
-- Indexes for table `faculty`
--
ALTER TABLE `faculty`
  ADD PRIMARY KEY (`emp_id`),
  ADD UNIQUE KEY `emp_id` (`emp_id`),
  ADD KEY `faculty_fk2` (`faculty_dept`),
  ADD KEY `faculty_fk3` (`faculty_programme`),
  ADD KEY `faculty_fk4` (`faculty_campus`);

--
-- Indexes for table `faculty_users`
--
ALTER TABLE `faculty_users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `faculty_users_fk2` (`role`);

--
-- Indexes for table `programme`
--
ALTER TABLE `programme`
  ADD PRIMARY KEY (`programme_alias`),
  ADD UNIQUE KEY `programme_alias` (`programme_alias`),
  ADD KEY `programme_fk2` (`campus`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`room_id`),
  ADD UNIQUE KEY `room_id` (`room_id`),
  ADD KEY `rooms_fk2` (`block_alias`);

--
-- Indexes for table `seating`
--
ALTER TABLE `seating`
  ADD KEY `seating_fk0` (`room_id`),
  ADD KEY `seating_fk3` (`invigilator_id`),
  ADD KEY `seating_fk4` (`block`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`reg_no`),
  ADD UNIQUE KEY `reg_no` (`reg_no`),
  ADD KEY `students_fk3` (`student_dept`),
  ADD KEY `students_fk4` (`student_programme`),
  ADD KEY `students_fk5` (`student_campus`);

--
-- Indexes for table `stud_users`
--
ALTER TABLE `stud_users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blocks`
--
ALTER TABLE `blocks`
  ADD CONSTRAINT `blocks_fk2` FOREIGN KEY (`campus_alias`) REFERENCES `campus` (`campus_alias`);

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_fk3` FOREIGN KEY (`course_dept`) REFERENCES `departments` (`dept_alias`),
  ADD CONSTRAINT `courses_fk4` FOREIGN KEY (`course_programme`) REFERENCES `programme` (`programme_alias`),
  ADD CONSTRAINT `courses_fk5` FOREIGN KEY (`course_campus`) REFERENCES `campus` (`campus_alias`);

--
-- Constraints for table `ec_users`
--
ALTER TABLE `ec_users`
  ADD CONSTRAINT `ec_users_fk2` FOREIGN KEY (`campus`) REFERENCES `campus` (`campus_alias`),
  ADD CONSTRAINT `ec_users_fk4` FOREIGN KEY (`role`) REFERENCES `roles` (`id`);

--
-- Constraints for table `exams`
--
ALTER TABLE `exams`
  ADD CONSTRAINT `exams_fk0` FOREIGN KEY (`course_code`) REFERENCES `courses` (`course_code`);

--
-- Constraints for table `faculty`
--
ALTER TABLE `faculty`
  ADD CONSTRAINT `faculty_fk2` FOREIGN KEY (`faculty_dept`) REFERENCES `departments` (`dept_alias`),
  ADD CONSTRAINT `faculty_fk3` FOREIGN KEY (`faculty_programme`) REFERENCES `programme` (`programme_alias`),
  ADD CONSTRAINT `faculty_fk4` FOREIGN KEY (`faculty_campus`) REFERENCES `campus` (`campus_alias`);

--
-- Constraints for table `faculty_users`
--
ALTER TABLE `faculty_users`
  ADD CONSTRAINT `faculty_users_fk0` FOREIGN KEY (`user_id`) REFERENCES `faculty` (`emp_id`),
  ADD CONSTRAINT `faculty_users_fk2` FOREIGN KEY (`role`) REFERENCES `roles` (`id`);

--
-- Constraints for table `programme`
--
ALTER TABLE `programme`
  ADD CONSTRAINT `programme_fk2` FOREIGN KEY (`campus`) REFERENCES `campus` (`campus_alias`);

--
-- Constraints for table `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `rooms_fk2` FOREIGN KEY (`block_alias`) REFERENCES `blocks` (`block_alias`);

--
-- Constraints for table `seating`
--
ALTER TABLE `seating`
  ADD CONSTRAINT `seating_fk0` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`),
  ADD CONSTRAINT `seating_fk3` FOREIGN KEY (`invigilator_id`) REFERENCES `faculty` (`emp_id`),
  ADD CONSTRAINT `seating_fk4` FOREIGN KEY (`block`) REFERENCES `blocks` (`block_alias`);

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_fk3` FOREIGN KEY (`student_dept`) REFERENCES `departments` (`dept_alias`),
  ADD CONSTRAINT `students_fk4` FOREIGN KEY (`student_programme`) REFERENCES `programme` (`programme_alias`),
  ADD CONSTRAINT `students_fk5` FOREIGN KEY (`student_campus`) REFERENCES `campus` (`campus_alias`);

--
-- Constraints for table `stud_users`
--
ALTER TABLE `stud_users`
  ADD CONSTRAINT `stud_users_fk0` FOREIGN KEY (`user_id`) REFERENCES `students` (`reg_no`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
