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
