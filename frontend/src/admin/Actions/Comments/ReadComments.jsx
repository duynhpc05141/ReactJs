import React, { useEffect, useState } from 'react';
import { ref, onValue, set, remove, update } from 'firebase/database';
import { database } from '../../../firebase/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../../Components/ConfirmationModal/ConfirmationModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosConfig from '../../../config/axiosConfig';

function ReadComments() {
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [isDataReceived, setIsDataReceived] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  useEffect(() => {
    // Fetch comments from Firebase
    const commentsRef = ref(database, 'comments');
    onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const commentsList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setComments(commentsList);
        setIsDataReceived(true);
      }
    });

   
    const fetchPosts = async () => {
      try {
        const response = await axiosConfig.get('/posts');
		console.log(response.data.data);
		
        setPosts(response.data.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();

    
    const fetchUsers = async () => {
      try {
        const response = await axiosConfig.get('/users');
		console.log(response.data.data);
		
        setUsers(response.data.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = (comment) => {
    setSelectedComment(comment);
    setIsConfirmationOpen(true);
  };

  const handleCloseConfirmation = () => {
    setSelectedComment(null);
    setIsConfirmationOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedComment) return;

    try {
      await remove(ref(database, `comments/${selectedComment.id}`));
      toast.success('Comment deleted successfully');
      setSelectedComment(null);
      setIsConfirmationOpen(false);
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Error deleting comment');
    }
  };

  const getUserName = (userId) => {
    const user = users.find((user) => user._id === userId);
    return user ? user.username : 'Unknown';
  };

  const getPostTitle = (postId) => {
    const post = posts.find((post) => post._id === postId);
    return post ? post.title : 'Unknown';
  };

  return (
    <section>
      <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
        <table className="w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">#</p>
              </th>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">User</p>
              </th>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">Question</p>
              </th>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">Content</p>
              </th>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">Action</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment, index) => (
              <tr key={comment.id}>
                <td className="p-4 border-b border-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">{index + 1}</p>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    {getUserName(comment.idUser)}
                  </p>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    {getPostTitle(comment.idArticle)}
                  </p>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    {comment.content}
                  </p>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <button
                    onClick={() => handleDelete(comment)}
                    className="text-white bg-red-700 text-xs font-medium hover:bg-red-800 focus:ring-4 focus:ring-red-300 rounded-lg px-2 py-2 me-1 mb-2"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>

                  <ConfirmationModal
                    isOpen={isConfirmationOpen}
                    onClose={handleCloseConfirmation}
                    onConfirm={handleConfirmDelete}
                    title="Confirm Delete Comment"
                    content={`Are you sure you want to delete the comment "${selectedComment && selectedComment.content}"?`}
                  />
                </td>
              </tr>
            ))}
            {comments.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">No comments available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </section>
  );
}

export default ReadComments;
