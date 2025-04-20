"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const dummyUsers = [
  {
    id: 1,
    username: "john_doe",
    profilePic: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    username: "jane_smith",
    profilePic: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    username: "alex_rocks",
    profilePic: "https://i.pravatar.cc/150?img=3",
  },
];

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchTerm.trim() === "") {
        setResults([]);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/search?query=${searchTerm}`
        );
        console.log(response.data);

        setResults(response.data.user);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchUsers, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleSearch = (userId) => {
    router.push(`/profile/${userId}`);
  };

  return (
    <>
      <div className="p-4 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Search</h1>

        <input
          type="text"
          placeholder="Search users..."
          className="w-full px-4 py-2 border rounded-md mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {loading && <p className="text-center text-blue-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {searchTerm.trim() !== "" && !loading && !error && (
          <div className="space-y-4">
            {results.length > 0 ? (
              results.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-4 p-2 border rounded-md shadow-sm"
                >
                  <img
                    src={user.profilePic}
                    alt={user.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <span
                    className="text-lg font-medium cursor-pointer"
                    onClick={() => handleSearch(user._id)}
                  >
                    {user.name}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No users found</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
