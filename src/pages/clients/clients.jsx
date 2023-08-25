import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import Header from "../../components/Header";
import axios from "axios";
import ReactPaginate from "react-paginate";

import { Box, useTheme, IconButton } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useContext, useEffect, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import { useNavigate } from "react-router";

const Clients = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [client, setClient] = useState([]);
  const [totalClients, setTotalClients] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const handlePageChange = (newPage) => {
    fetchAllClients(newPage);
  };

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1; // Pages are zero-indexed, so add 1
    handlePageChange(selectedPage);
  };

  const fetchAllClients = async (page) => {
    setIsLoading(true);

    try {
      const response = await axios.get("/user");
      const response2 = await axios.get(`/client?limit=10&page=${page}`);

      setTotalClients(response.data.results);
      setClient(response2.data.data.user);
      // console.log(response2.data.data.clients);
      setCurrentPage(page);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllClients();
  }, []);

  const columns = [
    { field: "firstName", headerName: "First  Name" },
    { field: "lastName", headerName: "Last  Name" },
    {
      field: "birth_date",
      headerName: "Birth Date",
      flex: 1,
      renderCell: (params) => {
        return (
          <div className={`cellWithStatus ${params.row.birth_date}`}>
            {params.row.birth_date.slice(0, 10)}
          </div>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Created At",
      type: "number",
      renderCell: (params) => {
        return (
          <div className={`cellWithStatus ${params.row.createdAt}`}>
            {params.row.birth_date.slice(0, 10)}
          </div>
        );
      },
    },
    {
      field: "email",
      headerName: "email",
      flex: 1,
    },
    {
      field: "is_active",
      headerName: "status",
      renderCell: (params) => {
        return (
          <div
            className={
              params.row.is_active ? "green-status" : "red-status"
            }
          >
            {params.row.is_active ? "Active" : "Inactive"}
          </div>
        );
      },
    },
    {
      field: "view",
      headerName: "Agents",
      renderCell: (params) => {
        return (
          <button
            className="publish-button"
            onClick={() => {
              navigate(`view/${params.row.id}`);
            }}
          >
            Detail
          </button>
        );
      },
    },
  ];

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
      <div className="title-flex">
        <Header title="Users" />
        <p>{totalClients ? `Total Users : ${totalClients}` : ""}</p>
      </div>
      <div className="pagination-container">
        <div className="pagination-container">
          <ReactPaginate
            pageCount={Math.ceil(totalClients / 10)}
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
              currentPage === Math.ceil(totalClients / 10) ? "disabled-c" : ""
            }
          />
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
          rows={client}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Clients;
