import { createContext, useContext, useState, ReactNode } from "react";

export interface FileItem {
  fileId: number;
  fileName: string;
  downloadCount: number;
  uploadDate?: string;
  fileSize?: number;
  links?: ProtectedLinkItem[];
}

export interface ProtectedLinkItem {
  linkId: number;
  url: string;
  passwordProtected: boolean;
  createdAt?: string;
}

interface FileContextType {
  files: FileItem[];
  setFiles: (files: FileItem[]) => void;
  selectedFile: FileItem | null;
  setSelectedFile: (file: FileItem | null) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider = ({ children }: { children: ReactNode }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

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
