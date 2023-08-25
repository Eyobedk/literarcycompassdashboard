import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AdView = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  //   const [userImage, setUserImage] = useState({});
  const [userData, setUserData] = useState({
    company_name: "",
    website_url: "",
    start_date: "",
    expire_date: "",
    price: "",
  });

  //   console.log(isLoading);

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/advertisement/${id}`);

      if (response?.data?.status === "SUCCESS") {
        // console.log(response.data.data.ad);
        setUserData({
          ...response.data.data.ad,
          start_date: response.data.data.ad.start_date.slice(0, 10),
          expire_date: response.data.data.ad.expire_date.slice(0, 10),
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

  return (
    <>
      <Box m="20px">
        <Header title="View" subtitle="Advertisement Image" />
        <div className="edit-image">
          {userData?.img?.cloudinary_secure_url && (
            <img
              className="edit-image-img"
              src={userData?.img?.cloudinary_secure_url}
            />
          )}
        </div>
      </Box>
      <Box m="20px">
        <Header subtitle="Advertisement content" />
        {isLoading && <p className="form-loading">Loading...</p>}
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
            id="outlined-read-only-input"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Website Url"
            name="website_url"
            sx={{ gridColumn: "span 4" }}
            value={userData?.website_url}
            id="outlined-read-only-input"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="date"
            label="Start Date"
            placeholder=""
            name="start_date"
            value={userData?.start_date}
            sx={{ gridColumn: "span 4" }}
            id="outlined-read-only-input"
            InputProps={{
              readOnly: true,
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
            id="outlined-read-only-input"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Price"
            name="price"
            value={userData?.price}
            sx={{ gridColumn: "span 4" }}
            id="outlined-read-only-input"
            InputProps={{
              readOnly: true,
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default AdView;
