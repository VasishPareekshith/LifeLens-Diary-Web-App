import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AddData from './components/AddData';
import ViewData from './components/ViewData';
import Profile from './components/Profile';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignIn/SignUp';
import './App.css';

// Protected Route component to check authentication
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token'); // Check if the user has a token
    if (!token) {
        return <Navigate to="/sign-in" />; // Redirect to SignIn if not authenticated
    }
    return children;
};

const App = () => {
    const [currentPage, setCurrentPage] = useState('calendar');
    const [selectedDate, setSelectedDate] = useState(null);

    const handleAddData = () => {
        if (selectedDate) {
            setCurrentPage('addData');
        }
    };

    const handleViewData = () => {
        setCurrentPage('viewData');
    };

    return (
        <div className="app">
            <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />

                {/* Protected Routes for authenticated users */}
                <Route 
                    path="/diary" 
                    element={
                        <ProtectedRoute>
                            <>
                                <Navbar setCurrentPage={setCurrentPage} />
                                <div className="content">
                                    {currentPage === 'calendar' && (
                                        <AddData 
                                            setCurrentPage={setCurrentPage}
                                            setSelectedDate={setSelectedDate}
                                            selectedDate={selectedDate}
                                            handleAddData={handleAddData}
                                            handleViewData={handleViewData}
                                        />
                                    )}
                                    {currentPage === 'viewdata' && (
                                        <ViewData
                                            selectedDate={selectedDate}
                                            setCurrentPage={setCurrentPage} 
                                        />
                                    )}
                                    {currentPage === 'profile' && (
                                        <Profile
                                            selectedDate={selectedDate}
                                            setCurrentPage={setCurrentPage} 
                                        />
                                    )}
                                </div>
                            </>
                        </ProtectedRoute>
                    }
                />
                
                <Route 
                    path="/profile" 
                    element={
                        <ProtectedRoute>
                            <Profile setCurrentPage={'profile'} />
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </div>
    );
};

export default App;
