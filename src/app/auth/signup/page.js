'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../../../styles/main.css';
import '../../../styles/auth.css';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'This email is already registered') {
          setError('This email is already registered. Would you like to sign in instead?');
        } else {
          setError(data.error || 'Something went wrong during signup');
        }
        setLoading(false);
        return;
      }

      // Sign in the user after successful registration
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result.error) {
        setError('Error signing in after registration');
        setLoading(false);
      } else {
        router.push('/');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join Neighborhood Homes today</p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
            {error.includes('already registered') && (
              <p className="auth-error-action">
                <Link href="/auth/signin" className="auth-link">
                  Click here to sign in
                </Link>
              </p>
            )}
          </div>
        )}

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
            />
            <small className="auth-input-help">Password must be at least 6 characters long</small>
          </div>

          <button 
            type="submit" 
            className="auth-submit"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        <div className="auth-social-buttons">
          <button
            onClick={() => signIn('google')}
            className="auth-social-button"
            disabled={loading}
          >
            <img src="/google-icon.svg" alt="Google" width="20" height="20" />
            Sign up with Google
          </button>
        </div>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link href="/auth/signin">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
} 