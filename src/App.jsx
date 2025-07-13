import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NoteCreation from './Pages/noteCreation';
import NoteEditor from './components/noteEditor';
import ErrorBoundary from './components/errorBoundary';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<NoteCreation />} />
          <Route path="/notes/:id" element={<NoteEditor />} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

export default App;
