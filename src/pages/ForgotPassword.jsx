// ForgotPassword.jsx
import { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    // Simulate password reset process
    console.log('Resetting password for:', email);
    // Clear input field after reset
    setEmail('');
  };

  return (
    <>
      <div>
        <h2>Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleResetPassword}>Reset Password</button>
      </div>
    </>
  );
}
