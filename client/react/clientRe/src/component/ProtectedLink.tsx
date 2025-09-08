
import { useEffect, useState } from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  Tooltip,
  Switch,
} from "@mui/material"
import {
  FaTrash,
  FaEdit,
  FaLink,
  FaCalendarAlt,
  FaDownload,
  FaClock,
  FaPlus,
} from "react-icons/fa"
import axios from "axios"

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
  const [newLink, setNewLink] = useState({
    password: "",
    isOneTimeUse: false,
    downloadLimit: 1,
  })
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

  const addLink = async () => {
    try {
      const requestData = {
        fileId,
        password: newLink.password,
        isOneTimeUse: newLink.isOneTimeUse,
        downloadLimit: newLink.downloadLimit,
      }

      await axios.post(
        `https://filessafeshare-1.onrender.com/api/ProtectedLink/generate`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      fetchLinks()
      setNewLink({ password: "", isOneTimeUse: false, downloadLimit: 1 })
    } catch (error) {
      console.error("Error adding link:", error)
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

  // const updateLink = async () => {
  //   if (!editingLink) return

  //   try {
  //     await axios.put(
  //       `https://filessafeshare-1.onrender.com/api/ProtectedLink/update/${editingLink.linkId}`,
  //       {
  //         fileId: editingLink.fileId,
  //         expirationDate: editingLink.expirationDate,
  //         isOneTimeUse: editingLink.isOneTimeUse,
  //         downloadLimit: editingLink.downloadLimit,
  //       },
  //       { headers: { Authorization: `Bearer ${authToken}` } }
  //     )
  //     setEditingLink(null)
  //     fetchLinks()
  //   } catch (error) {
  //     console.error("Error updating link:", error)
  //   }
  // }

  return (
    <Box>
      <Typography variant="h5" sx={{ color: "#ff416c", fontWeight: "bold", mb: 2 }}>
        <FaLink style={{ marginRight: 8 }} />
        לינקים מוגנים
      </Typography>

      {/* יצירת לינק חדש */}
      <Paper sx={{ background: "#1e1e1e", p: 3, border: "1px solid #ff416c", mb: 3 }}>
        <Typography variant="subtitle1" sx={{ color: "white", mb: 2 }}>
          <FaPlus style={{ marginRight: 8 }} />
          צור לינק חדש
        </Typography>
        <TextField
          fullWidth
          type="password"
          label="סיסמה"
          variant="outlined"
          value={newLink.password}
          onChange={(e) => setNewLink({ ...newLink, password: e.target.value })}
          sx={{ mb: 2, input: { color: "white" } }}
        />
        <TextField
          fullWidth
          type="number"
          label="מגבלת הורדות"
          variant="outlined"
          value={newLink.downloadLimit}
          onChange={(e) => setNewLink({ ...newLink, downloadLimit: parseInt(e.target.value) })}
          sx={{ mb: 2, input: { color: "white" } }}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Typography variant="body2" sx={{ color: "#ff416c" }}>
            חד פעמי
          </Typography>
          <Switch
            checked={newLink.isOneTimeUse}
            onChange={(e) => setNewLink({ ...newLink, isOneTimeUse: e.target.checked })}
            sx={{ color: "#ff416c" }}
          />
        </Box>
        <Button fullWidth variant="contained" sx={{ background: "#ff416c" }} onClick={addLink}>
          צור לינק
        </Button>
      </Paper>
<a>{editingLink?.linkId}</a>
      {/* רשימה */}
      {/* {links.map((link) => (
        <Paper
          key={link.linkId}
          sx={{
            background: "#1e1e1e",
            p: 2,
            mb: 2,
            border: "1px solid rgba(255, 65, 108, 0.2)",
          }}
        > */}
      <Box
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
        {links.map((link) => (
          <Paper
            key={link.linkId}
            sx={{
              background: "#1e1e1e",
              p: 2,
              mb: 2,
              border: "1px solid rgba(255, 65, 108, 0.2)",
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontWeight: "bold",
                wordBreak: "break-all", // 💥 כדי שהלינק לא יגלוש
              }}
            >
              {/* {`https://safesharereact.onrender.com/download/${link.linkid_hash}`} */}
<a href={`https://safesharereact.onrender.com/download/${encodeURIComponent(link.linkid_hash)}`} target="_blank" rel="noopener noreferrer">
  {`https://safesharereact.onrender.com/download/${encodeURIComponent(link.linkid_hash)}`}
</a>
            </Typography>
            <Typography sx={{ color: "#aaa", mt: 1 }}>
              <FaCalendarAlt style={{ marginRight: 6 }} />
              נוצר: {new Date(link.creationDate).toLocaleString()}
            </Typography>
            {link.expirationDate && (
              <Typography sx={{ color: "#aaa" }}>
                <FaClock style={{ marginRight: 6 }} />
                פג תוקף: {new Date(link.expirationDate).toLocaleString()}
              </Typography>
            )}
            <Typography sx={{ color: "#aaa" }}>
              <FaDownload style={{ marginRight: 6 }} />
              הורדות: {link.currentDownloadCount} / {link.downloadLimit ?? "∞"}
            </Typography>


            <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
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
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>

  )
}

//export default ProtectedLink
