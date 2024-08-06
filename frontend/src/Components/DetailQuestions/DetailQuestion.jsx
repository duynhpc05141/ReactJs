import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Modal, notification ,Image, Space } from 'antd';
import './style.css';
import CommentSection from '../Comment/CommentSection';
import axiosConfig from '../../config/axiosConfig';
import Report from '../Report/Report';
import Answer from '../Answer/Answer';
import DropdownQ from '../Dropdown/Dropdown';


function DetailQuestion() {
  const [question, setQuestion] = useState();
  const [questionsReply, setQuestionsReply] = useState();
  const [copyStatus, setCopyStatus] = useState('Copy'); 
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const contentRef = useRef(null);
  const replyRefs = useRef([]);
  const codeRefs = useRef([]);
  const [visibleComments, setVisibleComments] = useState({});
  const [commentTimeouts, setCommentTimeouts] = useState({}); 

  const toggleComments = (postId) => {
   
    if (commentTimeouts[postId]) {
      clearTimeout(commentTimeouts[postId]);
    }

    const timeoutId = setTimeout(() => {
      setVisibleComments(prev => ({
        ...prev,
        [postId]: !prev[postId]
      }));
    }, 500);

    setCommentTimeouts(prev => ({
      ...prev,
      [postId]: timeoutId
    }));
  };

 
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        notification.success({
          message: 'Content Copied',
        });
      })
      .catch(err => {
        console.error('Failed to copy content: ', err);
      });
  };

  const addCopyButtons = (ref) => {
    if (ref.current) {
      const content = ref.current;
      const codeBlocks = content.querySelectorAll('pre.ql-syntax');
      codeBlocks.forEach((block) => {
        if (!block.previousElementSibling || !block.previousElementSibling.classList.contains('copy-button')) {
          const button = document.createElement('button');
          button.className = 'copy-button';
          button.innerHTML = `<span>${copyStatus}</span><FontAwesomeIcon icon={faCopy} />`;
          button.addEventListener('click', () => handleCopy(block.textContent));
          block.parentElement.insertBefore(button, block);
        }
      });
    }
  };

  useEffect(() => {
    const getQuestion = async () => {
      const res = await axiosConfig.get(`/posts/${id}`);
      setQuestion(res.data.data);
    };
    getQuestion();
  }, [id]);

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const res = await axiosConfig.get(`/posts`);
        if (question && question._id) {
          const filtered = res.data.data.filter((post) =>
            post.reply.some((reply) => reply._id === question._id)
          );
          setQuestionsReply(filtered);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    getQuestions();
  }, [question]);

  useEffect(() => {
    if (contentRef.current) {
      addCopyButtons(contentRef);
    }
    replyRefs.current.forEach(ref => addCopyButtons(ref));
  }, [question, questionsReply, copyStatus]);

  return (
    <div className="pb-4 pt-4">
      <div className="pt-4 px-3">
        <div>
          <h2 className="text-xl uppercase mb-4">
            {question && question.title}
            <DropdownQ postId={id} />
          </h2>

          <hr />
          <br />
        </div>

        <div className="flex flex-wrap md:flex-nowrap justify-center">
          <div className="grow pl-6 pb-8 md:border-l-[1px]">
            <Image
              src={question && question.media[0].url}
              alt="Picture of the author"
              className="!mx-auto !size-1/3"
            />
            <div className="justify-center mt-3">
              <div className="pb-5 mb-5 pl-2">
                <div
                  className="mb-4"
                  ref={contentRef}
                  dangerouslySetInnerHTML={{ __html: question && question.content }}
                />
                <div>
               
                </div>
                <div className="pt-4 App">
                  <h2 className="text-xl uppercase mb-4 text-left">
                    Your Answer
                  </h2>
                  <div className="pt-4 text-left">
                    <Button onClick={showModal}>
                      Your Answer
                    </Button>
                    <Modal
                      style={{ top: 20 }}
                      title="Your Answer"
                      open={isModalOpen}
                      onOk={handleOk}
                      onCancel={handleCancel}
                      width={1000}
                    >
                      <Answer />
                    </Modal>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-none w-[272px] md:block px-3">
            <h4 className="text-xl mb-4">Hot Network Questions</h4>
            <div>
              <div className="ml-6 mb-3 text-xs hover:text-blue-500">
                <Link to="">
                  How to output the correlation/euclidian value for the dendogram in pheatmap R?
                </Link>
              </div>
              <hr />
              <div className="ml-6 mb-3 text-xs hover:text-blue-500">
                <Link to="">
                  How to output the correlation/euclidian value for the dendogram in pheatmap R?
                </Link>
              </div>
              <hr />
              <div className="ml-6 mb-3 text-xs hover:text-blue-500">
                <Link to="">
                  How to output the correlation/euclidian value for the dendogram in pheatmap R?
                </Link>
              </div>
              <hr />
            </div>
          </div>
        </div>
      </div>
      <h2>Answer</h2>
      {questionsReply?.map((r, index) => (
        <div className="pt-4 px-3" key={r._id}>
          <div>
            <h2 className="text-xl uppercase mb-4">
              {r && r.title}
              <DropdownQ postId={r._id} />
            
            </h2>
            <hr />
            <br />
          </div>

          <div className="flex flex-wrap md:flex-nowrap justify-center">
            <div className="grow pl-6 pb-8 md:border-l-[1px]">
              <Image
                src={r && r?.media[0]?.url}
                alt="Picture of the author"
                className="!mx-auto !size-1/3"
              />
              <div className="justify-center mt-3">
                <div className="pb-5 mb-5 pl-2">
                  <div
                    className="mb-4"
                    dangerouslySetInnerHTML={{ __html: r && r.content }}
                    ref={el => replyRefs.current[index] = el}
                  />
                </div>
              </div>
            </div>
            <div className="flex-none w-[272px] md:block px-3">
            </div>
          </div>
          <p onClick={() => toggleComments(r._id)} className="ml-2 cursor-pointer">
            {visibleComments[r._id] ? 'Hide Comments' : 'Comments'}
          </p>

          {visibleComments[r._id] && (
            <div className="pt-4">
              <CommentSection idArticle={r._id} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default DetailQuestion;
