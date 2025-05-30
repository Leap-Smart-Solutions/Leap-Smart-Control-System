// Admin data
const admin = {
  userName: "Mohamed Hassan",
  image: "Img/mo.jpg",
};

// Issues Data
const issues = [
  {
    id: "ISS-001",
    title: "Login System Error",
    user: "John Smith",
    date: new Date("2024-03-15"),
    priority: "High",
    status: "Open",
    description:
      "Users are unable to log in to the system. The error occurs after entering credentials and clicking the login button. Multiple users have reported this issue across different browsers and devices.",
  },
  {
    id: "ISS-002",
    title: "Payment Processing Delay",
    user: "Sarah Johnson",
    date: new Date("2024-03-14"),
    priority: "High",
    status: "Pending",
    description:
      "Customers are experiencing delays in payment processing. Transactions take more than 5 minutes to complete, causing customer frustration and support tickets.",
  },
  {
    id: "ISS-003",
    title: "Mobile App Crash",
    user: "Mike Wilson",
    date: new Date("2024-03-13"),
    priority: "Medium",
    status: "Open",
    description:
      "The mobile app crashes when users try to upload profile pictures. This affects both Android and iOS versions of the app.",
  },
  {
    id: "ISS-004",
    title: "Data Export Bug",
    user: "Emma Brown",
    date: new Date("2024-03-12"),
    priority: "Low",
    status: "Closed",
    description:
      "The export to CSV function is not including all columns in the exported file. Some crucial data fields are missing from the export.",
  },
  {
    id: "ISS-005",
    title: "Search Function Issue",
    user: "Alex Turner",
    date: new Date("2024-03-11"),
    priority: "Medium",
    status: "Pending",
    description:
      "The search function is not returning accurate results. Users report that searching for exact terms doesn't show relevant items in the results.",
  },
  {
    id: "ISS-006",
    title: "Email Notification Delay",
    user: "Lisa Chen",
    date: new Date("2024-03-10"),
    priority: "Low",
    status: "Open",
    description:
      "System email notifications are being delayed by up to 2 hours. This affects all automated emails including password resets and order confirmations.",
  },
  {
    id: "ISS-007",
    title: "Dashboard Loading Speed",
    user: "David Miller",
    date: new Date("2024-03-09"),
    priority: "High",
    status: "Pending",
    description:
      "The main dashboard is taking more than 30 seconds to load. Users report slow performance and timeout errors during peak hours.",
  },
  {
    id: "ISS-008",
    title: "Report Generation Error",
    user: "Rachel Green",
    date: new Date("2024-03-08"),
    priority: "Medium",
    status: "Closed",
    description:
      "Monthly reports are showing incorrect totals. The calculation seems to be off by a significant margin, affecting business decisions.",
  },
  {
    id: "ISS-009",
    title: "Login System Error",
    user: "John Smith",
    date: new Date("2024-03-15"),
    priority: "High",
    status: "Open",
    description:
      "Users are unable to log in to the system. The error occurs after entering credentials and clicking the login button. Multiple users have reported this issue across different browsers and devices.",
  },
  {
    id: "ISS-010",
    title: "Payment Processing Delay",
    user: "Sarah Johnson",
    date: new Date("2024-03-14"),
    priority: "High",
    status: "Pending",
    description:
      "Customers are experiencing delays in payment processing. Transactions take more than 5 minutes to complete, causing customer frustration and support tickets.",
  },
  {
    id: "ISS-011",
    title: "Mobile App Crash",
    user: "Mike Wilson",
    date: new Date("2024-03-13"),
    priority: "Medium",
    status: "Open",
    description:
      "The mobile app crashes when users try to upload profile pictures. This affects both Android and iOS versions of the app.",
  },
  {
    id: "ISS-012",
    title: "Data Export Bug",
    user: "Emma Brown",
    date: new Date("2024-03-12"),
    priority: "Low",
    status: "Closed",
    description:
      "The export to CSV function is not including all columns in the exported file. Some crucial data fields are missing from the export.",
  },
  {
    id: "ISS-013",
    title: "Search Function Issue",
    user: "Alex Turner",
    date: new Date("2024-03-11"),
    priority: "Medium",
    status: "Pending",
    description:
      "The search function is not returning accurate results. Users report that searching for exact terms doesn't show relevant items in the results.",
  },
  {
    id: "ISS-014",
    title: "Email Notification Delay",
    user: "Lisa Chen",
    date: new Date("2024-03-10"),
    priority: "Low",
    status: "Open",
    description:
      "System email notifications are being delayed by up to 2 hours. This affects all automated emails including password resets and order confirmations.",
  },
  {
    id: "ISS-015",
    title: "Dashboard Loading Speed",
    user: "David Miller",
    date: new Date("2024-03-09"),
    priority: "High",
    status: "Pending",
    description:
      "The main dashboard is taking more than 30 seconds to load. Users report slow performance and timeout errors during peak hours.",
  },
  {
    id: "ISS-016",
    title: "Report Generation Error",
    user: "Rachel Green",
    date: new Date("2024-03-08"),
    priority: "Medium",
    status: "Closed",
    description:
      "Monthly reports are showing incorrect totals. The calculation seems to be off by a significant margin, affecting business decisions.",
  },
];

// Function to format date
function formatDate(date) {
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const day = `${date.getDate()}`.padStart(2, 0);
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

// Function to truncate text
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// Function to create an issue row
function createIssueRow(issue) {
  const truncatedDesc = truncateText(issue.description, 15);
  const truncatedTitle = truncateText(issue.title, 15);
  return `
    <div class="table-row">
      <div class="issue-id">#${issue.id}</div>
      <div class="title" onclick="showDescription('${issue.title}', '${
    issue.description
  }')">${truncatedTitle}</div>
      <div class="user">${issue.user}</div>
      <div class="date">${formatDate(issue.date)}</div>
      <div class="priority-${issue.priority.toLowerCase()}">${
    issue.priority
  }</div>
      <div class="status-${issue.status.toLowerCase()}">${issue.status}</div>
      <div class="description" onclick="showDescription('${issue.title}', '${
    issue.description
  }')">${truncatedDesc}</div>
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

// Function to filter issues by search input
function filterIssues(searchTerm) {
  searchTerm = searchTerm.toLowerCase();
  return issues.filter(
    (issue) =>
      issue.id.toString().includes(searchTerm) ||
      issue.title.toLowerCase().includes(searchTerm) ||
      issue.user.toLowerCase().includes(searchTerm)
  );
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
document.addEventListener("DOMContentLoaded", () => {
  // Display admin header
  displayAdmin(admin);

  // Initial render
  renderIssues(issues);

  // Search functionality
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (e) => {
    const filteredIssues = filterIssues(e.target.value);
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
