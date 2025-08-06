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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
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

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/doctors');
      setDoctors(response.data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/doctors', formData);
      fetchDoctors();
      handleCloseModal();
    } catch (err) {
      console.error('Error adding doctor:', err);
    }
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
            onClick={handleOpenModal}
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
                Created At
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
                  {new Date(doctor.createdAt).toLocaleDateString()}
                </MDTypography>
              </MDBox>
            </MDBox>
          ))}
        </Card>

        {/* Modal for Adding Doctor */}
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="add-doctor-modal"
          aria-describedby="modal-for-adding-doctor"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Paper
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
            <Box sx={{ mb: 3, borderBottom: '1px solid #e0e0e0', pb: 2 }}>
              <Typography
                variant="h5"
                id="add-doctor-modal"
                gutterBottom
                sx={{
                  color: '#0288d1',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Add New Doctor
              </Typography>
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
            </Box>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Consultation Fee"
                    name="consultationFee"
                    type="number"
                    value={formData.consultationFee}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Qualifications"
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Experience (Years)"
                    name="experience"
                    type="number"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Timings"
                    name="timings"
                    value={formData.timings}
                    onChange={handleInputChange}
                    helperText="e.g., Mon-Fri 9AM-5PM"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    multiline
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Profile Image URL"
                    name="profileImage"
                    value={formData.profileImage}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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
                  Add Doctor
                </Button>
              </Box>
            </Box>
          </Paper>
        </Modal>
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