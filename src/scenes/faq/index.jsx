import { Box, useTheme, IconButton } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import cookie from "cookiejs";

import { useNavigate } from "react-router-dom";
import { ColorModeContext, tokens } from "../../theme";

import EditIcon from "@mui/icons-material/Edit";

import { toast } from "react-toastify";

import AddIcon from "@mui/icons-material/Add";

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

import DeleteIcon from "@mui/icons-material/Delete";

const FAQ = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [listOfFaq, setListOfFaq] = useState([]);

  // console.log(listOfFaq);
  const navigate = useNavigate();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const FetchFAQ = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get("/faq");

      setListOfFaq(response.data.data.faqs);
      // console.log(response.data.data.faq);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    FetchFAQ();
  }, []);

  const deleteAll = async () => {
    setIsLoading(true);
    const tokenString = cookie.get("admin");
    try {
      let headersList = {
        Accept: "*/*",
        Authorization: `Bearer ${tokenString}`,
        "Content-Type": "application/json",
      };

      let bodyContent = JSON.stringify({
        delete_key: process.env.REACT_APP_DELETE_KEY,
      });

      const reqOptions = {
        url: "/faq",
        method: "DELETE",
        headers: headersList,
        data: bodyContent,
      };

      const response = await axios.request(reqOptions);
      if (response?.data?.status === "SUCCESS") {
        toast.success(response?.data?.message);
      }
      if (
        response?.data?.status === "ERROR" ||
        response?.data?.status === "FAIL"
      ) {
        toast.error(response?.data?.message);
      }

      FetchFAQ();
    } catch (error) {
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      FetchFAQ();
    }
  };

  const deleteOneFAQ = async (id) => {
    setIsLoading(true);

    try {
      const response = await axios.delete(`/faq/${id}`);
      if (response?.data?.status === "SUCCESS") {
        toast.success(response?.data?.message);
      }
      FetchFAQ();
    } catch (error) {
      // console.log("error", error);
      if (
        error.response?.data?.status === "FAIL" ||
        error.response?.data?.status === "ERROR"
      ) {
        toast.error(error?.response?.data?.message);
      }
      FetchFAQ();
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" p={2}>
        <p>.</p>
        {/* ICONS */}
        <Box display="flex">
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
          <IconButton
            onClick={() => {
              navigate("add");
            }}
          >
            <AddIcon />
          </IconButton>
          <IconButton onClick={deleteAll}>
            <DeleteIcon />
          </IconButton>
          {/* <IconButton>
              <PersonOutlinedIcon />
            </IconButton> */}
        </Box>
      </Box>
      <Box m="20px">
        <Header title="FAQ" subtitle="Frequently Asked Questions Page" />
        {isLoading && <p className="form-loading">Loading...</p>}

        {listOfFaq &&
          listOfFaq.map((faq) => {
            return (
              <Accordion defaultExpanded key={faq.id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <div className="space-in-between">
                    <Typography color={colors.greenAccent[500]} variant="h5">
                      {faq.title}
                    </Typography>
                    <div>
                      <EditIcon
                        className="admin-icons"
                        onClick={() => {
                          navigate(`edit/${faq.id}`);
                        }}
                      />
                      <DeleteIcon
                        className="admin-icons"
                        onClick={() => {
                          deleteOneFAQ(faq.id);
                        }}
                      />
                    </div>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{faq.content}</Typography>
                </AccordionDetails>
              </Accordion>
            );
          })}
      </Box>
    </>
  );
};

export default FAQ;
