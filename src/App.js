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

import Clients from "./users/index";

import FirstAccount from "./pages/first-account/first-account";

import Genre from "./pages/genre/index";

import AddGenre from "./pages/genre-add/index";
import EditGenre from "./pages/genre-edit/index";

import ClientView from "./users/view";
import Author from "./author/";
import EditAuthor from "./author/update_info";
import AddAuthor from "./author/create";
import Book from "./book";
import EditBook from "./book/update_info/index";
import AddBook from "./book/create";
import Report from "./reports";
import ViewReport from "./reports/view";

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
          <Route path="author/add" element={<AddAuthor />} />

          <Route path="book" element={<Book />} />
          <Route path="book/edit/:id" element={<EditBook />} />
          <Route path="book/add" element={<AddBook />} />
          
          <Route path="reports" element={<Report />} />
          <Route path="reports/view/:id" element={<ViewReport />} />
          <Route path="book/add" element={<AddBook />} />

          <Route path="genre" element={<Genre />} />
          <Route path="genre/add" element={<AddGenre />} />
          <Route
            path="genre/edit/:id"
            element={<EditGenre />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
