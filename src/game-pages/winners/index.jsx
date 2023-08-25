import * as React from 'react';
import { ColorModeContext, tokens } from "../../theme";
import { useTheme, IconButton } from "@mui/material";

import Box from '@mui/material/Box';
import { Button } from '@mui/material';

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


export default function Winners(props) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = React.useContext(ColorModeContext);

    const [isLoading, setIsLoading] = React.useState(false);
    const [WinnersList, setGameWeekTeams] = React.useState([]);

    const navigate = useNavigate();

    const [deleteId, setDeleteId] = React.useState("");
    const [openDelete, setOpenDelete] = React.useState(false);


    const handleClickOpenDelete = (id) => {
        setOpenDelete(true);
        setDeleteId(id);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };
         
    const deleteOneWinner = async () => {
        setIsLoading(true);
        try {
            const response = await axios.delete(`/winners/${deleteId}`);

            if (response?.data?.status === "SUCCESS") {
                toast.success(response?.data?.message);
            }
            
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const fetchAllGameWeekTeams = async () => {
        setIsLoading(true);

        try {
            const response = await axios.get("/winners");

            if (response?.data?.status === "SUCCESS") {
                setIsLoading(false);
                console.log(response.data)
                setGameWeekTeams(response.data.data.winners);
            }

        } catch (error) {
            setIsLoading(false);
        }
    };


    React.useEffect(() => {
        fetchAllGameWeekTeams();
    }, [])


    const columns = [
        {
            field: "client_id",
            headerName: "client",
            headerAlign: "left",
            align: "left",
            width: 160,
            valueGetter: (params) => {
                return params.row?.client_id?.full_name
            }
        },
        {
            field: "season",
            headerName: "Season",
            headerAlign: "left",
            align: "left",
            width: 160
        },
        {
            field: "weekly_monthly_yearly",
            headerName: "Weekly / Monthly / Yearly",
            headerAlign: "left",
            align: "left",
            width: 160,
        },
        {
            field: "total_fantasy_point",
            headerName: "Total Fantasy Point",
            width: 150,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "prize",
            headerName: "Awarded Prize",
            width: 150,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "undo prize",
            headerName: "Undo Prize",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="flexxxxer">
                        {
                            <Button style={{
                                color: "white", backgroundColor: "rgba(11, 163, 135, 0.65)"
                            }} variant="outlined" onClick={() => handleClickOpenDelete(params.row?._id)}>
                                Undo Prize
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
            <Button style={{ backgroundColor: "rgb(28 255 213 / 65%)" }} 
                variant="contained" className="whitetxt" onClick={()=> navigate("/leaderboard")}>
                All
            </Button>
            <Button style={{ backgroundColor: "rgba(11, 163, 135, 0.65)" }} 
                variant="contained" className="whitetxt" onClick={()=> navigate("/winners/weekly")}>
                Weekly
            </Button>

            <Button style={{ backgroundColor: "rgba(11, 163, 135, 0.65)" }} 
                variant="contained" className="whitetxt" onClick={()=> navigate("/winners/yearly")}>
                Yearly
            </Button>
            
            </div>

            {isLoading&& <p className="form-loading">Loading...</p>}

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
                          <Dialog
            open={openDelete}
            onClose={handleCloseDelete}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Notice"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to undo the awared prize
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
                  deleteOneWinner(deleteId);
                }}
                autoFocus
              >
                Yes
              </Button>
            </DialogActions>
          </Dialog>


                <DataGrid
                    getRowId={(row)=> row._id}
                    rows={WinnersList}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                />
            </Box>

        </div>
    );
}