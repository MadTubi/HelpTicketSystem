// weeklyReport.jsx
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

// Convert Firestore Timestamp to JS Date safely
export const getDate = (value) => {
  if (!value) return null;
  if (value.toDate) return value.toDate(); // Firestore Timestamp
  return value; // JS Date
};

// Fetch tasks submitted in the last 7 days
export const getWeeklyTasks = async () => {
  const today = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(today.getDate() - 7);

  const q = query(
    collection(db, "molds"),
    where("submittedAt", ">=", Timestamp.fromDate(weekAgo))
  );

  const snapShot = await getDocs(q);
  return snapShot.docs.map(d => ({ id: d.id, ...d.data() }));
};

// Generate CSV from tasks array
export const generateCSV = (tasks) => {
  const headers = ["Machine", "Message", "Submitted At", "Fixed At", "Fixed By"];
  const rows = tasks.map(task => [
    task.machine,
    task.machineMessage,
    getDate(task.submittedAt)?.toLocaleString() || "",
    getDate(task.fixedAt)?.toLocaleString() || "",
    task.fixedBy || ""
  ]);

  return [headers, ...rows].map(function(row) {
    return row.map(function(field) {
      return '"' + field + '"';
    }).join(',');
  }).join('\n');
};

// Download CSV file in browser
export const downloadCSV = (csvContent, fileName) => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
};
