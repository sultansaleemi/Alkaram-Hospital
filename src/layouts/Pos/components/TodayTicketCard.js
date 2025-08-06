/* eslint-disable prettier/prettier */
import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Fade,
  Tooltip,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/LocalPrintshop";
import DeleteIcon from "@mui/icons-material/Delete";
import EditOutlined from "@mui/icons-material/EditOutlined";
import { keyframes } from "@emotion/react";

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const TodayTicketCard = ({ ticket, onDelete, onPrint, onEdit, userRole }) => {
  if (!ticket) {
    return null;
  }

  const isAdmin = userRole === "admin";
  const isReceptionist = userRole === "receptionist" || userRole === "admin";

  const EditIconComponent = EditOutlined || (() => <span>Edit</span>);

  return (
    <Fade in timeout={1400}>
      <Card
        variant="outlined"
        sx={{
          position: "relative",
          borderRadius: 3,
          background: "rgba(255, 255, 255, 0.25)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          backdropFilter: "blur(12px)",
          color: "#000",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 8px 28px rgba(0,0,0,0.2)",
          },
        }}
      >
        <CardContent>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: "bold", color: "#4a4a4a", mb: 1 }}
          >
            Ref #: {ticket.referenceNumber}
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ color: "#1A73E8" }}>
            #{ticket.ticketNumber} &mdash; {ticket.patientName}
          </Typography>

          <Typography variant="body2">
            &#x1F4DE; Phone: {ticket.phoneNumber || "N/A"}
          </Typography>
          <Typography variant="body2">
            &#x1F9A7; Doctor: {ticket.doctorName || "N/A"}
          </Typography>
          <Typography variant="body2">
            &#x1F4AC; Reason: {ticket.reason || "N/A"}
          </Typography>
          <Typography variant="body2">
            &#x1F4B0; Amount: Rs. {ticket.amount || "N/A"}
          </Typography>
          <Typography variant="body2">
            &#x1F321; Temp: {ticket.temperature || "N/A"}&deg;C
          </Typography>
          <Typography variant="body2">
            &#x1FA78; BP: {ticket.bp || "N/A"}
          </Typography>
          <Typography variant="body2">
            &#x1F382; Age: {ticket.age || "N/A"}
          </Typography>
          <Typography variant="body2">
            &#x26A7; Gender: {ticket.gender || "N/A"}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {ticket.createdAt
              ? new Date(ticket.createdAt).toLocaleTimeString()
              : "N/A"}
          </Typography>

          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              display: "flex",
              gap: 0.5,
            }}
          >
            <Tooltip title="Print Ticket">
              <IconButton
                onClick={() => onPrint(ticket)}
                sx={{
                  background: "linear-gradient(195deg, #49a3f1, #1A73E8)",
                  color: "#fff",
                  "&:hover": {
                    background: "linear-gradient(195deg, #42a0f5, #1669da)",
                    animation: `${pulse} 0.8s ease`,
                  },
                }}
                size="small"
              >
                <PrintIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {isAdmin && (
              <Tooltip title="Delete Ticket">
                <IconButton
                  onClick={() => onDelete(ticket.id)}
                  sx={{
                    background: "linear-gradient(195deg, #e53935, #ef5350)",
                    color: "#fff",
                    "&:hover": {
                      background: "linear-gradient(195deg, #cc3331, #f66563)",
                      animation: `${pulse} 0.8s ease`,
                    },
                  }}
                  size="small"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {isReceptionist && (
              <Tooltip title="Edit Ticket">
                <IconButton
                  onClick={() => onEdit(ticket)}
                  sx={{
                    background: "linear-gradient(195deg, #4caf50, #66bb6a)",
                    color: "#fff",
                    "&:hover": {
                      background: "linear-gradient(195deg, #43a047, #58a358)",
                      animation: `${pulse} 0.8s ease`,
                    },
                  }}
                  size="small"
                >
                  <EditIconComponent fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

TodayTicketCard.propTypes = {
  ticket: PropTypes.shape({
    id: PropTypes.number.isRequired,
    ticketNumber: PropTypes.number.isRequired,
    referenceNumber: PropTypes.string.isRequired,
    patientName: PropTypes.string.isRequired,
    doctorName: PropTypes.string.isRequired,
    reason: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    temperature: PropTypes.string.isRequired,
    bp: PropTypes.string.isRequired,
    age: PropTypes.string.isRequired,
    gender: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }),
  onDelete: PropTypes.func.isRequired,
  onPrint: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  userRole: PropTypes.oneOf(["admin", "receptionist", "guest"]).isRequired,
};

TodayTicketCard.defaultProps = {
  onEdit: () => {},
  ticket: {},
};

export default TodayTicketCard;