/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  Card,
  Grid,
  TextField,
  MenuItem,
  Button,
  Box,
  Snackbar,
  Alert,
  Pagination,
  Fade,
  Divider,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { keyframes } from '@emotion/react';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import TodayTicketCard from './TodayTicketCard';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import logo from '../../../assets/images/small-logos/Untitled-2.png';

const slideUp = keyframes`
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideInOrbit = keyframes`
  from {
    transform: translateX(-50px) rotate(-45deg);
    opacity: 0;
  }
  to {
    transform: translateX(0) rotate(0deg);
    opacity: 1;
  }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0px #00bcd4; }
  50% { box-shadow: 0 0 15px #00bcd4, 0 0 30px #00bcd4; }
  100% { box-shadow: 0 0 0px #00bcd4; }
`;

const orbit = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(2, 136, 209, 0.3); }
  50% { box-shadow: 0 0 20px rgba(2, 136, 209, 0.7); }
  100% { box-shadow: 0 0 5px rgba(2, 136, 209, 0.3); }
`;

const genders = ['Male', 'Female', 'Other'];
const perPage = 10;

const GenerateTicket = () => {
  const [ticketNumber, setTicketNumber] = useState(1);
  const [referenceNumber, setReferenceNumber] = useState(1);
  const [newTicketForm, setNewTicketForm] = useState({
    patientName: '',
    phoneNumber: '',
    age: '',
    gender: '',
    doctorName: '',
    department: '',
    amount: '',
    temperature: '',
    bp: '',
  });
  const [editForm, setEditForm] = useState({
    id: null,
    patientName: '',
    phoneNumber: '',
    age: '',
    gender: '',
    doctorName: '',
    department: '',
    amount: '',
    temperature: '',
    bp: '',
  });
  const [tickets, setTickets] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [alert, setAlert] = useState(null);
  const [todayPage, setTodayPage] = useState(1);
  const [yesterdayPage, setYesterdayPage] = useState(1);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  // Derive unique departments from doctors
  const uniqueDepartments = [...new Set(doctors.map(doc => doc.department).filter(dept => dept))];

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/doctors');
      setDoctors(response.data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setAlert({ type: 'error', message: 'Failed to fetch doctors.' });
    }
  };

  const fetchTickets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tickets');
      setTickets(response.data);
      const today = new Date();
      const todayTickets = response.data.filter((ticket) => {
        const ticketDate = new Date(ticket.createdAt);
        return !isNaN(ticketDate) && ticketDate.toDateString() === today.toDateString();
      });
      setTicketNumber(todayTickets.length + 1 || 1);
      const storedRef = localStorage.getItem('lastReferenceNumber');
      setReferenceNumber(storedRef ? parseInt(storedRef) : 1);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setAlert({ type: 'error', message: 'Failed to fetch tickets.' });
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchDoctors();
  }, []);

  const handleNewTicketChange = (e) => {
    const { name, value } = e.target;
    if (name === 'doctorName') {
      const selectedDoctor = doctors.find((doc) => doc.name === value);
      if (selectedDoctor) {
        setNewTicketForm({
          ...newTicketForm,
          doctorName: value,
          department: selectedDoctor.department || '',
          amount: selectedDoctor.consultationFee || '',
        });
      } else {
        setNewTicketForm({
          ...newTicketForm,
          doctorName: value,
          department: '',
          amount: '',
        });
      }
    } else {
      setNewTicketForm({ ...newTicketForm, [name]: value });
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === 'doctorName') {
      const selectedDoctor = doctors.find((doc) => doc.name === value);
      if (selectedDoctor) {
        setEditForm({
          ...editForm,
          doctorName: value,
          department: selectedDoctor.department || '',
          amount: selectedDoctor.consultationFee || '',
        });
      } else {
        setEditForm({
          ...editForm,
          doctorName: value,
          department: '',
          amount: '',
        });
      }
    } else {
      setEditForm({ ...editForm, [name]: value });
    }
  };

  const handleResetReference = () => {
    setReferenceNumber(1);
    localStorage.setItem('lastReferenceNumber', 1);
    setAlert({ type: 'success', message: 'Reference number reset to 1.' });
    setOpenResetDialog(false);
  };

  const printTicket = (ticket) => {
    const createdAtDate = ticket.createdAt ? new Date(ticket.createdAt) : new Date();
    const formattedDate = isNaN(createdAtDate) ? 'N/A' : createdAtDate.toLocaleDateString();

    const content = `
      <html>
        <head>
          <title>Print Prescription</title>
          <style>
            @page {
              size: A4;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: 'Arial', sans-serif;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .prescription {
              width: 210mm;
              height: 297mm;
              position: relative;
              padding: 30px;
              box-sizing: border-box;
              page-break-after: always;
              border-left: 15px solid #0288d1;
              display: flex;
              flex-direction: column;
            }
            .no-print {
              display: none !important;
            }
            .header {
              display: flex;
              align-items: center;
              margin-bottom: 5px;
            }
            .header-content {
              flex: 1;
              text-align: center;
            }
            .hospital-logo {
              width: 60px;
              margin-right: 10px;
            }
            .hospital-logo img {
              max-width: 100%;
              max-height: 60px;
            }
            .hospital-name {
              font-size: 22px;
              font-weight: bold;
              color: #0288d1;
              margin-bottom: 3px;
              text-transform: uppercase;
            }
            .hospital-address, .hospital-contact {
              font-size: 12px;
              color: #333;
              margin-bottom: 3px;
            }
            .header-line {
              border-top: 2px solid #0288d1;
              margin-bottom: 10px;
            }
            .doctor-info {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 10px;
            }
            .doctor-name {
              font-size: 18px;
              font-weight: bold;
              color: #0288d1;
            }
            .ticket-number {
              font-size: 12px;
              color: #333;
            }
            .info {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 5px;
              font-size: 12px;
              margin-bottom: 10px;
            }
            .info p {
              margin: 3px 0;
            }
            .diagnosis {
              font-size: 13px;
              display: flex;
              margin-bottom: 10px;
            }
            .diagnosis strong {
              display: block;
              margin-bottom: 3px;
            }
            .rx {
              font-family: 'Times New Roman', serif;
              font-size: 48px;
              font-weight: bold;
              color: #0288d1;
              margin: 5px 0 10px 0;
              position: relative;
              display: inline-block;
            }
            .rx:after {
              content: "";
              position: absolute;
              bottom: 5px;
              left: 0;
              width: 100%;
              height: 2px;
              background: #0288d1;
              transform: rotate(179deg);
            }
            .prescription-content {
              flex: 1;
              padding: 5px;
              min-height: 150px;
              font-size: 13px;
            }
            .footer {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              margin-top: 10px;
            }
            .signature {
              text-align: center;
              width: 150px;
            }
            .signature-line {
              border-top: 1px solid #0288d1;
              width: 120px;
              margin: 0 auto;
              padding-top: 3px;
            }
            .test-section {
              margin-top: 15px;
              border-top: 2px dashed #0288d1;
              padding-top: 8px;
            }
            .test-title {
              font-size: 14px;
              font-weight: bold;
              color: #0288d1;
              margin-bottom: 5px;
            }
            .test-content {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 8px;
              font-size: 10px;
            }
            .test-item {
              display: flex;
              align-items: center;
            }
            .test-checkbox {
              margin-right: 5px;
            }
            .clinic-info {
              margin-top: 10px;
              padding-top: 5px;
              text-align: center;
              font-size: 11px;
              color: #546e7a;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .prescription {
                border-left: 15px solid #0288d1 !important;
              }
              .header-line {
                border-top: 2px solid #0288d1 !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="prescription">
            <div class="header">
              <div class="hospital-logo">
                <img src="${logo}" alt="Hospital Logo">
              </div>
              <div class="header-content">
                <div class="hospital-name">AL-KARAM MEMORIAL HOSPITAL</div>
                <div class="hospital-address">Opposite Gala mountain Wala, Mehudi Shah Road, Wazirabad</div>
                <div class="hospital-contact">Phone #.055-6606800.Mobile # 0300-6283703</div>
              </div>
            </div>
            <div class="header-line"></div>
            <div class="doctor-info">
              <div class="doctor-name">${ticket.doctorName}</div>
              <div class="ticket-number info">
                <strong>Ticket #:</strong> ${ticket.ticketNumber || 'N/A'} &nbsp; 
                <strong>Date:</strong> ${formattedDate}
              </div>
            </div>
            <div class="info">
              <p><strong>Patient Name:</strong> ${ticket.patientName}</p>
              <p><strong>Gender:</strong>${ticket.gender}</p>
              <p><strong>Age:</strong> ${ticket.age}</p>
              <p><strong>Phone Number:</strong> ${ticket.phoneNumber}</p>
              <p><strong>BP:</strong> ${ticket.bp || '--'}</p>
              <p><strong>Temp:</strong> ${ticket.temperature || '--'}&deg;C</p>
              <p><strong>Rs:</strong> ${ticket.amount}</p>
              <p><strong>Department:</strong>${ticket.department || ''}</p>
            </div>
            <div class="diagnosis">
              <strong>Diagnosis:</strong>
            </div>
            <div class="rx">℞</div>
            <div class="prescription-content">
              ${ticket.prescription || '<br><br><br><br><br><br><br><br>'}
            </div>
            <div class="signature">
              <div class="signature-line"></div>
              <div>Doctor's Signature</div>
            </div>
            <div class="test-section">
              <div class="test-title">LABORATORY INVESTIGATIONS</div>
              <div class="test-content">
                <div class="test-item"><span class="test-checkbox">□</span> CBC</div>
                <div class="test-item"><span class="test-checkbox">□</span> RFT</div>
                <div class="test-item"><span class="test-checkbox">□</span> LFT</div>
                <div class="test-item"><span class="test-checkbox">□</span> Blood Sugar (F)</div>
                <div class="test-item"><span class="test-checkbox">□</span> Blood Sugar (R)</div>
                <div class="test-item"><span class="test-checkbox">□</span> Lipid Profile</div>
                <div class="test-item"><span class="test-checkbox">□</span> Uric Acid</div>
                <div class="test-item"><span class="test-checkbox">□</span> Urine DR</div>
                <div class="test-item"><span class="test-checkbox">□</span> TSH</div>
                <div class="test-item"><span class="test-checkbox">□</span> T3/T4</div>
                <div class="test-item"><span class="test-checkbox">□</span> Hepatitis BsAg</div>
                <div class="test-item"><span class="test-checkbox">□</span> HCV</div>
                <div class="test-item"><span class="test-checkbox">□</span> HIV</div>
                <div class="test-item"><span class="test-checkbox">□</span> Malaria Parasite</div>
                <div class="test-item"><span class="test-checkbox">□</span> Typhoid Test</div>
                <div class="test-item"><span class="test-checkbox">□</span> COVID-19 Test</div>
              </div>
            </div>
            <div class="footer">
              <div></div>
            </div>
            <div class="clinic-info">
              AL-KARAM MEMORIAL HOSPITAL &nbsp; | &nbsp; 
              Opposite Gala mountain Wala, Mehudi Shah Road, Wazirabad &nbsp; | &nbsp; 
              Phone #.055-6606800.Mobile # 0300-6283703
            </div>
          </div>
        </body>
      </html>
    `;
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.open();
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  const handleSubmit = async () => {
    const {
      patientName,
      phoneNumber,
      age,
      gender,
      doctorName,
      department,
      amount,
      temperature,
      bp,
    } = newTicketForm;

    if (
      !patientName ||
      !phoneNumber ||
      !age ||
      !gender ||
      !doctorName ||
      !department ||
      !amount ||
      !temperature ||
      !bp
    ) {
      setAlert({ type: 'error', message: 'Please complete all fields.' });
      return;
    }

    const newTicket = {
      patientName,
      phoneNumber,
      age,
      gender,
      doctorName,
      department,
      amount,
      temperature,
      bp,
      ticketNumber,
      referenceNumber,
    };

    try {
      const ticketResponse = await axios.post('http://192.168.1.7:5000/api/tickets', newTicket);
      setAlert({ type: 'success', message: 'Ticket and patient registered!' });

      setNewTicketForm({
        patientName: '',
        phoneNumber: '',
        age: '',
        gender: '',
        doctorName: '',
        department: '',
        amount: '',
        temperature: '',
        bp: '',
      });
      const newReferenceNumber = referenceNumber + 1;
      setReferenceNumber(newReferenceNumber);
      localStorage.setItem('lastReferenceNumber', newReferenceNumber);
      fetchTickets();
      printTicket(ticketResponse.data);
    } catch (err) {
      console.error('Error adding ticket or patient:', err);
      setAlert({ type: 'error', message: 'Failed to generate ticket or save patient.' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://192.168.1.7:5000/api/tickets/${id}`);
      setAlert({ type: 'success', message: 'Ticket deleted successfully.' });
      fetchTickets();
    } catch (err) {
      console.error('Error deleting ticket:', err);
      setAlert({ type: 'error', message: 'Failed to delete ticket.' });
    }
  };

  const handleEdit = (ticket) => {
    setEditForm({
      id: ticket.id,
      patientName: ticket.patientName,
      phoneNumber: ticket.phoneNumber,
      age: ticket.age,
      gender: ticket.gender,
      doctorName: ticket.doctorName,
      department: ticket.department,
      amount: ticket.amount, // Assuming ticket data has 'amount'
      temperature: ticket.temperature,
      bp: ticket.bp,
    });
    setOpenEditDialog(true);
  };

  const handleUpdateTicket = async () => {
    if (editForm.id) {
      try {
        await axios.put(`http://192.168.1.7:5000/api/tickets/${editForm.id}`, editForm);
        setAlert({ type: 'success', message: 'Ticket updated successfully!' });
        setOpenEditDialog(false);
        fetchTickets();
      } catch (err) {
        console.error('Error updating ticket:', err);
        setAlert({ type: 'error', message: 'Failed to update ticket.' });
      }
    }
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditForm({
      id: null,
      patientName: '',
      phoneNumber: '',
      age: '',
      gender: '',
      doctorName: '',
      department: '',
      amount: '',
      temperature: '',
      bp: '',
    });
  };

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const todayTickets = tickets.filter((ticket) => {
    if (!ticket.createdAt) {
      console.warn('Ticket missing createdAt:', ticket);
      return false;
    }
    const ticketDate = new Date(ticket.createdAt);
    return !isNaN(ticketDate) && ticketDate.toDateString() === today.toDateString();
  });

  const yesterdayTickets = tickets.filter((ticket) => {
    if (!ticket.createdAt) {
      console.warn('Ticket missing createdAt:', ticket);
      return false;
    }
    const ticketDate = new Date(ticket.createdAt);
    return !isNaN(ticketDate) && ticketDate.toDateString() === yesterday.toDateString();
  });

  const paginatedTodayTickets = todayTickets.slice((todayPage - 1) * perPage, todayPage * perPage);
  const paginatedYesterdayTickets = yesterdayTickets.slice((yesterdayPage - 1) * perPage, yesterdayPage * perPage);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box p={4} sx={{ minHeight: '100vh' }}>
        <Grid container spacing={4} sx={{ maxWidth: '1400px', mx: 'auto' }}>
          {/* First Row: Form and Today's Tickets */}
          <Grid item xs={12} md={6}>
            <Fade in timeout={1000}>
              <Card
                sx={{
                  p: 5,
                  borderRadius: '20px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                  backdropFilter: 'blur(15px)',
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  background: 'radial-gradient(circle, rgba(0, 188, 212, 0.1) 0%, rgba(255, 255, 255, 0.9) 70%)',
                  animation: `${slideUp} 1s ease`,
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-10px',
                    left: '-10px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'rgba(0, 188, 212, 0.3)',
                    animation: `${orbit} 10s linear infinite`,
                  },
                }}
              >
                <Typography
                  variant="h3"
                  align="center"
                  sx={{
                    color: '#00bcd4',
                    fontWeight: 'bold',
                    mb: 4,
                    textShadow: '1px 1px 5px rgba(0, 188, 212, 0.5)',
                    animation: `${slideInOrbit} 1s ease`,
                  }}
                >
                  Generate Patient Ticket
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} container alignItems="center" spacing={2}>
                    <Grid item xs>
                      <TextField
                        label="Reference #"
                        value={referenceNumber}
                        disabled
                        fullWidth
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            bgcolor: 'rgba(227, 242, 253, 0.5)',
                            transition: 'all 0.3s ease',
                            '&:hover': { animation: `${glow} 1.5s infinite` },
                          },
                          '& .MuiInputLabel-root': {
                            color: '#00bcd4',
                            fontWeight: 'medium',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <IconButton
                        onClick={() => setOpenResetDialog(true)}
                        sx={{
                          color: '#00bcd4',
                          '&:hover': {
                            bgcolor: 'rgba(0, 188, 212, 0.1)',
                            transform: 'rotate(360deg)',
                            transition: 'transform 0.5s ease',
                          },
                        }}
                        title="Reset Reference Number"
                      >
                        <RefreshIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Ticket #"
                      value={ticketNumber}
                      disabled
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          bgcolor: 'rgba(227, 242, 253, 0.5)',
                          transition: 'all 0.3s ease',
                          '&:hover': { animation: `${glow} 1.5s infinite` },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#00bcd4',
                          fontWeight: 'medium',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <TextField
                      label="Patient Name"
                      name="patientName"
                      value={newTicketForm.patientName}
                      onChange={handleNewTicketChange}
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          transition: 'all 0.3s ease',
                          animation: `${slideInOrbit} 0.7s ease forwards`,
                          '&:hover fieldset': { borderColor: '#00bcd4' },
                          '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#00bcd4',
                          fontWeight: 'medium',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Phone Number"
                      name="phoneNumber"
                      value={newTicketForm.phoneNumber}
                      onChange={handleNewTicketChange}
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          transition: 'all 0.3s ease',
                          animation: `${slideInOrbit} 0.8s ease forwards`,
                          '&:hover fieldset': { borderColor: '#00bcd4' },
                          '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#00bcd4',
                          fontWeight: 'medium',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Age"
                      name="age"
                      value={newTicketForm.age}
                      onChange={handleNewTicketChange}
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          transition: 'all 0.3s ease',
                          animation: `${slideInOrbit} 0.9s ease forwards`,
                          '&:hover fieldset': { borderColor: '#00bcd4' },
                          '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#00bcd4',
                          fontWeight: 'medium',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label="Gender"
                      name="gender"
                      value={newTicketForm.gender}
                      onChange={handleNewTicketChange}
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          transition: 'all 0.3s ease',
                          animation: `${slideInOrbit} 0.7s ease forwards`,
                          '&:hover fieldset': { borderColor: '#00bcd4' },
                          '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#00bcd4',
                          fontWeight: 'medium',
                        },
                        '& .MuiSelect-select': {
                          padding: '0.75rem !important',
                        },
                      }}
                    >
                      {genders.map((gender) => (
                        <MenuItem key={gender} value={gender}>
                          {gender}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label="Doctor"
                      name="doctorName"
                      value={newTicketForm.doctorName}
                      onChange={handleNewTicketChange}
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          transition: 'all 0.3s ease',
                          animation: `${slideInOrbit} 0.7s ease forwards`,
                          '&:hover fieldset': { borderColor: '#00bcd4' },
                          '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#00bcd4',
                          fontWeight: 'medium',
                        },
                        '& .MuiSelect-select': {
                          padding: '0.75rem !important',
                        },
                      }}
                    >
                      {doctors.map((doc) => (
                        <MenuItem key={doc.id} value={doc.name}>
                          {doc.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label="Department"
                      name="department"
                      value={newTicketForm.department}
                      onChange={handleNewTicketChange}
                      fullWidth
                      variant="outlined"
                      disabled={!!newTicketForm.doctorName}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          transition: 'all 0.3s ease',
                          animation: `${slideInOrbit} 1.2s ease forwards`,
                          '&:hover fieldset': { borderColor: '#00bcd4' },
                          '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#00bcd4',
                          fontWeight: 'medium',
                        },
                        '& .MuiSelect-select': {
                          padding: '0.75rem !important',
                        },
                      }}
                    >
                      {uniqueDepartments.map((dept) => (
                        <MenuItem key={dept} value={dept}>
                          {dept}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Amount"
                      name="amount"
                      value={newTicketForm.amount}
                      onChange={handleNewTicketChange}
                      fullWidth
                      variant="outlined"
                      disabled={!!newTicketForm.doctorName}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          transition: 'all 0.3s ease',
                          animation: `${slideInOrbit} 1.3s ease forwards`,
                          '&:hover fieldset': { borderColor: '#00bcd4' },
                          '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#00bcd4',
                          fontWeight: 'medium',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Temperature (°C)"
                      name="temperature"
                      value={newTicketForm.temperature}
                      onChange={handleNewTicketChange}
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          transition: 'all 0.3s ease',
                          animation: `${slideInOrbit} 1.4s ease forwards`,
                          '&:hover fieldset': { borderColor: '#00bcd4' },
                          '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#00bcd4',
                          fontWeight: 'medium',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Blood Pressure"
                      name="bp"
                      value={newTicketForm.bp}
                      onChange={handleNewTicketChange}
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          transition: 'all 0.3s ease',
                          animation: `${slideInOrbit} 1.5s ease forwards`,
                          '&:hover fieldset': { borderColor: '#00bcd4' },
                          '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#00bcd4',
                          fontWeight: 'medium',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="center">
                      <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{
                          px: 8,
                          py: 2.5,
                          fontWeight: 'bold',
                          fontSize: '1.2rem',
                          borderRadius: '20px',
                          bgcolor: '#00bcd4',
                          color: '#fff',
                          textTransform: 'none',
                          boxShadow: '0 10px 30px rgba(0, 188, 212, 0.4)',
                          transition: 'all 0.3s ease',
                          animation: `${pulseGlow} 3s infinite`,
                          '&:hover': {
                            bgcolor: '#0097a7',
                            boxShadow: '0 15px 40px rgba(0, 188, 212, 0.6)',
                            transform: 'scale(1.05)',
                          },
                        }}
                      >
                        Generate Ticket & Print
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Fade>
          </Grid>

          <Grid item xs={12} md={6}>
            <Fade in timeout={1200}>
              <Box
                sx={{
                  height: 'calc(100vh - 300px)',
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#00bcd4',
                    borderRadius: '4px',
                    '&:hover': {
                      background: '#0097a7',
                    },
                  },
                  paddingBottom: '20px',
                  animation: `${slideUp} 1.2s ease`,
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{
                    color: '#00bcd4',
                    mb: 3,
                    textShadow: '1px 1px 5px rgba(0, 188, 212, 0.5)',
                  }}
                >
                  Todays Tickets
                </Typography>
                <Divider sx={{ mb: 4, borderColor: 'rgba(0, 188, 212, 0.3)' }} />
                <Grid container spacing={3}>
                  {paginatedTodayTickets.length > 0 ? (
                    paginatedTodayTickets.map((ticket, index) => (
                      <Grid item xs={12} key={ticket.id}>
                        <Fade in timeout={1400 + index * 200}>
                          <Box
                            sx={{
                              transition: 'transform 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.03)',
                              },
                            }}
                          >
                            <TodayTicketCard
                              ticket={{ ...ticket, referenceNumber: String(ticket.referenceNumber) }}
                              onDelete={handleDelete}
                              onPrint={() => printTicket(ticket)}
                              onEdit={handleEdit}
                              userRole="receptionist"
                            />
                          </Box>
                        </Fade>
                      </Grid>
                    ))
                  ) : (
                    <Typography sx={{ color: '#757575' }}>No tickets today.</Typography>
                  )}
                </Grid>
                {todayTickets.length > perPage && (
                  <Box mt={4} display="flex" justifyContent="center">
                    <Pagination
                      count={Math.ceil(todayTickets.length / perPage)}
                      page={todayPage}
                      onChange={(e, val) => setTodayPage(val)}
                      color="primary"
                      size="large"
                      sx={{
                        '& .MuiPaginationItem-root': {
                          borderRadius: '12px',
                          color: '#00bcd4',
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          fontWeight: 'bold',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: 'rgba(0, 188, 212, 0.3)',
                          },
                          '&.Mui-selected': {
                            bgcolor: '#00bcd4',
                            color: '#ffffff',
                            '&:hover': {
                              bgcolor: '#0097a7',
                            },
                          },
                        },
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Fade>
          </Grid>
        </Grid>

        {/* Second Row: Yesterday's Tickets */}
        <Grid container spacing={4} sx={{ maxWidth: '1400px', mx: 'auto', mt: 4 }}>
          <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
            <Fade in timeout={1200}>
              <Box
                sx={{
                  height: 'auto',
                  overflowX: 'auto',
                  '&::-webkit-scrollbar': {
                    height: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#00bcd4',
                    borderRadius: '4px',
                    '&:hover': {
                      background: '#0097a7',
                    },
                  },
                  paddingBottom: '20px',
                  animation: `${slideUp} 1.2s ease`,
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{
                    color: '#00bcd4',
                    mb: 3,
                    textShadow: '1px 1px 5px rgba(0, 188, 212, 0.5)',
                  }}
                >
                  Yesterdays Tickets
                </Typography>
                <Divider sx={{ mb: 4, borderColor: 'rgba(0, 188, 212, 0.3)' }} />
                <Grid container spacing={2} sx={{ flexWrap: 'nowrap' }}>
                  {paginatedYesterdayTickets.length > 0 ? (
                    paginatedYesterdayTickets.map((ticket, index) => (
                      <Grid item key={ticket.id} sx={{ minWidth: '300px', marginRight: '20px' }}>
                        <Fade in timeout={1400 + index * 200}>
                          <Box
                            sx={{
                              transition: 'transform 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.03)',
                              },
                            }}
                          >
                            <TodayTicketCard
                              ticket={{ ...ticket, referenceNumber: String(ticket.referenceNumber) }}
                              onDelete={handleDelete}
                              onPrint={() => printTicket(ticket)}
                              onEdit={handleEdit}
                              userRole="receptionist"
                            />
                          </Box>
                        </Fade>
                      </Grid>
                    ))
                  ) : (
                    <Typography sx={{ color: '#757575' }}>No tickets from yesterday.</Typography>
                  )}
                </Grid>
                {yesterdayTickets.length > perPage && (
                  <Box mt={4} display="flex" justifyContent="center">
                    <Pagination
                      count={Math.ceil(yesterdayTickets.length / perPage)}
                      page={yesterdayPage}
                      onChange={(e, val) => setYesterdayPage(val)}
                      color="primary"
                      size="large"
                      sx={{
                        '& .MuiPaginationItem-root': {
                          borderRadius: '12px',
                          color: '#00bcd4',
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          fontWeight: 'bold',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: 'rgba(0, 188, 212, 0.3)',
                          },
                          '&.Mui-selected': {
                            bgcolor: '#00bcd4',
                            color: '#ffffff',
                            '&:hover': {
                              bgcolor: '#0097a7',
                            },
                          },
                        },
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Fade>
          </Grid>
        </Grid>

        <Snackbar
          open={!!alert}
          autoHideDuration={3000}
          onClose={() => setAlert(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          {alert && (
            <Alert
              severity={alert.type}
              sx={{
                borderRadius: '12px',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                bgcolor: alert.type === 'success' ? '#e0f7fa' : '#ffebee',
                color: alert.type === 'success' ? '#00bcd4' : '#d32f2f',
                fontWeight: 'medium',
              }}
            >
              {alert.message}
            </Alert>
          )}
        </Snackbar>

        <Dialog
          open={openResetDialog}
          onClose={() => setOpenResetDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              bgcolor: 'rgba(255, 255, 255, 0.9)',
            },
          }}
        >
          <DialogTitle sx={{ color: '#00bcd4', fontWeight: 'bold' }}>
            Reset Reference Number
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: '#263238' }}>
              Are you sure you want to reset the reference number to 1? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenResetDialog(false)}
              sx={{
                color: '#546e7a',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'rgba(0, 188, 212, 0.1)',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleResetReference}
              sx={{
                color: '#ffffff',
                bgcolor: '#00bcd4',
                textTransform: 'none',
                borderRadius: '8px',
                '&:hover': {
                  bgcolor: '#0097a7',
                },
              }}
            >
              Reset
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          PaperProps={{
            sx: {
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              bgcolor: 'rgba(255, 255, 255, 0.9)',
            },
          }}
        >
          <DialogTitle sx={{ color: '#00bcd4', fontWeight: 'bold' }}>
            Edit Ticket
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: '#263238', mb: 2 }}>
              Update the ticket details below.
            </DialogContentText>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Patient Name"
                  name="patientName"
                  value={editForm.patientName}
                  onChange={handleEditChange}
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                    '& .MuiInputLabel-root': { color: '#00bcd4' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  name="phoneNumber"
                  value={editForm.phoneNumber}
                  onChange={handleEditChange}
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                    '& .MuiInputLabel-root': { color: '#00bcd4' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Age"
                  name="age"
                  value={editForm.age}
                  onChange={handleEditChange}
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                    '& .MuiInputLabel-root': { color: '#00bcd4' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Gender"
                  name="gender"
                  value={editForm.gender}
                  onChange={handleEditChange}
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                    '& .MuiInputLabel-root': { color: '#00bcd4' },
                    '& .MuiSelect-select': {
                      padding: '0.75rem !important',
                    },
                  }}
                >
                  {genders.map((gender) => (
                    <MenuItem key={gender} value={gender}>
                      {gender}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Doctor"
                  name="doctorName"
                  value={editForm.doctorName}
                  onChange={handleEditChange}
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                    '& .MuiInputLabel-root': { color: '#00bcd4' },
                    '& .MuiSelect-select': {
                      padding: '0.75rem !important',
                    },
                  }}
                >
                  {doctors.map((doc) => (
                    <MenuItem key={doc.id} value={doc.name}>
                      {doc.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Department"
                  name="department"
                  value={editForm.department}
                  onChange={handleEditChange}
                  fullWidth
                  variant="outlined"
                  disabled={!!editForm.doctorName}
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                    '& .MuiInputLabel-root': { color: '#00bcd4' },
                    '& .MuiSelect-select': {
                      padding: '0.75rem !important',
                    },
                  }}
                >
                  {uniqueDepartments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Amount"
                  name="amount"
                  value={editForm.amount}
                  onChange={handleEditChange}
                  fullWidth
                  variant="outlined"
                  disabled={!!editForm.doctorName}
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                    '& .MuiInputLabel-root': { color: '#00bcd4' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Temperature (°C)"
                  name="temperature"
                  value={editForm.temperature}
                  onChange={handleEditChange}
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                    '& .MuiInputLabel-root': { color: '#00bcd4' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Blood Pressure"
                  name="bp"
                  value={editForm.bp}
                  onChange={handleEditChange}
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                    '& .MuiInputLabel-root': { color: '#00bcd4' },
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseEditDialog}
              sx={{ color: '#546e7a', textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateTicket}
              sx={{
                color: '#ffffff',
                bgcolor: '#00bcd4',
                textTransform: 'none',
                borderRadius: '8px',
                '&:hover': { bgcolor: '#0097a7' },
              }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default GenerateTicket;