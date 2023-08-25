import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const EditFaq = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [faq, setFaq] = useState({
    title: "",
    content: "",
  });
  //   console.log(faq);

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const FetchFAQ = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(`/faq/${id}`);

      setFaq(response.data.data.faq);
      // console.log(response.data.data.faq);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    FetchFAQ();
  }, []);

  const handleFormSubmit = async () => {
    // console.log(values);

    try {
      setIsLoading(true);
      const response = await axios.patch(`/faq/${id}`, {
        title: faq.title,
        content: faq.content,
      });
      //   console.log(response);
      //   console.log(response);
      toast.success("successfully edited Faq content");
      if (response?.data?.status === "SUCCESS") {
        navigate("/faq");
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
      <Header title="CREATE ADMIN" subtitle="Create a New Admin Profile" />

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
          onChange={(e) => {
            setFaq({ ...faq, title: e.target.value });
          }}
          value={faq?.title}
          name="title"
          sx={{ gridColumn: "span 4" }}
        />
        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="Content"
          value={faq?.content}
          onChange={(e) => {
            setFaq({ ...faq, content: e.target.value });
          }}
          name="content"
          sx={{ gridColumn: "span 4" }}
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
          Change FAQ
        </Button>
      </Box>
    </Box>
  );
};

// const initialValues = {
//   title: "",
//   content: "",
// };

export default EditFaq;
