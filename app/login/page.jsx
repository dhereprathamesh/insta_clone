"use client";

import TextInput from "@/components/TextInput";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    console.log("data", data);

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/signin`,
        data
      );
      console.log(res.data);

      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.user._id);
        toast.success("Signup successful! Welcome to Instagram!");
        router.push("/home");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error, Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="max-w-md mx-auto m-30 p-6 border-black rounded-2xl shadow-md"
      style={{ backgroundColor: "#000000" }}
    >
      <h2 className="text-2xl text-center font-bold">Instagram</h2>
      {error && <div className="text-red-500 text-center">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          Don't have a account?
          <span className="mb-0 text-blue-500 hover:underline cursor-pointer">
            <Link href="/signup"> Sign up </Link>
          </span>
        </h2>
      </form>
    </div>
  );
}
