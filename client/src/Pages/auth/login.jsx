import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ShoppingBag,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  AlertCircle,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Github,
  Chrome,
  Calendar,
  MapPin,
  Heart,
  Shirt,
  Laptop,
  Home,
  Gamepad2,
  Coffee,
  Gift,
  Trophy,
  Book,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";

const Login = () => {
  const navigate = useNavigate();
  const jwt = Cookies.get("jwt1");

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    showPassword: false,
    rememberMe: false,
  });

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    emailVerificationCode: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    country: "",
    favoriteCategory: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
    agreeTerms: false,
    agreeMarketing: false,
  });

  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);

  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [googleSignInAttempted, setGoogleSignInAttempted] = useState(false);
  const [googleSignInTimeout, setGoogleSignInTimeout] = useState(null);

  // Product categories for selection
  const productCategories = [
    { value: "clothes", label: "Clothes & Fashion", icon: Shirt },
    { value: "electronics", label: "Electronics", icon: Laptop },
    { value: "shoes", label: "Shoes & Footwear", icon: Trophy },
    { value: "furniture", label: "Furniture & Home", icon: Home },
    { value: "miscellaneous", label: "Miscellaneous", icon: Gift },
  ];

  // Redirect if already logged in
  useEffect(() => {
    if (jwt) {
      navigate("/");
    }
  }, [jwt, navigate]);

  // Initialize Google Sign-In when component mounts
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      console.log("Attempting to initialize Google Sign-In...");
      console.log("Window.google:", window.google);

      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id:
              "621881246603-3rb6oj2s5t1btoqukvr6cbirh0umuh26.apps.googleusercontent.com",
            callback: handleGoogleResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          console.log("Google Sign-In initialized successfully");
        } catch (error) {
          console.error("Error initializing Google Sign-In:", error);
        }
      } else {
        console.log(
          "Google Identity Services not yet loaded, retrying in 500ms..."
        );
        setTimeout(initializeGoogleSignIn, 500); // Retry after 500ms
      }
    };

    // Check if the script is already loaded
    const checkGoogleScript = () => {
      const script = document.querySelector(
        'script[src*="accounts.google.com/gsi/client"]'
      );
      console.log("Google script element found:", !!script);

      if (script) {
        script.addEventListener("load", () => {
          console.log("Google script loaded successfully");
          setTimeout(initializeGoogleSignIn, 100);
        });

        // If script is already loaded
        if (script.readyState === "complete" || window.google?.accounts?.id) {
          setTimeout(initializeGoogleSignIn, 100);
        }
      } else {
        console.error("Google Identity Services script not found in DOM");
      }
    };

    // Wait a bit for the DOM to be ready, then check
    setTimeout(checkGoogleScript, 500);
  }, []);

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (googleSignInTimeout) {
        clearTimeout(googleSignInTimeout);
      }
    };
  }, [googleSignInTimeout]);

  // Handle login form changes
  const handleLoginChange = (field, value) => {
    setLoginForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle signup form changes
  const handleSignupChange = (field, value) => {
    setSignupForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Validate email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validate password strength
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Handle Google Response
  const handleGoogleResponse = async (response) => {
    try {
      // Clear the timeout since user completed sign-in
      if (googleSignInTimeout) {
        clearTimeout(googleSignInTimeout);
        setGoogleSignInTimeout(null);
      }

      setLoginLoading(true);

      // Decode the JWT token from Google
      const credential = response.credential;
      const payload = JSON.parse(atob(credential.split(".")[1]));

      const googleUserData = {
        email: payload.email,
        name: payload.name,
        googleId: payload.sub,
        profilePicture: payload.picture,
      };

      // Send to backend
      const authResponse = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/google-auth`,
        googleUserData
      );

      if (authResponse.status === 200 || authResponse.status === 201) {
        const token = authResponse.data.token;
        Cookies.set("jwt1", token, { expires: 30 });

        if (authResponse.data.isNewUser) {
          toast.success(
            "Welcome! Your account has been created with Google. Please complete your profile."
          );
        } else {
          toast.success("Welcome back! Google sign-in successful");
        }

        navigate("/");
      }
    } catch (error) {
      console.error("Google auth error:", error);
      if (error.response?.status === 400) {
        const errorMessage =
          error.response.data?.msg || "Google authentication failed";
        toast.error(errorMessage);
      } else {
        toast.error("Google sign-in failed. Please try again.");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // Reset Google Sign-In state
  const resetGoogleSignIn = () => {
    console.log("Resetting Google Sign-In state...");
    setGoogleSignInAttempted(false);

    // Clear any existing Google state
    if (window.google?.accounts?.id) {
      try {
        if (window.google.accounts.id.cancel) {
          window.google.accounts.id.cancel();
        }
        // Reinitialize to clear state
        window.google.accounts.id.initialize({
          client_id:
            "460843361659-gs5r2qdheickk0lmsmggnp19fsvv8jli.apps.googleusercontent.com",
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        console.log("Google Sign-In state reset successfully");
        toast.info("Google Sign-In reset. You can try again now.");
      } catch (error) {
        console.error("Error resetting Google Sign-In:", error);
      }
    }
  };

  // Send email verification code
  const sendEmailVerification = async () => {
    if (!signupForm.email || !validateEmail(signupForm.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email first",
      }));
      return;
    }

    setVerificationLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/send-verification`,
        { email: signupForm.email }
      );
      setEmailVerificationSent(true);
      setErrors((prev) => ({ ...prev, email: "" })); // Clear email errors
      toast.success("Verification code sent to your email!");
    } catch (error) {
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.msg || "";
        if (
          errorMessage.toLowerCase().includes("email already exists") ||
          errorMessage.toLowerCase().includes("already registered")
        ) {
          setErrors((prev) => ({
            ...prev,
            email: "This email is already registered",
          }));
          toast.error("This email is already registered");
        } else {
          setErrors((prev) => ({ ...prev, email: errorMessage }));
          toast.error(errorMessage);
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          email: "Failed to send verification code",
        }));
        toast.error("Failed to send verification code. Please try again.");
      }
    } finally {
      setVerificationLoading(false);
    }
  };

  // Verify email code
  const verifyEmailCode = async () => {
    if (!signupForm.emailVerificationCode) {
      setErrors((prev) => ({
        ...prev,
        emailVerificationCode: "Please enter verification code",
      }));
      return;
    }

    setVerificationLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-email`,
        {
          email: signupForm.email,
          code: signupForm.emailVerificationCode,
        }
      );
      setEmailVerified(true);
      setErrors((prev) => ({ ...prev, emailVerificationCode: "" })); // Clear verification errors
      toast.success("Email verified successfully!");
    } catch (error) {
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.msg || "";
        if (
          errorMessage.toLowerCase().includes("invalid code") ||
          errorMessage.toLowerCase().includes("incorrect code") ||
          errorMessage.toLowerCase().includes("wrong code")
        ) {
          setErrors((prev) => ({
            ...prev,
            emailVerificationCode: "Invalid verification code",
          }));
          toast.error("Invalid verification code. Please try again.");
        } else if (
          errorMessage.toLowerCase().includes("expired") ||
          errorMessage.toLowerCase().includes("code has expired")
        ) {
          setErrors((prev) => ({
            ...prev,
            emailVerificationCode: "Verification code has expired",
          }));
          toast.error(
            "Verification code has expired. Please request a new one."
          );
        } else {
          setErrors((prev) => ({
            ...prev,
            emailVerificationCode: errorMessage,
          }));
          toast.error(errorMessage);
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          emailVerificationCode: "Failed to verify code",
        }));
        toast.error("Failed to verify code. Please try again.");
      }
    } finally {
      setVerificationLoading(false);
    }
  };

  // Handle login submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!loginForm.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(loginForm.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!loginForm.password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear any previous errors before attempting login
    setErrors({});
    setLoginLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        {
          email: loginForm.email,
          password: loginForm.password,
        }
      );

      if (response.status === 200) {
        const token = response.data.token;
        Cookies.set("jwt1", token, { expires: loginForm.rememberMe ? 30 : 1 });
        toast.success("Welcome back! Login successful");
        navigate("/");
      }
    } catch (error) {
      // Handle specific error cases
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.msg || "";

        // Check for specific error messages and set field-specific errors
        if (
          errorMessage.toLowerCase().includes("user not found") ||
          errorMessage.toLowerCase().includes("email not found") ||
          errorMessage.toLowerCase().includes("account does not exist")
        ) {
          setErrors({ email: "No account found with this email address" });
        } else if (
          errorMessage.toLowerCase().includes("invalid password") ||
          errorMessage.toLowerCase().includes("incorrect password") ||
          errorMessage.toLowerCase().includes("wrong password")
        ) {
          setErrors({ password: "Incorrect password. Please try again." });
        } else if (
          errorMessage.toLowerCase().includes("invalid credentials") ||
          errorMessage.toLowerCase().includes("authentication failed")
        ) {
          setErrors({
            email: "Invalid email or password",
            password: "Invalid email or password",
          });
        } else {
          // Generic validation error
          setErrors({ general: errorMessage });
          toast.error(errorMessage);
        }
      } else if (error.response?.status === 401) {
        // Unauthorized - invalid credentials
        setErrors({
          email: "Invalid email or password",
          password: "Invalid email or password",
        });
        toast.error(
          "Invalid email or password. Please check your credentials."
        );
      } else if (error.response?.status === 404) {
        // User not found
        setErrors({ email: "No account found with this email address" });
        toast.error("No account found with this email address");
      } else if (error.response?.status === 429) {
        // Too many attempts
        setErrors({
          general: "Too many login attempts. Please try again later.",
        });
        toast.error("Too many login attempts. Please try again later.");
      } else if (error.response?.status >= 500) {
        // Server error
        setErrors({ general: "Server error. Please try again later." });
        toast.error("Server error. Please try again later.");
      } else {
        // Network or other errors
        const errorMessage =
          error.response?.data?.msg ||
          "Login failed. Please check your connection and try again.";
        setErrors({ general: errorMessage });
        toast.error(errorMessage);
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = () => {
    console.log("Google Sign-In button clicked");

    // Set loading state when user clicks Google Sign-In
    setLoginLoading(true);

    // Clear any existing timeout
    if (googleSignInTimeout) {
      clearTimeout(googleSignInTimeout);
    }

    // Set a timeout to stop loading if user doesn't complete sign-in within 30 seconds
    const timeoutId = setTimeout(() => {
      console.log("Google Sign-In timeout - stopping loading state");
      setLoginLoading(false);
      setGoogleSignInTimeout(null);
    }, 30000); // 30 seconds timeout

    setGoogleSignInTimeout(timeoutId);

    // Check if Google Identity Services is available
    if (typeof window !== "undefined" && window.google?.accounts?.id) {
      try {
        console.log("Google Identity Services available, initializing...");

        // Initialize Google Sign-In with modern approach
        window.google.accounts.id.initialize({
          client_id: `${import.meta.env.VITE_GOOGLE_CLIENT_ID}`,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: true, // Use modern FedCM when available
        });

        // Use the prompt method for better user experience
        window.google.accounts.id.prompt((notification) => {
          console.log("Prompt notification:", notification);

          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log("Prompt not displayed, using popup fallback...");

            // Fallback to popup method
            const tempContainer = document.createElement("div");
            tempContainer.id = "temp-google-signin";
            tempContainer.style.position = "absolute";
            tempContainer.style.top = "-9999px";
            tempContainer.style.left = "-9999px";
            tempContainer.style.visibility = "hidden";
            tempContainer.style.width = "1px";
            tempContainer.style.height = "1px";
            document.body.appendChild(tempContainer);

            // Render the Google button with modern styling
            window.google.accounts.id.renderButton(tempContainer, {
              theme: "outline",
              size: "large",
              type: "standard",
              shape: "rectangular",
              text: "signin_with",
              logo_alignment: "left",
              width: 300,
              click_listener: () => {
                console.log("Google button clicked via listener");
              },
            });

            // Programmatically trigger the button
            setTimeout(() => {
              const googleButton =
                tempContainer.querySelector('div[role="button"]');
              if (googleButton) {
                console.log("Triggering Google Sign-In...");
                googleButton.click();
              } else {
                console.warn(
                  "Google button not found, trying alternative method..."
                );
                // Alternative: use the prompt again
                window.google.accounts.id.prompt();
              }

              // Clean up
              setTimeout(() => {
                if (document.body.contains(tempContainer)) {
                  document.body.removeChild(tempContainer);
                }
              }, 1000);
            }, 100);
          } else {
            // If prompt was displayed successfully, stop loading here as well
            // The actual loading will continue in handleGoogleResponse
            console.log("Google Sign-In prompt displayed successfully");
          }
        });
      } catch (error) {
        console.error("Google Sign-In initialization error:", error);
        toast.error("Google Sign-In failed to initialize. Please try again.");
        // Stop loading on error and clear timeout
        setLoginLoading(false);
        if (googleSignInTimeout) {
          clearTimeout(googleSignInTimeout);
          setGoogleSignInTimeout(null);
        }
      }
    } else {
      console.error("Google Identity Services not loaded");
      toast.error(
        "Google Sign-In is not available. Please reload the page and try again."
      );
      // Stop loading if Google Services not available and clear timeout
      setLoginLoading(false);
      if (googleSignInTimeout) {
        clearTimeout(googleSignInTimeout);
        setGoogleSignInTimeout(null);
      }
    }
  };

  // Handle signup submit
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!signupForm.firstName) newErrors.firstName = "First name is required";
    if (!signupForm.lastName) newErrors.lastName = "Last name is required";

    if (!signupForm.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(signupForm.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!emailVerified) {
      newErrors.emailVerificationCode = "Please verify your email address";
    }

    if (!signupForm.phone) {
      newErrors.phone = "Phone number is required";
    } else if (signupForm.phone.length < 10) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!signupForm.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }

    if (!signupForm.gender) {
      newErrors.gender = "Please select your gender";
    }

    if (!signupForm.favoriteCategory) {
      newErrors.favoriteCategory =
        "Please select your favorite product category";
    }

    if (!signupForm.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(signupForm.password)) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!signupForm.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and conditions";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSignupLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`,
        {
          firstName: signupForm.firstName,
          lastName: signupForm.lastName,
          email: signupForm.email,
          phone: signupForm.phone,
          dateOfBirth: signupForm.dateOfBirth,
          gender: signupForm.gender,
          address: signupForm.address,
          city: signupForm.city,
          country: signupForm.country,
          favoriteCategory: signupForm.favoriteCategory,
          password: signupForm.password,
          agreeMarketing: signupForm.agreeMarketing,
        }
      );

      if (response.status === 201) {
        toast.success(
          "Account created successfully! Please login to continue."
        );
        // Reset form and switch to login tab
        setSignupForm({
          firstName: "",
          lastName: "",
          email: "",
          emailVerificationCode: "",
          phone: "",
          dateOfBirth: "",
          gender: "",
          address: "",
          city: "",
          country: "",
          favoriteCategory: "",
          password: "",
          confirmPassword: "",
          showPassword: false,
          showConfirmPassword: false,
          agreeTerms: false,
          agreeMarketing: false,
        });
        setEmailVerificationSent(false);
        setEmailVerified(false);
        setErrors({}); // Clear any errors after successful signup
      }
    } catch (error) {
      // Handle specific signup errors
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.msg || "";

        if (
          errorMessage.toLowerCase().includes("email already exists") ||
          errorMessage.toLowerCase().includes("user already exists") ||
          errorMessage.toLowerCase().includes("email is already registered")
        ) {
          setErrors({ email: "An account with this email already exists" });
          toast.error("An account with this email already exists");
        } else if (
          errorMessage.toLowerCase().includes("phone number already exists") ||
          errorMessage.toLowerCase().includes("phone already registered")
        ) {
          setErrors({ phone: "This phone number is already registered" });
          toast.error("This phone number is already registered");
        } else {
          setErrors({ general: errorMessage });
          toast.error(errorMessage);
        }
      } else if (error.response?.status === 422) {
        // Validation errors
        const errorMessage =
          error.response.data?.msg ||
          "Please check your information and try again";
        setErrors({ general: errorMessage });
        toast.error(errorMessage);
      } else if (error.response?.status >= 500) {
        // Server error
        setErrors({ general: "Server error. Please try again later." });
        toast.error("Server error. Please try again later.");
      } else {
        const errorMessage =
          error.response?.data?.msg || "Signup failed. Please try again.";
        setErrors({ general: errorMessage });
        toast.error(errorMessage);
      }
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 relative overflow-hidden">
      {/* Animated Background Elements - only visible on larger screens */}

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen lg:overflow-hidden">
        {/* Left Side - Branding - Only visible on desktop */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-16 text-left lg:sticky lg:top-0 lg:h-screen">
          {/* Logo and Brand */}
          <div className="mb-12">
            <div className="flex items-center justify-start mb-6">
              <div className="relative">
                <ShoppingBag className="w-20 h-20 text-blue-500 animate-pulse" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping"></div>
              </div>
              <div className="ml-4">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  BlinkShop
                </h1>
                <p className="text-slate-400 text-xl font-medium">
                  Your Ultimate Shopping Destination
                </p>
              </div>
            </div>

            <div className="space-y-4 max-w-md">
              <h2 className="text-3xl font-bold text-white">
                Welcome to the Future of Shopping
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed">
                Discover amazing products, enjoy seamless shopping experience,
                and get your favorites delivered in a blink!
              </p>

              {/* Feature highlights */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300 text-sm">Fast Delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300 text-sm">Secure Payment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300 text-sm">Best Prices</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300 text-sm">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Logo - Only visible on mobile */}
        <div className="flex lg:hidden justify-center items-center pt-8 pb-4">
          <div className="flex items-center">
            <div className="relative">
              <ShoppingBag className="w-12 h-12 text-blue-500" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping"></div>
            </div>
            <div className="ml-3">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                BlinkShop
              </h1>
            </div>
          </div>
        </div>

        {/* Auth Forms - Full width on mobile */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-2 lg:p-10 lg:min-h-screen">
          <Card className="w-full lg:min-w-[500px] max-w-xl bg-slate-900/80 backdrop-blur-xl border-slate-700/50 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">
                  Welcome
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Sign in to your account or create a new one
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-700/50 sticky top-0 z-10">
                  <TabsTrigger
                    value="login"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                {/* Login Form */}
                <TabsContent value="login" className="space-y-6 mt-6">
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="login-email"
                        className="text-slate-200 flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        Email Address
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginForm.email}
                        onChange={(e) =>
                          handleLoginChange("email", e.target.value)
                        }
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500"
                      />
                      {errors.email && (
                        <Alert className="bg-red-900/20 border-red-500/50">
                          <AlertCircle className="h-4 w-4 text-red-400" />
                          <AlertDescription className="text-red-400">
                            {errors.email}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="login-password"
                        className="text-slate-200 flex items-center gap-2"
                      >
                        <Lock className="w-4 h-4" />
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={loginForm.showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={loginForm.password}
                          onChange={(e) =>
                            handleLoginChange("password", e.target.value)
                          }
                          className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                          onClick={() =>
                            handleLoginChange(
                              "showPassword",
                              !loginForm.showPassword
                            )
                          }
                        >
                          {loginForm.showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      {errors.password && (
                        <Alert className="bg-red-900/20 border-red-500/50">
                          <AlertCircle className="h-4 w-4 text-red-400" />
                          <AlertDescription className="text-red-400">
                            {errors.password}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember-me"
                          checked={loginForm.rememberMe}
                          onCheckedChange={(checked) =>
                            handleLoginChange("rememberMe", checked)
                          }
                          className="border-slate-600 data-[state=checked]:bg-blue-600"
                        />
                        <Label
                          htmlFor="remember-me"
                          className="text-sm text-slate-300"
                        >
                          Remember me
                        </Label>
                      </div>
                      <Button
                        variant="link"
                        className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                      >
                        Forgot password?
                      </Button>
                    </div>

                    {/* General error display */}
                    {errors.general && (
                      <Alert className="bg-red-900/20 border-red-500/50">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <AlertDescription className="text-red-400">
                          {errors.general}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11"
                      disabled={loginLoading}
                    >
                      {loginLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Signing in...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          Sign In
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </form>

                  <div className="relative">
                    <Separator className="bg-slate-700" />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-4 text-slate-400 text-sm">
                      Or continue with
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loginLoading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-sm text-gray-700 font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      {loginLoading ? "Signing in..." : "Continue with Google"}
                    </span>
                  </button>

                  {/* Reset Google Sign-In link */}
                  <div className="text-center">
                    <Button
                      variant="link"
                      className="text-xs text-slate-400 hover:text-blue-400 p-0 h-auto"
                      onClick={resetGoogleSignIn}
                    >
                      Trouble with Google Sign-In? Reset and try again
                    </Button>
                  </div>
                </TabsContent>

                {/* Signup Form */}
                <TabsContent
                  value="signup"
                  className="space-y-6 mt-6 max-h-[65vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900"
                >
                  <form onSubmit={handleSignupSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name" className="text-slate-200">
                          First Name
                        </Label>
                        <Input
                          id="first-name"
                          type="text"
                          placeholder="John"
                          value={signupForm.firstName}
                          onChange={(e) =>
                            handleSignupChange("firstName", e.target.value)
                          }
                          className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500"
                        />
                        {errors.firstName && (
                          <p className="text-red-400 text-sm">
                            {errors.firstName}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="last-name" className="text-slate-200">
                          Last Name
                        </Label>
                        <Input
                          id="last-name"
                          type="text"
                          placeholder="Doe"
                          value={signupForm.lastName}
                          onChange={(e) =>
                            handleSignupChange("lastName", e.target.value)
                          }
                          className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500"
                        />
                        {errors.lastName && (
                          <p className="text-red-400 text-sm">
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="signup-email"
                        className="text-slate-200 flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        Email Address
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="john.doe@example.com"
                          value={signupForm.email}
                          onChange={(e) =>
                            handleSignupChange("email", e.target.value)
                          }
                          disabled={emailVerificationSent || emailVerified}
                          className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500 flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={sendEmailVerification}
                          disabled={
                            verificationLoading ||
                            emailVerificationSent ||
                            emailVerified
                          }
                          className="border-slate-600 text-slate-300 hover:bg-slate-700 px-3"
                        >
                          {verificationLoading ? (
                            <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-200 rounded-full animate-spin"></div>
                          ) : emailVerified ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            "Verify"
                          )}
                        </Button>
                      </div>
                      {errors.email && (
                        <Alert className="bg-red-900/20 border-red-500/50">
                          <AlertCircle className="h-4 w-4 text-red-400" />
                          <AlertDescription className="text-red-400">
                            {errors.email}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* Email Verification Code */}
                    {emailVerificationSent && !emailVerified && (
                      <div className="space-y-2">
                        <Label
                          htmlFor="verification-code"
                          className="text-slate-200"
                        >
                          Email Verification Code
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="verification-code"
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={signupForm.emailVerificationCode}
                            onChange={(e) =>
                              handleSignupChange(
                                "emailVerificationCode",
                                e.target.value
                              )
                            }
                            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500 flex-1"
                            maxLength={6}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={verifyEmailCode}
                            disabled={
                              verificationLoading ||
                              !signupForm.emailVerificationCode
                            }
                            className="border-slate-600 text-slate-300 hover:bg-slate-700 px-3"
                          >
                            {verificationLoading ? (
                              <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-200 rounded-full animate-spin"></div>
                            ) : (
                              "Verify"
                            )}
                          </Button>
                        </div>
                        {errors.emailVerificationCode && (
                          <p className="text-red-400 text-sm">
                            {errors.emailVerificationCode}
                          </p>
                        )}
                        <p className="text-slate-400 text-xs">
                          Check your email for the verification code. Didn't
                          receive it?{" "}
                          <Button
                            variant="link"
                            className="text-blue-400 hover:text-blue-300 p-0 h-auto text-xs underline"
                            onClick={sendEmailVerification}
                          >
                            Resend
                          </Button>
                        </p>
                      </div>
                    )}

                    {emailVerified && (
                      <Alert className="bg-green-900/20 border-green-500/50">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <AlertDescription className="text-green-400">
                          Email verified successfully!
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-slate-200 flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={signupForm.phone}
                        onChange={(e) =>
                          handleSignupChange("phone", e.target.value)
                        }
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500"
                      />
                      {errors.phone && (
                        <p className="text-red-400 text-sm">{errors.phone}</p>
                      )}
                    </div>

                    {/* Personal Information */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="date-of-birth"
                          className="text-slate-200 flex items-center gap-2"
                        >
                          <Calendar className="w-4 h-4" />
                          Date of Birth
                        </Label>
                        <Input
                          id="date-of-birth"
                          type="date"
                          value={signupForm.dateOfBirth}
                          onChange={(e) =>
                            handleSignupChange("dateOfBirth", e.target.value)
                          }
                          className="bg-slate-800/50 border-slate-700 text-white focus:border-blue-500"
                        />
                        {errors.dateOfBirth && (
                          <p className="text-red-400 text-sm">
                            {errors.dateOfBirth}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender" className="text-slate-200">
                          Gender
                        </Label>
                        <Select
                          value={signupForm.gender}
                          onValueChange={(value) =>
                            handleSignupChange("gender", value)
                          }
                        >
                          <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem
                              value="male"
                              className="text-white hover:bg-slate-700"
                            >
                              Male
                            </SelectItem>
                            <SelectItem
                              value="female"
                              className="text-white hover:bg-slate-700"
                            >
                              Female
                            </SelectItem>
                            <SelectItem
                              value="other"
                              className="text-white hover:bg-slate-700"
                            >
                              Other
                            </SelectItem>
                            <SelectItem
                              value="prefer-not-to-say"
                              className="text-white hover:bg-slate-700"
                            >
                              Prefer not to say
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.gender && (
                          <p className="text-red-400 text-sm">
                            {errors.gender}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="address"
                        className="text-slate-200 flex items-center gap-2"
                      >
                        <MapPin className="w-4 h-4" />
                        Address (Optional)
                      </Label>
                      <Textarea
                        id="address"
                        placeholder="Enter your full address"
                        value={signupForm.address}
                        onChange={(e) =>
                          handleSignupChange("address", e.target.value)
                        }
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500 resize-none"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-slate-200">
                          City (Optional)
                        </Label>
                        <Input
                          id="city"
                          type="text"
                          placeholder="Your city"
                          value={signupForm.city}
                          onChange={(e) =>
                            handleSignupChange("city", e.target.value)
                          }
                          className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-slate-200">
                          Country (Optional)
                        </Label>
                        <Select
                          value={signupForm.country}
                          onValueChange={(value) =>
                            handleSignupChange("country", value)
                          }
                        >
                          <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem
                              value="us"
                              className="text-white hover:bg-slate-700"
                            >
                              United States
                            </SelectItem>
                            <SelectItem
                              value="ca"
                              className="text-white hover:bg-slate-700"
                            >
                              Canada
                            </SelectItem>
                            <SelectItem
                              value="uk"
                              className="text-white hover:bg-slate-700"
                            >
                              United Kingdom
                            </SelectItem>
                            <SelectItem
                              value="in"
                              className="text-white hover:bg-slate-700"
                            >
                              India
                            </SelectItem>
                            <SelectItem
                              value="au"
                              className="text-white hover:bg-slate-700"
                            >
                              Australia
                            </SelectItem>
                            <SelectItem
                              value="de"
                              className="text-white hover:bg-slate-700"
                            >
                              Germany
                            </SelectItem>
                            <SelectItem
                              value="fr"
                              className="text-white hover:bg-slate-700"
                            >
                              France
                            </SelectItem>
                            <SelectItem
                              value="other"
                              className="text-white hover:bg-slate-700"
                            >
                              Other
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Favorite Product Category */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="favorite-category"
                        className="text-slate-200 flex items-center gap-2"
                      >
                        <Heart className="w-4 h-4" />
                        Favorite Product Category
                      </Label>
                      <Select
                        value={signupForm.favoriteCategory}
                        onValueChange={(value) =>
                          handleSignupChange("favoriteCategory", value)
                        }
                      >
                        <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                          <SelectValue placeholder="What do you love to shop for?" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {productCategories.map((category) => {
                            const IconComponent = category.icon;
                            return (
                              <SelectItem
                                key={category.value}
                                value={category.value}
                                className="text-white hover:bg-slate-700"
                              >
                                <div className="flex items-center gap-2">
                                  <IconComponent className="w-4 h-4" />
                                  {category.label}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      {errors.favoriteCategory && (
                        <p className="text-red-400 text-sm">
                          {errors.favoriteCategory}
                        </p>
                      )}
                      <p className="text-slate-400 text-xs">
                        This helps us personalize your shopping experience
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="signup-password"
                        className="text-slate-200 flex items-center gap-2"
                      >
                        <Lock className="w-4 h-4" />
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={signupForm.showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={signupForm.password}
                          onChange={(e) =>
                            handleSignupChange("password", e.target.value)
                          }
                          className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                          onClick={() =>
                            handleSignupChange(
                              "showPassword",
                              !signupForm.showPassword
                            )
                          }
                        >
                          {signupForm.showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      {errors.password && (
                        <p className="text-red-400 text-sm">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="confirm-password"
                        className="text-slate-200 flex items-center gap-2"
                      >
                        <Lock className="w-4 h-4" />
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={
                            signupForm.showConfirmPassword ? "text" : "password"
                          }
                          placeholder="Confirm your password"
                          value={signupForm.confirmPassword}
                          onChange={(e) =>
                            handleSignupChange(
                              "confirmPassword",
                              e.target.value
                            )
                          }
                          className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                          onClick={() =>
                            handleSignupChange(
                              "showConfirmPassword",
                              !signupForm.showConfirmPassword
                            )
                          }
                        >
                          {signupForm.showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-400 text-sm">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="agree-terms"
                          checked={signupForm.agreeTerms}
                          onCheckedChange={(checked) =>
                            handleSignupChange("agreeTerms", checked)
                          }
                          className="border-slate-600 data-[state=checked]:bg-blue-600 mt-1"
                        />
                        <Label
                          htmlFor="agree-terms"
                          className="text-sm text-slate-300 leading-relaxed"
                        >
                          I agree to the{" "}
                          <Button
                            variant="link"
                            className="text-blue-400 hover:text-blue-300 p-0 h-auto text-sm underline"
                          >
                            Terms of Service
                          </Button>{" "}
                          and{" "}
                          <Button
                            variant="link"
                            className="text-blue-400 hover:text-blue-300 p-0 h-auto text-sm underline"
                          >
                            Privacy Policy
                          </Button>
                        </Label>
                      </div>
                      {errors.agreeTerms && (
                        <Alert className="bg-red-900/20 border-red-500/50">
                          <AlertCircle className="h-4 w-4 text-red-400" />
                          <AlertDescription className="text-red-400">
                            {errors.agreeTerms}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* Marketing Preferences */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="marketing"
                          checked={signupForm.agreeMarketing}
                          onCheckedChange={(checked) =>
                            handleSignupChange("agreeMarketing", checked)
                          }
                          className="border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <Label
                          htmlFor="marketing"
                          className="text-slate-300 text-sm flex items-center gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          I'd like to receive emails about special offers and
                          new arrivals
                        </Label>
                      </div>
                      <p className="text-slate-400 text-xs pl-6">
                        You can unsubscribe at any time. We respect your
                        privacy.
                      </p>
                    </div>

                    {/* General error display for signup */}
                    {errors.general && (
                      <Alert className="bg-red-900/20 border-red-500/50">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <AlertDescription className="text-red-400">
                          {errors.general}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11"
                      disabled={signupLoading || !emailVerified}
                    >
                      {signupLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Creating account...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          Create Account
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </form>

                  <div className="relative">
                    <Separator className="bg-slate-700" />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-4 text-slate-400 text-sm">
                      Or sign up with
                    </span>
                  </div>

                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={loginLoading}
                      className="flex items-center justify-center w-full gap-3 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-sm text-gray-700 font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span className="text-sm font-medium">
                        {loginLoading ? "Signing in..." : "Google"}
                      </span>
                    </button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
