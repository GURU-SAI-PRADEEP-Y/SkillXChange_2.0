import React, { useEffect, useRef, useState } from 'react';
import { Video, VideoOff, Mic, MicOff, Users, MessageSquare, MonitorUp } from 'lucide-react';
import { Button } from '../Button';
import { VideoChat } from './VideoChat';

interface VideoCallProps {
  recipientId: string;
  recipientName: string;
  onEnd: () => void;
}

export function VideoCall({ recipientId, recipientName, onEnd }: VideoCallProps) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    startVideoCall();
    return () => {
      stopVideoCall();
    };
  }, []);

  const startVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const stopVideoCall = () => {
    if (localVideoRef.current?.srcObject) {
      const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const toggleVideo = () => {
    if (localVideoRef.current?.srcObject) {
      const videoTrack = (localVideoRef.current.srcObject as MediaStream)
        .getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(!isVideoEnabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localVideoRef.current?.srcObject) {
      const audioTrack = (localVideoRef.current.srcObject as MediaStream)
        .getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(!isAudioEnabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false
        });
        
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          startVideoCall();
        };
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);
      } else {
        const tracks = (localVideoRef.current?.srcObject as MediaStream)?.getTracks();
        tracks?.forEach(track => track.stop());
        startVideoCall();
        setIsScreenSharing(false);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'NotAllowedError') {
        console.log('Screen sharing was cancelled or denied by the user');
      } else {
        console.error('Error sharing screen:', error);
      }
      setIsScreenSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 grid grid-cols-2 gap-4 p-4">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
              You {isScreenSharing ? '(Screen)' : ''}
            </div>
          </div>
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
              {recipientName}
            </div>
          </div>
        </div>

        <div className="bg-gray-900 p-4">
          <div className="flex justify-center space-x-4">
            <Button onClick={toggleVideo} variant="secondary">
              {isVideoEnabled ? <Video /> : <VideoOff />}
            </Button>
            <Button onClick={toggleAudio} variant="secondary">
              {isAudioEnabled ? <Mic /> : <MicOff />}
            </Button>
            <Button onClick={toggleScreenShare} variant="secondary">
              <MonitorUp />
            </Button>
            <Button onClick={() => setIsChatOpen(!isChatOpen)} variant="secondary">
              <MessageSquare />
            </Button>
            <Button onClick={() => setIsParticipantsOpen(!isParticipantsOpen)} variant="secondary">
              <Users />
            </Button>
            <Button onClick={onEnd} className="bg-red-600 hover:bg-red-700">
              End Call
            </Button>
          </div>
        </div>
      </div>

      {isChatOpen && (
        <div className="w-96 bg-white border-l flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Chat</h3>
          </div>
          <VideoChat recipientId={recipientId} recipientName={recipientName} />
        </div>
      )}

      {isParticipantsOpen && (
        <div className="w-80 bg-white border-l">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Participants</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <p>You</p>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <p>{recipientName}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}