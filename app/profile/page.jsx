"use client";

import { useEffect, useState } from "react";
import ProfilePostCard from "@/components/ProfilePostCard";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("posts");
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({
    name: "",
    phone: "",
    userName: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const profileRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const postsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/post/getPostByUserId`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfile(profileRes.data.user);
        setPosts(postsRes.data.posts);
        console.log("Profile:", profileRes.data);
        console.log("Posts:", postsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handleEditProfile = () => {
    // Populate the modal with the current profile details
    setUpdatedProfile({
      name: profile?.name || "",
      phone: profile?.phone || "",
      userName: profile?.userName || "",
    });
    setIsModalOpen(true);
  };

  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      // Send the updated data to the backend
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/editProfile`,
        updatedProfile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the profile state
      setProfile({
        ...profile,
        ...updatedProfile,
      });

      setIsModalOpen(false);

      toast.success("Post added successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");

      // Make the DELETE request to the backend
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/post/deletePost/${postId}`
      );

      // Remove the post from the state after successful deletion
      const updatedPosts = posts.filter((post) => post._id !== postId);
      setPosts(updatedPosts);

      console.log("Post deleted successfully");
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto p-4 bg-black min-h-screen text-white mt-4">
        {/* Profile header */}
        <div className="flex items-center gap-6 mb-8">
          <img
            src={profile?.profilePic}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-semibold">{profile?.name}</h2>
            {/* <p className="text-gray-400 my-2">{user.description}</p> */}
            <div className="flex gap-6 mt-2 text-gray-300 text-sm sm:text-base">
              <p>
                <span className="font-semibold text-white">
                  {posts?.length || 0}
                </span>{" "}
                posts
              </p>
              <p>
                <span className="font-semibold text-white">
                  {profile?.followers?.length || 0}
                </span>{" "}
                followers
              </p>
              <p>
                <span className="font-semibold text-white">
                  {profile?.following?.length || 0}
                </span>{" "}
                following
              </p>
            </div>
            <div className="flex gap-4 mt-2">
              <button
                onClick={handleEditProfile}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700 mb-4">
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-4 py-2 mr-4 ${
              activeTab === "posts"
                ? "border-b-2 border-white font-semibold"
                : "text-gray-400"
            }`}
          >
            Posts
          </button>

          {/* Add more tabs here later if needed */}
        </div>

        {/* Tab Content */}
        {activeTab === "posts" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {console.log("postssssssss", posts)}
            {posts && posts.length > 0 ? (
              posts.map((post, index) => (
                <ProfilePostCard
                  key={index}
                  post={post}
                  index={index}
                  onDelete={() => handleDeletePost(post?._id)}
                />
              ))
            ) : (
              <div className="text-white font-bold">No Post Added</div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center backdrop-blur-sm">
          <div className="bg-black p-6 rounded-lg w-96 border border-white">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <form onSubmit={handleProfileUpdate}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={updatedProfile.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={updatedProfile.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={updatedProfile.userName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
