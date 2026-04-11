import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../Css/Login&Sign.css";
import { useDispatch, useSelector } from "react-redux";
import { login, LoginUser } from "../redux/reducers/authReducer";
import { getNotes } from "../redux/reducers/notesReducer";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const loginUser = useSelector((state)=> state.auth.user)

  useEffect(()=>{
    if(loginUser?.id){
      GetNotes(loginUser.id)
      console.log(loginUser)
    }
  }, [loginUser])

  const handleLogin = async () => {
    if (!values.email || !values.password) {
      return toast.error("Please fill all fields");
    }
    try {
      const res = await window.api.login({email : values.email , password : values.password})

      if(res.success){
        dispatch(LoginUser(res.data))
        dispatch(login())
         toast.success("Login Successfully")
         GetNotes(res.data.id) 
         navigate("/notes");
      } else {
        toast.error("User not found")
      }
    } catch (error) {
      console.log(error)
    }
  };

  const GetNotes = async (user)=>{
    try {
      const res = await window.api.getNotes({user_id : user})
      if(res.success){
        dispatch(getNotes(res.data))
      }else {
        console.log(res.error)
      }
    } catch (error) {
      console.error(error) 
    }
  }

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
