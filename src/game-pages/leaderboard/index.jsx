import * as React from "react";
import { ColorModeContext, tokens } from "../../theme";
import { useTheme, IconButton } from "@mui/material";

import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";

import axios from "axios";
import { toast } from "react-toastify";
import MenuItem from "@mui/material/MenuItem";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

function LeaderBoard(props) {
  const [price, setPrice] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = React.useContext(ColorModeContext);

  const [gameWeekTeams, setGameWeekTeams] = React.useState([]);

  const [availableGameWeek, setAvailableGameWeek] = React.useState([]);
  const [selectedGameWeek, setSelectedGameWeek] = React.useState("");
  const [selectedSeason, setSelectedSeason] = React.useState("");
  const [client, setClient] = React.useState("");

  //   console.log(selectedGameWeek);
  const [isLoading, setIsLoading] = React.useState(false);
  // const [selectedValue, setSelectedValue] = React.useState("Weekly");
  // const [activeGameWeek, setActiveGameWeek] = React.useState(null);
  // const [prize, setPrize] = React.useState(0);
  // const [winnerData, setWinnerData] = React.useState({ season_id: "", clientId: "", gameWeekId: "" });
  // const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  // const handleChange = (_, newValue) => {
  //     setSelectedValue(newValue)
  // };

  // const handleClickOpen = (clientId) => {
  //     setOpen(true);
  //     setWinnerData({ clientId: clientId, gameWeekId: activeGameWeek._id, season_id: activeGameWeek.sid })
  // };

  // const handleClose = () => {
  //     setOpen(false);
  // };

  const fetchAllGameWeeksAvailable = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(`/gameweek`);

      setAvailableGameWeek(response.data.data.gameWeeks);

      //   console.log(response.data.data.gameWeeks);
      setSelectedSeason(response.data.data.gameWeeks[0]?.sid);
      //   console.log(response.data.data.gameWeeks[0]?.sid);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAllGameWeeksAvailable();
  }, []);

  const fetchAllGameWeeksWeaklyLeaderBoard = async () => {
    if (selectedGameWeek === "") {
      toast.error("you have to select a gameweek");
    } else {
      setIsLoading(true);

      try { 
        const response = await axios.get(
          `/gameweekteam/weeklyleaderboard/${selectedGameWeek}`
        );

        // selectedSeason(response.data.data.weeklyLeaderBoard);
        // console.log(response.data.data.weeklyLeaderBoard);
        if (response.data.data.weeklyLeaderBoard.length === 0) {
          toast.error("no available players are in the selected game week");
        }

        if (response?.data?.status === "SUCCESS") {
          setGameWeekTeams(response.data.data.weeklyLeaderBoard);
        }

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    }
  };


  const createWinner = async () => {
    setIsLoading(true);
    try {
      setOpen(false);

      const response = await axios.post("/winners", {
        client_id: client,
        season: selectedSeason,
        game_week_id: selectedGameWeek,
        weekly_monthly_yearly: "Weekly",
        prize: price,
      });

      setPrice("");

      if (response?.data?.status === "SUCCESS") {
        toast.success("Successfuly added client to winners list!!");
      }

      setIsLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setIsLoading(false);
    }
  };

  const columns = [
    {
      field: "client_id",
      headerName: "client",
      headerAlign: "left",
      align: "left",
      width: 160,
      valueGetter: (params) => {
        return params.row?.client_id?.full_name;
      },
    },
    {
      field: "game_week_id",
      headerName: "First match start date",
      headerAlign: "left",
      align: "left",
      width: 160,
      renderCell: (params) => {
        return <div>{params.row.game_week_id.first_match_start_date.slice(0, 10)}</div>;
      },
    },
    {
      field: "total_fantasy_point",
      headerName: "total team point",
      width: 150,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "prize",
      headerName: "Give Price",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="flexxxxer">
            {
              <Button
                style={{
                  color: "white",
                  backgroundColor: "rgba(11, 163, 135, 0.65)",
                }}
                variant="outlined"
                onClick={() => {
                  handleClickOpen();
                  setClient(params.row?.client_id?._id);
                }}
              >
                {/* props.row?.sid, props.row?.client?.id */}
                Prize
              </Button>
            }
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Box display="flex" justifyContent="space-between" p={2}>
        <p>.</p>
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

      <div className="flex">
      <Button style={{ backgroundColor: "rgba(11, 163, 135, 0.65)" }} 
                variant="contained" className="whitetxt" onClick={()=> navigate("/leaderboard")}>
                Weekly
            </Button>

            <Button style={{ backgroundColor: "rgb(28 255 213 / 65%)" }} 
                variant="contained" className="whitetxt" onClick={()=> navigate("/leaderboard/monthly")}>
                Monthly
            </Button>

            <Button style={{ backgroundColor: "rgb(28 255 213 / 65%)" }} 
                variant="contained" className="whitetxt" onClick={()=> navigate("/leaderboard/yearly")}>
                Yearly
            </Button>
      </div>
      {isLoading && <p className="form-loading">Loading...</p>}

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
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Rating Edit</DialogTitle>
          <DialogContent>
            <DialogContentText>
              write the Price you want for the player
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Price"
              type="email"
              fullWidth
              variant="standard"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
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
                createWinner();
                handleClose();
              }}
            >
              Give Prize
            </Button>
          </DialogActions>
        </Dialog>
        {/* <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Give Prize</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Insert the prize of the selected {selectedValue} value.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Prize Amount"
              type="number"
              fullWidth
              value={prize}
              //   onChange={(e) => setPrize(e.target.value)}
              autoComplete="fa"
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button
              style={{
                color: "white",
                backgroundColor: "rgba(16, 109, 92, 0.65)",
              }}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              style={{
                color: "black",
                backgroundColor: "rgba(255, 234, 1, 0.935)",
              }}
              //   onClick={createWinner}
            >
              Give Prize
            </Button>
          </DialogActions>
        </Dialog> */}
        {availableGameWeek.length > 0 && (
          <>
            <TextField
              fullWidth
              id="filled-select-currency"
              select
              name="role"
              label="Select"
              value={selectedGameWeek}
              defaultValue="Admin"
              variant="filled"
              sx={{ gridColumn: "span 2" }}
              onChange={(e) => {
                setSelectedGameWeek(e.target.value);
              }}
            >
              {availableGameWeek.map((option) => (
                <MenuItem key={option._id} value={option.id}>
                  {option.game_week}
                </MenuItem>
              ))}
            </TextField>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                //   type="submit"
                onClick={() => {
                  fetchAllGameWeeksWeaklyLeaderBoard();
                }}
                color="secondary"
                variant="contained"
                disabled={isLoading}
              >
                Price the selected gameweek
              </Button>
            </Box>
          </>
        )}

        <DataGrid
          rows={gameWeekTeams}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </div>
  );
}

export default React.memo(LeaderBoard);
