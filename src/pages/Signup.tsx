import React, { useState } from 'react';
import TextField from '../components/Forms/Textfield';
import PrimaryButton from '../components/Buttons/PrimaryButton';
import { isValidEmail } from '../utils/isValidEmail';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser } from '../api/authApi';

const Signup: React.FC = () => {
  type SignupErrors = {
    fullName: string | null;
    username: string | null;
    email: string | null;
    password: string | null;
    confirmPassword: string | null;
  };

  const navigate = useNavigate();
  const [signupData, setSignupData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<SignupErrors>({
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
    const newErrors: SignupErrors = {
      fullName: null,
      username: null,
      email: null,
      password: null,
      confirmPassword: null,
    };

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
    return Object.values(newErrors).every((error) => !error);
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
        localStorage.setItem('authUsername', data.viewer.user.username);
        setSignupStatus('success');
        navigate('/');
      } catch (error) {
        console.error('Error signing up:', error);
        setSignupStatus('error');
      }
    }
  };

  return (
    <section className='signup-page'>
      <div className='signup-page__header'>
        <h2 className='mb-0'>Sign Up</h2>
        <hr className='signup-page__divider' />
      </div>
      <div className='signup-page__form-wrapper'>
        <form onSubmit={handleSignup} className='d-flex flex-column gap-4 mb-4'>
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
          <p className='signup-page__login-link'>
            Already have an account? <Link to='/login'>Login</Link>
          </p>
          <PrimaryButton type='submit'>
            {signupStatus === 'loading' ? 'Registering...' : 'Sign Up'}
          </PrimaryButton>
        </form>
      </div>
    </section>
  );
};

export default Signup;
