import { Box, useTheme, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
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

const AppVersion = () => {
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

  const [appVersions, setAppVersions] = useState([]);
  // console.log(appVersions);

  const [isLoading, setIsLoading] = useState(false);

  const EditAppVersion = (id) => {
    navigate(`edit/${id}`);
  };

  const fetchAllAppVersion = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get("/appversion");
      setAppVersions(response.data.data.appVersions);
      //   console.log(response.data.data.appVersions);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAppVersion();
  }, []);

  const deleteOneAppVersion = async (id) => {
    setIsLoading(true);

    try {
      const response = await axios.delete(`/appversion/${id}`);
      if (response?.data?.status === "SUCCESS") {
        toast.success(response?.data?.message);
      }
      fetchAllAppVersion();
    } catch (error) {
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllAppVersion();
    }
  };

  const changeStatus = async (providedStatus, id) => {
    setIsLoading(true);
    const data = {
      highly_severe: providedStatus,
    };
    try {
      const response = await axios.patch(`/appversion/severity/${id}`, data);
      //   console.log(response);
      if (response?.data?.status === "SUCCESS") {
        toast.success(response?.data?.message);
      }
      fetchAllAppVersion();
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllAppVersion();
      setIsLoading(false);
    }
  };

  const deleteAll = async () => {
    setIsLoading(true);

    try {
      const response = await axios.delete("/appversion");
      if (response?.data?.status === "SUCCESS") {
        toast.success(response?.data?.message);
      }
      if (
        response?.data?.status === "ERROR" ||
        response?.data?.status === "FAIL"
      ) {
        toast.error(response?.data?.message);
      }

      fetchAllAppVersion();
    } catch (error) {
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllAppVersion();
    }
  };

  const columns = [
    {
      field: "latest_version",
      headerName: "Latest Version",
      cellClassName: "name-column--cell",
    },
    {
      field: "os",
      headerName: "operating system",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "createdAt",
      headerName: "Created At",
      renderCell: (params) => {
        return <div>{params.row.createdAt.slice(0, 10)}</div>;
      },
    },
    {
      field: "url",
      headerName: "Url",
      width: 400,
    },
    {
      field: "highly_severe",
      headerName: "status",
      renderCell: (params) => {
        return (
          <div
            className={params.row.highly_severe ? "red-status" : "grey-status"}
          >
            {params.row.highly_severe ? "High" : "Low"}
          </div>
        );
      },
    },
    {
      field: "Change",
      headerName: "change Status",
      renderCell: (params) => {
        return (
          <div>
            <button
              className={
                params.row.highly_severe ? "grey-status" : "red-status"
              }
            >
              {params.row.highly_severe ? "To Low" : "To High"}
            </button>
          </div>
        );
      },
      renderCell: (params) => {
        return (
          <div className="flexxxxer">
            {params.row.highly_severe ? (
              <button
                className="draft-button bbtn"
                onClick={() => {
                  changeStatus(false, params.row.id);
                }}
              >
                To Low
              </button>
            ) : (
              <button
                className="publish-button bbtn"
                onClick={() => {
                  changeStatus(true, params.row.id);
                }}
              >
                To High
              </button>
            )}
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
            <EditIcon
              onClick={() => {
                EditAppVersion(params.row.id);
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
          <Header title="App Versions" subtitle="" />
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
                  Are you sure you want to delete all the content
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
                Are you sure you want to delete the Admin
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
                  deleteOneAppVersion(deleteId);
                }}
                autoFocus
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          <DataGrid rows={appVersions} columns={columns} />
        </Box>
      </Box>
    </>
  );
};

export default AppVersion;
