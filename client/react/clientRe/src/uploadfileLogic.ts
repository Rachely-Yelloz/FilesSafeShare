import axios from "axios";

interface PresignedUrlResponse {
    uploadUrl: string;
    fileUrl: string;
    fileKey: string;
}


export async function getPresignedUrl(fileName: string): Promise<PresignedUrlResponse> {
    const authToken = sessionStorage.getItem("authToken"); // 🔐 קבלת הטוקן מה-Session Storage

    const response = await axios.get<PresignedUrlResponse>(
        `https://filessafeshare-1.onrender.com/api/UploadFile/presigned-url?fileName=${fileName}`,
        {
            headers: { Authorization: `Bearer ${authToken}` }, // 🔑 שליחת הטוקן בכותרת
        }
    );

    return response.data;
}

export async function uploadFileToS3(uploadUrl: string, encryptedFile: Blob): Promise<string> {
    await axios.put(uploadUrl, encryptedFile, {
        headers: { "Content-Type": "application/octet-stream" }
    });
    return uploadUrl.split("?")[0]; // מחזיר את הנתיב ללא הפרמטרים
}

export async function uploadFileToDb(fileName: string, storagePath: string, encryptionKey: Uint8Array, nonce: Uint8Array, filetype:string) {
    const authToken = sessionStorage.getItem("authToken"); 

    // המרה ל-Base64
    const encryptionKeyBase64 = btoa(String.fromCharCode(...encryptionKey));
    const nonceBase64 = btoa(String.fromCharCode(...nonce));

    const fileData = {
        fileName: fileName,
        storagePath: storagePath,
        encryptionKey: encryptionKeyBase64,  
        nonce: nonceBase64   ,
        fileType :filetype            
    };

    try {
        const response = await axios.post('https://filessafeshare-1.onrender.com/api/File/upload', fileData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}` 
            }
        });

        console.log('✅ File uploaded successfully:', response.data);
        return response.data;
    } catch (error:any) {
        console.error('❌ Error uploading file:', error.response ? error.response.data : error);
        throw error; 
    }
}



export async function generateProtectedLink(
  fileId: number,
  password: string,
  isOneTimeUse: boolean,
  downloadLimit?: number // אופציונלי
) {
  try {
    const token = sessionStorage.getItem('authToken');

    const requestData = {
      fileId,
      password,
      isOneTimeUse,
      downloadLimit, // אם undefined, זה עדיין חוקי כי זה nullable בצד שרת
    };

    const response = await axios.post(
      'https://filessafeshare-1.onrender.com/api/ProtectedLink/generate',
      requestData, // נשלח בגוף הבקשה
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Generated Protected Link:', response.data.link);
    return response.data.link;
  } catch (error: any) {
    console.error(
      'Error generating protected link:',
      error.response ? error.response.data : error
    );
    throw error;
  }
}
