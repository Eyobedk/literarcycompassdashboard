import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {toast} from 'react-toastify'
import { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";



const ToMajor = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  
  const [coach, setCoach] = useState([]);
  const [coacheDropDown, setCoachDropDown] = useState([]);
  const [existingCoach, setExistingCoach] = useState({ existingCoachName: location?.state?.existingCoachName, existingCoachId: location?.state?.existingCoachId });
  const [selectedCoach, setSelectedCoach] = useState({ selectedCoachName: "", selectedCoachId: "" });

  const [openForSwitchMajor, setOpenForSwitchMajor] = useState(false);

  const isNonMobile = useMediaQuery("(min-width:600px)");


  const fetchAllCoachs = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get("/coach");

      setCoach(response.data.data.coaches);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };


  /**
   * organize comptition list with the current active comption
   */
  function organizeCoachsList() {

    const newCoachesList = [];
    if (coach.length !== 0) {
      for (let i = 0; i < coach.length; i++) {
        if (coach[i]?.coach_name !== existingCoach.existingCoachName) {
          newCoachesList.push({ name: coach[i].coach_name, label: coach[i].coach_name, id: coach[i]?._id });
        }
      }
      setCoachDropDown(newCoachesList);
    }
  }

 /**
* change selected coach name to ID
* @param {compName} compName 
*/
function changeCoachNameToId(coachName) {
  const coach = coacheDropDown.filter((coa) => coa.name == coachName);
  const coachId = coach[0].id;
  setSelectedCoach({selectedCoachId: coachId, selectedCoachName: coachName});
}

  useEffect(() => {
    fetchAllCoachs();
  }, []);


  useEffect(()=>{
    organizeCoachsList()
  }, [coach])


  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const response = await axios.patch(`/coach/swap`, {
        newMajorCoachId: selectedCoach.selectedCoachId,
        existingCoachId: existingCoach.existingCoachId,
        });

      if (response?.data?.status === "SUCCESS") {
        navigate("/coach");
        toast.success(response?.data?.message);
      }
     
      setIsLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setIsLoading(false);
    }
  };


  return (
    <Box m="20px">
      <Header title="EDIT" subtitle="Game week" />

      {
        isLoading && <p className="form-loading">Loading...</p>
      }

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
          id="filled-select-currency"
          select
          name="name"
          label={selectedCoach.selectedCoachName}
          variant="filled"
          value={selectedCoach.selectedCoachName}
          sx={{ gridColumn: "span 4" }}
          onChange={(e) => {
            changeCoachNameToId(e.target.value);
          }}
        >
         
          {coacheDropDown.map((option) => (
            <MenuItem key={option.id} value={option.name}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>

      </Box>
      <Box display="flex" justifyContent="end" mt="20px">
        <Button
          type="submit"
          color="secondary"
          variant="contained"
          onClick={handleSubmit}
        >
          Make Major
        </Button>
      </Box>
    </Box>
  );
};

export default ToMajor;
