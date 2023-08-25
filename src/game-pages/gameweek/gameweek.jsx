import { Box, useTheme, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ColorModeContext, tokens } from "../../theme";
import EditIcon from "@mui/icons-material/Edit";

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
import { TextField } from "@mui/material";

import axios from "axios";
import cookie from "cookiejs";

import { useNavigate } from "react-router-dom";

const GameWeek = () => {
  function generateRandomCode() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    const codeLength = 6;

    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }

    return code;
  }

  const getRowId = (row) => row._id;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [codeInput, setCodeInput] = useState("");

  const navigate = useNavigate();

  const [openConfirm, setConfirmOpen] = useState(false);

  const handleClickConfirmOpen = () => {
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const [gameWeek, setGameWeek] = useState([]);
  const [competetion, setComptetion] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [deleteId, setDeleteId] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [currentData, setCurrentData] = useState({ id: "", state: "" });

  const [randomCode, setRandomCode] = useState();

  useEffect(() => {
    setRandomCode(generateRandomCode());
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const fetchAllGameWeeks = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get("/gameweek");

      setGameWeek(response.data.data.gameWeeks);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const fetchComptetion = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `/competitions/${gameWeek.competition_id}`
      );

      setComptetion(response.data.data.competition);

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
        delete_key: process.env.REACT_APP_DELETE_KEY,
      });

      const reqOptions = {
        url: "/gameweek",
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
        // console.log(response.data);
        toast.error(response?.data?.message);
      }

      fetchAllGameWeeks();
    } catch (error) {
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllGameWeeks();
    }
  };

  const deleteOneGameWeek = async (id) => {
    setIsLoading(true);

    try {
      const response = await axios.delete(`/gameweek/${id}`);
      if (response?.data?.status === "SUCCESS") {
        toast.success(response?.data?.message);
      }
      fetchAllGameWeeks();
    } catch (error) {
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllGameWeeks();
    }
  };

  useEffect(() => {
    fetchAllGameWeeks();
  }, []);

  useEffect(() => {
    fetchComptetion();
  }, [gameWeek]);

  const changeStatus = async (status, id) => {
    setIsLoading(true);
    const data = {
      is_active: status,
    };
    try {
      const response = await axios.patch(`/gameweek/status/${id}`, data);
      //   console.log(response);
      if (response?.data?.status === "SUCCESS") {
        toast.success(response?.data?.message);
      }
      fetchAllGameWeeks();
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllGameWeeks();
      setIsLoading(false);
    }
  };

  const changeToFreeOrPaid = async (status, id) => {
    setIsLoading(true);
    const data = {
      is_free: status,
    };
    try {
      const response = await axios.patch(`/gameweek/free/${id}`, data);
      //   console.log(response);
      if (response?.data?.status === "SUCCESS") {
        toast.success(response?.data?.message);
      }
      fetchAllGameWeeks();
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllGameWeeks();
      setIsLoading(false);
    }
  };

  const changeDoneStatus = async () => {
    setIsLoading(true);
    const data = {
      is_done: currentData.state,
    };
    try {
      const response = await axios.patch(
        `/gameweek/done/${currentData.id}`,
        data
      );
      //   console.log(response);
      if (response?.data?.status === "SUCCESS") {
        toast.success(response?.data?.message);
      }
      fetchAllGameWeeks();
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllGameWeeks();
      setIsLoading(false);
    }
  };

  const handleClickOpenDelete = (id) => {
    setOpenDelete(true);
    setDeleteId(id);
  };

  const columns = [
    {
      field: "game_week",
      headerName: "Game Week",
      headerAlign: "left",
      align: "left",
      width: 100,
    },
    {
      field: "sid",
      headerName: "Season Id",
      headerAlign: "left",
      align: "left",
      width: 100,
    },
    {
      field: "cid",
      headerName: "Competition Id",
      headerAlign: "left",
      align: "left",
      width: 100,
    },
    {
      field: "transfer_deadline",
      headerName: "Trasnfer DeadLine",
      headerAlign: "left",
      align: "left",
      width: 300,
      renderCell: (params) => {
        return <div>{new Date(params.row.transfer_deadline).toString()}</div>;
      },
    },
    {
      field: "purchase_deadline",
      headerName: "Dead Line",
      headerAlign: "left",
      align: "left",
      width: 300,
      renderCell: (params) => {
        return <div>{new Date(params.row.purchase_deadline).toString()}</div>;
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
              {params.row.is_free ? (
                <button
                  className="publish-button bbtn"
                  onClick={() => {
                    changeToFreeOrPaid(false, params.row._id);
                  }}
                >
                  To Paid
                </button>
              ) : (
                <button
                  className="tofree-button bbtn"
                  onClick={() => {
                    changeToFreeOrPaid(true, params.row._id);
                  }}
                >
                  To Free
                </button>
              )}
            </div>

            <div className="flexxxxer">
              {params.row.is_done ? (
                <button
                  className="draft-button bbtn"
                  onClick={() => {
                    // changeDoneStatus(false, params.row._id);
                    handleClickConfirmOpen();
                    setCurrentData({ id: params.row._id, state: false });
                  }}
                >
                  Not Done
                </button>
              ) : (
                <button
                  className="done-button bbtn"
                  onClick={() => {
                    // changeDoneStatus(true, params.row._id);
                    handleClickConfirmOpen();
                    setCurrentData({ id: params.row._id, state: true });
                  }}
                >
                  Done
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
        {/* <Header title="gameWeek" /> */}
        <div className="title-split">
          <Header title="Game Week" />
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
            <Dialog open={openConfirm} onClose={handleConfirmClose}>
              <DialogTitle>Alert Confirmation</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please Enter the following code in the text box. code :{" "}
                  {randomCode}
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="ENTER CODE"
                  type="email"
                  fullWidth
                  variant="standard"
                  onChange={(e) => {
                    setCodeInput(e.target.value);
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleConfirmClose}>Cancel</Button>
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  onClick={() => {
                    if (randomCode === codeInput) {
                      changeDoneStatus();
                      handleConfirmClose();
                      setRandomCode(generateRandomCode());
                    } else {
                      toast.error("code doest match. try again");
                      handleConfirmClose();
                      setRandomCode(generateRandomCode());
                    }
                  }}
                >
                  Confirm
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
                Are you sure you want to delete the GameWeek
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
                  deleteOneGameWeek(deleteId);
                }}
                autoFocus
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          <DataGrid
            rows={gameWeek}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={getRowId}
          />
        </Box>
      </Box>
    </>
  );
};

export default GameWeek;
