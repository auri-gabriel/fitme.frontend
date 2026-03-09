import React, { useState } from 'react';
import TextField from '../components/Forms/Textfield';
import PrimaryButton from '../components/Buttons/PrimaryButton';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authApi';

const Login: React.FC = () => {
  type LoginErrors = {
    username: string | null;
    password: string | null;
  };

  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState<LoginErrors>({
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
    const newErrors: LoginErrors = {
      username: null,
      password: null,
    };

    if (!loginData.username) {
      newErrors.username = 'Username is required';
    }

    if (!loginData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
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
    <section className='login-page'>
      <div className='login-page__header'>
        <h2 className='mb-0'>Login</h2>
        <hr className='login-page__divider' />
      </div>
      <div className='login-page__form-wrapper'>
        <form onSubmit={handleLogin} className='d-flex flex-column gap-4 mb-4'>
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
          <p className='login-page__register-link'>
            Don't have an account? <Link to='/signup'>Register</Link>
          </p>
          <PrimaryButton type='submit'>
            {loginStatus === 'loading' ? 'Logging in...' : 'Login'}
          </PrimaryButton>
        </form>
      </div>
    </section>
  );
};

export default Login;
