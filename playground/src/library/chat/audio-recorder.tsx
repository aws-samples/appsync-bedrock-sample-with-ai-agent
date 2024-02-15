import React, { useState, useEffect } from "react";
import { View } from "@aws-amplify/ui-react";
import { ReactMic } from 'react-mic';

// interface AudioRecorderProps {
//   onRecordingComplete: (audioBlob: Blob) => void;
//   transcriptionText: string
// }

export function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlobUrl, setAudioBlobUrl] = useState('');

  const handleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      console.log("started recording")
    }
    else {
      setIsRecording(false);
      console.log("stopped recording")
    }
  };
  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const onData = (recordedBlob: any) => {
    console.log('chunk of real-time data is: ', recordedBlob);
  };

  const onStop = (recordedBlob: { blobURL: React.SetStateAction<string>; }) => {
    console.log('recordedBlob is: ', recordedBlob);
    setAudioBlobUrl(recordedBlob.blobURL);
  };

  return (
    <div>
      <ReactMic
        record={isRecording}
        className="sound-wave"
        onStop={onStop}
        onData={onData}
        strokeColor="#000000"
        backgroundColor="#FF4081" />

      <button id="record-btn" onClick={handleRecording} >{isRecording ? 'Stop Recording' : 'Start Recording'} </button>
      <p>{isRecording ? 'Recording...' : ''}</p>
      <audio src={audioBlobUrl} controls={true} />
    </div>
  );
}

