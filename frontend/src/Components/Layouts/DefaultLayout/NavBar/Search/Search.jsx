import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axiosConfig from '../../../../../config/axiosConfig';

const SearchPosts = ({ onSearch }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const inputRef = useRef(null);

	const handleChange = (e) => {
		setSearchTerm(e.target.value);
		setShowSuggestions(true);
	};

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (inputRef.current && !inputRef.current.contains(e.target)) {
				setShowSuggestions(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const delay = 500;

	useEffect(() => {
		const timeoutId = setTimeout(async () => {
			if (searchTerm.trim()) {
				try {
					const response = await axiosConfig.get(
						`/posts/search?title=${searchTerm}`,
					);
					
					
					const filteredPosts = response?.data?.data.filter(
						(post) => !post?.reply || post?.reply.length === 0,
					);
					setSearchResults(filteredPosts);
					onSearch(filteredPosts);
				} catch (error) {
					console.error('Error searching posts:', error);
				}
			} else {
				setSearchResults([]);
			}
		}, delay);

		return () => clearTimeout(timeoutId);
	}, [searchTerm]);

	const highlightMatches = (text, match) => {
		const parts = text.split(new RegExp(`(${match})`, 'gi'));
		return parts.map((part, index) => (
			<span
				key={index}
				className={
					part.toLowerCase() === match.toLowerCase()
						? 'font-bold'
						: ''
				}
			>
				{part}
			</span>
		));
	};

	return (
		<div ref={inputRef}>
			<form className="mr-5 my-3 relative z-50">
				<label
					htmlFor="default-search"
					className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
				>
					Search
				</label>
				<div className="relative">
					<input
						type="search"
						id="default-search"
						value={searchTerm}
						onChange={handleChange}
						className="items-center w-full shadow-md text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						placeholder="Search questions..."
						required
						autoComplete="off"
					/>
				</div>
				{showSuggestions && searchTerm.trim() && (
					<div className="absolute">
						<ul className="bg-white border border-gray-100 min-w-full mt-2 rounded-md shadow-md">
							{searchResults.length > 0 ? (
								searchResults.map((post) => (
									<div key={post._id}>
										<Link to={`/question/${post._id}`}>
											<li className="rounded-md text-center min-w-48 py-1 border-b-2 border-gray-100 relative cursor-pointer hover:bg-blue-gray-50 hover:text-gray-900">
												{highlightMatches(
													post.title,
													searchTerm,
												)}
											</li>
										</Link>
									</div>
								))
							) : (
								<li className="rounded-md text-center min-w-48 py-1 border-b-2 border-gray-100 relative cursor-pointer hover:bg-blue-gray-50 hover:text-gray-900">
									No results found
								</li>
							)}
						</ul>
					</div>
				)}
			</form>
		</div>
	);
};

export default SearchPosts;
