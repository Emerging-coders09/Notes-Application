import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../Css/Login&Sign.css";
import { useDispatch } from "react-redux";
import { RegisterUser } from "../redux/reducers/authReducer";
import "bootstrap/dist/css/bootstrap.min.css";

const Sign = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  let [error, setError] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    error: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const User = {
    name: values.name,
    email: values.email,
    password: values.password,
  };

  useEffect(() => {
    let newError = {};

    if (!values.name) {
      newError.name = "Name is required";
    } else if (values.name.length < 3) {
      newError.name = "Minimum 3 charachter";
    }

    if (!values.password) {
      newError.password = "Password is required";
    } else if (values.password.length < 6) {
      newError.password = "Minimum 6 chatacter required";
    }

    if (!values.email) {
      newError.email = "Email is required";
    } else if (!values.email.includes("@")) {
      newError.email = "Enter valid email";
    }

    if (values.confirmPassword !== values.password) {
      newError.confirmPassword = "Password doesn't match";
    }

    setError(newError);
  }, [values]);

  const handleRegister = async (e) => {
    e.preventDefault()

    
    if (
      !values.name ||
      !values.email ||
      !values.password ||
      !values.confirmPassword
    ) {
      setTouched({
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
      });
      return;
    }

    try {
      if (values.password !== values.confirmPassword)
        return toast.error("Passowrd and Confirm Password doesn't match");

      const register = await window.api.register({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      if (register.success) {
        toast.success("Register Successfully");
        dispatch(RegisterUser(User));
        navigate("/");
      } else {
        toast.error(register.error || "User Already Exists");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const navigateLogin = ()=>{
    navigate("/")
  }

  return (
    <form className="container-login" onSubmit={handleRegister}>
      <div className="box">
        <div className="header">
          <h1 className="">Create Account</h1>
          <p className="">Start organizing your notes</p>
        </div>

        <div className="fields">
          <div className="">
            <div className="form-floating">
              <input
                type="text"
                className={`form-control ${touched.name && error?.name ? 'is-invalid' : '' }`}
                name="name"
                id="name"
                placeholder="Name"
                onChange={(e) => setValues({ ...values, name: e.target.value })}
              />
              <label htmlFor="name">Name</label>
            </div>
            {touched?.name && error?.name && (
              <div className="text-danger small">{error.name}</div>
            )}
          </div>
          <div className="">
            <div className="form-floating">
              <input
                type="email"
                className={`form-control ${touched.email && error?.email ? 'is-invalid' : '' }`}
                name="email"
                id="email"
                placeholder="Email"
                onChange={(e) =>
                  setValues({ ...values, email: e.target.value })
                }
              />
              <label htmlFor="email">Email</label>
            </div>
            {touched?.email && error?.email && (
              <div className="text-danger small mb-2">{error.email}</div>
            )}
          </div>
          <div className="">
            <div className="form-floating">
              <input
                type="password"
                className={`form-control ${touched.password && error?.password ? 'is-invalid' : '' }`}
                name="password"
                id="password"
                placeholder="password"
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
          <div className="">
            <div className="form-floating">
              <input
                type="password"
                className={`form-control ${touched.confirmPassword && error?.confirmPassword ? 'is-invalid' : '' }`}
                name="ConfirmPassword"
                id="ConfirmPassword"
                placeholder="ConfirmPassword"
                onChange={(e) =>
                  setValues({ ...values, confirmPassword: e.target.value })
                }
              />
              <label htmlFor="ConfirmPassword">ConfirmPassword</label>
            </div>
            {touched?.confirmPassword && error?.confirmPassword && (
              <div className="text-danger small mb-2">{error.confirmPassword}</div>
            )}
          </div>

          <button className="" type="submit">
            Sign Up
          </button>
        </div>

        <p className="footer">
          Already have an account?
          <button className="" onClick={navigateLogin}>
            Log in
          </button>
        </p>
      </div>
    </form>
  );
};

export default Sign;
