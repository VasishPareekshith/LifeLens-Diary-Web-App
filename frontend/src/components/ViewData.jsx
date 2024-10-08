import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Diary from "../assets/opendiary2.png";

const ViewData = () => {
    const [selectedDate, setSelectedDate] = useState(new Date()); // Initialize with current date
    const [textValue, setTextValue] = useState(''); // State to hold text data from the database
    const [imageUrl, setImageUrl] = useState(''); // State to hold the image URL from the database
    const email = localStorage.getItem('email'); // Assuming email is stored in localStorage

    // Function to handle date change
    const handleDateChange = (event) => {
        const newDate = new Date(event.target.value);  // Always create a Date object
        setSelectedDate(newDate);

        // Fetch data from the database based on the selected date and email
        fetchDataByDateAndEmail(newDate.toISOString().substr(0, 10), email);
    };

    // Fetch data from the backend when the date changes
    const fetchDataByDateAndEmail = async (entryDate, email) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/diary/get-entry`, {
                params: { entryDate, email }  // Send both date and email as query parameters
            });

            // Assuming the response data contains 'content' and 'imageUrl'
            const { content, imageUrl } = response.data;
            
            setTextValue(content || 'No content available for this date'); // If no content is found, show a default message
            setImageUrl(imageUrl || ''); // If no image is found, clear the image URL
        } catch (error) {
            console.error('Error fetching data:', error);
            setTextValue('Error fetching data'); // Error handling
            setImageUrl(''); // Clear the image URL on error
        }
    };

    // Automatically fetch the data for the current date when the component mounts
    useEffect(() => {
        fetchDataByDateAndEmail(selectedDate.toISOString().substr(0, 10), email);
    }, [email, selectedDate]);
    
    return (
        <div style={{ padding: '20px' }}>
            <div
                style={{
                    width: '93%',
                    height: '60px',
                    display: 'flex',
                    marginLeft: '50px',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <label style={{ marginRight: '10px' }}>Select a Date:</label>
                <input
                    type="date"
                    value={selectedDate.toISOString().substr(0, 10)}
                    onChange={handleDateChange}
                    style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
            </div>

            <div
                style={{
                    width: '803px',
                    height: '552.5px',
                    margin: 'auto',
                    padding: '20px',
                    backgroundImage: `url(${Diary})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                }}
            >
                {/* Container for Left and Right Divs */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* Left Div for Image */}
                    <div
                        style={{
                            width: '44%',
                            height: '510px',
                            marginLeft: '50px',
                            backgroundColor: 'transparent',
                            padding: '10px',
                            overflowY: 'auto', // Enable scrolling if content overflows
                        }}
                    >
                        {/* Show the image fetched from the database */}
                        {imageUrl ? (
                            <img src={imageUrl} alt="Diary entry" style={{ width: '100%', marginBottom: '10px' }} />
                        ) : (
                            <p>No image available for this date</p>
                        )}
                    </div>

                    {/* Right Div for Text Area */}
                    <div
                        style={{
                            width: '47%',
                            height: '500px',
                            marginTop: '5px',
                            marginRight: '5px',
                            backgroundColor: 'transparent',
                            padding: '10px',
                        }}
                    >
                        {/* Display the text data fetched from the database */}
                        <textarea
                            style={{
                                height: '102%',
                                width: '100%',
                                padding: '10px',
                                border: 'none',
                                outline: 'none',
                                resize: 'none',
                                boxSizing: 'border-box',
                                backgroundColor: 'transparent',
                            }}
                            value={textValue}
                            readOnly  // Make the text area read-only
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewData;
