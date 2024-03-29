const express = require('express');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const cors = require('cors'); // Import cors middleware

const app = express();
app.use(express.json());
app.use(cors()); // Use cors middleware

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'e-commerce'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Nodemailer transporter setup
// const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'erin.oconner@ethereal.email',
//         pass: 'xDNmnrFxjtuUsS7vmn'
//     }
// });

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'dev.aisha08@gmail.com',
        pass: 'dullzgrhixbppoxb'
    }
});

// API endpoint to handle form submission
app.post('/contact', (req, res) => {
  const { name, email, mobile, description } = req.body;
  // Save data to MySQL
  const sql = 'INSERT INTO users (name, email, mobile, description) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, mobile, description], (err, result) => {
    if (err) {
      console.error('Error saving data to MySQL:', err);
      res.status(500).json({ error: 'Failed to save data to database' });
      return;
    }
    console.log('Data saved to MySQL:', result);

    // console.log(isob hgcz whdn enhh);

    // Send response email
    const mailOptions = {
      from: 'dev.aisha08@gmail.com',
      to: email,
      subject: 'Thank you for contacting us!',
      text: 'Your message has been received. We will get back to you soon.'
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        // Even if email sending fails, consider the form submission successful
        res.status(200).json({ message: 'Form submitted successfully but failed to send email' });
        return;
      }
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'Form submitted successfully and email sent' });
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
