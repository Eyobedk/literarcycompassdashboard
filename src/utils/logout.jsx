import { useNavigate } from "react-router-dom";
import cookiejs from 'cookiejs';

const Logout = () => {
  const navigate = useNavigate();

  // clear the local storage
  localStorage.removeItem("admin");
  cookiejs.remove("admin");
  // navigate user to login
  navigate("/login");
};

export default Logout;
