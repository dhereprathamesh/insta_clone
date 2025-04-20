import { TrashIcon } from "@heroicons/react/24/solid";

export default function ProfilePostCard({ post, index, onDelete }) {
  return (
    <div className="relative">
      {console.log("post?.[index]?.imageUrl", post)}
      <img
        src={post?.imageUrl?.[0]}
        alt={`Post ${index}`}
        className="w-full h-60 object-cover rounded"
      />
      <button
        onClick={onDelete}
        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
