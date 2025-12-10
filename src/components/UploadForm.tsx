import { useState, useRef } from "react";

function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Please choose a file.");
      return;
    }

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      alert("Only PDF files allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await fetch("https://ini8-be.onrender.com/documents/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Upload failed");
      } else {
        alert("Upload successful");

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setFile(null);

        window.dispatchEvent(new Event("documentsUpdated"));
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert("Upload error: " + err.message);
      } else {
        alert("Upload error");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          ref={fileInputRef}
          disabled={uploading}
        />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload PDF"}
        </button>
      </form>
    </div>
  );
}

export default UploadForm;
