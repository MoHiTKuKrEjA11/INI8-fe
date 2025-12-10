import { useEffect, useState } from "react";

type DocType = {
  id: number;
  filename: string;
  filesize: number;
  created_at: string;
};

function DocumentList() {
  const [docs, setDocs] = useState<DocType[]>([]);

  const fetchDocs = async () => {
    try {
      const res = await fetch("https://ini8-be.onrender.com/documents");
      const data: DocType[] = await res.json();
      setDocs(data);
    } catch {
      alert("Failed to fetch documents");
    }
  };

  useEffect(() => {
    const loadDocs = async () => {
      await fetchDocs();
    };

    loadDocs();
    const handler = () => fetchDocs();
    window.addEventListener("documentsUpdated", handler);
    return () => window.removeEventListener("documentsUpdated", handler);
  }, []);

  const handleDownload = (id: number, filename: string) => {
    const url = `https://ini8-be.onrender.com/documents/${id}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this document?")) return;

    try {
      const res = await fetch(`https://ini8-be.onrender.com/documents/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        alert("Document deleted");
        fetchDocs();
      } else {
        alert(data.error || "Delete failed");
      }
    } catch {
      alert("Delete error");
    }
  };

  return (
    <div className="table-container">
      <h2>Uploaded Documents</h2>

      <table
        border={1}
        cellPadding={8}
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Filename</th>
            <th>Size</th>
            <th>Uploaded</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {docs.length === 0 && (
            <tr>
              <td colSpan={4}>No documents found.</td>
            </tr>
          )}

          {docs.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.filename}</td>
              <td>{(doc.filesize / 1024).toFixed(2)} KB</td>
              <td>{new Date(doc.created_at).toLocaleDateString("en-GB")}</td>
              <td>
                <button onClick={() => handleDownload(doc.id, doc.filename)}>
                  Download
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(doc.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DocumentList;
