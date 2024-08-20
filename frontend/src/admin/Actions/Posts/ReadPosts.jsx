import React, { useEffect, useState } from 'react';
import axios from '../../../config/axiosConfig';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button, Input, Form } from 'antd';
import { ref, set } from 'firebase/database';
import { database } from '../../../firebase/config';

function ReadPosts() {
    const [posts, setPosts] = useState([]);
    const [selected, setSelected] = useState(null);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [deleteReason, setDeleteReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const reasons = [
        'Inappropriate Content',
        'Spam',
        'Duplicated Post',
        'Other'
    ]; // List of predefined reasons

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get('/posts');
                setPosts(res.data.data);
            } catch (error) {
                console.error('Error fetching posts data:', error);
            }
        }
        
        fetchData();
    }, [isConfirmationOpen]);

    const handleDelete = (post) => {
        setSelected(post);
        setIsConfirmationOpen(true);
    };

    const handleCloseConfirmation = () => {
        setSelected(null);
        setIsConfirmationOpen(false);
        setDeleteReason('');
        setCustomReason('');
    };

    const handleConfirmDelete = async () => {
        if (!selected || !deleteReason) return;
        
        const { _id: postId, title: postTitle, user: { _id: userId } } = selected;
        const reason = deleteReason === 'Other' ? customReason : deleteReason;

        try {
            
            await axios.delete(`/posts/${postId}`);
            
           
            await set(ref(database, `notifications/${postId}`), {
                reason,
                userId,
                postId,
                postTitle,
                readTime: new Date().toISOString()
            });

            toast.success('Post deleted and notification saved successfully');
            handleCloseConfirmation();
        } catch (error) {
            console.error('Error deleting post:', error);
            toast.error('Error deleting post');
        }
    };

    return (
        <section>
            <Link to={'/admin/add-posts'}>
                <button
                    type="button"
                    className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                >
                    Add Posts
                </button>
            </Link>
            <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
                <table className="w-full text-left table-auto min-w-max">
                    <thead>
                        <tr>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                    #
                                </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                    Title
                                </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                   Content
                                </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                   Date
                                </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                    Actions
                                </p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post, index) => (
                            <tr key={index}>
                                <td className="p-4 border-b border-blue-gray-50">
                                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                        {index + 1}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-blue-gray-50">
                                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                    {post?.title?.length > 20 ? `${post.title.substring(0, 30)}...` : post.title}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-blue-gray-50">
                                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                        {post?.content?.length > 20 ? `${post.content.substring(0, 20)}...` : post.content}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-blue-gray-50">
                                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                        {post?.date}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-blue-gray-50">
                                    {post.user && (<Link to={`/admin/edit-posts/${post?._id}`}>
                                        <button
                                            type="button"
                                            className="text-white bg-blue-700 text-xs font-medium hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg px-2 py-2 me-1 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                        >
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </button>
                                    </Link>)}
                                    
                                    <button
                                        onClick={() => handleDelete(post)}
                                        className="text-white bg-red-700 text-xs font-medium hover:bg-red-800 focus:ring-4 focus:ring-red-300 rounded-lg px-2 py-2 me-1 mb-2"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>

                                    <Modal
                                        title="Confirm Delete Post"
                                        visible={isConfirmationOpen}
                                        onCancel={handleCloseConfirmation}
                                        footer={[
                                            <Button key="cancel" onClick={handleCloseConfirmation}>
                                                Cancel
                                            </Button>,
                                            <Button key="confirm" type="primary" onClick={handleConfirmDelete}>
                                                Confirm
                                            </Button>
                                        ]}
                                    >
                                        <Form>
                                            <Form.Item label="Select Reason">
                                                <Input.Group compact>
                                                    <Form.Item
                                                        name="reason"
                                                        noStyle
                                                        rules={[{ required: true, message: 'Please select a reason!' }]}
                                                    >
                                                        <select
                                                            style={{ width: '100%' }}
                                                            value={deleteReason}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                setDeleteReason(value);
                                                                if (value !== 'Other') {
                                                                    setCustomReason('');
                                                                }
                                                            }}
                                                        >
                                                            {reasons.map((reason) => (
                                                                <option key={reason} value={reason}>
                                                                    {reason}
                                                                </option>
                                                            ))}
                                                            <option value="Other">Other</option>
                                                        </select>
                                                    </Form.Item>
                                                    {deleteReason === 'Other' && (
                                                        <Form.Item
                                                            name="customReason"
                                                            rules={[{ required: true, message: 'Please provide a custom reason!' }]}
                                                        >
                                                            <Input
                                                                style={{ width: '100%' }}
                                                                placeholder="Enter custom reason"
                                                                value={customReason}
                                                                onChange={(e) => setCustomReason(e.target.value)}
                                                            />
                                                        </Form.Item>
                                                    )}
                                                </Input.Group>
                                            </Form.Item>
                                        </Form>
                                    </Modal>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </section>
    );
}

export default ReadPosts;
