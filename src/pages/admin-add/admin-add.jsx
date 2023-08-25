import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const AdminAdd = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  //   console.log(isLoading);

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values, action) => {
    // console.log(values);

    try {
      setIsLoading(true);
      const response = await axios.post("/admin/createadmin", values);
      //   console.log(response);
      if (response?.data?.status === "SUCCESS") {
        action.resetForm();
        navigate("/admin");
        toast.success(
          <div>
            <p>${response?.data?.message}</p>
            <p>{`default password :
${values.password}`}</p>
            <button
              className="copy-admin"
              onClick={() => {
                navigator.clipboard.writeText(values.password);
              }}
            >
              Copy
            </button>
          </div>
        );
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
      <Header title="CREATE" subtitle="New Admin Profile" />

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
                name="firstName"
                error={!!touched.firstName && !!errors.firstName}
                helpertext={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={!!touched.lastName && !!errors.lastName}
                helpertext={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
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
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helpertext={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                fullWidth
                id="filled-select-currency"
                select
                name="role"
                label="Select"
                value={values.role}
                onChange={handleChange}
                onBlur={handleBlur}
                defaultValue="Admin"
                variant="filled"
                sx={{ gridColumn: "span 4" }}
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
                disabled={isLoading}
              >
                Create New Admin
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required")
});

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "Admin",
};

export default AdminAdd;
