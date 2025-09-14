import type React from "react"

import { useState, useRef } from "react"
import {
  TextField, Button, FormControlLabel, Checkbox, Box, Typography, CircularProgress, Tooltip, IconButton, InputAdornment,
  Slider, Paper, Fade, Stepper, Step, StepLabel, Divider, Alert, Chip, 
  //useMediaQuery, useTheme,
} from "@mui/material"
import {
  FaFileUpload, FaLink, FaEye, FaEyeSlash, FaCopy, FaLock, FaCalendarAlt, FaKey, FaFileAlt, FaCheck,
  FaArrowLeft, FaArrowRight, FaShieldAlt, FaInfoCircle, FaCloudUploadAlt,
} from "react-icons/fa"
import encryptFile from "../encryptFile"
import axios from "axios"
import { generateProtectedLink, uploadFileToDb, uploadFileToS3 } from "../uploadfileLogic"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { LogDto, sendLog } from "./SendLog"

export default function UploadFile() {
  const [fileName, setFileName] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [password, setPassword] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [expirationDate, setExpirationDate] = useState("")
  const [isOneTimeUse, setIsOneTimeUse] = useState(false)
  const [downloadLimit, setDownloadLimit] = useState<number>(1)
  const [generatedLink, setGeneratedLink] = useState("")
  const [error, setError] = useState<boolean>(false)
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({})
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [linkCopied, setLinkCopied] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  //const theme = useTheme()
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const steps = ["File Selection", "Security Settings", "Upload & Share"]

  const validateStep = () => {
    let isValid = true
    const newErrorMessages: { [key: string]: string } = {}

    if (activeStep === 0) {
      if (!fileName.trim()) {
        newErrorMessages.fileName = "File name is required"
        isValid = false
      }

      if (!selectedFile) {
        newErrorMessages.file = "Please select a file"
        isValid = false
      }
    } else if (activeStep === 1) {
      if (!password.trim()) {
        newErrorMessages.password = "Password is required"
        isValid = false
      } else if (password.length < 6) {
        newErrorMessages.password = "Password must be at least 6 characters"
        isValid = false
      }

      if (!expirationDate) {
        newErrorMessages.expirationDate = "Expiration date is required"
        isValid = false
      }

      if (!isOneTimeUse && (!downloadLimit || downloadLimit < 1)) {
        newErrorMessages.downloadLimit = "Download limit must be at least 1"
        isValid = false
      }
    }

    setErrorMessages(newErrorMessages)
    setError(!isValid)
    return isValid
  }

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevStep) => prevStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const handleFileUpload = async () => {
    if (!validateStep()) {
      return
    }

    setIsUploading(true)
    setUploadProgress(10)

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 5, 90))
      }, 300)

      const fileandkeys = await encryptFile(selectedFile!)
      setUploadProgress(40)
      //get link from s3
      const response = await axios.get("https://filessafeshare-1.onrender.com/api/UploadFile/presigned-url", {
        params: { fileName },
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
      })

      setUploadProgress(60)

      const { uploadUrl
        // ,  fileUrl, fileKey 
      } = response.data
      const encryptedBlob = new Blob([new Uint8Array(fileandkeys.ciphertext)], {
        type: "application/octet-stream",
      })

      const s3url = await uploadFileToS3(uploadUrl, encryptedBlob)
      setUploadProgress(80)

      const fileId = await uploadFileToDb(fileName, s3url, fileandkeys.key, fileandkeys.nonce, selectedFile!.type)

      const link = await generateProtectedLink(fileId, password, isOneTimeUse, downloadLimit)

      clearInterval(progressInterval)
      setUploadProgress(100)
        const logdata: LogDto = {
        id: 0,
        userId: Number(sessionStorage.getItem("userId") ?? 0),
        createdAt: new Date().toISOString(),
        action: 'upload file',
        userName:sessionStorage.getItem("username") || "Unknown User" ,
        isSuccess: true,
      
      }

      sendLog(logdata)
        .then(() => console.log('Log sent successfully'))
        .catch((err) => console.error('Failed to send log', err));

      console.log(error);
      setGeneratedLink(link)
      setUploadSuccess(true)
      setError(false)
    } catch (error) {
      console.error("Error uploading file:", error)
      setError(true)
      setErrorMessages({
        upload: "An error occurred during upload. Please try again.",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const copyLinkToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    }
  }

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
    if(error){}
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

  // Calculate minimum date (today)
  const today = new Date()
  const minDate = today.toISOString().split("T")[0]

  // Calculate maximum date (1 year from now)
  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() + 1)
  const maxDateStr = maxDate.toISOString().split("T")[0]

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      setSelectedFile(file)
      if (!fileName) {
        setFileName(file.name.split(".")[0]) // Set filename without extension
      }
    }
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Fade in={activeStep === 0}>
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: "#ff416c" }}>
                <FaFileAlt style={{ marginRight: "8px" }} /> Select Your File
              </Typography>

              <TextField
                label="File Name"
                variant="outlined"
                fullWidth
                required
                error={!!errorMessages.fileName}
                helperText={errorMessages.fileName || ""}
                sx={{
                  mb: 3,
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
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />

              <Box
                sx={{
                  mb: 3,
                  border: isDragging ? "2px dashed #ff416c" : "2px dashed rgba(255, 65, 108, 0.3)",
                  borderRadius: "8px",
                  p: 4,
                  textAlign: "center",
                  background: isDragging ? "rgba(255, 65, 108, 0.1)" : "rgba(0, 0, 0, 0.2)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setSelectedFile(file)
                      if (!fileName) {
                        setFileName(file.name.split(".")[0])
                      }
                    }
                  }}
                  style={{ display: "none" }}
                  id="file-upload"
                />

                <FaCloudUploadAlt style={{ fontSize: "48px", color: "#ff416c", marginBottom: "16px" }} />

                {selectedFile ? (
                  <Box>
                    <Chip
                      label={selectedFile.name}
                      sx={{
                        background: "rgba(255, 65, 108, 0.2)",
                        color: "white",
                        mb: 1,
                        "& .MuiChip-deleteIcon": {
                          color: "#ff416c",
                        },
                      }}
                      onDelete={() => setSelectedFile(null)}
                    />
                    <Typography variant="body2" sx={{ color: "#aaa" }}>
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <Typography variant="body1" sx={{ mb: 1, color: "white" }}>
                      Drag & drop your file here or click to browse
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#aaa" }}>
                      Supports all file types
                    </Typography>
                  </>
                )}

                {errorMessages.file && (
                  <Typography variant="caption" sx={{ color: "#f44336", display: "block", mt: 1 }}>
                    {errorMessages.file}
                  </Typography>
                )}
              </Box>

              <Alert severity="info" sx={{ mb: 3, background: "rgba(33, 150, 243, 0.1)", color: "#90caf9" }}>
                <Typography variant="body2">Your file will be encrypted before upload for maximum security.</Typography>
              </Alert>
            </Box>
          </Fade>
        )

      case 1:
        return (
          <Fade in={activeStep === 1}>
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: "#ff416c" }}>
                <FaShieldAlt style={{ marginRight: "8px" }} /> Security Settings
              </Typography>

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

              <Alert severity="info" sx={{ background: "rgba(33, 150, 243, 0.1)", color: "#90caf9" }}>
                <Typography variant="body2">
                  <FaInfoCircle style={{ marginRight: "8px" }} />
                  Recipients will need the password you set to access the file.
                </Typography>
              </Alert>
            </Box>
          </Fade>
        )

      case 2:
        return (
          <Fade in={activeStep === 2}>
            <Box>
              <Typography variant="h6" sx={{ mb: 3, color: "#ff416c" }}>
                <FaFileUpload style={{ marginRight: "8px" }} /> Upload & Share
              </Typography>

              {!uploadSuccess ? (
                <>
                  <Paper sx={{ p: 3, mb: 3, background: "rgba(255, 255, 255, 0.05)", borderRadius: "8px" }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, color: "white" }}>
                      File Summary
                    </Typography>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ color: "#aaa" }}>
                          File Name:
                        </Typography>
                        <Typography variant="body2" sx={{ color: "white", fontWeight: "bold" }}>
                          {fileName}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ color: "#aaa" }}>
                          File Size:
                        </Typography>
                        <Typography variant="body2" sx={{ color: "white" }}>
                          {selectedFile ? (selectedFile.size / 1024 / 1024).toFixed(2) + " MB" : "Unknown"}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ color: "#aaa" }}>
                          Expiration:
                        </Typography>
                        <Typography variant="body2" sx={{ color: "white" }}>
                          {new Date(expirationDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ color: "#aaa" }}>
                          Access Limit:
                        </Typography>
                        <Typography variant="body2" sx={{ color: "white" }}>
                          {isOneTimeUse ? "One-time use only" : `${downloadLimit} downloads`}
                        </Typography>
                      </Box>

                      <Divider sx={{ background: "rgba(255, 255, 255, 0.1)", my: 1 }} />

                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="body2" sx={{ color: "#aaa" }}>
                          Security:
                        </Typography>
                        <Chip
                          icon={<FaLock style={{ color: "#121212" }} />}
                          label="Password Protected"
                          size="small"
                          sx={{
                            background: "#ff416c",
                            color: "#121212",
                            fontWeight: "bold",
                          }}
                        />
                      </Box>
                    </Box>
                  </Paper>

                  {errorMessages.upload && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {errorMessages.upload}
                    </Alert>
                  )}

                  <Button
                    variant="contained"
                    fullWidth
                    disabled={isUploading}
                    sx={{
                      background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
                      py: 1.5,
                      mb: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 8px rgba(255, 65, 108, 0.5)",
                      },
                      "&:disabled": {
                        background: "rgba(255, 65, 108, 0.5)",
                      },
                    }}
                    onClick={handleFileUpload}
                  >
                    {isUploading ? (
                      <>
                        <CircularProgress size={24} sx={{ color: "white", mr: 1 }} />
                        Uploading {uploadProgress}%
                      </>
                    ) : (
                      <>
                        <FaFileUpload style={{ marginRight: "8px" }} /> Upload File
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Box
                      sx={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        background: "rgba(76, 175, 80, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px auto",
                      }}
                    >
                      <FaCheck style={{ fontSize: "40px", color: "#4caf50" }} />
                    </Box>
                    <Typography variant="h5" sx={{ color: "white", mb: 1 }}>
                      Upload Successful!
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#aaa", mb: 3 }}>
                      Your file has been encrypted and uploaded securely
                    </Typography>
                  </Box>

                  <Paper
                    sx={{
                      p: 3,
                      mb: 3,
                      background: "rgba(255, 65, 108, 0.1)",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 65, 108, 0.3)",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "#ff416c", mb: 2, fontWeight: "bold", textAlign: "center" }}
                    >
                      Secure Link Generated
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        background: "rgba(0, 0, 0, 0.3)",
                        borderRadius: "4px",
                        p: 1.5,
                        mb: 2,
                      }}
                    >
                      <FaLink style={{ marginRight: "8px", color: "#ff416c" }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#fff",
                          wordBreak: "break-all",
                          textAlign: "left",
                          flex: 1,
                          fontSize: "0.8rem",
                        }}
                      >
                        {generatedLink}
                      </Typography>
                      <Tooltip title={linkCopied ? "Copied!" : "Copy to clipboard"} arrow>
                        <IconButton onClick={copyLinkToClipboard} size="small" sx={{ color: "#ff416c" }}>
                          <FaCopy />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <Alert severity="warning" sx={{ mb: 2, background: "rgba(255, 152, 0, 0.1)", color: "#ffb74d" }}>
                      <Typography variant="body2">
                        Remember to share the password separately for maximum security.
                      </Typography>
                    </Alert>

                    <Button
                      variant="contained"
                      fullWidth
                      onClick={copyLinkToClipboard}
                      sx={{
                        background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
                        py: 1.5,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 8px rgba(255, 65, 108, 0.5)",
                        },
                      }}
                    >
                      <FaCopy style={{ marginRight: "8px" }} />
                      {linkCopied ? "Copied!" : "Copy Link"}
                    </Button>
                  </Paper>
                </motion.div>
              )}
            </Box>
          </Fade>
        )

      default:
        return null
    }
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #121212 0%, #1e1e1e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300,
        p: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          background: "#121212",
          color: "white",
          p: { xs: 2, sm: 4 },
          borderRadius: "16px",
          boxShadow: "0px 0px 30px rgba(255, 65, 108, 0.3)",
          maxWidth: "600px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          border: "1px solid rgba(255, 65, 108, 0.2)",
          position: "relative",
        }}
      >
        <Box sx={{ position: "absolute", top: 16, left: 16 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              color: "#aaa",
              "&:hover": {
                color: "#fff",
                background: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <FaArrowLeft />
          </IconButton>
        </Box>

        <Typography
          component="h1"
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#ff416c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            mb: 4,
            mt: 1,
          }}
        >
          <FaLock /> Secure Upload
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  "& .MuiStepLabel-label": {
                    color: "white",
                  },
                  "& .MuiStepIcon-root": {
                    color: "#ff416c",
                  },
                }}
              />
            </Step>
          ))}
        </Stepper>

        {renderStepContent()}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button
            variant="outlined"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{
              borderColor: "#ff416c",
              color: "#ff416c",
              "&:hover": {
                borderColor: "#ff4b2b",
                background: "rgba(255, 65, 108, 0.1)",
              },
              visibility: activeStep === 0 ? "hidden" : "visible",
            }}
          >
            <FaArrowLeft style={{ marginRight: "8px" }} /> Back
          </Button>

          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{
                background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 8px rgba(255, 65, 108, 0.5)",
                },
              }}
            >
              Next <FaArrowRight style={{ marginLeft: "8px" }} />
            </Button>
          ) : (
            !uploadSuccess && (
              <Button
                variant="contained"
                onClick={() => navigate(-1)}
                sx={{
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                Cancel
              </Button>
            )
          )}

          {uploadSuccess && (
            <Button
              variant="contained"
              onClick={() => navigate(-1)}
              sx={{
                background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 8px rgba(255, 65, 108, 0.5)",
                },
              }}
            >
              Done
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  )
}
