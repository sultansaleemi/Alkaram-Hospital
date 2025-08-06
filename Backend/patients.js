const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'sultan',
  password: 'jannatsaleemi',
  database: 'hospital',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(connection => {
    console.log('Connected to MySQL Server for patients!');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

router.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query('SELECT * FROM patients');
    connection.release();
    res.json(results);
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).json({ message: 'Error fetching patients' });
  }
});

router.post('/', async (req, res) => {
  const patient = req.body;
  if (!patient.patientName || !patient.phoneNumber || !patient.age) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO patients (patientName, phoneNumber, age) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE patientName = VALUES(patientName), age = VALUES(age)',
      [patient.patientName, patient.phoneNumber, patient.age]
    );
    const [rows] = await connection.query(
      'SELECT * FROM patients WHERE id = ?',
      [result.insertId || (result.affectedRows > 1 ? result.insertId : null)]
    );
    connection.release();
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error adding/updating patient:', err);
    res.status(500).json({ message: 'Error adding/updating patient' });
  }
});

module.exports = router;