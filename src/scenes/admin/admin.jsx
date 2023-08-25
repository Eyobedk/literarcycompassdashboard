import { Box, useTheme, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ColorModeContext, tokens } from "../../theme";

import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import Header from "../../components/Header";
import { toast } from "react-toastify";

import { useContext, useEffect, useState } from "react";

import AddIcon from "@mui/icons-material/Add";

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LockClockIcon from "@mui/icons-material/LockClock";

import axios from "axios";
import cookie from "cookiejs";

import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Admin = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };


  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const navigate = useNavigate();

  const [listOfAdmin, setListOfAdmin] = useState([]);
  // console.log(listOfAdmin);

  const [isLoading, setIsLoading] = useState(false);

  const EditRole = (firstName, lastName, role, id) => {
    navigate("edit", {
      state: { firstName, lastName, role: role, id: id },
    });
  };

  const fetchAllAdmins = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get("/admin");
      console.log(response.data.data.admins)
      setListOfAdmin(response.data.data.admins);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdmins();
  }, []);

  const activateAdminStatus = async (id, value) => {
    setIsLoading(true);
    const values = { is_active: value };

    try {
      console.log(values)
      const response = await axios.patch(`/admin/changestatus/${id}`, values);
      toast.success(response?.data?.message);

      fetchAllAdmins();
    } catch (error) {
      toast.error(error?.response?.data?.message);

      fetchAllAdmins();
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
        url: "/admin",
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

      fetchAllAdmins();
    } catch (error) {
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllAdmins();
    }
  };


  const columns = [
    {
      field: "firstName",
      headerName: "first_name",
      cellClassName: "name-column--cell",
    },
    {
      field: "lastName",
      headerName: "last_name",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "role",
      headerName: "role",
    },
    {
      field: "account_status",
      headerName: "status",
      renderCell: (params) => {
        return (
          <div
            className={
              params.row.is_active === true
                ? "green-status"
                : "red-status"
            }
          >
            {params.row.is_active ? "Active": "Inactive"}
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
            {params.row.is_active ? (
              <LockIcon
                className="admin-icons"
                onClick={() => {
                  activateAdminStatus(params.row._id, false);
                }}
              />
            ) : (
              <LockOpenIcon
                className="admin-icons"
                onClick={() => {
                  activateAdminStatus(params.row._id, true);
                }}
              />
            )}

            <EditIcon
              onClick={() => {
                EditRole(params.row.firstName,params.row.lastName, params.row.role, params.row._id);
              }}
              className="admin-icons"
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
          <Header title="Admins" subtitle="" />
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
          <DataGrid  getRowId={(row) => row._id} rows={listOfAdmin} columns={columns} />
        </Box>
      </Box>
    </>
  );
};

export default Admin;
