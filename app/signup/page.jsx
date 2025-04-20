"use client";

import TextInput from "@/components/TextInput";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Handle image change and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image function
  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const onSubmit = async (data) => {
    if (!image) {
      setError("Please upload a profile image");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("userName", data.userName);
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("image", image);

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/signup`,
        formData
      );

      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.user._id);
        toast.success("Signup successful! Welcome to Instagram!");
        router.push("/home");
      }

      if (!res.ok) {
        throw new Error("Something went wrong!");
      }

      const result = await res.json();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="max-w-md mx-auto m-10 p-6 border-black rounded-2xl shadow-md"
      style={{ backgroundColor: "#000000" }}
    >
      <h2 className="text-2xl text-center font-bold">Instagram</h2>
      {error && <div className="text-red-500 text-center">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col items-center my-4">
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover border border-white"
              />
              <button
                onClick={removeImage}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs"
              >
                ✕
              </button>
            </div>
          ) : (
            <label className="cursor-pointer text-blue-400 hover:underline">
              Upload Profile Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>

        <TextInput
          label="Name"
          name="name"
          type="text"
          placeholder="Enter your name"
          register={register}
          errors={errors}
        />
        <TextInput
          label="User name"
          name="userName"
          type="text"
          placeholder="Enter your username"
          register={register}
          errors={errors}
        />
        <TextInput
          label="phone"
          name="phone"
          type="number"
          placeholder="Enter your phone no"
          register={register}
          errors={errors}
        />
        <TextInput
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email"
          register={register}
          errors={errors}
        />

        <TextInput
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          register={register}
          errors={errors}
        />

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded mt-4"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <h2 className="text-sm text-center font-bold mb-0">
          Already have a account?
          <span className="mb-0 text-blue-500 hover:underline cursor-pointer">
            <Link href="/login">login</Link>
          </span>
        </h2>
      </form>
    </div>
  );
}
