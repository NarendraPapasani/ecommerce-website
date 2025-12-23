import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { adminAuthService } from '../../services/adminService';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { toast } from '../../hooks/use-toast';
import { Loader2, Shield } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await adminAuthService.login(data.email, data.password);
      
      if (response.success) {
        toast({
          title: "Login successful",
          description: `Welcome back, ${response.admin.firstName}!`,
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md mx-auto p-6">
        <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Admin Portal
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Sign in to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-200">Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="admin@example.com"
                          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-200">Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Enter your password"
                          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-zinc-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <div className="text-center mt-6 text-zinc-500 text-sm">
          <p>Admin access only. Unauthorized access is prohibited.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;