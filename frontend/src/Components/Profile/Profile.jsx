import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import axios from '../../config/axiosConfig';
import moment from 'moment-timezone';
import getUsersFromLocalStorage from '../../utils/getDataUser';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { getinfouser } from '../../Service/Auth/Api';
import { useNavigate } from 'react-router-dom';

function Profile() {
	const [user, setUser] = useState();

	const [premium, setPremium] = useState();
	const [followedAuthors, setFollowedAuthors] = useState([]);
	const [showFollowedAuthors, setShowFollowedAuthors] = useState(false);
	useEffect(() => {
		const getPremiums = async () => {
			try {
				const resPremium = await axios.get('/premium');
				resPremium.data.map((pre) => setPremium(pre));
			} catch (error) {
				console.log(error.message);
			}
		};
		getPremiums();
	}, []);
	useEffect(() => {
		setUser(getUsersFromLocalStorage());
	}, []);
	const handleShowFollowedAuthors = async () => {
		try {
			const followedAuthorsData = await axios.get('/author');
			const filterHasAuthorsFollowed = followedAuthorsData.data.filter(
				(auth) => user[5].includes(auth._id),
			);
			if (filterHasAuthorsFollowed) {
				setFollowedAuthors(filterHasAuthorsFollowed);
				setShowFollowedAuthors(true);
			}
		} catch (error) {
			console.error('Error fetching followed authors:', error);
		}
	};

	const handleBackToProfile = () => {
		setShowFollowedAuthors(false);
	};
	// get data user
	const checkauthGGFB = localStorage.getItem('auth');
	const navigate = useNavigate();

	const [getdatainfo, setgetdatainfo] = useState();
	useEffect(() => {
		handleGetDataUserINfo();
	}, []);
	const handleGetDataUserINfo = async () => {
		if (checkauthGGFB) {
			let datauser = localStorage.getItem('user');
			let converdata = JSON.parse(datauser);
			setgetdatainfo({
				email: converdata.email,
				username: converdata.displayName,
				avatar: converdata.photoURL,
			});
			/* empty */
		} else {
			let token = Cookies.get('token');
			const decodedToken = jwtDecode(token);
			const data = await getinfouser(decodedToken.id);
			setgetdatainfo({
				email: data.email,
				username: data.username,
				createdAt: data.createdAt,
				avatar: data.avatar,
				id: data._id,
			});
		}
	};
	return (
		<div className="max-w-2xl mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto  bg-white shadow-xl rounded-lg text-gray-900">
			<div className="rounded-t-lg h-32 overflow-hidden">
				<img
					className="object-cover object-top w-full"
					src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
					alt="Mountain"
				/>
			</div>
			<div className=" mx-auto w-32 h-32 relative  -mt-16 border-4 border-white rounded-full overflow-hidden">
				<img
					className="object-cover object-center h-32"
					src={
						// (user && user[2]) ||
						(getdatainfo && getdatainfo.avatar) ||
						'https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg'
					}
					alt="Ảnh đại diện"
				/>
			</div>
			<div className="text-center mt-2">
				<h2 className="font-semibold">
					{user && user[1]}{' '}
					{user && user[4] ? (
						<FontAwesomeIcon
							className=" w-4 h-4 transform rotate-45 text-yellow-300"
							icon={faCrown}
						/>
					) : (
						''
					)}
				</h2>
				<p className="text-gray-500">{user && user[3]}</p>
			</div>
			<div className="bg-white overflow-hidden shadow rounded-lg ">
				{showFollowedAuthors ? (
					<div className="px-4 py-5 sm:px-6">
						<h3 className="text-lg leading-6 font-medium text-gray-900">
							Tác giả đã theo dõi
						</h3>
						<ul className="mt-5">
							{followedAuthors.map((author) => (
								<Link
									key={author._id}
									to={`/author/${author._id}`}
								>
									<div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
										<dt className="text-sm font-medium text-gray-500">
											Tác giả
										</dt>
										<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
											<img
												src={author && author.image}
												className="w-10 h-10 rounded-full mr-2"
												alt=""
											/>
											{author && author.name}
										</dd>
									</div>
								</Link>
							))}
						</ul>
					</div>
				) : (
					<>
						<div className="px-4 py-5 sm:px-6">
							<h3 className="text-lg leading-6 font-medium text-gray-900">
								Info
							</h3>
						</div>
						<div className=" border-gray-200 px-4 py-5 sm:p-0">
							<dl className="sm:divide-y sm:divide-gray-200">
								<div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
									<dt className="text-sm font-medium text-gray-500">
										Name
									</dt>
									<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
										{getdatainfo && getdatainfo.username}
									</dd>
								</div>
								<div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
									<dt className="text-sm font-medium text-gray-500">
										Email
									</dt>
									<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
										{getdatainfo && getdatainfo.email}
									</dd>
								</div>
							</dl>
						</div>
					</>
				)}
			</div>
			<div className="p-4 border-t mx-8 mt-2">
				{!checkauthGGFB ? (
					<div>
						{' '}
						<button
							className="w-auto block mx-auto rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2"
							// onClick={handleShowFollowedAuthors}
							onClick={() => {
								navigate(`/updateinfo/${getdatainfo?.id}`);
							}}
						>
							Update Profile
						</button>
						<button
							className="w-auto mt-3 block mx-auto rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2"
							// onClick={handleShowFollowedAuthors}
							onClick={() => {
								navigate(`/changepass/${getdatainfo?.id}`);
							}}
						>
							Change Password
						</button>
					</div>
				) : (
					<button
						className="w-auto block mx-auto rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2"
						// onClick={handleBackToProfile}
						onClick={() => {
							navigate(`/`);
						}}
					>
						Back to home
					</button>
				)}
			</div>
		</div>
	);
}

export default Profile;
