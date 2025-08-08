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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchPatients = async () => {
    try {
      const [patientsResponse, ticketsResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/patients'),
        axios.get('http://localhost:5000/api/tickets'),
      ]);

      const patientsData = patientsResponse.data;
      const allTickets = ticketsResponse.data;

      const patientsWithTicketCount = patientsData.map((patient) => ({
        ...patient,
        ticketCount: allTickets.filter((ticket) => ticket.patientId === patient.id).length,
      }));

      setPatients(patientsWithTicketCount);
    } catch (err) {
      console.error('Error fetching patients or tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketsByPatientId = async (patientId) => {
    setModalLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/tickets', {
        params: { patientId },
      });
      return response.data;
    } catch (err) {
      console.error('Error fetching tickets:', err);
      return [];
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleViewTickets = async (patient) => {
    setSelectedPatient(patient);
    const patientTickets = await fetchTicketsByPatientId(patient.id);
    setTickets(patientTickets);
  };

  const handleCloseModal = () => {
    setSelectedPatient(null);
    setTickets([]);
  };

  const printTicket = (ticket) => {
    const createdAtDate = ticket.createdAt ? new Date(ticket.createdAt) : new Date();
    const formattedDate = isNaN(createdAtDate) ? 'N/A' : createdAtDate.toLocaleDateString();

    const content = `
      <html>
        <head>
          <title>Print Prescription</title>
          <style>
            .prescription {
              width: 210mm;
              height: 297mm;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              padding: 20mm;
              box-sizing: border-box;
              page-break-after: always;
              background: linear-gradient(135deg, #ffffff, #e3f2fd);
              font-family: 'Arial', sans-serif;
            }
            body { margin: 0; padding: 0; background: none; }
            .no-print { display: none !important; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0288d1; padding-bottom: 10px; }
            .header-left h2 { margin: 0; color: #0288d1; font-size: 24px; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1); }
            .header-left small { color: #546e7a; font-size: 14px; }
            .symbol { font-size: 60px; color: #0288d1; }
            .info { margin-top: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; font-size: 14px; background: rgba(255, 255, 255, 0.8); padding: 15px; borderRadius: '8px'; }
            .info p { margin: 5px 0; color: #263238; }
            .diagnosis { margin-top: 30px; font-size: 15px; background: rgba(255, 255, 255, 0.8); padding: 15px; borderRadius: '8px'; }
            .diagnosis strong { display: block; margin-bottom: 10px; color: #263238; }
            .rx { font-size: 60px; font-weight: bold; color: #0288d1; margin-top: 30px; font-family: 'Georgia', serif; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1); }
            .footer { margin-top: auto; text-align: center; font-size: 12px; padding-top: 10px; }
            .signature { text-align: right; border-top: 1px solid #0288d1; width: 200px; margin-left: auto; color: #0288d1; }
            .clinic-info { border-top: 2px solid #0288d1; margin-top: 40px; padding-top: 10px; text-align: center; font-size: 13px; color: #546e7a; }
          </style>
        </head>
        <body>
          <div class="prescription">
            <div class="header">
              <div class="header-left">
                <h2>${ticket.doctorName}</h2>
                <small>MBBS, FCPS &mdash; General Physician</small>
              </div>
              <div class="symbol">&\#x2695;&\#xfe0f;</div>
            </div>
            <div class="info">
              <p><strong>Patient Name:</strong> ${ticket.patientName}</p>
              <p><strong>Phone Number:</strong> ${ticket.phoneNumber}</p>
              <p><strong>Age:</strong> ${ticket.age}</p>
              <p><strong>Gender:</strong> ${ticket.gender}</p>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Temp:</strong> ${ticket.temperature}&deg;C</p>
              <p><strong>BP:</strong> ${ticket.bp}</p>
              <p><strong>Reference #:</strong> ${ticket.referenceNumber}</p>
            </div>
            <div class="diagnosis">
              <strong>Diagnosis:</strong> <p>${ticket.reason}</p>
            </div>
            <div class="rx">&\#x211e;</div>
            <div class="footer">
              <div></div>
              <div class="signature">Signature</div>
            </div>
            <div class="clinic-info">
              CLINIC NAME &nbsp; | &nbsp; &#x1F4CD; Dr. Dummy Street Area &nbsp; | &nbsp; &#x1F4DE; 03xx-1234567
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
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 700, color: '#0288d1', letterSpacing: '0.5px' }}
        >
          Patient Records
        </Typography>
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
            <MDBox minWidth="180px" sx={{ textAlign: 'center' }}>
              <MDTypography variant="button" fontWeight="bold" color="text">
                Phone Number
              </MDTypography>
            </MDBox>
            <MDBox minWidth="80px" sx={{ textAlign: 'center' }}>
              <MDTypography variant="button" fontWeight="bold" color="text">
                Age
              </MDTypography>
            </MDBox>
            <MDBox minWidth="120px" sx={{ textAlign: 'center' }}>
              <MDTypography variant="button" fontWeight="bold" color="text">
                Created At
              </MDTypography>
            </MDBox>
            <MDBox minWidth="100px" sx={{ textAlign: 'center' }}>
              <MDTypography variant="button" fontWeight="bold" color="text">
                Ticket Count
              </MDTypography>
            </MDBox>
            <MDBox minWidth="100px" sx={{ textAlign: 'center' }}>
              <MDTypography variant="button" fontWeight="bold" color="text">
                Actions
              </MDTypography>
            </MDBox>
          </MDBox>
          {patients.map((patient, index) => (
            <MDBox
              key={patient.id}
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
                  {patient.id}
                </MDTypography>
              </MDBox>
              <MDBox display="flex" alignItems="center" minWidth="150px" sx={{ justifyContent: 'center' }}>
                <MDTypography variant="button" fontWeight="medium" color="text">
                  {patient.patientName}
                </MDTypography>
              </MDBox>
              <MDBox display="flex" alignItems="center" minWidth="180px" sx={{ justifyContent: 'center' }}>
                <MDTypography variant="button" fontWeight="medium" color="text">
                  {patient.phoneNumber}
                </MDTypography>
              </MDBox>
              <MDBox display="flex" alignItems="center" minWidth="80px" sx={{ justifyContent: 'center' }}>
                <MDTypography variant="button" fontWeight="medium" color="text">
                  {patient.age}
                </MDTypography>
              </MDBox>
              <MDBox display="flex" alignItems="center" minWidth="120px" sx={{ justifyContent: 'center' }}>
                <MDTypography variant="button" fontWeight="medium" color="text">
                  {new Date(patient.createdAt).toLocaleDateString()}
                </MDTypography>
              </MDBox>
              <MDBox display="flex" alignItems="center" minWidth="100px" sx={{ justifyContent: 'center' }}>
                <MDTypography variant="button" fontWeight="medium" color="text">
                  {patient.ticketCount}
                </MDTypography>
              </MDBox>
              <MDBox display="flex" alignItems="center" minWidth="100px" sx={{ justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleViewTickets(patient)}
                  sx={{
                    textTransform: 'none',
                    borderRadius: '20px',
                    padding: '6px 16px',
                    backgroundColor: '#ffffff !important',
                    color: '#0288d1 !important',
                    '&:hover': {
                      backgroundColor: '#f0f0f0 !important',
                      boxShadow: '0 4px 12px rgba(0, 136, 209, 0.3)',
                    },
                    animation: 'pulse 1.5s infinite',
                  }}
                >
                  View Tickets
                </Button>
              </MDBox>
            </MDBox>
          ))}

          {/* Modal for Tickets */}
          <Modal
            open={selectedPatient !== null}
            onClose={handleCloseModal}
            aria-labelledby="patient-tickets-modal"
            aria-describedby="modal-displaying-patient-tickets"
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
              {/* Modal Header */}
              <Box sx={{ mb: 3, borderBottom: '1px solid #e0e0e0', pb: 2 }}>
                <Typography
                  variant="h5"
                  id="patient-tickets-modal"
                  gutterBottom
                  sx={{
                    color: '#0288d1',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Tickets for {selectedPatient?.patientName} (ID: {selectedPatient?.id})
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

              {/* Tickets Table */}
              {modalLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress />
                </Box>
              ) : tickets.length > 0 ? (
                <>
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
                    <MDBox minWidth="150px" sx={{ textAlign: 'center' }}>
                      <MDTypography variant="button" fontWeight="bold" color="text">
                        Reference #
                      </MDTypography>
                    </MDBox>
                    <MDBox minWidth="150px" sx={{ textAlign: 'center' }}>
                      <MDTypography variant="button" fontWeight="bold" color="text">
                        Doctor
                      </MDTypography>
                    </MDBox>
                    <MDBox minWidth="200px" sx={{ textAlign: 'center' }}>
                      <MDTypography variant="button" fontWeight="bold" color="text">
                        Reason
                      </MDTypography>
                    </MDBox>
                    <MDBox minWidth="100px" sx={{ textAlign: 'center' }}>
                      <MDTypography variant="button" fontWeight="bold" color="text">
                        Amount ($)
                      </MDTypography>
                    </MDBox>
                    <MDBox minWidth="150px" sx={{ textAlign: 'center' }}>
                      <MDTypography variant="button" fontWeight="bold" color="text">
                        Date
                      </MDTypography>
                    </MDBox>
                    <MDBox minWidth="100px" sx={{ textAlign: 'center' }}>
                      <MDTypography variant="button" fontWeight="bold" color="text">
                        Actions
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                  {tickets.map((ticket, index) => (
                    <MDBox
                      key={ticket.id}
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
                      <MDBox display="flex" alignItems="center" minWidth="150px" sx={{ justifyContent: 'center' }}>
                        <MDTypography variant="button" fontWeight="medium" color="text">
                          {ticket.referenceNumber}
                        </MDTypography>
                      </MDBox>
                      <MDBox display="flex" alignItems="center" minWidth="150px" sx={{ justifyContent: 'center' }}>
                        <MDTypography variant="button" fontWeight="medium" color="text">
                          {ticket.doctorName}
                        </MDTypography>
                      </MDBox>
                      <MDBox display="flex" alignItems="center" minWidth="200px" sx={{ justifyContent: 'center' }}>
                        <MDTypography variant="button" fontWeight="medium" color="text">
                          {ticket.reason}
                        </MDTypography>
                      </MDBox>
                      <MDBox display="flex" alignItems="center" minWidth="100px" sx={{ justifyContent: 'center' }}>
                        <MDTypography variant="button" fontWeight="medium" color="text">
                          ${ticket.amount}
                        </MDTypography>
                      </MDBox>
                      <MDBox display="flex" alignItems="center" minWidth="150px" sx={{ justifyContent: 'center' }}>
                        <MDTypography variant="button" fontWeight="medium" color="text">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </MDTypography>
                      </MDBox>
                      <MDBox display="flex" alignItems="center" minWidth="100px" sx={{ justifyContent: 'center' }}>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            textTransform: 'none',
                    borderRadius: '20px',
                    padding: '6px 16px',
                    backgroundColor: '#ffffff !important',
                    color: '#0288d1 !important',
                    '&:hover': {
                      backgroundColor: '#f0f0f0 !important',
                      boxShadow: '0 4px 12px rgba(0, 136, 209, 0.3)',
                    },
                    animation: 'pulse 1.5s infinite',
                          }}
                          onClick={() => printTicket(ticket)}
                        >
                          Print
                        </Button>
                      </MDBox>
                    </MDBox>
                  ))}
                </>
              ) : (
                <Typography sx={{ p: 2, color: '#757575', textAlign: 'center' }}>
                  No tickets available for this patient.
                </Typography>
              )}

              {/* Close Button */}
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
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
                  Close
                </Button>
              </Box>
            </Paper>
          </Modal>
        </Card>
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

export default PatientsPage;