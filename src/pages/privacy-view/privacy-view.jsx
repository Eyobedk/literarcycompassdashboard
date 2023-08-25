import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const ViewPrivacy = () => {
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
      const response = await axios.patch(`/privacy/${id}`);
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
            id="outlined-read-only-input"
            InputProps={{
              readOnly: true,
            }}
            className="profile-textfield"
            fullWidth
            variant="filled"
            type="text"
            label="Title"
            name="title"
            value={privacy.title}
            sx={{ gridColumn: "span 4" }}
          />
          <TextField
            id="outlined-read-only-input"
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            className="profile-textfield"
            variant="filled"
            type="text"
            label="Content"
            name="content"
            value={privacy.content}
            multiline
            rows={4}
            sx={{ gridColumn: "span 4" }}
          />
        </Box>
      </div>
    </Box>
  );
};

export default ViewPrivacy;
