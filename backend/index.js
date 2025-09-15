import express from "express";
import loginRoute from "./routes/auth.js";
import examRoutes from "./routes/examRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import coordinatorRoutes from "./routes/coordinatorRoutes.js";
import sessionalExamRoutes from "./routes/sessionalExamRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import seatingRoutes from "./routes/seatingRoutes.js";
import invigilatorRoutes from "./routes/invigilatorRoutes.js";
import "./middleware/tokenCleanup.js";

// Testing routes
import testingRoutes from "./testing/testingRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/test", testingRoutes);

app.use("/auth", loginRoute);
app.use("/api/uploads", uploadRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/exam-coordinator", coordinatorRoutes);
app.use("/api/sessional-exam", sessionalExamRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/seating", seatingRoutes);
app.use("/api/invigilator", invigilatorRoutes);

app.get("/api/health", (req, res) => {
  res.send("Examate API is Running");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// app.listen("https://backedn.ofzen.in", () => {
//     console.log(`Server running on https://backedn.ofzen.in`);
// });
