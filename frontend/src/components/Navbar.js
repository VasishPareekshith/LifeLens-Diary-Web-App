import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import menu from "../assets/menu.png";

const Navbar = ({ setCurrentPage }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown visibility

    const toggleDropdown = () => {
        setDropdownOpen(prevState => !prevState); // Toggle dropdown visibility
    };

    const handleAddEntry = () => {
        setCurrentPage('calendar'); // Set current page to 'calendar'
        setDropdownOpen(false); // Close the dropdown after selecting an option
    };

    const handleViewTimeline = () => {
        setCurrentPage('viewdata'); // Set current page to 'viewdata'
        setDropdownOpen(false); // Close the dropdown after selecting an option
    };

    const handleProfile = () => {
        setCurrentPage('profile'); // Set current page to 'viewdata'
        setDropdownOpen(false); // Close the dropdown after selecting an option
    };

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', width: '100%' }}>
            <ul style={{ listStyleType: 'none', display: 'flex', padding: '0', margin: '0' , marginLeft:'auto'}}>
                {/* Profile Button with Dropdown */}
                <li style={{ position: 'relative'}}>
                    <div
                        onClick={toggleDropdown}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '5px',
                            border: 'none',
                            height: '120px',
                            width: '120px',
                            backgroundImage: `url(${menu})`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            cursor: 'pointer',
                            fontFamily: 'Dancing Script, cursive'
                        }}
                    >
                    </div>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <ul style={{
                            position: 'absolute',
                            top: '130%', // Adjust as needed
                            right: '0',
                            backgroundColor: 'white',
                            borderRadius: '5px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            padding: '10px',
                            listStyleType: 'none',
                            margin: '0',
                        }}>
                            <li style={{ margin: '5px 0' }}>
                                <div
                                    onClick={handleAddEntry}
                                    style={{
                                        padding: '10px',
                                        borderRadius: '5px',
                                        backgroundColor: '#4CAF50',
                                        color: '#fff',
                                        cursor: 'pointer',
                                        fontFamily: 'Dancing Script, cursive'
                                    }}
                                >
                                    Add Entry
                                </div>
                            </li>
                            <li style={{ margin: '5px 0' }}>
                                <div
                                    onClick={handleViewTimeline}
                                    style={{
                                        padding: '10px',
                                        borderRadius: '5px',
                                        backgroundColor: '#4CAF50',
                                        color: '#fff',
                                        cursor: 'pointer',
                                        fontFamily: 'Dancing Script, cursive'
                                    }}
                                >
                                    View Timeline
                                </div>
                            </li>
                            <li style={{ margin: '5px 0' }}>
                                <div
                                    onClick={handleProfile}
                                    style={{
                                        padding: '10px',
                                        borderRadius: '5px',
                                        backgroundColor: '#4CAF50',
                                        color: '#fff',
                                        cursor: 'pointer',
                                        fontFamily: 'Dancing Script, cursive'
                                    }}
                                >
                                    Profile
                                </div>
                            </li>
                        </ul>
                    )}
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
