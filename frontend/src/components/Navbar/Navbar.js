import React, { useState } from 'react';
import { Sun, Moon } from '../../Utils/Svg';
function Navbar () {

  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);

  function getInitialDarkMode() {
    const osDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const localDarkMode = localStorage.getItem('darkMode') === 'true';
    return localDarkMode || osDarkMode;
  }

  function toggleDarkMode() {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    document.documentElement.setAttribute('data-theme', newDarkMode ? 'dark' : 'light');
  }

  return (
    <nav className='navbar bg-base-300 p-4 fixed w-full top-0 z-10'>
      <div className='flex-1'>
        <a className='btn btn-ghost normal-case text-xl' href='/'>
          <img src={'images/logo.png'} className='w-10 h-10 mr-2' alt='logo' />
          Pokedex
        </a>
      </div>

      <div className='flex-none'>
        <label className='swap swap-rotate'>
          <input type='checkbox' onClick={toggleDarkMode} />
          <Sun />
          <Moon />
        </label>
      </div>
    </nav>
  )
}

export default Navbar
