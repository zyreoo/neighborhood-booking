'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import '../../../styles/main.css';
import '../../../styles/auth.css';

console.log('🔑 [SignIn] Page loaded');

export default function SignIn() {
  console.log('🔑 [SignIn] Component rendering');
  
  const router = useRouter();
  const { user, loading, signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('🔑 [SignIn] Auth state:', { user, loading });
    
    // If user is already authenticated, check for redirect
    if (user && !loading) {
      const redirectUrl = sessionStorage.getItem('redirectAfterAuth');
      console.log('🔑 [SignIn] Checking redirect for authenticated user:', { redirectUrl });
      
      if (redirectUrl) {
        console.log('🔑 [SignIn] Redirecting to:', redirectUrl);
        sessionStorage.removeItem('redirectAfterAuth');
        router.push(redirectUrl);
      } else {
        console.log('🔑 [SignIn] No redirect URL, going to home');
        router.push('/');
      }
    }
  }, [user, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔑 [SignIn] Attempting sign in for:', email);
    setError('');
    setIsLoading(true);

    try {
      console.log('🔑 [SignIn] Calling Firebase signIn');
      await signIn(email, password);
      console.log('🔑 [SignIn] Sign in successful');
      
      // Router.push is not needed here as it's handled in the auth provider
    } catch (error) {
      console.error('🔑 [SignIn] Sign in error:', error);
      setError(getErrorMessage(error.code));
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    console.log('🔑 [SignIn] Attempting Google sign in');
    setError('');
    setIsLoading(true);

    try {
      await signInWithGoogle();
      console.log('🔑 [SignIn] Google sign in successful');
      
      // Router.push is not needed here as it's handled in the auth provider
    } catch (error) {
      console.error('🔑 [SignIn] Google sign in error:', error);
      setError(getErrorMessage(error.code));
      setIsLoading(false);
    }
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      default:
        return 'An error occurred. Please try again';
    }
  };

  // Show loading state while checking auth
  if (loading) {
    console.log('🔑 [SignIn] Showing loading state');
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't show sign-in form if already authenticated
  if (user) {
    console.log('🔑 [SignIn] User already authenticated, showing redirect message');
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Already Signed In</h2>
          <p>Redirecting you...</p>
        </div>
      </div>
    );
  }

  console.log('🔑 [SignIn] Rendering sign-in form');
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue booking properties</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="auth-submit"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        <div className="auth-social-buttons">
          <button
            onClick={handleGoogleSignIn}
            className="auth-social-button"
            disabled={isLoading}
          >
            <img src="/google-icon.svg" alt="Google" width="20" height="20" />
            Sign in with Google
          </button>
        </div>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link href="/auth/signup">Sign up</Link>
          </p>
          <p>
            <Link href="/auth/forgot-password">Forgot your password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
} 