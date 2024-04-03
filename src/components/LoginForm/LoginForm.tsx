import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import FlashMessage from '../FlashMessage/FlashMessage';
import api from '../../utils/api';
import './LoginForm.css';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showFlash, setShowFlash] = useState(false);

  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setShowFlash(false);

    try {
      const response = await api.post(`/users/sign_in`, {
        user: {
          email,
          password,
        },
      });

      if (response.data.jwt) {
        login(response.data.jwt, { email });
        navigate('/');
        window.location.reload();
      }
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError) {
        setErrorMessage('Invalid Email or password.');
        setShowFlash(true);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/users/sign_out`);

      logout();
      setEmail('');
      setPassword('');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleShareMovieClick = () => {
    navigate('/share');
  };

  return (
    <div className='login-form'>
      {!localStorage.getItem('jwtToken') ? (
        <>
          {showFlash && <FlashMessage message={errorMessage} />}
          <form onSubmit={handleLogin}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <button type="submit" className="userFormButton">Login</button>
          </form>
          <button onClick={() => navigate('/register')} className="userFormButton">Register</button>
        </>
      ) : (
        <div className="user-info">
          <span>Welcome {JSON.parse(sessionStorage.getItem('currentUser') || '{}').email || ''}</span>
          <button className="button primary" onClick={handleShareMovieClick}>Share a movie</button>
          <button className="button default" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
