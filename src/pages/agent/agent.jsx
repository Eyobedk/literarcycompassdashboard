import { Box, useTheme, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ColorModeContext, tokens } from "../../theme";
import ReactPaginate from "react-paginate";

// import LockOpenIcon from "@mui/icons-material/LockOpen";
// import LockIcon from "@mui/icons-material/Lock";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import Header from "../../components/Header";
import { toast } from "react-toastify";

import { useContext, useEffect, useState } from "react";

import cookie from "cookiejs";

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
// import LockClockIcon from "@mui/icons-material/LockClock";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Agent = () => {
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

  const [listOfAgent, setListOfAgent] = useState([]);
  const [totalAgents, setTotalAgents] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);

  const EditRole = (status, id) => {
    navigate(`edit/${id}`, {
      state: { status: status, id: id },
    });
  };

  const fetchAllAgents = async (page) => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        "/agentrequest?limit=10000000000000000000000"
      );
      const response2 = await axios.get(`/agentrequest?limit=10&page=${page}`);

      setTotalAgents(response.data.results);
      setListOfAgent(response2.data.data.agentRequests);
      setCurrentPage(page);

      // console.log(response.data.results, response2.data.data.agentRequests);

      setIsLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAgents();
  }, []);

  const handlePageChange = (newPage) => {
    fetchAllAgents(newPage);
  };

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1; // Pages are zero-indexed, so add 1
    handlePageChange(selectedPage);
  };

  // const activateAgentStatus = async (id, value) => {
  //   setIsLoading(true);
  //   const values = { id: id, account_status: value };

  //   try {
  //     const response = await axios.patch("/agents/accountstatus", values);
  //     toast.success(response?.data?.message);

  //     fetchAllAgents();
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message);
  //     fetchAllAgents();
  //   }
  // };

  const deleteOneAgent = async (id) => {
    setIsLoading(true);

    try {
      const response = await axios.delete(`/agentrequest/${id}`);
      if (response?.data?.status === "SUCCESS") {
        toast.success(response?.data?.message);
      }
      fetchAllAgents();
    } catch (error) {
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllAgents();
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
        url: "/agentrequest",
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
        // console.log(response.data)
        toast.error(response?.data?.message);
      }

      fetchAllAgents();
    } catch (error) {
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllAgents();
    }
  };

  const columns = [
    {
      field: "full_name",
      headerName: "full name",
      cellClassName: "name-column--cell",
      valueGetter: (params) => {
        return params.row?.client_id?.full_name;
      },
    },
    {
      field: "current_job",
      headerName: "current job",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "facebook_link",
      headerName: "Facebook Link",
    },
    {
      field: "tiktok_link",
      headerName: "Ticktok Link",
    },
    {
      field: "instagram link",
      headerName: "Instagram Link",
    },
    {
      field: "user_traction",
      headerName: "user traction",
    },
    {
      field: "cancel_reason",
      headerName: "cancel reason",
    },
    {
      field: "status",
      headerName: "status",
      renderCell: (params) => {
        return (
          <div
            className={
              params.row.status === "Pending"
                ? "yellow-status"
                : params.row.status === "Contacted"
                ? "orange-status"
                : params.row.status === "Approved"
                ? "green-status"
                : "red-status"
            }
          >
            {params.row.status}
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
            {params.row.status === "Rejected" ? (
              <EditIcon
                onClick={() => {
                  toast.error(
                    "Editing rejected request status is not allowed!"
                  );
                }}
                className="admin-icons"
              />
            ) : (
              <EditIcon
                onClick={() => {
                  EditRole(params.row.status, params.row.id);
                }}
                className="admin-icons"
              />
            )}
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
      field: "view",
      headerName: "View",
      renderCell: (params) => {
        return (
          <button
            className="publish-button"
            onClick={() => {
              navigate(`view/${params.row.client_id._id}`);
            }}
          >
            Detail
          </button>
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
          <div className="title-flex">
            <Header title="Agents" />
            <p>{totalAgents ? `Total Agents : ${totalAgents}` : ""}</p>
          </div>
          <div className="pagination-container">
            <div className="pagination-container">
              <ReactPaginate
                pageCount={Math.ceil(totalAgents / 10)}
                pageRangeDisplayed={5}
                marginPagesDisplayed={2}
                onPageChange={handlePageClick}
                activeClassName="active-client"
                previousLabel="Previous"
                nextLabel="Next"
                breakLabel="..."
                disabledClassName="disabled-c"
                previousLinkClassName={currentPage === 1 ? "disabled-c" : ""}
                nextLinkClassName={
                  currentPage === Math.ceil(totalAgents / 10)
                    ? "disabled-c"
                    : ""
                }
              />
            </div>
          </div>
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
                Are you sure you want to delete the Agent
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
                  deleteOneAgent(deleteId);
                }}
                autoFocus
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          <DataGrid rows={listOfAgent} columns={columns}components={GridToolbar} />
        </Box>
      </Box>
    </>
  );
};

export default Agent;
