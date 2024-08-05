import { useEffect, useState } from 'react';
import axios from '../../../config/axiosConfig';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash,faEyeSlash,faFlag } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../../Components/ConfirmationModal/ConfirmationModal';

function Reports() {
	
	const [genres, setGenres] = useState([]);
	const [selectedGenre, setSelectedGenre] = useState(null);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
	useEffect(() => {
		async function fetchData() {
			try {
				const res=await axios.get('/reports')
                setGenres(res.data)
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		}

		fetchData();
	}, [isConfirmationOpen]);

	const handleDelete = (genre) => {
		setSelectedGenre(genre);
		setIsConfirmationOpen(true);
	};

	const handleCloseConfirmation = () => {
		setSelectedGenre(null);
		setIsConfirmationOpen(false);
	};

	const handleConfirmDelete = async () => {
		if (!selectedGenre) return;

		try {
			await axios.delete(`/posts/topic/${selectedGenre._id}`);
			toast.success('Deleted successfully!');

			handleCloseConfirmation();
		} catch (error) {
			console.error('Error deleting ', error);
		}
	};
const handleHidePost = async () => {
try {
	const hidePost=await axios.put(`/posts/${selectedGenre._id}`)

	toast.success('Post hidden successfully!');
} catch (error) {
	console.log(error);
	
}
}
  
	return (
		<section>
			
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
									User
								</p>
							</th>
						
							<th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
								<p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
									Question
								</p>
							</th>
							<th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
								<p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
									Reason
								</p>
							</th>
						
							<th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
								<p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
									Create at
								</p>
							</th>
							<th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
								<p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
									Update at
								</p>
							</th>
							<th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
								<p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
									Action
								</p>
							</th>
							
						</tr>
					</thead>
					<tbody>
						{genres?.map((genre, index) => (
							<tr key={index}>
								<td className="p-4 border-b border-blue-gray-50">
									<p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
										{index + 1}
									</p>
								</td>
								<td className="p-4 border-b border-blue-gray-50">
									<p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
										
                                    {genre && genre?.user?.username}
									</p>
								</td>
								<td className="p-4 border-b border-blue-gray-50">
									<p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
										
                                    {genre && genre?.post?.title}
									</p>
								</td>
								<td className="p-4 border-b border-blue-gray-50">
									<p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
										
                                    {genre && genre?.reason}
									</p>
								</td>
								
								<td className="p-4 border-b border-blue-gray-50">
									<p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
										
                                    {genre && genre.createdAt}
									</p>
								</td>
								<td className="p-4 border-b border-blue-gray-50">
									<p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
										
                                    {genre && genre.updatedAt}
									</p>
								</td>
								<td className="p-4 border-b border-blue-gray-50">
								<button
								title='Delete report' 
										onClick={() => handleDelete(genre)}
										className="text-white bg-blue-700 text-xs font-medium hover:bg-blue-800 focus:ring-4 focus:ring-red-300 rounded-lg px-2 py-2 me-1 mb-2"
									>
										<FontAwesomeIcon icon={faFlag} />
									</button>
									<button
										onClick={() => handleHidePost(genre)}
										className="text-white bg-yellow-500 text-xs font-medium hover:bg-yellow-800 focus:ring-4 focus:ring-red-300 rounded-lg px-2 py-2 me-1 mb-2"
									>
										<FontAwesomeIcon icon={faEyeSlash} />
									</button>
									<button
										onClick={() => handleDelete(genre)}
										className="text-white bg-red-700 text-xs font-medium hover:bg-red-800 focus:ring-4 focus:ring-red-300 rounded-lg px-2 py-2 me-1 mb-2"
									>
										<FontAwesomeIcon icon={faTrash} />
									</button>
								

									<ConfirmationModal
										isOpen={isConfirmationOpen}
										onClose={handleCloseConfirmation}
										onConfirm={handleConfirmDelete}
										title="Xác nhận xóa thể loại"
										content={`Bạn có chắc chắn muốn xóa thể loại "${selectedGenre?.name}" không?`}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	);
}

export default Reports;
