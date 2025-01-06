// data objects
let notesListData = [];
let activeNoteData = {};

// elements
let noteListEl, noteTitleEl, noteTextEl, saveNoteBtn, newNoteBtn;
document.addEventListener("DOMContentLoaded", async () => {
  noteListEl = document.querySelector(".list-container");
  noteTitleEl = document.querySelector(".note-title");
  noteTitleEl.addEventListener("keyup", handleTitleTextKeyUp);
  noteTextEl = document.querySelector(".note-textarea");
  noteTextEl.addEventListener("keyup", handleTitleTextKeyUp);
  newNoteBtn = document.querySelector(".new-note");
  newNoteBtn.addEventListener("click", handleNewNoteBtnClick);
  saveNoteBtn = document.querySelector(".save-note");
  saveNoteBtn.addEventListener("click", handleNoteSaveBtnClick);
  await handleNotesListRender();
});

// endponts
const getNotes = async () => {
  const res = await fetch("/notes");
  const data = await res.json();
  notesListData = data;
};

const getNote = async (id) => {
  const res = await fetch(`/notes/${id}`);
  const data = await res.json();
  activeNoteData = data;
  noteTitleEl.value = data.title;
  noteTextEl.value = data.text;
};

const saveNote = async (note) => {
  const res = await fetch(`/notes/${note.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });
  const data = await res.json();
  console.log(data);
  return data;
}

const deleteNote = async (id) => {
  const res = await fetch(`/notes/${id}`, {
    method: "DELETE",
  });
  const data = await res.json();
  console.log(data);
  await handleNotesListRender();
};

// handlers
const handleNotesListRender = async () => {
  await getNotes();
  noteListEl.innerHTML = "";
  console.log(notesListData);
  if (notesListData.message) {
    const noteEl = document.createElement("li");
    noteEl.classList.add("list-group-item");
    noteEl.textContent = notesListData.message;
    noteListEl.appendChild(noteEl);
    return;
  }
  notesListData.forEach(({ title, id }) => {
    const noteEl = document.createElement("li");
    noteEl.classList.add("list-group-item");
    noteEl.setAttribute("data-id", id);
    noteEl.addEventListener('click', handleNoteListItemsClick);

    const span = document.createElement("span");
    span.textContent = title;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("fas", "fa-trash-alt", "btn", "btn-danger", "float-right");
    deleteBtn.setAttribute("data-id", id);
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteNote(id);
    });

    noteEl.appendChild(span);
    noteEl.appendChild(deleteBtn);
    noteListEl.appendChild(noteEl);
  });
};

const handleNoteListItemsClick = async (e) => {
  const id = e.target.closest("li").getAttribute("data-id");
  await getNote(id);
  saveNoteBtn.style.display = "none";
};

const handleNewNoteBtnClick = async () => {
  activeNoteData = {
    title: "",
    text: "",
  };
  noteTitleEl.value = "";
  noteTextEl.value = "";
  saveNoteBtn.style.display = "none";
};

const handleTitleTextKeyUp = () => {
  saveNoteBtn.style.display = "inline-block";
};

const handleNoteSaveBtnClick = async () => {
  saveNoteBtn.style.display = "none";
  activeNoteData.title = noteTitleEl.value;
  activeNoteData.text = noteTextEl.value;
  const savedNote = await saveNote(activeNoteData);
  activeNoteData = savedNote;
  await handleNotesListRender();
};

