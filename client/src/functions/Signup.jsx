import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const navigate = useNavigate();

  const [emailError, setEmailError] = useState({ status: false, message: "" });
  const [usernameError, setUsernameError] = useState({
    status: false,
    message: "",
  });
  const [passwordError, setPasswordError] = useState({
    status: false,
    message: "",
  });
  const [confirmPasswordError, setConfirmPasswordError] = useState({
    status: false,
    message: "",
  });
  const [firstNameError, setFirstNameError] = useState({
    status: false,
    message: "",
  });
  const [lastNameError, setLastNameError] = useState({
    status: false,
    message: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoaded(true);
    if (email === "") {
      return setEmailError({ status: true, message: "*email is empty" });
      setIsLoaded(false);
    } else {
      setEmailError({ status: false, message: "" });
    }
    if (username === "") {
      return setUsernameError({ status: true, message: "*username is empty" });
      setIsLoaded(false);
    } else {
      setUsernameError({ status: false, message: "" });
    }
    if (password === "") {
      return setPasswordError({ status: true, message: "*password is empty" });
      setIsLoaded(false);
    } else {
      setPasswordError({ status: false, message: "" });
    }
    if (confirmPassword === "") {
      return setConfirmPasswordError({
        status: true,
        message: "*confirm password is empty",
      });
      setIsLoaded(false);
    } else {
      setConfirmPasswordError({ status: false, message: "" });
    }
    if (firstName === "") {
      return setFirstNameError({
        status: true,
        message: "*first name is empty",
      });
      setIsLoaded(false);
    } else {
      setFirstNameError({ status: false, message: "" });
    }
    if (lastName === "") {
      return setLastNameError({ status: true, message: "*last name is empty" });
      setIsLoaded(false);
    } else {
      setLastNameError({ status: false, message: "" });
    }

    if (password !== confirmPassword) {
      return setConfirmPasswordError({
        status: true,
        message: "*passwords do not match",
      });
      setIsLoaded(false);
    } else {
      setConfirmPasswordError({ status: false, message: "" });
    }

    try {
      if (
        email &&
        username &&
        password &&
        confirmPassword &&
        firstName &&
        lastName
      ) {
        const resp = await axios.post(
          "https://ecommerce-website-crkh.onrender.com/api/auth/signup",
          {
            email,
            username,
            password,
            firstName,
            lastName,
          }
        );
        if (resp.status === 201) {
          toast.success("User created successfully");
          setIsLoaded(false);
          navigate("/my-profile");
        } else {
          toast.error(resp.data.msg);
          setIsLoaded(false);
        }
      }
    } catch (error) {
      setIsLoaded(false);
      toast.error(error.response.data.msg);
    }
  };

  return (
    <form
      className="rounded-md border border-input bg-transparent px-3 py-10"
      onSubmit={handleSubmit}
    >
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-left font-semibold text-white mb-2"
        >
          Email
        </label>
        <Input
          type="email"
          placeholder="Email"
          id="email"
          className="w-full p-2 h-11"
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError.status && (
          <p className="text-red-500 text-sm mt-1">{emailError.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-left font-semibold text-white mb-2"
        >
          Username
        </label>
        <Input
          type="text"
          placeholder="Username"
          id="username"
          className="w-full p-2 h-11"
          onChange={(e) => setUsername(e.target.value)}
        />
        {usernameError.status && (
          <p className="text-red-500 text-sm mt-1">{usernameError.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-left font-semibold text-white mb-2"
        >
          Password
        </label>
        <Input
          type="password"
          placeholder="Password"
          id="password"
          className="w-full p-2 h-11 mb-2"
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError.status && (
          <p className="text-red-500 text-sm mt-1">{passwordError.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="confirmPassword"
          className="block text-left font-semibold text-white mb-2"
        >
          Confirm Password
        </label>
        <Input
          type="password"
          placeholder="Confirm Password"
          id="confirmPassword"
          className="w-full p-2 h-11"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {confirmPasswordError.status && (
          <p className="text-red-500 text-sm mt-1">
            {confirmPasswordError.message}
          </p>
        )}
      </div>
      <div className="flex">
        <div className="w-1/2">
          <label
            htmlFor="fn"
            className="block text-left font-semibold text-white mb-2"
          >
            First Name
          </label>
          <Input
            type="text"
            placeholder="First Name"
            className="p-2 h-11"
            id="fn"
            onChange={(e) => setFirstName(e.target.value)}
          />
          {firstNameError.status && (
            <p className="text-red-500 text-sm mt-1">
              {firstNameError.message}
            </p>
          )}
        </div>
        <div className="w-1/2">
          <label
            htmlFor="ln"
            className="block text-left font-semibold text-white mb-2"
          >
            Last Name
          </label>
          <Input
            type="text"
            placeholder="Last Name"
            className="p-2 h-11 mr-1"
            id="ln"
            onChange={(e) => setLastName(e.target.value)}
          />
          {lastNameError.status && (
            <p className="text-red-500 text-sm mt-1">{lastNameError.message}</p>
          )}
        </div>
      </div>
      <Button
        className="w-full mt-4 bg-white h-11 text-black hover:text-white font-semibold"
        type="submit"
      >
        Sign Up
      </Button>
      <ToastContainer />
    </form>
  );
};

export default Signup;
