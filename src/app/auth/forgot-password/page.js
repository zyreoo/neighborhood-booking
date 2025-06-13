'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';
import { useAuth } from '@/lib/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [phoneLastFour, setPhoneLastFour] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { verifyPhoneAndResetPassword } = useAuth();

  const validatePhoneLastFour = (digits) => {
    return /^\d{4}$/.test(digits);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validatePhoneLastFour(phoneLastFour)) {
      setError('Please enter the last 4 digits of your phone number');
      return;
    }

    setLoading(true);

    try {
      await verifyPhoneAndResetPassword(phoneLastFour, email);
      setSuccess('Password reset email sent. Please check your inbox.');
      setTimeout(() => {
        router.push('/auth/signin');
      }, 3000);
    } catch (err) {
      setError('Failed to verify phone number or send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset Password">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="auth-error">
            <p className="auth-error-text">{error}</p>
          </div>
        )}

        {success && (
          <div className="auth-success">
            <p className="auth-success-text">{success}</p>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone-last-four" className="form-label">
            Last 4 digits of phone number
          </label>
          <input
            id="phone-last-four"
            type="text"
            value={phoneLastFour}
            onChange={(e) => setPhoneLastFour(e.target.value)}
            className="form-input"
            placeholder="Enter last 4 digits"
            maxLength={4}
            pattern="\d{4}"
            required
          />
        </div>

        <button
          type="submit"
          className="auth-button"
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Reset Password'}
        </button>

        <div className="auth-link-container">
          <p className="auth-text">
            Remember your password?{' '}
            <Link href="/auth/signin" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
} 