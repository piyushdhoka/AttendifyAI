export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  image: string;
  faceDescriptor: Float32Array | null;
  present: boolean;
}

export interface AttendanceRecord {
  date: string;
  students: {
    name: string;
    rollNumber: string;
    status: string;
    time: string;
  }[];
}