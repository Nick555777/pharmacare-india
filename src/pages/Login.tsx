import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, User, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "SRI" && password === "Dhanvantari1025") {
      localStorage.setItem("pharma_auth", "true");
      onLogin();
      navigate("/");
      toast({ title: "Welcome, SRI", description: "Login successful." });
    } else {
      toast({ title: "Login failed", description: "Invalid credentials.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
      <Card className="w-full max-w-md shadow-2xl border-none">
        <CardHeader className="text-center space-y-1">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-2">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">PharmaCare India</CardTitle>
          <CardDescription>Enter your credentials to access the clinic system</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="username" 
                  placeholder="SRI" 
                  className="pl-10" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full font-bold h-11">Login to System</Button>
          </CardFooter>
        </form>
      </Card>
      <div className="absolute bottom-4 text-xs text-muted-foreground font-medium">
        © 2026 PharmaCare India Management System
      </div>
    </div>
  );
};

export default Login;
