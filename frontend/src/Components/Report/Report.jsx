import { useEffect, useState } from 'react';
import { Button, Modal, Select, notification } from 'antd';
import { useParams } from 'react-router-dom';
import './report.css';
import axiosConfig from '../../config/axiosConfig';
import getUsersFromLocalStorage from '../../utils/getDataUser';

function Report({idPost}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const [canReport, setCanReport] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
   

    useEffect(() => {
        const user = getUsersFromLocalStorage();
        if (user && user._id) {
            setCanReport(true);
        } else {
            setCanReport(false);
        }
    }, []);

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
    };

    const sendReport = async () => {
        if (!selectedValue) {
            setErrorMessage('Please select one reason.');
            return;
        }

        const user = getUsersFromLocalStorage();
        const userId = user ? user._id : null;

        if (!userId) {
            alert('User not found.');
            return;
        }

        const reportData = {
            post: idPost,
            user: userId,
            reason: selectedValue,
        };

        try {
            const report = await axiosConfig.post('/reports', reportData);
            console.log('Report sent successfully:', report);
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
                    ]}
                />
            <p className='text-red-500'>{errorMessage}</p>
            </Modal>
        </>
    );
}

export default Report;
