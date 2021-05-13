import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'

const App = (props) => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')        //a state for storing user-submitted input
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        setNotes(response.data)
      })
  }, [])

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5
    }

    //send created note in POST request
    axios
      .post('http://localhost:3001/notes', noteObject)
      .then(response => {
        /* the newnote returned by backend server is added to the list of notes
        in the application state to trigger a browser re-render */
        setNotes(notes.concat(response.data))
        setNewNote('')
      })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }
  /* the HTML input element needs an onChange handler to allow the user to
  change the element. Only setting value=newNote state causes the App component
  to take control of the element, preventing input. */

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)
  /* a ternary operator that changes notesToShow depending on whether showAll is T/F.
  Using notesToShow allows for conditional filtering of displayed note elements. */

  const toggleImportanceOf = (id) => {
    const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important}
    /* Create a new note that is a copy of the old note except for the important
    property. We create a new note instead of mutating the note directly as that
    would be mutating state directly */

    axios
      .put(url, changedNote)
      .then(response => {
        setNotes(notes.map(note => note.id !== id ? note : response.data))
        //replace Notes with a new array that is the same except for the changed note
      })
  }
  /* an event handler function passed to the Note component to allow buttons to
  toggle note importance attribute */

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
        {notesToShow.map(note =>
          <Note key={note.id} note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
          //create a Note element for every note in notesToShow  
        )}
      </ul>
      <form onSubmit={addNote}>
        <input 
          value={newNote}
          onChange={handleNoteChange}   //called every time a change occurs in input element
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default App