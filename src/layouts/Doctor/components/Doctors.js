/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Button,
  Box,
  CircularProgress,
  Modal,
  Paper,
  IconButton,
  TextField,
  MenuItem,
  Grid,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Person, Phone, Email, PersonOutline, Work, LocalHospital, MonetizationOn, Description, Schedule, AccountBalance, Image } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openTicketModal, setOpenTicketModal] = useState(false);
  const [selectedDoctorTickets, setSelectedDoctorTickets] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    specialization: '',
    phone: '',
    email: '',
    gender: '',
    status: '',
    consultationFee: '',
    qualifications: '',
    experience: '',
    address: '',
    timings: '',
    bio: '',
    profileImage: '',
    department: '',
  });
  const [alert, setAlert] = useState(null);

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
      console.log('Fetched tickets:', response.data); // Debug log
      setTickets(response.data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setAlert({ type: 'error', message: 'Failed to fetch tickets.' });
    }
  };

  useEffect(() => {
    Promise.all([fetchDoctors(), fetchTickets()]).then(() => setLoading(false));
  }, []);

  const handleOpenModal = (doctor = null) => {
    if (doctor) {
      setFormData({
        id: doctor.id,
        name: doctor.name,
        specialization: doctor.specialization,
        phone: doctor.phone,
        email: doctor.email,
        gender: doctor.gender,
        status: doctor.status,
        consultationFee: doctor.consultationFee,
        qualifications: doctor.qualifications,
        experience: doctor.experience,
        address: doctor.address,
        timings: doctor.timings,
        bio: doctor.bio,
        profileImage: doctor.profileImage,
        department: doctor.department,
      });
    } else {
      setFormData({
        id: null,
        name: 'Dr. ',
        specialization: '',
        phone: '',
        email: '',
        gender: '',
        status: '',
        consultationFee: '',
        qualifications: '',
        experience: '',
        address: '',
        timings: '',
        bio: '',
        profileImage: '',
        department: '',
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({
      id: null,
      name: '',
      specialization: '',
      phone: '',
      email: '',
      gender: '',
      status: '',
      consultationFee: '',
      qualifications: '',
      experience: '',
      address: '',
      timings: '',
      bio: '',
      profileImage: '',
      department: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      const cleanValue = value.startsWith('Dr. ') ? value : `Dr. ${value.replace(/^Dr\.?\s*/i, '')}`;
      setFormData((prev) => ({ ...prev, [name]: cleanValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.startsWith('Dr. ')) {
      setAlert({ type: 'error', message: 'Doctor name must start with "Dr. "' });
      return;
    }
    try {
      if (formData.id) {
        await axios.put(`http://localhost:5000/api/doctors/${formData.id}`, formData);
        setAlert({ type: 'success', message: 'Doctor updated successfully!' });
      } else {
        await axios.post('http://localhost:5000/api/doctors', formData);
        setAlert({ type: 'success', message: 'Doctor added successfully!' });
      }
      await fetchDoctors();
    } catch (err) {
      console.error('Error saving doctor:', err.response?.data || err.message);
      setAlert({
        type: 'error',
        message: `Failed to ${formData.id ? 'update' : 'add'} doctor: ${err.response?.data?.message || err.message}`,
      });
    }
    handleCloseModal();
  };

  const handleOpenTicketModal = (doctorId) => {
    const filteredTickets = tickets.filter((ticket) => {
      const ticketDate = new Date(ticket.createdAt);
      const formattedTicketDate = ticketDate.toISOString().split('T')[0];
      console.log(`Ticket ID: ${ticket.id}, createdAt: ${ticket.createdAt}, formatted: ${formattedTicketDate}, selectedDate: ${selectedDate}`); // Debug log
      return (
        !isNaN(ticketDate) &&
        formattedTicketDate === selectedDate &&
        ticket.doctorId === doctorId
      );
    });
    console.log('Filtered tickets:', filteredTickets); // Debug log
    setSelectedDoctorTickets(filteredTickets);
    if (filteredTickets.length === 0) {
      setAlert({ type: 'warning', message: `No tickets found for ${selectedDate}.` });
    }
    setOpenTicketModal(true);
  };

  const handleCloseTicketModal = () => {
    setOpenTicketModal(false);
    setSelectedDoctorTickets([]);
  };

  const getTicketCount = (doctorId) => {
    const count = tickets.filter(
      (ticket) => {
        const ticketDate = new Date(ticket.createdAt);
        const formattedTicketDate = ticketDate.toISOString().split('T')[0];
        return (
          ticket.doctorId === doctorId &&
          formattedTicketDate === selectedDate
        );
      }
    ).length;
    console.log(`Ticket count for doctor ${doctorId} on ${selectedDate}: ${count}`); // Debug log
    return count;
  };

  const calculateTotalAmount = (tickets) => {
    const total = tickets.reduce((sum, ticket) => {
      const fee = parseFloat(ticket.consultationFee) || 0; // Convert to number, default to 0 if invalid
      return sum + fee;
    }, 0);
    const doctorShare = total * 0.3; // 30% for doctor
    const hospitalShare = total * 0.7; // 70% for hospital
    return { total, doctorShare, hospitalShare };
  };

  const calculatePercentage = (part, total) => {
    if (total === 0) return '0%';
    return ((part / total) * 100).toFixed(2) + '%';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <Box p={4} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box p={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 700, color: '#0288d1', letterSpacing: '0.5px' }}
          >
            Doctor Records
          </Typography>
          <Button
            variant="contained"
            onClick={() => handleOpenModal()}
            sx={{
              textTransform: 'none',
              borderRadius: '20px',
              padding: '8px 24px',
              backgroundColor: '#0288d1 !important',
              color: '#ffffff !important',
              '&:hover': {
                backgroundColor: '#01579b !important',
                boxShadow: '0 4px 12px rgba(0, 136, 209, 0.3)',
              },
              animation: 'pulse 1.5s infinite',
            }}
          >
            Add Doctor
          </Button>
        </Box>
        <Card
          sx={{
            p: 3,
            boxShadow: '0 6px 20px rgba(0, 136, 209, 0.1)',
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 10px 30px rgba(0, 136, 209, 0.2)',
            },
          }}
        >
          <MDBox
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            py={1}
            px={2}
            mb={1}
            borderRadius="lg"
            sx={{
              background: 'linear-gradient(90deg, #e3f2fd, #bbdefb)',
              borderBottom: '2px solid rgba(0, 136, 209, 0.2)',
            }}
          >
            <MDBox minWidth="60px" sx={{ textAlign: 'center' }}>
              <MDTypography variant="button" fontWeight="bold" color="text">
                ID
              </MDTypography>
            </MDBox>
            <MDBox minWidth="150px" sx={{ textAlign: 'center' }}>
              <MDTypography variant="button" fontWeight="bold" color="text">
                Name
              </MDTypography>
            </MDBox>
            <MDBox minWidth="150px" sx={{ textAlign: 'center' }}>
              <MDTypography variant="button" fontWeight="bold" color="text">
                Specialization
              </MDTypography>
            </MDBox>
            <MDBox minWidth="180px" sx={{ textAlign: 'center' }}>
              <MDTypography variant="button" fontWeight="bold" color="text">
                Phone
              </MDTypography>
            </MDBox>
            <MDBox minWidth="180px" sx={{ textAlign: 'center' }}>
              <MDTypography variant="button" fontWeight="bold" color="text">
                Email
              </MDTypography>
            </MDBox>
            <MDBox minWidth="100px" sx={{ textAlign: 'center' }}>
              <MDTypography variant="button" fontWeight="bold" color="text">
                Gender
              </MDTypography>
            </MDBox>
            <MDBox minWidth="100px" sx={{ textAlign: 'center' }}>
              <MDTypography variant="button" fontWeight="bold" color="text">
                Status
              </MDTypography>
            </MDBox>
            <MDBox minWidth="120px" sx={{ textAlign: 'center' }}>
              <MDTypography variant="button" fontWeight="bold" color="text">
                Department
              </MDTypography>
            </MDBox>
            <MDBox minWidth="100px" sx={{ textAlign: 'center' }}>
              <MDTypography variant="button" fontWeight="bold" color="text">
                Tickets
              </MDTypography>
            </MDBox>
            <MDBox minWidth="80px" sx={{ textAlign: 'center' }}>
              <MDTypography variant="button" fontWeight="bold" color="text">
                Actions
              </MDTypography>
            </MDBox>
          </MDBox>
          {doctors.map((doctor, index) => (
            <MDBox
              key={doctor.id}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              py={1}
              px={2}
              my={1}
              borderRadius="lg"
              sx={{
                backgroundColor: '#fff',
                boxShadow: '0 2px 6px rgba(0, 136, 209, 0.05)',
                transition: 'transform 0.3s ease, background-color 0.2s ease',
                animation: `${index % 2 === 0 ? 'bounceInLeft' : 'bounceInRight'} 0.6s ease-out`,
                '&:hover': {
                  backgroundColor: '#f5fbfd',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 136, 209, 0.1)',
                },
              }}
            >
              <MDBox display="flex" alignItems="center" minWidth="60px" sx={{ justifyContent: 'center' }}>
                <MDTypography variant="button" fontWeight="medium" color="text">
                  {doctor.id}
                </MDTypography>
              </MDBox>
              <MDBox display="flex" alignItems="center" minWidth="150px" sx={{ justifyContent: 'center' }}>
                <MDTypography variant="button" fontWeight="medium" color="text">
                  {doctor.name}
                </MDTypography>
              </MDBox>
              <MDBox display="flex" alignItems="center" minWidth="150px" sx={{ justifyContent: 'center' }}>
                <MDTypography variant="button" fontWeight="medium" color="text">
                  {doctor.specialization}
                </MDTypography>
              </MDBox>
              <MDBox display="flex" alignItems="center" minWidth="180px" sx={{ justifyContent: 'center' }}>
                <MDTypography variant="button" fontWeight="medium" color="text">
                  {doctor.phone}
                </MDTypography>
              </MDBox>
              <MDBox display="flex" alignItems="center" minWidth="180px" sx={{ justifyContent: 'center' }}>
                <MDTypography variant="button" fontWeight="medium" color="text">
                  {doctor.email}
                </MDTypography>
              </MDBox>
              <MDBox display="flex" alignItems="center" minWidth="100px" sx={{ justifyContent: 'center' }}>
                <MDTypography variant="button" fontWeight="medium" color="text">
                  {doctor.gender}
                </MDTypography>
              </MDBox>
              <MDBox display="flex" alignItems="center" minWidth="100px" sx={{ justifyContent: 'center' }}>
                <MDTypography variant="button" fontWeight="medium" color="text">
                  {doctor.status}
                </MDTypography>
              </MDBox>
              <MDBox display="flex" alignItems="center" minWidth="120px" sx={{ justifyContent: 'center' }}>
                <MDTypography variant="button" fontWeight="medium" color="text">
                  {doctor.department}
                </MDTypography>
              </MDBox>
              <MDBox display="flex" alignItems="center" minWidth="100px" sx={{ justifyContent: 'center' }}>
                <MDTypography
                  variant="button"
                  fontWeight="medium"
                  color="info"
                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => handleOpenTicketModal(doctor.id)}
                >
                  {getTicketCount(doctor.id)}
                </MDTypography>
              </MDBox>
              <MDBox display="flex" alignItems="center" minWidth="80px" sx={{ justifyContent: 'center' }}>
                <IconButton
                  onClick={() => handleOpenModal(doctor)}
                  sx={{ color: '#0288d1', '&:hover': { color: '#01579b' } }}
                >
                  <EditIcon />
                </IconButton>
              </MDBox>
            </MDBox>
          ))}
        </Card>

        {/* Modal for Adding/Editing Doctor */}
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="doctor-modal"
          aria-describedby="modal-for-adding-or-editing-doctor"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MDBox
            sx={{
              bgcolor: '#ffffff',
              boxShadow: '0 10px 30px rgba(0, 136, 209, 0.2)',
              p: 4,
              borderRadius: '16px',
              minWidth: 700,
              maxHeight: '85vh',
              overflowY: 'auto',
              animation: 'zoomIn 0.3s ease-out',
              '@media (max-width: 768px)': {
                minWidth: '90vw',
                p: 2,
              },
            }}
          >
            <MDBox sx={{ mb: 3, borderBottom: '1px solid #e0e0e0', pb: 2 }}>
              <MDTypography
                variant="h5"
                id="doctor-modal"
                sx={{
                  color: '#0288d1',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {formData.id ? 'Edit Doctor' : 'Add New Doctor'}
              </MDTypography>
              <IconButton
                aria-label="close"
                onClick={handleCloseModal}
                sx={{
                  position: 'absolute',
                  right: 16,
                  top: 16,
                  color: '#1976d2',
                  '&:hover': { color: '#1565c0', backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                }}
              >
                <CloseIcon />
              </IconButton>
            </MDBox>
            <MDBox component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <MDBox display="flex" alignItems="center" mb={1}>
                    <Person sx={{ mr: 1, color: '#0288d1' }} />
                    <MDTypography variant="body2" fontWeight="medium">Name</MDTypography>
                  </MDBox>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    InputProps={{ style: { backgroundColor: '#f9f9f9' } }}
                    helperText="Name must start with 'Dr. '"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox display="flex" alignItems="center" mb={1}>
                    <Work sx={{ mr: 1, color: '#0288d1' }} />
                    <MDTypography variant="body2" fontWeight="medium">Specialization</MDTypography>
                  </MDBox>
                  <TextField
                    fullWidth
                    label="Specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    InputProps={{ style: { backgroundColor: '#f9f9f9' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox display="flex" alignItems="center" mb={1}>
                    <Phone sx={{ mr: 1, color: '#0288d1' }} />
                    <MDTypography variant="body2" fontWeight="medium">Phone</MDTypography>
                  </MDBox>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    InputProps={{ style: { backgroundColor: '#f9f9f9' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox display="flex" alignItems="center" mb={1}>
                    <Email sx={{ mr: 1, color: '#0288d1' }} />
                    <MDTypography variant="body2" fontWeight="medium">Email</MDTypography>
                  </MDBox>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    InputProps={{ style: { backgroundColor: '#f9f9f9' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox display="flex" alignItems="center" mb={1}>
                    <PersonOutline sx={{ mr: 1, color: '#0288d1' }} />
                    <MDTypography variant="body2" fontWeight="medium">Gender</MDTypography>
                  </MDBox>
                  <TextField
                    fullWidth
                    select
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    InputProps={{ style: { backgroundColor: '#f9f9f9' } }}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox display="flex" alignItems="center" mb={1}>
                    <LocalHospital sx={{ mr: 1, color: '#0288d1' }} />
                    <MDTypography variant="body2" fontWeight="medium">Status</MDTypography>
                  </MDBox>
                  <TextField
                    fullWidth
                    select
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    InputProps={{ style: { backgroundColor: '#f9f9f9' } }}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox display="flex" alignItems="center" mb={1}>
                    <MonetizationOn sx={{ mr: 1, color: '#0288d1' }} />
                    <MDTypography variant="body2" fontWeight="medium">Consultation Fee</MDTypography>
                  </MDBox>
                  <TextField
                    fullWidth
                    label="Consultation Fee"
                    name="consultationFee"
                    type="number"
                    value={formData.consultationFee}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    InputProps={{ style: { backgroundColor: '#f9f9f9' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox display="flex" alignItems="center" mb={1}>
                    <Description sx={{ mr: 1, color: '#0288d1' }} />
                    <MDTypography variant="body2" fontWeight="medium">Qualifications</MDTypography>
                  </MDBox>
                  <TextField
                    fullWidth
                    label="Qualifications"
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    InputProps={{ style: { backgroundColor: '#f9f9f9' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox display="flex" alignItems="center" mb={1}>
                    <Work sx={{ mr: 1, color: '#0288d1' }} />
                    <MDTypography variant="body2" fontWeight="medium">Experience (Years)</MDTypography>
                  </MDBox>
                  <TextField
                    fullWidth
                    label="Experience (Years)"
                    name="experience"
                    type="number"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    InputProps={{ style: { backgroundColor: '#f9f9f9' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox display="flex" alignItems="center" mb={1}>
                    <AccountBalance sx={{ mr: 1, color: '#0288d1' }} />
                    <MDTypography variant="body2" fontWeight="medium">Department</MDTypography>
                  </MDBox>
                  <TextField
                    fullWidth
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    InputProps={{ style: { backgroundColor: '#f9f9f9' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <MDBox display="flex" alignItems="center" mb={1}>
                    <Description sx={{ mr: 1, color: '#0288d1' }} />
                    <MDTypography variant="body2" fontWeight="medium">Address</MDTypography>
                  </MDBox>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    InputProps={{ style: { backgroundColor: '#f9f9f9' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <MDBox display="flex" alignItems="center" mb={1}>
                    <Schedule sx={{ mr: 1, color: '#0288d1' }} />
                    <MDTypography variant="body2" fontWeight="medium">Timings</MDTypography>
                  </MDBox>
                  <TextField
                    fullWidth
                    label="Timings"
                    name="timings"
                    value={formData.timings}
                    onChange={handleInputChange}
                    helperText="e.g., Mon-Fri 9AM-5PM"
                    required
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    InputProps={{ style: { backgroundColor: '#f9f9f9' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <MDBox display="flex" alignItems="center" mb={1}>
                    <Description sx={{ mr: 1, color: '#0288d1' }} />
                    <MDTypography variant="body2" fontWeight="medium">Bio</MDTypography>
                  </MDBox>
                  <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    multiline
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    InputProps={{ style: { backgroundColor: '#f9f9f9' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <MDBox display="flex" alignItems="center" mb={1}>
                    <Image sx={{ mr: 1, color: '#0288d1' }} />
                    <MDTypography variant="body2" fontWeight="medium">Profile Image URL</MDTypography>
                  </MDBox>
                  <TextField
                    fullWidth
                    label="Profile Image URL"
                    name="profileImage"
                    value={formData.profileImage}
                    onChange={handleInputChange}
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    InputProps={{ style: { backgroundColor: '#f9f9f9' } }}
                  />
                </Grid>
              </Grid>
              <MDBox sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleCloseModal}
                  sx={{
                    color: '#0288d1',
                    borderColor: '#0288d1',
                    textTransform: 'none',
                    borderRadius: '20px',
                    padding: '8px 24px',
                    '&:hover': {
                      borderColor: '#01579b',
                      backgroundColor: 'rgba(0, 136, 209, 0.04)',
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    textTransform: 'none',
                    borderRadius: '20px',
                    padding: '8px 24px',
                    backgroundColor: '#0288d1 !important',
                    color: '#ffffff !important',
                    '&:hover': {
                      backgroundColor: '#01579b !important',
                      boxShadow: '0 4px 12px rgba(0, 136, 209, 0.3)',
                    },
                  }}
                >
                  {formData.id ? 'Update Doctor' : 'Add Doctor'}
                </Button>
              </MDBox>
            </MDBox>
          </MDBox>
        </Modal>

        {/* Modal for Viewing Tickets */}
        <Modal
          open={openTicketModal}
          onClose={handleCloseTicketModal}
          aria-labelledby="ticket-modal"
          aria-describedby="modal-for-viewing-doctor-tickets"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MDBox
            sx={{
              bgcolor: '#ffffff',
              boxShadow: '0 10px 30px rgba(0, 136, 209, 0.2)',
              p: 4,
              borderRadius: '16px',
              minWidth: 700,
              maxHeight: '85vh',
              overflowY: 'auto',
              animation: 'zoomIn 0.3s ease-out',
              '@media (max-width: 768px)': {
                minWidth: '90vw',
                p: 2,
              },
            }}
          >
            <MDBox sx={{ mb: 3, borderBottom: '1px solid #e0e0e0', pb: 2 }}>
              <MDTypography
                variant="h5"
                id="ticket-modal"
                sx={{
                  color: '#0288d1',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Tickets for {formatDate(selectedDate)}
              </MDTypography>
              <IconButton
                aria-label="close"
                onClick={handleCloseTicketModal}
                sx={{
                  position: 'absolute',
                  right: 16,
                  top: 16,
                  color: '#1976d2',
                  '&:hover': { color: '#1565c0', backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                }}
              >
                <CloseIcon />
              </IconButton>
            </MDBox>
            <MDBox sx={{ mb: 3 }}>
              <TextField
                label="Select Date"
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  const newDate = e.target.value;
                  setSelectedDate(newDate);
                  const filteredTickets = tickets.filter((ticket) => {
                    const ticketDate = new Date(ticket.createdAt);
                    const formattedTicketDate = ticketDate.toISOString().split('T')[0];
                    console.log(`Filtering ticket ID: ${ticket.id}, createdAt: ${ticket.createdAt}, formatted: ${formattedTicketDate}, selectedDate: ${newDate}`); // Debug log
                    return (
                      !isNaN(ticketDate) &&
                      formattedTicketDate === newDate &&
                      ticket.doctorId === selectedDoctorTickets[0]?.doctorId
                    );
                  });
                  console.log('Filtered tickets on date change:', filteredTickets); // Debug log
                  setSelectedDoctorTickets(filteredTickets);
                  if (filteredTickets.length === 0) {
                    setAlert({ type: 'warning', message: `No tickets found for ${formatDate(newDate)}.` });
                  }
                }}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                InputProps={{ style: { backgroundColor: '#f9f9f9' } }}
              />
            </MDBox>
            <MDBox>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <MDTypography variant="button" fontWeight="bold">Ticket #</MDTypography>
                      </TableCell>
                      <TableCell>
                        <MDTypography variant="button" fontWeight="bold">Patient Name</MDTypography>
                      </TableCell>
                      <TableCell>
                        <MDTypography variant="button" fontWeight="bold">Reference #</MDTypography>
                      </TableCell>
                      <TableCell>
                        <MDTypography variant="button" fontWeight="bold">Department</MDTypography>
                      </TableCell>
                      <TableCell>
                        <MDTypography variant="button" fontWeight="bold">Consultation Fee</MDTypography>
                      </TableCell>
                      <TableCell>
                        <MDTypography variant="button" fontWeight="bold">Created At</MDTypography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedDoctorTickets.length > 0 ? (
                      selectedDoctorTickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell>{ticket.ticketNumber}</TableCell>
                          <TableCell>{ticket.patientName}</TableCell>
                          <TableCell>{ticket.referenceNumber}</TableCell>
                          <TableCell>{ticket.department}</TableCell>
                          <TableCell>{ticket.consultationFee}</TableCell>
                          <TableCell>{new Date(ticket.createdAt).toLocaleTimeString()}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <MDTypography>No tickets found for selected date.</MDTypography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {selectedDoctorTickets.length > 0 && (
                <MDBox mt={3} p={2} sx={{ backgroundColor: '#f9f9f9', borderRadius: '12px' }}>
                  <MDTypography variant="h6" color="info" mb={1}>Earnings Breakdown</MDTypography>
                  {Object.entries(calculateTotalAmount(selectedDoctorTickets)).map(([key, value]) => (
                    <MDBox key={key} display="flex" justifyContent="space-between" mb={1}>
                      <MDTypography variant="body2" fontWeight="medium">
                        {key === 'total' ? 'Total Amount' : key === 'doctorShare' ? 'Doctor Share (30%)' : 'Hospital Share (70%)'}
                      </MDTypography>
                      <MDTypography variant="body2" fontWeight="medium">
                        ${Number(value).toFixed(2)}
                      </MDTypography>
                    </MDBox>
                  ))}
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <MDTypography variant="body2" fontWeight="medium">
                      Doctor Share Percentage
                    </MDTypography>
                    <MDTypography variant="body2" fontWeight="medium">
                      {calculatePercentage(calculateTotalAmount(selectedDoctorTickets).doctorShare, calculateTotalAmount(selectedDoctorTickets).total)}
                    </MDTypography>
                  </MDBox>
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <MDTypography variant="body2" fontWeight="medium">
                      Hospital Share Percentage
                    </MDTypography>
                    <MDTypography variant="body2" fontWeight="medium">
                      {calculatePercentage(calculateTotalAmount(selectedDoctorTickets).hospitalShare, calculateTotalAmount(selectedDoctorTickets).total)}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              )}
            </MDBox>
            <MDBox sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={handleCloseTicketModal}
                sx={{
                  color: '#0288d1',
                  borderColor: '#0288d1',
                  textTransform: 'none',
                  borderRadius: '20px',
                  padding: '8px 24px',
                  '&:hover': {
                    borderColor: '#01579b',
                    backgroundColor: 'rgba(0, 136, 209, 0.04)',
                  },
                }}
              >
                Close
              </Button>
            </MDBox>
          </MDBox>
        </Modal>

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
                bgcolor: alert.type === 'success' ? '#e0f7fa' : alert.type === 'warning' ? '#fff3e0' : '#ffebee',
                color: alert.type === 'success' ? '#00bcd4' : alert.type === 'warning' ? '#f57c00' : '#d32f2f',
                fontWeight: 'medium',
              }}
            >
              
              {alert.message}
            
              </Alert>
             
          )}
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
};

// Add CSS animations
const styles = `
  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes bounceInLeft {
    from { opacity: 0; transform: translateX(-100px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes bounceInRight {
    from { opacity: 0; transform: translateX(100px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes zoomIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default DoctorsPage;