import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'

const App = (props) => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')        //a state for storing user-submitted input
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    console.log('effect');
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log('promise fulfilled');
        setNotes(response.data)
      })
  }, [])
  console.log('render', notes.length, 'notes');

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
        console.log(response);
      })
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value)
  }
  /*
  the HTML input element needs an onChange handler to allow the user to
  change the element. Only setting value=newNote state causes the App component
  to take control of the element, preventing input.
  */

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)
  /*
  a ternary operator that changes notesToShow depending on whether showAll is T/F.
  Using notesToShow allows for conditional filtering of displayed note elements.
  */

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
          <Note key={note.id} note={note} />  
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