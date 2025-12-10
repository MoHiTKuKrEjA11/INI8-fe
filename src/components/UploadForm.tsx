import { useState, useRef } from "react";

function UploadForm() {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
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
      const res = await fetch("https://ini8-be.onrender.com/documents/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Upload failed");
      } else {
        alert("Upload successful"); // ALERT ADDED ✔

        // reset file input
        fileInputRef.current.value = "";
        setFile(null);

        // Refresh list
        window.dispatchEvent(new Event("documentsUpdated"));
      }
    } catch (err) {
      alert("Upload error: " + err.message);
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
        />
        <button type="submit">Upload PDF</button>
      </form>
    </div>
  );
}

export default UploadForm;
