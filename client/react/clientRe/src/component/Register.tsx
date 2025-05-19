import { useForm } from 'react-hook-form';
import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Alert from '@mui/joy/Alert';
import Link from '@mui/joy/Link';
import { FaUser, FaLock, FaEnvelope, FaShieldAlt } from 'react-icons/fa';
import axios from 'axios';
import { Outlet, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import CircularProgress from '@mui/joy/CircularProgress';

interface RegisterFormData {
  Username: string;
  Email: string;
  Password: string;
}

interface RegisterResponse {
  token: string;
}

interface DecodedToken {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

const saveUserdetails = (token: string): void => {
  try {
    const decodedToken = jwtDecode<DecodedToken>(token);

    if (
      typeof window !== 'undefined' &&
      decodedToken?.id &&
      decodedToken?.name &&
      decodedToken?.email
    ) {
      sessionStorage.setItem('userId', decodedToken.id);
      sessionStorage.setItem('username', decodedToken.name);
      sessionStorage.setItem('useremail', decodedToken.email);
    } else {
      console.error('Some claims are missing in the decoded token');
    }
  } catch (error) {
    console.error('Error decoding token:', error);
  }
};

export default function Register() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<RegisterFormData>();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // מצב ראשוני: false

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true); // הפעלת מצב טעינה
    setServerError(null);
    const url = 'https://filessafeshare-1.onrender.com/api/Auth/register';

    try {
      const response = await axios.post<RegisterResponse>(url, {
        Username: data.Username,
        Email: data.Email,
        PasswordHash: data.Password,
      });
      console.log('Response:', response.data);

      const token = response.data.token;
      sessionStorage.setItem('authToken', token);
      saveUserdetails(token);
      reset(); // ניקוי הטופס
      navigate('/files');

    } catch (error) {
      setLoading(false); // עצירת מצב טעינה
      if (axios.isAxiosError(error)) {
        const message = error.response?.data || 'Server error. Please try again.';
        setServerError(typeof message === 'string' ? message : JSON.stringify(message));
      } else {
        setServerError('Unexpected error occurred.');
      }
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
            Register
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl sx={{ mb: 2 }}>
              <FormLabel sx={{ color: '#bbb' }}>Username</FormLabel>
              <div style={{ position: 'relative' }}>
                <FaUser style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#bbb' }} />
                <Input
                  {...register('Username', { required: 'Username is required' })}
                  placeholder="Enter your username"
                  sx={{ pl: 4, color: '#fff', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px' }}
                  error={!!errors.Username}
                />
              </div>
              {errors.Username && <Alert component="div">{errors.Username.message}</Alert>}
            </FormControl>

            <FormControl sx={{ mb: 2 }}>
              <FormLabel sx={{ color: '#bbb' }}>Email</FormLabel>
              <div style={{ position: 'relative' }}>
                <FaEnvelope style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#bbb' }} />
                <Input
                  {...register('Email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                  })}
                  placeholder="example@gmail.com"
                  sx={{ pl: 4, color: '#fff', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px' }}
                  error={!!errors.Email}
                />
              </div>
              {errors.Email && <Alert component="div">{errors.Email.message}</Alert>}
            </FormControl>

            <FormControl sx={{ mb: 2 }}>
              <FormLabel sx={{ color: '#bbb' }}>Password</FormLabel>
              <div style={{ position: 'relative' }}>
                <FaLock style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#bbb' }} />
                <Input
                  {...register('Password', {
                    required: 'Password is required',
                    minLength: { value: 5, message: 'Password must be at least 5 characters' }
                  })}
                  type="password"
                  placeholder="Enter your password"
                  sx={{ pl: 4, color: '#fff', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px' }}
                  error={!!errors.Password}
                />
              </div>
              {errors.Password && <Alert component="div">{errors.Password.message}</Alert>}
            </FormControl>

            {serverError && (
              <Alert color="danger" sx={{ mb: 2 }}>
                {serverError}
              </Alert>
            )}
            <Button
              type="submit"
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
              {loading ? <CircularProgress size="sm" sx={{ color: '#fff' }} /> : 'Register'}
            </Button>

            <Typography fontSize="sm" sx={{ mt: 2, color: '#bbb', textAlign: 'center' }}>
              Already have an account?{' '}
              <Link href="/login" sx={{ color: '#ff416c', fontWeight: 'bold' }}>
                Login
              </Link>
            </Typography>
          </form>
        </Sheet>
      </div>
      <Outlet />

    </CssVarsProvider>
  );
}
