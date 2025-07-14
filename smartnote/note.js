// === Theming ===
const themeToggle = document.getElementById('themeToggle');     
const root = document.documentElement;
function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}
themeToggle.onclick = () => {
  setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
};
setTheme(localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

// === Notes Model ===
let notes = JSON.parse(localStorage.getItem('notes') || '[]');

// === Elements ===
const noteTitle = document.getElementById('noteTitle');
const noteBody = document.getElementById('noteBody');
const addNoteBtn = document.getElementById('addNoteBtn');
const notesGrid = document.getElementById('notesGrid');
const searchInput = document.getElementById('searchInput');
const colorPicker = document.getElementById('colorPicker');
const imageInput = document.getElementById('imageInput');

// === Toolbar Actions ===
document.querySelectorAll('#toolbar button[data-cmd]').forEach(btn => {
  btn.onclick = () => {
    const cmd = btn.dataset.cmd;
    if (cmd === 'hiliteColor') {
      document.execCommand('hiliteColor', false, btn.dataset.value);
    } else {
      document.execCommand(cmd, false, null);
    }
    noteBody.focus();
  };
});
colorPicker.oninput = e => {
  document.execCommand('foreColor', false, e.target.value);
  noteBody.focus();
};
imageInput.onchange = async e => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = ev => {
      document.execCommand('insertImage', false, ev.target.result);
      noteBody.focus();
    };
    reader.readAsDataURL(file);
  }
};

// === Add/Edit Note ===
let editingNoteId = null;
addNoteBtn.onclick = () => {
  const title = noteTitle.value.trim();
  const body = noteBody.innerHTML.trim();
  if (!title && !body) return;
  const imgs = Array.from(noteBody.querySelectorAll('img')).map(img => img.src);
  if (editingNoteId) {
    // Edit existing note
    notes = notes.map(n =>
      n.id === editingNoteId
        ? { ...n, title, body, images: imgs, updated: Date.now() }
        : n
    );
    editingNoteId = null;
    addNoteBtn.textContent = 'Add Note';
  } else {
    notes.unshift({
      id: Math.random().toString(36).slice(2),
      title,
      body,
      images: imgs,
      created: Date.now(),
      updated: Date.now()
    });
  }
  noteTitle.value = '';
  noteBody.innerHTML = '';
  saveAndRenderNotes();
};

// === Render Notes Grid ===
function renderNotes(filter = '') {
  notesGrid.innerHTML = '';
  let filtered = notes;
  if (filter) {
    const f = filter.toLowerCase();
    filtered = notes.filter(
      n =>
        n.title.toLowerCase().includes(f) ||
        n.body.toLowerCase().includes(f)
    );
  }
  for (const note of filtered) {
    const card = document.createElement('div');
    card.className = 'note-card';
    card.innerHTML = `
      <div class="note-title" contenteditable="false">${note.title || '(no title)'}</div>
      <div class="note-body" contenteditable="false">${note.body}</div>
      ${note.images.map(src => `<img src="${src}" class="note-img" />`).join('')}
      <div class="note-actions">
        <button title="Export as TXT" data-action="export-txt">📄</button>
        <button title="Export as PDF" data-action="export-pdf">🖨️</button>
        <button title="Edit" data-action="edit">✏️</button>
        <button title="Delete" data-action="delete">🗑️</button>         
      </div>
    `;
    // Edit on double click
    card.ondblclick = () => startEditNote(note);
    // Long press (for mobile)
    let timer = null;
    card.ontouchstart = e => {
      timer = setTimeout(() => startEditNote(note), 800);
    };
    card.ontouchend = () => clearTimeout(timer);

    // Actions
    card.querySelectorAll('button').forEach(btn => {
      btn.onclick = e => {
        e.stopPropagation();
        const action = btn.dataset.action;
        if (action === 'delete') {
          if (confirm('Delete this note?')) {
            notes = notes.filter(n => n.id !== note.id);
            saveAndRenderNotes();
          }
        } else if (action === 'edit') {
          startEditNote(note);
        } else if (action === 'export-txt') {
          exportTxt(note);
        } else if (action === 'export-pdf') {
          exportPdf(note);
        }
      };
    });
    notesGrid.appendChild(card);
  }
}
function startEditNote(note) {
  noteTitle.value = note.title;
  noteBody.innerHTML = note.body;
  editingNoteId = note.id;
  addNoteBtn.textContent = 'Update Note';
  noteTitle.focus();
}

// === Save and Render ===
function saveAndRenderNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
  renderNotes(searchInput.value);
}

// === Search ===
searchInput.oninput = () => renderNotes(searchInput.value);

// === Export Features ===
function exportTxt(note) {
  const text = `${note.title || ''}\n\n${stripHtml(note.body)}`;
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, (note.title || 'note') + '.txt');
}
function exportPdf(note) {
  const doc = new window.jspdf.jsPDF();
  doc.text(note.title, 10, 15);
  doc.fromHTML(note.body, 10, 25);
  doc.save((note.title || 'note') + '.pdf');
}
function triggerDownload(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}
function stripHtml(html) {
  const d = document.createElement('div');
  d.innerHTML = html;
  return d.textContent || d.innerText || '';
}

// === Initial Load ===
saveAndRenderNotes();   