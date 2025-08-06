/* eslint-disable prettier/prettier */
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import axios from "axios";
import React, { useEffect, useState } from "react";
import MDTypography from "components/MDTypography";

function Dashboard() {
  const [stats, setStats] = useState({
    todaysPatients: 0,
    todaysCash: 0,
    ticketsGenerated: 0,
  });
  const [chartData, setChartData] = useState({
    reportsBarChartData: reportsBarChartData,
    sales: reportsLineChartData.sales,
    tasks: reportsLineChartData.tasks,
  });
  const currentYear = new Date().getFullYear();

  const [regularPatients, setRegularPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthName, setMonthName] = useState(""); // New state for month name

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const today = new Date(); // Dynamic current date
      const currentMonth = today.getMonth(); // 0-based (e.g., 7 for August, 8 for September)
      const currentYear = today.getFullYear();
      const currentDateStr = today.toISOString().split("T")[0]; // e.g., "2025-08-04"

      const [ticketsResponse, patientsResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/tickets"),
        axios.get("http://localhost:5000/api/patients"),
      ]);

      const tickets = Array.isArray(ticketsResponse.data) ? ticketsResponse.data : [];
      const patients = Array.isArray(patientsResponse.data) ? patientsResponse.data : [];

      console.log("Tickets data:", tickets); // Debug
      console.log("Patients data:", patients); // Debug

      if (tickets.length === 0 || patients.length === 0) {
        console.warn("No data received from backend. Check API endpoints.");
        setLoading(false);
        return;
      }

      // Filter tickets for today
      const todaysTickets = tickets.filter((ticket) => {
        if (!ticket.createdAt) {
          console.warn("Missing createdAt for ticket:", ticket);
          return false;
        }
        const ticketDate = new Date(ticket.createdAt.replace(" ", "T")).toISOString().split("T")[0];
        return ticketDate === currentDateStr;
      });
      console.log("Today's tickets:", todaysTickets); // Debug

      // Unique patients with tickets today
      const uniquePatientsToday = todaysTickets.length > 0 ? [...new Set(todaysTickets.map((ticket) => ticket.patientId))].length : 0;

      // Today's cash
      const todaysCash = todaysTickets.reduce((sum, ticket) => sum + (Number(ticket.amount) || 0), 0);

      // Tickets generated today
      const ticketsGenerated = todaysTickets.length;

      setStats({ todaysPatients: uniquePatientsToday, todaysCash, ticketsGenerated });

      // Monthly data for the current month
      const monthlyTickets = tickets.filter((ticket) => {
        if (!ticket.createdAt) return false;
        const ticketDate = new Date(ticket.createdAt.replace(" ", "T"));
        return ticketDate.getMonth() === currentMonth && ticketDate.getFullYear() === currentYear;
      });

      // Map patientIds to names
      const patientMap = new Map(patients.map((p) => [p.id, p.patientName]));

      // Aggregate data by week for the current month
      const weeks = [];
      const startDate = new Date(currentYear, currentMonth, 1); // First day of the month
      const endDate = new Date(currentYear, currentMonth + 1, 0); // Last day of the month
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 7)) {
        const weekEnd = new Date(d);
        weekEnd.setDate(weekEnd.getDate() + 6); // End of the week (Saturday)
        if (weekEnd > endDate) weekEnd.setDate(endDate.getDate());
        weeks.push({ start: new Date(d), end: weekEnd });
      }

      const ticketsPerWeek = weeks.map((week) =>
        monthlyTickets.filter((ticket) => {
          const ticketDate = new Date(ticket.createdAt.replace(" ", "T"));
          return ticketDate >= week.start && ticketDate <= week.end;
        }).length
      );
      console.log("Tickets per week:", ticketsPerWeek); // Debug
      const cashPerWeek = weeks.map((week) =>
        monthlyTickets
          .filter((ticket) => {
            const ticketDate = new Date(ticket.createdAt.replace(" ", "T"));
            return ticketDate >= week.start && ticketDate <= week.end;
          })
          .reduce((sum, ticket) => sum + (Number(ticket.amount) || 0), 0)
      );
      const uniquePatientsPerWeek = weeks.map((week) =>
        [...new Set(
          monthlyTickets
            .filter((ticket) => {
              const ticketDate = new Date(ticket.createdAt.replace(" ", "T"));
              return ticketDate >= week.start && ticketDate <= week.end;
            })
            .map((ticket) => ticket.patientId)
        )].length
      );

      // Update chart data with weekly data
      const weekLabels = weeks.map((week, index) => `Week ${index + 1}`);
      setChartData({
        reportsBarChartData: {
          ...reportsBarChartData,
          labels: weekLabels,
          datasets: [
            {
              ...reportsBarChartData.datasets[0],
              data: ticketsPerWeek,
              backgroundColor: "#0288d1",
            },
          ],
        },
        sales: {
          ...reportsLineChartData.sales,
          labels: weekLabels,
          datasets: [
            {
              ...reportsLineChartData.sales.datasets[0],
              data: cashPerWeek,
              backgroundColor: "#4caf50",
            },
          ],
        },
        tasks: {
          ...reportsLineChartData.tasks,
          labels: weekLabels,
          datasets: [
            {
              ...reportsLineChartData.tasks.datasets[0],
              data: uniquePatientsPerWeek,
              backgroundColor: "#1976d2",
            },
          ],
        },
      });

      // Set the month name
      setMonthName(today.toLocaleString("default", { month: "long" }));
      
      // Regular patients (top 5 by ticket count this month)
      const patientTicketCounts = [...new Set(monthlyTickets.map((ticket) => ticket.patientId))].map((id) => ({
        id,
        name: patientMap.get(id) || `Patient ${id}`,
        count: monthlyTickets.filter((t) => t.patientId === id).length,
      }));
      setRegularPatients(patientTicketCounts.sort((a, b) => b.count - a.count).slice(0, 5));
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []); // Empty dependency array to run once on mount

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox p={4} display="flex" justifyContent="center">
          <MDTypography variant="h6">Loading dashboard data...</MDTypography>
        </MDBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="local_hospital"
                title="Today's Patients"
                count={stats.todaysPatients}
                percentage={{ color: "success", amount: "+12%", label: "than last week" }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="payments"
                title="Today's Cash"
                count={`Rs. ${Number(stats.todaysCash || 0).toFixed(2)}`}
                percentage={{ color: "success", amount: "+10%", label: "than yesterday" }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="confirmation_number"
                title="Tickets Generated"
                count={stats.ticketsGenerated}
                percentage={{ color: "success", amount: "", label: "Just updated" }}
              />
            </MDBox>
          </Grid>
        </Grid>

        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  key={chartData.reportsBarChartData.labels.join("-")} // Force re-render on data change
                  color="info"
                  title={`Tickets Generated (Weekly - ${monthName} ${currentYear})`}
                  description={`${monthName} ${currentYear} summary`}
                  date="updated now"
                  chart={chartData.reportsBarChartData}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  key={chartData.sales.labels.join("-")} // Force re-render on data change
                  color="success"
                  title={`Weekly Cash (${monthName} ${currentYear})`}
                  description={<>(+15%) increase in ${monthName} cash.</>}
                  date="updated now"
                  chart={chartData.sales}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  key={chartData.tasks.labels.join("-")} // Force re-render on data change
                  color="dark"
                  title={`Total Patients (Weekly - ${monthName} ${currentYear})`}
                  description={`${monthName} ${currentYear} performance`}
                  date="just updated"
                  chart={chartData.tasks}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>

        <MDBox mt={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <MDBox mb={3} p={2} borderRadius="lg" sx={{ backgroundColor: "#fff", boxShadow: "0 2px 6px rgba(0, 136, 209, 0.05)" }}>
                <MDTypography variant="h6" sx={{ color: "#0288d1", fontWeight: 700, mb: 2 }}>
                  Regular Patients
                </MDTypography>
                {regularPatients.map((patient, index) => (
                  <MDBox key={patient.id} display="flex" justifyContent="space-between" py={1} px={2} sx={{ borderBottom: index < regularPatients.length - 1 ? "1px solid #e0e0e0" : "none" }}>
                    <MDTypography variant="body2" color="text">{patient.name}</MDTypography>
                    <MDTypography variant="body2" color="text">{patient.count} tickets</MDTypography>
                  </MDBox>
                ))}
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;