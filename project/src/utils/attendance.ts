import { utils, writeFile } from 'xlsx';
import { Student, AttendanceRecord } from '../types';

export function generateExcelSheet(students: Student[]) {
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();
  
  const data = students.map(student => ({
    'Name': student.name,
    'Roll Number': student.rollNumber,
    'Status': student.present ? 'Present' : 'Absent',
    'Time': student.present ? time : '-'
  }));

  const ws = utils.json_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Attendance');
  
  writeFile(wb, `attendance_${date.replace(/\//g, '-')}.xlsx`);
}