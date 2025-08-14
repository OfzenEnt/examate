import express from 'express';

const router = express.Router();

router.get('/test-create-exam', (req, res) => {
  res.send(`
    <form id="creatExam">
      <label for="course_code">Choose Course:</label><br/>
      <select name="course_code" id="course_code" required>
        <option value="201AI2T02">Linear Algebra for AI</option>
        <option value="201AI3T03">Machine Learning Fundamentals</option>
      </select><br/><br/>

      <label for="exam_date">Exam Date:</label><br/>
      <input type="date" id="exam_date" name="exam_date" required /><br/><br/>

      <label for="exam_slot">Choose Exam Slot:</label><br/>
      <select name="exam_slot" id="exam_slot" required>
        <option value="0">Morning (FN)</option>
        <option value="1">Afternoon (AN)</option>
      </select><br/><br/>

      <label for="exam_type">Exam Type:</label><br/>
      <select name="exam_type" id="exam_type" required>
        <option value="1">Sessional-I</option>
        <option value="2">Sessional-II</option>
        <option value="3">Semester</option>
      </select><br/><br/>

      <label for="start_time">Start Time:</label><br/>
      <input type="time" id="start_time" name="start_time" required><br/><br/>

      <label for="end_time">End Time:</label><br/>
      <input type="time" id="end_time" name="end_time" required><br/><br/>

      <button type="submit">Create Exam</button>
    </form>

    <script>
      const form = document.getElementById('creatExam');
      const slotSelect = document.getElementById('exam_slot');
      const startTimeInput = document.getElementById('start_time');
      const endTimeInput = document.getElementById('end_time');

      function setDefaultTimes() {
        if (slotSelect.value == "0") {
          startTimeInput.value = "10:30";
          endTimeInput.value = "12:00";
        } else if (slotSelect.value == "1") {
          startTimeInput.value = "14:00";
          endTimeInput.value = "15:30";
        }
      }

      slotSelect.addEventListener('change', setDefaultTimes);
      setDefaultTimes(); // initial defaults

      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Get JWT from localStorage (or wherever you store it after login)
        const token = localStorage.getItem('jwt');
        if (!token) {
          alert('You must be logged in first!');
          return;
        }

        const response = await fetch('/api/create-exam', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();
        alert(JSON.stringify(result));
      });
    </script>
  `);
});

export default router;
