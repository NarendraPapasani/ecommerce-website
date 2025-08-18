import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useToast } from "@/hooks/use-toast";
import ProfileSkeleton from "@/Pages/skeletons/ProfileSkeleton";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Globe,
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Settings,
  Shield,
  Bell,
  Edit3,
  Save,
  X,
  Camera,
  Eye,
  EyeOff,
  Award,
  Clock,
  TrendingUp,
  Trash2,
  Key,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

const OldProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);

  // Dialog states
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);

  // Loading states
  const [changingPassword, setChangingPassword] = useState(false);
  const [changingEmail, setChangingEmail] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const [user, setUser] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [activityLog, setActivityLog] = useState([]);
  const [formData, setFormData] = useState({});

  // Form data states
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });

  const [emailData, setEmailData] = useState({
    newEmail: "",
    password: "",
  });

  const [otpData, setOtpData] = useState({
    otp: "",
    email: "",
  });

  const [deleteAccountData, setDeleteAccountData] = useState({
    password: "",
    confirmText: "",
  });

  const jwt = Cookies.get("jwt1");

  useEffect(() => {
    if (!jwt) {
      navigate("/login");
      return;
    }
    fetchUserProfile();
    fetchUserStatistics();
    fetchActivityLog();
  }, [jwt, navigate]);

  const getCurrentUserId = () => {
    try {
      if (!jwt) return null;
      const decoded = jwtDecode(jwt);
      return decoded.userId;
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };

  const fetchUserProfile = async () => {
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/profile/${userId}`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
          withCredentials: true,
        }
      );

      setUser(response.data.user);
      setFormData(response.data.user);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
      });
      setLoading(false);
    }
  };

  const fetchUserStatistics = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/statistics`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
          withCredentials: true,
        }
      );
      setStatistics(response.data.statistics);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const fetchActivityLog = async () => {
    try {
      // Mock activity log - you can implement this in backend
      const mockActivities = [
        {
          id: 1,
          action: "Profile Updated",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          details: "Updated personal information",
          type: "profile",
        },
        {
          id: 2,
          action: "Password Changed",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          details: "Password was changed successfully",
          type: "security",
        },
        {
          id: 3,
          action: "Login",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          details: "Logged in from Chrome on Windows",
          type: "auth",
        },
        {
          id: 4,
          action: "Email Verified",
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          details: "Email address was verified",
          type: "security",
        },
      ];
      setActivityLog(mockActivities);
    } catch (error) {
      console.error("Error fetching activity log:", error);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/profile`,
        formData,
        {
          headers: { Authorization: `Bearer ${jwt}` },
          withCredentials: true,
        }
      );

      setUser(response.data.user);
      setEditMode(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
        className: "bg-green-600 border-green-600 text-white",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.response?.data?.msg || "Failed to update profile",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
      });
      return;
    }

    setChangingPassword(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${jwt}` },
          withCredentials: true,
        }
      );

      toast({
        title: "Success",
        description: "Password changed successfully",
        className: "bg-green-600 border-green-600 text-white",
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        showCurrentPassword: false,
        showNewPassword: false,
        showConfirmPassword: false,
      });
      setShowPasswordDialog(false);
    } catch (error) {
      console.error("Error changing password:", error);
      toast({
        title: "Error",
        description: error.response?.data?.msg || "Failed to change password",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!emailData.newEmail || !emailData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
      });
      return;
    }

    setChangingEmail(true);
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/auth/send-email-change-verification`,
        {
          newEmail: emailData.newEmail,
          password: emailData.password,
        },
        {
          headers: { Authorization: `Bearer ${jwt}` },
          withCredentials: true,
        }
      );

      toast({
        title: "Success",
        description: "Verification code sent to your new email",
        className: "bg-green-600 border-green-600 text-white",
      });

      setOtpData({ ...otpData, email: emailData.newEmail });
      setShowEmailDialog(false);
      setShowOtpDialog(true);
    } catch (error) {
      console.error("Error sending email verification:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.msg || "Failed to send verification code",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
      });
    } finally {
      setChangingEmail(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpData.otp) {
      toast({
        title: "Error",
        description: "Please enter the verification code",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
      });
      return;
    }

    setVerifyingOtp(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-email-change`,
        {
          email: otpData.email,
          otp: otpData.otp,
        },
        {
          headers: { Authorization: `Bearer ${jwt}` },
          withCredentials: true,
        }
      );

      toast({
        title: "Success",
        description: "Email changed successfully",
        className: "bg-green-600 border-green-600 text-white",
      });

      setOtpData({ otp: "", email: "" });
      setEmailData({ newEmail: "", password: "" });
      setShowOtpDialog(false);
      fetchUserProfile(); // Refresh profile data
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast({
        title: "Error",
        description: error.response?.data?.msg || "Failed to verify code",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
      });
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteAccountData.confirmText !== "DELETE") {
      toast({
        title: "Error",
        description: "Please type 'DELETE' to confirm",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
      });
      return;
    }

    if (!deleteAccountData.password) {
      toast({
        title: "Error",
        description: "Please enter your password",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
      });
      return;
    }

    setDeletingAccount(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/delete-account`,
        {
          data: { password: deleteAccountData.password },
          headers: { Authorization: `Bearer ${jwt}` },
          withCredentials: true,
        }
      );

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted",
        className: "bg-green-600 border-green-600 text-white",
      });

      Cookies.remove("jwt1");
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description: error.response?.data?.msg || "Failed to delete account",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
      });
    } finally {
      setDeletingAccount(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "profile":
        return <User className="h-4 w-4 text-blue-400" />;
      case "security":
        return <Shield className="h-4 w-4 text-green-400" />;
      case "auth":
        return <Key className="h-4 w-4 text-purple-400" />;
      default:
        return <Activity className="h-4 w-4 text-slate-200" />;
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Profile Header */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Avatar Section */}
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-blue-500/20 transition-all group-hover:border-blue-500/40">
                  <AvatarImage
                    src={
                      user?.profilePicture || "https://github.com/shadcn.png"
                    }
                    alt="Profile"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-2xl">
                    {getInitials(user?.firstName, user?.lastName)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <Badge
                    variant="outline"
                    className="border-green-500 text-green-400 w-fit"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>

                <p className="text-slate-200 text-lg mb-6 max-w-md">
                  {user?.bio ||
                    "Welcome to your profile! Update your information to get the most out of your experience."}
                </p>

                <div className="flex flex-wrap gap-6 text-sm text-slate-200">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-400" />
                    {user?.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-green-400" />
                    {user?.phone || "Not provided"}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-purple-400" />
                    {user?.city || "Location not set"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-400" />
                    Member since {formatDate(user?.createdAt)}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {statistics?.totalLogins || 0}
                  </div>
                  <div className="text-xs text-slate-200 uppercase tracking-wide">
                    Total Logins
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">12</div>
                  <div className="text-xs text-slate-200 uppercase tracking-wide">
                    Orders
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">3</div>
                  <div className="text-xs text-slate-200 uppercase tracking-wide">
                    Reviews
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-slate-800/50 border-slate-700 mb-8 h-auto p-1 gap-1">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-blue-600 text-xs lg:text-sm py-2 lg:py-3 px-2 lg:px-4 h-auto"
            >
              <User className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Profile</span>
              <span className="sm:hidden">Info</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-green-600 text-xs lg:text-sm py-2 lg:py-3 px-2 lg:px-4 h-auto"
            >
              <Shield className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Security</span>
              <span className="sm:hidden">Sec</span>
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="data-[state=active]:bg-purple-600 text-xs lg:text-sm py-2 lg:py-3 px-2 lg:px-4 h-auto"
            >
              <Settings className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Preferences</span>
              <span className="sm:hidden">Prefs</span>
            </TabsTrigger>
            <TabsTrigger
              value="danger"
              className="data-[state=active]:bg-red-600 text-xs lg:text-sm py-2 lg:py-3 px-2 lg:px-4 h-auto"
            >
              <AlertTriangle className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Danger Zone</span>
              <span className="sm:hidden">Danger</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-400" />
                    Personal Information
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditMode(!editMode)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {editMode ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Edit3 className="h-4 w-4" />
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-slate-300">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        disabled={!editMode}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-slate-300">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        disabled={!editMode}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio" className="text-slate-300">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      value={formData.bio || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      disabled={!editMode}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="occupation" className="text-slate-300">
                        Occupation
                      </Label>
                      <Input
                        id="occupation"
                        value={formData.occupation || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            occupation: e.target.value,
                          })
                        }
                        disabled={!editMode}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company" className="text-slate-300">
                        Company
                      </Label>
                      <Input
                        id="company"
                        value={formData.company || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                        disabled={!editMode}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="favoriteCategory"
                      className="text-slate-300"
                    >
                      Favorite Category
                    </Label>
                    <Select
                      value={formData.favoriteCategory || ""}
                      onValueChange={(value) =>
                        setFormData({ ...formData, favoriteCategory: value })
                      }
                      disabled={!editMode}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue
                          placeholder="Select a category"
                          className="text-white"
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        <SelectItem
                          value="electronics"
                          className="text-white hover:bg-slate-700"
                        >
                          Electronics
                        </SelectItem>
                        <SelectItem
                          value="clothing"
                          className="text-white hover:bg-slate-700"
                        >
                          Clothing
                        </SelectItem>
                        <SelectItem
                          value="shoes"
                          className="text-white hover:bg-slate-700"
                        >
                          Shoes
                        </SelectItem>
                        <SelectItem
                          value="furniture"
                          className="text-white hover:bg-slate-700"
                        >
                          Furniture
                        </SelectItem>
                        <SelectItem
                          value="miscellaneous"
                          className="text-white hover:bg-slate-700"
                        >
                          Miscellaneous
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {editMode && (
                    <Button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Phone className="h-5 w-5 text-green-400" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="text-slate-300">
                      Email Address
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="email"
                        value={user?.email || ""}
                        disabled
                        className="bg-slate-700 border-slate-600 text-white flex-1"
                      />
                      <Dialog
                        open={showEmailDialog}
                        onOpenChange={setShowEmailDialog}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-600 text-blue-400"
                          >
                            Change
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800 border-slate-700">
                          <DialogHeader>
                            <DialogTitle className="text-white">
                              Change Email Address
                            </DialogTitle>
                            <DialogDescription className="text-slate-200">
                              Enter your new email address and current password
                              to continue.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label
                                htmlFor="newEmail"
                                className="text-slate-300"
                              >
                                New Email
                              </Label>
                              <Input
                                id="newEmail"
                                type="email"
                                value={emailData.newEmail}
                                onChange={(e) =>
                                  setEmailData({
                                    ...emailData,
                                    newEmail: e.target.value,
                                  })
                                }
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor="emailPassword"
                                className="text-slate-300"
                              >
                                Current Password
                              </Label>
                              <Input
                                id="emailPassword"
                                type="password"
                                value={emailData.password}
                                onChange={(e) =>
                                  setEmailData({
                                    ...emailData,
                                    password: e.target.value,
                                  })
                                }
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={handleChangeEmail}
                              disabled={changingEmail}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              {changingEmail ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Sending...
                                </>
                              ) : (
                                "Send Verification Code"
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-slate-300">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      disabled={!editMode}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-slate-300">
                        City
                      </Label>
                      <Input
                        id="city"
                        value={formData.city || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        disabled={!editMode}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country" className="text-slate-300">
                        Country
                      </Label>
                      <Input
                        id="country"
                        value={formData.country || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, country: e.target.value })
                        }
                        disabled={!editMode}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Password Management */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Key className="h-5 w-5 text-green-400" />
                    Password & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Password</h4>
                      <p className="text-slate-200 text-sm">
                        Last changed 30 days ago
                      </p>
                    </div>
                    <Dialog
                      open={showPasswordDialog}
                      onOpenChange={setShowPasswordDialog}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="border-green-600 text-green-400"
                        >
                          Change Password
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-800 border-slate-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">
                            Change Password
                          </DialogTitle>
                          <DialogDescription className="text-slate-200">
                            Enter your current password and choose a new one.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label
                              htmlFor="currentPassword"
                              className="text-slate-300"
                            >
                              Current Password
                            </Label>
                            <div className="relative">
                              <Input
                                id="currentPassword"
                                type={
                                  passwordData.showCurrentPassword
                                    ? "text"
                                    : "password"
                                }
                                value={passwordData.currentPassword}
                                onChange={(e) =>
                                  setPasswordData({
                                    ...passwordData,
                                    currentPassword: e.target.value,
                                  })
                                }
                                className="bg-slate-700 border-slate-600 text-white pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                                onClick={() =>
                                  setPasswordData({
                                    ...passwordData,
                                    showCurrentPassword:
                                      !passwordData.showCurrentPassword,
                                  })
                                }
                              >
                                {passwordData.showCurrentPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label
                              htmlFor="newPassword"
                              className="text-slate-300"
                            >
                              New Password
                            </Label>
                            <div className="relative">
                              <Input
                                id="newPassword"
                                type={
                                  passwordData.showNewPassword
                                    ? "text"
                                    : "password"
                                }
                                value={passwordData.newPassword}
                                onChange={(e) =>
                                  setPasswordData({
                                    ...passwordData,
                                    newPassword: e.target.value,
                                  })
                                }
                                className="bg-slate-700 border-slate-600 text-white pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                                onClick={() =>
                                  setPasswordData({
                                    ...passwordData,
                                    showNewPassword:
                                      !passwordData.showNewPassword,
                                  })
                                }
                              >
                                {passwordData.showNewPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label
                              htmlFor="confirmPassword"
                              className="text-slate-300"
                            >
                              Confirm New Password
                            </Label>
                            <div className="relative">
                              <Input
                                id="confirmPassword"
                                type={
                                  passwordData.showConfirmPassword
                                    ? "text"
                                    : "password"
                                }
                                value={passwordData.confirmPassword}
                                onChange={(e) =>
                                  setPasswordData({
                                    ...passwordData,
                                    confirmPassword: e.target.value,
                                  })
                                }
                                className="bg-slate-700 border-slate-600 text-white pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                                onClick={() =>
                                  setPasswordData({
                                    ...passwordData,
                                    showConfirmPassword:
                                      !passwordData.showConfirmPassword,
                                  })
                                }
                              >
                                {passwordData.showConfirmPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            onClick={handleChangePassword}
                            disabled={changingPassword}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            {changingPassword ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Changing...
                              </>
                            ) : (
                              "Change Password"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-medium">
                        Two-Factor Authentication
                      </h4>
                      <Badge
                        variant="outline"
                        className="border-orange-500 text-orange-400"
                      >
                        Coming Soon
                      </Badge>
                    </div>
                    <p className="text-slate-200 text-sm">
                      Add an extra layer of security to your account with 2FA.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Account Statistics */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                    Account Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">
                        {statistics?.totalLogins || 0}
                      </div>
                      <div className="text-slate-200 text-sm">Total Logins</div>
                    </div>
                    <div className="p-4 bg-green-600/10 border border-green-500/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">
                        {statistics?.lastLogin
                          ? formatDate(statistics.lastLogin)
                          : "Never"}
                      </div>
                      <div className="text-slate-200 text-sm">Last Login</div>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-600/10 border border-purple-500/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">
                      {statistics?.memberSince
                        ? formatDate(statistics.memberSince)
                        : "Unknown"}
                    </div>
                    <div className="text-slate-200 text-sm">Member Since</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="h-5 w-5 text-purple-400" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-400" />
                        Email Notifications
                      </h4>
                      <p className="text-slate-300 text-sm mt-1">
                        Receive email updates about your account
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-400" />
                        Marketing Communications
                      </h4>
                      <p className="text-slate-300 text-sm mt-1">
                        Receive promotional emails and offers
                      </p>
                    </div>
                    <Switch checked={user?.agreeMarketing} />
                  </div>
                </div>

                <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4 text-orange-400" />
                        SMS Notifications
                      </h4>
                      <p className="text-slate-300 text-sm mt-1">
                        Receive important updates via SMS
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium flex items-center gap-2">
                        <Shield className="h-4 w-4 text-red-400" />
                        Security Alerts
                      </h4>
                      <p className="text-slate-300 text-sm mt-1">
                        Get notified about security events
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Danger Zone Tab */}
          <TabsContent value="danger">
            <Card className="bg-red-950/20 border-red-500/20">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-red-500/20 bg-red-950/20">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300">
                    These actions are permanent and cannot be undone. Please
                    proceed with caution.
                  </AlertDescription>
                </Alert>

                <div className="p-6 border border-red-500/20 rounded-lg bg-red-950/10">
                  <h3 className="text-red-400 font-semibold mb-2">
                    Delete Account
                  </h3>
                  <p className="text-slate-200 text-sm mb-4">
                    Permanently delete your account and all associated data.
                    This action cannot be reversed.
                  </p>

                  <AlertDialog
                    open={showDeleteDialog}
                    onOpenChange={setShowDeleteDialog}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-800 border-slate-700">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-400">
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-200">
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <div className="space-y-4">
                        <div>
                          <Label
                            htmlFor="deletePassword"
                            className="text-slate-300"
                          >
                            Enter your password to confirm
                          </Label>
                          <Input
                            id="deletePassword"
                            type="password"
                            value={deleteAccountData.password}
                            onChange={(e) =>
                              setDeleteAccountData({
                                ...deleteAccountData,
                                password: e.target.value,
                              })
                            }
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="deleteConfirm"
                            className="text-slate-300"
                          >
                            Type "DELETE" to confirm
                          </Label>
                          <Input
                            id="deleteConfirm"
                            value={deleteAccountData.confirmText}
                            onChange={(e) =>
                              setDeleteAccountData({
                                ...deleteAccountData,
                                confirmText: e.target.value,
                              })
                            }
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                      </div>

                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-slate-600 text-slate-300 hover:bg-slate-700">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          disabled={deletingAccount}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          {deletingAccount ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            "Delete Account"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* OTP Verification Dialog */}
        <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                Verify Email Change
              </DialogTitle>
              <DialogDescription className="text-slate-200">
                We've sent a verification code to {otpData.email}. Please enter
                it below.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="otp" className="text-slate-300">
                  Verification Code
                </Label>
                <Input
                  id="otp"
                  value={otpData.otp}
                  onChange={(e) =>
                    setOtpData({ ...otpData, otp: e.target.value })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter 6-digit code"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleVerifyOtp}
                disabled={verifyingOtp}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {verifyingOtp ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default OldProfile;
