
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface FileItem {
  fileId: number;
  fileName: string;
  downloadCount?: number;
  uploadDate?: string;
  fileSize?: number;
}

interface FileContextType {
  files: FileItem[];
  setFiles: (files: FileItem[]) => void;
  selectedFile: FileItem | null;
  setSelectedFile: (file: FileItem | null) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider = ({ children }: { children: ReactNode }) => {
  // טוענים מה-SessionStorage בתחילת הקומפוננטה
  const [files, setFiles] = useState<FileItem[]>(() => {
    const saved = sessionStorage.getItem("files");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedFile, setSelectedFile] = useState<FileItem | null>(() => {
    const saved = sessionStorage.getItem("selectedFile");
    return saved ? JSON.parse(saved) : null;
  });

  // שמירה אוטומטית ב-SessionStorage בכל שינוי
  useEffect(() => {
    sessionStorage.setItem("files", JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    sessionStorage.setItem("selectedFile", JSON.stringify(selectedFile));
  }, [selectedFile]);

  return (
    <FileContext.Provider value={{ files, setFiles, selectedFile, setSelectedFile }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFileContext = () => {
  const context = useContext(FileContext);
  if (!context) throw new Error("useFileContext must be used within a FileProvider");
  return context;
};
