
import { useState } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import { FaUser, FaLock, FaShieldAlt } from 'react-icons/fa';
import axios from 'axios';
import { Outlet, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import CircularProgress from '@mui/joy/CircularProgress';


interface DecodedToken {
  id: string;
  name: string;
  email: string;
}

const saveUserDetails = (token: string) => {
  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    if (decodedToken?.id && decodedToken?.name && decodedToken?.email) {
      sessionStorage.setItem('userId', decodedToken.id);
      sessionStorage.setItem('username', decodedToken.name);
      sessionStorage.setItem('useremail', decodedToken.email);
    } else {
      console.error('Missing claims in token');
    }
  } catch (error) {
    console.error('Error decoding token:', error);
  }
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // מצב ראשוני: false

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true); // הפעלת מצב טעינה

    const url = 'https://filessafeshare-1.onrender.com/api/Auth/login';
    const requestData = { email, passwordHash: password };

    try {
      const response = await axios.post(url, requestData);
      const token = response.data.token;
      sessionStorage.setItem('authToken', token);
      saveUserDetails(token);
      navigate('/files');

    }
    catch (error: any) {
      setLoading(false); // הפעלת מצב טעינה

      const defaultMessage = 'Login failed';
      const message =
        error.response?.data?.title ||
        error.response?.data?.message ||
        defaultMessage;
      setError(message);
    }

  };

  return (
    <CssVarsProvider>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          backgroundImage: 'url("../../public/ransomware.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 1,
          }}
        ></div>

        <Sheet
          sx={{
            width: 400,
            p: 4,
            borderRadius: '12px',
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.3)',
            textAlign: 'center',
            zIndex: 2,
          }}
        >
          <Typography
            level="h2"
            component="h1"
            sx={{
              mb: 2,
              fontWeight: 'bold',
              color: '#ff416c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <FaShieldAlt /> SafeShare
          </Typography>

          <Typography level="body-md" sx={{ mb: 3, color: '#ddd' }}>
            Secure File Sharing Made Simple
          </Typography>

          <Typography
            level="h1"
            component="h1"
            sx={{
              mb: 2,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
            }}
          >
            Login
          </Typography>

          <FormControl sx={{ mb: 2 }}>
            <FormLabel sx={{ color: '#bbb' }}>Email</FormLabel>
            <div style={{ position: 'relative' }}>
              <FaUser
                style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#bbb',
                }}
              />
              <Input
                name="email"
                type="email"
                placeholder="Your email"
                sx={{
                  pl: 4,
                  color: '#fff',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                }}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </FormControl>

          <FormControl sx={{ mb: 2 }}>
            <FormLabel sx={{ color: '#bbb' }}>Password</FormLabel>
            <div style={{ position: 'relative' }}>
              <FaLock
                style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#bbb',
                }}
              />
              <Input
                name="password"
                type="password"
                placeholder="Your password"
                sx={{
                  pl: 4,
                  color: '#fff',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                }}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </FormControl>

          {error && (
            <Typography color="danger" sx={{ mt: 1, mb: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            onClick={handleLogin}
            disabled={loading}
            sx={{
              mt: 2,
              width: '100%',
              background: 'linear-gradient(135deg, #ff416c, #ff4b2b)',
              color: '#fff',
              fontWeight: 'bold',
              borderRadius: '8px',
              '&:hover': { opacity: 0.8 },
            }}
          >
            {loading ? <CircularProgress size="sm" sx={{ color: '#fff' }} /> : 'login'}
          </Button>

        </Sheet>
      </div>
      <Outlet />

    </CssVarsProvider>
  );
}
