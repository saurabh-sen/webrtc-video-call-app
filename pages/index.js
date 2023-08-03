import ButtonActions from "../components/ButtonActions/index";
import { useEffect, useState, useRef } from "react";
import { getCameraAccess, answerCall, makeCall } from "../utils";

const ICE_SERVERS = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

export default function Home() {
  const [isCameraAccess, setIsCameraAccess] = useState(false);

  const peerConnection = useRef(null);
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);

  useEffect(() => {
    peerConnection.current = new RTCPeerConnection(ICE_SERVERS);
  }, []);

  return (
    <main className="homepage flex min-h-screen flex-col items-center justify-center py-12 px-24 gap-7">
      <h2 className="heading text-4xl">
        Unstream video call - <b>webRTC</b>
      </h2>
      <p className="text-xl"> 3 steps to make a video call</p>
      <ol>
        <li className="text-xl">
          <b>Open Camera</b> - <i>get access to video and audio</i>
        </li>
        <li className="text-xl">
          <b>Create Offer</b> - <i>create a offer(sdp)</i>
        </li>
        <li className="text-xl">
          <b>Answer Call</b> - <i>click on answer from other device</i>
        </li>

      </ol>

      <div className="videos__local relative">

        <video
          ref={remoteVideo}
          src=""
          className=" bg-purple-400 rounded-2xl w-[60vw] "
          autoPlay
          playsInline
        >
        </video>
        <p className="absolute top-2 left-1/2 text-white font-semibold " style={{
          transform: "translateX(-50%)"
        }}>Remote stream</p>
        <div className="video__remote absolute top-4 right-4">
          <video
            ref={localVideo}
            src=""
            className="bg-purple-600 rounded-2xl w-60 "
            autoPlay
            playsInline
          ></video>
          <p className="absolute top-2 left-1/2 text-white font-semibold " style={{
          transform: "translateX(-50%)"
        }}>Local stream</p>
        </div>
        <ButtonActions
          isCameraAccess={isCameraAccess}
          getCameraAccess={() => getCameraAccess(peerConnection, localVideo, remoteVideo, setIsCameraAccess)}
          answerCall={() => answerCall(peerConnection)}
          makeCall={() => makeCall(peerConnection)}
        />
      </div>

    </main>
  );
}
