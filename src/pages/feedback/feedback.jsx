import { Box, useTheme, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ColorModeContext, tokens } from "../../theme";
import DeleteIcon from "@mui/icons-material/Delete";

import Header from "../../components/Header";
import { toast } from "react-toastify";

import { useContext, useEffect, useState } from "react";

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

import axios from "axios";
// .

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Feedback = () => {
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

  const [feedback, setFeedback] = useState([]);
  //   console.log(feedback);

  const [isLoading, setIsLoading] = useState(false);

  const fetchAllFeedback = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get("/feedback");

      setFeedback(response.data.data.feedbacks);
      //   console.log(response.data);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllFeedback();
  }, []);

  const deleteOneFeedback = async (id) => {
    setIsLoading(true);

    try {
      const response = await axios.delete(`/feedback/${id}`);
      if (response?.data?.status === "SUCCESS") {
        toast.success(response?.data?.message);
      }
      fetchAllFeedback();
    } catch (error) {
      // console.log("error", error);
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllFeedback();
    }
  };

  const deleteAll = async () => {
    setIsLoading(true);
    // let deleteBody = JSON.stringify({
    //   delete_key: process.env.REACT_APP_DELETE_KEY,
    // });
    try {
      const response = await axios.delete("/feedback", {
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

      fetchAllFeedback();
    } catch (error) {
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllFeedback();
    }
  };

  const columns = [
    {
      field: "title",
      headerName: "Title",
      cellClassName: "name-column--cell",
      width: 150,
    },
    {
      field: "content",
      headerName: "Content",
      headerAlign: "left",
      align: "left",
      width: 300,
    },
    {
      field: "Created At",
      headerName: "Created At",
      renderCell: (params) => {
        return <div>{params.row.createdAt.slice(0, 10)}</div>;
      },
    },
    {
      field: "published",
      headerName: "status",
      renderCell: (params) => {
        return <div>{params.row.updatedAt.slice(0, 10)}</div>;
      },
    },
    {
      field: "Update Status",
      headerName: "Access Level",
      width: 200,
      renderCell: (params) => {
        return (
          <>
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
          <Header title="User's Feedback" />
          <div>
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
                  Are you sure you want to delete all the feedback
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
                  deleteOneFeedback(deleteId);
                }}
                autoFocus
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          <DataGrid
            rows={feedback}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
      </Box>
    </>
  );
};

export default Feedback;
