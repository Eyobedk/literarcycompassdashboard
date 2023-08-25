import { Box, Button, useTheme, TextField } from "@mui/material";
import { tokens } from "../../theme";

import * as React from "react";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import "./login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { toast } from "react-toastify";
import { useState } from "react";
import cookiejs from "cookiejs";

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event
  ) => {
    event.preventDefault();
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  // console.log(isLoading);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post("/admin/login", {
        email,
        password
      });

      // console.log(response?.data?.data?.admin?.is_default_password);
      if (response?.data?.status === "SUCCESS") {
        const adminObj = {
          email: response?.data?.data?.admin?.email,
          first_name: response?.data?.data?.admin?.firstName,
          last_name: response?.data?.data?.admin?.lastName,
          role: response?.data?.data?.admin?.role,
        };

        cookiejs.set("admin", response?.data?.token);
        localStorage.setItem("admin", JSON.stringify(adminObj));

        
          navigate("/dashboard");
        
        
        toast.success(response?.data?.message);
      }

      setIsLoading(false);
    } catch (error) {
      if (error.response?.data?.status === "FAIL" || error.response?.data?.status === "ERROR") {
        toast.error(error.response?.data?.message);
      }
      setIsLoading(false);
    }
  };

  // console.log('a')

  return (
    <>
      <Box
        m="20px"
        backgroundColor={colors.primary[400]}
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
        }}
      >
        <div className="login-wrapper">
          <div className="login-container">
            <div className="img-container literarcycompass-text">Literarcy Compass</div>
            
                  <Box
                    display="grid"
                    gap="30px"
                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                    sx={{
                      "& > div": {
                        gridColumn: isNonMobile ? undefined : "span 4",
                      },
                    }}
                  >
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Email"
                      onChange={(e)=> setEmail(e.target.value)}
                      value={email}
                      name="email"
                      sx={{ gridColumn: "span 4" }}
                    />
                    <FormControl sx={{ gridColumn: "span 4" }} variant="filled">
                      <InputLabel htmlFor="filled-adornment-password">
                        Password
                      </InputLabel>
                      <OutlinedInput
                        variant="filled"
                        id="filled-adornment-password"
                        fullWidth
                        label="Password"
                        onChange={(e)=> setPassword(e.target.value)}
                        value={password}
                        name="password"
                        sx={{ gridColumn: "span 4" }}
                        type={showPassword ? "text" : "password"}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </Box>
                  <div>
                    <Button
                      className="login-button"
                      type="submit"
                      color="primary"
                      variant="contained"
                      onClick={(e)=> handleFormSubmit(e)}
                      disabled={isLoading}
                    >
                      {isLoading ? "Verifying..." : "Login"}
                    </Button>
                  </div>
          </div>
        </div>
      </Box>
    </>
  );
};

const checkoutSchema = yup.object().shape({
  eamil: yup.string().required("required").email(),
  password: yup.string().required("required"),
});
const initialValues = {
  email: "",
  password: "",
};

export default Login;
