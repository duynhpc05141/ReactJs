import { useEffect, useState } from "react";
import axios from '../../config/axiosConfig';
import { formatDate } from "../../utils/formatTime";
import { Link } from "react-router-dom";
import { TruncatedContent } from "../../utils/TruncatedContent";

function Tags() {
	const [tags, setTags] = useState([]);
	useEffect(() => {
	const fetchTags = async () => {
		try {
			const res = await axios.get('/posts/topic');
			setTags(res.data.data)
		} catch (error) {
			
		}
	}
	fetchTags()	
	},[tags])

	
	return (
		<>
			<div>
				<h2 className="text-2xl mb-2"> tags</h2>
				<p>
					A tag is a keyword or label that categorizes your question
					with other, similar questions. Using the right tags makes it
					easier for others to find and answer your question.
				</p>
				{/* sreach */}
				<div className="mt-4">
					<form className="flex items-center max-w-sm mx-auto">
						<label htmlFor="simple-search" className="sr-only">
							Search
						</label>
						<div className="relative w-full">
							<div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
								<svg
									className="w-4 h-4 text-gray-500 dark:text-gray-400"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 18 20"
								>
									<path
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
									/>
								</svg>
							</div>
							<input
								type="text"
								id="simple-search"
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								placeholder="Filter by tag name"
								required
							/>
						</div>
						<button
							type="button"
							className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						>
							<svg
								className="w-4 h-4"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 20 20"
							>
								<path
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
								/>
							</svg>
							<span className="sr-only">Search</span>
						</button>
					</form>
				</div>
				<div className="mt-3 p-4">
					{
						tags.map((tag) => (

					<div className="w-[310px] mx-2 mb-2 border rounded-lg border-gray-300 p-3 inline-block">
						<div className="">
							<div className=" mb-3">
							<Link to={`/tags/${tag._id}`}>
									
									<a
									
										className="font-bold bg-[#f1f2f3] p-1 cursor-pointer border hover:bg-blue-gray-100"
										title=""
										aria-label="show questions tagged 'compute'"
										rel="tag"
										aria-labelledby="tag-compute-tooltip-container"
										data-tag-menu-origin="Unknown"
									>
										{tag && tag.name}
									</a>
							</Link>
							</div>
							<div className="mb-2">
								<p>
								<TruncatedContent content={tag && tag.description} maxLength={150} />
									
								</p>
							</div>
							<div className="mt-auto flex justify-between text-gray-400 text-sm	">
								<div className="">0 questions</div>
								<div className=" ">Created {tag &&formatDate(tag.createdAt) }</div>
							</div>
						</div>
					</div>
						))
					}
					
				</div>
			</div>
		</>
	);
}

export default Tags;
