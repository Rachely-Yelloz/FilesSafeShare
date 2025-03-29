import  { useState } from 'react';
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
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // יצירת משתנה לניווט

    const handleLogin = async () => {
        const url = 'https://filessafeshare-1.onrender.com/api/Auth/login';
        const requestData = { email: email, passwordHash: password };

        try {
            const response = await axios.post(url, requestData);
            console.log('User logged in successfully:', response.data);
            const token = response.data.token;
            debugger;
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('authToken',token)
                console.log('user login secussfuly', token);
                saveUserdetails(token)
                navigate('/files'); // הפניה לדף הקבצים אחרי התחברות מוצלחת

            }
        } catch (error: any) {
            console.error('Login error:', error.response?.data || error.message);
        }
    };

    return (
        <CssVarsProvider>
            {/* מיכל ראשי עם רקע תמונה */}
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
                    overflow: 'hidden', // הוספת סגנון זה

                }}
            >
                {/* שכבת השחרה כדי לשפר קריאות */}
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

                {/* טופס הלוגין */}
                <Sheet
                    sx={{
                        width: 400,
                        p: 4,
                        borderRadius: '12px',
                        background: 'rgba(0, 0, 0, 0.75)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.3)',
                        textAlign: 'center',
                        zIndex: 2, // מבטיח שהתוכן יהיה מעל שכבת ההשחרה
                    }}
                >
                    {/* שם האפליקציה עם לוגו */}
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
                    {/* טופס לוגין */}
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

                    <Button
                        sx={{
                            mt: 2,
                            width: '100%',
                            background: 'linear-gradient(135deg, #ff416c, #ff4b2b)',
                            color: '#fff',
                            fontWeight: 'bold',
                            borderRadius: '8px',
                            '&:hover': { opacity: 0.8 },
                        }}
                        onClick={handleLogin}
                    >
                        Log in
                    </Button>

                    <Typography
                        fontSize="sm"
                        sx={{ mt: 2, color: '#bbb', textAlign: 'center' }}
                    >
                        Don't have an account?{' '}
                        <Link href="/register" sx={{ color: '#ff416c', fontWeight: 'bold' }}>
                            register
                        </Link>
                    </Typography>
                </Sheet>
            </div>
        </CssVarsProvider>
    );
}