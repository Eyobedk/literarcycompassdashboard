import { Box, useTheme, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ColorModeContext, tokens } from "../../theme";

import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
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

const Terms = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

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

  const [terms, setTerms] = useState([]);
  const [message, setMessage] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const fetchAllTerms = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get("terms/all");

      setTerms(response.data.data.termsAndConditions);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTerms();
  }, []);

  useEffect(() => {
    fetchIsMessage();
  }, []);

  const deleteOneTerm = async (id) => {
    setIsLoading(true);

    try {
      const response = await axios.delete(`/terms/${id}`);
      if (response?.data?.status === "SUCCESS") {
        toast.success(response?.data?.message);
      }
      fetchAllTerms();
    } catch (error) {
      // console.log("error", error);
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllTerms();
    }
  };


  const fetchIsMessage = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get("/terms/message");

      setMessage(response.data.data.message);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const deleteAll = async () => {
    setIsLoading(true);
    
    try {
      const response = await axios.delete("/terms", {
        // data: deleteBody,
      });
      if (response?.data?.status === "SUCCESS") {
        toast.success(response?.data?.message);
      }
      if (
        response?.data?.status === "ERROR" ||
        response?.data?.status === "FAIL"
      ) {
        toast.error(response?.data?.message);
      }

      fetchAllTerms();
    } catch (error) {
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllTerms();
    }
  };

  const isMessageColumn = [
    {
      field: "title",
      headerName: "Title",
      cellClassName: "name-column--cell",
    },
    {
      field: "content",
      headerName: "Content",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "is_published",
      headerName: "status",
      width: 200,
      renderCell: (params) => {
        return (
          <div
            className={
              params.row.is_published === true ? "green-status" : "red-status"
            }
          >
            {params.row.is_published ? "Published" : "Drafted"}
          </div>
        );
      },
    },
    {
      field: "accessLevel",
      headerName: "Access Level",
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <RemoveRedEyeIcon
              onClick={() => {
                navigate(`view/${params.row.id}`);
              }}
              className="admin-icons"
            />
            <EditIcon
              onClick={() => {
                navigate(`edit/${params.row.id}`);
              }}
              className="admin-icons"
            />
            <DeleteIcon
              className="admin-icons"
              onClick={() => {
                handleClickOpenDelete(params.row.id);
              }}
            />
          </>
        );
      },
    },
  ];


  const columns = [
    {
      field: "title",
      headerName: "Title",
      cellClassName: "name-column--cell",
    },
    {
      field: "content",
      headerName: "Content",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "is_message",
      headerName: "Is Message",
      renderCell: (params) => {
        return (
          <div
            className={
              params.row.is_message === true ? "green-status" : "red-status"
            }
          >
            {params.row.is_message ? "Message" : "Not Message"}
          </div>
        );
      },
    },
    {
      field: "is_published",
      headerName: "status",
      renderCell: (params) => {
        return (
          <div
            className={
              params.row.is_published === true ? "green-status" : "red-status"
            }
          >
            {params.row.is_published ? "Published" : "Drafted"}
          </div>
        );
      },
    },
    {
      field: "accessLevel",
      headerName: "Access Level",
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <RemoveRedEyeIcon
              onClick={() => {
                navigate(`view/${params.row.id}`);
              }}
              className="admin-icons"
            />
            <EditIcon
              onClick={() => {
                navigate(`edit/${params.row.id}`);
              }}
              className="admin-icons"
            />
            <DeleteIcon
              className="admin-icons"
              onClick={() => {
                handleClickOpenDelete(params.row.id);
              }}
            />
          </>
        );
      },
    },
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
          <Header title="Terms And Conditions"/>
          <div>
            <IconButton
              onClick={() => {
                navigate("add");
              }}
            >
              <AddIcon />
            </IconButton>
            <IconButton onClick={handleClickOpen}>
              <DeleteIcon />
            </IconButton>

            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Notice"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete all the Terms
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
                Are you sure you want to delete the term
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
                  deleteOneTerm(deleteId);
                }}
                autoFocus
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          <Header subtitle="Update Message" />

          <DataGrid autoHeight = {true} rows={message} columns={isMessageColumn} />
              <Box  m="40px 0 0 0" ></Box>
          <DataGrid
            rows={terms}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
      </Box>
    </>
  );
};

export default Terms;
