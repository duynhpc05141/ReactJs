import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../../config/axiosConfig';
import { auth , provider} from "../../firebase/config";
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider,GithubAuthProvider } from 'firebase/auth';
import { login } from '../../Service/Auth/Api'

const LoginSchema = Yup.object().shape({
  email: Yup.string().required('Email not empty'),
  password: Yup.string().required('Mật not empty'),
});

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (values, { setSubmitting  } ) => {
    const data = await login(values)
    if(data){
      navigate('/');
      window.location.reload();
    }
   
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
  
      if (credential && user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          idToken: credential.accessToken,
        };
  
        const success = await saveAfterLogin(userData);
  
        if (success) {
          navigate('/');
          window.location.reload();
        } else {
          toast.error('Error saving user data after Google login');
        }
      }
    } catch (error) {
      toast.error('Google login failed!');
      console.error('Google login error:', error.message);
    }
  };
  
  
  const saveAfterLogin = async (userData) => {
    try {
     
      const response = await axios.post('http://localhost:3000/auth/login-google-facebook', userData);
  
      if (response.status === 201) {
       
        localStorage.setItem('user', JSON.stringify(userData));
        window.localStorage.setItem('auth', 'true');
        return true; 
      } else {
        throw new Error('Failed to save user data');
      }
    } catch (error) {
      console.error('Save after login error:', error.message);
      return false; 
    }
  };
  
  const handleFacebookLogin = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const user = result.user;
  
      if (credential && user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          idToken: credential.accessToken,
        };
  
     
        const success = await saveAfterLogin(userData);
  
        if (success) {
          navigate('/');
          window.location.reload();
        } else {
          toast.error('Error saving user data after Facebook login');
        }
      }
    } catch (error) {
      toast.error('Facebook login failed!');
      console.error('Facebook login error:', error.message);
    }
  };
  return (
    <section>
      <div className="relative flex flex-col text-gray-700 bg-transparent shadow-md p-4 mt-2 rounded-xl bg-clip-border">
        <h4 className="text-center block font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          Login
        </h4>
        <ToastContainer />
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form className="max-w-screen-lg mt-8 mb-2 w-80 sm:w-96">
              <div className="flex flex-col gap-4 mb-1">
                <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                  Email
                </h6>
                <Field
                  type="text"
                  name="email"
                  placeholder="Enter email"
                  className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />

                <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                  Password
                </h6>
                <Field
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <p className="block mt-4 font-sans text-base antialiased font-normal leading-relaxed  text-gray-700">
                <Link to="/forgotpassword">
                  <a className="font-medium text-sm text-gray-900">
                    Forgot password?
                  </a>
                </Link>
              </p>
              <div className="items-center">
                <button
                  className="mt-6 block w-full select-none rounded-lg bg-gray-900 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="submit"
                  disabled={isSubmitting}
                >
                 Login
                </button>
                <button
                  onClick={handleGoogleLogin}
                  className="mt-6 block w-full select-none rounded-lg bg-red-600 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                >
                 Login with Google
                </button>
                <button
                  onClick={handleFacebookLogin}
                  className="mt-6 block w-full select-none rounded-lg bg-blue-600 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                >
                 Login with Facebook
                </button>
                
              </div>
              <p className="block mt-4 font-sans text-base antialiased font-normal leading-relaxed text-center text-gray-700">
                You don't have an account?
                <Link to="/register">
                  <a className="font-medium text-gray-900">
                    Register
                  </a>
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};

export default Login;
