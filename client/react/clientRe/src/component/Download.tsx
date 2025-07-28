// import { useParams } from "react-router-dom";

// export default function Download() {
//   const { linkId } = useParams();

//   return (
//     <>
//       <p>Download page is working</p>
//       <p>Link ID: {linkId}</p>
//       Enter the password to download the file:
//       <input type="password" placeholder="Enter password" />
//       <button>Download</button>
//     </>
//   );
// }
import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  CircularProgress,
  Alert,
  Fade,
  Tooltip,
} from "@mui/material";
import {
  FaDownload,
  FaLock,
  FaShieldAlt,
  FaFileAlt,
  FaKey,
  FaExclamationTriangle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";

export default function Download() {
  const { linkId } = useParams();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleDownload = async () => {
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);
    setError("");

    
      const url = 'https://filessafeshare-1.onrender.com/api/ProtectedLink/download';
      const data = {
        linkIdDecoded: linkId,
        password: password // Use the password entered by the user",
      };
      try {
      // הכנס כאן את לוגיקת ההורדה
     const response= await axios.post(url, data );
     console.log(response.data);
      setSuccess(true);
      // כאן תוכל להוסיף את לוגיקת ההורדה האמיתית
      console.log("Downloading file with linkId:", linkId, "and password:", password);
    } catch (error) {
      setError("Invalid password or download failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleDownload();
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        background: "linear-gradient(135deg, #121212 0%, #1e1e1e 100%)",
        color: "white",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, md: 4 },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%" }}
      >
        <Paper
          elevation={8}
          sx={{
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "16px",
            p: 4,
            border: "1px solid rgba(255, 65, 108, 0.2)",
            boxShadow: "0 8px 32px rgba(255, 65, 108, 0.3)",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 12px 40px rgba(255, 65, 108, 0.4)",
            },
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: "50%",
                background: "rgba(255, 65, 108, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <FaShieldAlt style={{ fontSize: "32px", color: "#ff416c" }} />
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#ff416c",
                mb: 1,
                textAlign: "center",
              }}
            >
              Secure Download
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#aaa",
                textAlign: "center",
                mb: 2,
              }}
            >
              Protected file access requires authentication
            </Typography>

            {linkId && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  background: "rgba(255, 65, 108, 0.1)",
                  px: 2,
                  py: 1,
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 65, 108, 0.2)",
                }}
              >
                <FaFileAlt style={{ color: "#ff416c", fontSize: "14px" }} />
                <Typography variant="body2" sx={{ color: "#ff416c", fontFamily: "monospace" }}>
                  Link ID: {linkId}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Password Input Section */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                color: "white",
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <FaKey style={{ color: "#ff416c" }} />
              Enter Password
            </Typography>

            <TextField
              fullWidth
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              disabled={isLoading || success}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  background: "rgba(0, 0, 0, 0.3)",
                  borderRadius: "8px",
                  "& fieldset": {
                    borderColor: "rgba(255, 65, 108, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 65, 108, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#ff416c",
                  },
                  "& input": {
                    color: "white",
                    "&::placeholder": {
                      color: "#aaa",
                    },
                  },
                },
              }}
            />

            {error && (
              <Fade in={true}>
                <Alert
                  severity="error"
                  icon={<FaExclamationTriangle />}
                  sx={{
                    mb: 2,
                    background: "rgba(255, 75, 43, 0.1)",
                    border: "1px solid rgba(255, 75, 43, 0.3)",
                    "& .MuiAlert-message": {
                      color: "#ff4b2b",
                    },
                  }}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            {success && (
              <Fade in={true}>
                <Alert
                  severity="success"
                  sx={{
                    mb: 2,
                    background: "rgba(76, 175, 80, 0.1)",
                    border: "1px solid rgba(76, 175, 80, 0.3)",
                    "& .MuiAlert-message": {
                      color: "#4caf50",
                    },
                  }}
                >
                  Download started successfully!
                </Alert>
              </Fade>
            )}
          </Box>

          {/* Download Button */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Tooltip title="Click to download the protected file" arrow>
              <Button
                variant="contained"
                size="large"
                onClick={handleDownload}
                disabled={isLoading || success || !password.trim()}
                sx={{
                  background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
                  borderRadius: "8px",
                  px: 4,
                  py: 1.5,
                  fontSize: "16px",
                  fontWeight: "bold",
                  transition: "all 0.3s ease",
                  minWidth: "150px",
                  "&:hover:not(:disabled)": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 16px rgba(255, 65, 108, 0.4)",
                  },
                  "&:disabled": {
                    background: "rgba(255, 65, 108, 0.3)",
                    color: "rgba(255, 255, 255, 0.5)",
                  },
                }}
                startIcon={
                  isLoading ? (
                    <CircularProgress size={20} sx={{ color: "inherit" }} />
                  ) : success ? (
                    <FaDownload />
                  ) : (
                    <FaLock />
                  )
                }
              >
                {isLoading ? "Processing..." : success ? "Downloaded" : "Download File"}
              </Button>
            </Tooltip>
          </Box>

          {/* Security Notice */}
          <Box
            sx={{
              mt: 4,
              p: 2,
              background: "rgba(255, 65, 108, 0.05)",
              borderRadius: "8px",
              border: "1px solid rgba(255, 65, 108, 0.1)",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#aaa",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <FaShieldAlt style={{ color: "#ff416c", fontSize: "14px" }} />
              Your download is protected by SafeShare security
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
}