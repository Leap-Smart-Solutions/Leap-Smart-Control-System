import { auth, db } from '../../firebase/firebaseConfig.js';
import { collection, addDoc, query, where, getDocs, orderBy } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js';

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
issueForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (!user) {
        alert('Please log in to create an issue');
        return;
    }

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    try {
        // Add issue to Firestore
        const issueData = {
            title,
            description,
            priority: 'null',
            status: 'pending',
            userId: user.uid,
            createdAt: new Date()
        };

        await addDoc(collection(db, 'issues'), issueData);
        
        // Clear form and close modal
        issueForm.reset();
        issueModal.style.display = 'none';
        
        // Refresh issues list
        await loadUserIssues();
    } catch (error) {
        console.error('Error creating issue:', error);
        alert('Error creating issue. Please try again.');
    }
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

// Load user's issues
async function loadUserIssues() {
    const user = auth.currentUser;
    if (!user) {
        console.log('No user logged in');
        return;
    }

    try {
        console.log('Loading issues for user:', user.uid);
        const issuesQuery = query(
            collection(db, 'issues'),
            where('userId', '==', user.uid)
        );

        const querySnapshot = await getDocs(issuesQuery);
        issuesList.innerHTML = ''; // Clear existing issues

        if (querySnapshot.empty) {
            console.log('No issues found for user');
            issuesList.innerHTML = '<div class="no-issues">No issues found</div>';
            return;
        }

        // Convert to array and sort by createdAt
        const issues = [];
        querySnapshot.forEach((doc) => {
            issues.push({ id: doc.id, ...doc.data() });
        });

        // Sort issues by createdAt in descending order
        issues.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

        // Display sorted issues
        issues.forEach((issue) => {
            const issueElement = document.createElement('div');
            issueElement.className = 'issue-item';
            issueElement.innerHTML = `
                <div class="issue-col">${issue.title}</div>
                <div class="issue-col">${issue.description}</div>
                <div class="issue-col">${issue.priority}</div>
                <div class="issue-col">${issue.status}</div>
            `;
            issuesList.appendChild(issueElement);
        });
    } catch (error) {
        console.error('Error loading issues:', error);
        issuesList.innerHTML = '<div class="error-message">Error loading issues. Please try again.</div>';
    }
}

// Listen for auth state changes
auth.onAuthStateChanged((user) => {
    if (user) {
        loadUserIssues();
    } else {
        issuesList.innerHTML = '<div class="auth-message">Please log in to view your issues</div>';
    }
});

// Load issues when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadUserIssues();
});

// Initial render
renderIssues(); 