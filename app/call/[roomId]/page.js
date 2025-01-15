"use client"
import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { useRouter, useParams } from "next/navigation";

export default function VideoCall() {
  const userVideo = useRef();
  const partnerVideo = useRef();
  const peerRef = useRef();
  const router = useRouter();
  const { roomId } = useParams();  // Get roomId from useParams

  useEffect(() => {
    if (roomId) {
      console.log("Room ID:", roomId);  // Debugging line
    }
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;  // Wait until roomId is set

    if (typeof window !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Access the user's webcam and mic
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        userVideo.current.srcObject = stream;

        // Initialize peer connection
        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream: stream,
        });

        peer.on("signal", (data) => {
          // Send signal data to the server
        });

        peer.on("stream", (stream) => {
          partnerVideo.current.srcObject = stream;
        });

        peerRef.current = peer;
      }).catch((error) => {
        console.error("Error accessing media devices.", error);
        alert("Error accessing media devices: " + error.message);
      });
    } else {
      console.error("Media devices not available.");
      alert("Media devices not available.");
    }
  }, [roomId]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-800">
      <h2 className="text-white text-2xl mb-4">Room ID: {roomId}</h2>
      <div className="flex space-x-4">
        <video
          className="w-40 h-40 rounded-lg border-2 border-white"
          ref={userVideo}
          autoPlay
          playsInline
        />
        <video
          className="w-40 h-40 rounded-lg border-2 border-white"
          ref={partnerVideo}
          autoPlay
          playsInline
        />
      </div>
    </div>
  );
}