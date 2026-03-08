import axios from 'axios';

const GRAPHQL_URL = 'http://localhost:8080/graphql';

export type AuthResponse = {
  viewer: {
    user: {
      id: string;
      username: string;
      createdAt?: string;
      updatedAt?: string;
    };
    sessionToken: string;
  };
};

export const signupUser = async (
  username: string,
  password: string,
  email?: string,
  fullName?: string,
) => {
  try {
    const response = await axios.post(GRAPHQL_URL, {
      query: `
          mutation SignUp($input: SignUpInput!) {
            signUp(input: $input) {
              viewer {
                user {
                  id
                  username
                  createdAt
                  updatedAt
                }
                sessionToken
              }
            }
          }
        `,
      variables: {
        input: {
          username,
          password,
          email,
          fullName,
        },
      },
    });

    if (response.data.errors?.length) {
      throw new Error(response.data.errors[0].message || 'Signup failed');
    }

    return response.data.data.signUp;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await axios.post(GRAPHQL_URL, {
      query: `
          mutation LogIn($input: LogInInput!) {
            logIn(input: $input) {
              viewer {
                user {
                  id
                  createdAt
                  updatedAt
                  username
                }
                sessionToken
              }
            }
          }
        `,
      variables: {
        input: {
          username,
          password,
        },
      },
    });

    if (response.data.errors?.length) {
      throw new Error(response.data.errors[0].message || 'Login failed');
    }

    return response.data.data.logIn;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};
