import "react-pro-sidebar/dist/css/styles.css";

import { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import FeedbackIcon from "@mui/icons-material/Feedback";
import SubjectIcon from "@mui/icons-material/Subject";
import InfoIcon from "@mui/icons-material/Info";
import TitleIcon from "@mui/icons-material/Title";
import CampaignIcon from "@mui/icons-material/Campaign";
import QuizIcon from "@mui/icons-material/Quiz";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";
import SecurityIcon from "@mui/icons-material/Security";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import HandshakeIcon from "@mui/icons-material/Handshake";
import MobileFriendlyIcon from "@mui/icons-material/MobileFriendly";
import DownloadIcon from "@mui/icons-material/Download";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import cookiejs from "cookiejs";
import { Leaderboard, MilitaryTech, Sports } from "@mui/icons-material";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();

  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const tokenString = localStorage.getItem("admin");
  const admin = JSON.parse(tokenString);

  const [names, setNames] = useState({
    first_name: "",
    last_name: "",
    role: "",
  });

  useEffect(() => {
    if (tokenString) {
      setNames({
        first_name: admin.first_name,
        last_name: admin.last_name,
        role: admin.role,
      });
    }
  }, [admin.first_name, admin.last_name, tokenString, admin.role]);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const Logout = ({ title, to, icon, selected, setSelected }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
      <MenuItem
        active={selected === title}
        style={{
          color: colors.grey[100],
        }}
        onClick={() => handleClickOpen()}
        icon={icon}
      >
        <Typography>{title}</Typography>
        <Link to={to} />
      </MenuItem>
    );
  };

  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  ADMIN
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {`${names.first_name} ${names.last_name.slice(0, 1)}.`}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {names.role}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Notice"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to logout
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    handleClose();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => {
                    handleClose();
                    // deleteAll();
                    localStorage.removeItem("admin");
                    cookiejs.remove("admin");

                    // navigate user to login
                    navigate("/login");
                  }}
                  autoFocus
                >
                  Logout
                </Button>
              </DialogActions>
            </Dialog>

            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Manage
            </Typography>
            <Item
              title="Admin"
              to="/admin"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Books
            </Typography>
            <Item
              title="Fetch Roaster Players"
              to="/fetchplayer"
              icon={<DownloadIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Roaster Players"
              to="/player"
              icon={<SupervisedUserCircleIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Season"
              to="/season"
              icon={<CalendarMonthIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Competitions"
              to="/competition"
              icon={<EmojiEventsIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Game Week"
              to="/gameweek"
              icon={<SportsEsportsIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Coach"
              to="/coach"
              icon={<Sports />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Leaderboard"
              to="/leaderboard"
              icon={<Leaderboard />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Winners"
              to="/winners"
              icon={<MilitaryTech />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Client
            </Typography>
            <Item
              title="Client's List"
              to="/clients"
              icon={<PersonIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Agent's List"
              to="/agents"
              icon={<HandshakeIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Feedback"
              to="/feedback"
              icon={<FeedbackIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
            <Item
              title="Terms And Conditions"
              to="/terms"
              icon={<SubjectIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Privacy And Policy"
              to="/privacy"
              icon={<SecurityIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="About Us"
              to="/about"
              icon={<InfoIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Feedback Title"
              to="/feedback-title"
              icon={<TitleIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="AD"
              to="/ad"
              icon={<CampaignIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQ Page"
              to="/faq"
              icon={<QuizIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              User
            </Typography>
            <Item
              title="Profile"
              to="/profile"
              icon={<AccountBoxIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Logout
              title="Logout"
              icon={<LogoutIcon />}
              selected={selected}
              setSelected={setSelected}
              onClick={() => {
                handleClickOpen();
              }}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
