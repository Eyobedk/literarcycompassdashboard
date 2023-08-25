import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { toast } from "react-toastify";
import { useState } from "react";
// import Spinner from "../../ui/Spinner";

const FirstAccount = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  // console.log(isLoading);

  const handleFormSubmit = async (values, actions) => {
    try {
      setIsLoading(true);

      if(values.password !== values.confirmPassword){
        return toast.error("password and confirm password must be the same")
      }

      const response = await axios.post("/admin", {
        ...values
      });

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
        toast.error(error.response?.data?.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="img-container literarcycompass-text">literarcycompass</div>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={checkoutSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
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
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  required={true}
                  name="first_name"
                  error={!!touched.firstName && !!errors.firstName}
                  helpertext={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 4" }}
                />

                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Last Name"
                  onBlur={handleBlur}
                  required={true}
                  onChange={handleChange}
                  value={values.last_name}
                  name="last_name"
                  error={!!touched.lastName && !!errors.lastName}
                  helpertext={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 4" }}
                />

                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required={true}
                  value={values.email}
                  name="email"
                  error={!!touched.email && !!errors.email}
                  helpertext={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />

                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  required={true}
                  name="phone_number"
                  error={!!touched.password && !!errors.password}
                  helpertext={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />
                
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="confirm password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required={true}
                  value={values.confirmPassword}
                  name="confirmpassword"
                  error={!!touched.confirmPassword && !!errors.confirmPassword}
                  helpertext={touched.confirmPassword && errors.confirmPassword}
                  sx={{ gridColumn: "span 4" }}
                />
              </Box>
              <div>
                <Button
                  className="login-button"
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Login"}
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().required("required").email(),
  password: yup.string().required("required"),
  confirmPassword: yup.string().required("required")
});

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: ""
};

export default FirstAccount;
