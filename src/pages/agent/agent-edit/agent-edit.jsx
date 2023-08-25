import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import MenuItem from "@mui/material/MenuItem";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const EditAgent = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [agentStatus, setAgentStatus] = useState("");
  const [agentNewStatus, setAgentNewStatus] = useState(`${location.state.status}`);
  const [cancelReason, setCancelReason] = useState("");

  const [agentId, setAgentId] = useState("");

  useEffect(() => {
    setAgentStatus(location.state && location.state.status);
    setAgentId(location.state && location.state.id);
  }, [location.state]);

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const handleFormSubmit = async () => {
    if (agentNewStatus === agentStatus) {
      toast.error("You cant put the same status for the agent");
    } else {
      try {

        setIsLoading(true);
        const response = await axios.patch(`/agentrequest/${agentId}`, {
          cancel_reason: agentNewStatus === "Approved" ? "Request successfuly approved!" : cancelReason,
          status: agentNewStatus,
        });

        if (response?.data?.status === "SUCCESS") {
          navigate("/agents");
          toast.success(response?.data?.message);
        }
        setIsLoading(false);
      } catch (error) {
        if (
          error.response?.data?.status === "FAIL" ||
          error.response?.data?.status === "ERROR"
        ) {
          toast.error(error?.response?.data?.message);
        }
        setIsLoading(false);
      }
    }
  };

  const newStatus = [];
  const status = [
    {
      value: "Pending", 
      label: "Pending",
    },
    {
      value: "Contacted",
      label: "Contacted",
    },
    {
      value: "Approved",
      label: "Approved",
    },
    {
      value: "Rejected",
      label: "Rejected",
    },
  ];

  newStatus.push({value: agentStatus, label: agentStatus});

  for (let i = 0; i < status.length; i++) {
    if(status[i]?.value !== newStatus[0]?.value){
      newStatus.push(status[i]);
    }
  }
  

  return (
    <Box m="20px">
      <Header title="Edit Agent Request Status" subtitle="Edit" />

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
          onChange={(e)=> setCancelReason(e.target.value)}
          label="cancel reason"
          name="cancel_reason"
          sx={{ gridColumn: "span 4",display: agentNewStatus == "Approved" ? 'none' : 'block' }}
          value={cancelReason}
        />

        <TextField
          fullWidth
          id="filled-select-currency"
          select
          name="status"
          label="Select"
          defaultValue="Agent"
          variant="filled"
          sx={{ gridColumn: "span 4" }}
          value={agentNewStatus}
          onChange={(e) => {
            setAgentNewStatus(e.target.value);
          }}
        >
          {newStatus.map((option) => (
            <MenuItem key={option.value} value={option.value} >
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box display="flex" justifyContent="end" mt="20px">
        <Button
          type="submit"
          color="secondary"
          variant="contained"
          onClick={handleFormSubmit}
          disabled={isLoading}
        >
          Change Status
        </Button>
      </Box>
    </Box>
  );
};

export default EditAgent;
