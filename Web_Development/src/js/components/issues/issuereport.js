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

// Store issues data
let allIssues = [];

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
searchInput.addEventListener('input', filterAndRenderIssues);
filterPriority.addEventListener('change', filterAndRenderIssues);
filterStatus.addEventListener('change', filterAndRenderIssues);

// Filter and render issues
function filterAndRenderIssues() {
    const searchTerm = searchInput.value.toLowerCase();
    const priorityFilter = filterPriority.value;
    const statusFilter = filterStatus.value;

    const filteredIssues = allIssues.filter(issue => {
        const matchesSearch = 
            issue.title.toLowerCase().includes(searchTerm) ||
            issue.description.toLowerCase().includes(searchTerm) ||
            (issue.priority && issue.priority.toLowerCase().includes(searchTerm)) ||
            (issue.status && issue.status.toLowerCase().includes(searchTerm));
        
        const matchesPriority = !priorityFilter || issue.priority === priorityFilter;
        const matchesStatus = !statusFilter || issue.status === statusFilter;
        
        return matchesSearch && matchesPriority && matchesStatus;
    });

    renderIssues(filteredIssues);
}

// Render issues list
function renderIssues(issues) {
    issuesList.innerHTML = issues.map(issue => `
        <div class="issue-item" data-id="${issue.id}">
            <div class="issue-col" data-label="Title">
                <strong>${issue.title}</strong>
            </div>
            <div class="issue-col" data-label="Description">${issue.description}</div>
            <div class="issue-col" data-label="Priority">
                <span class="priority-tag priority-${issue.priority}">${issue.priority}</span>
            </div>
            <div class="issue-col" data-label="Status">
                <span class="status-tag status-${issue.status}">${issue.status}</span>
            </div>
        </div>
    `).join('');
}

// Edit issue
window.editIssue = function(id) {
    const issue = allIssues.find(issue => issue.id === id);
    if (!issue) return;

    // Update status
    const newStatus = prompt('Update status (open, in-progress, resolved):', issue.status);
    if (newStatus && ['open', 'in-progress', 'resolved'].includes(newStatus)) {
        issue.status = newStatus;
        issue.updatedAt = new Date().toISOString();
        saveIssues();
        filterAndRenderIssues();
    }
};

// Delete issue
window.deleteIssue = function(id) {
    if (confirm('Are you sure you want to delete this issue?')) {
        allIssues = allIssues.filter(issue => issue.id !== id);
        saveIssues();
        filterAndRenderIssues();
    }
};

// Save issues to localStorage
function saveIssues() {
    localStorage.setItem('issues', JSON.stringify(allIssues));
}

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

        // Convert to array and store in allIssues
        allIssues = [];
        querySnapshot.forEach((doc) => {
            allIssues.push({ id: doc.id, ...doc.data() });
        });

        // Sort issues by createdAt in descending order
        allIssues.sort((a, b) => {
            const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
            const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
            return dateB - dateA;
        });

        // Initial render of all issues
        filterAndRenderIssues();
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
filterAndRenderIssues(); 