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
    console.log('Connected to MySQL Server for doctors!');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

router.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query('SELECT * FROM doctors');
    connection.release();
    res.json(results);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ message: 'Error fetching doctors' });
  }
});

router.post('/', async (req, res) => {
  const doctor = req.body;
  const requiredFields = ['name', 'specialization', 'phone', 'email', 'gender', 'status', 'consultationFee', 'qualifications', 'experience', 'address', 'timings', 'department'];
  const missingFields = requiredFields.filter(field => !doctor[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
  }

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      `INSERT INTO doctors (
        name, specialization, phone, email, gender, status, consultationFee,
        qualifications, experience, address, timings, bio, profileImage, department, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        specialization = VALUES(specialization),
        phone = VALUES(phone),
        email = VALUES(email),
        gender = VALUES(gender),
        status = VALUES(status),
        consultationFee = VALUES(consultationFee),
        qualifications = VALUES(qualifications),
        experience = VALUES(experience),
        address = VALUES(address),
        timings = VALUES(timings),
        bio = VALUES(bio),
        profileImage = VALUES(profileImage),
        department = VALUES(department)`,
      [
        doctor.name,
        doctor.specialization,
        doctor.phone,
        doctor.email,
        doctor.gender,
        doctor.status,
        doctor.consultationFee,
        doctor.qualifications,
        doctor.experience,
        doctor.address,
        doctor.timings,
        doctor.bio || null,
        doctor.profileImage || null,
        doctor.department
      ]
    );
    const [rows] = await connection.query(
      'SELECT * FROM doctors WHERE id = ?',
      [result.insertId || (result.affectedRows > 1 ? result.insertId : null)]
    );
    connection.release();
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error adding/updating doctor:', err);
    res.status(500).json({ message: 'Error adding/updating doctor' });
  }
});

module.exports = router;