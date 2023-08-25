import { Box, useTheme, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ColorModeContext, tokens } from "../../theme";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import Header from "../../components/Header";
import { toast } from "react-toastify";

import { useContext, useEffect, useState } from "react";

import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

import AddIcon from "@mui/icons-material/Add";

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import cookie from "cookiejs";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const PrivacyPolicy = () => {
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

  const [privacy, setPrivacy] = useState([]);
  // console.log(privacy);

  const [isLoading, setIsLoading] = useState(false);

  const fetchAllPrivacy = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get("/privacy/all");

      setPrivacy(response.data.data.privacy);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPrivacy();
  }, []);

  const deleteOnePrivacy = async (id) => {
    setIsLoading(true);

    try {
      const response = await axios.delete(`/privacy/${id}`);
      if (response?.data?.status === "SUCCESS") {
        toast.success(response?.data?.message);
      }
      fetchAllPrivacy();
    } catch (error) {
      // console.log("error", error);
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllPrivacy();
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
        delete_key: process.env.REACT_APP_DELETE_KEY,
      });

      const reqOptions = {
        url: "/privacy",
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

      fetchAllPrivacy();
    } catch (error) {
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllPrivacy();
    }
  };

  const 
  changeStatus = async (status, id) => {
    const value = status === "draft" ? false : true;

    setIsLoading(true);
    console.log({ status: value });
    const data = {
      status: value,
    };
    try {
      const response = await axios.patch(`/privacy/status/${id}`, data);
      //   console.log(response);
      if (response?.data?.status === "SUCCESS") {
        toast.success(response?.data?.message);
      }
      fetchAllPrivacy();
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllPrivacy();
      setIsLoading(false);
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
      field: "is_message",
      headerName: "Is Message",
      renderCell: (params) => {
        return (
          <div
            className={
              params.row.is_message === true ? "green-status" : "red-status"
            }
          >
            {params.row.is_message ? "is Message" : "not message"}
          </div>
        );
      },
    },
    {
      field: "published",
      headerName: "status",
      renderCell: (params) => {
        return (
          <div
            className={
              params.row.is_published === true ? "green-status" : "red-status"
            }
          >
            {params.row.is_published ? "published" : "not published"}
          </div>
        );
      },
    },
    {
      field: "Update Status",
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
    {
      field: "accessLevel",
      headerName: "Status",
      width: 200,
      renderCell: (params) => {
        return (
          <div>
            {params.row.is_published ? (
              <button
                className="draft-button bbtn"
                onClick={() => {
                  changeStatus("draft", params.row._id);
                }}
              >
                To draft
              </button>
            ) : (
              <button
                className="publish-button bbtn"
                onClick={() => {
                  changeStatus("published", params.row._id);
                }}
              >
                Publish
              </button>
            )}
          </div>
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
        {/* <Header title="Privacy And Policy" /> */}
        <div className="title-split">
          <Header title="Privacy And Policy" />
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
                  Are you sure you want to delete all the Privacy and policy
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
                Are you sure you want to delete the Privacy
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
                  deleteOnePrivacy(deleteId);
                }}
                autoFocus
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          <DataGrid
            rows={privacy}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
      </Box>
    </>
  );
};

export default PrivacyPolicy;
