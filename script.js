const API_URL = "https://crudcrud.com/api/20db6fb0333740548b29d5a2563f7190";

const noteForm = document.getElementById("noteForm");
const notesContainer = document.getElementById("notesContainer");

let editId = null;

// Load all notes when page loads
window.addEventListener("DOMContentLoaded", () => {
    getNotes();
});

// Form Submit
noteForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const date = document.getElementById("date").value;

    const note = {
        title,
        description,
        date
    };

    if (editId === null) {
        addNote(note);
    } else {
        updateNote(note);
    }
});

// Fetch Notes
function getNotes() {
    notesContainer.innerHTML = "";

    axios
        .get(API_URL)
        .then((res) => {
            res.data.forEach((note) => {
                displayNote(note);
            });
        })
        .catch((err) => console.log(err));
}

// Add Note
function addNote(note) {
    axios
        .post(API_URL, note)
        .then((res) => {
            displayNote(res.data);
            noteForm.reset();
        })
        .catch((err) => console.log(err));
}

// Display Note
function displayNote(note) {

    const col = document.createElement("div");
    col.className = "col-md-4";

    col.innerHTML = `
        <div class="card shadow h-100">
            <div class="card-body">
                <h4>${note.title}</h4>

                <p>${note.description}</p>

                <p>
                    <strong>Due Date:</strong>
                    ${note.date}
                </p>

                <button class="btn btn-warning btn-sm me-2"
                    onclick="editNote('${note._id}',
                    '${note.title}',
                    \`${note.description}\`,
                    '${note.date}')">

                    Edit
                </button>

                <button class="btn btn-danger btn-sm"
                    onclick="deleteNote('${note._id}')">

                    Delete
                </button>

            </div>
        </div>
    `;

    notesContainer.appendChild(col);
}

// Delete
function deleteNote(id) {

    axios
        .delete(`${API_URL}/${id}`)
        .then(() => {
            getNotes();
        })
        .catch((err) => console.log(err));
}

// Edit
function editNote(id, title, description, date) {

    document.getElementById("title").value = title;
    document.getElementById("description").value = description;
    document.getElementById("date").value = date;

    editId = id;
}

// Update
function updateNote(note) {

    axios
        .put(`${API_URL}/${editId}`, note)
        .then(() => {

            editId = null;

            noteForm.reset();

            getNotes();

        })
        .catch((err) => console.log(err));
}