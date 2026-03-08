import React, { useState } from 'react';
import styled from 'styled-components';
import TextField from '../components/Forms/Textfield';
import PrimaryButton from '../components/Buttons/PrimaryButton';
import { isValidEmail } from '../utils/isValidEmail';
import { Link } from 'react-router-dom';
import { signupUser } from '../api/authApi';

const SignupFormContainer = styled.div`
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

const SignupLink = styled.p`
  margin-top: 15px;
  text-align: center;

  a {
    font-weight: bold;
    color: black;
    text-decoration: none;
  }
`;

const Signup: React.FC = () => {
  const [signupData, setSignupData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    fullName: null,
    username: null,
    email: null,
    password: null,
    confirmPassword: null,
  });

  const [signupStatus, setSignupStatus] = useState('idle');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSignupData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateInputs = () => {
    const newErrors: { [key: string]: string | null } = {};

    if (!signupData.username) {
      newErrors.username = 'Username is required';
    }

    if (!signupData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(signupData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!signupData.password) {
      newErrors.password = 'Password is required';
    } else if (signupData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!signupData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (signupData.confirmPassword !== signupData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();

    const isValid = validateInputs();

    if (isValid) {
      setSignupStatus('loading');
      try {
        const data = await signupUser(
          signupData.username,
          signupData.password,
          signupData.email,
          signupData.fullName,
        );
        console.log('Signup successful:', data);
        localStorage.setItem('authToken', data.viewer.sessionToken);
        setSignupStatus('success');
      } catch (error) {
        console.error('Error signing up:', error);
        setSignupStatus('error');
      }
    }
  };

  return (
    <>
      <HeaderContainer>
        <h2>Sign Up</h2>
        <hr />
      </HeaderContainer>
      <SignupFormContainer>
        <form onSubmit={handleSignup}>
          <TextField
            label='Full Name'
            name='fullName'
            value={signupData.fullName}
            onChange={handleInputChange}
            error={errors.fullName}
          />
          <TextField
            label='Username'
            name='username'
            value={signupData.username}
            onChange={handleInputChange}
            error={errors.username}
          />
          <TextField
            label='Email'
            type='email'
            name='email'
            value={signupData.email}
            onChange={handleInputChange}
            error={errors.email}
          />
          <TextField
            label='Password'
            type='password'
            name='password'
            value={signupData.password}
            onChange={handleInputChange}
            error={errors.password}
          />
          <TextField
            label='Confirm Password'
            type='password'
            name='confirmPassword'
            value={signupData.confirmPassword}
            onChange={handleInputChange}
            error={errors.confirmPassword}
          />
          <SignupLink>
            Already have an account? <Link to='/login'>Login</Link>
          </SignupLink>
          <PrimaryButton type='submit'>
            {signupStatus === 'loading' ? 'Registering...' : 'Sign Up'}
          </PrimaryButton>
        </form>
      </SignupFormContainer>
    </>
  );
};

export default Signup;
