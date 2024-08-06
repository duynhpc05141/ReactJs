import { useEffect, useState } from 'react';
import axios from '../../../config/axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faTrash, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../../Components/ConfirmationModal/ConfirmationModal';

function Reports() {
    const [reports, setReports] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null); 
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [confirmationType, setConfirmationType] = useState(''); 

    useEffect(() => {
        async function fetchReports() {
            try {
                const res = await axios.get('/reports');
                setReports(res.data);
            } catch (error) {
                console.error('Error fetching reports:', error);
                toast.error('Error fetching reports.');
            }
        }

        fetchReports();
    }, [isConfirmationOpen]);

    const openConfirmationModal = (item, type) => {
        setSelectedItem(item);
        setConfirmationType(type);
        setIsConfirmationOpen(true);
    };

    const handleCloseConfirmation = () => {
        setSelectedItem(null);
        setConfirmationType('');
        setIsConfirmationOpen(false);
    };

    const handleConfirmDelete = async () => {
        if (!selectedItem) return;

        try {
            if (confirmationType === 'post') {
                await axios.delete(`/posts/${selectedItem._id}`);
                toast.success('Post deleted successfully!');
            } else if (confirmationType === 'report') {
                await axios.delete(`/reports/${selectedItem._id}`);
                toast.success('Report deleted successfully!');
            }

            handleCloseConfirmation();

          
            setReports(reports.filter(report => report._id !== selectedItem._id));
        } catch (error) {
            console.error('Error deleting item:', error);
            toast.error('Error deleting item.');
        }
    };

    const handleHidePost = async (post) => {
        try {
            const newHideStatus = !post.hide;
            await axios.put(`/posts/update-report/${post._id}`, { hide: newHideStatus });

            setReports((prevReports) =>
                prevReports.map((report) =>
                    report.post._id === post._id
                        ? { ...report, post: { ...report.post, hide: newHideStatus } }
                        : report
                )
            );

            toast.success(`Post ${newHideStatus ? 'hidden' : 'visible'} successfully!`);
        } catch (error) {
            console.error('Error hiding post:', error);
            toast.error('Error hiding post.');
        }
    };

    return (
        <section>
            <ToastContainer />
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
                                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">Reason</p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">Created At</p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">Updated At</p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">Action</p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.length>0?(reports?.map((report, index) => (
                            <tr key={report._id}>
                                <td className="p-4 border-b border-blue-gray-50">
                                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">{index + 1}</p>
                                </td>
                                <td className="p-4 border-b border-blue-gray-50">
                                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">{report.user?.username}</p>
                                </td>
                                <td className="p-4 border-b border-blue-gray-50">
                                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">{report.post?.title}</p>
                                </td>
                                <td className="p-4 border-b border-blue-gray-50">
                                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">{report.reason}</p>
                                </td>
                                <td className="p-4 border-b border-blue-gray-50">
                                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">{new Date(report.createdAt).toLocaleString()}</p>
                                </td>
                                <td className="p-4 border-b border-blue-gray-50">
                                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">{new Date(report.updatedAt).toLocaleString()}</p>
                                </td>
                                <td className="p-4 border-b border-blue-gray-50">
                                    <button
                                        title='Delete post'
                                        onClick={() => openConfirmationModal(report.post, 'post')}
                                        className="text-white bg-blue-700 text-xs font-medium hover:bg-blue-800 focus:ring-4 focus:ring-red-300 rounded-lg px-2 py-2 me-1 mb-2"
                                    >
                                        <FontAwesomeIcon icon={faFileExcel} />
                                    </button>
                                    <button
                                        title={report.post.hide ? 'Show post' : 'Hide post'}
                                        onClick={() => handleHidePost(report?.post)}
                                        className={`text-white text-xs font-medium hover:bg-opacity-80 focus:ring-4 rounded-lg px-2 py-2 me-1 mb-2 ${report.post.hide ? 'bg-blue-500 hover:bg-blue-700' : 'bg-yellow-500 hover:bg-yellow-800'}`}
                                    >
                                        <FontAwesomeIcon icon={report?.post?.hide ? faEye : faEyeSlash} />
                                    </button>
                                    <button
                                        onClick={() => openConfirmationModal(report, 'report')}
                                        className="text-white bg-red-700 text-xs font-medium hover:bg-red-800 focus:ring-4 focus:ring-red-300 rounded-lg px-2 py-2 me-1 mb-2"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>

                                    <ConfirmationModal
                                        isOpen={isConfirmationOpen}
                                        onClose={handleCloseConfirmation}
                                        onConfirm={handleConfirmDelete}
                                        title={`Confirm ${confirmationType === 'post' ? 'Post' : 'Report'} Deletion`}
                                        content={`Are you sure you want to delete ${confirmationType === 'post' ? 'the post' : 'the report'} titled "${selectedItem?.post?.title || ''}"?`}
                                    />
                                </td>
                            </tr>
                        ))) :
                        (
                            <tr>
                                <td colSpan="7" className="p-4 text-center text-gray-500">
                                    No reports available
                                </td>
                            </tr>
                        )
                        }
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default Reports;
