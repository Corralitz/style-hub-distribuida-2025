import React, { useState } from 'react';

const ProfileTab = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleSave = () => {
    // Here you would typically make an API call to update the user
    console.log('Saving user data:', editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={isEditing ? editedUser.name : user.name}
            onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            readOnly={!isEditing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={isEditing ? editedUser.email : user.email}
            onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            readOnly={!isEditing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={isEditing ? editedUser.phone : user.phone}
            onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            readOnly={!isEditing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <input
            type="text"
            value={isEditing ? editedUser.address : user.address}
            onChange={(e) => setEditedUser({...editedUser, address: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            readOnly={!isEditing}
          />
        </div>
      </div>
      <div className="mt-6 flex justify-start space-x-3">
        {!isEditing ? (
          <button 
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        ) : (
          <>
            <button 
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              onClick={handleSave}
            >
              Save Changes
            </button>
            <button 
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileTab;
