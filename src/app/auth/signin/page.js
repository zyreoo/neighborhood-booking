import SignInForm from './SignInForm';
import styles from './page.module.css';

export default function SignInPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to your account</p>
        <SignInForm />
      </div>
    </div>
  );
} 