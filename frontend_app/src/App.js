import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "./App.css";

// Color Palette and Theme Variables
const colors = {
  primary: "#1976d2",
  secondary: "#388e3c",
  accent: "#fbc02d",
};

function Sidebar({
  notes,
  onSelect,
  selectedNoteId,
  onAddNote,
  searchValue,
  setSearchValue,
}) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Notes</h2>
        <button className="add-btn" onClick={onAddNote} title="New Note">
          +
        </button>
      </div>
      <input
        className="search"
        type="text"
        placeholder="Search..."
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
      />
      <div className="notes-list">
        {notes.length === 0 ? (
          <div className="empty-list">No notes</div>
        ) : (
          notes.map(note => (
            <div
              className={`note-sidebar-item ${selectedNoteId === note.id ? "selected" : ""
                }`}
              key={note.id}
              onClick={() => onSelect(note)}
            >
              <div className="note-title">{note.title || "Untitled"}</div>
              <div className="note-date">
                {note.updated_at ? new Date(note.updated_at).toLocaleString() : ""}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function MainNoteView({
  note,
  isEditing,
  setEditing,
  onChange,
  onSave,
  onDelete,
  onCancel,
  loading,
}) {
  if (!note)
    return (
      <div className="main-area empty-main">
        <div>Select a note or click + to create one.</div>
      </div>
    );
  return (
    <div className="main-area">
      {isEditing ? (
        <form
          className="note-edit-form"
          onSubmit={e => {
            e.preventDefault();
            onSave();
          }}
        >
          <input
            className="edit-title"
            autoFocus
            type="text"
            value={note.title || ""}
            onChange={e => onChange({ ...note, title: e.target.value })}
            disabled={loading}
            maxLength={150}
            placeholder="Title"
          />
          <textarea
            className="edit-body"
            value={note.content || ""}
            onChange={e => onChange({ ...note, content: e.target.value })}
            disabled={loading}
            placeholder="Note content..."
            rows={18}
          />
          <div className="edit-actions">
            <button
              type="submit"
              className="save"
              disabled={loading}
              style={{ background: colors.primary }}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            {onDelete && note.id && (
              <button
                type="button"
                onClick={onDelete}
                className="delete"
                disabled={loading}
                style={{ background: colors.accent, color: "#333" }}
              >
                Delete
              </button>
            )}
            <button type="button" onClick={onCancel} className="cancel" disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="note-view">
          <div className="note-view-header">
            <h2>{note.title || "Untitled"}</h2>
            <button
              className="edit-btn"
              onClick={() => setEditing(true)}
              style={{ background: colors.secondary }}
            >
              Edit
            </button>
          </div>
          <div className="note-view-body">
            <pre>{note.content}</pre>
          </div>
          <div className="note-view-date">
            Last updated: {note.updated_at ? new Date(note.updated_at).toLocaleString() : ""}
          </div>
        </div>
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  // App State
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setEditing] = useState(false);
  const [editDraft, setEditDraft] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Fetch notes from Supabase
  useEffect(() => {
    // PUBLIC_INTERFACE
    async function fetchNotes() {
      setLoading(true);
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("updated_at", { ascending: false });
      if (!error) setNotes(data);
      setLoading(false);
    }
    fetchNotes();
    // Optionally, subscribe to realtime notes here.
  }, []);

  // PUBLIC_INTERFACE
  const refreshNotes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("updated_at", { ascending: false });
    if (!error) setNotes(data);
    setLoading(false);
  };

  // PUBLIC_INTERFACE
  const handleSelectNote = note => {
    setSelectedNote(note);
    setEditDraft(note);
    setEditing(false);
  };

  // PUBLIC_INTERFACE
  const handleAddNote = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("notes")
      .insert([{ title: "Untitled", content: "" }])
      .select();
    if (!error && data && data.length > 0) {
      await refreshNotes();
      setSelectedNote(data[0]);
      setEditDraft(data[0]);
      setEditing(true);
    }
    setLoading(false);
  };

  // PUBLIC_INTERFACE
  const handleSave = async () => {
    setLoading(true);
    if (!editDraft.title?.trim()) editDraft.title = "Untitled";
    if (editDraft.id) {
      // Update note
      const { error } = await supabase
        .from("notes")
        .update({
          title: editDraft.title,
          content: editDraft.content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editDraft.id);
      if (!error) {
        await refreshNotes();
        setEditing(false);
        // Select updated note
        const found = notes.find(n => n.id === editDraft.id);
        setSelectedNote(
          found
            ? { ...found, title: editDraft.title, content: editDraft.content }
            : editDraft
        );
      }
    } else {
      // Create new note (shouldn't happen here, but fallback)
      await handleAddNote();
    }
    setLoading(false);
  };

  // PUBLIC_INTERFACE
  const handleDelete = async () => {
    if (!editDraft.id) return;
    setLoading(true);
    await supabase.from("notes").delete().eq("id", editDraft.id);
    await refreshNotes();
    setSelectedNote(null);
    setEditDraft({});
    setEditing(false);
    setLoading(false);
  };

  // Filter notes by search string (title or content)
  const filteredNotes =
    searchValue.trim().length === 0
      ? notes
      : notes.filter(
        n =>
          (n.title && n.title.toLowerCase().includes(searchValue.toLowerCase())) ||
          (n.content && n.content.toLowerCase().includes(searchValue.toLowerCase()))
      );

  // Responsive, Minimal, Light Theme Container
  return (
    <div className="app-container">
      <Sidebar
        notes={filteredNotes}
        onSelect={handleSelectNote}
        selectedNoteId={selectedNote && selectedNote.id}
        onAddNote={handleAddNote}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      <MainNoteView
        note={isEditing ? editDraft : selectedNote}
        isEditing={isEditing}
        setEditing={setEditing}
        onChange={setEditDraft}
        onSave={handleSave}
        onDelete={handleDelete}
        onCancel={() => setEditing(false)}
        loading={loading}
      />
    </div>
  );
}

export default App;
