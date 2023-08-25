import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import Header from "../../components/Header";
import axios from "axios";
import { toast } from "react-toastify";

import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

import { Box, useTheme, IconButton, Button } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";

const FetchPlayer = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const FetchAllRoaster = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(`/fantasyroaster`);
      if (response?.data?.status === "SUCCESS") {
        toast.success(response?.data?.message);
      }
      setIsLoading(false);
    } catch (error) {
      // console.log("error", error);
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      setIsLoading(false);
    }
  };

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

      <div>
        <Dialog
          open={open}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{""}</DialogTitle>
          <DialogContent>
            <DialogContentText id="Seasons Roaster">
              Are you sure you want to add all the seasons Roaster
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => {
                handleClose();
                FetchAllRoaster();
              }}
            >
              Fetch
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <Header title="Fetching All Roaster" />
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
        {/* <Button variant="outlined" onClick={handleClickOpen}>
       Are you sure you want to add all the seasons Roaster
      </Button> */}
        <Button color="secondary" variant="contained" onClick={handleClickOpen}>
          Fetch these seasons players
        </Button>
      </Box>
    </Box>
  );
};

export default FetchPlayer;
