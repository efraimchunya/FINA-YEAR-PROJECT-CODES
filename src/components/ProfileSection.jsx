import React, { useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Camera } from "lucide-react";

export default function ProfileSection({ user, onImageUpdate }) {
  const [profileImage, setProfileImage] = useState(user?.avatarUrl || user?.image || "/default-avatar.png");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Preview = reader.result;
      setProfileImage(base64Preview); // Instant preview

      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("photo", file);

        const res = await axios.post("/api/upload-profile", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data?.imageUrl) {
          setProfileImage(res.data.imageUrl);
          toast.success("Profile image updated!");
          if (onImageUpdate) onImageUpdate(res.data.imageUrl);
        }
      } catch (err) {
        toast.error("Upload failed.");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="relative group w-28 h-28" onClick={() => inputRef.current?.click()}>
      <img
        src={profileImage}
        alt={`${user.name}'s profile`}
        className={`w-28 h-28 rounded-full border-4 border-blue-500 object-cover cursor-pointer group-hover:brightness-90 transition duration-150 ${
          loading ? "opacity-60 pointer-events-none" : ""
        }`}
      />
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={inputRef}
        onChange={handleUpload}
        disabled={loading}
      />
      <div className="absolute bottom-0 right-0 bg-blue-600 p-1 rounded-full">
        <Camera size={18} className="text-white" />
      </div>
    </div>
  );
}
