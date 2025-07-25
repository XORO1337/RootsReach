import React from 'react';

const LogoutButton = ({ redirectTo = '/login' }) => {
  const handleLogout = () => {
    alert('Logout clicked!'); // This will definitely show if click works
    localStorage.clear(); // Clear everything
    window.location.href = '/'; // Go to root page
  };

  return (
    <div 
      onClick={handleLogout}
      style={{ 
        display: 'inline-block',
        padding: '8px 16px',
        backgroundColor: '#ef4444',
        color: 'white',
        borderRadius: '4px',
        cursor: 'pointer',
        userSelect: 'none',
        zIndex: 99999,
        position: 'relative'
      }}
    >
      LOGOUT
    </div>
  );
};

export default LogoutButton;
