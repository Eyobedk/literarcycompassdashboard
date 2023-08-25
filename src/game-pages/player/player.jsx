import { Box, useTheme, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ColorModeContext, tokens } from "../../theme";

import Header from "../../components/Header";
import { toast } from "react-toastify";

import { useContext, useEffect, useState } from "react";

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const Players = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const navigate = useNavigate();

  const [FantasyRoaster, setFantasyRoaster] = useState([]);
  // console.log(FantasyRoaster);

  const [isLoading, setIsLoading] = useState(false);

  const fetchAllFantasyRoaster = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get("/fantasyroaster/all");

      setFantasyRoaster(response.data.data.fantasyRoasters);
      // console.log(response.data.data);

      setIsLoading(false);
    } catch (error) {
      // console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllFantasyRoaster();
  }, []);

  const changeStatus = async (status, id) => {
    setIsLoading(true);
    const data = {
      is_active: status,
    };
    try {
      const response = await axios.patch(`/fantasyroaster/${id}/status`, data);
      //   console.log(response);
      if (response?.data?.status === "SUCCESS") {
        toast.success(response?.data?.message);
      }
      fetchAllFantasyRoaster();
      setIsLoading(false);
    } catch (error) {
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllFantasyRoaster();
      setIsLoading(false);
    }
  };

  const columns = [
    {
      field: "season_name",
      headerName: "Season Name",
      headerAlign: "left",
      align: "left",
      width: 160,
    },
    {
      field: "Creation date",
      headerName: "createdAt",
      renderCell: (params) => {
        return <div>{params.row.createdAt?.slice(0, 10)}</div>;
      },
      width: 160,
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
      field: "Change Status",
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
          </div>
        );
      },
    },
    {
      field: "Access",
      headerName: "Access Level",
      width: 180,

      renderCell: (params) => {
        return (
          <>
            <button
              onClick={() => {
                navigate(`season/${params.row.season_name}`);
              }}
              className="players-button"
            >
              Manage Players
            </button>
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
          <Header title="Players" />
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

          <DataGrid
            rows={FantasyRoaster}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
      </Box>
    </>
  );
};

export default Players;
