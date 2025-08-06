const express = require('express');
const cors = require('cors');
const ticketsRouter = require('./tickets');
const patientsRouter = require('./patients');
const doctorsRouter = require('./doctors'); // 👈 Add this line

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/tickets', ticketsRouter);
app.use('/api/patients', patientsRouter);
app.use('/api/doctors', doctorsRouter); // 👈 And add this line

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});