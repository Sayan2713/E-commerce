import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

// Requires Google Identity Services script in index.html:
// <script src="https://accounts.google.com/gsi/client" async defer></script>
export default function GoogleLoginButton() {
  const btnRef = useRef(null);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.google || !btnRef.current) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          const { data } = await api.post('/auth/google', { idToken: response.credential });
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          setUser(data.user);

          // First-time Google users are prompted to fill in mobile + DOB
          if (data.needsProfileCompletion) navigate('/complete-profile');
          else navigate('/');
        } catch (err) {
          console.error('Google Sign-In failed:', err);
        }
      },
    });

    // Render official Google button with custom theme & shape settings
    window.google.accounts.id.renderButton(btnRef.current, {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'pill',
      width: '100%',
      logo_alignment: 'left',
    });
  }, [setUser, navigate]);

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: '2px',
        boxSizing: 'border-box',
      }}
    >
      <div ref={btnRef} style={{ width: '100%' }} />
    </div>
  );
}