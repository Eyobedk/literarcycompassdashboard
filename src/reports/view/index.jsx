import { Box, Button, MenuItem, TextField, useStepContext } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useContext } from "react";
import Avatar from "@mui/material/Avatar";
import DeleteIcon from "@mui/icons-material/Delete";

import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DataGrid, GridToolbar, selectedGridRowsSelector } from "@mui/x-data-grid";
import { ColorModeContext, tokens } from "../../theme";
import {useTheme, IconButton } from "@mui/material";

const ViewReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const getRowId = (row) => row._id;

  const [fields, setFields] = useState([""]);
  const [genreFields, setGenreFields] = useState([""]);

  const [fieldsForGenre, setFieldsForGenre] = useState([""]);


  const [isLoading, setIsLoading] = useState(false);

  const [imageSuccess, setImageSuccess] = useState("");
  const { presetName, cloudName } = useContext(AppContext);

  const [reportImage, setReportImage] = useState({
    cover_url: "",
    cover_pub_id: "",
  });
  const [reporting_user, setreporting_user] = useState("");
  const [reported_user, setreported_user] = useState("");
  const [book, setbook] = useState("");
  const [reason, setreason] = useState("");
  const [reported_user_id, setreported_user_id] = useState("");
  const [reporting_user_id, setreporting_user_id] = useState("");

  const isNonMobile = useMediaQuery("(min-width:600px)");


  const handleSubmit = async () => {
    setIsLoading(true)

    try {
        const data = {
        is_active: false
      }
      

      const response = await axios.patch(`/admin/changeuserstatus/${reported_user_id}`, data);

      if (response?.data?.status === "SUCCESS") {
        setIsLoading(false)

        navigate("/reports");
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
      console.log(error);
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      setIsLoading(false);
    }
  };


  const fetchReport = async () => {
    setIsLoading(true);
    try{
        const response = await axios.get(`/report/${id}`);
        console.log(response.data?.data)
        if (response?.data?.status === "SUCCESS") {
            console.log(response.data?.data?.report)
            setreporting_user(response.data?.data?.report.reporting_user.firstName
               + response.data?.data?.report.reporting_user.lastName);

            setreported_user(response.data?.data?.report.reported_user.firstName
              + response.data?.data?.report.reported_user.lastName);

            setbook(response.data?.data?.report.book_id.title);
            setreason(response.data?.data?.report.reason);

            setreported_user_id(response.data?.data?.report.reported_user._id);
            setreporting_user_id(response.data?.data?.report.reporting_user._id);
        }
    
        setIsLoading(false);
    }catch(error){
        console.log(error)
      setIsLoading(false);
    }
    
  };


  useEffect(()=>{
    fetchReport()
  }, [])



  return (
    <Box m="20px">
      <Header title="EDIT" subtitle="Report" />

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
          label="Reporting user"
          value={reporting_user}
          name="name"
          id="outlined-read-only-input"
          InputProps={{
            readOnly: true
          }}
          sx={{ gridColumn: "span 1" }}
        />

        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="reported user"
          value={reported_user}
          name="name"
          id="outlined-read-only-input"
          InputProps={{
            readOnly: true
          }}
          sx={{ gridColumn: "span 1" }}
        />

        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="book title"
          value={book}
          name="name"
          id="outlined-read-only-input"
          InputProps={{
            readOnly: true
          }}
          sx={{ gridColumn: "span 1" }}
        />

        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="about"
          value={reason}
          name="name"
          id="outlined-read-only-input"
          InputProps={{
            readOnly: true
          }}
          sx={{ gridColumn: "span 2" }}
        />

      </Box>
  

      <Box display="flex" justifyContent="end" mt="20px">
        <Button
          type="submit"
          color="secondary"
          variant="contained"
          onClick={handleSubmit}
        >
          BAN REPORTED USER
        </Button>
      </Box>
    </Box>
  );
};

export default ViewReport;
