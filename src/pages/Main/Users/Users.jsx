import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [passwordData, setPasswordData] = useState({ userId: '', newPassword: '' });
  const [loading, setLoading] = useState(true);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Assuming JWT is in localStorage
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle change password
  const handlePasswordChange = async (userId) => {
    if (!passwordData.newPassword) {
      alert('Please enter a new password');
      return;
    }

    try {
      const response = await axios.put(`/api/users/${userId}/password`, passwordData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.status === 200) {
        alert('Password changed successfully');
        fetchUsers(); // Refresh the list after password change
      }
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Users</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{`${user.firstName} ${user.middleName} ${user.lastName}`}</td>
                <td>{user.role}</td>
                <td>
                  <input
                    type="password"
                    placeholder="New Password"
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  />
                  <button onClick={() => handlePasswordChange(user.id)}>Change Password</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;
