import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import FlashMessage from '../FlashMessage/FlashMessage';
import './RegistrationForm.css';
import { useAuth } from '../../contexts/AuthContext';

const RegistrationForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showFlash, setShowFlash] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (localStorage.getItem('jwtToken')) {
      navigate('/');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setShowFlash(false);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users`, {
        user: {
          email,
          password,
          password_confirmation: passwordConfirmation,
          name,
        },
      });

      if (response.data.user) {
        const loginResponse = await axios.post(`${process.env.REACT_APP_API_URL}/users/sign_in`, {
          user: {
            email,
            password,
          },
        });
        
        if (loginResponse.data.jwt) {
          login(loginResponse.data.jwt, loginResponse.data.user);
          navigate('/');
          window.location.reload();
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        setErrorMessage('An error occurred.');
        setShowFlash(true);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="registrationForm">
        {showFlash && <FlashMessage message={errorMessage} />}
        <div>
          <label className="registrationLabel">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="registrationInput"
          />
        </div>
        <div>
          <label className="registrationLabel">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="registrationInput"
          />
        </div>
        <div>
          <label className="registrationLabel">Password Confirmation:</label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            className="registrationInput"
          />
        </div>
        <div>
          <label className="registrationLabel">Name:</label>
          <input
            type="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="registrationInput"
          />
        </div>
        <button type="submit" className="registrationButton">Register</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
