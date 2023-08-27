import { Box, Button, TextField } from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate, useParams} from "react-router-dom";

import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const EditGenre = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");

  const isNonMobile = useMediaQuery("(min-width:600px)");


  const handleFormSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`/genre/${id}`, {
        title: title,
      });
      //   console.log(response.data.data);
      navigate("/genre");
      toast.success(response?.data?.message);

      setIsLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      // console.log(error);
      setIsLoading(false);
    }
  };

      /**
     * fetch genre
     */

      const fetchGere = async () => {
        setIsLoading(true);
        const response = await axios.get(`/genre/${id}`);

        if (response?.data?.status === "SUCCESS") {
            setTitle(response.data.data.genre.title);
        }

        setIsLoading(false);
    };


    useEffect(() => {
        fetchGere();
    }, []);

  return (
    <Box m="20px">
      <Header title="EDIT" subtitle="Genre" />
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
          required={true}
          name="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          sx={{ gridColumn: "span 4" }}
        />
      </Box>
      <Box display="flex" justifyContent="end" mt="20px">
        <Button
          type="submit"
          color="secondary"
          variant="contained"
          disabled={isLoading}
          onClick={handleFormSubmit}
        >
          EDIT
        </Button>
      </Box>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  title: yup.string().required("required"),
});
const initialValues = {
  title: "",
};

export default EditGenre;
