'use client';

import Image from 'next/image';
import '../styles/auth.css';

export default function AuthLayout({ children, title }) {
  return (
    <div className="auth-container">
      <div className="auth-image-side">
        <div className="auth-image-overlay" />
        <Image
          src="/images/sf-victorian.jpg"
          alt="San Francisco Victorian houses"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="auth-image-content">
          <div>
            <h1 className="auth-image-title">Neighborhood</h1>
            <p className="auth-image-subtitle">Find your local stay in SF's most charming neighborhoods</p>
          </div>
          <div className="auth-quote">
            <p>"The colorful streets of the Mission, the fog rolling over Lower Haight, the quiet charm of the Sunset – every neighborhood tells its own story."</p>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-container">
          <div>
            <h2 className="auth-title">{title}</h2>
            <div className="auth-title-underline"></div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
} 