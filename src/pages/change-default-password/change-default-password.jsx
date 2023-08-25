import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { toast } from "react-toastify";
import { useState } from "react";
// import Spinner from "../../ui/Spinner";

const ChangeDefaultPassword = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (values, actions) => {
    if (values.password !== values.password_confirm) {
      toast.error("new passwords don't match");
    } else {
      try {
        setIsLoading(true);
        const response = await axios.patch("/admins/defaultpassword", values);
        if (response) {
          navigate("/login");
          toast.success(response?.data?.message);
        }
        actions.resetForm();
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
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="img-container literarcycompass-text">Change Default Password</div>
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
                  type="default_password"
                  label="default_password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.default_password}
                  name="default_password"
                  sx={{ gridColumn: "span 4" }}
                  error={
                    !!touched.default_password && !!errors.default_password
                  }
                  helpertext={
                    touched.default_password && errors.default_password
                  }
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="password"
                  label="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  sx={{ gridColumn: "span 4" }}
                  error={!!touched.password && !!errors.password}
                  helpertext={touched.password && errors.password}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="password"
                  label="confirm password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password_confirm}
                  name="password_confirm"
                  sx={{ gridColumn: "span 4" }}
                  error={
                    !!touched.password_confirm && !!errors.password_confirm
                  }
                  helpertext={
                    touched.password_confirm && errors.password_confirm
                  }
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
  default_password: yup.string().required("required"),
  password: yup
    .string()
    .required("required")
    .min(8, "Password must be at least 8 characters long"),
  password_confirm: yup
    .string()
    .required("required")
    .min(8, "Password confirmation must be at least 8 characters long"),
});
const initialValues = {
  default_password: "",
  password: "",
  password_confirm: "",
};

export default ChangeDefaultPassword;
