import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
// import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as yup from "yup";
import cookiejs from "cookiejs";

const ChangePin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (values, actions) => {
    if (values.password !== values.password_confirm) {
      toast.error("new passwords don't match");
    } else {
      try {
        setIsLoading(true);
        const response = await axios.patch("/admins/password", values);

        if (response) {
          // clear the local storage
          cookiejs.remove("admin");

          // navigate user to login
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

  const isNonMobile = useMediaQuery("(min-width:600px)");

  return (
    <div>
      <Box m="20px">
        <Header title="Change Password" />
        <Box
          display="grid"
          gap="30px"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          {isLoading && <p className="form-loading">Loading...</p>}
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
                <div className="form-gap">
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="New Password"
                    name="current_password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.current_password}
                    error={
                      !!touched.current_password && !!errors.current_password
                    }
                    helpertext={
                      touched.current_password && errors.current_password
                    }
                    sx={{ gridColumn: "span 4" }}
                  />

                  <TextField
                    fullWidth
                    variant="filled"
                    type="password"
                    label="New Password"
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    error={!!touched.password && !!errors.password}
                    helpertext={touched.password && errors.password}
                    sx={{ gridColumn: "span 4" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="password"
                    label="Confirm Password"
                    name="password_confirm"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password_confirm}
                    error={
                      !!touched.password_confirm && !!errors.password_confirm
                    }
                    helpertext={
                      touched.password_confirm && errors.password_confirm
                    }
                    sx={{ gridColumn: "span 4" }}
                  />
                </div>
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  disabled={isLoading}
                >
                  Update
                </Button>
              </form>
            )}
          </Formik>
        </Box>
      </Box>
    </div>
  );
};

const checkoutSchema = yup.object().shape({
  current_password: yup.string().required("required"),
  password: yup
    .string()
    .required("required")
    .min(8, "Password confirmation must be at least 8 characters long"),
  password_confirm: yup
    .string()
    .required("required")
    .min(8, "Password confirmation must be at least 8 characters long"),
});
const initialValues = {
  current_password: "",
  password: "",
  password_confirm: "",
};

export default ChangePin;
