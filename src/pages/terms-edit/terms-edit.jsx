import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const EditTerms = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [terms, setTerms] = useState({ title: "", content: "" });

  const [isDraftMode, setIsDraftMode] = useState(true);


  const isNonMobile = useMediaQuery("(min-width:600px)");

  const getCurrentTerms = async () => {
    // console.log({ ...values, published: !isDraftMode, is_message: isMessage });

    try {
      setIsLoading(true);
      const response = await axios.get(`/terms/${id}`);
      setTerms(response.data.data.termsAndConditions);
      // console.log(response.data.data.termsAndConditions);

      setIsLoading(false);
    } catch (error) {
      // console.log(error);
      setIsLoading(false);
    }
  };
  //a

  useEffect(() => {
    getCurrentTerms();
  }, []);

  const handleToggle = () => {
    setIsDraftMode(!isDraftMode);
  };


  const handleFormSubmit = async () => {
    // console.log({ ...values, published: !isDraftMode, is_message: isMessage });

    try {
      setIsLoading(true);
      const response = await axios.patch(`/terms/${id}`, {
        title: terms.title,
        content: terms.content,
        is_published: isDraftMode,
      });

        console.log(isDraftMode);
      if (response?.data?.status === "SUCCESS") {
        navigate("/terms");
        toast.success(response?.data?.message);
        setTerms({ title: "", content: "" });
      }
      if (
        response?.data?.status === "ERROR" ||
        response?.data?.status === "FAIL"
      ) {
        toast.error(response?.data?.message);
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
      <Header title="View" subtitle="Terms And Condition" />
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
          label="Title"
          name="title"
          sx={{ gridColumn: "span 4" }}
          value={terms.title}
          onChange={(e) => {
            setTerms({ ...terms, title: e.target.value });
          }}
        />
        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="Content"
          name="content"
          value={terms.content}
          onChange={(e) => {
            setTerms({ ...terms, content: e.target.value });
          }}
          sx={{ gridColumn: "span 4" }}
          multiline
          rows={4}
        />

        <div>
          <label htmlFor="toggle"></label>
          <input
            id="toggle"
            type="checkbox"
            checked={isDraftMode}
            onChange={handleToggle}
          />
          Publish
        </div>
      </Box>

      <Box display="flex" justifyContent="end" mt="20px">
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
    </Box>
  );
};

export default EditTerms;
