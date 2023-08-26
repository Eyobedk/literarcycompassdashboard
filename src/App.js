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

import Profile from "./pages/profile/profile";

import Clients from "./pages/clients/clients";

import FirstAccount from "./pages/first-account/first-account";

import FeedbackTitle from "./pages/genre/index";

import AddFeedbackTitle from "./pages/genre-edit/index";
import EditFeedbackTitle from "./pages/genre-edit/index";

import ClientView from "./pages/client-view/client-view";
import Author from "./author/";
import EditAuthor from "./author/update_info";
import ToMajor from "./author/to_major";
import AddAuthor from "./author/create";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/first-account" element={<FirstAccount />} />

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

          <Route path="profile" element={<Profile />} />

          <Route path="clients" element={<Clients />} />
          <Route path="clients/view/:id" element={<ClientView />} />

          <Route path="author" element={<Author />} />
          <Route path="author/edit/:id" element={<EditAuthor />} />
          <Route path="author/tomajor" element={<ToMajor />} />
          <Route path="author/add" element={<AddAuthor />} />

          <Route path="genre" element={<FeedbackTitle />} />
          <Route path="genre/add" element={<AddFeedbackTitle />} />
          <Route
            path="genre/edit/:id"
            element={<EditFeedbackTitle />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
