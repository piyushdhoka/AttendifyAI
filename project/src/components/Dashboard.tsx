import React from 'react';
import { Users, UserCheck } from 'lucide-react';
import { Student } from '../types';

interface DashboardProps {
  students: Student[];
}

const Dashboard: React.FC<DashboardProps> = ({ students }) => {
  const totalStudents = students.length;
  const presentStudents = students.filter(student => student.present).length;
  const attendancePercentage = totalStudents ? ((presentStudents / totalStudents) * 100).toFixed(1) : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Users className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Students</p>
            <p className="text-2xl font-semibold">{totalStudents}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <UserCheck className="text-green-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Present Today</p>
            <p className="text-2xl font-semibold">{presentStudents}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <div className="text-purple-600 text-xl font-bold">%</div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Attendance Rate</p>
            <p className="text-2xl font-semibold">{attendancePercentage}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;