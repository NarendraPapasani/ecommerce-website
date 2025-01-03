import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/functions/Login";
import Signup from "@/functions/Signup";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  const jwt = Cookies.get("jwt");
  if (jwt) {
    navigate("/");
  }
  return (
    <div className="flex flex-col md:flex-row justify-around items-center min-h-screen p-4 md:p-0">
      <div className="mb-5 md:mb-0">
        <img
          src="https://res.cloudinary.com/dlxhrbeyr/image/upload/v1732606345/3D_logo_with_a_trolley_containing_daily_needs_such_as_electronics__clothes__groceries-removebg-preview_jswt9g.png"
          alt="logo"
          className="w-40 h-40 md:w-72 md:h-72"
        />
      </div>
      <div className="w-full md:w-[500px]">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="w-full h-14 mb-5 bg-slate-300">
            <TabsTrigger value="login" className="w-1/2 h-12">
              Login
            </TabsTrigger>
            <TabsTrigger value="Signup" className="w-1/2 h-12">
              Sign up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="text-slate-300">
            <LoginForm />
          </TabsContent>
          <TabsContent value="Signup" className="text-slate-300">
            <Signup />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
