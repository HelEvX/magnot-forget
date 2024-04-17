// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse form data
app.use(express.urlencoded({ extended: false }));
// Route to handle form submissions

app.post('/send-email', (req, res) => {
    const { name, email, subject, message } = req.body;

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Email content
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'magnotforget@gmail.com', // Set recipient email address here
        subject: subject,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error: Je bericht kon niet verzonden worden.');
        } else {
            console.log('Email sent: ' + info.response);
            // Redirect the user to their email client
            const mailtoLink = `mailto:magnotforget@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
            res.redirect(mailtoLink);
        }
    });
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
