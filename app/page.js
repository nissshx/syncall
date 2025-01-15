"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  const handleCreateRoom = () => {
    if (roomId) {
      router.push(`/call/${roomId}`);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <input
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Enter Room ID"
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <button
        onClick={handleCreateRoom}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Create Room
      </button>
    </div>
  );
}
