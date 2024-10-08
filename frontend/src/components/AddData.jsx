import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Diary from "../assets/opendiary2.png";

const AddData = ({ setCurrentPage }) => {
    const [selectedDate, setSelectedDate] = useState(new Date()); // Initialize with current date
    const [textValue, setTextValue] = useState(new Date().toLocaleDateString(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }));
    const [image, setImage] = useState(null); // State to hold a single uploaded image
    const [entry, setEntry] = useState(''); // State to hold the diary text
    const [existingEntry, setExistingEntry] = useState(null); // State to hold the existing entry (if any)
    const imageInput = useRef(null);
    const email = localStorage.getItem('email'); // Assuming email is stored in localStorage

    // Fetch existing entry when date changes
    const fetchExistingEntry = async (entryDate) => {
        try {
            const response = await axios.get('http://localhost:5000/api/diary/get-entry', {
                params: { entryDate, email }
            });
            const { content, imageUrl } = response.data;
            
            // Populate the form with the existing data
            setEntry(content || '');
            setImage(imageUrl ? await fetchImageFromUrl(imageUrl) : null);
            setExistingEntry(response.data); // Store the fetched entry
        } catch (error) {
            console.log('No entry found for this date');
            setEntry(''); // Clear the entry field if no entry exists
            setImage(null); // Clear the image if no entry exists
        }
    };

    // Helper to fetch image blob from the URL
    const fetchImageFromUrl = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], "existingImage", { type: blob.type });
    };

    // Call fetchExistingEntry when the date changes
    useEffect(() => {
        const dateString = selectedDate.toISOString().substr(0, 10); // Format the date as YYYY-MM-DD
        fetchExistingEntry(dateString);
    }, [selectedDate]);

    // Handle text area input change
    const handleDataChange = (event) => {
        setEntry(event.target.value); // Update entry state
    };

    // Handle date change
    const handleDateChange = (event) => {
        const newDate = new Date(event.target.value);
        setSelectedDate(newDate);
        setTextValue(newDate.toLocaleDateString(undefined, {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }));
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        const entryId = `entry-${Date.now()}`; // Generate unique entry ID

        let imageUrl = null;
        if (image) {
            try {
                const formData = new FormData();
                formData.append('image', image);

                const uploadResponse = await axios.post('http://localhost:5000/api/diary/upload-image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                imageUrl = uploadResponse.data.imageUrl;
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }

        // Store or update the diary entry (with image URL if it was uploaded)
        try {
            await axios.post('http://localhost:5000/api/diary/add-entry', {
                entryId: existingEntry ? existingEntry.entryId : entryId, // Use existing entryId if updating
                email,
                entryDate: selectedDate.toISOString().substr(0, 10),
                content: entry,
                imageUrl, // Store image URL in DynamoDB
            });
            console.log('Diary entry added/updated successfully');
            setCurrentPage('viewdata'); // Redirect to the view data page
        } catch (error) {
            console.error('Error adding/updating diary entry:', error);
        }
    };

    // Handle image upload
    const handleImageUpload = (event) => {
        const file = event.target.files[0]; // Store only the first uploaded image file
        if (file) {
            setImage(file); // Update image state with the file
        }
    };

    const triggerFileInput = () => {
        imageInput.current.click(); // Trigger file input click when the div is clicked
    };

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
                <label>Select Date:</label>
                <input
                    type="date"
                    value={selectedDate.toISOString().substr(0, 10)}
                    onChange={handleDateChange}
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
                    backgroundSize: 'cover'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* Left Div for Uploaded Image */}
                    <div
                        style={{
                            width: '44%',
                            height: '510px',
                            marginLeft: '50px',
                            backgroundColor: 'transparent',
                            padding: '10px',
                            overflowY: 'auto', // Enable scrolling if content overflows
                        }}
                        onClick={triggerFileInput} // Trigger file input on click
                    >
                        <input
                            type="file"
                            accept="image/*"
                            ref={imageInput}
                            onChange={handleImageUpload}
                            style={{ display: 'none' }} // Hide file input
                        />
                        {image ? (
                            <img
                                src={URL.createObjectURL(image)} // Generate a URL for the selected image
                                alt="Uploaded"
                                style={{ width: '100%', marginBottom: '10px' }} // Show the selected image
                            />
                        ) : (
                            <p style={{ color: 'grey' }}>Click to upload image</p> // Placeholder text when no image is selected
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
                        <span style={{ marginRight: '10px', color: 'black' }}>{textValue}</span>
                        <textarea
                            style={{
                                height: '100%',
                                width: '100%',
                                padding: '10px',
                                border: 'none',
                                outline: 'none',
                                resize: 'none',
                                boxSizing: 'border-box',
                                backgroundColor: 'transparent',
                                fontFamily: 'Dancing Script, cursive'
                            }}
                            value={entry}
                            onChange={handleDataChange}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <button
                        onClick={handleSubmit}
                        style={{
                            width: '40%',
                            padding: '10px',
                            borderRadius: '5px',
                            border: 'none',
                            backgroundColor: '#4CAF50',
                            color: '#fff',
                            cursor: 'pointer',
                        }}
                    >
                        Submit Data
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddData;
