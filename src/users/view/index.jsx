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

const ViewUser = () => {
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

  const [bookImage, setUserImage] = useState({
    cover_url: "",
    cover_pub_id: "",
  });
  const [firstName, setFristName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");

  const [authorDropDown, setAuthorDropDown] = useState([]);
  const [genreDropDown, setGenreDropDown] = useState([]);

  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);

  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const [selectedAuthorsList, setSelectedAuthorsList] = useState([]);
  const [selectedGenresList, setSelectedGenresList] = useState([]);

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const fetchUser = async () => {
    setIsLoading(true);
    try{
        const response = await axios.get(`/user/readerprofile/${id}`);
        if (response?.data?.status === "SUCCESS") {
            setFristName(response.data?.data?.user.firstName);
            setLastName(response.data?.data?.user.lastName);
            setEmail(response.data?.data?.user.email);
            setBio(response.data?.data?.user.bio);
            setImage(response.data?.data?.user.picture_url);
            console.log(response.data?.data?.user)
        }
    
        setIsLoading(false);
    }catch(error){
        console.log(error)
      setIsLoading(false);
    }
    
  };

  useEffect(()=>{
    fetchUser()
  }, [])

  return (
    <Box m="20px">
      <Header title="USER" subtitle="view" />

      {isLoading && <p className="form-loading">Loading...</p>}

      <Box
        display="grid"
        gap="30px"
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        sx={{
          "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
        }}
      >
        {console.log("jaja", image)}
        <Avatar
          alt={firstName}
          src={image}
          sx={{ width: 76, height: 76 }}
        />
        
      </Box>
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
          label="first name"
          value={firstName}
          onChange={(e) => setFristName(e.target.value)}
          name="name"
          id="outlined-read-only-input"
          InputProps={{
            readOnly: true,
          }}
          sx={{ gridColumn: "span 1" }}
        />
        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="last name"
          value={lastName}
          name="name"
          id="outlined-read-only-input"
          InputProps={{
            readOnly: true,
          }}
          sx={{ gridColumn: "span 1" }}
        />

        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="email"
          value={email}
          name="name"
          id="outlined-read-only-input"
          InputProps={{
            readOnly: true,
          }}
          sx={{ gridColumn: "span 1" }}
        />

        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="bio"
          value={bio}
          name="name"
          id="outlined-read-only-input"
          InputProps={{
            readOnly: true,
          }}
          sx={{ gridColumn: "span 1" }}
        />

     
      </Box>
  
    </Box>
  );
};

export default ViewUser;
