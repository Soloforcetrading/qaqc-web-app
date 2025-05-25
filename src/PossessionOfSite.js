import React, { useState, useEffect } from "react";
import { db, storage } from "./firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";

export default function PossessionOfSite() {
  const [file, setFile] = useState(null);
  const [note, setNote] = useState("");
  const [uploads, setUploads] = useState([]);

  const projectId = "demoProject"; // Replace or pass in dynamically later

  useEffect(() => {
  const q = query(
    collection(db, "stage5_possessionOfSite"),
    orderBy("timestamp", "desc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    setUploads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });

  return () => unsubscribe();
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const fileRef = ref(storage, `stage5/possessionOfSite/${projectId}/${file.name}`);
    await uploadBytes(fileRef, file);
    const fileURL = await getDownloadURL(fileRef);

    await addDoc(collection(db, "stage5_possessionOfSite"), {
	projectId,      
	note,
      fileName: file.name,
      fileURL,
      timestamp: serverTimestamp()
    });

    setFile(null);
    setNote("");
    alert("Uploaded successfully");
  };

  return (
    <div style={{ maxWidth: 700, margin: 'auto' }}>
      <h2>Possession of Site</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <textarea
          placeholder="Add optional notes here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button type="submit">Upload</button>
      </form>

      <h3>Uploaded Files</h3>
      <ul>
        {uploads.map(upload => (
          <li key={upload.id}>
            <a href={upload.fileURL} target="_blank" rel="noreferrer">
              {upload.fileName}
            </a>
            {upload.note && <p><em>Note:</em> {upload.note}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}