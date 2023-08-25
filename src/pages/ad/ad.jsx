import { Box, useTheme, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ColorModeContext, tokens } from "../../theme";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import Header from "../../components/Header";
import { toast } from "react-toastify";

import { useContext, useEffect, useState } from "react";

import AddIcon from "@mui/icons-material/Add";

import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

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

const Ad = () => {
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

  const [about, setAbout] = useState([]);
  // console.log(about);

  const [isLoading, setIsLoading] = useState(false);

  const fetchAllAbout = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get("/advertisement/all");

      setAbout(response.data.data.ad);
      // console.log(response.data.data.ads);

      setIsLoading(false);
    } catch (error) {
      // console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAbout();
  }, []);

  const deleteAll = async () => {
    setIsLoading(true);
    // let deleteBody = JSON.stringify({
    //   delete_key: process.env.REACT_APP_DELETE_KEY,
    // });
    try {
      const response = await axios.delete("/advertisement", {
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

      fetchAllAbout();
    } catch (error) {
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllAbout();
    }
  };

  const deleteOneAbout = async (id) => {
    setIsLoading(true);

    try {
      const response = await axios.delete(`/advertisement/${id}`);
      if (response?.data?.status === "SUCCESS") {
        toast.success(response?.data?.message);
      }
      fetchAllAbout();
    } catch (error) {
      // console.log("error", error);
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllAbout();
    }
  };

  const changeStatus = async (status, id) => {
    setIsLoading(true);
    const data = {
      is_active: status,
    };
    try {
      const response = await axios.patch(
        `/advertisement/updatestatus/${id}`,
        data
      );
      //   console.log(response);
      if (response?.data?.status === "SUCCESS") {
        toast.success(response?.data?.message);
      }
      fetchAllAbout();
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllAbout();
      setIsLoading(false);
    }
  };

  const columns = [
    {
      field: "company_name",
      headerName: "company_name",
      headerAlign: "left",
      align: "left",
      width: 160,
    },
    {
      field: "start_date",
      headerName: "start_date",
      headerAlign: "left",
      align: "left",
      width: 80,
      renderCell: (params) => {
        return <div>{params.row.start_date.slice(0, 10)}</div>;
      },
    },
    {
      field: "expire_date",
      headerName: "expire_date",
      headerAlign: "left",
      align: "left",
      width: 80,
      renderCell: (params) => {
        return <div>{params.row.expire_date.slice(0, 10)}</div>;
      },
    },
    {
      field: "price",
      headerName: "price",
      headerAlign: "left",
      align: "left",
      width: 70,
    },
    {
      field: "createdAt",
      headerName: "createdAt",
      width: 80,
      renderCell: (params) => {
        return <div>{params.row.createdAt.slice(0, 10)}</div>;
      },
    },
    {
      field: "Status",
      headerName: "STATUS",
      width: 80,
      renderCell: (params) => {
        return (
          <div
            className={
              params.row.is_active === true ? "green-status" : "red-status"
            }
          >
            {params.row.is_active ? "Active" : "InActive"}
          </div>
        );
      },
    },
    {
      field: "Update Status",
      headerName: "Access Level",
      width: 140,

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
      headerName: "Change Status",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="flexxxxer">
            {params.row.is_active ? (
              <button
                className="draft-button bbtn"
                onClick={() => {
                  changeStatus(false, params.row.id);
                }}
              >
                Deactivate
              </button>
            ) : (
              <button
                className="publish-button bbtn"
                onClick={() => {
                  changeStatus(true, params.row.id);
                }}
              >
                Activate
              </button>
            )}
            {
              <button
                className="change-date-button bbtn"
                onClick={() => {
                  navigate(`change-active/${params.row.id}`);
                }}
              >
                Change Date
              </button>
            }
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
        {/* <Header title="Advertisement" /> */}
        <div className="title-split">
          <Header title="Advertisement" />
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
                  Are you sure you want to delete all the Ad
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
                Are you sure you want to delete the Ad
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
                  deleteOneAbout(deleteId);
                }}
                autoFocus
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          <DataGrid
            rows={about}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
      </Box>
    </>
  );
};

export default Ad;
