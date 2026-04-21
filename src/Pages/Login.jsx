import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { login, LoginUser } from "../redux/reducers/authReducer";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Css/Login&Sign.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  let [error, setError] = useState({
    email : '',
    password : '',
    error : ''
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  useEffect(() => {
    let newError = {}

    if (!values.email) {
      newError.email = "Email is required";
    } else if (!values.email.includes("@")) {
      newError.email = "Enter valid email";
    }

    if (!values.password) {
      newError.password = "Password is required";
    }
    setError(newError);
  }, [values]);

  const handleLogin = async (e) => {
    e.preventDefault() ;

    if (!values.email || !values.password) {
      setTouched({
        email: true,
        password: true,
      });
      return;
    }
    try {
      const res = await window.api.login({
        email: values.email,
        password: values.password,
      });

      if (res.success) {
        dispatch(LoginUser(res.data));
        dispatch(login());
        toast.success("Login Successfully");
        navigate("/notes");
      } else {
        toast.error(res.error);
        
      }
    } catch (error) {
      console.log(error);
    }
  };

  const navigateSign = ()=>{
    navigate("/sign")
  }

  return (
    
    <div className="container-login">
      <form className="box" onSubmit={handleLogin}>
        <div className="header">
          <h1 className="text-3xl font-semibold text-gray-800">NoteApp</h1>
          <p className="text-gray-500 text-sm">Organize your thoughts</p>
        </div>

        <div className="fields">
          <div className="">
            <div className="form-floating ">
              <input
                type="email"
                className={`form-control ${touched.email && error?.email ? "is-invalid" : ""}`}
                name="email"
                id="email"
                placeholder="name@example.com"
                onChange={(e) =>
                  setValues({ ...values, email: e.target.value })
                }
              />
              <label htmlFor="email">Email</label>
            </div>
            {touched?.email && error?.email && (
              <div className="text-danger small mb-2">{error?.email}</div>
            )}
          </div>
          <div className="">
            <div className="form-floating ">
              <input
                type="password"
                className={`form-control ${touched.password && error?.password ? "is-invalid" : ""}`}
                name="password"
                id="password"
                placeholder="******"
                onChange={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
              />
              <label htmlFor="password">Password</label>
            </div>
            {touched?.password && error?.password && (
              <div className="text-danger small mb-2">{error.password}</div>
            )}
          </div>


          <button className="" type="submit">
            Log In
          </button>
        </div>

        <p className="footer">
          Don’t have an account?{" "}
          <button
            className="text-blue-500 cursor-pointer"
            onClick={navigateSign}
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
