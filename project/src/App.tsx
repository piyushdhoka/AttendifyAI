import React, { useState, useEffect } from 'react';
import { UserPlus, Users, FileSpreadsheet, Camera } from 'lucide-react';
import WebcamCapture from './components/WebcamCapture';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import AttendanceScanner from './components/AttendanceScanner';
import { Student } from './types';
import { getFaceDescriptor, loadModels } from './utils/faceRecognition';
import { generateExcelSheet } from './utils/attendance';

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', rollNumber: '' });
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeFaceApi = async () => {
      try {
        await loadModels();
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading face-api models:', error);
      }
    };
    initializeFaceApi();
  }, []);

  const handleCapture = async (imageSrc: string) => {
    setCapturedImage(imageSrc);
    
    // Get face descriptor for the captured image
    const img = new Image();
    img.src = imageSrc;
    await new Promise(resolve => img.onload = resolve);
    const descriptor = await getFaceDescriptor(img);
    
    if (!descriptor) {
      alert('No face detected in the image. Please try again.');
      setCapturedImage(null);
      return;
    }
    
    // Store the descriptor temporarily
    setCapturedImage(imageSrc);
  };

  const handleRegister = async () => {
    if (newStudent.name && newStudent.rollNumber && capturedImage) {
      const img = new Image();
      img.src = capturedImage;
      await new Promise(resolve => img.onload = resolve);
      const descriptor = await getFaceDescriptor(img);

      const student: Student = {
        id: Date.now().toString(),
        name: newStudent.name,
        rollNumber: newStudent.rollNumber,
        image: capturedImage,
        faceDescriptor: descriptor,
        present: false,
      };
      
      setStudents([...students, student]);
      setNewStudent({ name: '', rollNumber: '' });
      setCapturedImage(null);
      setIsRegistering(false);
    }
  };

  const handleMarkAttendance = (studentId: string) => {
    setStudents(
      students.map((student) =>
        student.id === studentId
          ? { ...student, present: !student.present }
          : student
      )
    );
  };

  const handleExportAttendance = () => {
    generateExcelSheet(students);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading face recognition models...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Attendance System</h1>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setIsRegistering(false);
                setShowScanner(!showScanner);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
            >
              <Camera size={20} />
              {showScanner ? 'Hide Scanner' : 'Take Attendance'}
            </button>
            <button
              onClick={() => {
                setShowScanner(false);
                setIsRegistering(!isRegistering);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              {isRegistering ? (
                <>
                  <Users size={20} />
                  View Students
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Register New Student
                </>
              )}
            </button>
            <button
              onClick={handleExportAttendance}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
            >
              <FileSpreadsheet size={20} />
              Export to Excel
            </button>
          </div>
        </div>

        {showScanner && (
          <div className="mb-8">
            <AttendanceScanner
              students={students}
              onMarkAttendance={handleMarkAttendance}
            />
          </div>
        )}

        {isRegistering ? (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Register New Student</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={newStudent.name}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    value={newStudent.rollNumber}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, rollNumber: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleRegister}
                  disabled={!newStudent.name || !newStudent.rollNumber || !capturedImage}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Register Student
                </button>
              </div>
              <div>
                <WebcamCapture onCapture={handleCapture} />
                {capturedImage && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Captured Image:</p>
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="w-48 h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          !showScanner && (
            <>
              <Dashboard students={students} />
              <StudentList students={students} onMarkAttendance={handleMarkAttendance} />
            </>
          )
        )}
      </div>
    </div>
  );
}

export default App;