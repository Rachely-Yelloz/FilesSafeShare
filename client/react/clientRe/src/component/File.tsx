import { Box, Paper, Typography, IconButton, Tooltip, Button, TextField } from "@mui/material";
import { FaLock, FaDownload, FaEdit, FaTrash } from "react-icons/fa";
import ProtectedLinkPage from "./ProtectedLink";
import { useFileContext } from "./FileContext";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LogDto, sendLog } from "./SendLog";





export default function FileCard() {
  const [isEditFile, setIsEditFile] = useState(false)
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString();
  const formatFileSize = (size: number) => `${(size / 1024 / 1024).toFixed(2)} MB`;
  const { selectedFile, setSelectedFile } = useFileContext();
  const file = selectedFile;
  const navigate = useNavigate();
  console.log(selectedFile);

  const authToken = sessionStorage.getItem("authToken")
  if (!file) return <div>No file selected</div>;
  async function handleDeleteFile(fileId: number): Promise<void> {
    // You might want to show a confirmation dialog here
    if (window.confirm("Are you sure you want to delete this file?")) {
      // TODO: Replace with actual API call to delete the file
      // Example: await api.deleteFile(fileId);
      try {

        await axios.delete(`https://filessafeshare-1.onrender.com/api/File?fileId=${file?.fileId}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log(`File with ID ${fileId} deleted.`);
        const logdata: LogDto = {
          id: 0,
          userId: Number(sessionStorage.getItem("userId") ?? 0),
          createdAt: new Date().toISOString(),
          action: 'delete file',
          userName: sessionStorage.getItem("username") || "Unknown User",
          isSuccess: true,
          errorMessage: null
        }

        sendLog(logdata)
          .then(() => console.log('Log sent successfully'))
          .catch((err) => console.error('Failed to send log', err));

        navigate("/files");

        // Optimistic UI update
      } catch (error) {
        console.error("Error deleting file:", error)

        // Optionally, trigger a state update or callback to remove the file from the UI
      }
    }
  }
  async function handleEditFile(): Promise<void> {
    try {
      const response = await axios.put(
        `https://filessafeshare-1.onrender.com/api/File/${file?.fileId}`, // URL של ה-API
        file?.fileName, // תוכן הבקשה (string)
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`, // אם יש צורך ב-JWT
          },
        }
      );

      console.log("Update success:", response.data);
      setIsEditFile(false)

      return response.data;
    } catch (error: any) {
      console.error("Update failed:", error.response?.data || error.message);
      throw error;
    }
  }

  return (
    <>     <Typography variant="h6" sx={{ color: "#ff416c", fontWeight: "bold" }}>
      file:
    </Typography>
      <Paper
        elevation={3}
        sx={{
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "8px",
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid rgba(255, 65, 108, 0.1)",
        }}
      >

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: "50%",
              background: "rgba(255, 65, 108, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaLock style={{ color: "#ff416c" }} />
          </Box>

          <Box>
            {!isEditFile ? (
              <Typography variant="h6" sx={{ color: "#ff416c", fontWeight: "bold" }}>
                {file.fileName}
              </Typography>
            ) : (
              <>
                <TextField
                  variant="standard"
                  value={file.fileName}
                  onChange={(e) => setSelectedFile({ ...file, fileName: e.target.value })}
                  autoFocus
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      background: "transparent",
                      borderBottom: "2px solid #ff416c",
                      color: "#ff416c",
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                      "&:focus": {
                        outline: "none",
                      },
                    },
                  }}
                  sx={{
                    width: "100%",
                    mb: 1,
                  }}
                />

                <Button
                  onClick={handleEditFile}
                  variant="contained"
                  size="small"
                  sx={{
                    background: "linear-gradient(45deg, #ff416c 30%, #ff4b2b 90%)",
                    color: "white",
                    fontWeight: "bold",
                    textTransform: "none",
                    borderRadius: "8px",
                    px: 2,
                    py: 0.5,
                    "&:hover": {
                      background: "linear-gradient(45deg, #ff4b2b 30%, #ff416c 90%)",
                    },
                  }}
                >
                  Save
                </Button>
              </>
            )}

            <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
              {file.downloadCount !== undefined && (
                <Typography
                  variant="body2"
                  sx={{ color: "#ff416c", display: "flex", alignItems: "center", gap: 0.5 }}
                >
                  <FaDownload size={12} /> {file.downloadCount} downloads
                </Typography>
              )}
              {file.uploadDate && (
                <Typography variant="body2" sx={{ color: "#aaa" }}>
                  {formatDate(file.uploadDate)}
                </Typography>
              )}
              {file.fileSize && (
                <Typography variant="body2" sx={{ color: "#aaa" }}>
                  {formatFileSize(file.fileSize)}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Box display="flex" gap={1}>

          <Tooltip title="Edit File" arrow>
            <IconButton
              sx={{ color: "#ff416c" }}
              onClick={() => setIsEditFile(true)}
            >
              <FaEdit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete File" arrow>
            <IconButton
              sx={{ color: "#ff4b2b" }}
              onClick={() => handleDeleteFile(file.fileId)}
            >
              <FaTrash />
            </IconButton>
          </Tooltip>
        </Box>


      </Paper>
      <ProtectedLinkPage fileId={file.fileId} />
    </>
  );
}


