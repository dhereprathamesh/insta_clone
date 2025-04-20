"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function AddPost() {
  const { register, handleSubmit, setValue } = useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("caption", data.caption);
      formData.append("image", data.image);

      // Call the API with axios
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/post/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Post added successfully!");

      console.log("Post added:", response.data);
      router.push("/profile");
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  const handleImageChange = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file[0]);
    setValue("image", file[0]);
  };

  const removeImage = () => {
    setImagePreview(null);
    setValue("image", null);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: handleImageChange,
  });

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-black rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6 text-white">
        Create Post
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Caption Input */}
        <div>
          <textarea
            {...register("caption")}
            placeholder="Write a caption..."
            className="w-full h-32 p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Image Upload */}
        <div
          className="w-full h-60 border-2 border-dashed border-gray-300 rounded-lg flex justify-center items-center cursor-pointer relative overflow-hidden"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          {imagePreview ? (
            <>
              <img
                src={imagePreview}
                alt="Post Preview"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75"
              >
                <AiOutlineCloseCircle size={24} />
              </button>
            </>
          ) : (
            <div className="text-center text-gray-500">
              <p>Drag & drop or click to select an image</p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Post
        </button>
      </form>
    </div>
  );
}
