
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { checkDatabaseConnection } from '@/services/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const { login, isAuthenticated, isLoading, error } = useAuth();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await checkDatabaseConnection();
        setDbStatus(isConnected ? 'connected' : 'disconnected');
      } catch (error) {
        setDbStatus('disconnected');
      }
    };
    
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-primary/5 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
      </div>
      
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span className="text-sm">Database:</span>
        {dbStatus === 'checking' && (
          <div className="h-3 w-3 rounded-full bg-yellow-400 animate-pulse" />
        )}
        {dbStatus === 'connected' && (
          <div className="h-3 w-3 rounded-full bg-green-500" />
        )}
        {dbStatus === 'disconnected' && (
          <div className="h-3 w-3 rounded-full bg-red-500" />
        )}
        <span className="text-sm capitalize">{dbStatus}</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="glass shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Admin Dashboard</CardTitle>
            <CardDescription>Log in to access the dashboard</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-2 rounded">
                  {error}
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                <p>Default admin credentials:</p>
                <p>Email: admin@example.com</p>
                <p>Password: admin123</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;


