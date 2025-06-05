// Import Firebase modules
import { db } from '../src/js/firebase/firebaseConfig.js';
import { collection, getDocs, doc, updateDoc, getDoc } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js';

// Admin data
const admin = {
  userName: "Mohamed Hassan",
  image: "Img/mo.jpg",
};

// Function to format date
function formatDate(timestamp) {
  if (!timestamp) return '';
  
  let date;
  if (timestamp.toDate) {
    // Handle Firestore Timestamp
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    // Handle JavaScript Date
    date = timestamp;
  } else if (typeof timestamp === 'string') {
    // Handle string date
    date = new Date(timestamp);
  } else if (typeof timestamp === 'number') {
    // Handle timestamp number
    date = new Date(timestamp);
  } else {
    console.warn('Invalid date format:', timestamp);
    return '';
  }

  // Check if date is valid
  if (isNaN(date.getTime())) {
    console.warn('Invalid date:', timestamp);
    return '';
  }

  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const day = `${date.getDate()}`.padStart(2, 0);
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

// Function to truncate text
function truncateText(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// Function to create an issue row
function createIssueRow(issue) {
  const truncatedDesc = truncateText(issue.description, 15);
  const truncatedTitle = truncateText(issue.title, 15);
  const truncatedId = truncateText(issue.id, 5);
  const truncatedUser = truncateText(issue.userEmail || 'N/A', 15);
  
  return `
    <div class="table-row" data-issue-id="${issue.id}">
      <div class="issue-id" onclick="showFullText('${issue.id}', 'Issue ID')">#${truncatedId}</div>
      <div class="title" onclick="showDescription('${issue.title}', '${issue.description}')">${truncatedTitle}</div>
      <div class="user" onclick="showFullText('${issue.userEmail || 'N/A'}', 'User Email')">${truncatedUser}</div>
      <div class="date">${formatDate(issue.createdAt)}</div>
      <div class="priority-cell">
        <select class="priority-select" onchange="updatePriority('${issue.id}', this.value)">
          <option value="Low" ${issue.priority === 'Low' ? 'selected' : ''}>Low</option>
          <option value="Medium" ${issue.priority === 'Medium' ? 'selected' : ''}>Medium</option>
          <option value="High" ${issue.priority === 'High' ? 'selected' : ''}>High</option>
        </select>
      </div>
      <div class="status-cell">
        <select class="status-select" onchange="updateStatus('${issue.id}', this.value)">
          <option value="Open" ${issue.status === 'Open' ? 'selected' : ''}>Open</option>
          <option value="Pending" ${issue.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Closed" ${issue.status === 'Closed' ? 'selected' : ''}>Closed</option>
        </select>
      </div>
      <div class="description" onclick="showDescription('${issue.title}', '${issue.description}')">${truncatedDesc}</div>
      <div class="arrow">›</div>
    </div>
  `;
}

// Function to render issues
function renderIssues(issuesToRender) {
  const issuesList = document.getElementById("issuesList");
  issuesList.innerHTML = issuesToRender
    .map((issue) => createIssueRow(issue))
    .join("");
}

// Function to fetch issues from Firestore
async function fetchIssues() {
  try {
    const issuesCollection = collection(db, 'issues');
    const issuesSnapshot = await getDocs(issuesCollection);
    const issues = [];

    for (const issueDoc of issuesSnapshot.docs) {
      const issueData = issueDoc.data();
      
      // Check if userId exists and is valid
      if (!issueData.userId) {
        console.warn(`Issue ${issueDoc.id} has no userId`);
        issues.push({
          id: issueDoc.id,
          ...issueData,
          userEmail: 'N/A'
        });
        continue;
      }

      try {
        // Get user data from the users collection directly
        const userDoc = await getDoc(doc(db, 'users', issueData.userId));
        const userData = userDoc.data();

        issues.push({
          id: issueDoc.id,
          ...issueData,
          userEmail: userData?.email || 'N/A'
        });
      } catch (userError) {
        console.error(`Error fetching user data for issue ${issueDoc.id}:`, userError);
        issues.push({
          id: issueDoc.id,
          ...issueData,
          userEmail: 'N/A'
        });
      }
    }

    return issues;
  } catch (error) {
    console.error("Error fetching issues:", error);
    return [];
  }
}

// Function to update priority
async function updatePriority(issueId, newPriority) {
  try {
    const issueRef = doc(db, 'issues', issueId);
    await updateDoc(issueRef, {
      priority: newPriority
    });
    // Refresh the issues list
    const issues = await fetchIssues();
    renderIssues(issues);
  } catch (error) {
    console.error("Error updating priority:", error);
  }
}

// Function to update status
async function updateStatus(issueId, newStatus) {
  try {
    const issueRef = doc(db, 'issues', issueId);
    await updateDoc(issueRef, {
      status: newStatus
    });
    // Refresh the issues list
    const issues = await fetchIssues();
    renderIssues(issues);
  } catch (error) {
    console.error("Error updating status:", error);
  }
}

// Function to show description in modal
function showDescription(title, description) {
  const modal = document.getElementById("descriptionModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalText = document.getElementById("modalText");
  modalTitle.textContent = title;
  modalText.textContent = description;
  modal.style.display = "block";
}

// Function to show full text in modal
function showFullText(text, title = 'Full Text') {
  const modal = document.getElementById("descriptionModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalText = document.getElementById("modalText");
  modalTitle.textContent = title;
  modalText.textContent = text;
  modal.style.display = "block";
}

// Function to filter issues by search input
function filterIssues(issues, searchTerm) {
  searchTerm = searchTerm.toLowerCase();
  return issues.filter(
    (issue) =>
      issue.id.toLowerCase().includes(searchTerm) ||
      issue.title.toLowerCase().includes(searchTerm) ||
      (issue.userEmail && issue.userEmail.toLowerCase().includes(searchTerm))
  );
}

// Display the top header with search and admin info
function displayAdmin(admin) {
  const header = `
    <header class="dashboard-header">
      <div class="search-box">
        <input type="text" id="search-input" placeholder="Search by ID, Title or User..." />
        <i class="fa fa-search"></i>
      </div>
      <div class="admin-info">
        <img src="${admin.image}" alt="Admin" />
        <span>${admin.userName}</span>
      </div>
    </header>
  `;
  document
    .querySelector(".main-content")
    .insertAdjacentHTML("afterbegin", header);
}

// Initialize the page
document.addEventListener("DOMContentLoaded", async () => {
  // Display admin header
  displayAdmin(admin);

  // Fetch and render initial issues
  let issues = await fetchIssues();
  renderIssues(issues);

  // Search functionality
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (e) => {
    const filteredIssues = filterIssues(issues, e.target.value);
    renderIssues(filteredIssues);
  });

  // Tab functionality
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Filter issues based on tab
      let filteredIssues = issues;
      const tabText = button.textContent.trim();

      if (tabText === "All Issues") {
        filteredIssues = issues;
      } else if (tabText === "High Priority") {
        filteredIssues = issues.filter((issue) => issue.priority === "High");
      } else if (tabText === "Medium Priority") {
        filteredIssues = issues.filter((issue) => issue.priority === "Medium");
      } else if (tabText === "Low Priority") {
        filteredIssues = issues.filter((issue) => issue.priority === "Low");
      } else if (tabText === "Open") {
        filteredIssues = issues.filter((issue) => issue.status === "Open");
      } else if (tabText === "Pending") {
        filteredIssues = issues.filter((issue) => issue.status === "Pending");
      } else if (tabText === "Closed") {
        filteredIssues = issues.filter((issue) => issue.status === "Closed");
      }

      renderIssues(filteredIssues);
    });
  });

  // Menu toggle functionality
  const menuToggle = document.querySelector(".menu-toggle");
  const closeMenu = document.querySelector(".close-menu");
  const sidebar = document.querySelector(".sidebar");

  menuToggle.addEventListener("click", () => {
    sidebar.classList.add("active");
  });

  closeMenu.addEventListener("click", () => {
    sidebar.classList.remove("active");
  });

  // Close sidebar when clicking outside
  document.addEventListener("click", (e) => {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
      sidebar.classList.remove("active");
    }
  });

  // Modal close functionality
  const modal = document.getElementById("descriptionModal");
  const closeBtn = document.querySelector(".close");

  closeBtn.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
});

// Make functions available globally
window.showDescription = showDescription;
window.showFullText = showFullText;
window.updatePriority = updatePriority;
window.updateStatus = updateStatus;
