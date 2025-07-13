import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import TextareaAutosize from 'react-textarea-autosize';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

const NoteEditor = () => {
  const { id } = useParams();
  const [content, setContent] = useState('');
  const [note, setNote] = useState(null);
  const socketRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      if (!socketRef.current) {
        socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
          withCredentials: true,
          transports: ['websocket', 'polling'],
          cors: { origin: "http://localhost:5173" },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });
      }

      const socket = socketRef.current;

      fetchNote();
      socket.emit('join-note', id);
      socket.on('note-update', (data) => setContent(data.content || ''));
      socket.on('active-users', (data) => console.log('Active users:', data.users));
      socket.on('connect_error', (err) => {
        console.error('Connection error:', err.message);
      });

      return () => {
        socket.off('note-update');
        socket.off('active-users');
        setTimeout(() => {
          if (socket.connected) socket.disconnect();
        }, 100);
      };
    }
  }, [id]);

  const fetchNote = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/notes/${id}`);
      if (response.data.status) {
        setNote(response.data.data);
        setContent(response.data.data.content || '');
      }
    } catch (error) {
      console.error('Error fetching note:', error);
      toast.error('Failed to fetch note', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: '#fff',
          fontWeight: '500',
          padding: '12px',
          borderRadius: '8px',
        },
      });
    }
  };

  const handleChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (socketRef.current) {
      socketRef.current.emit('note-update', { noteId: id, content: newContent });
    }
  };

  const updateNote = async () => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/notes/${id}`, { content });
      if (response.data.status) {
        toast.success('Updated Successfully', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#10B981',
            color: '#fff',
            fontWeight: '500',
            padding: '12px',
            borderRadius: '8px',
          },
        });
      }
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Failed to update note', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: '#fff',
          fontWeight: '500',
          padding: '12px',
          borderRadius: '8px',
        },
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateNote();
  };

  if (!note) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center text-gray-600 font-medium">
        Loading note...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-600 hover:text-indigo-800 font-semibold transition duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800 text-center">{note.title}</h1>
          <div className="w-5"></div>
        </div>
        <div className="relative">
          <TextareaAutosize
            value={content}
            onChange={handleChange}
            className="w-full p-4 pr-12 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 min-h-[200px] resize-none"
            placeholder="Start typing your note..."
          />
          <svg
            className="absolute top-4 right-4 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            ></path>
          </svg>
        </div>
        <button
          onClick={handleSubmit}
          className="mt-4 w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 active:bg-indigo-800 transform hover:scale-105 transition duration-200"
        >
          Save Note
        </button>
        <p className="mt-4 text-sm text-gray-500 text-center">
          Last updated: {new Date(note.updatedAt).toLocaleString()}
        </p>
      </div>
      <Toaster />
    </div>
  );
};

export default NoteEditor;