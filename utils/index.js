import { firestoreDb } from "@/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const answerCall = async (peerConnection) => {
  const offerCandidates = collection(firestoreDb, "calls/1/offerCandidates");
  const answerCandidates = collection(firestoreDb, `calls/1/answerCandidates`);

  const docRef = doc(firestoreDb, "calls", "1");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    peerConnection.current.onicecandidate = async (event) => {
      // event.candidate && answerCandidates.add(event.candidate.toJSON());
      if (event.candidate) {
        const docRef = await addDoc(answerCandidates, event.candidate.toJSON());
      }
    };

    const callData = docSnap.data();

    const offerDescription = callData.offer;
    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(offerDescription)
    );

    const answerDescription = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    // await callDoc.update({ answer });
    const answerUpdate = doc(firestoreDb, "calls", "1");

    // Set the answer in the firestore
    await updateDoc(answerUpdate, { answer });

    onSnapshot(offerCandidates, (doc) => {
      doc.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          peerConnection.current.addIceCandidate(candidate);
        }
      });
    });
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
};

const makeCall = async (peerConnection) => {
  const callDoc = collection(firestoreDb, "calls");
  const offerCandidates = collection(firestoreDb, "calls/1/offerCandidates");
  const answerCandidates = collection(firestoreDb, `calls/1/answerCandidates`);

  // Create offer
  const offerDescription = await peerConnection.current.createOffer();
  await peerConnection.current.setLocalDescription(offerDescription);

  // Get candidates for caller, save to db
  peerConnection.current.onicecandidate = async (event) => {
    // event.candidate && offerCandidates.add(event.candidate.toJSON());
    // Add a new document with a generated id.
    if (event.candidate) {
      const docRef = await addDoc(offerCandidates, event.candidate.toJSON());
    }
  };

  const offer = {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
  };

  // create reference to the document
  const offerRef = doc(firestoreDb, "calls", "1");
  const docRef = await setDoc(offerRef, { offer });

  // Listen for remote answer
  onSnapshot(doc(firestoreDb, "calls", "1"), (doc) => {
    const data = doc.data();
    if (!peerConnection.current.currentRemoteDescription && data?.answer) {
      const answerDescription = new RTCSessionDescription(data.answer);
      peerConnection.current.setRemoteDescription(answerDescription);
    }
  });

  // When answered, add candidate to peer connection
  onSnapshot(answerCandidates, (doc) => {
    doc.docChanges().forEach((change) => {
      if (change.type === "added") {
        const candidate = new RTCIceCandidate(change.doc.data());
        peerConnection.current.addIceCandidate(candidate);
      }
    });
  });
};

const getCameraAccess = async (
  peerConnection,
  localVideo,
  remoteVideo,
  setIsCameraAccess
) => {
  try {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const remoteStream = new MediaStream();

    if (peerConnection.current) {
      // Push tracks from local stream to peer connection
      localStream.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, localStream);
      });

      // Pull tracks from remote stream, add to video stream
      peerConnection.current.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
      };
      if (localVideo.current) {
        localVideo.current.srcObject = localStream;
      }
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = remoteStream;
      }
      setIsCameraAccess(true);
    }
  } catch (error) {
    console.log(error);
    alert("Something went wrong!");
  }
};

export { answerCall, makeCall, getCameraAccess };
