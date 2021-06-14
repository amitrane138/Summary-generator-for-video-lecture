import { Button } from "@material-ui/core";
import React from "react";
import bg3 from "../../assets/bg3.jpeg";
import { useLocalContext } from "../../context/context";
import "./style.css";
const Login = () => {
  const { login, loggedInUser } = useLocalContext();

  console.log(loggedInUser);
  return (
    <div className="login">
      <img className="login__logo" src={bg3} alt="Classroom" />

      <Button className="login_btn" variant="contained" color="default" onClick={() => login()}>
        Login Now!
      </Button>
    </div>
  );
};

export default Login;
