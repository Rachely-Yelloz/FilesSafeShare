import axios from 'axios';

/**
 * שולח לוג ל־API
 * @param {Object} logData - כאמור: { id, userId, createdAt, action, userName, isSuccess, errorMessage }
 */

export interface LogDto {
  id: number;
  userId: number;
  createdAt: string; // ISO string
  action: string;
  userName: string;
  isSuccess: boolean;
  errorMessage?: string | null;
}

export async function sendLog(logData:LogDto) {
  try {
    const url = 'https://filessafeshare-1.onrender.com/api/Loges/log';


    const resp = await axios.post(url, logData);

    return resp.data;
  } catch (err) {
    console.error('Failed to send log', err);
    // אם תרצי — זרוק את השגיאה להתמודדות בחלק שמבקש
    throw err;
  }
}

// דוגמה לשימוש:
const exampleLog = {
  id: 0,
  userId: 0,
  createdAt: new Date().toISOString(), // "2025-09-14T09:22:31.062Z" וכו'
  action: 'string',
  userName: 'string',
  isSuccess: true,
  errorMessage: 'string'
};

// קריאה (לדוגמה מתוך handler)
sendLog(exampleLog)
  .then(res => console.log('Log saved', res))
  .catch(err => console.error('Log error', err));
