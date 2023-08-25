import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import MenuItem from "@mui/material/MenuItem";

const AppVersionAdd = () => {
  const navigate = useNavigate();

  const os = [
    {
      value: "Android",
      label: "Android",
    },
    {
      value: "iOS",
      label: "iOS",
    },
  ];

  const severe = [
    {
      value: true,
      label: "High",
    },
    {
      value: false,
      label: "Low",
    },
  ];

  const [isLoading, setIsLoading] = useState(false);
  //   console.log(isLoading);

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values, action) => {
    // console.log(values);

    try {
      setIsLoading(true);
      const response = await axios.post("/appversion", values);
      //   console.log(values);
      if (response?.data?.status === "SUCCESS") {
        action.resetForm();
        toast.success(response?.data?.message);
        navigate("/appversion");
      }
      setIsLoading(false);
    } catch (error) {
      //   console.log(error);

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
      <Header title="CREATE" subtitle="App Version" />

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
                label="latest_version"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.latest_version}
                name="latest_version"
                error={!!touched.latest_version && !!errors.latest_version}
                helpertext={touched.latest_version && errors.latest_version}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                id="filled-select-currency"
                select
                name="os"
                label="Select operating system"
                value={values.os}
                onChange={handleChange}
                onBlur={handleBlur}
                defaultValue="Android"
                variant="filled"
                sx={{ gridColumn: "span 4" }}
              >
                {os.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="url"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.url}
                name="url"
                error={!!touched.url && !!errors.url}
                helpertext={touched.url && errors.url}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                id="filled-select-currency"
                select
                name="highly_severe"
                label="Select operating system"
                value={values.highly_severe}
                onChange={handleChange}
                onBlur={handleBlur}
                defaultValue={false}
                variant="filled"
                sx={{ gridColumn: "span 4" }}
              >
                {severe.map((option) => (
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
                Create New App Version
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  latest_version: yup.string().required("required"),
  url: yup.string().required("required"),
  os: yup.string().required("required"),
});
const initialValues = {
  latest_version: "",
  url: "",
  os: "Android",
};

export default AppVersionAdd;
