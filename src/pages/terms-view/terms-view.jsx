import { Box, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

const ViewTerms = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [terms, setTerms] = useState({ title: "", content: "" });

  // console.log(terms);

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const getCurrentTerms = async () => {
    // console.log({ ...values, published: !isDraftMode, is_message: isMessage });

    try {
      setIsLoading(true);
      const response = await axios.get(`/terms/${id}`);
      //   console.log(response);
      setTerms(response.data.data.termsAndConditions);
      // console.log(response.data.data.termsAndConditions);

      setIsLoading(false);
    } catch (error) {
      // console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCurrentTerms();
  }, []);

  return (
    <Box m="20px">
      <Header title="Edit" subtitle="Terms And Condition" />
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
          label="Title"
          name="title"
          value={terms.title}
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
          label="Content"
          name="content"
          value={terms.content}
          sx={{ gridColumn: "span 4" }}
          multiline
          rows={4}
        />
      </Box>
    </Box>
  );
};

export default ViewTerms;
