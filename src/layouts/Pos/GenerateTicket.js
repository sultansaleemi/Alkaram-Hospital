// /* eslint-disable prettier/prettier */
// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   Grid,
//   TextField,
//   MenuItem,
//   Button,
//   Box,
//   Snackbar,
//   Alert,
//   Pagination,
//   Divider,
//   Typography,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   IconButton,
// } from '@mui/material';
// import { keyframes } from '@emotion/react';
// import RefreshIcon from '@mui/icons-material/Refresh';
// import axios from 'axios';
// import TodayTicketCard from './TodayTicketCard';
// import YesterdayTicketCard from './YesterdayTicketCard';
// import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
// import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
// import logo from '../../../assets/images/small-logos/Untitled-2.png';

// const slideUp = keyframes`
//   from { transform: translateY(30px); opacity: 0; }
//   to { transform: translateY(0); opacity: 1; }
// `;

// const slideInOrbit = keyframes`
//   from { transform: translateX(-50px) rotate(-45deg); opacity: 0; }
//   to { transform: translateX(0) rotate(0deg); opacity: 1; }
// `;

// const pulseGlow = keyframes`
//   0% { box-shadow: 0 0 0px #00bcd4; }
//   50% { box-shadow: 0 0 15px #00bcd4, 0 0 30px #00bcd4; }
//   100% { box-shadow: 0 0 0px #00bcd4; }
// `;

// const orbit = keyframes`
//   0% { transform: rotate(0deg); }
//   100% { transform: rotate(360deg); }
// `;

// const glow = keyframes`
//   0% { box-shadow: 0 0 5px rgba(2, 136, 209, 0.3); }
//   50% { box-shadow: 0 0 20px rgba(2, 136, 209, 0.7); }
//   100% { box-shadow: 0 0 5px rgba(2, 136, 209, 0.3); }
// `;

// const doctors = ['Dr. Kashif', 'Dr. Khan', 'Dr. Fatima'];
// const genders = ['Male', 'Female', 'Other'];
// const perPage = 5;

// const GenerateTicket = () => {
//   const [ticketNumber, setTicketNumber] = useState(1);
//   const [referenceNumber, setReferenceNumber] = useState(1);
//   const [newTicketForm, setNewTicketForm] = useState({
//     patientName: '',
//     phoneNumber: '',
//     age: '',
//     gender: '',
//     doctorName: '',
//     reason: '',
//     amount: '',
//     temperature: '',
//     bp: '',
//   });
//   const [editForm, setEditForm] = useState({
//     id: null,
//     patientName: '',
//     phoneNumber: '',
//     age: '',
//     gender: '',
//     doctorName: '',
//     reason: '',
//     amount: '',
//     temperature: '',
//     bp: '',
//   });
//   const [tickets, setTickets] = useState([]);
//   const [alert, setAlert] = useState(null);
//   const [todayPage, setTodayPage] = useState(1);
//   const [yesterdayPage, setYesterdayPage] = useState(1);
//   const [openResetDialog, setOpenResetDialog] = useState(false);
//   const [openEditDialog, setOpenEditDialog] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   const fetchTickets = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/tickets');
//       console.log('Fetched tickets:', response.data);
//       setTickets(response.data);
//       setTicketNumber(response.data.length + 1 || 1);

//       const maxRefNumber = response.data.reduce((max, ticket) => Math.max(max, ticket.referenceNumber), 0);
//       if (maxRefNumber > referenceNumber) {
//         setReferenceNumber(maxRefNumber + 1);
//         localStorage.setItem('lastReferenceNumber', maxRefNumber + 1);
//       }
//     } catch (err) {
//       console.error('Error fetching tickets:', err);
//       setAlert({ type: 'error', message: 'Failed to fetch tickets.' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTickets();
//     const storedRef = localStorage.getItem('lastReferenceNumber');
//     if (storedRef) {
//       setReferenceNumber(parseInt(storedRef));
//     }
//   }, []);

//   const handleNewTicketChange = (e) =>
//     setNewTicketForm({ ...newTicketForm, [e.target.name]: e.target.value });

//   const handleEditChange = (e) =>
//     setEditForm({ ...editForm, [e.target.name]: e.target.value });

//   const handleResetReference = () => {
//     setReferenceNumber(1);
//     localStorage.setItem('lastReferenceNumber', 1);
//     setAlert({ type: 'success', message: 'Reference number reset to 1.' });
//     setOpenResetDialog(false);
//   };

//   const printTicket = (ticket) => {
//     const createdAtDate = ticket.createdAt ? new Date(ticket.createdAt) : new Date();
//     const formattedDate = isNaN(createdAtDate) ? 'N/A' : createdAtDate.toLocaleDateString();
//     const logoBase64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`;

//     const content = `
//       <html><head><title>Print Prescription</title><style>.prescription{width:210mm;height:297mm;display:flex;flex-direction:column;justify-content:space-between;padding:20mm;box-sizing:border-box;page-break-after:always;background:linear-gradient(135deg,#ffffff,#e3f2fd);font-family:'Arial',sans-serif;}body{margin:0;padding:0;background:none;}.no-print{display:none!important;}.header{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0288d1;padding-bottom:10px;}.header-left h2{margin:0;color:#0288d1;font-size:24px;text-shadow:1px 1px 2px rgba(0,0,0,0.1);}.header-left small{color:#546e7a;font-size:14px;}.symbol{font-size:60px;color:#0288d1;}.symbol img{width:60px;height:auto;}.info{margin-top:20px;display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;font-size:14px;background:rgba(255,255,255,0.8);padding:15px;border-radius:8px;}.info p{margin:5px 0;color:#263238;}.diagnosis{margin-top:30px;font-size:15px;background:rgba(255,255,255,0.8);padding:15px;border-radius:8px;}.diagnosis strong{display:block;margin-bottom:10px;color:#263238;}.rx{font-size:60px;font-weight:bold;color:#0288d1;margin-top:30px;font-family:'Georgia',serif;text-shadow:1px 1px 2px rgba(0,0,0,0.1);}.footer{margin-top:auto;text-align:center;font-size:12px;padding-top:10px;}.signature{text-align:right;border-top:1px solid #0288d1;width:200px;margin-left:auto;color:#0288d1;}.clinic-info{border-top:2px solid #0288d1;margin-top:40px;padding-top:10px;text-align:center;font-size:13px;color:#546e7a;}@media print{.header img{content:url(${logoBase64});}}</style></head><body><div class="prescription"><div class="header"><div class="header-left"><h2>${ticket.doctorName}</h2><small>MBBS, FCPS &mdash; General Physician</small></div><div class="symbol"><img src="${logo}" alt="Logo" onerror="this.src='${logoBase64}'" />&\#x2695;&\#xfe0f;</div></div><div class="info"><p><strong>Patient Name:</strong> ${ticket.patientName}</p><p><strong>Phone Number:</strong> ${ticket.phoneNumber}</p><p><strong>Age:</strong> ${ticket.age}</p><p><strong>Gender:</strong> ${ticket.gender}</p><p><strong>Date:</strong> ${formattedDate}</p><p><strong>Temp:</strong> ${ticket.temperature}&deg;C</p><p><strong>BP:</strong> ${ticket.bp}</p><p><strong>Reference #:</strong> ${ticket.referenceNumber}</p></div><div class="diagnosis"><strong>Diagnosis:</strong> <p>${ticket.reason}</p></div><div class="rx">&\#x211e;</div><div class="footer"><div></div><div class="signature">Signature</div></div><div class="clinic-info">CLINIC NAME &nbsp; | &nbsp; &#x1F4CD; Dr. Dummy Street Area &nbsp; | &nbsp; &#x1F4DE; 03xx-1234567</div></div></body></html>
//     `;
//     const printWindow = window.open('', '_blank', 'width=800,height=600');
//     printWindow.document.open();
//     printWindow.document.write(content);
//     printWindow.document.close();
//     printWindow.print();
//   };

//   const handleSubmit = async () => {
//     const {
//       patientName,
//       phoneNumber,
//       age,
//       gender,
//       doctorName,
//       reason,
//       amount,
//       temperature,
//       bp,
//     } = newTicketForm;

//     if (
//       !patientName ||
//       !phoneNumber ||
//       !age ||
//       !gender ||
//       !doctorName ||
//       !reason ||
//       !amount ||
//       !temperature ||
//       !bp
//     ) {
//       setAlert({ type: 'error', message: 'Please complete all fields.' });
//       return;
//     }

//     try {
//       const patientCheck = await axios.get('http://localhost:5000/api/patients', {
//         params: { phoneNumber },
//       });
//       let patientId;

//       if (patientCheck.data.length > 0) {
//         patientId = patientCheck.data[0].id;
//         setAlert({
//           type: 'info',
//           message: 'Ticket generated, but the user already exists.',
//         });
//       } else {
//         const patientResponse = await axios.post('http://localhost:5000/api/patients', {
//           patientName,
//           phoneNumber,
//           age,
//         });
//         patientId = patientResponse.data.insertId;
//         setAlert({ type: 'success', message: 'New patient and ticket registered!' });
//       }

//       const newTicket = {
//         patientName,
//         phoneNumber,
//         age,
//         gender,
//         doctorName,
//         reason,
//         amount,
//         temperature,
//         bp,
//         ticketNumber,
//         referenceNumber,
//         patientId,
//       };

//       const ticketResponse = await axios.post('http://localhost:5000/api/tickets', newTicket);
//       setAlert({ type: 'success', message: 'Ticket generated successfully!' });

//       setNewTicketForm({
//         patientName: '',
//         phoneNumber: '',
//         age: '',
//         gender: '',
//         doctorName: '',
//         reason: '',
//         amount: '',
//         temperature: '',
//         bp: '',
//       });
//       const newReferenceNumber = referenceNumber + 1;
//       setReferenceNumber(newReferenceNumber);
//       localStorage.setItem('lastReferenceNumber', newReferenceNumber);
//       fetchTickets();
//       printTicket(ticketResponse.data);
//     } catch (err) {
//       console.error('Error adding ticket or patient:', err);
//       setAlert({ type: 'error', message: 'Failed to generate ticket or save patient.' });
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/tickets/${id}`);
//       setAlert({ type: 'success', message: 'Ticket deleted successfully.' });
//       fetchTickets();
//     } catch (err) {
//       console.error('Error deleting ticket:', err);
//       setAlert({ type: 'error', message: 'Failed to delete ticket.' });
//     }
//   };

//   const handleEdit = (ticket) => {
//     setEditForm({
//       id: ticket.id,
//       patientName: ticket.patientName,
//       phoneNumber: ticket.phoneNumber,
//       age: ticket.age,
//       gender: ticket.gender,
//       doctorName: ticket.doctorName,
//       reason: ticket.reason,
//       amount: ticket.amount,
//       temperature: ticket.temperature,
//       bp: ticket.bp,
//     });
//     setOpenEditDialog(true);
//   };

//   const handleUpdateTicket = async () => {
//     if (editForm.id) {
//       try {
//         await axios.put(`http://localhost:5000/api/tickets/${editForm.id}`, editForm);
//         setAlert({ type: 'success', message: 'Ticket updated successfully!' });
//         setOpenEditDialog(false);
//         fetchTickets();
//       } catch (err) {
//         console.error('Error updating ticket:', err);
//         setAlert({ type: 'error', message: 'Failed to update ticket.' });
//       }
//     }
//   };

//   const handleCloseEditDialog = () => {
//     setOpenEditDialog(false);
//     setEditForm({
//       id: null,
//       patientName: '',
//       phoneNumber: '',
//       age: '',
//       gender: '',
//       doctorName: '',
//       reason: '',
//       amount: '',
//       temperature: '',
//       bp: '',
//     });
//   };

//   const today = new Date();
//   const yesterday = new Date(today);
//   yesterday.setDate(today.getDate() - 1);
//   const todayTickets = tickets.filter((ticket) => {
//     if (!ticket.createdAt) {
//       console.warn('Ticket missing createdAt:', ticket);
//       return false;
//     }
//     const ticketDate = new Date(ticket.createdAt);
//     return !isNaN(ticketDate) && ticketDate.toDateString() === today.toDateString();
//   });
//   const yesterdayTickets = tickets.filter((ticket) => {
//     if (!ticket.createdAt) {
//       console.warn('Ticket missing createdAt:', ticket);
//       return false;
//     }
//     const ticketDate = new Date(ticket.createdAt);
//     const localYesterday = new Date(yesterday.toLocaleString('en-US', { timeZone: 'Asia/Karachi' }));
//     return (
//       !isNaN(ticketDate) &&
//       ticketDate.getUTCFullYear() === localYesterday.getUTCFullYear() &&
//       ticketDate.getUTCMonth() === localYesterday.getUTCMonth() &&
//       ticketDate.getUTCDate() === localYesterday.getUTCDate()
//     );
//   });

//   const paginatedTodayTickets = todayTickets.slice((todayPage - 1) * perPage, todayPage * perPage);
//   const paginatedYesterdayTickets = yesterdayTickets.slice((yesterdayPage - 1) * perPage, yesterdayPage * perPage);

//   return (
//     <DashboardLayout>
//       <DashboardNavbar />
//       <Box p={4} sx={{ minHeight: '100vh' }}>
//         <Grid container spacing={4} sx={{ maxWidth: '1400px', mx: 'auto' }}>
//           {/* Form Section - Left Side */}
//           <Grid item xs={12} md={6}>
//             <Card
//               sx={{
//                 p: 5,
//                 borderRadius: '20px',
//                 boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
//                 backdropFilter: 'blur(15px)',
//                 bgcolor: 'rgba(255, 255, 255, 0.9)',
//                 border: '1px solid rgba(255, 255, 255, 0.4)',
//                 background: 'radial-gradient(circle, rgba(0, 188, 212, 0.1) 0%, rgba(255, 255, 255, 0.9) 70%)',
//                 animation: `${slideUp} 1s ease`,
//                 position: 'relative',
//                 '&::before': {
//                   content: '""',
//                   position: 'absolute',
//                   top: '-10px',
//                   left: '-10px',
//                   width: '20px',
//                   height: '20px',
//                   borderRadius: '50%',
//                   background: 'rgba(0, 188, 212, 0.3)',
//                   animation: `${orbit} 10s linear infinite`,
//                 },
//               }}
//             >
//               <Typography
//                 variant="h3"
//                 align="center"
//                 sx={{
//                   color: '#00bcd4',
//                   fontWeight: 'bold',
//                   mb: 4,
//                   textShadow: '1px 1px 5px rgba(0, 188, 212, 0.5)',
//                   animation: `${slideInOrbit} 1s ease`,
//                 }}
//               >
//                 Generate Patient Ticket
//               </Typography>
//               <Grid container spacing={3}>
//                 <Grid item xs={12} container alignItems="center" spacing={2}>
//                   <Grid item xs>
//                     <TextField
//                       label="Reference #"
//                       value={referenceNumber}
//                       disabled
//                       fullWidth
//                       variant="outlined"
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: '12px',
//                           bgcolor: 'rgba(227, 242, 253, 0.5)',
//                           transition: 'all 0.3s ease',
//                           '&:hover': { animation: `${glow} 1.5s infinite` },
//                         },
//                         '& .MuiInputLabel-root': {
//                           color: '#00bcd4',
//                           fontWeight: 'medium',
//                         },
//                       }}
//                     />
//                   </Grid>
//                   <Grid item>
//                     <IconButton
//                       onClick={() => setOpenResetDialog(true)}
//                       sx={{
//                         color: '#00bcd4',
//                         '&:hover': {
//                           bgcolor: 'rgba(0, 188, 212, 0.1)',
//                           transform: 'rotate(360deg)',
//                           transition: 'transform 0.5s ease',
//                         },
//                       }}
//                       title="Reset Reference Number"
//                     >
//                       <RefreshIcon />
//                     </IconButton>
//                   </Grid>
//                 </Grid>
//                 <Grid item xs={12} sm={3}>
//                   <TextField
//                     label="Ticket #"
//                     value={ticketNumber}
//                     disabled
//                     fullWidth
//                     variant="outlined"
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: '12px',
//                         bgcolor: 'rgba(227, 242, 253, 0.5)',
//                         transition: 'all 0.3s ease',
//                         '&:hover': { animation: `${glow} 1.5s infinite` },
//                       },
//                       '& .MuiInputLabel-root': {
//                         color: '#00bcd4',
//                         fontWeight: 'medium',
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={9}>
//                   <TextField
//                     label="Patient Name"
//                     name="patientName"
//                     value={newTicketForm.patientName}
//                     onChange={handleNewTicketChange}
//                     fullWidth
//                     variant="outlined"
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: '12px',
//                         transition: 'all 0.3s ease',
//                         animation: `${slideInOrbit} 0.7s ease forwards`,
//                         '&:hover fieldset': { borderColor: '#00bcd4' },
//                         '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
//                       },
//                       '& .MuiInputLabel-root': {
//                         color: '#00bcd4',
//                         fontWeight: 'medium',
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Phone Number"
//                     name="phoneNumber"
//                     value={newTicketForm.phoneNumber}
//                     onChange={handleNewTicketChange}
//                     fullWidth
//                     variant="outlined"
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: '12px',
//                         transition: 'all 0.3s ease',
//                         animation: `${slideInOrbit} 0.8s ease forwards`,
//                         '&:hover fieldset': { borderColor: '#00bcd4' },
//                         '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
//                       },
//                       '& .MuiInputLabel-root': {
//                         color: '#00bcd4',
//                         fontWeight: 'medium',
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Age"
//                     name="age"
//                     value={newTicketForm.age}
//                     onChange={handleNewTicketChange}
//                     fullWidth
//                     variant="outlined"
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: '12px',
//                         transition: 'all 0.3s ease',
//                         animation: `${slideInOrbit} 0.9s ease forwards`,
//                         '&:hover fieldset': { borderColor: '#00bcd4' },
//                         '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
//                       },
//                       '& .MuiInputLabel-root': {
//                         color: '#00bcd4',
//                         fontWeight: 'medium',
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     select
//                     label="Gender"
//                     name="gender"
//                     value={newTicketForm.gender}
//                     onChange={handleNewTicketChange}
//                     fullWidth
//                     variant="outlined"
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: '10px',
//                         height: '40px',
//                         transition: 'all 0.3s ease',
//                         animation: `${slideInOrbit} 1s ease forwards`,
//                         '&:hover fieldset': { borderColor: '#00bcd4' },
//                         '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
//                         '& .MuiSelect-select': {
//                           padding: '6px 8px',
//                           fontSize: '0.8rem',
//                           display: 'flex',
//                           alignItems: 'center',
//                         },
//                       },
//                       '& .MuiInputLabel-root': {
//                         color: '#00bcd4',
//                         fontWeight: 'medium',
//                         transform: 'translate(8px, 6px) scale(0.9)',
//                         '&.Mui-focused': { color: '#00bcd4' },
//                       },
//                       '& .MuiMenuItem-root': {
//                         padding: '4px 10px',
//                         fontSize: '0.8rem',
//                         minHeight: '32px',
//                         '&:hover': { bgcolor: 'rgba(0, 188, 212, 0.1)' },
//                       },
//                     }}
//                   >
//                     {genders.map((gender) => (
//                       <MenuItem key={gender} value={gender}>
//                         {gender}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     select
//                     label="Doctor"
//                     name="doctorName"
//                     value={newTicketForm.doctorName}
//                     onChange={handleNewTicketChange}
//                     fullWidth
//                     variant="outlined"
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: '10px',
//                         height: '40px',
//                         transition: 'all 0.3s ease',
//                         animation: `${slideInOrbit} 1.1s ease forwards`,
//                         '&:hover fieldset': { borderColor: '#00bcd4' },
//                         '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
//                         '& .MuiSelect-select': {
//                           padding: '6px 8px',
//                           fontSize: '0.8rem',
//                           display: 'flex',
//                           alignItems: 'center',
//                         },
//                       },
//                       '& .MuiInputLabel-root': {
//                         color: '#00bcd4',
//                         fontWeight: 'medium',
//                         transform: 'translate(8px, 6px) scale(0.9)',
//                         '&.Mui-focused': { color: '#00bcd4' },
//                       },
//                       '& .MuiMenuItem-root': {
//                         padding: '4px 10px',
//                         fontSize: '0.8rem',
//                         minHeight: '32px',
//                         '&:hover': { bgcolor: 'rgba(0, 188, 212, 0.1)' },
//                       },
//                     }}
//                   >
//                     {doctors.map((doc) => (
//                       <MenuItem key={doc} value={doc}>
//                         {doc}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     label="Reason"
//                     name="reason"
//                     value={newTicketForm.reason}
//                     onChange={handleNewTicketChange}
//                     fullWidth
//                     multiline
//                     rows={4}
//                     variant="outlined"
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: '12px',
//                         transition: 'all 0.3s ease',
//                         animation: `${slideInOrbit} 1.2s ease forwards`,
//                         '&:hover fieldset': { borderColor: '#00bcd4' },
//                         '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
//                       },
//                       '& .MuiInputLabel-root': {
//                         color: '#00bcd4',
//                         fontWeight: 'medium',
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     label="Amount"
//                     name="amount"
//                     value={newTicketForm.amount}
//                     onChange={handleNewTicketChange}
//                     fullWidth
//                     variant="outlined"
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: '12px',
//                         transition: 'all 0.3s ease',
//                         animation: `${slideInOrbit} 1.3s ease forwards`,
//                         '&:hover fieldset': { borderColor: '#00bcd4' },
//                         '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
//                       },
//                       '& .MuiInputLabel-root': {
//                         color: '#00bcd4',
//                         fontWeight: 'medium',
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     label="Temperature (°C)"
//                     name="temperature"
//                     value={newTicketForm.temperature}
//                     onChange={handleNewTicketChange}
//                     fullWidth
//                     variant="outlined"
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: '12px',
//                         transition: 'all 0.3s ease',
//                         animation: `${slideInOrbit} 1.4s ease forwards`,
//                         '&:hover fieldset': { borderColor: '#00bcd4' },
//                         '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
//                       },
//                       '& .MuiInputLabel-root': {
//                         color: '#00bcd4',
//                         fontWeight: 'medium',
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     label="Blood Pressure"
//                     name="bp"
//                     value={newTicketForm.bp}
//                     onChange={handleNewTicketChange}
//                     fullWidth
//                     variant="outlined"
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: '12px',
//                         transition: 'all 0.3s ease',
//                         animation: `${slideInOrbit} 1.5s ease forwards`,
//                         '&:hover fieldset': { borderColor: '#00bcd4' },
//                         '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
//                       },
//                       '& .MuiInputLabel-root': {
//                         color: '#00bcd4',
//                         fontWeight: 'medium',
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Box display="flex" justifyContent="center">
//                     <Button
//                       onClick={handleSubmit}
//                       variant="contained"
//                       sx={{
//                         px: 8,
//                         py: 2.5,
//                         fontWeight: 'bold',
//                         fontSize: '1.2rem',
//                         borderRadius: '20px',
//                         bgcolor: '#00bcd4',
//                         color: '#fff',
//                         textTransform: 'none',
//                         boxShadow: '0 10px 30px rgba(0, 188, 212, 0.4)',
//                         transition: 'all 0.3s ease',
//                         animation: `${pulseGlow} 3s infinite`,
//                         '&:hover': {
//                           bgcolor: '#0097a7',
//                           boxShadow: '0 15px 40px rgba(0, 188, 212, 0.6)',
//                           transform: 'scale(1.05)',
//                         },
//                       }}
//                     >
//                       Generate Ticket & Print
//                     </Button>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Card>
//           </Grid>

//           {/* Tickets Section - Right Side with Two Columns */}
//           <Grid item xs={12} md={6}>
//             {!isLoading && (
//               <Box sx={{ height: 'calc(100vh - 200px)', overflowY: 'auto', animation: `${slideUp} 1.2s ease` }}>
//                 <Typography
//                   variant="h4"
//                   fontWeight="bold"
//                   sx={{ color: '#00bcd4', mb: 3, textShadow: '1px 1px 5px rgba(0, 188, 212, 0.5)' }}
//                 >
//                   Tickets
//                 </Typography>
//                 <Divider sx={{ mb: 4, borderColor: 'rgba(0, 188, 212, 0.3)' }} />

//                 <Grid container spacing={2}>
//                   {/* Today's Tickets - Vertical Layout */}
//                   <Grid item xs={12}>
//                     <Typography variant="h6" sx={{ color: '#0288d1', mb: 2 }}>
//                       Todays Tickets
//                     </Typography>
//                     <Grid container spacing={3}>
//                       {paginatedTodayTickets.length > 0 ? (
//                         paginatedTodayTickets.map((ticket, index) => (
//                           <Grid item xs={12} key={ticket.id}>
//                             <TodayTicketCard
//                               ticket={{ ...ticket, referenceNumber: String(ticket.referenceNumber) }}
//                               onDelete={handleDelete}
//                               onPrint={() => printTicket(ticket)}
//                               onEdit={handleEdit}
//                               userRole="receptionist"
//                               style={{ animation: `${slideUp} ${(index + 1) * 0.2}s ease forwards` }}
//                             />
//                           </Grid>
//                         ))
//                       ) : (
//                         <Typography sx={{ color: '#757575' }}>No tickets today.</Typography>
//                       )}
//                     </Grid>
//                     {todayTickets.length > perPage && (
//                       <Box mt={2} display="flex" justifyContent="center">
//                         <Pagination
//                           count={Math.ceil(todayTickets.length / perPage)}
//                           page={todayPage}
//                           onChange={(e, val) => setTodayPage(val)}
//                           color="primary"
//                           size="small"
//                           sx={{
//                             '& .MuiPaginationItem-root': {
//                               borderRadius: '12px',
//                               color: '#00bcd4',
//                               bgcolor: 'rgba(255, 255, 255, 0.1)',
//                               fontWeight: 'bold',
//                               transition: 'all 0.3s ease',
//                               '&:hover': { bgcolor: 'rgba(0, 188, 212, 0.3)' },
//                               '&.Mui-selected': {
//                                 bgcolor: '#00bcd4',
//                                 color: '#ffffff',
//                                 '&:hover': { bgcolor: '#0097a7' },
//                               },
//                             },
//                           }}
//                         />
//                       </Box>
//                     )}
//                   </Grid>

                  
//                 </Grid>
//               </Box>
//             )}
//           </Grid>

//           {/* Yesterday's Tickets - Horizontal Layout */}
//                   <Grid item xs={12}>
//                     <Typography variant="h6" sx={{ color: '#0288d1', mb: 2 }}>
//                       Yesterdays Tickets
//                     </Typography>
//                     <Box sx={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', gap: 2, pb: 2 }}>
//                       {paginatedYesterdayTickets.length > 0 ? (
//                         paginatedYesterdayTickets.map((ticket, index) => (
//                           <Box key={ticket.id} sx={{ minWidth: '300px', flexShrink: 0 }}>
//                             <YesterdayTicketCard
//                               ticket={{ ...ticket, referenceNumber: String(ticket.referenceNumber) }}
//                               onDelete={handleDelete}
//                               onPrint={() => printTicket(ticket)}
//                               onEdit={handleEdit}
//                               userRole="receptionist"
//                               style={{ animation: `${slideUp} ${(index + 1) * 0.2}s ease forwards` }}
//                             />
//                           </Box>
//                         ))
//                       ) : (
//                         <Typography sx={{ color: '#757575' }}>No tickets from yesterday.</Typography>
//                       )}
//                     </Box>
//                     {yesterdayTickets.length > perPage && (
//                       <Box mt={2} display="flex" justifyContent="center">
//                         <Pagination
//                           count={Math.ceil(yesterdayTickets.length / perPage)}
//                           page={yesterdayPage}
//                           onChange={(e, val) => setYesterdayPage(val)}
//                           color="primary"
//                           size="small"
//                           sx={{
//                             '& .MuiPaginationItem-root': {
//                               borderRadius: '12px',
//                               color: '#00bcd4',
//                               bgcolor: 'rgba(255, 255, 255, 0.1)',
//                               fontWeight: 'bold',
//                               transition: 'all 0.3s ease',
//                               '&:hover': { bgcolor: 'rgba(0, 188, 212, 0.3)' },
//                               '&.Mui-selected': {
//                                 bgcolor: '#00bcd4',
//                                 color: '#ffffff',
//                                 '&:hover': { bgcolor: '#0097a7' },
//                               },
//                             },
//                           }}
//                         />
//                       </Box>
//                     )}
//                   </Grid>
//         </Grid>

//         <Snackbar
//           open={!!alert}
//           autoHideDuration={3000}
//           onClose={() => setAlert(null)}
//           anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//         >
//           {alert && (
//             <Alert
//               severity={alert.type}
//               sx={{
//                 borderRadius: '12px',
//                 boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
//                 bgcolor: alert.type === 'success' ? '#e0f7fa' : '#ffebee',
//                 color: alert.type === 'success' ? '#00bcd4' : '#d32f2f',
//                 fontWeight: 'medium',
//               }}
//             >
//               {alert.message}
//             </Alert>
//           )}
//         </Snackbar>

//         <Dialog
//           open={openResetDialog}
//           onClose={() => setOpenResetDialog(false)}
//           PaperProps={{
//             sx: {
//               borderRadius: '16px',
//               backdropFilter: 'blur(10px)',
//               bgcolor: 'rgba(255, 255, 255, 0.9)',
//             },
//           }}
//         >
//           <DialogTitle sx={{ color: '#00bcd4', fontWeight: 'bold' }}>
//             Reset Reference Number
//           </DialogTitle>
//           <DialogContent>
//             <DialogContentText sx={{ color: '#263238' }}>
//               Are you sure you want to reset the reference number to 1? This action cannot be undone.
//             </DialogContentText>
//           </DialogContent>
//           <DialogActions>
//             <Button
//               onClick={() => setOpenResetDialog(false)}
//               sx={{
//                 color: '#546e7a',
//                 textTransform: 'none',
//                 '&:hover': {
//                   bgcolor: 'rgba(0, 188, 212, 0.1)',
//                 },
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleResetReference}
//               sx={{
//                 color: '#ffffff',
//                 bgcolor: '#00bcd4',
//                 textTransform: 'none',
//                 borderRadius: '8px',
//                 '&:hover': {
//                   bgcolor: '#0097a7',
//                 },
//               }}
//             >
//               Reset
//             </Button>
//           </DialogActions>
//         </Dialog>

//         <Dialog
//           open={openEditDialog}
//           onClose={handleCloseEditDialog}
//           PaperProps={{
//             sx: {
//               borderRadius: '16px',
//               backdropFilter: 'blur(10px)',
//               bgcolor: 'rgba(255, 255, 255, 0.9)',
//             },
//           }}
//         >
//           <DialogTitle sx={{ color: '#00bcd4', fontWeight: 'bold' }}>
//             Edit Ticket
//           </DialogTitle>
//           <DialogContent>
//             <DialogContentText sx={{ color: '#263238', mb: 2 }}>
//               Update the ticket details below.
//             </DialogContentText>
//             <Grid container spacing={3}>
//               <Grid item xs={12}>
//                 <TextField
//                   label="Patient Name"
//                   name="patientName"
//                   value={editForm.patientName}
//                   onChange={handleEditChange}
//                   fullWidth
//                   variant="outlined"
//                   sx={{
//                     '& .MuiOutlinedInput-root': { borderRadius: '12px' },
//                     '& .MuiInputLabel-root': { color: '#00bcd4' },
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Phone Number"
//                   name="phoneNumber"
//                   value={editForm.phoneNumber}
//                   onChange={handleEditChange}
//                   fullWidth
//                   variant="outlined"
//                   sx={{
//                     '& .MuiOutlinedInput-root': { borderRadius: '12px' },
//                     '& .MuiInputLabel-root': { color: '#00bcd4' },
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Age"
//                   name="age"
//                   value={editForm.age}
//                   onChange={handleEditChange}
//                   fullWidth
//                   variant="outlined"
//                   sx={{
//                     '& .MuiOutlinedInput-root': { borderRadius: '12px' },
//                     '& .MuiInputLabel-root': { color: '#00bcd4' },
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   select
//                   label="Gender"
//                   name="gender"
//                   value={editForm.gender}
//                   onChange={handleEditChange}
//                   fullWidth
//                   variant="outlined"
//                   sx={{
//                     '& .MuiOutlinedInput-root': { borderRadius: '12px' },
//                     '& .MuiInputLabel-root': { color: '#00bcd4' },
//                   }}
//                 >
//                   {genders.map((gender) => (
//                     <MenuItem key={gender} value={gender}>
//                       {gender}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   select
//                   label="Doctor"
//                   name="doctorName"
//                   value={editForm.doctorName}
//                   onChange={handleEditChange}
//                   fullWidth
//                   variant="outlined"
//                   sx={{
//                     '& .MuiOutlinedInput-root': { borderRadius: '12px' },
//                     '& .MuiInputLabel-root': { color: '#00bcd4' },
//                   }}
//                 >
//                   {doctors.map((doc) => (
//                     <MenuItem key={doc} value={doc}>
//                       {doc}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   label="Reason"
//                   name="reason"
//                   value={editForm.reason}
//                   onChange={handleEditChange}
//                   fullWidth
//                   multiline
//                   rows={4}
//                   variant="outlined"
//                   sx={{
//                     '& .MuiOutlinedInput-root': { borderRadius: '12px' },
//                     '& .MuiInputLabel-root': { color: '#00bcd4' },
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   label="Amount"
//                   name="amount"
//                   value={editForm.amount}
//                   onChange={handleEditChange}
//                   fullWidth
//                   variant="outlined"
//                   sx={{
//                     '& .MuiOutlinedInput-root': { borderRadius: '12px' },
//                     '& .MuiInputLabel-root': { color: '#00bcd4' },
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   label="Temperature (°C)"
//                   name="temperature"
//                   value={editForm.temperature}
//                   onChange={handleEditChange}
//                   fullWidth
//                   variant="outlined"
//                   sx={{
//                     '& .MuiOutlinedInput-root': { borderRadius: '12px' },
//                     '& .MuiInputLabel-root': { color: '#00bcd4' },
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   label="Blood Pressure"
//                   name="bp"
//                   value={editForm.bp}
//                   onChange={handleEditChange}
//                   fullWidth
//                   variant="outlined"
//                   sx={{
//                     '& .MuiOutlinedInput-root': { borderRadius: '12px' },
//                     '& .MuiInputLabel-root': { color: '#00bcd4' },
//                   }}
//                 />
//               </Grid>
//             </Grid>
//           </DialogContent>
//           <DialogActions>
//             <Button
//               onClick={handleCloseEditDialog}
//               sx={{ color: '#546e7a', textTransform: 'none' }}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleUpdateTicket}
//               sx={{
//                 color: '#ffffff',
//                 bgcolor: '#00bcd4',
//                 textTransform: 'none',
//                 borderRadius: '8px',
//                 '&:hover': { bgcolor: '#0097a7' },
//               }}
//             >
//               Save Changes
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Box>
//     </DashboardLayout>
//   );
// };

// export default GenerateTicket;