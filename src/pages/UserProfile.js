import React from "react";

function UserProfile({ userInformation }) {
    return (
    <div className="PageWrapper">
        <h1>User Profile</h1>
        <p>EMAIL: {userInformation.email}</p>
        <p>UID: {userInformation.uid}</p>
        <p>NAME: {userInformation.displayName}</p>
    </div>
    );
}

export default UserProfile;