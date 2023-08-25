import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const AddSeason = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  //   console.log(isLoading);

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values, action) => {
    // console.log(values);

    try {
      setIsLoading(true);
      const response = await axios.post("/season", values);
      //   console.log(response);
      if (response?.data?.status === "SUCCESS") {
        action.resetForm();
        navigate("/season");
        toast.success(response?.data?.message);
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
      <Header title="CREATE" subtitle="Season" />

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
                placeholder="eg. 2024 or 24-25"
                variant="filled"
                type="text"
                label="Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helpertext={touched.name && errors.name}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isLoading}
              >
                Create New Season
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  //   name: yup.string().required("required"),
  name: yup
    .string()
    .matches(/^(20\d{2}|[0-9]{2}-[0-9]{2})$/, "Invalid input format")
    .required("required"),
});
const initialValues = {
  name: "",
};

export default AddSeason;
