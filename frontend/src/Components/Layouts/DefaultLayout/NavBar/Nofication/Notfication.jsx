import React, { useEffect, useState } from 'react';
import { Dropdown, Menu, Badge, Checkbox } from 'antd';
import { ref, onValue, remove } from 'firebase/database';
import { database } from '../../../../../firebase/config';
import { BellOutlined } from '@ant-design/icons';
import getUsersFromLocalStorage from '../../../../../utils/getDataUser';
import './Nofication.css'
const NotificationList = () => {
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);

    const loadNotifications = () => {
        const notificationsRef = ref(database, 'notifications');
        onValue(notificationsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const notificationArray = Object.values(data).sort((a, b) => new Date(b.readTime) - new Date(a.readTime));
                const sByUser = notificationArray.filter(notification => notification.userId === getUsersFromLocalStorage()._id);
                setNotifications(sByUser);
                setNotificationCount(sByUser.length);
            }
        }, {
            onlyOnce: false
        });
    };

    useEffect(() => {
        loadNotifications();

        return () => {
          
        };
    }, []);
    const handleCheckboxChange = (notificationId) => {
        remove(ref(database, `notifications/${notificationId}`))
            .then(() => {
                console.log('Notification deleted successfully');
                loadNotifications(); 
            })
            .catch((error) => {
                console.error('Error deleting notification: ', error);
                alert('Failed to delete notification. Please try again.');
            });
    };

    const menu = (
        <Menu className='cursor-pointer'>
            {notifications.length > 0 ? (
                notifications.map((notification) => (
                    <Menu.Item key={notification.id}>
                        <div style={{ position: 'relative' }}>
                            <Checkbox
                                style={{ position: 'absolute', top: '10px', right: '10px' }}
                                onChange={() => handleCheckboxChange(notification.postId)}
                            />
                            <div>
                                <p><strong>Question:</strong> {notification.postTitle}</p>
                                <p><strong>Reason:</strong> {notification.reason}</p>
                                <p><strong>Date:</strong> {new Date(notification.readTime).toLocaleString()}</p>
                            </div>
                        </div>
                    </Menu.Item>
                ))
            ) : (
                <Menu.Item>
                    No notifications available.
                </Menu.Item>
            )}
        </Menu>
    );

    return (
        <Dropdown overlay={menu} trigger={['click']}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                <Badge count={notificationCount} offset={[10, 0]}>
                    <BellOutlined style={{ fontSize: '24px' }} />
                </Badge>
            </a>
        </Dropdown>
    );
};

export default NotificationList;
