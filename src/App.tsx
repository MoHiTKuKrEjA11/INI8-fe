import UploadForm from "./components/UploadForm";
import DocumentList from "./components/DocumentList";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <h1>Patient Portal - Documents</h1>
      <div className="card">
        <UploadForm />
      </div>
      <div className="card">
        <DocumentList />
      </div>
    </div>
  );
}

export default App;
