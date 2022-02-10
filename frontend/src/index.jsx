import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Signin from './signin'
import Register from './signup'
import Dashboard from './dashboard';

import AppContext from './appcontext';

const axios = require('axios')

function App() {
  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      const result = await axios.get('api/user', { withCredentials: true })
      console.log(result.data)
      setUser(result.data);
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => { getUser(); }, [])

  return (
    <AppContext.Provider value={{ user, getUser }}>
      <BrowserRouter>
        <Routes>
          { user && <Route path='/*' element={<Dashboard />} /> }
          { !user && <Route path='/signin' element={<Signin />} /> }
          { !user && <Route path='/register' element={<Register />} /> }
          { !user && <Route path="/*" element={<Navigate to='/signin' />} /> }
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
    
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);