import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { name: "John Doe", role: 1 },
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwMDUsIm5hbWUiOiJKb2huIERvZSIsInJvbGUiOjEsImNhbXB1cyI6Ik1haW4gQ2FtcHVzIiwiZGVwdCI6IkNTRSIsImlhdCI6MTc1NTE1OTgyMCwiZXhwIjoxNzU1MTg4NjIwfQ.k6YDFuGU6AAyPRf8IGgz7bqELkTO_oTJvznrwNQao-s",
  { expiresIn: "1h" }
);

console.log(token);
