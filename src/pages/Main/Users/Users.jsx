import React, { useState } from "react";
import axios from "axios";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (newPassword !== confirmNewPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    try {
      // Get user information from local storage or context
      const userId = localStorage.getItem("userId");
      const email = localStorage.getItem("email");

      // Make API request
      const response = await axios.post("/api/change-password", {
        id: userId,
        email: email,
        current: { password: currentPassword },
        new: { password: newPassword },
      });

      // Handle response
      if (response.data.success) {
        setMessage("Password changed successfully.");
      } else {
        setMessage("Failed to change password.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="currentPassword">Current Password:</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmNewPassword">Confirm New Password:</label>
          <input
            type="password"
            id="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
