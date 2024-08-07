import React, { useEffect, useState } from "react";
import axios from '../../config/axiosConfig';
import { Link, useParams } from "react-router-dom";
import { Image } from "antd";
import PaginationPage from "../SharePagination/Pagination";
import { TruncatedContent } from "../../utils/TruncatedContent";

function Tag() {
    const [tags, setTags] = useState([]);
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        const fetchTagsAndPosts = async () => {
            try {
                
                const tagRes = await axios.get(`/posts/topic/${id}`);
                const tag = tagRes.data.data; 

                setTags([tag]);

                const postsRes = await axios.get('/posts');
                const allPosts = postsRes.data.data;
const canDisplay=allPosts.filter((post)=>post.hide===false)
            
                const filtered = canDisplay.filter(post => 
                    post.topic.length > 0 && post.topic.some(topic => topic._id === tag._id)
                );
                setFilteredPosts(filtered);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchTagsAndPosts();
    }, [id]);

    return (
        <div className="pb-4 pt-4">
            <div className="pt-4 px-3">
                <div className="flex flex-wrap md:flex-nowrap justify-center">
                    <div className="grow pl-6 pb-8 md:border-l-[1px]">
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map(post => (
                                <div key={post._id} className="flex flex-row justify-between border-b-[1px] mt-3">
                                    <div className="w-[11.25rem] h-[6.313rem]">
                                        <Image
                                            src="https://tpc.googlesyndication.com/simgad/3352512289381417150"
                                            alt="Picture of the author"
                                            style={{ width: 'auto', height: 'auto' }}
                                        />
                                    </div>
                                    <div className="pb-5 mb-5 flex-[3] pl-2">
                                        <Link to={`/posts/${post._id}`} className="mb-[6px] text-2xl hover:text-blue-500">
                                            {post.title}
                                        </Link>
                                        <TruncatedContent content={post && post.content} maxLength={150}/>
                                        <div className="flex gap-2">
                                            {post.topic.length > 0 ? (
                                                post.topic.map(topic => (
                                                    <Link key={topic._id} to={`/topics/${topic._id}`} className="bg-gray-200 hover:bg-gray-300 rounded-lg p-1 text-sm">
                                                        {topic.name}
                                                    </Link>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 ">No topics available</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No posts available.</p>
                        )}
                    </div>
                    <div className="flex-none w-[272px] md:block px-3">
                        <h4 className="text-xl mb-4">Related Tags</h4>
                        <div>
                            {tags.map(tag => (
                                <div key={tag._id} className="ml-6 mb-3 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg p-1 w-fit">
                                    <Link to={`/tags/${tag._id}`}>{tag.name}</Link>
                                </div>
                            ))}
                        </div>
                        <h4 className="text-xl mb-4">Hot Network Questions</h4>
                        <div>
                            {filteredPosts.slice(0, 3).map(post => (
                                <div key={post._id} className="ml-6 mb-3 text-xs hover:text-blue-500">
                                    <Link to={`/posts/${post._id}`}>{post.title}</Link>
                                    <hr />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
               
            </div>
        </div>
    );
}

export default Tag;
