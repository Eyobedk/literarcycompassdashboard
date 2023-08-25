import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const AddTerms = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  //   console.log(isLoading);

  const [isDraftMode, setIsDraftMode] = useState(true);

  const handleToggle = () => {
    setIsDraftMode(!isDraftMode);
  };

  const [isMessage, setIsMessage] = useState(false);

  const handleMessageToggle = () => {
    setIsMessage(!isMessage);
  };

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values, action) => {
    // console.log({ ...values, published: !isDraftMode, is_message: isMessage });

    try {
      setIsLoading(true);
      const response = await axios.post("/terms", {
        ...values,
        is_published: !isDraftMode,
        is_message: isMessage,
      });
      //   console.log(response);
      if (response?.data?.status === "SUCCESS") {
        action.resetForm();
        navigate("/terms");
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
      <Header title="CREATE" subtitle="Terms And Condition" />
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
                label="Title"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.title}
                name="title"
                error={!!touched.title && !!errors.title}
                helpertext={touched.title && errors.title}
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
            </Box>
            <div>
              <label htmlFor="toggle"></label>
              <input
                id="toggle"
                type="checkbox"
                checked={isDraftMode}
                onChange={handleToggle}
              />
              Draft Mode
            </div>
            <div>
              <label htmlFor="toggle"></label>
              <input
                id="toggle"
                type="checkbox"
                checked={isMessage}
                onChange={handleMessageToggle}
              />
              is message
            </div>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isLoading}
              >
                Create New Terms And Conditions
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  title: yup.string().required("required"),
  content: yup.string().required("required"),
});
const initialValues = {
  title: "",
  content: "",
};

export default AddTerms;
