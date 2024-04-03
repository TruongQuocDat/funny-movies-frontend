import React from 'react';
import LoginForm from '../LoginForm/LoginForm';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header>
      <Link to="/" className="logo">Funny Movies</Link>
      <LoginForm />
    </header>
  );
};

export default Header;
