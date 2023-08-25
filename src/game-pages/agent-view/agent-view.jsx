// import { Box, Button, TextField } from "@mui/material";
import { TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import Header from "../../components/Header";
import axios from "axios";

import useMediaQuery from "@mui/material/useMediaQuery";

import { Box, useTheme, IconButton } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useContext, useEffect, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import { useParams } from "react-router";
import MenuItem from "@mui/material/MenuItem";
import { toast } from "react-toastify";

const AgentView = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [client, setClient] = useState({
    first_name: "",
    last_name: "",
    account_status: "",
    birth_date: "",
    createdAt: "",
    phone_number: "",
    is_agent: "",
    has_team: "",
    agent_code: "",
    commission_balance: "",
    earned_commission: "",
    credit: "",
    accept: "",
  });

  const [teamJoinedByTheClient, setTeamJoinedByTheClient] = useState([]);
  const [selectedGameWeek, setSelectedGameWeek] = useState("");
  const [currentArray, setCurrentArray] = useState("");

  const [purchase, setPurchase] = useState([]);
  const [clientsTransaction, setClientsTransaction] = useState([]);
  const [award, setAward] = useState([]);
  const [referedClients, setReferedClients] = useState([]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const fetchAllClients = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(`/client/${id}`);

      setClient(response.data.data.client);
      //   console.log(response);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const fetchReferedClients = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `/client/referredbyagent?agentcode=${client.agent_code}`
      );

      if (response?.data?.status === "SUCCESS") {
        setReferedClients(response.data.data.clients);
        // console.log(response.data.data.clients);
      }

      setIsLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setIsLoading(false);
    }
  };

  const fetchAllTeamJoined = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(`/gameweekteam/clientgameWeeks/${id}`);

      setTeamJoinedByTheClient(response.data.data.clientGameWeekTeams);
      //   console.log(response.data.data.clientGameWeekTeams);
      setSelectedGameWeek(
        response.data.data.clientGameWeekTeams[0].game_week_id.game_week
      );
      setCurrentArray(0);
      //   setClient(response.data.data);
      setIsLoading(false);
    } catch (error) {
      //   console.log(error);
      setIsLoading(false);
    }
  };

  const fetchAllClientPurchase = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(`/purchase/client/${id}`);

      setPurchase(response.data.data.purchases);
      // console.log(response.data.data.purchases);

      setIsLoading(false);
    } catch (error) {
      //   console.log(error);
      setIsLoading(false);
    }
  };

  const fetchAllTransaction = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(`/transaction/clienttransactions/${id}`);

      setClientsTransaction(response.data.data.clientTransactions);
      // console.log(response.data.data.clientTransactions);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const fetchAllAward = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(`/winners/clientawards/${id}`);

      setAward(response.data.data.clientAwards);
      // console.log(response.data.data.clientAwards);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const transactionColumns = [
    {
      field: "transactionType",
      headerName: "type",
      width: 200,
    },
    {
      field: "createdAt",
      headerName: "Time",
      width: 200,
      renderCell: (params) => {
        return <div>{params.row.createdAt.slice(0, 10)}</div>;
      },
    },
    { field: "amount", headerName: "amount", width: 200 },
  ];

  const purchaseColumns = [
    { field: "team_name", headerName: "Team Name", width: 200 },
    {
      field: "gw",
      headerName: "game week",
      width: 200,
      renderCell: (params) => {
        return <div>{params.row.game_week}</div>;
      },
    },
    {
      field: "date",
      headerName: "Start Date",
      width: 200,
      renderCell: (params) => {
        return <div>{params.row.updatedAt.slice(0, 10)}</div>;
      },
    },
  ];

  const AwardColumns = [
    {
      field: "full_name",
      headerName: "full_name",
      width: 200,
      renderCell: (params) => {
        return <div>{params.row.client_id.full_name}</div>;
      },
    },
    { field: "prize", headerName: "prize", width: 200 },
    {
      field: "weekly_or_yearly",
      headerName: "Type",
    },
    {
      field: "season",
      headerName: "season",
    },
    {
      field: "withdrawn",
      headerName: "withdrawn",
      renderCell: (params) => {
        return (
          <div
            className={
              params.row.withdrawn === true ? "green-status" : "red-status"
            }
          >
            {params.row.withdrawn ? "True" : "False"}
          </div>
        );
      },
    },

    {
      field: "total_fantasy_point",
      headerName: "Fantasy Point",
    },
  ];

  const referedClientsColumn = [
    {
      field: "first_name",
      headerName: "full name",
      width: 200,
      renderCell: (params) => {
        return <div>{params.row.first_name + " " + params.row.last_name}</div>;
      },
    },
    { field: "phone_number", headerName: "phone number", width: 200 },
    {
      field: "credit",
      headerName: "credit",
    },
    {
      field: "is_agent",
      headerName: "Is Agent",
      renderCell: (params) => {
        return (
          <div
            className={
              params.row.is_agent === true ? "green-status" : "red-status"
            }
          >
            {params.row.is_agent ? "Yes" : "No"}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchAllClients();
  }, []);

  useEffect(() => {
    fetchAllTeamJoined();
  }, []);

  useEffect(() => {
    fetchAllTransaction();
  }, []);

  useEffect(() => {
    fetchAllAward();
  }, []);

  useEffect(() => {
    fetchAllClientPurchase();
  }, []);

  useEffect(() => {
    fetchReferedClients();
  }, []);

  useEffect(() => {
    if (teamJoinedByTheClient[0]) {
      teamJoinedByTheClient.map((team, i) => {
        if (team?.game_week_id?.game_week === selectedGameWeek) {
          setCurrentArray(i);
        }
      });
    }
  }, [selectedGameWeek]);

  return (
    <Box m="20px">
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

      <Header title="Clients Detail" />
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
        <Box
          display="grid"
          gap="30px"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          <TextField
            id="outlined-read-only-input"
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            variant="filled"
            type="text"
            label="First Name"
            value={client.first_name}
            name="first_name"
            sx={{ gridColumn: "span 1" }}
          />
          <TextField
            id="outlined-read-only-input"
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            variant="filled"
            type="text"
            label="Last Name"
            value={client.last_name}
            name="last_name"
            sx={{ gridColumn: "span 1" }}
          />
          <TextField
            id="outlined-read-only-input"
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            variant="filled"
            type="accepttext"
            label="Account Status"
            value={client.account_status === true ? "Active" : "InActive"}
            name="email"
            sx={{ gridColumn: "span 1" }}
          />
          <TextField
            id="outlined-read-only-input"
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            variant="filled"
            type="text"
            label="Birth Date"
            value={client?.birth_date?.slice(0, 10)}
            name="first_name"
            sx={{ gridColumn: "span 1" }}
          />
          <TextField
            id="outlined-read-only-input"
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            variant="filled"
            type="text"
            label="Created Date"
            value={client.createdAt?.slice(0, 10)}
            name="last_name"
            sx={{ gridColumn: "span 1" }}
          />
          <TextField
            id="outlined-read-only-input"
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            variant="filled"
            type="text"
            label="Phone Number"
            value={client.phone_number}
            name="email"
            sx={{ gridColumn: "span 1" }}
          />
          <TextField
            id="outlined-read-only-input"
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            variant="filled"
            type="text"
            label="Agent Status"
            value={
              client.is_agent ? `code : ${client.agent_code}` : "Not Agent"
            }
            name="email"
            sx={{ gridColumn: "span 1" }}
          />
          <TextField
            id="outlined-read-only-input"
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            variant="filled"
            type="text"
            label="Has Team"
            value={client.has_team ? "YES" : "NO"}
            name="email"
            sx={{ gridColumn: "span 1" }}
          />
          <TextField
            id="outlined-read-only-input"
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            variant="filled"
            type="text"
            label="Commission Balance"
            value={client.commission_balance}
            name="email"
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            id="outlined-read-only-input"
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            variant="filled"
            type="text"
            label="earned_commission"
            value={client.earned_commission}
            name="phone_number"
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            id="outlined-read-only-input"
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            variant="filled"
            type="text"
            label="credit"
            value={client.credit}
            name="phone_number"
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            id="outlined-read-only-input"
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            variant="filled"
            type="text"
            label="Terms Agreed"
            value={client.accept ? "YES" : "NO"}
            name="phone_number"
            sx={{ gridColumn: "span 2" }}
          />
        </Box>
        <Box m="40px 0 0 0">
          <Header subtitle="Clients Team" />
          {teamJoinedByTheClient[0] && (
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                id="outlined-read-only-input"
                value={selectedGameWeek}
                select
                name="Game Week"
                variant="filled"
                sx={{ gridColumn: "span 2" }}
                onChange={(e) => {
                  setSelectedGameWeek(e.target.value);
                }}
              >
                {teamJoinedByTheClient.map((option) => (
                  <MenuItem
                    key={option?.game_week_id?.game_week}
                    value={option?.game_week_id?.game_week}
                  >
                    {option?.game_week_id?.game_week}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                id="outlined-read-only-input"
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                variant="filled"
                type="text"
                label="Total Point"
                value={teamJoinedByTheClient[currentArray]?.total_fantasy_point}
                name="Point"
                sx={{ gridColumn: "span 2" }}
              />

              {teamJoinedByTheClient[currentArray] &&
                teamJoinedByTheClient[currentArray]?.players?.map((team) => (
                  <TextField
                    id="outlined-read-only-input"
                    InputProps={{
                      readOnly: true,
                    }}
                    key={team.id}
                    className={`${team.is_bench ? "bench" : "player"} ${
                      team.is_captain ? "captain" : ""
                    } ${team.is_vice_captain ? "vice_captain" : ""}`}
                    fullWidth
                    variant="filled"
                    type="text"
                    label={`${team.club} ${team.position} ${
                      team.is_captain ? "C" : ""
                    }
                  ${team.is_vice_captain ? "V" : ""}
                  `}
                    value={`${team.full_name} : ${team.final_fantasy_point}`}
                    name="first_name"
                    sx={{ gridColumn: "span 1" }}
                  />
                ))}
            </Box>
          )}
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
          <Header subtitle="Clients Purchase History" />
          <DataGrid
            rows={purchase}
            columns={purchaseColumns}
            components={{ Toolbar: GridToolbar }}
          />
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
          <Header subtitle="." />
          <Header subtitle="Clients Transaction History" />
          <DataGrid
            rows={clientsTransaction}
            columns={transactionColumns}
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
        <Box m="40px 0 0 0">
          <Box
            m="40px 0 0 0"
            height="400px"
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
            <Header title="." subtitle="" />
            <Header title="." subtitle="Awards Won" />
            <DataGrid
              rows={award}
              columns={AwardColumns}
              components={{ Toolbar: GridToolbar }}
              getRowId={(row) => row._id}
            />

            <Header
              title="."
              subtitle={`Refered Clients= total ${
                referedClients && referedClients.length
              }`}
            />
            <DataGrid
              rows={referedClients}
              columns={referedClientsColumn}
              components={{ Toolbar: GridToolbar }}
              getRowId={(row) => row._id}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AgentView;
