import { Box, useTheme, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ColorModeContext, tokens } from "../../theme";
import EditIcon from "@mui/icons-material/Edit";
import { TextField } from "@mui/material";

import Header from "../../components/Header";
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
import { MenuItem } from "react-pro-sidebar";

const Coach = () => {
  const getRowId = (row) => row._id;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const navigate = useNavigate();

  const [coach, setCoach] = useState([]);
  const [activeCoaches, setActiveCoaches] = useState([]);
  const [existingCoach, setExistingCoach] = useState({
    existingCoachName: "",
    existingCoachId: "",
  });

  const [competetion, setComptetion] = useState({});
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedCoach, setSelectedCoach] = useState("");
  const [newMajorCoachId, setNewMajorCoachId] = useState("");
  const [coacheDropDown, setCoachDropDown] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [openForSwitchMajor, setOpenForSwitchMajor] = useState(false);
  const [open, setOpen] = useState(false);

  const [deleteId, setDeleteId] = useState("");
  const [openDelete, setOpenDelete] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpenForSwitchMajor = (existingCoachData) => {
    navigate("tomajor", { state: existingCoachData });
    organizeComptetionsList();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseForSwitchMajor = () => {
    setOpenForSwitchMajor(false);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };


  const fetchAllCoachs = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get("/coach/all");

      setCoach(response.data.data.coaches);

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
        url: "/coach",
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

      fetchAllCoachs();
    } catch (error) {
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllCoachs();
    }
  };

  const deleteOneCoach = async (id) => {
    setIsLoading(true);

    try {
      const response = await axios.delete(`/coach/${id}`);
      if (response?.data?.status === "SUCCESS") {
        toast.success(response?.data?.message);
      }
      fetchAllCoachs();
    } catch (error) {
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllCoachs();
    }
  };

  useEffect(() => {
    fetchAllCoachs();
  }, []);

  /**
   * organize comptition list with the current active comption
   */
  function organizeComptetionsList() {
    const newCoachesList = [];
    if (coach.length !== 0) {
      for (let i = 0; i < coach.length; i++) {
        if (coach[i]?.coach_name !== existingCoach.existingCoachName) {
          newCoachesList.push({
            name: coach[i].coach_name,
            label: coach[i].coach_name,
            id: coach[i]?._id,
          });
        }
      }
      setCoachDropDown(newCoachesList);
    }
  }

  const changeStatus = async (status, id) => {
    setIsLoading(true);
    const data = {
      is_active: status,
    };
    try {
      const response = await axios.patch(
        `/coach/status/${id}`,
        data
      );
      if (response?.data?.status === "SUCCESS") {
        toast.success(response?.data?.message);
      }
      fetchAllCoachs();
      setIsLoading(false);
    } catch (error) {
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllCoachs();
      setIsLoading(false);
    }
  };

  const changeDoneStatus = async (status, id) => {
    setIsLoading(true);
    const data = {
      is_done: status,
    };
    try {
      const response = await axios.patch(
        `/gameweek/done/${id}`,
        data
      );
      if (response?.data?.status === "SUCCESS") {
        toast.success(response?.data?.message);
      }
      fetchAllCoachs();
      setIsLoading(false);
    } catch (error) {
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllCoachs();
      setIsLoading(false);
    }
  };

  const handleClickOpenDelete = (id) => {
    setOpenDelete(true);
    setDeleteId(id);
  };

  const columns = [
    {
      field: "coach_name",
      headerName: "Coach name",
      headerAlign: "left",
      align: "left",
      width: 100,
    },
    {
      field: "is_major",
      headerName: "IS MAJOR",
      width: 80,
      renderCell: (params) => {
        return (
          <div
            className={
              params.row.is_major === true ? "green-status" : "red-status"
            }
          >
            {params.row.is_major ? "Yes" : "No"}
          </div>
        );
      },
    },
    {
      field: "is_active",
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
            <EditIcon
              onClick={() => {
                navigate(`edit/${params.row._id}`);
              }}
              className="admin-icons"
            />

            {/* <DeleteIcon
              className="admin-icons"
              onClick={() => {
                handleClickOpenDelete(params.row._id);
              }}
            /> */}
          </>
        );
      },
    },
    {
      field: "accessLevel",
      headerName: "Change Status",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="gameweekbtnspace">
            <div className="flexxxxer">
              {params.row.is_active ? (
                <button
                  className="draft-button bbtn"
                  onClick={() => {
                    changeStatus(false, params.row._id);
                  }}
                >
                  Deactivate
                </button>
              ) : (
                <button
                  className="publish-button bbtn"
                  onClick={() => {
                    changeStatus(true, params.row._id);
                  }}
                >
                  Activate
                </button>
              )}
            </div>

            <div className="flexxxxer">
              {params.row.is_major ? null : (
                <button
                  className="tofree-button bbtn"
                  onClick={() => {
                    handleClickOpenForSwitchMajor({
                      existingCoachName: params.row?.coach_name,
                      existingCoachId: params.row?._id,
                    });
                  }}
                >
                  To Major
                </button>
              )}
            </div>
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
        {/* <Header title="coach" /> */}
        <div className="title-split">
          <Header title="Coach" />
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
                Are you sure you want to delete the Coach
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
                  deleteOneCoach(deleteId);
                }}
                autoFocus
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            fullWidth
            open={openForSwitchMajor}
            onClose={handleCloseForSwitchMajor}
          >
            <DialogTitle>Give Prize</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Insert the prize of the selected {selectedValue} value.
              </DialogContentText>
              <TextField
                fullWidth
                id="filled-select-currency"
                select
                label="Select"
                variant="filled"
                value={selectedCoach}
                sx={{ gridColumn: "span 4" }}
                onChange={(e) => {
                  setSelectedCoach(e.target.value);
                }}
              >
                {/* <Select value={selectedCoach} onChange={changeSelectedCoach} fullWidth> */}

                {coacheDropDown.map((option) => (
                  <MenuItem key={option.id} value={option.name}>
                    {option.name}
                  </MenuItem>
                ))}
                {/* </Select> */}
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button
                style={{
                  color: "white",
                  backgroundColor: "rgba(16, 109, 92, 0.65)",
                }}
                onClick={handleCloseForSwitchMajor}
              >
                Cancel
              </Button>
              <Button
                style={{
                  color: "black",
                  backgroundColor: "rgba(255, 234, 1, 0.935)",
                }}
                onClick={changeDoneStatus}
              >
                Give Prize
              </Button>
            </DialogActions>
          </Dialog>

          <DataGrid
            rows={coach}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={getRowId}
          />
        </Box>
      </Box>
    </>
  );
};

export default Coach;
