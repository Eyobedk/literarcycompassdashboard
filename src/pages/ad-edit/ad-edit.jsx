import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const AdEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [userImage, setUserImage] = useState({});
  const [userData, setUserData] = useState({
    company_name: "",
    website_url: "",
    start_date: "",
    expire_date: "",
    price: "",
  });

  const { presetName, cloudName } = useContext(AppContext);
  //   console.log(isLoading);
  const [imageSuccess, setImageSuccess] = useState("");

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/advertisement/${id}`);

      if (response?.data?.status === "SUCCESS") {
        // console.log(response.data.data);
        setUserData({
          ...response.data.data.ad,
          start_date: response.data.data.ad.start_date.slice(0, 10),
          expire_date: response.data.data.ad.expire_date.slice(0, 10),
        });
        setUserImage({
          cloudinary_secure_url:
            response.data.data.ad.img.cloudinary_secure_url,
          cloudinary_public_id: response.data.data.ad.img.cloudinary_public_id,
        });
        // toast.success(response?.data?.message);
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleFormSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`/advertisement/${id}`, {
        company_name: userData.company_name,
        website_url: userData.website_url,
        // start_date: userData.start_date,
        // expire_date: userData.expire_date,
        price: userData.price,
      });
      //   console.log(response);
      if (response?.data?.status === "SUCCESS") {
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

  const updateImage = async () => {
    const values = {
      img: {
        cloudinary_secure_url: userImage.cloudinary_secure_url,
        cloudinary_public_id: userImage.cloudinary_public_id,
      },
    };

    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/advertisement/updateimage/${id}`,
        values
      );

      if (response?.data?.status === "SUCCESS") {
        toast.success("Successfully Edited Privacy and Policy Image");
      }
    } catch (error) {
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        console.log(error.data.data);
        toast.error("Error Occurred While Uploading");
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
            .catch((error) => {
              // console.error("Upload error:", error);
              toast.error("Error occurred while uploading");
              setImageSuccess("");
              throw error;
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
    <>
      <Box m="20px">
        <Header title="Edit" subtitle="Advertisement Image" />
        <div className="edit-image">
          {isLoading && <p className="form-loading">Loading...</p>}
          {userImage && (
            <div className="edit-image mg-30 ">
              <img
                className="edit-image-img"
                src={userImage?.cloudinary_secure_url}
              />
            </div>
          )}
        </div>

        {/* {imageError && <p className="error-image-text">{imageError}</p>}
      {imageSuccess && <p className="success-image-text">{imageSuccess}</p>} */}
        <div>
          <input
            type="file"
            accept=".jpg,.png,.jpeg"
            onChange={handleImageChange}
            className="upload-img"
          />
          {/* <button onClick={updateImage} className="update-image-admin">
            Update Image
          </button> */}

          <Box display="flex" justifyContent="start" mt="20px">
            <Button
              type="submit"
              color="secondary"
              variant="contained"
              disabled={isLoading || !imageSuccess}
              onClick={updateImage}
            >
              Update Image
            </Button>
          </Box>
        </div>
      </Box>
      <Box m="20px">
        <Header subtitle="Advertisement content" />

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
            name="company_name"
            value={userData?.company_name}
            sx={{ gridColumn: "span 4" }}
            onChange={(e) => {
              setUserData({ ...userData, [e.target.name]: e.target.value });
            }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Website Url"
            name="website_url"
            sx={{ gridColumn: "span 4" }}
            multiline
            value={userData?.website_url}
            rows={4}
            onChange={(e) => {
              setUserData({ ...userData, [e.target.name]: e.target.value });
            }}
          />
          {/* <TextField
            fullWidth
            variant="filled"
            type="date"
            label="Start Date"
            placeholder=""
            name="start_date"
            value={userData?.start_date}
            sx={{ gridColumn: "span 4" }}
            onChange={(e) => {
              setUserData({ ...userData, [e.target.name]: e.target.value });
            }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="date"
            label="Expire Date"
            name="expire_date"
            value={userData?.expire_date}
            sx={{ gridColumn: "span 4" }}
            onChange={(e) => {
              setUserData({ ...userData, [e.target.name]: e.target.value });
            }}
          /> */}
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Price"
            name="price"
            value={userData?.price}
            sx={{ gridColumn: "span 4" }}
            onChange={(e) => {
              setUserData({ ...userData, [e.target.name]: e.target.value });
            }}
          />
        </Box>
        <Box display="flex" justifyContent="start" mt="20px">
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            disabled={isLoading}
            onClick={handleFormSubmit}
          >
            UPDATE
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default AdEdit;
