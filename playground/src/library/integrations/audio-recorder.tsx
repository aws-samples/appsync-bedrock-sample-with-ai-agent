import React, { useState, useEffect } from 'react';
import {  Flex, Loader, Text, View, useTheme } from "@aws-amplify/ui-react";


export function AudioRecorder() {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [transcriptionText, setTranscriptionText] = useState('');


  useEffect(() => {
    // Request permissions and set up MediaRecorder
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const recorder = new MediaRecorder(stream);
        // setMediaRecorder(recorder);

        recorder.ondataavailable = event => {
        //   setAudioChunks(currentChunks => [...currentChunks, event.data]);
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { 'type' : 'audio/mp4' });
          //onRecordingComplete(audioBlob);
        };
      });
  }, []);

  const startRecording = () => {
    if (mediaRecorder) {
      //mediaRecorder.start();
      setIsRecording(true);
      setAudioChunks([]);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      //mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  function handleRecord() {
    console.log("handle record")
  };

  return (            
    <View>
        <label htmlFor="audioInputSelect">Choose a mic:</label>
        <select name="" id="audioInputSelect"></select>

        <button id="recordButton" onClick={handleRecord}>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <p>{isRecording ? 'Recording...' : ''}</p>
        <button id="playButton" disabled>Play Recording</button>
        <p>{transcriptionText}</p>
    </View>
    // <div>
    //   {isRecording ? (
    //     <button onClick={stopRecording}>Stop Recording</button>
    //   ) : (
    //     <button onClick={startRecording}>Start Recording</button>
    //   )}
    // </div>
  );
};

export default AudioRecorder;
