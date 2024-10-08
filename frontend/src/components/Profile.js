import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [profile, setProfile] = useState({ name: '', email: '', profilePicture: '' });
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newProfilePicture, setNewProfilePicture] = useState(null);
    const navigate = useNavigate();

    // Fetch profile data from backend
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/profile');
                setProfile(response.data);
                setNewName(response.data.name);
                setNewEmail(response.data.email);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, []);

    // Handle profile picture change
    const handleProfilePictureChange = (e) => {
        setNewProfilePicture(e.target.files[0]);
    };

    // Handle profile update
    const handleUpdateProfile = async () => {
        const formData = new FormData();
        formData.append('name', newName);
        formData.append('email', newEmail);
        if (newProfilePicture) {
            formData.append('profilePicture', newProfilePicture);
        }

        try {
            await axios.put('http://localhost:5000/api/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Profile updated successfully!');
            // Refresh the profile data after updating
            const response = await axios.get('http://localhost:5000/api/profile');
            setProfile(response.data);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };


    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
            <img
                src={profile.profilePicture || 'https://via.placeholder.com/150'}
                alt="Profile"
                style={{ borderRadius: '50%', width: '150px', height: '150px', marginBottom: '20px' }}
            />
            <h1 style={{ fontSize: '36px', color: '#4CAF50' }}>{profile.name}</h1>
            <p style={{ fontSize: '24px', color: '#555' }}>{profile.email}</p>

            {/* Display Name */}
            <div style={{ marginBottom: '10px' }}>
                <strong>Name:</strong> {isEditingName ? (
                    <input 
                        type="text" 
                        value={newName} 
                        onChange={(e) => setNewName(e.target.value)} 
                        placeholder="Enter new name" 
                    />
                ) : (
                    <span>{profile.name}</span>
                )}
                <button onClick={() => setIsEditingName(!isEditingName)}>
                    {isEditingName ? 'Save' : 'Edit'}
                </button>
            </div>

            {/* Display Email */}
            <div style={{ marginBottom: '10px' }}>
                <strong>Email:</strong> {isEditingEmail ? (
                    <input 
                        type="email" 
                        value={newEmail} 
                        onChange={(e) => setNewEmail(e.target.value)} 
                        placeholder="Enter new email" 
                    />
                ) : (
                    <span>{profile.email}</span>
                )}
                <button onClick={() => setIsEditingEmail(!isEditingEmail)}>
                    {isEditingEmail ? 'Save' : 'Edit'}
                </button>
            </div>

            {/* Profile Picture Upload */}
            <input type="file" onChange={handleProfilePictureChange} />

            <button onClick={handleUpdateProfile} style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', margin: '20px 0' }}>
                Update Profile
            </button>
        </div>
    );
};

export default Profile;
