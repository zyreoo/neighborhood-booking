'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../../../styles/main.css';
import '../../../styles/auth.css';

console.log('DEBUG: SignUp page module loaded');

export default function SignUp() {
  console.log('DEBUG: SignUp component rendering');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('DEBUG: Attempting sign up for:', email);
    setError('');
    setLoading(true);

    try {
      console.log('DEBUG: Calling signup API');
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      console.log('DEBUG: Signup API response:', { status: res.status, data });

      if (!res.ok) {
        if (data.error === 'This email is already registered') {
          console.log('DEBUG: Email already registered');
          setError(
            <div>
              This email is already registered. 
              <Link href="/auth/signin" className="auth-link ml-2">
                Sign in instead
              </Link>
            </div>
          );
        } else {
          console.log('DEBUG: Signup error:', data.error);
          setError(data.error || 'Something went wrong during signup');
        }
        setLoading(false);
        return;
      }

      console.log('DEBUG: Signup successful, attempting automatic sign in');
      // After successful registration, try to sign in
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      console.log('DEBUG: Auto sign in result:', result);

      if (result.error) {
        console.log('DEBUG: Auto sign in error:', result.error);
        setError('Error signing in after registration');
        setLoading(false);
      } else {
        console.log('DEBUG: Auto sign in successful');
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
      }
    } catch (error) {
      console.error('DEBUG: Unexpected error during signup:', error);
      setError('An unexpected error occurred. Please try again.');
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