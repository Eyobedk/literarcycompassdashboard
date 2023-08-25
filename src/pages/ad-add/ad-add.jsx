import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const AdAdd = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [userImage, setUserImage] = useState({
    cloudinary_secure_url: "",
    cloudinary_public_id: "",
  });

  // console.log(userImage);

  const { presetName, cloudName } = useContext(AppContext);

  const [imageSuccess, setImageSuccess] = useState("");

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values, action) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "/advertisement",
        {
          ...values,
          img: {
            ...userImage,
          },
        }

        // is_published: !isActive,
      );
      if (response?.data?.status === "SUCCESS") {
        action.resetForm();
        navigate("/ad");
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

  function handleImageChange(e) {
    const file = e.target.files[0];
    setImageSuccess("");

    // Check that the file size is less than or equal to 400 KB
    if (file && file.size <= 400 * 1024) {
      const reader = new FileReader();

      reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;

        const handleUpload = async () => {
          // console.log(presetName, cloudName);
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", presetName); // Replace with your upload preset

          fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => {
              // console.log("data", data);
              toast.success("Uploaded image");
              setImageSuccess("yes");
              setUserImage({
                cloudinary_secure_url: data.secure_url,
                cloudinary_public_id: data.public_id,
              });
            })
            .catch(() => {
              // console.error("Upload error:", error);
              toast.error("Error occurred while uploading");
              setImageSuccess("");
              // throw error;
            });
        };
        handleUpload();
      };

      reader.readAsDataURL(file);
    } else {
      // Display an error message or take other action as appropriate for exceeding file size limit
      //   setImageError("File exceeds allowed size limit of 400 KB.");
      toast.error("File exceeds allowed size limit of 400 KB.");
      setImageSuccess("");
      // console.log("File exceeds allowed size limit of 400 KB.");
    }
  }

  return (
    <Box m="20px">
      <Header title="CREATE" subtitle="Advertisement" />
      {isLoading && <p className="form-loading">Loading...</p>}
      <div className="edit-image mg-30 ">
        {userImage?.cloudinary_secure_url && (
          <img
            className="edit-image-img"
            src={userImage?.cloudinary_secure_url}
          />
        )}
      </div>
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
                label="Company Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.company_name}
                name="company_name"
                error={!!touched.company_name && !!errors.company_name}
                helpertext={touched.company_name && errors.company_name}
                sx={{ gridColumn: "span 2" }}
              />
              <div>
                <input
                  required
                  type="file"
                  accept=".jpg,.png,.jpeg"
                  onChange={handleImageChange}
                  className="upload-img"
                />
              </div>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Website Url"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.website_url}
                name="website_url"
                error={!!touched.website_url && !!errors.website_url}
                helpertext={touched.website_url && errors.website_url}
                sx={{ gridColumn: "span 4" }}
                multiline
                rows={4}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Start Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.start_date}
                placeholder=""
                name="start_date"
                error={!!touched.start_date && !!errors.start_date}
                helpertext={touched.start_date && errors.start_date}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Expire Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.expire_date}
                name="expire_date"
                error={!!touched.expire_date && !!errors.expire_date}
                helpertext={touched.expire_date && errors.expire_date}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Price"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.price}
                name="price"
                error={!!touched.price && !!errors.price}
                helpertext={touched.price && errors.price}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isLoading || !imageSuccess}
              >
                Create New Advertisement
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  company_name: yup.string().required("required"),
  website_url: yup.string().required("required"),
  start_date: yup.string().required("required"),
  expire_date: yup.string().required("required"),
  price: yup.string().required("required"),
});
const initialValues = {
  company_name: "",
  website_url: "",
  start_date: "",
  expire_date: "",
  price: "",
};

export default AdAdd;
