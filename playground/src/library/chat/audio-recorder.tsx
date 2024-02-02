import React, { useState, useEffect } from "react";
import { View } from "@aws-amplify/ui-react";

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  transcriptionText: string
}
// export const AudioRecorder: JSX.IntrinsicAttributes (props: AudioRecorderProps ) {
export const AudioRecorder: React.FC<AudioRecorderProps> = (props: AudioRecorderProps) => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<BlobPart[]>([]);

  useEffect(() => {
    // Request permissions and set up MediaRecorder
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        recorder.ondataavailable = event => {
          setAudioChunks(currentChunks => [...currentChunks, event.data]);
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { 'type' : 'audio/mp4' });
          props.onRecordingComplete(audioBlob);
        };
      });
  }, [props.onRecordingComplete, audioChunks]);

  const handleRecord = () => {
    console.log("handle record")
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start();
      setIsRecording(true);
      setAudioChunks([]);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };


  return             
    <View>
        <label htmlFor="audioInputSelect">Choose a mic:</label>
        <select name="" id="audioInputSelect"></select>

        <button id="recordButton" onClick={handleRecord}>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <p>{isRecording ? 'Recording...' : ''}</p>
        <button id="playButton" disabled>Play Recording</button>
        <p>{props.transcriptionText}</p>
    </View>
  // //*return (
  //   <View>
  //       <button onClick={handleRecord}>
  //           {isRecording ? 'Stop Recording' : 'Start Recording'}
  //       </button>
  //       <p>{isRecording ? 'Recording...' : ''}</p>
  //   </View>
  // );
};

export default AudioRecorder;
