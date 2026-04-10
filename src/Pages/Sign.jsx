import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../Css/Login&Sign.css";
import { useDispatch, useSelector } from "react-redux";
import { CheckUserExist, RegisterUser } from "../redux/reducers/authReducer";

const Sign = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const user = {
    name : values.name ,
    email : values.email,
    password : values.password ,
  }

  const userId = useSelector((state)=> state.auth.user)

  const handleRegister = () => {
    try {
      if (values.password !== values.confirmPassword)
        return toast.error("Passowrd and Confirm Password doesn't match");

      
      // const User = await window.api.getuser({ email: values.email });

      console.log(userId)

      if (userId) {
        return toast.error("User Already Exists");
      }
      dispatch(RegisterUser(user))

      console.log(userId)
      // const register = await window.api.register({
      //   name: values.name,
      //   email: values.email,
      //   password: values.password,
      // });


      // if (register.success) {
      //   toast.success("Register Successfully");
      //   navigate("/");
      // } else {
      //   toast.error(register.error);
      // }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="box">
        <div className="header">
          <h1 className="">Create Account</h1>
          <p className="">Start organizing your notes</p>
        </div>

        <div className="fields">
          <div className="field">
            <label className="">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className=""
              required
              onChange={(e) => setValues({ ...values, name: e.target.value })}
            />
          </div>

          <div className="field">
            <label className="">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className=""
              required
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </div>

          <div className="field">
            <label className="">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              className=""
              required
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
            />
          </div>

          <div className="field">
            <label className="">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              className=""
              required
              onChange={(e) =>
                setValues({ ...values, confirmPassword: e.target.value })
              }
            />
          </div>

          <button className="" onClick={handleRegister}>
            Sign Up
          </button>
        </div>

        <p className="footer">
          Already have an account?
          <button className="" onClick={() => navigate("/")}>
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Sign;
