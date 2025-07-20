// import { useEffect, useState } from "react";
// import axios from "axios";

// interface ProtectedLink {
//   linkId: number;
//   fileId: number;
//   userId: number;
//   creationDate: string;
//   expirationDate?: string;
//   isOneTimeUse: boolean;
//   downloadLimit?: number;
//   currentDownloadCount: number;
//   linkid_hash: string; // Assuming this is a string based on your previous code
// }

// interface Props {
//   fileId: number;
// }

// const ProtectedLink = ({ fileId }: Props) => {
//   const [links, setLinks] = useState<ProtectedLink[]>([]);
//   const [newLink, setNewLink] = useState({
//     password: "",
//     isOneTimeUse: false,
//     downloadLimit: 1,
//   });
//   const [editingLink, setEditingLink] = useState<ProtectedLink | null>(null);

//   const authToken = sessionStorage.getItem("authToken");

//   useEffect(() => {
//     fetchLinks();
//   }, [fileId]);

//   const fetchLinks = async () => {
//     try {
//       const response = await axios.get<ProtectedLink[]>(
//         `https://filessafeshare-1.onrender.com/api/ProtectedLink/file/${fileId}`,
//         { headers: { Authorization: `Bearer ${authToken}` } }
//       );
//       setLinks(response.data);
//     } catch (error) {
//       console.error("Error fetching protected links:", error);
//     }
//   };

//   const addLink = async () => {
//     try {
//       const token = sessionStorage.getItem('authToken');
//       const requestData = {
//         fileId,
//         password: newLink.password,
//         isOneTimeUse: newLink.isOneTimeUse,
//         downloadLimit: newLink.downloadLimit,// אם undefined, זה עדיין חוקי כי זה nullable בצד שרת
//       };
//       //const response = 
//       await axios.post(
//         `https://filessafeshare-1.onrender.com/api/ProtectedLink/generate`,
//         requestData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       fetchLinks();
//       setNewLink({ password: "", isOneTimeUse: false, downloadLimit: 1 });
//     } catch (error) {
//       console.error("Error adding link:", error);
//     }
//   };

//   const deleteLink = async (linkId: number) => {
//     try {
//       await axios.delete(
//         `https://filessafeshare-1.onrender.com/api/ProtectedLink/${linkId}`,
//         { headers: { Authorization: `Bearer ${authToken}` } }
//       );
//       fetchLinks();
//     } catch (error) {
//       console.error("Error deleting link:", error);
//     }
//   };

//   const updateLink = async () => {
//     if (!editingLink) return;

//     try {
//       await axios.put(
//         `https://filessafeshare-1.onrender.com/api/ProtectedLink/${editingLink.linkId}`,
//         {
//           expirationDate: editingLink.expirationDate,
//           downloadLimit: editingLink.downloadLimit,
//         },
//         { headers: { Authorization: `Bearer ${authToken}` } }
//       );
//       setEditingLink(null);
//       fetchLinks();
//     } catch (error) {
//       console.error("Error updating link:", error);
//     }
//   };

//   return (
//     <div className="p-4 bg-black text-white rounded-lg">
//       <h2 className="text-xl font-bold text-red-500 mb-4">לינקים מוגנים</h2>

//       {/* טופס להוספת לינק חדש */}
//       <div className="mb-4 p-3 border border-red-500 rounded-lg">
//         <h3 className="text-red-400">הוספת לינק חדש</h3>
//         <input
//           type="password"
//           placeholder="סיסמה"
//           className="w-full p-2 my-2 bg-gray-800 text-white border border-red-500 rounded"
//           value={newLink.password}
//           onChange={(e) => setNewLink({ ...newLink, password: e.target.value })}
//         />
//         <input
//           type="number"
//           placeholder="מגבלת הורדות"
//           className="w-full p-2 my-2 bg-gray-800 text-white border border-red-500 rounded"
//           value={newLink.downloadLimit}
//           onChange={(e) =>
//             setNewLink({ ...newLink, downloadLimit: parseInt(e.target.value) })
//           }
//         />
//         <label className="flex items-center text-red-400">
//           <input
//             type="checkbox"
//             className="mr-2"
//             checked={newLink.isOneTimeUse}
//             onChange={(e) =>
//               setNewLink({ ...newLink, isOneTimeUse: e.target.checked })
//             }
//           />
//           חד פעמי
//         </label>
//         <button
//           onClick={addLink}
//           className="mt-2 p-2 w-full bg-red-500 hover:bg-red-700 rounded"
//         >
//           צור לינק
//         </button>
//       </div>

//       {/* רשימת לינקים */}
//       {links.length === 0 ? (
//         <p className="text-gray-400">אין לינקים זמינים</p>
//       ) : (
//         <ul>
//           {links.map((link) => (
//             <li
//               key={link.linkId}
//               className="p-3 my-2 border border-red-500 rounded-lg bg-gray-900 flex justify-between items-center"
//             >
//               <div>
//                 <p>
//                   <span className="text-red-400">לינק:</span> {link.linkId}
//                 </p>
//                 <p>
//                   <span className="text-red-400">תאריך יצירה:</span>{" "}
//                   {new Date(link.creationDate).toLocaleString()}
//                 </p>
//                 {link.expirationDate && (
//                   <p>
//                     <span className="text-red-400">תוקף:</span>{" "}
//                     {new Date(link.expirationDate).toLocaleString()}
//                   </p>
//                 )}
//                 <p>
//                   <span className="text-red-400">מגבלת הורדות:</span>{" "}
//                   {link.downloadLimit || "לא מוגבל"}
//                 </p>
//                 <p>
//                   <span className="text-red-400">מספר הורדות:</span>{" "}
//                   {link.currentDownloadCount}
//                 </p>
//                 <p>
//                   <span className="text-red-400">לינק:</span>{" "}
//                   https://safesharereact.onrender.com/download/{link.linkid_hash}
//                 </p>
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setEditingLink(link)}
//                   className="p-2 bg-yellow-500 hover:bg-yellow-700 rounded"
//                 >
//                   ערוך
//                 </button>
//                 <button
//                   onClick={() => deleteLink(link.linkId)}
//                   className="p-2 bg-red-600 hover:bg-red-800 rounded"
//                 >
//                   מחק
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}

//       {/* עריכת לינק */}
//       {editingLink && (
//         <div className="mt-4 p-3 border border-yellow-500 rounded-lg bg-gray-800">
//           <h3 className="text-yellow-400">עריכת לינק</h3>
//           <input
//             type="datetime-local"
//             className="w-full p-2 my-2 bg-gray-900 text-white border border-yellow-500 rounded"
//             value={editingLink.expirationDate?.split(".")[0] || ""}
//             onChange={(e) =>
//               setEditingLink({ ...editingLink, expirationDate: e.target.value })
//             }
//           />
//           <input
//             type="number"
//             placeholder="מגבלת הורדות"
//             className="w-full p-2 my-2 bg-gray-900 text-white border border-yellow-500 rounded"
//             value={editingLink.downloadLimit || ""}
//             onChange={(e) =>
//               setEditingLink({
//                 ...editingLink,
//                 downloadLimit: parseInt(e.target.value),
//               })
//             }
//           />
//           <button
//             onClick={updateLink}
//             className="mt-2 p-2 w-full bg-yellow-500 hover:bg-yellow-700 rounded"
//           >
//             שמור שינויים
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProtectedLink;
import { useEffect, useState } from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
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
  FaSave,
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

interface Props {
  fileId: number
}

const ProtectedLink = ({ fileId }: Props) => {
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

  const updateLink = async () => {
    if (!editingLink) return

    try {
      await axios.put(
        `https://filessafeshare-1.onrender.com/api/ProtectedLink/update/${editingLink.linkId}`,
        {
          fileId: editingLink.fileId,
          expirationDate: editingLink.expirationDate,
          isOneTimeUse: editingLink.isOneTimeUse,
          downloadLimit: editingLink.downloadLimit,
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      )
      setEditingLink(null)
      fetchLinks()
    } catch (error) {
      console.error("Error updating link:", error)
    }
  }

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

export default ProtectedLink
