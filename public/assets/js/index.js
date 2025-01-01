let noteTitle, noteText, newNoteBtn, note, notes;

if (window.location.pathname === "/notes.html") {
  noteTitle = document.querySelector(".note-title");
  noteText = document.querySelector(".note-textarea");
  newNoteBtn = document.querySelector(".new-note");
  notesList = document.querySelector(".list-group");
}

const apiRequest = (endpoint, method, data = null) => {
  console.log("apiRequest", endpoint, method, data);
  fetch(`/notes${endpoint}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : null,
  });
};

const getNotes = () => apiRequest("", "GET");
const getNote = (id) => apiRequest(`/${id}`, "GET");
const saveNote = (data) => apiRequest("", "POST", data);
const deleteNote = (id) => apiRequest(`/${id}`, "DELETE");

// overview of handling functions and requests to endpoints
// init:............handleGetNotes()
// handleGetNotes:..notes ? 
// activeNote: getNote(), setActive()
// setActive:  
