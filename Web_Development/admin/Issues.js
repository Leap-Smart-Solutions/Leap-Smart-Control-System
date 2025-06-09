// Import Firebase modules
import { db, auth } from '../src/js/firebase/firebaseConfig.js';
import { collection, getDocs, doc, updateDoc, getDoc } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js';
import { initAdminAuthCheck } from '../src/js/firebase/adminAuthCheck.js';

// Remove the hardcoded admin object
// const admin = {
//   userName: "Mohamed Hassan",
//   image: "Img/mo.jpg",
// };

// Function to get current admin data
async function getCurrentAdminData() {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        unsubscribe();
        reject(new Error('No user logged in'));
        return;
      }

      try {
        // Get user data directly from users collection using the user's UID
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (!userDoc.exists()) {
          unsubscribe();
          reject(new Error('No user data found'));
          return;
        }

        const userData = userDoc.data();
        unsubscribe();
        resolve({
          userName: userData.fullName || userData.displayName || user.displayName || 'Admin',
          image: userData.profilePicture || userData.image || user.photoURL || 'https://i.ibb.co/277hTSg8/generic-profile.jpg'
        });
      } catch (error) {
        console.error('Error fetching admin data:', error);
        unsubscribe();
        reject(error);
      }
    });
  });
}

// Initialize admin auth check
initAdminAuthCheck();

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
  
  // Create priority options
  const priorityOptions = ['Low', 'Medium', 'High'];
  if (issue.priority && !priorityOptions.includes(issue.priority)) {
    priorityOptions.push(issue.priority);
  }
  const prioritySelectOptions = priorityOptions.map(priority => 
    `<option value="${priority}" ${issue.priority === priority ? 'selected' : ''}>${priority}</option>`
  ).join('');

  // Create status options
  const statusOptions = ['Open', 'Pending', 'Closed'];
  if (issue.status && !statusOptions.includes(issue.status)) {
    statusOptions.push(issue.status);
  }
  const statusSelectOptions = statusOptions.map(status => 
    `<option value="${status}" ${issue.status === status ? 'selected' : ''}>${status}</option>`
  ).join('');
  
  return `
    <div class="table-row" data-issue-id="${issue.id}">
      <div class="issue-id" onclick="showFullText('${issue.id.replace(/'/g, "\\'")}', 'Issue ID')">#${truncatedId}</div>
      <div class="title" onclick="showDescription('${issue.title.replace(/'/g, "\\'")}', '${issue.description.replace(/'/g, "\\'")}')">${truncatedTitle}</div>
      <div class="user" onclick="showFullText('${(issue.userEmail || 'N/A').replace(/'/g, "\\'")}', 'User Email')">${truncatedUser}</div>
      <div class="date">${formatDate(issue.createdAt)}</div>
      <div class="priority-cell">
        <select class="priority-select" onchange="updatePriority('${issue.id.replace(/'/g, "\\'")}', this.value)" ${!issue.priority ? 'data-placeholder="Select Priority"' : ''}>
          ${prioritySelectOptions}
        </select>
      </div>
      <div class="status-cell">
        <select class="status-select" onchange="updateStatus('${issue.id.replace(/'/g, "\\'")}', this.value)" ${!issue.status ? 'data-placeholder="Select Status"' : ''}>
          ${statusSelectOptions}
        </select>
      </div>
      <div class="description" onclick="showDescription('${issue.title.replace(/'/g, "\\'")}', '${issue.description.replace(/'/g, "\\'")}')">${truncatedDesc}</div>
      <div class="arrow">›</div>
    </div>
  `;
}

// Function to get priority color
function getPriorityColor(priority) {
  switch (priority) {
    case 'High':
      return '#dc3545';
    case 'Medium':
      return '#ffc107';
    case 'Low':
      return '#28a745';
    default:
      return '#fff';
  }
}

// Function to get status color
function getStatusColor(status) {
  switch (status) {
    case 'Open':
      return '#28a745';
    case 'Pending':
      return '#ffc107';
    case 'Closed':
      return '#dc3545';
    default:
      return '#fff';
  }
}

// Function to render issues
function renderIssues(issuesToRender) {
  const issuesList = document.getElementById("issuesList");
  issuesList.innerHTML = issuesToRender
    .map((issue) => createIssueRow(issue))
    .join("");
  
  // Apply colors to all select elements after rendering
  setTimeout(() => {
    const prioritySelects = document.querySelectorAll('.priority-select');
    const statusSelects = document.querySelectorAll('.status-select');
    
    prioritySelects.forEach(select => {
      select.style.color = getPriorityColor(select.value);
    });
    
    statusSelects.forEach(select => {
      select.style.color = getStatusColor(select.value);
    });
  }, 0);
}

// Function to fetch issues from Firestore
async function fetchIssues() {
  try {
    const issuesCollection = collection(db, 'issues');
    const issuesSnapshot = await getDocs(issuesCollection);
    const issues = [];

    for (const issueDoc of issuesSnapshot.docs) {
      const issueData = issueDoc.data();
      // Remove id from issueData if it exists
      const { id, ...issueDataWithoutId } = issueData;
      
      // Check if userId exists and is valid
      if (!issueData.userId) {
        console.warn(`Issue ${issueDoc.id} has no userId`);
        issues.push({
          id: issueDoc.id, // Use the document ID from the subcollection
          ...issueDataWithoutId,
          userEmail: 'N/A'
        });
        continue;
      }

      try {
        // Get user data from the users collection directly
        const userDoc = await getDoc(doc(db, 'users', issueData.userId));
        const userData = userDoc.data();

        issues.push({
          id: issueDoc.id, // Use the document ID from the subcollection
          ...issueDataWithoutId,
          userEmail: userData?.email || 'N/A'
        });
      } catch (userError) {
        console.error(`Error fetching user data for issue ${issueDoc.id}:`, userError);
        issues.push({
          id: issueDoc.id, // Use the document ID from the subcollection
          ...issueDataWithoutId,
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
      priority: newPriority,
      updatedAt: new Date()
    });
    
    // Update the select color
    const select = document.querySelector(`[data-issue-id="${issueId}"] .priority-select`);
    if (select) {
      select.style.color = getPriorityColor(newPriority);
    }
    
    // Show success message
    const row = document.querySelector(`[data-issue-id="${issueId}"]`);
    if (row) {
      const originalBackground = row.style.backgroundColor;
      row.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
      setTimeout(() => {
        row.style.backgroundColor = originalBackground;
      }, 1000);
    }
  } catch (error) {
    console.error("Error updating priority:", error);
    alert("Failed to update priority. Please try again.");
  }
}

// Function to update status
async function updateStatus(issueId, newStatus) {
  try {
    const issueRef = doc(db, 'issues', issueId);
    await updateDoc(issueRef, {
      status: newStatus,
      updatedAt: new Date()
    });
    
    // Update the select color
    const select = document.querySelector(`[data-issue-id="${issueId}"] .status-select`);
    if (select) {
      select.style.color = getStatusColor(newStatus);
    }
    
    // Show success message
    const row = document.querySelector(`[data-issue-id="${issueId}"]`);
    if (row) {
      const originalBackground = row.style.backgroundColor;
      row.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
      setTimeout(() => {
        row.style.backgroundColor = originalBackground;
      }, 1000);
    }
  } catch (error) {
    console.error("Error updating status:", error);
    alert("Failed to update status. Please try again.");
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

// Update the displayAdmin function to use async/await
async function displayAdmin() {
  try {
    const adminData = await getCurrentAdminData();
    const header = `
      <header class="dashboard-header">
        <div class="search-box">
          <input type="text" id="search-input" placeholder="Search by ID, Title or User..." />
          <i class="fa fa-search"></i>
        </div>
        <div class="admin-info">
          <img src="${adminData.image}" alt="Admin" />
          <span>${adminData.userName}</span>
        </div>
      </header>
    `;
    document
      .querySelector(".main-content")
      .insertAdjacentHTML("afterbegin", header);
  } catch (error) {
    console.error('Error displaying admin info:', error);
    // Redirect to login if not authenticated
    if (error.message === 'No user logged in' || error.message === 'No user data found') {
      window.location.href = "login.html";
    }
  }
}

// Initialize the page
document.addEventListener("DOMContentLoaded", async () => {
  // Initialize admin auth check
  initAdminAuthCheck();

  // Display admin header
  await displayAdmin();

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
        console.log('Filtering Low Priority issues...');
        console.log('All issues:', issues);
        filteredIssues = issues.filter((issue) => {
          const priority = issue.priority?.toLowerCase()?.trim();
          console.log('Issue:', issue.id, 'Priority:', priority, 'Original:', issue.priority);
          
          // Include issues with no priority set (null)
          if (!priority) {
            console.log('Including issue with no priority:', issue.id);
            return true;
          }
          
          // Check for any variation of low priority or critical
          const isLowPriority = priority === "low" || 
                               priority === "low priority" || 
                               priority === "low-priority" ||
                               priority === "low_priority" ||
                               priority === "critical";
          console.log('Is low priority?', isLowPriority, 'for issue:', issue.id);
          return isLowPriority;
        });
        console.log('Filtered Low Priority issues:', filteredIssues.map(i => ({ id: i.id, priority: i.priority })));
      } else if (tabText === "Open") {
        filteredIssues = issues.filter((issue) => {
          const status = issue.status?.toLowerCase()?.trim();
          return (
            status === "open" || 
            status === "opened" || 
            status === "in_progress" ||
            status === "in progress" ||
            status === "open issue" ||
            status === "opened issue"
          );
        });
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
