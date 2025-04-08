import { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from '../components/Card';
import { mockPersons } from '../utils/mockData';

const LiveStream = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [detectedPerson, setDetectedPerson] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsStreaming(true);
    } catch (err) {
      toast.error('Error accessing camera: ' + err.message);
    }
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsStreaming(false);
      setDetectedPerson(null);
    }
  };

  const simulateDetection = () => {
    const randomPerson = mockPersons[Math.floor(Math.random() * mockPersons.length)];
    setDetectedPerson(randomPerson);
    
    if (randomPerson.status === 'banned') {
      toast.error(`Banned person detected: ${randomPerson.name}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Live Stream</h1>
        <div className="space-x-4">
          {!isStreaming ? (
            <button
              onClick={startStream}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Start Stream
            </button>
          ) : (
            <button
              onClick={stopStream}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Stop Stream
            </button>
          )}
          {isStreaming && (
            <button
              onClick={simulateDetection}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Simulate Detection
            </button>
          )}
        </div>
      </div>

      <div className=" ">
        <Card className="p-4 ">
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
        </Card>

        {detectedPerson && (
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Detected Person</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src={detectedPerson.image}
                  alt={detectedPerson.name}
                  className="w-20 h-20 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-medium">{detectedPerson.name}</h3>
                  <p className={`text-sm ${
                    detectedPerson.status === 'allowed' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    Status: {detectedPerson.status}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Last seen: {new Date(detectedPerson.lastSeen).toLocaleString()}
              </p>
            </div>
          </Card>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default LiveStream; 