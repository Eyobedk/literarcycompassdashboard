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
    first_name: "",
    last_name: "",
  });

  const [account, setAccount] = useState({
    email: "",
    phone_number: "",
  });

  //   console.log(names, account);

  useEffect(() => {
    if (tokenString) {
      setNames({ first_name: admin.first_name, last_name: admin.last_name });
      setAccount({ email: admin.email, phone_number: admin.phone_number });
    }
  }, [
    tokenString,
    admin.email,
    admin.first_name,
    admin.last_name,
    admin.phone_number,
  ]);

  const submitProfile = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch("/admins/profile", names);

      if (response?.data?.status === "SUCCESS") {
        toast.success(response?.data?.message);
      }

      const adminObj = {
        ...admin,
        first_name: names.first_name,
        last_name: names.last_name,
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
              name="first_name"
              value={admin.first_name}
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
              name="last_name"
              value={admin.last_name}
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
            <TextField
              id="outlined-read-only-input"
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              className="profile-textfield"
              variant="filled"
              type="text"
              label="Phone Number"
              name="phone_number"
              value={admin.phone_number}
              sx={{ gridColumn: "span 4" }}
            />
            <Button
              type="submit"
              color="secondary"
              variant="contained"
              onClick={() => {
                navigate("change_pin");
              }}
            >
              Change Pin
            </Button>
          </Box>
        </div>
        <div className="profile-div">
          <div>
            <Header subtitle="Change Name" />
            <Box
              display="grid"
              gap="30px"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                className="profile-textfield"
                fullWidth
                variant="filled"
                type="text"
                label="First Name"
                name="first_name"
                value={names.first_name}
                onChange={(e) => {
                  setNames({ ...names, first_name: e.target.value });
                }}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                className="profile-textfield"
                variant="filled"
                type="text"
                label="Last Name"
                name="last_name"
                value={names.last_name}
                onChange={(e) => {
                  setNames({ ...names, last_name: e.target.value });
                }}
                sx={{ gridColumn: "span 4" }}
              />
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                onClick={submitProfile}
              >
                Update
              </Button>
            </Box>
          </div>
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
                className="profile-textfield"
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                name="email"
                value={account.email}
                onChange={(e) => {
                  setAccount({ ...account, email: e.target.value });
                }}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                className="profile-textfield"
                variant="filled"
                type="text"
                label="Phone Number"
                name="phone_number"
                value={account.phone_number}
                onChange={(e) => {
                  setAccount({ ...account, phone_number: e.target.value });
                }}
                sx={{ gridColumn: "span 4" }}
              />
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                onClick={submitPhoneAndEmail}
              >
                Update
              </Button>
            </Box>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default Profile;
