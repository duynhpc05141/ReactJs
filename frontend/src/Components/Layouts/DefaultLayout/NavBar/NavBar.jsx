import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faUser } from '@fortawesome/free-solid-svg-icons';
import logo from '../../../../../public/assets/images/logo.png';

import handleLogout from '../../../Logout/Logout';
import { Avatar, Dropdown } from "flowbite-react";
import Cookies from 'js-cookie';
import { isLogin } from '../../../../Service/Auth/Api';
import SearchPosts from './Search/Search';
import NotificationList from './Nofication/Notfication';


function Navbar() {
	const [user, setUser] = useState();
	const [token, setToken] = useState();
	const [login,setIsLogin]=useState()
	useEffect(() => {
		const userData = localStorage.getItem('user');
		if (userData) setUser(JSON.parse(userData));

		let token = Cookies.get('token');
		if (token) setToken(token);
		setIsLogin(isLogin());
		
	}, []);

	return (
		<nav className="bg-white border-gray-200 dark:bg-gray-900 shadow-md ">
			<div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2 box-border">
				<Link
					to={'/'}
					className="flex items-center space-x-1 rtl:space-x-reverse"
				>
					<img src={logo} className="h-14 w-20" alt="Logo" />
					<span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
						Be Solution
					</span>
				</Link>
				<div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse ">
				<div className='mr-6'><NotificationList /></div>
				<SearchPosts />
					
					{user || token ? (
						
						<>
						 <Dropdown
						label={<Avatar alt="User settings" img="https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg" rounded />}
						arrowIcon={false}
						inline
						>
						
						<Dropdown.Item >
							<Link to={`/user/${user[0]}`}>
							Info
							</Link>
							</Dropdown.Item>
						<Dropdown.Divider />
						<Dropdown.Item onClick={handleLogout}>Logout </Dropdown.Item>
						</Dropdown>
						</>
					) : (
						<>
							<button
								id="dropdownUserAvatarButton"
								data-dropdown-toggle="dropdownAvatar"
								className="flex shadow-md p-3 border-dark-400 text-xl rounded-full md:me-0  "
								type="button"
							>
								<span className="sr-only">Open user menu</span>
								<FontAwesomeIcon icon={faUser} />
							</button>

							<div
								id="dropdownAvatar"
								className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
							>
								<ul
									className="py-2 text-sm text-gray-700 dark:text-gray-200"
									aria-labelledby="dropdownUserAvatarButton"
								>
									<li>
										<Link to={'/login'}>
											<a className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
												Login
											</a>
										</Link>
									</li>
									<li>
										<Link to={'/register'}>
											{' '}
											<a className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
												Register
											</a>
										</Link>
									</li>
								</ul>
							</div>
						</>
					)}
				</div>

				<div
					className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
					id="navbar-user"
				>
					<ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
						<li>
							<Link
								to="/"
								className="block py-2 px-3  bg-blue-700 rounded md:bg-transparent text-gray-900 md:p-0 "
							>
								Home
							</Link>
						</li>
						<li>
							<Link
								to="/questions"
								className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
							>
								Questions
							</Link>
						</li>
						<li>
							<Link
								to="/tags"
								className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
							>
								Tags
							</Link>
						</li>
						<li>
							<Link
								to="/users"
								className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
							>
								Users
							</Link>
						</li>
						{
							login && 
						<li>
							<Link
								to="/ask"
								className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
							>
								Ask question
							</Link>
						</li>
						}
					</ul>
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
