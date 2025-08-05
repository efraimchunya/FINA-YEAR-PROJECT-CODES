import React, { useState } from "react";

const ProfileImageUploader = ({ token }) => {
  const [imageURL, setImageURL] = useState(null);

  const handleUpload = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    const res = await fetch("http://localhost:5000/api/profile/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      console.log("Uploaded image:", data.profile_image);
      setImageURL(`http://localhost:5000${data.profile_image}`);
    } else {
      alert("Upload failed");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Upload Profile Image</h2>
      <input type="file" accept="image/*" onChange={handleUpload} />
      {imageURL && (
        <div className="mt-4">
          <p>Preview:</p>
          <img src={imageURL} alt="Profile" className="w-40 h-40 rounded-full object-cover" />
        </div>
      )}
    </div>
  );
};

export default ProfileImageUploader;
