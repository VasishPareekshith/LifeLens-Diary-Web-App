/// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const multer = require('multer');
const { addDiaryEntry, getDiaryEntryByDateAndEmail } = require('./services/dynamoDB');
const upload = require('./services/s3');
const { signUp, confirmUser, signIn } = require('./services/cognito');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json()); // Middleware to parse JSON request bodies

// === AUTHENTICATION ROUTES ===
app.post('/api/auth/sign-up', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const result = await signUp(email, password, name);
    res.status(201).json({ message: 'User signed up successfully', user: result.user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/confirm', async (req, res) => {
  const { email, confirmationCode } = req.body;
  try {
    const result = await confirmUser(email, confirmationCode);
    res.status(200).json({ message: 'User confirmed successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/sign-in', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await signIn(email, password);
    const token = result.getIdToken().getJwtToken();
    res.status(200).json({ message: 'Sign-in successful', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === DIARY ENTRY ROUTES ===
app.post('/api/diary/add-entry', async (req, res) => {
  const { entryId, email, entryDate, content, imageUrl } = req.body; // Change userId to email
  console.log('Received diary entry data:', req.body); // Log the received data
  try {
    await addDiaryEntry(entryId, email, entryDate, content, imageUrl); // Pass email instead of userId
    res.status(200).json({ message: 'Diary entry added successfully!' });
  } catch (err) {
    console.error('Error adding diary entry:', err); // Log the error
    res.status(500).json({ error: 'Failed to add diary entry', details: err });
  }
});
  
app.get('/api/diary/get-entry', async (req, res) => {
  const { entryDate, email } = req.query;  // Get date and email from query parameters
  console.log("Received email:", email);
  console.log("Received date:", entryDate);
  if (!entryDate || !email) {
      return res.status(400).json({ error: 'Missing date or email parameter' });
  }

  try {
      // Assuming you are using DynamoDB, MongoDB, or another database
      const diaryEntry = await getDiaryEntryByDateAndEmail(entryDate, email);  // Implement this function
      
      if (!diaryEntry) {
          return res.status(404).json({ message: 'No entry found for this date and email' });
      }

      res.status(200).json(diaryEntry);  // Send back the entry data
  } catch (error) {
      console.error('Error fetching diary entry:', error);
      res.status(500).json({ error: 'Error fetching diary entry' });
  }
});




// === IMAGE UPLOAD ROUTE ===
app.post('/api/diary/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Return the URL of the uploaded image from S3
    res.status(200).json({ imageUrl: req.file.location });
  } catch (error) {
    console.error('Error during image upload:', error);
    res.status(500).json({ error: 'File upload error: ' + error.message });
  }
});



// === PROXY ROUTE TO FORWARD REQUESTS TO ADGARD.NET ===
app.get('/proxy/adgard', async (req, res) => {
  try {
    const response = await axios.get('https://adgard.net/code?id=bjyERE3DxNAm&type=1');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching from adgard.net:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// Serve the React frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
