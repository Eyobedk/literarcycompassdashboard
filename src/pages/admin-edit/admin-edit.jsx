import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import MenuItem from "@mui/material/MenuItem";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AdminEdit = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [adminRole, setAdminRole] = useState("");
  const [adminNewRole, setAdminNewRole] = useState("");

  const [adminId, setAdminId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // console.log(adminRole, adminId, firstName);

  useEffect(() => {
    setFirstName(location.state && location.state.firstName);
    setLastName(location.state && location.state.lastName);
    setAdminRole(location.state && location.state.role);
    setAdminId(location.state && location.state.id);
  }, [location.state]);

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const handleFormSubmit = async () => {
    if (adminNewRole === adminRole) {
      toast.error("You cant put the same role for the admin");
    } else {
      try {
        setIsLoading(true);
        
        const response = await axios.patch(`/admin/role`, {
          id: adminId,
          role: adminNewRole,
        });

        if (response?.data?.status === "SUCCESS") {
          navigate("/admin");
          toast.success(response?.data?.message);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error)
        if (
          error.response?.data?.status === "FAIL" ||
          error.response?.data?.status === "ERROR"
        ) {
          toast.error(error?.response?.data?.message);
        }
        setIsLoading(false);
      }
    }
  };

  const roles = [
    {
      value: "Admin",
      label: "Admin",
    },
    {
      value: "Super-admin",
      label: "Super Admin",
    },
  ];

  return (
    <Box m="20px">
      <Header title="CREATE ADMIN" subtitle="Create a New Admin Profile" />

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
          fullWidth
          variant="filled"
          type="text"
          id="outlined-read-only-input"
          label="first name"
          name="firstName"
          sx={{ gridColumn: "span 4" }}
          value={firstName}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          fullWidth
          variant="filled"
          type="text"
          id="outlined-read-only-input"
          label="LAST NAME"
          name="lastName"
          sx={{ gridColumn: "span 4" }}
          value={lastName}
          InputProps={{
            readOnly: true,
          }}
        />

        <TextField
          fullWidth
          id="filled-select-currency"
          select
          name="role"
          label="Select"
          defaultValue="Admin"
          variant="filled"
          sx={{ gridColumn: "span 4" }}
          value={adminNewRole}
          onChange={(e) => {
            setAdminNewRole(e.target.value);
          }}
        >
          {roles.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box display="flex" justifyContent="end" mt="20px">
        <Button
          type="submit"
          color="secondary"
          variant="contained"
          onClick={handleFormSubmit}
          disabled={isLoading}
        >
          Change Role
        </Button>
      </Box>
    </Box>
  );
};

export default AdminEdit;
