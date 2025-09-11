
import { useEffect, useState } from "react"
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Tooltip,
  Checkbox,
  Slider,

} from "@mui/material"
import {
  FaTrash,
  FaEdit,
  FaLink,
  FaCalendarAlt,
  FaDownload
 
} from "react-icons/fa"
import axios from "axios"
import EmptyLink from "./EmptyLink"

interface ProtectedLink {
  linkId: number
  fileId: number
  userId: number
  creationDate: string
  expirationDate?: string
  isOneTimeUse: boolean
  downloadLimit?: number
  currentDownloadCount: number
  linkid_hash: string
}


export default function ProtectedLinkPage({ fileId }: { fileId: number }) {
  const [links, setLinks] = useState<ProtectedLink[]>([])


  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() + 1)

  const [editingLink, setEditingLink] = useState<ProtectedLink | null>(null)
  const authToken = sessionStorage.getItem("authToken")

  useEffect(() => {
    fetchLinks()
  }, [fileId])

  const fetchLinks = async () => {
    try {
      const response = await axios.get<ProtectedLink[]>(
        `https://filessafeshare-1.onrender.com/api/ProtectedLink/file/${fileId}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      )
      setLinks(response.data)
    } catch (error) {
      console.error("Error fetching protected links:", error)
    }
  }


  async function saveLink() {
    if (!editingLink) return;
    try {
      await axios.put(
        `https://filessafeshare-1.onrender.com/api/ProtectedLink/update/${editingLink.linkId}`,
        {
          fileId: editingLink.fileId,
          expirationDate: editingLink.expirationDate ? new Date(editingLink.expirationDate) : null,
          isOneTimeUse: editingLink.isOneTimeUse,
          downloadLimit: editingLink.downloadLimit,
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setEditingLink(null);
      fetchLinks();
    } catch (error) {
      console.error("Error updating link:", error);
    }
  }

  const deleteLink = async (linkId: number) => {
    try {
      await axios.delete(
        `https://filessafeshare-1.onrender.com/api/ProtectedLink/delete/${linkId}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      )
      fetchLinks()
    } catch (error) {
      console.error("Error deleting link:", error)
    }
  }


  return (
    <Box >
      <Typography variant="h5" sx={{ color: "#ff416c", fontWeight: "bold", mb: 2 }}>
        <FaLink style={{ marginRight: 8 }} />
        Protected Links     
         </Typography>
      <Typography variant="h6" sx={{ color: "#ff416c", fontWeight: "bold", mb: 2 }}>
        Add new link
      </Typography>
     <Box sx={{ mb: 3, bgcolor: "black", color: "white", p: 2 }}>
      <EmptyLink FileId={fileId} />
      </Box>



      <Box display={"flex"} flexDirection="row" alignItems="center" p={1}
        sx={{
          maxHeight: 400,
          overflowY: "auto",
          pr: 1,
          mb: 3,
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ff416c",
            borderRadius: "4px",
          },
        }}
      >

        {links.map((link) => {
          const isEditing = editingLink?.linkId === link.linkId;
          return (
            <Paper
              key={link.linkId}
              sx={{
                background: "#1e1e1e",
                p: 2,
                mb: 2,
                border: "1px solid rgba(255, 65, 108, 0.2)",
              }}
            >
              {isEditing ? (<>

                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    wordBreak: "break-all",
                  }}
                >
                  <a
                    href={`https://safesharereact.onrender.com/download/${encodeURIComponent(
                      link.linkid_hash
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#fff", textDecoration: "none" }}
                  >
                    {`https://safesharereact.onrender.com/download/${encodeURIComponent(
                      link.linkid_hash
                    )}`}
                  </a>
                </Typography>
                expirationDate
                <input
                  type="date"
                  value={editingLink.expirationDate?.split("T")[0] || ""}
                  onChange={(e) =>
                    setEditingLink({ ...editingLink, expirationDate: e.target.value })
                  }
                  style={{
                    width: "100%",
                    color: "#fff",
                    fontWeight: "bold",
                    background: "#1e1e1e",
                    border: "1px solid rgba(255, 65, 108, 0.2)",
                    borderRadius: 4,
                    padding: "8px",
                    wordBreak: "keep-all",
                  }}
                />

                <Checkbox
                  // checked={isOneTimeUse}
                  onChange={(e) => setEditingLink({ ...editingLink, isOneTimeUse: e.target.checked })}
                  sx={{
                    color: "#ff416c",
                    "&.Mui-checked": {
                      color: "#ff416c",
                    },
                  }}
                />is one time use
                {!editingLink.isOneTimeUse && (
                  <Box sx={{ px: 2, mt: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "white", mb: 1, display: "flex", justifyContent: "space-between" }}
                    >
                      <span>Download Limit: {editingLink.downloadLimit}</span>
                      <span style={{ color: "#ff416c" }}>{editingLink.downloadLimit === 10 ? "Unlimited" : editingLink.downloadLimit}</span>
                    </Typography>
                    <Slider
                      value={editingLink.downloadLimit}
                      min={editingLink.currentDownloadCount}
                      max={10}
                      step={1}
                      onChange={(_, value) => setEditingLink({ ...editingLink, downloadLimit: (value as number) })}
                      sx={{
                        color: "#ff416c",
                        "& .MuiSlider-thumb": {
                          "&:hover, &.Mui-focusVisible": {
                            boxShadow: "0px 0px 0px 8px rgba(255, 65, 108, 0.16)",
                          },
                        },
                      }}
                    />

                  </Box>
                )}
              </>) : (
                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    wordBreak: "break-all",
                  }}
                >
                  <a
                    href={`https://safesharereact.onrender.com/download/${encodeURIComponent(
                      link.linkid_hash
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#fff", textDecoration: "none" }}
                  >
                    {`https://safesharereact.onrender.com/download/${encodeURIComponent(
                      link.linkid_hash
                    )}`}
                  </a>
                </Typography>
              )}

              {/* שאר השדות נשארים בדיוק כפי שהם */}
              <Typography sx={{ color: "#aaa", mt: 1 }}>
                <FaCalendarAlt style={{ marginRight: 6 }} />
                Created: {new Date(link.creationDate).toLocaleString()}
              </Typography>

              <Typography sx={{ color: "#aaa" }}>
                <FaDownload style={{ marginRight: 6 }} />
                Downloads: {link.currentDownloadCount} / {link.downloadLimit ?? "∞"}

              </Typography>
              {!isEditing ? (
                <Typography sx={{ color: "#aaa" }}>
                  <FaDownload style={{ marginRight: 6 }} />
                  expirationDate: {link.expirationDate}
                </Typography>) : null}

              {/* כפתורי שמירה/ביטול או עריכה/מחיקה */}
              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                {isEditing ? (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => saveLink()}
                    >
                      שמור
                    </Button>
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={() => setEditingLink(null)}
                    >
                      ביטול
                    </Button>
                  </>
                ) : (
                  <>
                    <Tooltip title="ערוך">
                      <IconButton color="warning" onClick={() => setEditingLink(link)}>
                        <FaEdit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="מחק">
                      <IconButton color="error" onClick={() => deleteLink(link.linkId)}>
                        <FaTrash />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </Box>
            </Paper>
          );
        })}

      </Box>
    </Box >

  )
}

