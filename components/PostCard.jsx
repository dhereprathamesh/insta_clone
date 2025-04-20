"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiHeart, FiMoreHorizontal } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import axios from "axios";

export default function PostCard({
  username,
  postId,
  profileImage,
  postImage,
  caption,
  likes = [],
  id,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [likesCount, setLikesCount] = useState(likes.length);
  const [liked, setLiked] = useState(false);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("userId");
    setUserId(storedUser);
  }, []);

  useEffect(() => {
    if (likes.map(String).includes(String(userId))) {
      setLiked(true);
    } else {
      setLiked(false);
    }
    setLikesCount(likes.length);
  }, [likes, userId]);

  const handleLikeToggle = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount((prev) => (newLiked ? prev + 1 : prev - 1));

    const token = localStorage.getItem("token");

    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/post/${
        newLiked ? "like" : "unlike"
      }/${postId}`;
      const method = newLiked ? "post" : "delete";

      await axios({
        method,
        url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Failed to toggle like:", error);
      // Rollback UI update if request fails
      setLiked(!newLiked);
      setLikesCount((prev) => (!newLiked ? prev + 1 : prev - 1));
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-black border border-gray-300 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <img
            src={profileImage}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="ml-3">
            <p className="font-semibold text-sm text-white">{username}</p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white hover:text-gray-400 text-xl"
          >
            <FiMoreHorizontal />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white text-black rounded shadow-md z-10">
              <button
                onClick={() => {
                  router.push(`/profile/${id}`);
                  setMenuOpen(false);
                }}
                className="block w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
              >
                View Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image */}
      <img
        src={postImage}
        alt="Post"
        className="w-full max-h-96 object-cover"
      />

      {/* Action Buttons */}
      <div className="flex items-center justify-between px-4 py-2 text-white">
        <div className="flex space-x-4 text-2xl">
          <button
            onClick={handleLikeToggle}
            className={`transition ${
              liked ? "text-red-500" : "hover:text-red-500"
            }`}
          >
            {liked ? <AiFillHeart /> : <FiHeart />}
          </button>
        </div>
      </div>

      {/* Likes */}
      {likesCount > 0 && (
        <div className="px-4 text-sm font-semibold text-white">
          {likesCount} {likesCount === 1 ? "like" : "likes"}
        </div>
      )}

      {/* Caption */}
      <div className="px-4 py-2 text-sm text-white">
        <span className="font-semibold">{username}</span> {caption}
      </div>
    </div>
  );
}
