import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const EditPrivacy = () => {
  const { id } = useParams();
  // console.log(id);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [privacy, setPrivacy] = useState({ title: "", content: "" });
  // console.log(privacy);

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const getCurrentPrivacy = async () => {
    // console.log({ ...values, published: !isDraftMode, is_message: isMessage });

    try {
      setIsLoading(true);
      const response = await axios.get(`/privacy/${id}`);
      //   console.log(response);
      setPrivacy(response.data.data.privacy);

      setIsLoading(false);
    } catch (error) {
      // console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCurrentPrivacy();
  }, []);

  const handleFormSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`/privacy/${id}`, {
        title: privacy.title,
        content: privacy.content,
      });
      //   console.log(response);
      if (response?.data?.status === "SUCCESS") {
        navigate("/privacy");
        toast.success("Successfully Edited Privacy and Policy");
        setPrivacy({ title: "", content: "" });
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
      <Header title="View" subtitle="Privacy" />
      {isLoading && <p className="form-loading">Loading...</p>}
      <div>
        <Box
          display="grid"
          gap="30px"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          <TextField
            className="profile-textfield"
            fullWidth
            variant="filled"
            type="text"
            label="Title"
            name="title"
            value={privacy.title}
            onChange={(e) => {
              setPrivacy({ ...privacy, title: e.target.value });
            }}
            sx={{ gridColumn: "span 4" }}
          />
          <TextField
            fullWidth
            className="profile-textfield"
            variant="filled"
            type="text"
            label="Content"
            name="content"
            value={privacy.content}
            multiline
            rows={4}
            onChange={(e) => {
              setPrivacy({ ...privacy, content: e.target.value });
            }}
            sx={{ gridColumn: "span 4" }}
          />
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            onClick={handleFormSubmit}
            disabled={isLoading}
          >
            Update
          </Button>
        </Box>
      </div>
    </Box>
  );
};

export default EditPrivacy;
