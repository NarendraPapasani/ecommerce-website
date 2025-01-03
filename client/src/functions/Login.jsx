import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import exp from "constants";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const jwt = Cookies.get("jwt");
  const navigate = useNavigate();

  const [usernameError, setUsernameError] = useState({
    status: false,
    message: "",
  });
  const [passwordError, setPasswordError] = useState({
    status: false,
    message: "",
  });

  const handleUsername = (event) => setUsername(event.target.value);
  const handlePassword = (event) => setPassword(event.target.value);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoaded(true);
    if (username === "") {
      return setUsernameError({ status: true, message: "*username is empty" });
      isLoaded(false);
    } else {
      setUsernameError({ status: false, message: "" });
    }
    if (password === "") {
      return setPasswordError({ status: true, message: "*password is empty" });
      isLoaded(false);
    } else {
      setPasswordError({ status: false, message: "" });
    }
    if (username && password) {
      try {
        const response = await axios.post(
          "https://ecommerce-website-crkh.onrender.com/api/auth/login",
          {
            email: username,
            password,
          }
        );
        if (response.status === 200) {
          setIsLoaded(false);
          toast.success(response.data.msg);
          Cookies.set("jwt", response.data.token, { expires: 1 });
          toast.success("Login successful");
          navigate("/");
        } else {
          setIsLoaded(false);
          toast.error(response.data.msg);
        }
      } catch (error) {
        setIsLoaded(false);
        toast.error(error.response.data.msg);
      }
    }
  };
  return (
    <form
      className="rounded-md border border-input bg-transparent px-3 py-10"
      onSubmit={handleSubmit}
    >
      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-left font-semibold text-white mb-2 italic"
        >
          Username/Email
        </label>
        <Input
          type="text"
          placeholder="Enter here..."
          id="username"
          className="w-full p-2 h-11"
          onChange={handleUsername}
        />
        {usernameError.status && (
          <p className="text-red-500 text-sm mt-1">{usernameError.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-left font-semibold text-white mb-2 italic"
        >
          Password
        </label>
        {showPassword ? (
          <Input
            type="text"
            placeholder="Password"
            id="password"
            className="w-full p-2 h-11"
            onChange={handlePassword}
          />
        ) : (
          <Input
            type="password"
            placeholder="Password"
            id="password"
            className="w-full p-2 h-11"
            onChange={handlePassword}
          />
        )}
        {passwordError.status && (
          <p className="text-red-500 text-sm mt-1">{passwordError.message}</p>
        )}
        <div className="flex items-center space-x-2 mt-2">
          <Checkbox
            id="terms"
            className="border-white"
            onCheckedChange={handleShowPassword}
            checked={showPassword}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 italic"
          >
            Show Password
          </label>
        </div>
      </div>
      <Button
        className="w-full mt-4 bg-white h-11 text-black hover:text-white font-semibold"
        type="submit"
      >
        {isLoaded ? (
          <RotatingLines
            visible={true}
            height="102"
            width="102"
            color="blue"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        ) : (
          "Login"
        )}
      </Button>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition:Bounce
      />
    </form>
  );
};
export default LoginForm;
