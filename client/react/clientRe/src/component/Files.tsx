import { useState, useEffect } from "react"
import {
  Container,
  Box,
  Typography,
  Button,
  List,
  IconButton,
  Divider,
  Modal,
  Tooltip,
  Fade,
  Backdrop,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@mui/material"
import {
  FaFileUpload,
  FaShieldAlt,
  FaTrash,
  FaEdit,
  FaLink,
  FaSearch,
  FaSort,
  FaFilter,
  FaDownload,
  FaEye,
  FaLock,
  FaListUl,
} from "react-icons/fa"
import axios from "axios"
import ProtectedLink from "./ProtectedLink"
import { motion } from "framer-motion"
import { Outlet, useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { FileProvider, useFileContext } from "./FileContext"

interface FileItem {
  fileId: number
  fileName: string
  downloadCount: number
  uploadDate?: string // Adding date for sorting
  fileSize?: number // Adding size for information
}

export default function Files() {
  //const [files, setFiles] = useState<FileItem[]>([])
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([])
  const [openLinksModal, setOpenLinksModal] = useState(false)
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const { files, setFiles, setSelectedFile } = useFileContext();

  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  useEffect(() => {
    fetchFiles()
  }, [])

  useEffect(() => {
    // Filter files based on search term
    const filtered = files.filter((file) => file.fileName.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredFiles(filtered)
  }, [searchTerm, files])

  const fetchFiles = async () => {
    setIsLoading(true)
    const userId = sessionStorage.getItem("userId")
    const authToken = sessionStorage.getItem("authToken")

    if (!authToken) {
      console.error("No auth token found")
      setIsLoading(false)
      return
    }

    try {
      const response = await axios.get(`https://filessafeshare-1.onrender.com/api/File/user/${userId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })

      // Add mock data for demo purposes
      const filesWithMeta = response.data.map((file: FileItem) => ({
        ...file,
        uploadDate: file.uploadDate || new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        fileSize: file.fileSize || Math.floor(Math.random() * 10000000),
      }))

      setFiles(filesWithMeta)
      setFilteredFiles(filesWithMeta)
    } catch (error) {
      console.error("Error fetching files:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenLinks = (fileId: number) => {
    setSelectedFileId(fileId)
    setOpenLinksModal(true)
  }

  const handleDeleteFile = async (fileId: number) => {
    setDeleteConfirmId(fileId)
  }

  const confirmDelete = async () => {
    if (!deleteConfirmId) return

    try {

      await axios.delete(`https://filessafeshare-1.onrender.com/api/File?fileId=${deleteConfirmId}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("authToken")}` }
      });
      const newFiles = files.filter(file => file.fileId !== deleteConfirmId);

      // Optimistic UI update
      setFiles(newFiles);
      setFilteredFiles((prev) => prev.filter((file) => file.fileId !== deleteConfirmId))
    } catch (error) {
      console.error("Error deleting file:", error)
    } finally {
      setDeleteConfirmId(null)
    }
  }

  const sortFiles = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc"
    setSortOrder(newOrder)

    const sorted = [...filteredFiles].sort((a, b) => {
      if (newOrder === "asc") {
        return a.fileName.localeCompare(b.fileName)
      } else {
        return b.fileName.localeCompare(a.fileName)
      }
    })

    setFilteredFiles(sorted)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const renderFileList = () => {
    if (viewMode === "list") {
      return (    

        <List sx={{ width: "100%", overflow: "auto", maxHeight: "calc(100vh - 250px)" }}>
          <AnimatePresence>
            {filteredFiles.map((file) => (
              <motion.div
                key={file.fileId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "8px",
                    p: 2,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.3s ease",
                    border: "1px solid rgba(255, 65, 108, 0.1)",
                    "&:hover": {
                      background: "rgba(255, 65, 108, 0.1)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(255, 65, 108, 0.2)",
                    },
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
                      <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
                        {file.fileName}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
                        <Typography
                          variant="body2"
                          sx={{ color: "#ff416c", display: "flex", alignItems: "center", gap: 0.5 }}
                        >
                          <FaDownload size={12} /> {file.downloadCount} downloads
                        </Typography>
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
                    <Tooltip title="Show protected links" arrow>
                      <IconButton
                        sx={{
                          color: "#ff416c",
                          transition: "all 0.2s",
                          "&:hover": {
                            background: "rgba(255, 65, 108, 0.2)",
                            transform: "scale(1.1)",
                          },
                        }}
                        // onClick={() => handleOpenLinks(file.fileId)}
                        onClick={() => {navigate(`:${file.fileId}`); setSelectedFile(file)}}

                      >
                        <FaListUl /> {/* או FaLink גם בסדר אם רוצים משהו שמזכיר קישורים */}
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Generate Link" arrow>
                      <IconButton
                        sx={{
                          color: "#ff416c",
                          transition: "all 0.2s",
                          "&:hover": {
                            background: "rgba(255, 65, 108, 0.2)",
                            transform: "scale(1.1)",
                          },
                        }}
                        onClick={() => {navigate(`:${file.fileId}`); setSelectedFile(file)}}
                      >
                        <FaLink />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit File" arrow>
                      <IconButton
                        sx={{
                          color: "#ff416c",
                          transition: "all 0.2s",
                          "&:hover": {
                            background: "rgba(255, 65, 108, 0.2)",
                            transform: "scale(1.1)",
                          },
                        }}
                        onClick={() => {navigate(`:${file.fileId}`); setSelectedFile(file)}}
                      >
                        <FaEdit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete File" arrow>
                      <IconButton
                        sx={{
                          color: "#ff4b2b",
                          transition: "all 0.2s",
                          "&:hover": {
                            background: "rgba(255, 75, 43, 0.2)",
                            transform: "scale(1.1)",
                          },
                        }}
                        onClick={() => handleDeleteFile(file.fileId)}
                      >
                        <FaTrash />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Paper>
              </motion.div>
            ))}
          </AnimatePresence>
        </List>
)
    } else {
      return (    

        <Grid container spacing={2} sx={{ mt: 1, maxHeight: "calc(100vh - 250px)", overflow: "auto" }}>
          <AnimatePresence>
            {filteredFiles.map((file) => (
              <Grid item xs={12} sm={6} md={4} key={file.fileId}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    sx={{
                      background: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "8px",
                      transition: "all 0.3s ease",
                      border: "1px solid rgba(255, 65, 108, 0.1)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        background: "rgba(255, 65, 108, 0.1)",
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 16px rgba(255, 65, 108, 0.2)",
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: "50%",
                            background: "rgba(255, 65, 108, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FaLock style={{ color: "#ff416c" }} />
                        </Box>
                        <Typography variant="h6" sx={{ color: "white", fontWeight: "bold", wordBreak: "break-word" }}>
                          {file.fileName}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ color: "#ff416c", display: "flex", alignItems: "center", gap: 0.5 }}
                        >
                          <FaDownload size={12} /> {file.downloadCount} downloads
                        </Typography>
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
                    </CardContent>
                    <CardActions sx={{ justifyContent: "center", gap: 1, p: 2 }}>
                      <Tooltip title="Generate Link" arrow>
                        <IconButton
                          size="small"
                          sx={{
                            color: "#ff416c",
                            transition: "all 0.2s",
                            "&:hover": {
                              background: "rgba(255, 65, 108, 0.2)",
                              transform: "scale(1.1)",
                            },
                          }}
                        onClick={() => {navigate(`:${file.fileId}`); setSelectedFile(file)}}
                        >
                          <FaLink />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit File" arrow>
                        <IconButton
                          size="small"
                          sx={{
                            color: "#ff416c",
                            transition: "all 0.2s",
                            "&:hover": {
                              background: "rgba(255, 65, 108, 0.2)",
                              transform: "scale(1.1)",
                            },
                          }}
                        onClick={() => {navigate(`:${file.fileId}`); setSelectedFile(file)}}
                        >
                          <FaEdit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete File" arrow>
                        <IconButton
                          size="small"
                          sx={{
                            color: "#ff4b2b",
                            transition: "all 0.2s",
                            "&:hover": {
                              background: "rgba(255, 75, 43, 0.2)",
                              transform: "scale(1.1)",
                            },
                          }}
                          onClick={() => { handleDeleteFile(file.fileId) }}
                        >
                          <FaTrash />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
)
    }
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        background: "linear-gradient(135deg, #121212 0%, #1e1e1e 100%)",
        color: "white",
        p: { xs: 2, md: 4 },
        boxShadow: "0px 0px 20px rgba(255, 65, 108, 0.5)",
        minHeight: "100vh",
        minWidth: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 0,
        margin: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "center", md: "flex-start" },
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          sx={{
            mb: { xs: 2, md: 0 },
            fontWeight: "bold",
            color: "#ff416c",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <FaShieldAlt /> SafeShare - File Manager
        </Typography>

        <Button
          variant="contained"
          sx={{
            background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 4px 8px rgba(255, 65, 108, 0.5)",
            },
          }}
          onClick={() => navigate("upload")}
        >
          <FaFileUpload style={{ marginRight: "8px" }} /> Upload File
        </Button>
      </Box>

      <Paper
        sx={{
          p: 2,
          mb: 3,
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "8px",
          border: "1px solid rgba(255, 65, 108, 0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              position: "relative",
              flex: 1,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <FaSearch style={{ position: "absolute", left: "10px", color: "#ff416c" }} />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 10px 10px 35px",
                borderRadius: "8px",
                border: "1px solid rgba(255, 65, 108, 0.3)",
                background: "rgba(0, 0, 0, 0.2)",
                color: "white",
                outline: "none",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px rgba(255, 65, 108, 0.3)")}
              onBlur={(e) => (e.target.style.boxShadow = "none")}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              width: { xs: "100%", sm: "auto" },
              justifyContent: { xs: "center", sm: "flex-start" },
            }}
          >
            <Tooltip title={`Sort ${sortOrder === "asc" ? "Z-A" : "A-Z"}`} arrow>
              <Button
                variant="outlined"
                size="small"
                startIcon={<FaSort />}
                onClick={sortFiles}
                sx={{
                  borderColor: "#ff416c",
                  color: "#ff416c",
                  "&:hover": {
                    borderColor: "#ff4b2b",
                    background: "rgba(255, 65, 108, 0.1)",
                  },
                }}
              >
                {isMobile ? "" : "Sort"}
              </Button>
            </Tooltip>

            <Tooltip title={viewMode === "list" ? "Grid View" : "List View"} arrow>
              <Button
                variant="outlined"
                size="small"
                startIcon={viewMode === "list" ? <FaEye /> : <FaList />}
                onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
                sx={{
                  borderColor: "#ff416c",
                  color: "#ff416c",
                  "&:hover": {
                    borderColor: "#ff4b2b",
                    background: "rgba(255, 65, 108, 0.1)",
                  },
                }}
              >
                {isMobile ? "" : viewMode === "list" ? "Grid" : "List"}
              </Button>
            </Tooltip>

            <Tooltip title="Filter Options" arrow>
              <Button
                variant="outlined"
                size="small"
                startIcon={<FaFilter />}
                sx={{
                  borderColor: "#ff416c",
                  color: "#ff416c",
                  "&:hover": {
                    borderColor: "#ff4b2b",
                    background: "rgba(255, 65, 108, 0.1)",
                  },
                }}
              >
                {isMobile ? "" : "Filter"}
              </Button>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      <Divider sx={{ background: "linear-gradient(90deg, transparent, #ff416c, transparent)", mb: 3, opacity: 0.5 }} />

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
          <CircularProgress sx={{ color: "#ff416c" }} />
        </Box>
      ) : filteredFiles.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            background: "rgba(255, 255, 255, 0.03)",
            borderRadius: "8px",
            border: "1px dashed rgba(255, 65, 108, 0.3)",
          }}
        >
          <FaFileUpload style={{ fontSize: "48px", color: "#ff416c", marginBottom: "16px", opacity: 0.5 }} />
          <Typography variant="h6" sx={{ color: "#fff", mb: 1 }}>
            No files found
          </Typography>
          <Typography variant="body2" sx={{ color: "#aaa", mb: 3, textAlign: "center" }}>
            {searchTerm ? "No files match your search criteria" : "Upload your first file to get started"}
          </Typography>
          {!searchTerm && (
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 8px rgba(255, 65, 108, 0.5)",
                },
              }}
              onClick={() => navigate("upload")}
            >
              <FaFileUpload style={{ marginRight: "8px" }} /> Upload File
            </Button>
          )}
        </Box>
 ) : (              

        renderFileList()
  )}




      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={deleteConfirmId !== null}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#121212",
              padding: "24px",
              borderRadius: "10px",
              boxShadow: "0px 0px 20px rgba(255, 65, 108, 0.5)",
              width: "90%",
              maxWidth: "400px",
              border: "1px solid rgba(255, 65, 108, 0.3)",
              outline: "none",
              textAlign: "center",
            }}
          >
            <FaTrash style={{ fontSize: "36px", color: "#ff4b2b", marginBottom: "16px" }} />
            <Typography variant="h6" sx={{ mb: 2, color: "white" }}>
              Delete File
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: "#aaa" }}>
              Are you sure you want to delete this file? This action cannot be undone.
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setDeleteConfirmId(null)}
                sx={{
                  borderColor: "#aaa",
                  color: "#aaa",
                  "&:hover": {
                    borderColor: "white",
                    background: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={confirmDelete}
                sx={{
                  background: "#ff4b2b",
                  "&:hover": {
                    background: "#ff3b1b",
                  },
                }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      <Outlet />
    </Container>
  )
}

// Helper component for the FaList icon
function FaList(props: any) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 512 512"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M80 368H16a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16zm0-320H16A16 16 0 0 0 0 64v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16zm0 160H16a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16zm416 176H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z"></path>
    </svg>
  )
}
