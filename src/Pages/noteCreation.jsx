import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TextareaAutosize from 'react-textarea-autosize';


const NoteCreation = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/notes`);
      if (response.data.status) {
        setNotes(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/notes`, { title, content });
      if (response.data.status) {
        setNotes([...notes, response.data.data]);
        navigate(`/notes/${response.data.data._id}`);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error creating note:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create a New Note</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
            placeholder="Enter note title..."
            required
          />
          <TextareaAutosize
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 min-h-[150px]"
            placeholder="Enter note content..."
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 active:bg-indigo-800 transform hover:scale-105 transition duration-200"
          >
            Create Note
          </button>
        </form>
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Existing Notes</h2>
          <ul className="space-y-3">
            {notes.length > 0 ? (
              notes.map((note) => (
                <li
                  key={note._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200"
                >
                  <span className="text-gray-700 font-medium">{note.title}</span>
                  <button
                    onClick={() => navigate(`/notes/${note._id}`)}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold transition duration-200"
                  >
                    Open
                  </button>
                </li>
              ))
            ) : (
              <p className="text-gray-500 italic text-center">No notes available.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NoteCreation;


