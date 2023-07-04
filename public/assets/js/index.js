let noteTitle, noteText, saveNoteBtn, newNoteBtn, noteList;
let activeNote = {};

if (window.location.pathname === '/notes.html') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
}

const show = (elem) => elem.style.display = 'inline';
const hide = (elem) => elem.style.display = 'none';

const getNotes = () => {
  console.log("getNotes()")
  return fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

const getNoteFromID = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const saveNote = (data) => {
  console.log("saveNote()")
  return fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const renderActiveNote = async () => {
  console.log("renderActiveNote()")
  hide(saveNoteBtn);
  let note = await getNoteFromID(activeNote.getAttribute("id"))
  note = await note.json()
  if (activeNote.getAttribute("id")) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = note.title;
    noteText.value = note.text;
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

const handleNoteSave = async () => {
  console.log("handleNoteSave() calls: saveNote() && getNotes() && renderNoteList()")
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  await saveNote(newNote)
  console.log("test")
  getAndRenderNotes()
};

const handleNoteDelete = (e) => {
  console.log("handleNoteDelete()")
  e.stopPropagation();
  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;
  if (activeNote.id === noteId) {
    activeNote = {};
  }
  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

const handleNoteView = (e) => {
  console.log("handleNoteView()")
  e.preventDefault();
  activeNote = e.target.parentElement;
  renderActiveNote();
};

const handleNewNoteView = (e) => {
  console.log("handleNewNoteView()")
  activeNote = {};
  document.location.reload()
};

const handleRenderSaveBtn = () => {
  console.log("handleRenderSaveBtn()")
  if (noteTitle.value.trim() && noteText.value.trim()) show(saveNoteBtn);
  else hide(saveNoteBtn);
};

const renderNoteList = async (notes) => {
  console.log("renderNoteList()")
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes.html') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }
  let noteListItems = [];
  const createLi = (text,id, delBtn = true) => {
    console.log("createLi()")
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');
    liEl.setAttribute("id",id)
    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);
    liEl.append(spanEl);
    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);
      liEl.append(delBtnEl);
    }
    return liEl;
  };
  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes',0, false));
  }
  jsonNotes.forEach((note) => {
    const li = createLi(note.title,note.id);
    noteListItems.push(li);
  });
  if (window.location.pathname === '/notes.html') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

const getAndRenderNotes = async () => {
  console.log("getAndRenderNotes() calls: await getNotes() && renderNoteList()")
  const notes = await getNotes()
  renderNoteList(notes);
}

if (window.location.pathname === '/notes.html') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();