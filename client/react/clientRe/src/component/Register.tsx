import React from 'react';
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
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const saveUserdetails = (token: any) => {
    try {
        // פענוח הטוקן
        interface DecodedToken {
            id: string;
            name: string;
            email: string;
        }

        const decodedToken = jwtDecode<DecodedToken>(token);

        // בדיקה אם ה-claims קיימים בטוקן, ושליפת הערכים
        if (typeof window !== 'undefined' && decodedToken && decodedToken.id && decodedToken.name && decodedToken.email) {
            sessionStorage.setItem('userId', decodedToken.id);
            sessionStorage.setItem('username', decodedToken.name);
            sessionStorage.setItem('useremail', decodedToken.email);
        } else {
            console.error('Some claims are missing in the decoded token');
        }

    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}
export default function Register() {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate(); // יצירת משתנה לניווט

    const onSubmit = async (data: any) => {
        const url = 'http://localhost:5141/api/Auth/register'; // שנה לכתובת ה-API שלך
        const requestData = {
            Username: data.Username,
            Email: data.Email,
            PasswordHash: data.Password
        };

        try {
            const response = await axios.post(url, requestData);
            console.log('User signed up successfully:', response.data);
            const token = response.data.Token;
 
            if (typeof window !== 'undefined') {
                sessionStorage.setItem(token, 'authToken')
                saveUserdetails(token);
                console.log('user register secussfuly', token);
                navigate('/files'); // הפניה לדף הקבצים אחרי התחברות מוצלחת

            }
        } catch (error: any) {
            console.error('Error:', error.response?.data || error.message);
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
                    backgroundImage: 'url("../../public/ransomware.webp")', // שים את הקובץ בתיקיית public
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
                        backgroundColor: 'rgba(0, 0, 0, 0.6)', // שכבת חצי שקיפות
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
                        Register
                    </Typography>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormControl sx={{ mb: 2 }}>
                            <FormLabel sx={{ color: '#bbb' }}>Username</FormLabel>
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
                                    {...register('Username', { required: true })}
                                    placeholder="Enter your username"
                                    sx={{
                                        pl: 4,
                                        color: '#fff',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: '8px',
                                    }}
                                    error={!!errors.Username}
                                />
                            </div>
                            {errors.Username && <Alert component="div">Username is required.</Alert>}
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
                                    {...register('Password', { required: true, minLength: 5 })}
                                    type="password"
                                    placeholder="Enter your password"
                                    sx={{
                                        pl: 4,
                                        color: '#fff',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: '8px',
                                    }}
                                    error={!!errors.Password}
                                />
                            </div>
                            {errors.Password && <Alert component="div">Password must be at least 5 characters.</Alert>}
                        </FormControl>


                        <FormControl sx={{ mb: 2 }}>
                            <FormLabel sx={{ color: '#bbb' }}>Email</FormLabel>
                            <div style={{ position: 'relative' }}>
                                <FaEnvelope
                                    style={{
                                        position: 'absolute',
                                        left: 10,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#bbb',
                                    }}
                                />
                                <Input
                                    {...register('Email', { required: true, pattern: /^\S+@\S+$/i })}
                                    placeholder="example@gmail.com"
                                    sx={{
                                        pl: 4,
                                        color: '#fff',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: '8px',
                                    }}
                                    error={!!errors.Email}
                                />
                            </div>
                            {errors.Email && <Alert component="div">Valid email is required.</Alert>}
                        </FormControl>


                        <Button
                            type="submit"
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
                            Register
                        </Button>

                        <Typography
                            fontSize="sm"
                            sx={{ mt: 2, color: '#bbb', textAlign: 'center' }}
                        >
                            Already have an account?{' '}
                            <Link href="/login" sx={{ color: '#ff416c', fontWeight: 'bold' }}>
                                Login
                            </Link>
                        </Typography>
                    </form>
                </Sheet>
            </div>
        </CssVarsProvider>
    );
}

