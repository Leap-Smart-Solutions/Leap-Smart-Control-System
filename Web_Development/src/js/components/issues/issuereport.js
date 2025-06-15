import { auth, db } from '../../firebase/firebaseConfig.js';
import { collection, addDoc, query, where, getDocs, orderBy } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js';

// Initialize EmailJS for Issues
(function() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.async = true;
    script.onload = () => {
        window.emailjs.init("cji7mNq-RToAXRA72"); // Replace with your new EmailJS public key
    };
    document.head.appendChild(script);
})();

// Function to fetch admin emails from Firestore
async function getAdminEmails() {
    try {
        const adminsQuery = query(collection(db, 'admins'));
        const querySnapshot = await getDocs(adminsQuery);
        const adminEmails = [];
        
        querySnapshot.forEach((doc) => {
            const adminData = doc.data();
            if (adminData.email) {
                adminEmails.push(adminData.email);
            }
        });
        
        return adminEmails;
    } catch (error) {
        console.error('Error fetching admin emails:', error);
        return [];
    }
}

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
            status: 'Pending',
            userId: user.uid,
            createdAt: new Date()
        };

        const docRef = await addDoc(collection(db, 'issues'), issueData);
        
        // Send email notification
        try {
            // Fetch admin emails
            const adminEmails = await getAdminEmails();
            
            // Fetch user's full name from Firestore
            const userDoc = await getDocs(query(collection(db, 'users'), where('email', '==', user.email)));
            let userName = 'User';
            
            if (!userDoc.empty) {
                const userData = userDoc.docs[0].data();
                userName = userData.fullName;
                console.log('User data from Firestore:', userData);
            }
            
            console.log('User name from Firestore:', userName);
            
            const emailParams = {
                to_email: user.email,
                to_name: userName,
                subject: `New Issue Created - ${title} (ID: ${docRef.id})`,
                issue_id: docRef.id,
                issue_title: title,
                issue_description: description,
                issue_status: 'Pending',
                issue_date: new Date().toLocaleDateString(),
                issue_priority: 'Not Set Yet',
                bcc_emails: adminEmails.join(',') // Add admin emails as BCC
            };

            await window.emailjs.send(
                'service_2if6dys', // Replace with your new EmailJS service ID
                'template_ngjjgzr', // Replace with your new EmailJS template ID
                emailParams
            );
            
            console.log('Issue notification email sent successfully');
        } catch (error) {
            console.error('Error sending issue notification email:', error);
        }
        
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
auth.onAuthStateChanged(async (user) => {
    if (user) {
        try {
            // Fetch user's full name from Firestore
            const userDoc = await getDocs(query(collection(db, 'users'), where('email', '==', user.email)));
            if (!userDoc.empty) {
                const userData = userDoc.docs[0].data();
                console.log('User data from Firestore:', userData);
                console.log('User fullName:', userData.fullName);
            } else {
                console.log('No user document found in Firestore');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
        loadUserIssues();
    } else {
        issuesList.innerHTML = '<div class="auth-message">Please log in to view your issues</div>';
    }
});

// Load issues when page loads
document.addEventListener('DOMContentLoaded', () => {
    // The auth state change listener will handle the loading
});

// Initial render
filterAndRenderIssues(); 