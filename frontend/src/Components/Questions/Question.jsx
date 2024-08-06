import React ,{useState,useEffect} from "react";
import { SearchOutlined, FacebookOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom"; 
import { Image } from "antd"; 
import PaginationPage from "../SharePagination/Pagination";
import axiosConfig from "../../config/axiosConfig";
function QuestionsPage() {
    const [questions, setQuestions] = useState([]);
    useEffect(()=>{
const fetchQuestions = async()=>{
 try {
    const res=await axiosConfig.get('/posts')
    const canDisplay = res.data.data.filter((question) => question.hide===false && question.reply.length===0) 
    setQuestions(canDisplay)
 } catch (error) {
    console.log(error);
    
 }   
}
fetchQuestions()
    },[questions])
    return (
        <>
            <div className="pb-4 pt-4">
                <div className="pt-4 px-3">
 
                        <h2 className="text-3xl uppercase mb-4">
                            All Questions
                        </h2>
                 
                            <div className="flex flex-wrap md:flex-nowrap justify-center">
                                <div className="grow pl-6  pb-8  md:border-l-[1px]">
                                    {questions.map((question) => (

                                    <div className="flex flex-row justify-between  border-b-[1px] mt-3">
                                        <div className="w-[11.25rem] h-[6.313rem] ">
                                            <Image
                                                src={question && question.media[0].url}
                                                alt="Picture of the author"
                                                style={{ width: 'auto', height: 'auto' }}
                                            />
                                        </div>
                                        <div className="pb-5 mb-5 flex-[3] pl-2">
                                            <Link to={`/question/${question._id}`} className="mb-[6px] text-2xl hover:text-blue-500">
                                                {question && question.title}
                                            </Link>
                                            <p className="mb-4 italic" dangerouslySetInnerHTML={{ __html: question && question.content }} />

                                            <div className="flex gap-2">
                                                {question && question.topic.map((tag) => (
                                                    
                                                <Link to={`/tags/${tag._id}`} className="bg-gray-200 hover:bg-gray-300 rounded-lg p-1 text-sm">{tag && tag.name }</Link>
                                                ))}
                                              
                                            </div>
                                        </div>
                                    </div>
                                    ))}
                                  
                                    <div className="pt-4">
                                        <PaginationPage />
                                    </div>
                                </div>
                                <div className="flex-none w-[272px]  md:block  px-3">
                                    <h4 className="text-xl  mb-4">Related Tags</h4>
                                    <div>
                                    {questions && questions.map((q) => (
  q && q.topic && q.topic.map((tag) => (
    <div key={tag._id} className="ml-6 mb-3 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg p-1 w-fit">
      <Link to={`tags/${tag._id}`} className="bg-gray-200 hover:bg-gray-300 rounded-lg p-1 text-sm">
        {tag && tag.name}
      </Link>
    </div>
  ))
))}

               
                                    </div>
                                    <h4 className="text-xl  mb-4">Hot Network Questions</h4>
                                    <div>
                                        <div className="ml-6 mb-3 text-xs hover:text-blue-500">
                                            <Link to="">How to output the correlation/euclidian value for the dendogram in pheatmap R?</Link>
                                        </div><hr />
                                        <div className="ml-6 mb-3 text-xs hover:text-blue-500">
                                            <Link to="">How to output the correlation/euclidian value for the dendogram in pheatmap R?</Link>
                                        </div><hr />
                                        <div className="ml-6 mb-3 text-xs hover:text-blue-500" >
                                            <Link to="">How to output the correlation/euclidian value for the dendogram in pheatmap R?</Link>
                                        </div><hr />
                                      
                                    </div>
                                    
                                </div>
                            </div>
                     
                    
                </div>
            </div>
        </>
    );
}

export default QuestionsPage;
