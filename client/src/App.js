import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<ProtectedRoute>
              <Home />
            </ProtectedRoute>} />
        <Route path="/editor/:roomId" element={  <ProtectedRoute> <EditorPage /></ProtectedRoute>  } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
// src/App.js
// import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Login from './pages/Login';
// import Home from './pages/Home';
// import ProtectedRoute from './components/ProtectedRoute';

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route
//           path="/home"
//           element={
            
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
