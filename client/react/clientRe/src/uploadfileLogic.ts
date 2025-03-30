import axios from "axios";

interface PresignedUrlResponse {
    uploadUrl: string;
    fileUrl: string;
    fileKey: string;
}


export async function getPresignedUrl(fileName: string): Promise<PresignedUrlResponse> {
    const authToken = sessionStorage.getItem("authToken"); // 🔐 קבלת הטוקן מה-Session Storage

    const response = await axios.get<PresignedUrlResponse>(
        "http://localhost:5141/api/UploadFile/presigned-url",
        {
            params: { fileName }, // 📂 שליחת שם הקובץ כפרמטר
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

export async function uploadFileToDb(fileName:string, storagePath:string, encryptionKey:any, nonce:any) {
    const authToken = sessionStorage.getItem("authToken"); // 🔐 קבלת הטוקן מה-Session Storage

    // המידע שאנחנו רוצים לשלוח לשרת
    const fileData = {
        fileName: fileName,
        storagePath: storagePath,
        encryptionKey: encryptionKey,  // זה יכול להיות בייט-אריי (Uint8Array או Buffer)
        nonce: nonce                  // גם כן בייט-אריי
    };

    try {
        // קריאה ל-API ב-POST
        const response = await axios.post('http://localhost:5141/api/upload', fileData, {
            headers: {
                'Content-Type': 'application/json', // טוען את המידע כ-JSON
                 Authorization: `Bearer ${authToken}` // 🔑 שליחת הטוקן בכותרת

            }
        });

        console.log('File uploaded successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error; // מאפשר טיפול בשגיאות אחר כך
    }
}
export async function generateProtectedLink(fileId:any, password:any, isOneTimeUse:boolean, downloadLimit:number) {
    try {
        // קבלת הטוקן מ-localStorage (או מהיכן שאתה שומר אותו)
        const token = localStorage.getItem('jwtToken'); // או sessionStorage.getItem('jwtToken')

        // יצירת ה-URL עם הפרמטרים
        const url = `https://filessafeshare-1.onrender.com/api/ProtectedLink/generate?fileId=${fileId}&password=${password}&isOneTimeUse=${isOneTimeUse}&downloadLimit=${downloadLimit}`;

        // שליחת הבקשה עם הטוקן בהכרה (Authorization header)
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`  // הוספת הטוקן ל-headers
            }
        });

        // אם הכל בסדר, הצגת הקישור
        console.log('Generated Protected Link:', response.data.link);
        return response.data.link;
    } catch (error:any) {
        console.error('Error generating protected link:', error.response ? error.response.data : error);
        throw error;  // אפשר להחזיר שגיאה או לבצע טיפול נוסף
    }
}

