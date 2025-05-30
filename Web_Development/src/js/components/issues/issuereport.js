// DOM Elements
const modal = document.getElementById('issueModal');
const createIssueBtn = document.getElementById('createIssueBtn');
const closeBtn = document.querySelector('.close');
const cancelBtn = document.getElementById('cancelBtn');
const issueForm = document.getElementById('issueForm');
const issuesList = document.getElementById('issuesList');
const searchInput = document.getElementById('searchIssue');
const filterPriority = document.getElementById('filterPriority');
const filterStatus = document.getElementById('filterStatus');

// Issue data storage
let issues = JSON.parse(localStorage.getItem('issues')) || [];

// Event Listeners
createIssueBtn.addEventListener('click', () => modal.style.display = 'block');
closeBtn.addEventListener('click', () => modal.style.display = 'none');
cancelBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

// Form submission
issueForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newIssue = {
        id: Date.now(),
        title: issueForm.title.value,
        description: issueForm.description.value,
        priority: issueForm.priority.value,
        assignee: issueForm.assignee.value,
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    issues.push(newIssue);
    saveIssues();
    renderIssues();
    issueForm.reset();
    modal.style.display = 'none';
});

// Filter and search functionality
searchInput.addEventListener('input', renderIssues);
filterPriority.addEventListener('change', renderIssues);
filterStatus.addEventListener('change', renderIssues);

// Save issues to localStorage
function saveIssues() {
    localStorage.setItem('issues', JSON.stringify(issues));
}

// Filter issues based on search and filters
function getFilteredIssues() {
    return issues.filter(issue => {
        const matchesSearch = issue.title.toLowerCase().includes(searchInput.value.toLowerCase()) ||
                            issue.description.toLowerCase().includes(searchInput.value.toLowerCase());
        const matchesPriority = !filterPriority.value || issue.priority === filterPriority.value;
        const matchesStatus = !filterStatus.value || issue.status === filterStatus.value;
        
        return matchesSearch && matchesPriority && matchesStatus;
    });
}

// Render issues list
function renderIssues() {
    const filteredIssues = getFilteredIssues();
    issuesList.innerHTML = filteredIssues.map(issue => `
        <div class="issue-item" data-id="${issue.id}">
            <div class="issue-col">
                <strong>${issue.title}</strong>
                <p class="description">${issue.description.substring(0, 50)}${issue.description.length > 50 ? '...' : ''}</p>
            </div>
            <div class="issue-col">${issue.assignee}</div>
            <div class="issue-col">
                <span class="priority-tag priority-${issue.priority}">${issue.priority}</span>
            </div>
            <div class="issue-col">
                <span class="status-tag status-${issue.status}">${issue.status}</span>
            </div>
            <div class="issue-col">
                <div class="action-buttons">
                    <button class="action-btn edit-btn" onclick="editIssue(${issue.id})">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteIssue(${issue.id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Edit issue
window.editIssue = function(id) {
    const issue = issues.find(issue => issue.id === id);
    if (!issue) return;

    // Update status
    const newStatus = prompt('Update status (open, in-progress, resolved):', issue.status);
    if (newStatus && ['open', 'in-progress', 'resolved'].includes(newStatus)) {
        issue.status = newStatus;
        issue.updatedAt = new Date().toISOString();
        saveIssues();
        renderIssues();
    }
};

// Delete issue
window.deleteIssue = function(id) {
    if (confirm('Are you sure you want to delete this issue?')) {
        issues = issues.filter(issue => issue.id !== id);
        saveIssues();
        renderIssues();
    }
};

// Initial render
renderIssues(); 