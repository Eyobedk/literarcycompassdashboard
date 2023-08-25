import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const ViewAbout = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  //   console.log(isLoading);

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [aboutUs, setAboutUs] = useState({
    version_title: "",
    content: "",
    version_content: "",
  });

  //   console.log(aboutUs);

  const getSelectedAbout = async () => {
    // console.log({ ...values, published: !isDraftMode, is_message: isMessage });
    setIsLoading(true);

    try {
      const response = await axios.get(`/aboutus/${id}`);

      setAboutUs(response.data.data.aboutUs);
      //   console.log(response.data.data.aboutUs);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSelectedAbout();
  }, []);

  //   const handleChange = () => {};

  return (
    <Box m="20px">
      <Header title="View" subtitle="About Us" />
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
          id="outlined-read-only-input"
          InputProps={{
            readOnly: true,
          }}
          fullWidth
          variant="filled"
          type="text"
          label="Version Title"
          value={aboutUs.version_title}
          name="version_title"
          sx={{ gridColumn: "span 4" }}
        />
        <TextField
          id="outlined-read-only-input"
          InputProps={{
            readOnly: true,
          }}
          fullWidth
          variant="filled"
          type="text"
          label="Version Content"
          name="version_content"
          sx={{ gridColumn: "span 4" }}
          value={aboutUs.version_content}
          multiline
          rows={4}
        />
        <TextField
          id="outlined-read-only-input"
          InputProps={{
            readOnly: true,
          }}
          fullWidth
          variant="filled"
          type="text"
          label="Content"
          name="content"
          sx={{ gridColumn: "span 4" }}
          value={aboutUs.content}
          multiline
          rows={4}
        />
      </Box>
    </Box>
  );
};

export default ViewAbout;
