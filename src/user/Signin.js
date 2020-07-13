import React, { useState } from "react";
import Base from "../core/Base";
import { Link, Redirect } from "react-router-dom";
import { signin, authenticate, isAuthenticated } from "../auth/helper";

const Signin = () => {

  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
    didRedirect: false
  });

  const { email, password, error, loading, didRedirect } = values;
  const { user } = isAuthenticated();
  const handleChange = name => event => {
    setValues({ ...values, error: false, [name]: event.target.value })
  }

  const onSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, error: false, loading: true })
    signin({ email, password })
      .then(data => {
        if (data.error || data.errormsg) {
          setValues({ ...values, error: data.error || data.errormsg, loading: false })
        } else {
          console.log("in else")
          authenticate(data, () => {
            setValues({
              ...values,
              didRedirect: true
            })
          })

        }
      })
      .catch(err => console.log("Error in sign in"))
  }

  const performRedirect = () => {
    if (didRedirect) {
      if (user && user.role == 1) {
        return <Redirect to='admin/dashboard' />
      }
      else {
        return <Redirect to='user/dashboard' />
      }
    }
    if (isAuthenticated()) {
      return <Redirect to="/" />
      // return <p>is authenticated</p>
    }
  }

  const signInForm = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <form>
            <div className="form-group">
              <label className="text-light">Email</label>
              <input className="form-control" type="email" onChange={handleChange("email")} value={email} />
            </div>

            <div className="form-group">
              <label className="text-light">Password</label>
              <input className="form-control" type="password" onChange={handleChange("password")} value={password} required />
            </div>
            <button className="btn btn-success btn-block" onClick={onSubmit}>Submit</button>
          </form>
        </div>
      </div>
    );
  };


  const loadingMessage = () => {
    return (
      loading && (
        <div className="alert alert-info">
          <h2>
            Loading...
        </h2>
        </div>
      )
    );
  };

  const errorMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
          >
            {error}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Base title="Sign In page" description="A page for user to sign in!">
      {loadingMessage()}
      {errorMessage()}
      {signInForm()}
      {performRedirect()}
    </Base>
  );
};

export default Signin;
