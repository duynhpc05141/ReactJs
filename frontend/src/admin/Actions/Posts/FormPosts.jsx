import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ReactQuill from 'react-quill';
import { Button, Select, Space  } from "antd";

import axios from '../../../config/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../../Components/Loading/Loading';

function FormPosts() {
    const { id } = useParams();
    const isEditForm = Boolean(id);
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (isEditForm) {
                try {
                    const response = await axios.get(`/posts/${id}`);
                    const postData = response.data.data;
                    formik.setValues({
                        title: postData.title,
                        content: postData.content,
                        topic: postData.topic,
                        // media: postData.media
                    });
                    
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchData();
        
    }, [id, isEditForm]);

    const formik = useFormik({
        initialValues: {
            title: '',
            content: '',
            topic: '',
            // media: '',
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Title is required'),
            content: Yup.string().required('Content is required'),
            topic: Yup.string().required('Topic is required'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            setProcessing(true);
            try {
                const formData = new FormData();
                formData.append('title', values.title);
                formData.append('content', values.content);
                console.log('Submitting form data:', values);

                let response;
                if (isEditForm) {
                    response = await axios.put(`/posts/${id}`, formData);
                } else {
                    response = await axios.post('/add-posts', formData);
                }

                console.log('API response:', response);

                if (response.status === 201 || response.status === 200) {
                    setProcessing(false);
                    const message = isEditForm ? 'Posts cập nhật thành công' : 'Posts thêm thành công';
                    toast.success(message);
                    setTimeout(()=>navigate('/admin/posts'),2000);
                } else {
                    toast.error('Failed to add/update posts.');
                }
            } catch (error) {
                console.error('An error occurred:', error);
                if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error('An error occurred. Please try again.');
                }
            }
            setSubmitting(false);
        },
    });

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        formik.setFieldValue('media', e.target.files[0]);
      };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
        formik.setFieldValue('avatar', e.target.files[0]);
    };
    const handleChange = (value) => {
        console.log(`selected ${value}`);
      };

    return (
        <section className="bg-white dark:bg-gray-900">
            {processing && <Loading />}
            <div className="max-w-2xl px-4 py-4 mx-auto lg:py-4">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                    {isEditForm ? 'Edit Posts' : 'Add Posts'}
                </h2>
                <ToastContainer />
                <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
                    <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                        <div className="sm:col-span-2">
                            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                placeholder="Enter title"
                            />
                            {formik.errors.title && <p className="text-red-600 text-sm">{formik.errors.title}</p>}
                        </div>
                        <div className="sm:col-span-2">
                        <label htmlFor="topic" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Content</label>
                        <ReactQuill 
                            value={formik.values.content} 
                            placeholder='Your content'
                            onChange={setContent} 
                            modules={{
                                toolbar: [
                                    [{ 'font': [] }, { 'size': [] }],
                                    ['bold', 'italic', 'underline', 'strike'],
                                    [{ 'color': [] }, { 'background': [] }],
                                    [{ 'script': 'sub'}, { 'script': 'super' }],
                                    ['blockquote', 'code-block'],
                                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                    [{ 'indent': '-1'}, { 'indent': '+1' }, { 'align': [] }],
                                    ['link', 'image', 'video'],
                                    ['clean']                                         
                                ]
                            }}
                            className='rounded-lg'
                            name="content"
                            id="content"
                            formats={[
                                'font', 'size', 'bold', 'italic', 'underline', 'strike',
                                'color', 'background', 'script', 'blockquote', 'code-block',
                                'list', 'bullet', 'indent', 'align', 'link', 'image', 'video'
                            ]}
                        />
                        </div>
                        {/* <div className="sm:col-span-2">
                            <label htmlFor="topic" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Topic</label>
                            <input
                                type="topic"
                                name="topic"
                                id="topic"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                value={formik.values.topic}
                                onChange={formik.handleChange}
                                placeholder="Enter topic"
                            />
                            <Select
                                defaultValue={formik.values.topic}
                                style={{ width: 120 }}
                                onChange={handleChange}
                                // options={}
                            />
                            {formik.errors.topic && <p className="text-red-600 text-sm">{formik.errors.topic}</p>}
                        </div> */}
                        <div className="sm:col-span-2">
                            <label htmlFor="media" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">media</label>
                            <input
                                type="file"
                                name="media"
                                id="media"
                                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                value={formik.values.media}
                                onChange={handleFileChange}
                                placeholder="Enter media"
                            />
                            {formik.errors.media && <p className="text-red-600 text-sm">{formik.errors.media}</p>}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            type="submit"
                            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        >
                            {isEditForm ? 'Update' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default FormPosts;
