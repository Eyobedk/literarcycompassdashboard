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

const AddBook = () => {
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

  const [bookImage, setBookImage] = useState({
    cover_url: "",
    cover_pub_id: "",
  });
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [language, setLanguage] = useState("");
  const [no_of_page, setNoOfPage] = useState("");
  const [about, setAbout] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedGenre, setSelectedAuthorGenre] = useState("");

  const [authorDropDown, setAuthorDropDown] = useState([]);
  const [genreDropDown, setGenreDropDown] = useState([]);

  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);

  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const [selectedAuthorsList, setSelectedAuthorsList] = useState([]);
  const [selectedGenresList, setSelectedGenresList] = useState([]);

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const selectAuthor = async (selectedOne) =>{

    const selectedId = changeAuthorNameToId(selectedOne);
    const alreadySelected = selectedAuthorsList.filter((selected)=> selected === selectedId)
    
    if(alreadySelected.length ===0){
      selectedAuthorsList.push(selectedId);
    }
  }
  const selectGenre = async (selectedOne) =>{

    const selectedId = changeGenreNameToId(selectedOne);
    const alreadySelected = selectedGenresList.filter((selected)=> selected === selectedId)
    
    if(alreadySelected.length ===0){
      selectedGenresList.push(selectedId);
    }
  }

  
  const handleAddField = () => {
    setFields([...fields, ""]);
  };
  const handleAddGenreField = () => {
    setFields([...fields, ""]);
  };

  const handleRemoveField = (index) => {
    const filteredFields = fields.filter((_, i) => i !== index);
    setFields(filteredFields);
    
    const selecteds = selectedAuthorsList.filter((_,removingIndex)=>
       index !== removingIndex
    );
    setSelectedAuthorsList(selecteds)
  };
  
  const handleRemoveGenreField = (index) => {
    const filteredFields = genreFields.filter((_, i) => i !== index);
    setGenreFields(filteredFields);
    
    const selecteds = selectedGenresList.filter((_,removingIndex)=>
       index !== removingIndex
    );
    setSelectedAuthorsList(selecteds)
  };

  const handleSubmit = async () => {
    setIsLoading(true)

    try {

      const response = await axios.post(`/book`, {
        title,
        date,
        genre: selectedGenresList,
        language,
        no_of_page,
        about,
        author: selectedAuthorsList,
        ...bookImage,
      });

      if (response?.data?.status === "SUCCESS") {
        setIsLoading(false)

        navigate("/book");
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

  function handleImageChange(e) {
    setIsLoading(true);
    const file = e.target.files[0];
    setImageSuccess("");

    // Check that the file size is less than or equal to 400 KB
    if (file && file.size <= 400 * 1024) {
      const reader = new FileReader();

      reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;

        const handleUpload = async () => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", presetName); // Replace with your upload preset

          fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => {
              console.log({
                image_secure_url: data.secure_url,
                image_public_id: data.public_id,
              });
              setBookImage({
                cover_url: data.secure_url,
                cover_pub_id: data.public_id,
              });
              setIsLoading(false)

            })
            .catch(() => {
              toast.error("Error occurred while uploading");
              setImageSuccess("");
              // throw error;
              setIsLoading(false);
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
    }
  }


  function changeAuthorNameToId(authorName){
    const authors = authorDropDown.filter((author)=> author.name == authorName);
    const authorId = authors[0].id;
    return authorId;
  }
  function changeGenreNameToId(genreName){
    const genres = genreDropDown.filter((genre)=> genre.name == genreName);
    const genreId = genres[0].id;
    return genreId;
  } 

  function organizeAuthorsList(){
    
    const newAuthorsList = [];

      if(authors.length !== 0){
        for (let i = 0; i < authors.length; i++) {
              newAuthorsList.push({name: authors[i].full_name, label: authors[i].full_name, id: authors[i]?._id});
        }

        setAuthorDropDown(newAuthorsList);
      }
      
    }

  function organizeGenresList(){
    
    const newGenresList = [];

      if(genres.length !== 0){
        for (let i = 0; i < authors.length; i++) {
              newGenresList.push({name: genres[i].title, label: genres[i].title, id: genres[i]?._id});
        }

        setGenreDropDown(newGenresList);
      }
      
    }

  const fetchAllAuthors = async () => {
    setIsLoading(true);
    const response = await axios.get(`/author`);

    if (response?.data?.status === "SUCCESS") {
        setAuthors(response.data?.data?.author);
    }

    setIsLoading(false);
  };

  const fetchAllGenres = async () => {
    setIsLoading(true);
    const response = await axios.get(`/genre`);

    if (response?.data?.status === "SUCCESS") {
        setGenres(response.data?.data?.genre);
    }

    setIsLoading(false);
  };

  useEffect(()=>{
    fetchAllAuthors()
  }, [])
 
  useEffect(()=>{
    organizeAuthorsList()
  }, [authors])

  useEffect(()=>{
    fetchAllGenres()
  }, [])
 
  useEffect(()=>{
    organizeGenresList()
  }, [genres])



  return (
    <Box m="20px">
      <Header title="EDIT" subtitle="Book" />

      {isLoading && <p className="form-loading">Loading...</p>}

      <Box
        display="grid"
        gap="30px"
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        sx={{
          "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
        }}
      >
        <Avatar
          alt={title}
          src={bookImage.cover_url}
          sx={{ width: 76, height: 76 }}
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
          label="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          name="name"
          id="outlined-read-only-input"
          InputProps={{
            readOnly: false,
          }}
          sx={{ gridColumn: "span 1" }}
        />

        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          name="name"
          id="outlined-read-only-input"
          InputProps={{
            readOnly: false,
          }}
          sx={{ gridColumn: "span 1" }}
        />

        <TextField
          fullWidth
          variant="filled"
          type="number"
          label="number of pages"
          value={no_of_page}
          onChange={(e) => setNoOfPage(e.target.value)}
          name="name"
          id="outlined-read-only-input"
          InputProps={{
            readOnly: false,
          }}
          sx={{ gridColumn: "span 1" }}
        />

        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="about"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          name="name"
          id="outlined-read-only-input"
          InputProps={{
            readOnly: false,
          }}
          sx={{ gridColumn: "span 2" }}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer
            width={300}
            components={["DateTimePicker", "DateTimePicker"]}
          >
            <DemoItem label="Birth date">
              <DateTimePicker
                defaultValue={dayjs(new Date(date))}
                onChange={(newValue) => setDate(newValue.$d)}
              />
            </DemoItem>
          </DemoContainer>
        </LocalizationProvider>
      </Box>
      
      <Header subtitle="Add Authors" />
      {fields.map((field, index) => (
        <div key={index}>
          <TextField
          fullWidth
          id="filled-select-currency"
          select
          name={selectedAuthor}
          label="Author"
          variant="filled"
          value={selectedAuthorsList[-1]}
          sx={{ gridColumn: "span 1" }}
          onChange={(e) => {
            selectAuthor(e.target.value);
          }}
        >
          {authorDropDown.map((option) => (
            <MenuItem key={option.id} value={option.name}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
          <IconButton onClick={() => handleRemoveField(index)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ))}
      <Button variant="contained" onClick={handleAddField} sx={{ mt: 2 }}>
        Add Field
      </Button>
      
      <Header subtitle="Add Genres" />
      {genreFields.map((field, index) => (
        <div key={index}>
          <TextField
          fullWidth
          id="filled-select-currency"
          select
          name={selectedGenre}
          label="Genre"
          variant="filled"
          value={selectedGenresList[-1]}
          sx={{ gridColumn: "span 1" }}
          onChange={(e) => {
            selectGenre(e.target.value);
          }}
        >
          {genreDropDown.map((option) => (
            <MenuItem key={option.id} value={option.name}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
          <IconButton onClick={() => handleRemoveGenreField(index)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ))}
      <Button variant="contained" onClick={handleAddGenreField} sx={{ mt: 2 }}>
        Add Field
      </Button>

      <Box display="flex" justifyContent="end" mt="20px">
        <Button
          type="submit"
          color="secondary"
          variant="contained"
          onClick={handleSubmit}
        >
          CREATE
        </Button>
      </Box>
    </Box>
  );
};

export default AddBook;
