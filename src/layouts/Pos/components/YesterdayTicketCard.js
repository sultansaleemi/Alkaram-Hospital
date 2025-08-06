/* eslint-disable prettier/prettier */
import React from 'react';
import PropTypes from 'prop-types'; // Import prop-types
import {
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';

const YesterdayTicketCard = ({ ticket, onDelete, onPrint, onEdit, userRole }) => {
  return (
    <Card
      sx={{
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease',
        '&:hover': { transform: 'scale(1.02)' },
        bgcolor: '#f5f5f5',
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ color: '#0288d1', fontWeight: 'bold' }}>
          Ticket #{ticket.ticketNumber}
        </Typography>
        <Typography sx={{ color: '#424242', mb: 1 }}>
          Patient: {ticket.patientName}
        </Typography>
        <Typography sx={{ color: '#757575', mb: 1 }}>
          Doctor: {ticket.doctorName}
        </Typography>
        <Typography sx={{ color: '#757575' }}>
          Date: {new Date(ticket.createdAt).toLocaleDateString()}
        </Typography>
        {userRole === 'receptionist' && (
          <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
            <IconButton
              color="primary"
              onClick={() => onEdit(ticket)}
              sx={{ '&:hover': { color: '#00bcd4' } }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => onDelete(ticket.id)}
              sx={{ '&:hover': { color: '#d32f2f' } }}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              color="default"
              onClick={() => onPrint(ticket)}
              sx={{ '&:hover': { color: '#00bcd4' } }}
            >
              <PrintIcon />
            </IconButton>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

YesterdayTicketCard.propTypes = {
  ticket: PropTypes.shape({
    ticketNumber: PropTypes.number.isRequired,
    patientName: PropTypes.string.isRequired,
    doctorName: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onPrint: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  userRole: PropTypes.string.isRequired,
};

export default YesterdayTicketCard;