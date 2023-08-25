import { Box, Button, TextField } from "@mui/material";

import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import MenuItem from "@mui/material/MenuItem";

const AppVersionEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    latest_version: "",
    os: "",
    url: "",
    highly_severe: "",
  });

  const getCurrentAppVersion = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/appversion/${id}`);
      setValues(response.data.data.appVersion);
      console.log(response.data.data.appVersion);

      setIsLoading(false);
    } catch (error) {
      // console.log(error);
      setIsLoading(false);
    }
  };
  //a

  useEffect(() => {
    getCurrentAppVersion();
  }, []);

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

  const handleFormSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`/appversion/${id}`, {
        latest_version: values.latest_version,
        os: values.os,
        url: values.url,
        // highly_severe: values.highly_severe,
      });
      if (response?.data?.status === "SUCCESS") {
        // console.log(response);

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
          name="latest_version"
          value={values.latest_version}
          sx={{ gridColumn: "span 4" }}
          onChange={(e) => {
            setValues({ ...values, latest_version: e.target.value });
          }}
        />
        <TextField
          fullWidth
          id="filled-select-currency"
          select
          name="os"
          label="Select operating system"
          value={values.os}
          variant="filled"
          sx={{ gridColumn: "span 4" }}
          onChange={(e) => {
            setValues({ ...values, os: e.target.value });
          }}
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
          name="url"
          value={values.url}
          onChange={(e) => {
            setValues({ ...values, url: e.target.value });
          }}
          sx={{ gridColumn: "span 4" }}
        />
        {/* <TextField
          fullWidth
          id="filled-select-currency"
          select
          name="highly_severe"
          label="Select operating system"
          variant="filled"
          value={values.highly_severe}
          sx={{ gridColumn: "span 4" }}
          onChange={(e) => {
            setValues({ ...values, highly_severe: e.target.value });
          }}
        >
          {severe.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField> */}
      </Box>
      <Box display="flex" justifyContent="end" mt="20px">
        <Button
          type="submit"
          color="secondary"
          variant="contained"
          disabled={isLoading}
          onClick={() => {
            handleFormSubmit();
          }}
        >
          Update App Version
        </Button>
      </Box>
    </Box>
  );
};

export default AppVersionEdit;
