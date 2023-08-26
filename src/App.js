import DashboardHome from "./components/DashboardHome";
// import Login from "./components/Login";

import { Routes, Route, Navigate } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Dashboard from "./scenes/dashboard";
import Login from "./pages/login/login";
import ProtectedRoute from "./components/ProtetedRoute";
import Admin from "./scenes/admin/admin";
import AdminAdd from "./pages/admin-add/admin-add";
import AdminEdit from "./pages/admin-edit/admin-edit";
import ChangeDefaultPassword from "./pages/change-default-password/change-default-password";
import Profile from "./pages/profile/profile";
import ChangePin from "./pages/changepin/changepin";
import FAQ from "./scenes/faq";
import AddFaq from "./pages/add-faq/add-faq";
import EditFaq from "./pages/edit-faq/edit-faq";
import Clients from "./pages/clients/clients";
import About from "./pages/about/about";
import Terms from "./pages/terms/terms";
import AddTerms from "./pages/add-terms/add-terms";
import FirstAccount from "./pages/first-account/first-account";
import PrivacyPolicy from "./pages/privacy/privacy";
import AddPrivacy from "./pages/privacy-add/privacy-add";
import EditPrivacy from "./pages/privacy-edit/privacy-edit";
import Feedback from "./pages/feedback/feedback";
import AddAbout from "./pages/about-add/about-add";
import EditAbout from "./pages/about-edit/about-edit";
import Ad from "./pages/ad/ad";
import AdAdd from "./pages/ad-add/ad-add";
import ViewAbout from "./pages/about-view/about-view";
import EditTerms from "./pages/terms-edit/terms-edit";
import ViewTerms from "./pages/terms-view/terms-view";
import AdEdit from "./pages/ad-edit/ad-edit";
import AdChangeActive from "./pages/ad-change-active/ad-change-active";
import ViewPrivacy from "./pages/privacy-view/privacy-view";
import FeedbackTitle from "./pages/feedback-title/feedback-title";
import AdView from "./pages/ad-view/ad-view";
import AddFeedbackTitle from "./pages/feedback-title-edit/feedback-title-edit";
import EditFeedbackTitle from "./pages/feedback-title-edit/feedback-title-edit";
import Season from "./game-pages/season/season";
import Competition from "./game-pages/competition/competition";
import GameWeek from "./game-pages/gameweek/gameweek";
import AddGameWeek from "./game-pages/gameweek_add/add-gameweek";
import EditGameWeek from "./game-pages/gameweek-edit/index";
import AddSeason from "./game-pages/season-add/season-add";
import EditSeason from "./game-pages/season-edit/season-edit";
import AddCompetition from "./game-pages/competition-add/competition-add";
import EditCompetition from "./game-pages/competition-edit/competition-edit";
import Agent from "./pages/agent/agent";
import EditAgent from "./pages/agent/agent-edit/agent-edit";
import ClientView from "./pages/client-view/client-view";
import LeaderBoard from "./game-pages/leaderboard";
import YearlyLeaderboard from "./game-pages/leaderboard/yearly";
import Winners from "./game-pages/winners";
import WeeklyWinners from "./game-pages/winners/weekly_winners";
import YearlyWinners from "./game-pages/winners/yearly";
import Players from "./game-pages/player/player";
import AllPlayers from "./game-pages/players-season/player-season";
import AppVersion from "./pages/app-version/app-version";
import AppVersionAdd from "./pages/app-version-add/app-version-add";
import AppVersionEdit from "./pages/app-version-edit/app-version-edit";
import Author from "./game-pages/author";
import EditAuthor from "./game-pages/author/update_info";
import ToMajor from "./game-pages/author/to_major";
import AddAuthor from "./game-pages/author/create";
import FetchPlayer from "./pages/fetchplayer/fetchplayer";
import AgentView from "./game-pages/agent-view/agent-view";
import MonthlyLeaderboard from "./game-pages/leaderboard/monthly";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/first-account" element={<FirstAccount />} />
        <Route
          path="/change-default-password"
          element={<ChangeDefaultPassword />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardHome />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate replace to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="Admin" element={<Admin />} />
          <Route path="Admin/add" element={<AdminAdd />} />
          <Route path="Admin/edit" element={<AdminEdit />} />
          <Route path="season" element={<Season />} />
          <Route path="season/add" element={<AddSeason />} />
          <Route path="season/edit/:id" element={<EditSeason />} />
          <Route path="competition" element={<Competition />} />
          <Route path="competition/add" element={<AddCompetition />} />
          <Route path="competition/edit/:id" element={<EditCompetition />} />
          <Route path="gameweek" element={<GameWeek />} />
          <Route path="gameweek/add" element={<AddGameWeek />} />
          <Route path="gameweek/edit/:id" element={<EditGameWeek />} />
          <Route path="player" element={<Players />} />
          <Route path="player/season/:id" element={<AllPlayers />} />
          <Route path="fetchplayer" element={<FetchPlayer />} />
          <Route path="appversion" element={<AppVersion />} />
          <Route path="appversion/add" element={<AppVersionAdd />} />
          <Route path="appversion/edit/:id" element={<AppVersionEdit />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="faq/add" element={<AddFaq />} />
          <Route path="faq/edit/:id" element={<EditFaq />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/change_pin" element={<ChangePin />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/view/:id" element={<ClientView />} />
          <Route path="agents" element={<Agent />} />
          <Route path="agents/view/:id" element={<AgentView />} />
          <Route path="agents/edit/:id" element={<EditAgent />} />
          <Route path="author" element={<Author />} />
          <Route path="author/edit/:id" element={<EditAuthor />} />
          <Route path="author/tomajor" element={<ToMajor />} />
          <Route path="author/add" element={<AddAuthor />} />
          <Route path="leaderboard" element={<LeaderBoard />} />
          <Route path="leaderboard/yearly" element={<YearlyLeaderboard />} />
          <Route path="leaderboard/monthly" element={<MonthlyLeaderboard />} />
          <Route path="winners" element={<Winners />} />
          <Route path="winners/weekly" element={<WeeklyWinners />} />
          <Route path="winners/yearly" element={<YearlyWinners />} />
          <Route path="about" element={<About />} />
          <Route path="about/view/:id" element={<ViewAbout />} />
          <Route path="about/add" element={<AddAbout />} />
          <Route path="about/edit/:id" element={<EditAbout />} />
          <Route path="terms" element={<Terms />} />
          <Route path="terms/add" element={<AddTerms />} />
          <Route path="terms/edit/:id" element={<EditTerms />} />
          <Route path="terms/view/:id" element={<ViewTerms />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="privacy/add" element={<AddPrivacy />} />
          <Route path="privacy/view/:id" element={<ViewPrivacy />} />
          <Route path="privacy/edit/:id" element={<EditPrivacy />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="feedback-title" element={<FeedbackTitle />} />
          <Route path="feedback-title/add" element={<AddFeedbackTitle />} />
          <Route
            path="feedback-title/edit/:id"
            element={<EditFeedbackTitle />}
          />
          <Route path="ad" element={<Ad />} />
          <Route path="ad/add" element={<AdAdd />} />
          <Route path="ad/view/:id" element={<AdView />} />
          <Route path="ad/edit/:id" element={<AdEdit />} />
          <Route path="ad/change-active/:id" element={<AdChangeActive />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
