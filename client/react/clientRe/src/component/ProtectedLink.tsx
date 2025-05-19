import { useEffect, useState } from "react";
import axios from "axios";

interface ProtectedLink {
  linkId: number;
  fileId: number;
  userId: number;
  creationDate: string;
  expirationDate?: string;
  isOneTimeUse: boolean;
  downloadLimit?: number;
  currentDownloadCount: number;
}

interface Props {
  fileId: number;
}

const ProtectedLink = ({ fileId }: Props) => {
  const [links, setLinks] = useState<ProtectedLink[]>([]);
  const [newLink, setNewLink] = useState({
    password: "",
    isOneTimeUse: false,
    downloadLimit: 1,
  });
  const [editingLink, setEditingLink] = useState<ProtectedLink | null>(null);

  const authToken = sessionStorage.getItem("authToken");

  useEffect(() => {
    fetchLinks();
  }, [fileId]);

  const fetchLinks = async () => {
    try {
      const response = await axios.get<ProtectedLink[]>(
        `https://filessafeshare-1.onrender.com/api/ProtectedLink/file/${fileId}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setLinks(response.data);
    } catch (error) {
      console.error("Error fetching protected links:", error);
    }
  };

  const addLink = async () => {
    try {
      //const response = 
      await axios.post(
        `https://filessafeshare-1.onrender.com/api/ProtectedLink/generate`,
        null,
        {
          params: {
            fileId,
            password: newLink.password,
            isOneTimeUse: newLink.isOneTimeUse,
            downloadLimit: newLink.downloadLimit,
          },
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      fetchLinks();
      setNewLink({ password: "", isOneTimeUse: false, downloadLimit: 1 });
    } catch (error) {
      console.error("Error adding link:", error);
    }
  };

  const deleteLink = async (linkId: number) => {
    try {
      await axios.delete(
        `https://filessafeshare-1.onrender.com/api/ProtectedLink/${linkId}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      fetchLinks();
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  const updateLink = async () => {
    if (!editingLink) return;

    try {
      await axios.put(
        `https://filessafeshare-1.onrender.com/api/ProtectedLink/${editingLink.linkId}`,
        {
          expirationDate: editingLink.expirationDate,
          downloadLimit: editingLink.downloadLimit,
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setEditingLink(null);
      fetchLinks();
    } catch (error) {
      console.error("Error updating link:", error);
    }
  };

  return (
    <div className="p-4 bg-black text-white rounded-lg">
      <h2 className="text-xl font-bold text-red-500 mb-4">לינקים מוגנים</h2>

      {/* טופס להוספת לינק חדש */}
      <div className="mb-4 p-3 border border-red-500 rounded-lg">
        <h3 className="text-red-400">הוספת לינק חדש</h3>
        <input
          type="password"
          placeholder="סיסמה"
          className="w-full p-2 my-2 bg-gray-800 text-white border border-red-500 rounded"
          value={newLink.password}
          onChange={(e) => setNewLink({ ...newLink, password: e.target.value })}
        />
        <input
          type="number"
          placeholder="מגבלת הורדות"
          className="w-full p-2 my-2 bg-gray-800 text-white border border-red-500 rounded"
          value={newLink.downloadLimit}
          onChange={(e) =>
            setNewLink({ ...newLink, downloadLimit: parseInt(e.target.value) })
          }
        />
        <label className="flex items-center text-red-400">
          <input
            type="checkbox"
            className="mr-2"
            checked={newLink.isOneTimeUse}
            onChange={(e) =>
              setNewLink({ ...newLink, isOneTimeUse: e.target.checked })
            }
          />
          חד פעמי
        </label>
        <button
          onClick={addLink}
          className="mt-2 p-2 w-full bg-red-500 hover:bg-red-700 rounded"
        >
          צור לינק
        </button>
      </div>

      {/* רשימת לינקים */}
      {links.length === 0 ? (
        <p className="text-gray-400">אין לינקים זמינים</p>
      ) : (
        <ul>
          {links.map((link) => (
            <li
              key={link.linkId}
              className="p-3 my-2 border border-red-500 rounded-lg bg-gray-900 flex justify-between items-center"
            >
              <div>
                <p>
                  <span className="text-red-400">לינק:</span> {link.linkId}
                </p>
                <p>
                  <span className="text-red-400">תאריך יצירה:</span>{" "}
                  {new Date(link.creationDate).toLocaleString()}
                </p>
                {link.expirationDate && (
                  <p>
                    <span className="text-red-400">תוקף:</span>{" "}
                    {new Date(link.expirationDate).toLocaleString()}
                  </p>
                )}
                <p>
                  <span className="text-red-400">מגבלת הורדות:</span>{" "}
                  {link.downloadLimit || "לא מוגבל"}
                </p>
                <p>
                  <span className="text-red-400">מספר הורדות:</span>{" "}
                  {link.currentDownloadCount}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingLink(link)}
                  className="p-2 bg-yellow-500 hover:bg-yellow-700 rounded"
                >
                  ערוך
                </button>
                <button
                  onClick={() => deleteLink(link.linkId)}
                  className="p-2 bg-red-600 hover:bg-red-800 rounded"
                >
                  מחק
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* עריכת לינק */}
      {editingLink && (
        <div className="mt-4 p-3 border border-yellow-500 rounded-lg bg-gray-800">
          <h3 className="text-yellow-400">עריכת לינק</h3>
          <input
            type="datetime-local"
            className="w-full p-2 my-2 bg-gray-900 text-white border border-yellow-500 rounded"
            value={editingLink.expirationDate?.split(".")[0] || ""}
            onChange={(e) =>
              setEditingLink({ ...editingLink, expirationDate: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="מגבלת הורדות"
            className="w-full p-2 my-2 bg-gray-900 text-white border border-yellow-500 rounded"
            value={editingLink.downloadLimit || ""}
            onChange={(e) =>
              setEditingLink({
                ...editingLink,
                downloadLimit: parseInt(e.target.value),
              })
            }
          />
          <button
            onClick={updateLink}
            className="mt-2 p-2 w-full bg-yellow-500 hover:bg-yellow-700 rounded"
          >
            שמור שינויים
          </button>
        </div>
      )}
    </div>
  );
};

export default ProtectedLink;
