import { auth, db } from "../../firebase/firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Initialize profile functionality
const initProfile = () => {
    const userProfile = document.querySelector('.user-profile');
    if (!userProfile) return;

    // Toggle dropdown on click for mobile
    userProfile.addEventListener('click', (e) => {
        if (window.innerWidth <= 767) {
            e.preventDefault();
            userProfile.classList.toggle('active');
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 767 && 
            userProfile.classList.contains('active') && 
            !userProfile.contains(e.target)) {
            userProfile.classList.remove('active');
        }
    });

    // Close dropdown when clicking a link
    const dropdownLinks = userProfile.querySelectorAll('.profile-dropdown a');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 767) {
                userProfile.classList.remove('active');
            }
        });
    });
};

// Get user profile data
const getUserProfile = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            return userDoc.data();
        }
        return null;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
};

// Update profile image
const updateProfileImage = async () => {
    try {
        const user = auth.currentUser;
        if (!user) return;

        const userData = await getUserProfile(user.uid);
        const profileImg = document.getElementById('user-profile-img');
        
        if (profileImg && userData) {
            profileImg.src = userData.profilePicture || '../../assets/images/placeholder.png';
            profileImg.onerror = () => {
                profileImg.src = '../../assets/images/placeholder.png';
            };
        }
    } catch (error) {
        console.error('Error updating profile image:', error);
    }
};

// Initialize everything when auth state changes
onAuthStateChanged(auth, async (user) => {
    if (user) {
        await updateProfileImage();
        initProfile();
    } else {
        window.location.href = '../../pages/auth/login.html';
    }
}); 