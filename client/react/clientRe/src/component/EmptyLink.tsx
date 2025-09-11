import { Box, TextField, InputAdornment, IconButton, Typography, Paper, FormControlLabel, Checkbox, Slider, Button } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { FaKey, FaEyeSlash, FaEye, FaCalendarAlt } from "react-icons/fa";
interface EmptyLinkProps {
    FileId: number;
}
export default function emptyLink({ FileId }: EmptyLinkProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({})
    const [password, setPassword] = useState("")
    const [passwordStrength, setPasswordStrength] = useState(0)
    const [expirationDate, setExpirationDate] = useState("")
    const [isOneTimeUse, setIsOneTimeUse] = useState(false)
    const [downloadLimit, setDownloadLimit] = useState<number>(1)
    const [error, setError] = useState<boolean>(false)

    const today = new Date()
    const minDate = today.toISOString().split("T")[0]

    // Calculate maximum date (1 year from now)
    const maxDate = new Date()
    maxDate.setFullYear(maxDate.getFullYear() + 1)
    const maxDateStr = maxDate.toISOString().split("T")[0]

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value
        setPassword(newPassword)

        // Calculate password strength
        let strength = 0
        if (newPassword.length >= 8) strength += 1
        if (/[A-Z]/.test(newPassword)) strength += 1
        if (/[0-9]/.test(newPassword)) strength += 1
        if (/[^A-Za-z0-9]/.test(newPassword)) strength += 1

        setPasswordStrength(strength)
    }
    const getPasswordStrengthColor = () => {
        if (error) { }
        if (passwordStrength === 0) return "#ff4b2b"
        if (passwordStrength === 1) return "#ff4b2b"
        if (passwordStrength === 2) return "#ff9800"
        if (passwordStrength === 3) return "#2196f3"
        return "#4caf50"
    }

    const getPasswordStrengthLabel = () => {
        if (passwordStrength === 0) return "Very Weak"
        if (passwordStrength === 1) return "Weak"
        if (passwordStrength === 2) return "Medium"
        if (passwordStrength === 3) return "Strong"
        return "Very Strong"
    }
    async function saveLink(): Promise<void> {
        const errors: { [key: string]: string } = {};

        // Validate password
        if (!password) {
            errors.password = "Password is required";
        } else if (passwordStrength < 3) {
            errors.password = "Password is too weak";
        }

        // Validate expiration date
        if (!expirationDate) {
            errors.expirationDate = "Expiration date is required";
        } else {
            const expDate = new Date(expirationDate);
            if (expDate < today) {
                errors.expirationDate = "Expiration date cannot be in the past";
            }
        }

        // Validate download limit if not one-time use
        if (!isOneTimeUse && (downloadLimit < 1 || downloadLimit > 10)) {
            errors.downloadLimit = "Download limit must be between 1 and 10";
        }

        setErrorMessages(errors);

        if (Object.keys(errors).length > 0) {
            setError(true);
            return;
        }

        setError(false);

        // Here you would typically send the data to your backend or handle it as needed
        // For demonstration, we'll just log the values
        try {
            await axios.post(
                `https://filessafeshare-1.onrender.com/api/ProtectedLink/generate`,
                {

                    fileId: FileId,
                    password: password,
                    isOneTimeUse: isOneTimeUse,
                    downloadLimit: downloadLimit,
                    expirationDate: expirationDate
                        ? new Date(expirationDate).toISOString()
                        : null,
                }
                , {
                    headers: {
                        Authorization:
                            `Bearer ${sessionStorage.getItem("authToken")}`,
                        "Content-Type": "application/json"
                    }
                })
        }
        catch (error) { console.error("Error updating link:", error) }

        console.log({
            password,
            expirationDate,
            isOneTimeUse,
            downloadLimit: isOneTimeUse ? 1 : downloadLimit,
        });

        setPassword("");
        setExpirationDate("");
        setIsOneTimeUse(false);
        setDownloadLimit(1);
    }

    return (<>
        <Box sx={{ mb: 3 }}>
            <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                required
                error={!!errorMessages.password}
                helperText={errorMessages.password || ""}
                sx={{
                    mb: 1,
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            borderColor: "#ff416c",
                        },
                        "&:hover fieldset": {
                            borderColor: "#ff4b2b",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#ff416c",
                        },
                    },
                    input: { color: "white" },
                    label: { color: "#bbb" },
                }}
                value={password}
                onChange={handlePasswordChange}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <FaKey style={{ color: "#ff416c" }} />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: "#ff416c" }}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            {password && (
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                        <Box sx={{ width: "75%", mr: 2 }}>
                            <Box
                                sx={{
                                    height: "4px",
                                    background: "rgba(255, 255, 255, 0.1)",
                                    borderRadius: "2px",
                                    overflow: "hidden",
                                }}
                            >
                                <Box
                                    sx={{
                                        height: "100%",
                                        width: `${(passwordStrength / 4) * 100}%`,
                                        background: getPasswordStrengthColor(),
                                        transition: "width 0.3s ease",
                                    }}
                                />
                            </Box>
                        </Box>
                        <Typography variant="caption" sx={{ color: getPasswordStrengthColor() }}>
                            {getPasswordStrengthLabel()}
                        </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: "#aaa" }}>
                        Use at least 8 characters with uppercase, numbers, and symbols for a strong password
                    </Typography>
                </Box>
            )}
        </Box>

        <Box sx={{ mb: 3 }}>
            <TextField
                label="Expiration Date"
                type="date"
                variant="outlined"
                fullWidth
                required
                error={!!errorMessages.expirationDate}
                helperText={errorMessages.expirationDate || ""}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: minDate, max: maxDateStr }}
                sx={{
                    mb: 1,
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            borderColor: "#ff416c",
                        },
                        "&:hover fieldset": {
                            borderColor: "#ff4b2b",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#ff416c",
                        },
                    },
                    input: { color: "white" },
                    label: { color: "#bbb" },
                }}
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <FaCalendarAlt style={{ color: "#ff416c" }} />
                        </InputAdornment>
                    ),
                }}
            />
            <Typography variant="caption" sx={{ color: "#aaa", display: "block", ml: 1 }}>
                The file will be automatically deleted after this date
            </Typography>
        </Box>

        <Paper sx={{ p: 2, mb: 3, background: "rgba(255, 255, 255, 0.05)", borderRadius: "8px" }}>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={isOneTimeUse}
                        onChange={(e) => setIsOneTimeUse(e.target.checked)}
                        sx={{
                            color: "#ff416c",
                            "&.Mui-checked": {
                                color: "#ff416c",
                            },
                        }}
                    />
                }
                label={
                    <Typography variant="body2" sx={{ color: "white" }}>
                        One-time use only
                    </Typography>
                }
                sx={{ mb: isOneTimeUse ? 0 : 2 }}
            />

            {!isOneTimeUse && (
                <Box sx={{ px: 2, mt: 2 }}>
                    <Typography
                        variant="body2"
                        sx={{ color: "white", mb: 1, display: "flex", justifyContent: "space-between" }}
                    >
                        <span>Download Limit: {downloadLimit}</span>
                        <span style={{ color: "#ff416c" }}>{downloadLimit === 10 ? "Unlimited" : downloadLimit}</span>
                    </Typography>
                    <Slider
                        value={downloadLimit}
                        min={1}
                        max={10}
                        step={1}
                        onChange={(_, value) => setDownloadLimit(value as number)}
                        sx={{
                            color: "#ff416c",
                            "& .MuiSlider-thumb": {
                                "&:hover, &.Mui-focusVisible": {
                                    boxShadow: "0px 0px 0px 8px rgba(255, 65, 108, 0.16)",
                                },
                            },
                        }}
                    />
                    {errorMessages.downloadLimit && (
                        <Typography variant="caption" sx={{ color: "#f44336", display: "block", mt: 1 }}>
                            {errorMessages.downloadLimit}
                        </Typography>
                    )}
                </Box>
            )}
        </Paper>

        <Button
            variant="contained"
            color="primary"
            sx={{
                background: "linear-gradient(45deg, #ff416c 30%, #ff4b2b 90%)",
                color: "white",
            }}
            onClick={() => saveLink()}
        >
            save Link
        </Button>

    </>)
}