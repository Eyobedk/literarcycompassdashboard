import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import MenuItem from "@mui/material/MenuItem";




const AddGameWeek = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({ id: "", name: "" });
  
  const [competitions, setCompetitions] = useState([]);
  const [competition, setCompetition] = useState("");
  const [comptetionId, setComptitionId] = useState("");
  const [comptetionDropDown, setComptetionDropDown] = useState([]);


  const [seasonExist, setSeasonExist] = useState(true);
  const [weekRound, setWeekRound] = useState("");

  const isNonMobile = useMediaQuery("(min-width:600px)");



  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/season`);

      if (response.data.data.season.length === 0) {
        setSeasonExist(false);
        return true;
      }

      if (response?.data?.status === "SUCCESS") {
        setInitialValues(response.data.data.season[0]);
        fetchCompetitions();
      }

      setIsLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setIsLoading(false);
    }
  };

  const fetchCompetitions = async () => {
    if (initialValues) {
      setIsLoading(true);
      const response = await axios.get("/competitions");

      if (response.data.data.competetions.length === 0) {
        setSeasonExist(false);
        return true;
      }

      if (response?.data?.status === "SUCCESS") {
        setCompetitions(response.data.data.competetions);
      }

      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleSubmit = async () => {
    try {
      if (38 > weekRound < 1) {
        return toast.error(
          "Week round can not be greater that 38 or less than 1."
        );
      }
      setIsLoading(true);

      const response = await axios.post(`/gameweek`, {
        competition_id: comptetionId,
        season_id: initialValues.id,
        game_week: weekRound,
      });

      if (response?.data?.status === "SUCCESS") {
        navigate("/gameweek");
        toast.success(response?.data?.message);
      }
      setIsLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setIsLoading(false);
    }
  };

  
  function changeComptetionNameToId(compName){
    const comptition = competitions.filter((comp)=> comp.competition_name == compName);
    setComptitionId(comptition[0]._id);
  }

  return (
    <Box m="20px">
      <Header title="CREATE" subtitle="Competition" />

      {!seasonExist ? (
        <p className="form-loading" style={{ color: "red" }}>
          Season Does Not Exist!!!
        </p>
      ) : (
        isLoading && <p className="form-loading">Loading...</p>
      )}

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
          placeholder="eg. 2024 or 24-25"
          variant="filled"
          type="text"
          label="Current Season"
          value={initialValues.name}
          name="name"
          id="outlined-read-only-input"
          InputProps={{
            readOnly: true,
          }}
          sx={{ gridColumn: "span 4" }}
        />

        <TextField
          fullWidth
          id="filled-select-currency"
          select
          name="role"
          label="Select"
          variant="filled"
          sx={{ gridColumn: "span 4" }}
          onChange={(e) => {
            changeComptetionNameToId(e.target.value);
          }}
        >
          {competitions.map((option) => (
            <MenuItem key={option.id} value={option.competition_name}>
              {option.competition_name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          placeholder="min(1) - max(38)"
          variant="filled"
          type="number"
          label="Week Round"
          name="name"
          id="gameweek"
          required={true}
          onChange={(e) => {
            setWeekRound(e.target.value);
          }}
          InputProps={{
            readOnly: false,
          }}
          sx={{ gridColumn: "span 4" }}
        />

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

export default AddGameWeek;