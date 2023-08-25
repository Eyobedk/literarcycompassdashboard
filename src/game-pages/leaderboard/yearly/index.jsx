import * as React from 'react';
import { ColorModeContext, tokens } from "../../../theme";
import { useTheme, IconButton } from "@mui/material";

import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';

import axios from "axios";
import { toast } from "react-toastify";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from 'react-router-dom';


export default function YearlyLeaderboard(props) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = React.useContext(ColorModeContext);

    const [selectedValue, setSelectedValue] = React.useState("Yearly");
    const [gameWeekTeams, setGameWeekTeams] = React.useState([]);
    const [activeGameWeek, setActiveGameWeek] = React.useState(null);
    const [prize, setPrize] = React.useState(0);
    const [winnerData, setWinnerData] = React.useState({ season_id: "", clientId: "", gameWeekId: "" });
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    const handleChange = (_, newValue) => {
        setSelectedValue(newValue)
    };

    const handleClickOpen = (clientId) => {
        setOpen(true);
        setWinnerData({ clientId, gameWeekId: activeGameWeek.id, season_id: activeGameWeek.season_id })
    };

    const handleClose = () => {
        setOpen(false);
    };

    const fetchAllGameWeekTeams = async () => {

        try {
            const response = await axios.get("/gameweekteam/yearlyleaderboard");

            setGameWeekTeams(response.data.data.yearlyLeaderboard);

        } catch (error) {
            console.log(error)
        }
    };

    const fetchActiveGameWeeks = async () => {

        try {
            const response = await axios.get("/gameweek/active");

            if(response.data.data === null){
                return toast.error("No Active Game Week Found!!")
            }

            if (response?.data?.status === "SUCCESS") {
                setActiveGameWeek(response?.data?.data?.gameWeek);
            }

        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };

    React.useEffect(() => {
        fetchAllGameWeekTeams();
        fetchActiveGameWeeks();
    }, [])

    const createWinner = async () => {
        try {
            setOpen(false)
            const response = await axios.post("/winners", {
                client_id: winnerData.clientId,
                season: winnerData.season_id,
                game_week_id: winnerData.gameWeekId,
                weekly_or_yearly: selectedValue,
                prize: parseInt(prize)
            })

            setPrize(0)

            if (response?.data?.status === "SUCCESS") {
                toast.success("Successfuly added client to winners list!!");
            }   

        } catch (error) {
            toast.error(error.response.data.message)
            console.log(error)
        }
    }

    const columns = [
        {
            field: "client",
            headerName: "client",
            headerAlign: "left",
            align: "left",
            width: 160,
            valueGetter: (params) => {
                return params.row?.client_id?.full_name
            }
        },
        {
            field: "competition",
            headerName: "Competition Name",
            headerAlign: "left",
            align: "left",
            width: 160,
            valueGetter: (params) => {
                return params.row?.competition?.competition_name
            }
        },
        {
            field: "team_name",
            headerName: "Team Name",
            headerAlign: "left",
            align: "left",
            width: 160,
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
                            <Button style={{
                                color: "white", backgroundColor: "rgba(11, 163, 135, 0.65)"
                            }} variant="outlined" onClick={() => handleClickOpen(params.row?.client?.id)}>
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
            
            <div className='flex'>
            <Button style={{ backgroundColor:  "rgb(28 255 213 / 65%)" }} 
                variant="contained" className="whitetxt" onClick={()=> navigate("/leaderboard")}>
                Weekly
            </Button>

            <Button style={{ backgroundColor: "rgb(28 255 213 / 65%)" }} 
                variant="contained" className="whitetxt" onClick={()=> navigate("/leaderboard/monthly")}>
                Monthly
            </Button>

            <Button style={{ backgroundColor: "rgba(11, 163, 135, 0.65)"  }} 
                variant="contained" className="whitetxt" onClick={()=> navigate("/leaderboard/yearly")}>
                Yearly
            </Button>
            
            </div>
            {!(gameWeekTeams.length > 0) && <p className="form-loading">Loading...</p>}
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
                            onChange={(e) => setPrize(e.target.value)}
                            autoComplete='fa'
                            variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button style={{
                            color: "white", backgroundColor: "rgba(16, 109, 92, 0.65)"
                        }} onClick={handleClose}>Cancel</Button>
                        <Button style={{
                            color: "black", backgroundColor: "rgba(255, 234, 1, 0.935)"
                        }} onClick={createWinner}>Give Prize</Button>
                    </DialogActions>
                </Dialog>

                <DataGrid
                    rows={gameWeekTeams}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                />
            </Box>

        </div>
    );
}