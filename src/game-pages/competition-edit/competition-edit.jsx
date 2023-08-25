import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const EditCompetition = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const [currentCompetition, setCurrentCompetition] = useState({
    sid: "",
    cid: "",
    competition_name: "",
  });

  const [competitions, setCompetitions] = useState([]);
  const [league, setLeague] = useState("");
  //   console.log(competitions);
  console.log(league);

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const leagueChangeHandler = (e) => {
    // console.log(e.target.value);
    setLeague(e.target.value);
  };

  useEffect(() => {
    competitions.length >= 1 && setLeague(competitions[0].cid);
  }, [competitions]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/competitions/${id}`);

      if (response?.data?.status === "SUCCESS") {
        setCurrentCompetition(response.data.data.competition);
        // console.log(response.data.data);
      }

      setIsLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setIsLoading(false);
    }
  };

  const fetchCompetitions = async () => {
    if (currentCompetition.sid) {
      fetch(
        `https://soccer.entitysport.com/season/${currentCompetition.sid}/competitions/?token=${process.env.REACT_APP_ENTITY_TOKEN}`,
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setCompetitions(data.response.items);
          //   console.log(data.response.items);
        })
        .catch(() => {
          toast.error("Error While Fetching From Entity Sport");
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchCompetitions();
  }, [currentCompetition.sid]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      console.log({ cid: league });
      const response = await axios.patch(`/competitions/${id}`, {
        cid: league,
      });
      if (response?.data?.status === "SUCCESS") {
        navigate("/competition");
        toast.success(response?.data?.message);
      }
      setIsLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      // console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <Box m="20px">
      <Header title="Edit" subtitle="Competition" />

      {isLoading && <p className="form-loading">Loading...</p>}

      <form>
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
            value={currentCompetition.sid}
            name="name"
            id="outlined-read-only-input"
            InputProps={{
              readOnly: true,
            }}
            sx={{ gridColumn: "span 4" }}
          />
          {competitions.length >= 1 && (
            <div className="options">
              <p>League</p>
              <select
                name="competitions"
                id="competitions"
                className="competition-drop-down"
                onChange={leagueChangeHandler}
              >
                {/* <option value="a">a</option>; */}
                {competitions.map((competition) => {
                  return (
                    <option key={competition.cid} value={competition.cid}>
                      {competition.cname}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </Box>
        <Box display="flex" justifyContent="end" mt="20px">
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            disabled={isLoading || competitions.length <= 1}
            onClick={handleSubmit}
          >
            CHANGE
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditCompetition;
