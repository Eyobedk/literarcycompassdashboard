import { Box, useTheme, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ColorModeContext, tokens } from "../../theme";
import { TextField as TextBoxs } from "@mui/material";

import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Header from "../../components/Header";
import { toast } from "react-toastify";

import useMediaQuery from "@mui/material/useMediaQuery";

import { useContext, useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

import axios from "axios";
import { useParams } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";

import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";

const AllPlayers = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [openEdit, setEditOpen] = useState(false);

  const handleClickEditOpen = () => {
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const os = [
    {
      value: true,
      label: "ON",
    },
    {
      value: false,
      label: "OFF",
    },
  ];

  const [values, setValues] = useState(false);
  // console.log(values);

  const { id } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  //   const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [Players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);

  const [uniqueClubNames, setUniqueClubNames] = useState([]);
  const [uniquePositions, setUniquePositions] = useState([]);

  //filtering methods
  const [search, setSearch] = useState("");
  const [selectedClubName, setSelectedClubName] = useState("all");
  const [selectedPosition, setSelectedPosition] = useState("all");

  const [seasonName, setSeasonName] = useState("");
  const [season_m_id, setSeason_m_id] = useState("");
  // console.log(season_m_id);

  const [selectedPLayerToEdit, setSelectedPLayerToEdit] = useState({
    rating: "",
    pid: "",
  });
  // console.log(selectedPLayerToEdit);

  const [isCurrentSeason, setIsCurrentSeason] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSeason, setIsLoadingSeason] = useState(false);

  const Filter = () => {
    const allPlayersList = [...Players];

    let searchFiltered = [];
    let positionFiltered = [];
    let clubFiltered = [];

    // let filteredPlayersList = [];

    //search Filter
    if (search === "") {
      searchFiltered = [...allPlayersList];
    } else {
      searchFiltered = allPlayersList.filter((player) =>
        player.pname.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      );
    }

    //position Filter
    if (selectedPosition === "all") {
      positionFiltered = [...searchFiltered];
    } else {
      positionFiltered = searchFiltered.filter(
        (player) => player.role === selectedPosition
      );
    }

    //Club Filter
    if (selectedClubName === "all") {
      clubFiltered = [...positionFiltered];
    } else {
      clubFiltered = positionFiltered.filter(
        (player) => player.team.tname === selectedClubName
      );
    }

    //set filtered array

    setFilteredPlayers([...clubFiltered]);
  };

  useEffect(() => {
    setFilteredPlayers([...Players]);
    Filter();
  }, [Players]);

  useEffect(() => {
    if (Players.length > 0) {
      Filter();
    }
  }, [search, selectedClubName, selectedPosition]);

  const fetchAllPlayers = async () => {
    setIsLoadingSeason(true);

    try {
      const response = await axios.get("/fantasyroaster");

      setPlayers(response.data.data.fantasyRoaster[0].players);
      // console.log(response.data.data.fantasyRoaster[0].players);

      setSeasonName(response.data.data.fantasyRoaster[0].season_name);
      setSeason_m_id(response.data.data.fantasyRoaster[0].id);

      const clubs = response.data.data.fantasyRoaster[0].players.map(
        (player) => player.team.tname
      );
      setUniqueClubNames([...new Set(clubs)]);
      // console.log(uniqueClubNames);

      const positions = response.data.data.fantasyRoaster[0].players.map(
        (player) => player.role
      );
      setUniquePositions([...new Set(positions)]);

      if (id === response.data.data.fantasyRoaster[0].season_name) {
        setIsCurrentSeason(true);
      }

      setIsLoadingSeason(false);
    } catch (error) {
      setIsLoadingSeason(false);
    }
  };
  // console.log(selectedPLayerToEdit);

  useEffect(() => {
    fetchAllPlayers();
  }, []);

  const editPlayer = async () => {
    setIsLoading(true);

    try {
      const response = await axios.patch(
        `/fantasyroaster/${season_m_id}/price`,
        {
          ...selectedPLayerToEdit,
        }
      );

      if (response?.data?.status === "SUCCESS") {
        toast.success(response?.data?.message);
      }
      fetchAllPlayers();
      setIsLoading(false);
    } catch (error) {
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllPlayers();
      setIsLoading(false);
    }
  };

  const editRadar = async () => {
    setIsLoading(true);

    try {
      const response = await axios.patch(
        `/fantasyroaster/${season_m_id}/transfer`,
        {
          pid: selectedPLayerToEdit.pid,
          transfer_radar: values,
        }
      );

      if (response?.data?.status === "SUCCESS") {
        toast.success(response?.data?.message);
      }
      fetchAllPlayers();
      setIsLoading(false);
    } catch (error) {
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      fetchAllPlayers();
      setIsLoading(false);
    }
  };

  const columns = [
    {
      field: "pid",
      headerName: "Player Id",
      headerAlign: "left",
      align: "left",
      width: 160,
      renderCell: (params) => {
        return (
          <div>
            <div className={params.row.is_new ? "new" : "old"}>
              {params.row.pid}
            </div>
          </div>
        );
      },
    },
    {
      field: "pname",
      headerName: "Player Name",
      renderCell: (params) => {
        return <div>{params.row.pname}</div>;
      },
      width: 160,
    },
    {
      field: "rating",
      headerName: "rating",
      width: 80,
    },
    {
      field: "role",
      headerName: "Role",
      width: 80,
    },
    {
      field: "team",
      headerName: "team",
      renderCell: (params) => {
        return <div>{params.row.team.tname}</div>;
      },
      width: 80,
    },
    {
      field: "Radar",
      headerName: "Radar",
      width: 100,
      renderCell: (params) => {
        return (
          <>
            <div
              className={
                params.row.transfer_radar ? "tofree-button" : "grey-status"
              }
            >
              {params.row.transfer_radar ? "ON" : "OFF"}
            </div>
            <IconButton
              onClick={() => {
                setValues(params.row.transfer_radar);
                setSelectedPLayerToEdit({
                  ...selectedPLayerToEdit,
                  rating: params.row.rating,
                  pid: params.row.pid,
                });
                handleClickEditOpen();
              }}
            >
              <ChangeCircleIcon />
            </IconButton>
          </>
        );
      },
    },
    {
      field: "State",
      headerName: "Currently",
      width: 100,
      renderCell: (params) => {
        return (
          <div className={params.row.is_new ? "red-status" : "green-status"}>
            {params.row.is_new ? "Not Changed" : "Changed"}
          </div>
        );
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
              params.row.is_new_transfer === true
                ? "green-status"
                : "grey-status"
            }
          >
            {params.row.is_new_transfer ? "New" : "Old"}
          </div>
        );
      },
    },
    {
      field: "Access",
      headerName: "Price",
      width: 140,

      renderCell: (Params) => {
        return (
          <>
            <div>
              <IconButton
                onClick={() => {
                  setSelectedPLayerToEdit({
                    ...selectedPLayerToEdit,
                    rating: Params.row.rating,
                    pid: Params.row.pid,
                  });
                  handleClickOpen();
                }}
              >
                <EditIcon />
              </IconButton>
            </div>
          </>
        );
      },
    },
  ];

  return (
    <div>
      {isLoadingSeason && (
        <Box
          m="40px 20px 20px 20px"
          height="0"
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
          {isLoadingSeason && <p className="form-loading">Loading...</p>}
        </Box>
      )}
      {!isLoadingSeason && isCurrentSeason && (
        <div>
          <div>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Rating Edit</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  write the rating you want the player to have
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Player Rating"
                  type="email"
                  fullWidth
                  variant="standard"
                  value={selectedPLayerToEdit.rating}
                  onChange={(e) => {
                    setSelectedPLayerToEdit({
                      ...selectedPLayerToEdit,
                      rating: e.target.value,
                    });
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  onClick={() => {
                    editPlayer();
                    handleClose();
                  }}
                >
                  Change
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog open={openEdit} onClose={handleEditClose}>
              <DialogTitle>Radar Edit</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Select the radar you want the player to have
                </DialogContentText>

                <TextField
                  fullWidth
                  id="filled-select-currency"
                  select
                  name="os"
                  label="Select radar"
                  value={values}
                  variant="filled"
                  sx={{ gridColumn: "span 4" }}
                  onChange={(e) => {
                    setValues(e.target.value);
                  }}
                >
                  {os.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleEditClose}>Cancel</Button>
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  onClick={() => {
                    editRadar();
                    handleEditClose();
                  }}
                >
                  Change
                </Button>
              </DialogActions>
            </Dialog>

            <Box display="flex" justifyContent="space-between" p={2}>
              <Header
                title={`Players ${seasonName ? `of ${seasonName}` : ""}`}
              />

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
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextBoxs
                fullWidth
                variant="filled"
                type="text"
                label="Search Name"
                name="Search"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                value={search}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                id="outlined-read-only-input"
                value={selectedClubName}
                select
                name="Game Week"
                variant="filled"
                sx={{ gridColumn: "span 2" }}
                onChange={(e) => {
                  setSelectedClubName(e.target.value);
                }}
              >
                <MenuItem key="all" value="all">
                  All Clubs
                </MenuItem>
                {uniqueClubNames.map((club) => (
                  <MenuItem key={club} value={club}>
                    {club}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                id="outlined-read-only-input"
                value={selectedPosition}
                select
                name="Game Week"
                variant="filled"
                sx={{ gridColumn: "span 2" }}
                onChange={(e) => {
                  setSelectedPosition(e.target.value);
                }}
              >
                <MenuItem key="all" value="all">
                  All Positions
                </MenuItem>
                {uniquePositions.map((position) => (
                  <MenuItem key={position} value={position}>
                    {position}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
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
                rows={filteredPlayers}
                columns={columns}
                components={{ Toolbar: GridToolbar }}
              />
            </Box>
          </Box>
        </div>
      )}
    </div>
  );
};

export default AllPlayers;
