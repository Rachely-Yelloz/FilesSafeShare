
import { useState, useEffect } from "react";
import { Container, Box, Typography, Button, List, ListItem, ListItemText, IconButton, Divider, Modal } from "@mui/material";
import { FaFileUpload, FaShieldAlt, FaTrash, FaEdit, FaLink } from "react-icons/fa";
import axios from "axios";
import Uploadfile from "./Uploadfile";
import { motion } from "framer-motion";


interface FileItem {
    fileId: number;
    fileName: string;
    downloadCount: number;
}

export default function Files() {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [openUploadModal, setOpenUploadModal] = useState(false);

    useEffect(() => {
        const userId = sessionStorage.getItem("userId");
        const authToken = sessionStorage.getItem("authToken");

        if (!authToken) {
            console.error("No auth token found");
            return;
        }

        axios.get(`http://localhost:5141/api/File/user/${userId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        })
            .then(response => setFiles(response.data))
            .catch(error => console.error("Error fetching files:", error));
    }, []);

    return (
        <Container maxWidth="lg" sx={{
            background: "#121212",
            color: "white",
            p: 4,
            boxShadow: "0px 0px 20px rgba(255, 65, 108, 0.5)",
            height: "100vh",
            minWidth: "100%",
            display: "flex",
            flexDirection: "column",
            borderRadius: 0,
            margin: 0,
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
                <FaShieldAlt /> SafeShare - File Manager
            </Typography>

            {/* כפתור לפתיחת הפופאפ */}
            <Box display="flex" justifyContent="center" sx={{ mb: 3 }}>
                <Button
                    variant="contained"
                    sx={{
                        background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
                        "&:hover": { opacity: 0.85 }
                    }}
                    onClick={() => setOpenUploadModal(true)}
                >
                    <FaFileUpload style={{ marginRight: "8px" }} /> Upload File
                </Button>
            </Box>

            <Divider sx={{ background: "#ff416c", mb: 2 }} />

            {/* רשימת הקבצים */}
            <List>
                {files.map((file) => (
                    <Box key={file.fileId} sx={{
                        background: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        p: 2,
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}>
                        <Box>
                            <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
                                {file.fileName}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#ff416c" }}>
                                Downloads: {file.downloadCount}
                            </Typography>
                        </Box>

                        {/* כפתורים */}
                        <Box display="flex" gap={1}>
                            <IconButton sx={{ color: "#ff416c" }} onClick={() => console.log("Showing links for", file.fileId)}>
                                <FaLink />
                            </IconButton>
                            <IconButton sx={{ color: "#ff416c" }} onClick={() => console.log("Editing", file.fileId)}>
                                <FaEdit />
                            </IconButton>
                            <IconButton sx={{ color: "#ff4b2b" }} onClick={() => console.log("Deleting", file.fileId)}>
                                <FaTrash />
                            </IconButton>
                        </Box>
                    </Box>
                ))}
            </List>

            {/* מודאל להעלאת קובץ */}
            <Modal open={openUploadModal} onClose={() => setOpenUploadModal(false)}>
               
                <Modal open={openUploadModal} onClose={() => setOpenUploadModal(false)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            background: "#121212",
                            padding: "20px",
                            borderRadius: "10px",
                            boxShadow: "0px 0px 10px rgba(255, 65, 108, 0.5)",
                            width: "90%",
                            maxWidth: "500px",
                        }}
                    >
                        <Uploadfile onClose={() => setOpenUploadModal(false)} />
                        <Box display="flex" justifyContent="center" mt={2}>
                            <Button variant="contained" onClick={() => setOpenUploadModal(false)} sx={{ background: "#ff416c" }}>
                                Close
                            </Button>
                        </Box>
                    </motion.div>
                </Modal>

            </Modal>
        </Container>
    );
}
