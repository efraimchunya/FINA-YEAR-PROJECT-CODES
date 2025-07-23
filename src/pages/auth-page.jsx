// src/pages/AuthPage.jsx
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { MapPin, Waves, Users, Shield } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs";
import { LoginForm } from "../components/LoginForm";
import { SignupForm } from "../components/SignupForm";

export default function AuthPage() {
  const navigate = useNavigate();
  const user = null; // optional: useAuth()

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div className="text-center lg:text-left space-y-6">
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <MapPin className="h-10 w-10 text-ocean-blue" />
            <h1 className="text-4xl font-bold text-gray-900">Zanzibar Explorer</h1>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Discover Paradise in Every Corner
            </h2>
            <p className="text-lg text-slate-text">
              Explore pristine beaches, rich cultural heritage, and historical wonders.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 bg-white/50 rounded-lg p-4">
              <Waves className="h-8 w-8 text-ocean-blue" />
              <div>
                <h3 className="font-semibold">Pristine Beaches</h3>
                <p className="text-sm text-slate-text">Crystal clear waters</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-white/50 rounded-lg p-4">
              <Users className="h-8 w-8 text-coral" />
              <div>
                <h3 className="font-semibold">Rich Culture</h3>
                <p className="text-sm text-slate-text">Heritage sites</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-white/50 rounded-lg p-4">
              <Shield className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold">Safe Tourism</h3>
                <p className="text-sm text-slate-text">Trusted platform</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Login and Signup */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
              <CardDescription>Sign in or create your account</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="register">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login"><LoginForm /></TabsContent>
                <TabsContent value="register"><SignupForm /></TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
