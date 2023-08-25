import { Box, useTheme, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ColorModeContext, tokens } from "../../theme";
import EditIcon from "@mui/icons-material/Edit";

import Header from "../../components/Header";
import { toast } from "react-toastify";

import { useContext, useEffect, useState } from "react";

import AddIcon from "@mui/icons-material/Add";

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const Season = () => {
  const [thereIsActiveSeason, setThereIsActiveSeason] = useState(false);
  //   console.log(thereIsActiveSeason);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const navigate = useNavigate();

  const [season, setSeason] = useState([]);
  // console.log(season);

  const [isLoading, setIsLoading] = useState(false);

  const fetchAllSeason = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get("/season/all");

      setSeason(response.data.data.season);
      if (response.data.data.season.length >= 1) {
        setThereIsActiveSeason(true);
      }
      //   console.log(response.data.data.season);

      setIsLoading(false);
    } catch (error) {
      // console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSeason();
  }, []);

  const changeStatus = async (status, id) => {
    setIsLoading(true);
    const data = {
      is_active: status,
    };
    try {
      const response = await axios.patch(`/season/updatestatus/${id}`, data);
      //   console.log(response);
      if (response?.data?.status === "SUCCESS") {
        toast.success(response?.data?.message);
      }
      fetchAllSeason();
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllSeason();
      setIsLoading(false);
    }
  };

  const columns = [
    {
      field: "season_id",
      headerName: "Season Id",
      headerAlign: "left",
      align: "left",
      width: 160,
    },
    {
      field: "name",
      headerName: "Season Name",
      headerAlign: "left",
      align: "left",
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
      field: "Update Status",
      headerName: "Access Level",
      width: 140,

      renderCell: (params) => {
        return (
          <>
            <EditIcon
              onClick={() => {
                navigate(`edit/${params.row.id}`);
              }}
              className="admin-icons"
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
        {/* <Header title="season" /> */}
        <div className="title-split">
          <Header title="Season" />
          <div>
            {!isLoading && !thereIsActiveSeason && (
              <IconButton
                onClick={() => {
                  navigate("add");
                }}
              >
                <AddIcon />
              </IconButton>
            )}
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

          <DataGrid
            rows={season}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
      </Box>
    </>
  );
};

export default Season;
