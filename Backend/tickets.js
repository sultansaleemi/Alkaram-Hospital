const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'sultan',
  password: 'jannatsaleemi',
  database: 'hospital'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Server for tickets!');
});

// Fetch tickets with optional patientId or phoneNumber filter
router.get('/', (req, res) => {
  const { patientId, phoneNumber } = req.query;
  let query = 'SELECT * FROM tickets';
  const params = [];

  if (patientId) {
    query += ' WHERE patientId = ?';
    params.push(patientId);
  } else if (phoneNumber) {
    query += ' WHERE phoneNumber = ?';
    params.push(phoneNumber);
  }

  connection.query(query, params, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Create ticket with patient ID logic
router.post('/', (req, res) => {
  const ticket = req.body;

  connection.beginTransaction((err) => {
    if (err) return res.status(500).send(err);

    connection.query(
      'SELECT id FROM patients WHERE phoneNumber = ?',
      [ticket.phoneNumber],
      (err, patientResults) => {
        if (err) {
          return connection.rollback(() => res.status(500).send(err));
        }

        let patientId;
        if (patientResults.length > 0) {
          patientId = patientResults[0].id; // Reuse existing patientId
          insertTicket(patientId);
        } else {
          connection.query(
            'INSERT INTO patients (patientName, phoneNumber, age) VALUES (?, ?, ?)',
            [ticket.patientName, ticket.phoneNumber, ticket.age],
            (err, result) => {
              if (err) {
                return connection.rollback(() => res.status(500).send(err));
              }
              patientId = result.insertId; // Set patientId for new patient
              insertTicket(patientId);
            }
          );
        }

        function insertTicket(pid) {
          connection.query(
            'INSERT INTO tickets SET ?',
            { ...ticket, patientId: pid },
            (err, result) => {
              if (err) {
                return connection.rollback(() => res.status(500).send(err));
              }

              connection.query(
                'SELECT * FROM tickets WHERE id = ?',
                [result.insertId],
                (err, rows) => {
                  if (err) {
                    return connection.rollback(() => res.status(500).send(err));
                  }
                  connection.commit(() => res.status(201).send(rows[0]));
                }
              );
            }
          );
        }
      }
    );
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const ticket = req.body;
  connection.query(
    'UPDATE tickets SET ? WHERE id = ?',
    [ticket, id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send({ id, ...ticket });
    }
  );
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM tickets WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.status(204).send();
  });
});

module.exports = router;