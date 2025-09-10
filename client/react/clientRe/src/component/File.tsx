import { Box, Paper, Typography, IconButton, Tooltip } from "@mui/material";
import { FaLock, FaDownload, FaLink, FaEdit, FaTrash } from "react-icons/fa";
import ProtectedLinkPage from "./ProtectedLink";
import { useFileContext } from "./FileContext";
import { useEffect, useState } from "react";

interface FileItem {
  fileId: number;
  fileName: string;
  downloadCount?: number;
  uploadDate?: string;
  fileSize?: number;
}



export default function FileCard() {
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString();
  const formatFileSize = (size: number) => `${(size / 1024 / 1024).toFixed(2)} MB`;
  const { selectedFile, setSelectedFile } = useFileContext();
  const file = selectedFile;  
if (!file) return <div>No file selected</div>;
  function handleDeleteFile(fileId: number): void {
    // You might want to show a confirmation dialog here
    if (window.confirm("Are you sure you want to delete this file?")) {
      // TODO: Replace with actual API call to delete the file
      // Example: await api.deleteFile(fileId);
      console.log(`File with ID ${fileId} deleted.`);
      // Optionally, trigger a state update or callback to remove the file from the UI
    }
  }

  return (
    <>
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
            <Typography variant="h6" sx={{ color: "#ff416c", fontWeight: "bold" }}>
              {file.fileName}
            </Typography>
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
          {/* <Tooltip title="Generate Link" arrow> */}
          {/* <IconButton
            sx={{ color: "#ff416c" }}
            onClick={() => handleOpenLinks(file.fileId)}
          >
            <FaLink />
          </IconButton> */}
          {/* </Tooltip> */}
          <Tooltip title="Edit File" arrow>
            <IconButton
              sx={{ color: "#ff416c" }}
              onClick={() => console.log("Editing", file.fileId)}
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
function fetchFiles() {
  throw new Error("Function not implemented.");
}

