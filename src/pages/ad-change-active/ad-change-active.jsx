import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const AdChangeActive = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [userData, setUserData] = useState({
    start_date: "",
    expire_date: "",
  });

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
      const response = await axios.patch(
        `/advertisement/updatecalendar/${id}`,
        {
          start_date: userData.start_date,
          expire_date: userData.expire_date,
        }
      );
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

  return (
    <>
      <Box m="20px">
        <Header title="Edit" subtitle="Advertisement Date" />
      </Box>
      <Box m="20px">
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
          />
        </Box>
        <Box display="flex" justifyContent="end" mt="20px">
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

export default AdChangeActive;
