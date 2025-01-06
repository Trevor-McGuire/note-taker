# Note Taker

## Description

Note Taker is a web application that allows users to create, view, and delete notes. The application uses a JSON file (`db.json`) to store notes and provides a user-friendly interface for managing them.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/note-taker.git
   ```
2. Navigate to the project directory:
   ```sh
   cd note-taker
   ```
3. Install the dependencies:
   ```sh
   npm install
   ```

4. Start the server:
   ```sh
   npm run dev
   ```

## Usage

1. Open your web browser and navigate to `http://localhost:3001`.
2. Use the interface to create, view, and delete notes.

## Endpoints

### GET /api/notes

- Description: Retrieves all notes.
- Response: JSON array of note objects.
```json
[
  {
    "id": "string",
    "title": "string"
  }
]
```
OR
```json
[
  message: "No notes found."
]
```

### GET /api/notes/:id

- Description: Retrieves a specific note by ID.
- Parameters: `id` (string) - The ID of the note to retrieve.
- Response: JSON object of the notes.
```json
[
  {
    "id": "string",
    "title": "string",
    "text": "string"
  }
]
```

### POST /api/notes

- Description: Creates a new note.
- Request Body: JSON object with `title` and `text` properties.
- Response: JSON object of the created note.
```json
{
  "id": "string",
  "title": "string",
  "text": "string"
}
```

### DELETE /api/notes/:id

- Description: Deletes a specific note by ID.
- Parameters: `id` (string) - The ID of the note to delete.
- Response: JSON object with a message indicating the result.

```json
{
  "message": "Note deleted successfully."
}
```
