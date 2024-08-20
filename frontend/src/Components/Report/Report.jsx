import { useEffect, useState } from 'react';
import { Button, Modal, Select, Input, notification } from 'antd';
import { useParams } from 'react-router-dom';
import './report.css';
import axiosConfig from '../../config/axiosConfig';
import getUsersFromLocalStorage from '../../utils/getDataUser';

function Report({ idPost }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const [otherReason, setOtherReason] = useState('');
    const [canReport, setCanReport] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [postUserId, setPostUserId] = useState(null);

    const user = getUsersFromLocalStorage();

    useEffect(() => {
        const fetchPostUserId = async () => {
            try {
                const res = await axiosConfig.get(`/posts/${idPost}`);
                setPostUserId(res.data.data.user._id);
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };

        fetchPostUserId();
    }, [idPost]);

    useEffect(() => {
        if (user && user._id && user._id !== postUserId) {
            setCanReport(true);
        } else {
            setCanReport(false);
        }
    }, [user, postUserId]);

    const showModal = () => {
        if (canReport) {
            setIsModalOpen(true);
        }
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleChange = (value) => {
        setSelectedValue(value);
        if (value !== 'Others') {
            setOtherReason('');
        }
    };

    const handleOtherReasonChange = (e) => {
        setOtherReason(e.target.value);
    };

    const sendReport = async () => {
        if (!selectedValue) {
            setErrorMessage('Please select one reason.');
            return;
        }

        const reason = selectedValue === 'Others' ? otherReason : selectedValue;

        if (!reason) {
            setErrorMessage('Please provide a reason.');
            return;
        }

        if (!user._id) {
            alert('User not found.');
            return;
        }

        const reportData = {
            post: idPost,
            user: user._id,
            reason,
        };

        try {
            await axiosConfig.post('/reports', reportData);
            notification.success({
                message: 'Report Sent',
                description: 'Your report has been submitted successfully.',
            });
            handleOk();
        } catch (error) {
            console.error('Error sending report:', error);
            notification.error({
                message: 'Report Failed',
                description: 'There was an error sending your report. Please try again.',
            });
        }
    };

    return (
        <>
            <Button className='outline-none border-none hover:bg-transparent' onClick={showModal} disabled={!canReport}>
                Report
            </Button>
            <Modal
                title="Please select the reason"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={sendReport}>
                        Send
                    </Button>,
                ]}
            >
                <Select
                    defaultValue=""
                    className="w-full"
                    onChange={handleChange}
                    options={[
                        { value: '', label: 'Please select one option', disabled: true },
                        { value: 'Inaccurate or Misleading Information', label: 'Inaccurate or Misleading Information' },
                        { value: 'Violation of Content Policies', label: 'Violation of Content Policies' },
                        { value: 'Spam or Advertising', label: 'Spam or Advertising' },
                        { value: 'Out of Context', label: 'Out of Context' },
                        { value: 'Copyright Violation', label: 'Copyright Violation' },
                        { value: 'Others', label: 'Others' },
                    ]}
                />
                {selectedValue === 'Others' && (
                    <Input
                        placeholder="Please specify the reason"
                        value={otherReason}
                        onChange={handleOtherReasonChange}
                        className="mt-2"
                    />
                )}
                <p className='text-red-500'>{errorMessage}</p>
            </Modal>
        </>
    );
}

export default Report;
