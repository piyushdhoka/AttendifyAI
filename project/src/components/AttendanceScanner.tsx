import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, Loader } from 'lucide-react';
import { Student } from '../types';
import { loadModels, getFaceDescriptor, compareFaces } from '../utils/faceRecognition';

interface AttendanceScannerProps {
  students: Student[];
  onMarkAttendance: (studentId: string) => void;
}

const AttendanceScanner: React.FC<AttendanceScannerProps> = ({ students, onMarkAttendance }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadModels();
  }, []);

  const scanAttendance = async () => {
    if (!webcamRef.current) return;
    
    setIsScanning(true);
    setMessage('Scanning...');

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) throw new Error('Failed to capture image');

      const img = new Image();
      img.src = imageSrc;
      await new Promise(resolve => img.onload = resolve);

      const descriptor = await getFaceDescriptor(img);
      if (!descriptor) {
        setMessage('No face detected. Please try again.');
        setIsScanning(false);
        return;
      }

      let matchedStudent: Student | null = null;
      let minDistance = 0.6; // Threshold for face matching

      for (const student of students) {
        if (student.faceDescriptor) {
          const distance = compareFaces(descriptor, student.faceDescriptor);
          if (distance < minDistance) {
            minDistance = distance;
            matchedStudent = student;
          }
        }
      }

      if (matchedStudent) {
        onMarkAttendance(matchedStudent.id);
        setMessage(`Attendance marked for ${matchedStudent.name}`);
      } else {
        setMessage('Student not found. Please register first.');
      }
    } catch (error) {
      console.error('Error during attendance scanning:', error);
      setMessage('Error scanning attendance. Please try again.');
    }

    setIsScanning(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Attendance Scanner</h2>
      <div className="relative">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full rounded-lg"
        />
        <button
          onClick={scanAttendance}
          disabled={isScanning}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {isScanning ? (
            <Loader className="animate-spin" size={20} />
          ) : (
            <Camera size={20} />
          )}
          Scan Attendance
        </button>
      </div>
      {message && (
        <div className={`mt-4 p-3 rounded-lg ${
          message.includes('not found') || message.includes('Error')
            ? 'bg-red-100 text-red-700'
            : message.includes('marked')
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-100 text-blue-700'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default AttendanceScanner;