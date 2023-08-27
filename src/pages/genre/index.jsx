import { Box, useTheme, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ColorModeContext, tokens } from "../../theme";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import Header from "../../components/Header";
import { toast } from "react-toastify";

import { useContext, useEffect, useState } from "react";

import AddIcon from "@mui/icons-material/Add";

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Genre = () => {
  const [deleteId, setDeleteId] = useState("");
  const [openDelete, setOpenDelete] = useState(false);

  const handleClickOpenDelete = (id) => {
    setOpenDelete(true);
    setDeleteId(id);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const navigate = useNavigate();

  const [genre, setGenre] = useState([]);
  //   console.log(genre);

  const [isLoading, setIsLoading] = useState(false);

  const fetchAllGenre = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get("/genre");

      setGenre(response.data.data.genre);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllGenre();
  }, []);

  const deleteOneGenre = async (id) => {
    setIsLoading(true);

    try {
      const response = await axios.delete(`/genre/${id}`);
      if (response?.data?.status === "SUCCESS") {
        toast.success(response?.data?.message);
      }
      fetchAllGenre();
    } catch (error) {
      // console.log("error", error);
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllGenre();
    }
  };


  const columns = [
    {
      field: "title",
      headerName: "title",
      headerAlign: "left",
      align: "left",
      width: 200,
    },
    {
      field: "createdAt",
      headerName: "createdAt",
      headerAlign: "left",
      align: "left",
      width: 300,
    },
    {
      field: "Update Status",
      headerName: "Access Level",
      width: 100,

      renderCell: (params) => {
        return (
          <>
            <EditIcon
              onClick={() => {
                navigate(`edit/${params.row._id}`);
              }}
              className="admin-icons"
            />
            <DeleteIcon
              className="admin-icons"
              onClick={() => {
                handleClickOpenDelete(params.row._id);
              }}
            />
          </>
        );
      },
    }
  ];

  return (
    <>
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
      <Box m="20px">
        <div className="title-split">
          <Header title="Genre" />
          <div>
            <IconButton
              onClick={() => {
                navigate("add");
              }}
            >
              <AddIcon />
            </IconButton>
          </div>
        </div>

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
          <Dialog
            open={openDelete}
            onClose={handleCloseDelete}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Notice"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete the genre
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  handleCloseDelete();
                }}
              >
                cancel
              </Button>
              <Button
                color="secondary"
                variant="contained"
                onClick={() => {
                  handleCloseDelete();
                  deleteOneGenre(deleteId);
                }}
                autoFocus
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          <DataGrid
          getRowId={(row) => row._id}
            rows={genre}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
      </Box>
    </>
  );
};

export default Genre;
