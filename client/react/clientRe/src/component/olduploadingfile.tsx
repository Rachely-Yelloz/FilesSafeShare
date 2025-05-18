
// // import { useState } from "react";
// // import { TextField, Button, FormControlLabel, Checkbox, Box, Typography } from "@mui/material";
// // import { FaFileUpload, FaLink } from "react-icons/fa";
// // import { motion } from "framer-motion";
// // import encryptFile from "../encryptFile";
// // import axios from "axios";
// // import { generateProtectedLink, uploadFileToDb, uploadFileToS3 } from "../uploadfileLogic";

// // export default function UploadFile({ onClose }: { onClose: () => void }) {
// //     const [fileName, setFileName] = useState("");
// //     const [selectedFile, setSelectedFile] = useState<File | null>(null);
// //     const [password, setPassword] = useState("");
// //     const [expirationDate, setExpirationDate] = useState("");
// //     const [isOneTimeUse, setIsOneTimeUse] = useState(false);
// //     const [downloadLimit, setDownloadLimit] = useState<number | 1>(1);
// //     const [generatedLink, setGeneratedLink] = useState("");
// //     const [error, setError] = useState<boolean>(false);

// //     const handleFileUpload = async () => {
// //         if (!fileName || !selectedFile || !password || !expirationDate) {
// //             setError(true);
// //             return;
// //         }
// //         console.log("Uploading file:", fileName);
// //         const fileandkeys = await encryptFile(selectedFile)
// //         try {
// //             const response = await axios.get('https://filessafeshare-1.onrender.com/api/UploadFile/presigned-url', {
// //                 params: {
// //                     fileName: fileName, // שליחה של שם הקובץ
// //                 },
// //                 headers: {
// //                     Authorization: `Bearer ${sessionStorage.getItem('authToken')}` // הוספת טוקן מהסשן או המקומי, תלוי בהגדרות
// //                 }
// //             });
// //             const { uploadUrl, fileUrl, fileKey } = response.data;
// //             const encryptedBlob = new Blob([fileandkeys.ciphertext], { type: "application/octet-stream" });
// //             const s3url = await uploadFileToS3(uploadUrl, encryptedBlob);
// //             const fileId = await uploadFileToDb(fileName, s3url, fileandkeys.key, fileandkeys.nonce);

// //             const generatedLink = await generateProtectedLink(fileId, password, isOneTimeUse, downloadLimit);
// //             setGeneratedLink(generatedLink);
// //             console.log("File uploaded successfully:", fileId);


// //         }
// //         catch (error) {
// //             console.error('Error fetching presigned URL:', error);
// //             return null;
// //         }

// //         setError(false);
// //     };

// //     return (
// //         <Box
// //             sx={{
// //                 position: "fixed",
// //                 top: 0,
// //                 left: 0,
// //                 width: "100vw",
// //                 height: "100vh",
// //                 background: "rgba(0, 0, 0, 0.5)",
// //                 backdropFilter: "blur(10px)",
// //                 display: "flex",
// //                 alignItems: "center",
// //                 justifyContent: "center",
// //                 zIndex: 1300
// //             }}
// //             onClick={onClose} // סגירה בלחיצה מחוץ לפופאפ
// //         >
// //             <motion.div
// //                 initial={{ opacity: 0, scale: 0.8 }}
// //                 animate={{ opacity: 1, scale: 1 }}
// //                 exit={{ opacity: 0, scale: 0.8 }}
// //                 transition={{ duration: 0.3, ease: "easeOut" }}
// //                 onClick={(e) => e.stopPropagation()} // מונע סגירה בלחיצה בתוך הפופאפ
// //             >
// //                 <Box sx={{
// //                     background: "#121212",
// //                     color: "white",
// //                     p: 4,
// //                     borderRadius: 2,
// //                     boxShadow: "0px 0px 20px rgba(255, 65, 108, 0.5)",
// //                     maxWidth: 500,
// //                     display: "flex",
// //                     flexDirection: "column",
// //                     gap: 2
// //                 }}>
// //                     <Typography component="h1" variant="h4" sx={{
// //                         mb: 3,
// //                         fontWeight: 'bold',
// //                         color: '#ff416c',
// //                         display: 'flex',
// //                         alignItems: 'center',
// //                         justifyContent: 'center',
// //                         gap: 1
// //                     }}>
// //                         {/* <FaShieldAlt />  */}
// //                         Upload new fileeeeeeeeeee
// //                     </Typography>

// //                     <TextField
// //                         label="File Name"
// //                         variant="outlined"
// //                         fullWidth
// //                         required
// //                         error={error && !fileName}
// //                         sx={{ input: { color: "white" }, label: { color: "#bbb" } }}
// //                         value={fileName}
// //                         onChange={(e) => setFileName(e.target.value)}
// //                     />

// //                     <input type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} style={{ display: "none" }} id="file-upload" />
// //                     <label htmlFor="file-upload">
// //                         <Button variant="contained" component="span" sx={{ background: "linear-gradient(135deg, #ff416c, #ff4b2b)", width: "100%" }}>
// //                             <FaFileUpload style={{ marginRight: "8px" }} /> Choose File
// //                         </Button>
// //                     </label>

// //                     <TextField
// //                         label="Password"
// //                         type="password"
// //                         variant="outlined"
// //                         fullWidth
// //                         required
// //                         error={error && !password}
// //                         sx={{ input: { color: "white" }, label: { color: "#bbb" } }}
// //                         value={password}
// //                         onChange={(e) => setPassword(e.target.value)}
// //                     />

// //                     <TextField
// //                         label="Expiration Date"
// //                         type="date"
// //                         variant="outlined"
// //                         fullWidth
// //                         required
// //                         error={error && !expirationDate}
// //                         InputLabelProps={{ shrink: true }}
// //                         sx={{ input: { color: "white" }, label: { color: "#bbb" } }}
// //                         value={expirationDate}
// //                         onChange={(e) => setExpirationDate(e.target.value)}
// //                     />

// //                     <FormControlLabel
// //                         control={<Checkbox checked={isOneTimeUse} onChange={(e) => setIsOneTimeUse(e.target.checked)} sx={{ color: "#ff416c" }} />}
// //                         label="One-time use only"
// //                         sx={{ color: "#bbb" }}
// //                     />

// //                     {!isOneTimeUse && (
// //                         <TextField
// //                             label="Download Limit"
// //                             type="number"
// //                             variant="outlined"
// //                             fullWidth
// //                             value={downloadLimit}
// //                             onChange={(e) => setDownloadLimit(e.target.value === "" ? 1 : parseInt(e.target.value, 10))}
// //                         />
// //                     )}

// //                     <Button variant="contained" sx={{ background: "linear-gradient(135deg, #ff416c, #ff4b2b)", width: "100%" }} onClick={handleFileUpload}>
// //                         Upload File
// //                     </Button>

// //                     {generatedLink && (
// //                         <Box sx={{ mt: 2, p: 2, background: "rgba(255, 255, 255, 0.1)", borderRadius: "8px", textAlign: "center" }}>
// //                             <Typography variant="body1" sx={{ color: "#fff" }}>
// //                                 <FaLink style={{ marginRight: "8px" }} />
// //                                 <a href={generatedLink} target="_blank" rel="noopener noreferrer" style={{ color: "#ff416c", textDecoration: "none" }}>
// //                                     {generatedLink}
// //                                 </a>
// //                             </Typography>
// //                         </Box>
// //                     )}

// //                     <Button variant="outlined" sx={{ borderColor: "#ff416c", color: "#ff416c", mt: 2 }} onClick={onClose}>
// //                         Close
// //                     </Button>
// //                 </Box>
// //             </motion.div>
// //         </Box>
// //     );
// // }
// import { useState } from "react";
// import {
//   TextField,
//   Button,
//   FormControlLabel,
//   Checkbox,
//   Box,
//   Typography,
// } from "@mui/material";
// import { FaFileUpload, FaLink } from "react-icons/fa";
// import { motion } from "framer-motion";
// import encryptFile from "../encryptFile";
// import axios from "axios";
// import {
//   generateProtectedLink,
//   uploadFileToDb,
//   uploadFileToS3,
// } from "../uploadfileLogic";

// export default function UploadFile({ onClose }: { onClose: () => void }) {
//   const [fileName, setFileName] = useState("");
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [password, setPassword] = useState("");
//   const [expirationDate, setExpirationDate] = useState("");
//   const [isOneTimeUse, setIsOneTimeUse] = useState(false);
//   const [downloadLimit, setDownloadLimit] = useState<number | 1>(1);
//   const [generatedLink, setGeneratedLink] = useState("");
//   const [error, setError] = useState<boolean>(false);

//   const handleFileUpload = async () => {
//     if (!fileName || !selectedFile || !password || !expirationDate) {
//       setError(true);
//       return;
//     }
//     const fileandkeys = await encryptFile(selectedFile);
//     try {
//       const response = await axios.get(
//         "https://filessafeshare-1.onrender.com/api/UploadFile/presigned-url",
//         {
//           params: { fileName },
//           headers: {
//             Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
//           },
//         }
//       );
//       const { uploadUrl, fileUrl, fileKey } = response.data;
//       const encryptedBlob = new Blob([fileandkeys.ciphertext], {
//         type: "application/octet-stream",
//       });
//       const s3url = await uploadFileToS3(uploadUrl, encryptedBlob);
//       const fileId = await uploadFileToDb(
//         fileName,
//         s3url,
//         fileandkeys.key,
//         fileandkeys.nonce
//       );

//       const link = await generateProtectedLink(
//         fileId,
//         password,
//         isOneTimeUse,
//         downloadLimit
//       );
//       setGeneratedLink(link);
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     }

//     setError(false);
//   };

//   return (
//     <Box
//       sx={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100vw",
//         height: "100vh",
//         background: "rgba(0, 0, 0, 0.5)",
//         backdropFilter: "blur(10px)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         zIndex: 1300,
//       }}
//       onClick={onClose}
//     >
//       <motion.div
//         initial={{ opacity: 0, scale: 0.85 }}
//         animate={{ opacity: 1, scale: 1 }}
//         exit={{ opacity: 0, scale: 0.85 }}
//         transition={{ duration: 0.3, ease: "easeOut" }}
//         onClick={(e) => e.stopPropagation()}
//         style={{
//           background: "#121212",
//           color: "white",
//           padding: "32px",
//           borderRadius: "16px",
//           boxShadow: "0px 0px 20px rgba(255, 65, 108, 0.5)",
//           maxWidth: "500px",
//           width: "90%",
//           display: "flex",
//           flexDirection: "column",
//           gap: "16px",
//         }}
//       >
//         <Typography
//           component="h1"
//           variant="h4"
//           sx={{
//             fontWeight: "bold",
//             color: "#ff416c",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: 1,
//             mb: 2,
//           }}
//         >
//           Upload new file
//         </Typography>

//         <TextField
//           label="File Name"
//           variant="outlined"
//           fullWidth
//           required
//           error={error && !fileName}
//           sx={{ input: { color: "white" }, label: { color: "#bbb" } }}
//           value={fileName}
//           onChange={(e) => setFileName(e.target.value)}
//         />

//         <input
//           type="file"
//           onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
//           style={{ display: "none" }}
//           id="file-upload"
//         />
//         <label htmlFor="file-upload">
//           <Button
//             variant="contained"
//             component="span"
//             sx={{
//               background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
//               width: "100%",
//             }}
//           >
//             <FaFileUpload style={{ marginRight: "8px" }} /> Choose File
//           </Button>
//         </label>

//         <TextField
//           label="Password"
//           type="password"
//           variant="outlined"
//           fullWidth
//           required
//           error={error && !password}
//           sx={{ input: { color: "white" }, label: { color: "#bbb" } }}
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <TextField
//           label="Expiration Date"
//           type="date"
//           variant="outlined"
//           fullWidth
//           required
//           error={error && !expirationDate}
//           InputLabelProps={{ shrink: true }}
//           sx={{ input: { color: "white" }, label: { color: "#bbb" } }}
//           value={expirationDate}
//           onChange={(e) => setExpirationDate(e.target.value)}
//         />

//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={isOneTimeUse}
//               onChange={(e) => setIsOneTimeUse(e.target.checked)}
//               sx={{ color: "#ff416c" }}
//             />
//           }
//           label="One-time use only"
//           sx={{ color: "#bbb" }}
//         />

//         {!isOneTimeUse && (
//           <TextField
//             label="Download Limit"
//             type="number"
//             variant="outlined"
//             fullWidth
//             value={downloadLimit}
//             sx={{ input: { color: "white" }, label: { color: "#bbb" } }}

//             onChange={(e) =>
//               setDownloadLimit(
//                 e.target.value === "" ? 1 : parseInt(e.target.value, 10)
//               )
//             }
//           />
//         )}

//         <Button
//           variant="contained"
//           sx={{
//             background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
//             width: "100%",
//           }}
//           onClick={handleFileUpload}
//         >
//           Upload File
//         </Button>

//         {generatedLink && (
//           <Box
//             sx={{
//               mt: 2,
//               p: 2,
//               background: "rgba(255, 255, 255, 0.1)",
//               borderRadius: "8px",
//               textAlign: "center",
//             }}
//           >
//             <Typography variant="body1" sx={{ color: "#fff" }}>
//               <FaLink style={{ marginRight: "8px" }} />
//               <a
//                 href={generatedLink}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 style={{
//                   color: "#ff416c",
//                   textDecoration: "none",
//                   wordBreak: "break-all",
//                 }}
//               >
//                 {generatedLink}
//               </a>
//             </Typography>
//           </Box>
//         )}

//         <Button
//           variant="outlined"
//           sx={{ borderColor: "#ff416c", color: "#ff416c", mt: 2 }}
//           onClick={onClose}
//         >
//           Close
//         </Button>
//       </motion.div>
//     </Box>
//   );
// }






// import { useState } from "react"
// import {
//   TextField,
//   Button,
//   FormControlLabel,
//   Checkbox,
//   Box,
//   Typography,
//   CircularProgress,
//   Tooltip,
//   IconButton,
//   InputAdornment,
// } from "@mui/material"
// import { FaFileUpload, FaLink, FaEye, FaEyeSlash, FaCopy, FaLock } from "react-icons/fa"
// import encryptFile from "../encryptFile"
// import axios from "axios"
// import { generateProtectedLink, uploadFileToDb, uploadFileToS3 } from "../uploadfileLogic"
// import { Link } from "react-router-dom"

// export default function UploadFile{
//   const [fileName, setFileName] = useState("")
//   const [selectedFile, setSelectedFile] = useState<File | null>(null)
//   const [password, setPassword] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
//   const [expirationDate, setExpirationDate] = useState("")
//   const [isOneTimeUse, setIsOneTimeUse] = useState(false)
//   const [downloadLimit, setDownloadLimit] = useState<number | 1>(1)
//   const [generatedLink, setGeneratedLink] = useState("")
//   const [error, setError] = useState<boolean>(false)
//   const [isUploading, setIsUploading] = useState(false)
//   const [uploadProgress, setUploadProgress] = useState(0)
//   const [linkCopied, setLinkCopied] = useState(false)

//   const handleFileUpload = async () => {
//     if (!fileName || !selectedFile || !password || !expirationDate) {
//       setError(true)
//       return
//     }

//     setIsUploading(true)
//     setUploadProgress(10)

//     try {
//       // Simulate progress for better UX
//       const progressInterval = setInterval(() => {
//         setUploadProgress((prev) => Math.min(prev + 5, 90))
//       }, 300)

//       const fileandkeys = await encryptFile(selectedFile)
//       setUploadProgress(40)

//       const response = await axios.get("https://filessafeshare-1.onrender.com/api/UploadFile/presigned-url", {
//         params: { fileName },
//         headers: {
//           Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
//         },
//       })

//       setUploadProgress(60)

//       //const { uploadUrl, fileUrl, fileKey } = response.data//////////////////////////////////////////
//       const encryptedBlob = new Blob([fileandkeys.ciphertext], {
//         type: "application/octet-stream",
//       })

//       const s3url = 'example-s3-url' // Replace with actual S3 URL
//       //await uploadFileToS3(uploadUrl, encryptedBlob)///////////////////////////////////////////
//       setUploadProgress(80)

//       const fileId = await uploadFileToDb(fileName, s3url, fileandkeys.key, fileandkeys.nonce)

//       const link = await generateProtectedLink(fileId, password, isOneTimeUse, downloadLimit)

//       clearInterval(progressInterval)
//       setUploadProgress(100)
//       setGeneratedLink(link)
//       setError(false)
//     } catch (error) {
//       console.error("Error uploading file:", error)
//       setError(true)
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   const copyLinkToClipboard = () => {
//     if (generatedLink) {
//       navigator.clipboard.writeText(generatedLink)
//       setLinkCopied(true)
//       setTimeout(() => setLinkCopied(false), 2000)
//     }
//   }

//   // Calculate minimum date (today)
//   const today = new Date()
//   const minDate = today.toISOString().split("T")[0]

//   return (
//     <Box
//       sx={{
//         padding: "24px",
//         width: "100%",
//       }}
//       onClick={(e) => e.stopPropagation()}
//     >
//       <Typography
//         component="h1"
//         variant="h4"
//         sx={{
//           fontWeight: "bold",
//           color: "#ff416c",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           gap: 1,
//           mb: 3,
//         }}
//       >
//         <FaLock /> Secure Upload
//       </Typography>

//       <Box sx={{ mb: 3 }}>
//         <TextField
//           label="File Name"
//           variant="outlined"
//           fullWidth
//           required
//           error={error && !fileName}
//           helperText={error && !fileName ? "File name is required" : ""}
//           sx={{
//             mb: 2,
//             "& .MuiOutlinedInput-root": {
//               "& fieldset": {
//                 borderColor: "#ff416c",
//               },
//               "&:hover fieldset": {
//                 borderColor: "#ff4b2b",
//               },
//               "&.Mui-focused fieldset": {
//                 borderColor: "#ff416c",
//               },
//             },
//             input: { color: "white" },
//             label: { color: "#bbb" },
//           }}
//           value={fileName}
//           onChange={(e) => setFileName(e.target.value)}
//         />

//         <Box sx={{ mb: 2 }}>
//           <input
//             type="file"
//             onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
//             style={{ display: "none" }}
//             id="file-upload"
//           />
//           <label htmlFor="file-upload" style={{ width: "100%", display: "block" }}>
//             <Button
//               variant="contained"
//               component="span"
//               fullWidth
//               sx={{
//                 background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
//                 py: 1.5,
//                 transition: "all 0.3s ease",
//                 "&:hover": {
//                   transform: "translateY(-2px)",
//                   boxShadow: "0 4px 8px rgba(255, 65, 108, 0.5)",
//                 },
//               }}
//             >
//               <FaFileUpload style={{ marginRight: "8px" }} />
//               {selectedFile ? selectedFile.name : "Choose File"}
//             </Button>
//           </label>
//           {error && !selectedFile && (
//             <Typography variant="caption" sx={{ color: "#f44336", ml: 1 }}>
//               Please select a file
//             </Typography>
//           )}
//         </Box>

//         <TextField
//           label="Password"
//           type={showPassword ? "text" : "password"}
//           variant="outlined"
//           fullWidth
//           required
//           error={error && !password}
//           helperText={error && !password ? "Password is required" : ""}
//           sx={{
//             mb: 2,
//             "& .MuiOutlinedInput-root": {
//               "& fieldset": {
//                 borderColor: "#ff416c",
//               },
//               "&:hover fieldset": {
//                 borderColor: "#ff4b2b",
//               },
//               "&.Mui-focused fieldset": {
//                 borderColor: "#ff416c",
//               },
//             },
//             input: { color: "white" },
//             label: { color: "#bbb" },
//           }}
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position="end">
//                 <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: "#ff416c" }}>
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </IconButton>
//               </InputAdornment>
//             ),
//           }}
//         />

//         <TextField
//           label="Expiration Date"
//           type="date"
//           variant="outlined"
//           fullWidth
//           required
//           error={error && !expirationDate}
//           helperText={error && !expirationDate ? "Expiration date is required" : ""}
//           InputLabelProps={{ shrink: true }}
//           inputProps={{ min: minDate }}
//           sx={{
//             mb: 2,
//             "& .MuiOutlinedInput-root": {
//               "& fieldset": {
//                 borderColor: "#ff416c",
//               },
//               "&:hover fieldset": {
//                 borderColor: "#ff4b2b",
//               },
//               "&.Mui-focused fieldset": {
//                 borderColor: "#ff416c",
//               },
//             },
//             input: { color: "white" },
//             label: { color: "#bbb" },
//           }}
//           value={expirationDate}
//           onChange={(e) => setExpirationDate(e.target.value)}
//         />

//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={isOneTimeUse}
//               onChange={(e) => setIsOneTimeUse(e.target.checked)}
//               sx={{
//                 color: "#ff416c",
//                 "&.Mui-checked": {
//                   color: "#ff416c",
//                 },
//               }}
//             />
//           }
//           label="One-time use only"
//           sx={{ color: "#bbb", mb: 2 }}
//         />

//         {!isOneTimeUse && (
//           <TextField
//             label="Download Limit"
//             type="number"
//             variant="outlined"
//             fullWidth
//             value={downloadLimit}
//             inputProps={{ min: 1 }}
//             sx={{
//               mb: 2,
//               "& .MuiOutlinedInput-root": {
//                 "& fieldset": {
//                   borderColor: "#ff416c",
//                 },
//                 "&:hover fieldset": {
//                   borderColor: "#ff4b2b",
//                 },
//                 "&.Mui-focused fieldset": {
//                   borderColor: "#ff416c",
//                 },
//               },
//               input: { color: "white" },
//               label: { color: "#bbb" },
//             }}
//             onChange={(e) => setDownloadLimit(e.target.value === "" ? 1 : Number.parseInt(e.target.value, 10))}
//           />
//         )}

//         <Button
//           variant="contained"
//           fullWidth
//           disabled={isUploading}
//           sx={{
//             background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
//             py: 1.5,
//             mb: 2,
//             transition: "all 0.3s ease",
//             "&:hover": {
//               transform: "translateY(-2px)",
//               boxShadow: "0 4px 8px rgba(255, 65, 108, 0.5)",
//             },
//             "&:disabled": {
//               background: "rgba(255, 65, 108, 0.5)",
//             },
//           }}
//           onClick={handleFileUpload}
//         >
//           {isUploading ? (
//             <>
//               <CircularProgress size={24} sx={{ color: "white", mr: 1 }} />
//               Uploading {uploadProgress}%
//             </>
//           ) : (
//             <>
//               <FaFileUpload style={{ marginRight: "8px" }} /> Upload File
//             </>
//           )}
//         </Button>

//         {generatedLink && (
//           <Box
//             sx={{
//               mt: 3,
//               p: 3,
//               background: "rgba(255, 65, 108, 0.1)",
//               borderRadius: "8px",
//               textAlign: "center",
//               border: "1px solid rgba(255, 65, 108, 0.3)",
//             }}
//           >
//             <Typography variant="subtitle1" sx={{ color: "#ff416c", mb: 1, fontWeight: "bold" }}>
//               Secure Link Generated
//             </Typography>
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 background: "rgba(0, 0, 0, 0.3)",
//                 borderRadius: "4px",
//                 p: 1,
//                 mb: 1,
//               }}
//             >
//               <FaLink style={{ marginRight: "8px", color: "#ff416c" }} />
//               <Typography
//                 variant="body2"
//                 sx={{
//                   color: "#fff",
//                   wordBreak: "break-all",
//                   textAlign: "left",
//                   flex: 1,
//                   fontSize: "0.8rem",
//                 }}
//               >
//                 {generatedLink}
//               </Typography>
//               <Tooltip title={linkCopied ? "Copied!" : "Copy to clipboard"} arrow>
//                 <IconButton onClick={copyLinkToClipboard} size="small" sx={{ color: "#ff416c" }}>
//                   <FaCopy />
//                 </IconButton>
//               </Tooltip>
//             </Box>
//             <Typography variant="caption" sx={{ color: "#bbb" }}>
//               Share this link with the recipient. They will need the password to access the file.
//             </Typography>
//           </Box>
//         )}
//       </Box>

//       <Button
//         variant="outlined"
//         fullWidth
//         sx={{
//           borderColor: "#ff416c",
//           color: "#ff416c",
//           "&:hover": {
//             borderColor: "#ff4b2b",
//             backgroundColor: "rgba(255, 65, 108, 0.1)",
//           },
//         }}
//         onClick={() =>{} }
//       >
//         Close
//       </Button>
//     </Box>
//   )
// }
"use client"