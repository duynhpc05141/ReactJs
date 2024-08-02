import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../../config/axiosConfig';
import { forgotpassword } from '../../Service/Auth/Api';

const LoginSchema = Yup.object().shape({
  email: Yup.string().required('Email không được trống').email('email không hợp lệ'),
});

const ForGotPass = () => {
  const navigate = useNavigate();

  const handleLogin = async (values, { setSubmitting  } ) => {
    try {
      const res = await forgotpassword(values)
      console.log('check value' , res);
      if(res){
        toast.success('vui lòng kiểm tra email')
      }else{
        toast.error('Email không tồn tại!!!');
      }
    } catch (error) {
      console.log(error);
    }
  
   
  }
  return (
    <section>
      <div className="relative flex flex-col text-gray-700 bg-transparent shadow-md p-4 mt-2 rounded-xl bg-clip-border">
        <h4 className="text-center block font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          Quên mật khẩu
        </h4>
        <ToastContainer />
        <Formik
          initialValues={{ email: '' }}
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
                  placeholder="Nhập email"
                  className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />

             
              </div>
             
              <div className="items-center">
                <button
                  className="mt-6 block w-full select-none rounded-lg bg-gray-900 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="submit"
                  disabled={isSubmitting}
                >
                 Xác nhận 
                </button>
           
                
              </div>
              <p className="block mt-4 font-sans text-base antialiased font-normal leading-relaxed text-center text-gray-700">
                Bạn chưa có tài khoản?
                <Link to="/register">
                  <a className="font-medium text-gray-900">
                    Đăng kí
                  </a>
                </Link>
              </p>
              <p className="block mt-4 font-sans text-base antialiased font-normal leading-relaxed text-center text-gray-700">
                Bạn đã có tài khoản?
                <Link to="/login">
                  <a className="font-medium text-gray-900">
                    đăng nhập
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

export default ForGotPass;
