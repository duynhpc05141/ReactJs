import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Button, Menu, Modal, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import Report from '../Report/Report';
import axiosConfig from '../../config/axiosConfig';
import getUsersFromLocalStorage from '../../utils/getDataUser';

function DropdownQ({ postId, postUserId, onDelete }) {
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const user = getUsersFromLocalStorage();

  useEffect(() => {
    if (user._id === postUserId) {
      setCanEdit(true);
      setCanDelete(true);
    }
  }, [user, postUserId]);

  const deletePost = async () => {
    try {
      await axiosConfig.delete(`/posts/${postId}`);
      message.success('Post deleted successfully');
      if (onDelete) {
        onDelete(postId);
      }
    } catch (error) {
      message.error('Failed to delete post');
      console.error('Error deleting post:', error);
    }
  };

  const showConfirm = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete this post?',
      content: 'This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: deletePost,
    });
  };

  const menu = (
    <Menu>
      {canEdit && (
        <Menu.Item key="edit">
          <Link to={`/ask/edit/${postId}`}>
            Edit
          </Link>
        </Menu.Item>
      )}
      <Menu.Item key="report">
        <Report idPost={postId} />
      </Menu.Item>
      {canDelete && (
        <Menu.Item key="delete" onClick={showConfirm}>
          Delete
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <Dropdown 
      overlay={menu} 
      placement="bottomLeft" 
      arrow 
      className='float-right'
    >
      <Button><FontAwesomeIcon icon={faEllipsis} /></Button>
    </Dropdown>
  );
}

export default DropdownQ;
