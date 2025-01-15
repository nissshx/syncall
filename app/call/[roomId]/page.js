"use client"import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Peer from "simple-peer";
import { database, ref, onValue, set, push } from "../firebase"; // Firebase utilities

export default function VideoCall() {
  const userVideo = useRef();
  const partnerVideo = useRef();
  const peerRef = useRef();
  const router = useRouter();
  const [roomId, setRoomId] = useState(null); // Local state for roomId
  const [error, setError] = useState(null);

  useEffect(() => {
    if (router.query.roomId) {
      setRoomId(router.query.roomId); // Set roomId from query when available
    }
  }, [router.query.roomId]);

  useEffect(() => {
    if (!roomId) return;

    const roomRef = ref(database, `rooms/${roomId}`);

    // Access the user's webcam and mic
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;

        const peer = new Peer({
          initiator: false,
          trickle: false,
          stream: stream,
        });

        peer.on("signal", (signal) => {
          // Save signal data to Firebase
          const signalRef = push(ref(database, `rooms/${roomId}/signals`));
          set(signalRef, { signal, type: "offer" });
        });

        peer.on("stream", (partnerStream) => {
          partnerVideo.current.srcObject = partnerStream;
        });

        peerRef.current = peer;

        // Listen for signal data from Firebase
        onValue(ref(database, `rooms/${roomId}/signals`), (snapshot) => {
          const signals = snapshot.val();
          if (signals) {
            Object.values(signals).forEach(({ signal, type }) => {
              if (type === "offer" && !peer.initiator) {
                peer.signal(signal);
              }
            });
          }
        });
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err);
        setError("Error accessing media devices. Please check your permissions.");
      });

    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, [roomId]);

  if (!roomId) {
    return <div>Loading...</div>; // Display a loading message until roomId is available
  }

  if (error) {
    return <div>{error}</div>; // Display any error related to media devices
  }

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
