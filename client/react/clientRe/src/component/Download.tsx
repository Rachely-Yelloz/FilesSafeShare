import { useSearchParams } from "react-router-dom";

export default function Download() {
  const [searchParams] = useSearchParams();
  const fileId = searchParams.get("fileId");

  return (
    <>
      <p>Download page is working</p>
      <p>File ID: {fileId}</p>
      Enter the password to download the file:
      <input type="password" placeholder="Enter password" />
      <button>Download</button>
    </>
  );
}
