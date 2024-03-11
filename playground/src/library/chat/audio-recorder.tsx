import React, { useState, useEffect } from "react";
import { Button, Icon, View, Grid, useTheme } from '@aws-amplify/ui-react';
import { ReactMic } from 'react-mic';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
}

export function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
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

  const onStop = (recordedBlob: { blobURL: React.SetStateAction<string>; blob: Blob }) => {
    console.log('recordedBlob is: ', recordedBlob);
    setAudioBlobUrl(recordedBlob.blobURL);
    onRecordingComplete(recordedBlob.blob); // Call the onRecordingComplete prop function with the audio blob
  };

  const { tokens } = useTheme();

  return (
    <div>
      <Grid
      templateColumns="1fr 1fr 1fr"
      templateRows="4rem"
      gap={tokens.space.small}
      >
        <View>
            <Button id="record-btn"
                    onClick={handleRecording}
                    variation="primary"
                    colorTheme={!isRecording ? 'success' : 'error'}>
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
        </View>
        <View>
          <ReactMic
            record={isRecording}
            className={'hidden'}
            onStop={onStop}
            onData={onData}
            strokeColor="#000000"
            backgroundColor="rgb(4, 125, 149)" />
        </View>
        <View>
          {audioBlobUrl && <audio src={audioBlobUrl} controls />}
        </View>
      </Grid>
    </div>
  );
}
