import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const AddAbout = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);


  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values, action) => {

    try {
      setIsLoading(true);
      const response = await axios.post("/aboutus", {
        content: values.content,
        version_title: values.version_title,
        version_content: values.version_content
      });

      //   console.log(response);
      if (response?.data?.status === "SUCCESS") {
        action.resetForm();
        navigate("/about");
        toast.success(response?.data?.message);
      }
      if (
        response?.data?.status === "ERROR" ||
        response?.data?.status === "FAIL"
      ) {
        toast.error(response?.data?.message);
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
      <Header title="CREATE" subtitle="About Us" />
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
                label="Version Title"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.version_title}
                name="version_title"
                error={!!touched.version_title && !!errors.version_title}
                helpertext={touched.version_title && errors.version_title}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Content"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.content}
                name="content"
                error={!!touched.content && !!errors.content}
                helpertext={touched.content && errors.content}
                sx={{ gridColumn: "span 4" }}
                multiline
                rows={4}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Version Content"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.version_content}
                name="version_content"
                error={!!touched.version_content && !!errors.version_content}
                helpertext={touched.version_content && errors.version_content}
                sx={{ gridColumn: "span 4" }}
                multiline
                rows={4}
              />
            </Box>
           
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isLoading}
              >
                Create New About
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  version_title: yup.string().required("required"),
  content: yup.string().required("required"),
  version_content: yup.string().required("required"),
});
const initialValues = {
  version_title: "",
  content: "",
  version_content: "",
};

export default AddAbout;
