import React, { memo, useState } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useCallback } from 'react';

const App = () => {
  const [password, setPassword] = useState('');
  const [submittedData, setSubmittedData] = useState([]);

  /**
   * Evaluates the strength of a password
   * @param {string} password - The password to be evaluated.
   * @returns {number} The minimum number of changes required to make the password strong.
   */
  const passwordChecker = useCallback((password) => {
    let needDigits = 1;
    let needLowercase = 1;
    let needUppercase = 1;
    let needsChange = 0;
    let canDeleteForChange = [0, 0, 0];

    let i = 0;
    while (i < password.length) {
      const v = password[i];
      if (v >= '0' && v <= '9') {
        needDigits = 0;
      } else if (v >= 'a' && v <= 'z') {
        needLowercase = 0;
      } else if (v >= 'A' && v <= 'Z') {
        needUppercase = 0;
      }

      if (i - 2 >= 0 && password[i - 2] === v && password[i - 1] === v) {
        let seqLen = 3;
        i += 1;
        while (i < password.length && password[i] === v) {
          seqLen += 1;
          i += 1;
        }
        needsChange += Math.floor(seqLen / 3);
        canDeleteForChange[seqLen % 3] += 1;
      } else {
        i += 1;
      }
    }

    const sz = password.length;
    const needsSpecial = needDigits + needLowercase + needUppercase;
    if (sz < 6) {
      return Math.max(needsSpecial, 6 - sz, needsChange);
    } else if (sz <= 20) {
      return Math.max(needsSpecial, needsChange);
    } else {
      const needsDeleted = sz - 20;
      let canDelete = needsDeleted;
      for (let i = 0; i <= 2; i++) {
        const toDelete = Math.min(canDeleteForChange[i] * (1 + i), canDelete);
        canDelete -= toDelete;
        needsChange -= Math.floor(toDelete / (1 + i));
      }
      needsChange -= Math.floor(Math.max(canDelete, 0) / 3);
      return needsDeleted + Math.max(needsChange, needsSpecial);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.trim() === '') {
      alert('Please enter the password.');
      return;
    }

    if (passwordChecker(password) === 0) {
    } else {
      alert('The password entered is weak or invalid. Please correct it.');
      return;
    }
    setSubmittedData((prev) => [...prev, password]);
    setPassword('');
  };

  return (
    <Container className="mt-5">
      <ICard />
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col xs={5}>
            <Form.Group controlId="formName">
              <Form.Control
                type="text"
                value={password}
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs={2}>
            <Button type="submit">Submit</Button>
          </Col>
        </Row>
      </Form>
      <div className="mt-4">
        {submittedData.length > 0 ? (
          <div>
            <h3>Valid Password:</h3>
            <ul>
              {submittedData.map((password, index) => (
                <li key={index}>Password: {password}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No data submitted yet.</p>
        )}
      </div>
    </Container>
  );
};

export default App;

const ICard = memo(() => {
  return (
    <Card style={{ marginBottom: 16, padding: 16 }}>
      <Card.Title>
        A strong password should meet the following criteria
      </Card.Title>
      <Card.Body>
        * - Have a minimum length of 6 characters.
        <br />
        * - Have a maximum length of 20 characters.
        <br />
        * - Contain at least one digit ('0' to '9'). <br />
        * - Contain at least one lowercase letter ('a' to 'z').
        <br />
        * - Contain at least one uppercase letter ('A' to'Z').
        <br />* - Should not have any three consecutive repeating characters.
      </Card.Body>
    </Card>
  );
});

/** 
 *  for fetch method

const fetchPasswords = () => {
  axios
    .get(`${endpoint}/api/passwords`)
    .then((response) => {
    })
    .catch((error) => {
      console.error(error);
    });
};

 * for post method

  axios
  .post(`${endpoint}/api/passwords`, newPassword)
  .then(() => {})
  .catch((error) => {
    console.error(error);
});

*/

/** 

// For server


const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/password_storage', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error('MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const passwordSchema = new mongoose.Schema({
  password: String,
});

const PasswordModel = mongoose.model('Password', passwordSchema);

app.use(bodyParser.json());

// POST endpoint to save the password
app.post('/api/password', (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required.' });
  }

  const newPassword = new PasswordModel({ password });

  newPassword.save((err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error saving password.' });
    }

    return res.status(201).json({ message: 'Password saved successfully.' });
  });
});

// GET endpoint to retrieve all saved passwords as an array
app.get('/api/passwords', (req, res) => {
  PasswordModel.find({}, 'password', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error retrieving passwords.' });
    }

    const passwords = data.map((item) => item.password);
    return res.json({ passwords });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

*/
