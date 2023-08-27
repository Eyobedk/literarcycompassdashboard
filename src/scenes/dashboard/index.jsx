import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import { ColorModeContext, tokens } from "../../theme";
import { useContext } from "react";

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { Book, School } from "@mui/icons-material";
import { BarChart } from "@mui/x-charts";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const [amounts, setAmounts] = useState({
    numberOfBooks: "",
    numberofAuthors: "",
    numberOfUsers: ""
  });
  const [stats, setStats] = useState({
    weekly: {readableWeeklyDate:['loading', 'loading'], readableWeeklyAmount:[100,100]},
    monthly: {readableMonthlyDate: ['loading', 'loading'], readableMonthlyAmount:[100,100]},
    yearly: {readableYearyDate: ['loading', 'loading'], readableYearyAmount: [100,100]}
  });

  const fetchAmounts = async () => {

    try {
      const response = await axios.get("/dashboard/amounts");

      setAmounts(response.data.data.amount);

    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };
  const fechStatistics = async () => {

    try {
      const response = await axios.get("/dashboard/userstat");

      setStats(response.data.data.readableData);
      console.log(stats, response.data.data.readableData)

    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message);
    }
  };

  useEffect(()=>{
    fechStatistics()
  }, [])
 
  useEffect(()=>{
    fetchAmounts()
  }, [])
  return (
    <Box m="20px">
      <div>
        <Box display="flex" justifyContent="space-between" p={2}>
          <p>.</p>
          {/* ICONS */}
          <Box display="flex">
            <IconButton onClick={colorMode.toggleColorMode}>
              {theme.palette.mode === "dark" ? (
                <DarkModeOutlinedIcon />
              ) : (
                <LightModeOutlinedIcon />
              )}
            </IconButton>
          </Box>
        </Box>
      </div>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to literacy campass dashboard" />
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        width="100%"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={amounts.numberOfUsers}
            subtitle="Number of Users"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={amounts.numberOfBooks}
            subtitle="Number of books"
            icon={
              <Book
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={amounts.numberofAuthors}
            subtitle="Number of Authors"
            icon={
              <School
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                width="100%"
                color={colors.grey[100]}
              >
                Users Anlytics Weekly
              </Typography>
              
              <BarChart
                xAxis={[
                  {
                    id: 'barCategories1',
                    data:stats.weekly?.readableWeeklyDate,
                    scaleType: 'band',
                  },
                ]}
                series={[
                  {
                    data:stats.weekly?.readableWeeklyAmount,
                  },
                ]}
                width={500}
                height={300}
              />
            </Box>
            </Box>
            </Box>
            <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                maxWidth={600}
                fontWeight="600"
                color={colors.grey[100]}
              >
                Users Anlytics Monthly
              </Typography>
              
              <BarChart
                xAxis={[
                  {
                    id: 'barCategories2',
                    data:stats.monthly?.readableMonthlyDate,
                    scaleType: 'band',
                  },
                ]}
                series={[
                  {
                    data:stats.monthly?.readableMonthlyAmount,
                  },
                ]}
                width={500}
                height={300}
              />
            </Box>
            </Box>
            </Box>
            
            <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                maxWidth={600}
                color={colors.grey[100]}
              >
                Users Anlytics Yearly
              </Typography>

              <BarChart
                xAxis={[
                  {
                    id: 'barCategories2',
                    data: stats.yearly?.readableYearyDate,
                    scaleType: 'band',
                  },
                ]}
                series={[
                  {
                    data:stats.yearly?.readableYearyAmount,
                  },
                ]}
                width={500}
                height={300}
              />
            </Box>
          </Box>
                </Box>
          
          </Box>
          
    </Box>
  );
};

export default Dashboard;
