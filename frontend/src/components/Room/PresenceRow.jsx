import React from 'react';

const PresenceRow = ({ users = [] }) => {
  // Limit the number of avatars shown to prevent UI clutter
  const maxDisplay = 4;
  const visibleUsers = users.slice(0, maxDisplay);
  const hiddenCount = Math.max(0, users.length - maxDisplay);

  return (
    <div className="flex items-center -space-x-2">
      {visibleUsers.map((user, index) => (
        <div 
          key={user.id} 
          className="relative group"
          style={{ zIndex: maxDisplay - index }} // Ensures the first person is on top
        >
          <img 
            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
            alt={user.name} 
            className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 shadow-sm"
          />
          {/* Tooltip on hover */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {user.name}
          </div>
        </div>
      ))}
      
      {hiddenCount > 0 && (
        <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 shadow-sm relative z-0">
          +{hiddenCount}
        </div>
      )}
    </div>
  );
};

export default PresenceRow;
