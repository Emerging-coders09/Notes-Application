import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../Css/Login&Sign.css";
import { useDispatch, useSelector } from "react-redux";
import {  loginUser } from "../redux/reducers/authReducer";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const User = {
    email : values.email,
    password : values.password
  }

  const userId = useSelector((state)=> state.auth.user)

  const handleLogin = () => {
    if (!values.email || !values.password) {
      return toast.error("Please fill all fields");
    }
    try {
       dispatch(loginUser(User));
      // const data = await window.api.login({
      //   email: values.email,
      //   password: values.password,
      // });
      console.log(userId)
      if (userId) {
        toast.success("Login Successfully");
        navigate("/notes");
      } else {
        toast.error(userId.error || "User not Found");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="box">
        <div className="header">
          <h1 className="text-3xl font-semibold text-gray-800">NoteApp</h1>
          <p className="text-gray-500 text-sm">Organize your thoughts</p>
        </div>

        <div className="fields">
          <div className="field">
            <label className="text-sm text-gray-600">Email</label>
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
              placeholder="Enter your password"
              className=""
              required
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
            />
          </div>

          <button className="" onClick={handleLogin}>
            Log In
          </button>
        </div>

        <p className="footer">
          Don’t have an account?{" "}
          <button
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/sign")}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
