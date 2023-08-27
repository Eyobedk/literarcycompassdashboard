import { Box, Button, TextField, useStepContext } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useContext } from "react";
import Avatar from "@mui/material/Avatar";

import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const AddAuthor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [imageSuccess, setImageSuccess] = useState("");
  const { presetName, cloudName } = useContext(AppContext);

  const [authorImage, setAuthorImage] = useState({
    picture_url: "",
    picture_pub_id: "",
  });
  const [authorName, setAuthorName] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [website, setWebsite] = useState("");
  const [amazonUrl, setAmzonURL] = useState("");
  const [about, setAbout] = useState("");

  const [authorId, setAuthorId] = useState("");

  const [userImage, setUserImage] = useState({
    image_secure_url: "",
    image_public_id: "",
  });

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      const response = await axios.post(`/author`, {
        full_name: authorName,
        birth_date: birthDate,
        website: birthDate,
        amazon_url: amazonUrl,
        about,
        ...authorImage,
      });

      if (response?.data?.status === "SUCCESS") {
        setIsLoading(false)

        navigate("/author");
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
              setAuthorImage({
                picture_url: data.secure_url,
                picture_pub_id: data.public_id,
              });
              setIsLoading(false)

            })
            .catch(() => {
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
    }
  }

  return (
    <Box m="20px">
      <Header title="EDIT" subtitle="Author" />

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
          alt={authorName}
          src={authorImage.picture_url}
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
          label="Author Name"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
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
          label="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
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
          label="amazon url"
          value={amazonUrl}
          onChange={(e) => setAmzonURL(e.target.value)}
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
            <DemoItem label="Responsive variant">
              <DateTimePicker
                defaultValue={dayjs(new Date(birthDate))}
                onChange={(newValue) => setBirthDate(newValue.$d)}
              />
            </DemoItem>
          </DemoContainer>
        </LocalizationProvider>
      </Box>
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

export default AddAuthor;
