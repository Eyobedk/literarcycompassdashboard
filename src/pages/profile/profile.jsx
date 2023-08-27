import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
// import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import cookiejs from "cookiejs";

const Profile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const tokenString = cookiejs.get("admin");

  const storedAdminData = localStorage.getItem("admin");

  const admin = JSON.parse(storedAdminData);

  const [names, setNames] = useState({
    firstName: "",
    lastName: "",
  });

  const [account, setAccount] = useState({
    email: "",
    email: "",
  });

  //   console.log(names, account);

  useEffect(() => {
    if (tokenString) {
      setNames({ firstName: admin.firstName, lastName: admin.lastName });
      setAccount({ email: admin.email, email: admin.email });
    }
  }, [
    tokenString,
    admin.email,
    admin.firstName,
    admin.lastName,
    admin.email,
  ]);

  const submitProfile = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch("/admin/profile", names);

      if (response?.data?.status === "SUCCESS") {
        toast.success(response?.data?.message);
      }

      const adminObj = {
        ...admin,
        firstName: names.firstName,
        lastName: names.lastName,
      };

      localStorage.setItem("admin", JSON.stringify(adminObj));
      setIsLoading(false);
    } catch (error) {
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error.response?.data?.message);
      }
      setIsLoading(false);
    }
  };

  const submitPhoneAndEmail = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch("/admins/emailorphonenumber", account);

      if (response?.data?.status === "SUCCESS") {
        navigate("/login");
        toast.success(response?.data?.message);
      }
      setIsLoading(false);
    } catch (error) {
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <Box m="20px">
      <Header title="Profile" />

      {isLoading && <p className="form-loading">Loading...</p>}
      <div className="profile-flex">
        <div>
          <Header subtitle="Account Detail's" />
          <Box
            display="grid"
            gap="30px"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <TextField
              InputProps={{
                readOnly: true,
              }}
              id="outlined-read-only-input"
              className="profile-textfield"
              fullWidth
              variant="filled"
              type="text"
              label="First Name"
              name="firstName"
              value={admin.firstName}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              className="profile-textfield"
              variant="filled"
              type="text"
              id="outlined-read-only-input"
              label="Last Name"
              name="lastName"
              value={admin.lastName}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              className="profile-textfield"
              variant="filled"
              type="text"
              id="outlined-read-only-input"
              label="Email"
              value={admin.email}
              name="email"
              sx={{ gridColumn: "span 4" }}
            />
            
          </Box>
        </div>
       
      </div>
    </Box>
  );
};

export default Profile;
