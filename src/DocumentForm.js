import React, { useState } from "react";
import { storage, db } from "./firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function DocumentForm() {
  const [form, setForm] = useState({
    title: "",
    project: "",
    reviewer: "",
    checklist: {
      drawingReviewed: false,
      specCompliant: false,
      signed: false
    },
    comments: "",
    file: null
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        checklist: {
          ...prev.checklist,
          [name]: checked
        }
      }));
    } else if (type === "file") {
      setForm({ ...form, file: e.target.files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.file) return alert("Please upload a file");

    const fileRef = ref(storage, `uploads/${form.file.name}`);
    await uploadBytes(fileRef, form.file);
    const fileURL = await getDownloadURL(fileRef);

    await addDoc(collection(db, "documents"), {
      title: form.title,
      project: form.project,
      reviewer: form.reviewer,
      checklist: form.checklist,
      comments: form.comments,
      fileURL,
      submittedAt: Timestamp.now()
    });

    alert("Document submitted!");
    setForm({
      title: "",
      project: "",
      reviewer: "",
      checklist: { drawingReviewed: false, specCompliant: false, signed: false },
      comments: "",
      file: null
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Submit QA/QC Document</h2>
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
      <input name="project" placeholder="Project" value={form.project} onChange={handleChange} required />
      <input name="reviewer" placeholder="Reviewer" value={form.reviewer} onChange={handleChange} required />

      <label>
        <input type="checkbox" name="drawingReviewed" checked={form.checklist.drawingReviewed} onChange={handleChange} />
        Drawing Reviewed
      </label>
      <label>
        <input type="checkbox" name="specCompliant" checked={form.checklist.specCompliant} onChange={handleChange} />
        Spec Compliant
      </label>
      <label>
        <input type="checkbox" name="signed" checked={form.checklist.signed} onChange={handleChange} />
        Signed Document
      </label>

      <textarea name="comments" placeholder="Comments" value={form.comments} onChange={handleChange}></textarea>
      <input type="file" onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
}