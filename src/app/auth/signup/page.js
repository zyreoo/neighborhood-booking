'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../../../styles/main.css';
import '../../../styles/auth.css';
import { useAuth } from '../../../lib/auth';

console.log('DEBUG: SignUp page module loaded');

export default function SignUp() {
  console.log('DEBUG: SignUp component rendering');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('DEBUG: Attempting sign up for:', email);
    setError('');
    setLoading(true);

    try {
      console.log('DEBUG: Calling Firebase signup');
      await signUp(email, password, name);
      console.log('DEBUG: Signup successful');
      
      // Check for stored redirect URL
      const redirectUrl = sessionStorage.getItem('redirectAfterAuth');
      console.log('DEBUG: Redirect URL from storage:', redirectUrl);
      
      if (redirectUrl) {
        console.log('DEBUG: Redirecting to:', redirectUrl);
        sessionStorage.removeItem('redirectAfterAuth');
        router.push(redirectUrl);
      } else {
        console.log('DEBUG: No redirect URL, going to home');
        router.push('/');
      }
    } catch (error) {
      console.error('DEBUG: Signup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError(
          <div>
            This email is already registered. 
            <Link href="/auth/signin" className="auth-link ml-2">
              Sign in instead
            </Link>
          </div>
        );
      } else {
        setError(error.message || 'Something went wrong during signup');
      }
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome</h1>
          <p>Create your account to get started</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your full name"
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your email"
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
              disabled={loading}
              minLength={6}
              placeholder="Create a password"
            />
            <span className="auth-input-help">Must be at least 6 characters</span>
          </div>

          <button 
            type="submit" 
            className="auth-submit"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link href="/auth/signin" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
} 