import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const EditAbout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const handleFormSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`/aboutus/${id}`, {
        version_title: aboutUs.version_title,
        content: aboutUs.content,
        version_content: aboutUs.version_content,
      });
      //   console.log(response.data.data);
      navigate("/about");
      toast.success(response?.data?.message);

      setIsLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);

      // console.log(error);
      setIsLoading(false);
    }
  };

  //   const handleChange = () => {};

  return (
    <Box m="20px">
      <Header title="Edit" subtitle="About Us" />
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
          label="Version Title"
          value={aboutUs.version_title}
          name="version_title"
          onChange={(e) => {
            setAboutUs({ ...aboutUs, version_title: e.target.value });
          }}
          sx={{ gridColumn: "span 4" }}
        />
        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="Version Content"
          name="version_content"
          sx={{ gridColumn: "span 4" }}
          value={aboutUs.version_content}
          onChange={(e) => {
            setAboutUs({ ...aboutUs, version_content: e.target.value });
          }}
          multiline
          rows={4}
        />
        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="Content"
          name="content"
          sx={{ gridColumn: "span 4" }}
          value={aboutUs.content}
          onChange={(e) => {
            setAboutUs({ ...aboutUs, content: e.target.value });
          }}
          multiline
          rows={4}
        />
      </Box>
      <Box display="flex" justifyContent="end" mt="20px">
        <Button
          type="submit"
          color="secondary"
          variant="contained"
          onClick={handleFormSubmit}
          disabled={isLoading}
        >
          Edit New About
        </Button>
      </Box>
    </Box>
  );
};

export default EditAbout;
