import * as yup from 'yup';

// Sign-up: validate password strength and that confirmPassword matches.
export const registerSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 chars').max(100),
  email: yup.string().required('Email is required').email('Invalid email').max(150),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 chars')
    .matches(/[A-Z]/, 'Password needs at least 1 uppercase letter')
    .matches(/[0-9]/, 'Password needs at least 1 number'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});

export const loginSchema = yup.object().shape({
  email: yup.string().required('Email is required').email('Invalid email'),
  password: yup.string().required('Password is required'),
});

export const refreshSchema = yup.object().shape({
  refreshToken: yup.string().required('refreshToken is required'),
});
