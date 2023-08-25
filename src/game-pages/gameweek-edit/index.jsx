import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {toast} from 'react-toastify'
import { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";



const EditGameWeek = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  
  const [season, setSeason] = useState("");

  const [comptetion, setCompetition] = useState({});
  const [comptetionDropDown, setComptetionDropDown] = useState([]);
  const [comptetions, setComptetions] = useState([]);
  const [selectedComptition, setSelectedComptition] = useState("");

  const [dataExist, setDataExist] = useState({gameWeek: false, comptetion: false});

  const [gameWeek, setGameWeek] = useState({});
  const [newGameWeek, setNewGameWeek] = useState("");

  const isNonMobile = useMediaQuery("(min-width:600px)");


  /**
   * fetch all comptitions
   */
  const fetchCompetitions = async () => {
      setIsLoading(true);
      const response = await axios.get("/competitions");

      if (response?.data?.status === "SUCCESS") {
        setComptetions(response.data.data.competetions);
      }

      setIsLoading(false);
  };

  /**
   * fetch game week comptition
   * @returns void
   */
  const fetchCompetition = async () => {

    if (gameWeek.competition_id) {
      setIsLoading(true);
      const response = await axios.get(`/competitions/${gameWeek.competition_id}`);

      if (!response.data.data.competition) {
        setDataExist({comptetion: true});
        return;
      }

      if (response?.data?.status === "SUCCESS") {
        setCompetition(response.data.data.competition);
        setSelectedComptition(response.data.data.competition.competition_name)
      }

      setIsLoading(false);
    }
  };

  /**
   * fetch game week
   */

  const fetchGameWeek = async () => {
      setIsLoading(true);
      const response = await axios.get(`/gameweek/${id}`);

      if (response?.data?.data?.gameWeek) {
        setDataExist({gameWeek: true});
      }

      if (response?.data?.status === "SUCCESS") {
        setSeason(response.data.data.gameWeek.sid)
        setGameWeek(response.data.data.gameWeek);
        setNewGameWeek(response.data.data.gameWeek.game_week)
      }

      setIsLoading(false);
  };

  /**
   * organize comptition list with the current active comption
   */
  function organizeComptetionsList(){
    
    const newComptetionsList = [];

    if(comptetion){
      newComptetionsList.push({name: comptetion.competition_name, label: comptetion.competition_name, id: comptetion.id})

      if(comptetions.length !== 0){
        for (let i = 0; i < comptetions.length; i++) {
            if(comptetions[i]?.competition_name !== newComptetionsList[0]?.name){
              newComptetionsList.push({name: comptetions[i].competition_name, label: comptetions[i].competition_name, id: comptetions[i]?.id});
            }
        }

        setComptetionDropDown(newComptetionsList);
      }
      
    }
  }

  /**
   * change selected comptition name to ID
   * @param {compName} compName 
   */
  function changeComptetionNameToId(compName){
    const comptition = comptetionDropDown.filter((comp)=> comp.name == compName);
    const comptId = comptition[0].id;
    return comptId;
  }

  useEffect(() => {
    fetchGameWeek();
  }, []);

  useEffect(() => {
    fetchCompetition();
  }, [dataExist.gameWeek]);

  useEffect(() => {
    fetchCompetitions();
  }, [dataExist.gameWeek]);

  useEffect(()=>{
    organizeComptetionsList()
  }, [comptetion])


  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const comptId = changeComptetionNameToId(selectedComptition);

      const response = await axios.patch(`/gameweek/${id}`, {
          game_week: newGameWeek,
          competition_id: comptId,
          season_id: gameWeek.season_id
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
          placeholder="eg. 2024 or 24-25"
          variant="filled"
          type="text"
          label="Current Season"
          value={season}
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
          name={selectedComptition}
          label="Select"
          variant="filled"
          value={selectedComptition}
          sx={{ gridColumn: "span 4" }}
          onChange={(e) => {
            setSelectedComptition(e.target.value);
          }}
        >
          {comptetionDropDown.map((option) => (
            <MenuItem key={option.id} value={option.name}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          variant="filled"
          type="number"
          label="Week Round"
          name="name"
          value={newGameWeek}
          id="gameweek"
          onChange={(e)=> setNewGameWeek(e.target.value)}
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
          EDIT
        </Button>
      </Box>
    </Box>
  );
};

export default EditGameWeek;
