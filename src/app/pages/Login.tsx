import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Plane } from 'lucide-react';

interface LoginProps {
  onLogin: (role: 'guest' | 'agency' | 'admin') => void;
}

export default function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'guest' | 'agency' | 'admin'>('guest');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole);
    
    // Navigate based on role
    if (selectedRole === 'guest') {
      navigate('/guest/dashboard');
    } else if (selectedRole === 'agency') {
      navigate('/agency/review');
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-blue-500 p-3">
              <Plane className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl">Travella</CardTitle>
          <CardDescription>Travel Management System</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={selectedRole} onValueChange={(v) => setSelectedRole(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="guest">Guest</TabsTrigger>
              <TabsTrigger value="agency">Agency</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            
            <TabsContent value="guest" className="space-y-4 mt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="guest-email">Email</Label>
                  <Input id="guest-email" type="email" placeholder="guest@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guest-password">Password</Label>
                  <Input id="guest-password" type="password" placeholder="••••••••" required />
                </div>
                <Button type="submit" className="w-full">Sign In as Guest</Button>
              </form>
            </TabsContent>
            
            <TabsContent value="agency" className="space-y-4 mt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="agency-email">Email</Label>
                  <Input id="agency-email" type="email" placeholder="expert@agency.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agency-password">Password</Label>
                  <Input id="agency-password" type="password" placeholder="••••••••" required />
                </div>
                <Button type="submit" className="w-full">Sign In as Expert</Button>
              </form>
            </TabsContent>
            
            <TabsContent value="admin" className="space-y-4 mt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input id="admin-email" type="email" placeholder="admin@travella.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input id="admin-password" type="password" placeholder="••••••••" required />
                </div>
                <Button type="submit" className="w-full">Sign In as Admin</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            Demo credentials: Use any email/password
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
