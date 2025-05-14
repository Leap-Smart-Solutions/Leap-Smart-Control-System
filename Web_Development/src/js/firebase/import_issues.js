import { db } from "./firebaseConfig.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Sample issues data
const issuesData = [
  {
    "id": "ISSUE-12345",
    "title": "Login error",
    "description": "Cannot log in using Google account.",
    "status": "open",
    "priority": "high",
    "reported_by": "9f1d7a4e-8b2d-4f6a-9f8d-1b0e5a9c3f21",
    "assigned_to": "Support Team",
    "created_at": "2025-05-14T10:23:00Z"
  },
  {
    "id": "ISSUE-12346",
    "title": "Payment gateway timeout",
    "description": "Checkout fails when selecting PayPal option.",
    "status": "in_progress",
    "priority": "critical",
    "reported_by": "1a2c3e4f-5b6d-7a8f-9b0c-1d2e3f4a5b6c",
    "assigned_to": "Payment Team",
    "created_at": "2025-05-14T11:00:00Z"
  },
  {
    "id": "ISSUE-12347",
    "title": "Broken link on FAQ page",
    "description": "The 'Contact Support' link is broken.",
    "status": "open",
    "priority": "low",
    "reported_by": "3f4a5b6c-1d2e-3f4a-5b6c-7d8e9f0a1b2c",
    "assigned_to": "Content Team",
    "created_at": "2025-05-14T09:45:00Z"
  },
  {
    "id": "ISSUE-12348",
    "title": "App crashes on startup",
    "description": "Android app crashes immediately after launch.",
    "status": "resolved",
    "priority": "high",
    "reported_by": "7d8e9f0a-1b2c-3d4e-5f6a-7b8c9d0e1f2a",
    "assigned_to": "Mobile Team",
    "created_at": "2025-05-14T08:30:00Z"
  },
  {
    "id": "ISSUE-12349",
    "title": "Slow website loading",
    "description": "Website takes more than 10 seconds to load the homepage.",
    "status": "in_progress",
    "priority": "medium",
    "reported_by": "5b6c7d8e-9f0a-1b2c-3d4e-5f6a7b8c9d0e",
    "assigned_to": "Infrastructure Team",
    "created_at": "2025-05-14T12:10:00Z"
  }
];

// Function to import issues to Firestore
async function importIssues() {
  const issuesCollection = collection(db, 'issues');
  
  try {
    for (const issue of issuesData) {
      // Add each issue to Firestore
      await addDoc(issuesCollection, {
        ...issue,
        created_at: new Date(issue.created_at) // Convert string date to Firestore timestamp
      });
      console.log(`Successfully imported issue: ${issue.id}`);
    }
    console.log('All issues imported successfully!');
  } catch (error) {
    console.error('Error importing issues:', error);
  }
}

// Execute the import
importIssues(); 