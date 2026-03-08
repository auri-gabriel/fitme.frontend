import React, { useState } from 'react';
import styled from 'styled-components';
import TextField from '../components/Forms/Textfield';
import PrimaryButton from '../components/Buttons/PrimaryButton';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authApi';

const LoginFormContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 2rem;
  }
`;

const HeaderContainer = styled.div`
  padding: 0 18rem;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 3rem;

  hr {
    background-color: #808080;
    border: none;
    height: 1px;
  }

  @media (max-width: 1440px) {
    padding: 0 10rem;
  }

  @media (max-width: 1024px) {
    padding: 0 2rem;
  }
`;

const RegisterLink = styled.p`
  margin-top: 15px;
  text-align: center;

  a {
    font-weight: bold;
    color: black;
    text-decoration: none;
  }
`;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    username: null,
    password: null,
  });

  const [loginStatus, setLoginStatus] = useState('idle');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};

    if (!loginData.username) {
      newErrors.username = 'Username is required';
    }

    if (!loginData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    const isValid = validateInputs();

    if (isValid) {
      setLoginStatus('loading');

      try {
        const data = await loginUser(loginData.username, loginData.password);
        console.log('Login successful:', data);
        localStorage.setItem('authToken', data.viewer.sessionToken);
        localStorage.setItem('authUsername', data.viewer.user.username);
        setLoginStatus('success');
        navigate('/');
      } catch (error) {
        console.error('Error logging in:', error);
        setLoginStatus('error');
      }
    }
  };

  return (
    <>
      <HeaderContainer>
        <h2>Login</h2>
        <hr />
      </HeaderContainer>
      <LoginFormContainer>
        <form onSubmit={handleLogin}>
          <TextField
            label='Username'
            name='username'
            value={loginData.username}
            onChange={handleInputChange}
            error={errors.username}
          />
          <TextField
            label='Password'
            type='password'
            name='password'
            value={loginData.password}
            onChange={handleInputChange}
            error={errors.password}
          />
          <RegisterLink>
            Don't have an account? <Link to='/signup'>Register</Link>
          </RegisterLink>
          <PrimaryButton type='submit'>
            {loginStatus === 'loading' ? 'Logging in...' : 'Login'}
          </PrimaryButton>
        </form>
      </LoginFormContainer>
    </>
  );
};

export default Login;
