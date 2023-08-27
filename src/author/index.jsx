
import { Box, useTheme, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ColorModeContext, tokens } from "../theme";
import EditIcon from "@mui/icons-material/Edit";

import Header from "../components/Header";
import { toast } from "react-toastify";

import { useContext, useEffect, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

import axios from "axios";
import cookie from "cookiejs";

import { useNavigate } from "react-router-dom";

const Author = () => {
  const getRowId = (row) => row._id;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const navigate = useNavigate();

  const [author, setAuthor] = useState([]);


  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [deleteId, setDeleteId] = useState("");
  const [openDelete, setOpenDelete] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };



  const handleCloseDelete = () => {
    setOpenDelete(false);
  };


  const fetchAllAuthors = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get("/author");

      setAuthor(response.data.data.author);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };


  const deleteAll = async () => {
    setIsLoading(true);
    const tokenString = cookie.get("admin");
    try {
      let headersList = {
        Accept: "*/*",
        Authorization: `Bearer ${tokenString}`,
        "Content-Type": "application/json",
      };

      let bodyContent = JSON.stringify({
        deleteKey: process.env.REACT_APP_DELETE_KEY,
      });

      const reqOptions = {
        url: "/author",
        method: "DELETE",
        headers: headersList,
        data: bodyContent,
      };

      const response = await axios.request(reqOptions);
      if (response?.data?.status === "SUCCESS") {
        toast.success(response?.data?.message);
      }
      if (
        response?.data?.status === "ERROR" ||
        response?.data?.status === "FAIL"
      ) {
        toast.error(response?.data?.message);
      }

      fetchAllAuthors();
    } catch (error) {
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllAuthors();
    }
  };

  const deleteOneAuthor = async (id) => {
    setIsLoading(true);

    try {
      const response = await axios.delete(`/author/${id}`);
      if (response?.data?.status === "SUCCESS") {
        toast.success(response?.data?.message);
      }
      fetchAllAuthors();
    } catch (error) {
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllAuthors();
    }
  };

  useEffect(() => {
    fetchAllAuthors();
  }, []);


  const handleClickOpenDelete = (id) => {
    setOpenDelete(true);
    setDeleteId(id);
  };

  const columns = [
    {
      field: "full_name",
      headerName: "Author name",
      headerAlign: "left",
      align: "left",
      width: 100,
    },
    {
      field: "birth_date",
      headerName: "bith date",
      headerAlign: "left",
      align: "left",
      width: 100,
    },
    {
      field: "website",
      headerName: "website",
      headerAlign: "left",
      align: "left",
      width: 100,
    },
    {
      field: "Update Status",
      headerName: "Access Level",
      width: 140,

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
        {/* <Header title="author" /> */}
        <div className="title-split">
          <Header title="Author" />
          <div>
            <IconButton
              onClick={() => {
                navigate("add");
              }}
            >
              <AddIcon />
            </IconButton>

            {/* <IconButton onClick={handleClickOpen}>
              <DeleteIcon />
            </IconButton> */}

            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Notice"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete all authors
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    handleClose();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => {
                    handleClose();
                    deleteAll();
                  }}
                  autoFocus
                >
                  Delete All
                </Button>
              </DialogActions>
            </Dialog>
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
                Are you sure you want to delete the Author
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
                  deleteOneAuthor(deleteId);
                }}
                autoFocus
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>


          <DataGrid
            rows={author}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={getRowId}
          />
        </Box>
      </Box>
    </>
  );
};

export default Author;
