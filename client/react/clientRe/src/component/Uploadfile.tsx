
import { useState } from "react";
import { TextField, Button, FormControlLabel, Checkbox, Box, Typography } from "@mui/material";
import { FaFileUpload, FaLink } from "react-icons/fa";
import { motion } from "framer-motion";

export default function UploadFile({ onClose }: { onClose: () => void }) {
    const [fileName, setFileName] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [password, setPassword] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [isOneTimeUse, setIsOneTimeUse] = useState(false);
    const [downloadLimit, setDownloadLimit] = useState<number | "">("");
    const [generatedLink, setGeneratedLink] = useState("");
    const [error, setError] = useState<boolean>(false);

    const handleFileUpload = () => {
        if (!fileName || !selectedFile || !password || !expirationDate) {
            setError(true);
            return;
        }

        console.log("Uploading file:", fileName);
        setGeneratedLink(`https://safeshare.com/download/${fileName.replace(/\s+/g, "-")}`);
        setError(false);
    };

    return (
        <Box 
            sx={{ 
                position: "fixed", 
                top: 0, 
                left: 0, 
                width: "100vw", 
                height: "100vh", 
                background: "rgba(0, 0, 0, 0.5)", 
                backdropFilter: "blur(10px)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                zIndex: 1300
            }}
            onClick={onClose} // סגירה בלחיצה מחוץ לפופאפ
        >
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.8 }} 
                transition={{ duration: 0.3, ease: "easeOut" }} 
                onClick={(e) => e.stopPropagation()} // מונע סגירה בלחיצה בתוך הפופאפ
            >
                <Box sx={{
                    background: "#121212",
                    color: "white",
                    p: 4,
                    borderRadius: 2,
                    boxShadow: "0px 0px 20px rgba(255, 65, 108, 0.5)",
                    maxWidth: 500,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2
                }}>
                    <Typography component="h1" variant="h4" sx={{
                        mb: 3,
                        fontWeight: 'bold',
                        color: '#ff416c',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1
                    }}>
                        {/* <FaShieldAlt />  */}
                        Upload new fileeeeeeeeeee
                    </Typography>

                    <TextField
                        label="File Name"
                        variant="outlined"
                        fullWidth
                        required
                        error={error && !fileName}
                        sx={{ input: { color: "white" }, label: { color: "#bbb" } }}
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                    />

                    <input type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} style={{ display: "none" }} id="file-upload" />
                    <label htmlFor="file-upload">
                        <Button variant="contained" component="span" sx={{ background: "linear-gradient(135deg, #ff416c, #ff4b2b)", width: "100%" }}>
                            <FaFileUpload style={{ marginRight: "8px" }} /> Choose File
                        </Button>
                    </label>

                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        required
                        error={error && !password}
                        sx={{ input: { color: "white" }, label: { color: "#bbb" } }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <TextField
                        label="Expiration Date"
                        type="date"
                        variant="outlined"
                        fullWidth
                        required
                        error={error && !expirationDate}
                        InputLabelProps={{ shrink: true }}
                        sx={{ input: { color: "white" }, label: { color: "#bbb" } }}
                        value={expirationDate}
                        onChange={(e) => setExpirationDate(e.target.value)}
                    />

                    <FormControlLabel
                        control={<Checkbox checked={isOneTimeUse} onChange={(e) => setIsOneTimeUse(e.target.checked)} sx={{ color: "#ff416c" }} />}
                        label="One-time use only"
                        sx={{ color: "#bbb" }}
                    />

                    {!isOneTimeUse && (
                        <TextField
                            label="Download Limit"
                            type="number"
                            variant="outlined"
                            fullWidth
                            value={downloadLimit}
                            onChange={(e) => setDownloadLimit(e.target.value === "" ? "" : parseInt(e.target.value))}
                        />
                    )}

                    <Button variant="contained" sx={{ background: "linear-gradient(135deg, #ff416c, #ff4b2b)", width: "100%" }} onClick={handleFileUpload}>
                        Upload File
                    </Button>

                    {generatedLink && (
                        <Box sx={{ mt: 2, p: 2, background: "rgba(255, 255, 255, 0.1)", borderRadius: "8px", textAlign: "center" }}>
                            <Typography variant="body1" sx={{ color: "#fff" }}>
                                <FaLink style={{ marginRight: "8px" }} />
                                <a href={generatedLink} target="_blank" rel="noopener noreferrer" style={{ color: "#ff416c", textDecoration: "none" }}>
                                    {generatedLink}
                                </a>
                            </Typography>
                        </Box>
                    )}

                    <Button variant="outlined" sx={{ borderColor: "#ff416c", color: "#ff416c", mt: 2 }} onClick={onClose}>
                        Close
                    </Button>
                </Box>
            </motion.div>
        </Box>
    );
}
