"use client";

import PostCard from "@/components/PostCard";
import axios from "axios";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/post/getAllPost`
        );
        setPosts(response.data.post);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading posts...</div>;
  }

  return (
    <div className="min-h-screen flex justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        {posts.map((post) => (
          <PostCard
            key={post._id}
            username={post.user.name}
            profileImage={post.user.profilePic}
            postImage={post.imageUrl}
            caption={post.caption}
            likes={post.likes}
            id={post.user._id}
            postId={post._id}
          />
        ))}
      </div>
    </div>
  );
}
