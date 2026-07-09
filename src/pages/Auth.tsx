import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
// Background image is in public folder

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpDisplayName, setSignUpDisplayName] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  // Sanitize next: only same-origin relative paths allowed
  const rawNext = searchParams.get('next');
  const nextPath = rawNext && rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate(nextPath, { replace: true });
    }
  }, [user, navigate, nextPath]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(signInEmail, signInPassword);
    
    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in."
      });
      navigate('/');
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!signUpDisplayName.trim()) {
      toast({
        title: "Display name required",
        description: "Please enter a display name.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (signUpPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(signUpEmail, signUpPassword, signUpDisplayName);
    
    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Account created!",
        description: "You've successfully signed up and are now signed in."
      });
      navigate('/');
    }
    
    setIsLoading(false);
  };

  const siteUrl = window.location.origin;

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url('/images/auth-background.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <Helmet>
        <title>Sign In / Sign Up | Hotdogs Around the World</title>
        <meta 
          name="description" 
          content="Sign in or create an account to save your hot dog journey across devices and compete on the leaderboard."
        />
        <link rel="canonical" href={`${siteUrl}/auth`} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Sign In / Sign Up | Hotdogs Around the World" />
        <meta property="og:description" content="Sign in or create an account to save your hot dog journey across devices." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/auth`} />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Sign In / Sign Up | Hotdogs Around the World" />
        <meta name="twitter:description" content="Sign in or create an account to save your hot dog journey across devices." />
      </Helmet>

      <Card className="w-full max-w-md p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-heading text-primary mb-2">
            Hotdogs Around the World
          </h1>
          <p className="text-muted-foreground">
            Sign in to save your journey across devices
          </p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="your@email.com"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="••••••••"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-displayname">Display Name</Label>
                <Input
                  id="signup-displayname"
                  type="text"
                  placeholder="Choose your display name"
                  value={signUpDisplayName}
                  onChange={(e) => setSignUpDisplayName(e.target.value)}
                  required
                  disabled={isLoading}
                  maxLength={50}
                />
                <p className="text-xs text-muted-foreground">
                  This is how other explorers will see you
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  Must be at least 6 characters
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-sm"
          >
            Continue without signing in
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
