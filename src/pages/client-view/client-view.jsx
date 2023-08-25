// import { Box, Button, TextField } from "@mui/material";
import { TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import Header from "../../components/Header";
import axios from "axios";

import useMediaQuery from "@mui/material/useMediaQuery";

import { Box, useTheme, IconButton } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useContext, useEffect, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import { useParams } from "react-router";
import MenuItem from "@mui/material/MenuItem";
import { toast } from "react-toastify";

const ClientView = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [client, setClient] = useState({
    firstName: "",
    lastName: "",
    is_active: "",
    createdAt: "",
    email: ""
  });


  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const fetchAllClients = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(`/user/${id}`);

      setClient(response.data.data.client);
      //   console.log(response);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };


  const users = [
    {
      field: "firstName",
      headerName: "first name",
      width: 200,
      renderCell: (params) => {
        return <div>{params.row.firstName}</div>;
      },
    },
    {
      field: "lastName",
      headerName: "last name",
      width: 200,
      renderCell: (params) => {
        return <div>{params.row.lastName}</div>;
      },
    },
    { field: "email", headerName: "email", width: 200 },
    {
      field: "is_active",
      headerName: "Is Active",
      renderCell: (params) => {
        return (
          <div
            className={
              params.row.is_active === true ? "green-status" : "red-status"
            }
          >
            {params.row.is_active ? "Yes" : "No"}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchAllClients();
  }, []);



  return (
    <Box m="20px">
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

      <Header title="Users Detail" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        {isLoading && <p className="form-loading">Loading...</p>}
        <Box
          display="grid"
          gap="30px"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          <TextField
            id="outlined-read-only-input"
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            variant="filled"
            type="text"
            label="First Name"
            value={client.firstName}
            name="firstName"
            sx={{ gridColumn: "span 1" }}
          />

          <TextField
            id="outlined-read-only-input"
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            variant="filled"
            type="text"
            label="First Name"
            value={client.lastName}
            name="lastName"
            sx={{ gridColumn: "span 1" }}
          />

          <TextField
            id="outlined-read-only-input"
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            variant="filled"
            type="text"
            label="Last Name"
            value={client.email}
            name="email"
            sx={{ gridColumn: "span 1" }}
          />
          <TextField
            id="outlined-read-only-input"
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            variant="filled"
            type="accepttext"
            label="Account Status"
            value={client.is_active === true ? "Active" : "InActive"}
            name="email"
            sx={{ gridColumn: "span 1" }}
          />
          <TextField
            id="outlined-read-only-input"
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            variant="filled"
            type="text"
            label="Created Date"
            value={client.createdAt?.slice(0, 10)}
            name="last_name"
            sx={{ gridColumn: "span 1" }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ClientView;
