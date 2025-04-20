"use client";

import { useEffect, useState } from "react";
import ProfilePostCard from "@/components/ProfilePostCard";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function ProfileById() {
  const [activeTab, setActiveTab] = useState("posts");
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState(false);
  const [userId, setUserId] = useState(null);
  const params = useParams();

  useEffect(() => {
    const storedUser = localStorage.getItem("userId");
    setUserId(storedUser);
  }, []);

  useEffect(() => {
    if (profile?.followers.map(String).includes(String(userId))) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
  }, [profile, userId]);

  useEffect(() => {
    const id = params.id;

    const fetchData = async () => {
      try {
        const profileRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/${id}`
        );

        const postsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/post/getPostByUserId/${id}`
        );

        setProfile(profileRes.data.user);
        setPosts(postsRes.data.posts);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [params.id]);

  const handleFollow = async () => {
    const token = localStorage.getItem("token");

    if (!following && token) {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/follow/${params.id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFollowing(true);
        setProfile((prev) => ({
          ...prev,
          followers: [...prev.followers, userId],
        }));
      } catch (error) {
        console.error("Error following user:", error);
      }
    }
  };

  const handleUnfollow = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/unfollow/${params.id}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFollowing(false);
        setProfile((prev) => ({
          ...prev,
          followers: prev.followers.filter(
            (followerId) => followerId !== userId
          ),
        }));
      } catch (error) {
        console.error("Error unfollowing user:", error);
      }
    }
  };

  const user = {
    profilePic:
      "https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg",
    username: "john_doe",
    description: "Full Stack Developer | Traveler 🌍",
    posts: [
      "https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg  ",
      "https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg  ",
      "https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg  ",
      "https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg  ",
    ],
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
                onClick={handleFollow}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
              >
                {following ? "following" : "follow"}
              </button>
              <button
                onClick={handleUnfollow}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
              >
                Unfollow
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
        </div>

        {/* Tab Content */}
        {activeTab === "posts" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {posts &&
              posts.map((post, index) => (
                <ProfilePostCard
                  key={index}
                  post={post}
                  index={index}
                  onDelete={() => handleDeletePost(index)}
                />
              ))}
          </div>
        )}
      </div>
    </>
  );
}
