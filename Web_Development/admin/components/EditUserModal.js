import { updateUser } from "../../src/js/firebase/userOperations.js";

export class EditUserModal {
  constructor() {
    this.modal = null;
    this.currentUser = null;
    this.newProfilePicture = null;
  }

  createModal() {
    const modalHTML = `
      <div class="modal" id="editUserModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Edit User</h2>
            <span class="close">&times;</span>
          </div>
          <div class="modal-body">
            <form id="editUserForm">
              <div class="form-group" style="text-align:center;">
                <img id="edit-profile-picture" src="https://i.ibb.co/277hTSg8/generic-profile.jpg" alt="Profile" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:2px solid #333;display:block;margin:0 auto 10px auto;" />
                <input type="file" id="edit-upload-profile" accept="image/*" style="display:none;" />
                <label for="edit-upload-profile" style="cursor:pointer;color:rgb(212,130,30);display:block;">Change Photo</label>
              </div>
              <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username">
              </div>
              <div class="form-group">
                <label for="fullName">Full Name</label>
                <input type="text" id="fullName" name="fullName">
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email">
              </div>
              <div class="form-group">
                <label for="phone">Phone</label>
                <input type="tel" id="phone" name="phone">
              </div>
              <div class="form-group">
                <label for="status">Phone Activated</label>
                <select id="status" name="status">
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
              </div>
              <div class="form-actions">
                <button type="submit" class="save-btn">Save Changes</button>
                <button type="button" class="cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    // Add modal to the document
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modal = document.getElementById('editUserModal');
    this.setupEventListeners();
    this.setupProfileImageUpload();
  }

  setupEventListeners() {
    const closeBtn = this.modal.querySelector('.close');
    const cancelBtn = this.modal.querySelector('.cancel-btn');
    const form = this.modal.querySelector('#editUserForm');

    // Close modal when clicking the X or Cancel button
    closeBtn.onclick = () => this.closeModal();
    cancelBtn.onclick = () => this.closeModal();

    // Close modal when clicking outside
    window.onclick = (event) => {
      if (event.target === this.modal) {
        this.closeModal();
      }
    };

    // Handle form submission
    form.onsubmit = async (e) => {
      e.preventDefault();
      await this.handleSubmit();
    };
  }

  setupProfileImageUpload() {
    const fileInput = this.modal.querySelector('#edit-upload-profile');
    const imgPreview = this.modal.querySelector('#edit-profile-picture');
    const IMGBB_API_KEY = "7358f23b1f2d81c20df3232eaaee1567";
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result.split(",")[1];
        const formData = new FormData();
        formData.append("key", IMGBB_API_KEY);
        formData.append("image", base64Data);
        try {
          // 1) Upload to ImgBB
          const res = await fetch("https://api.imgbb.com/1/upload", {
            method: "POST",
            body: formData
          });
          const json = await res.json();
          if (!json.success) throw new Error(json.error.message);
          // 2) Get the hosted URL
          const downloadURL = json.data.url;
          // 3) Show preview immediately
          imgPreview.src = downloadURL;
          // 4) Store the URL for saving on submit
          this.newProfilePicture = downloadURL;
        } catch (uploadErr) {
          console.error("ImgBB upload failed:", uploadErr);
          alert("Image upload failed. Please try again.");
        }
      };
      reader.onerror = () => {
        console.error("FileReader error:", reader.error);
        alert("Could not read file.");
      };
      reader.readAsDataURL(file);
    });
  }

  async handleSubmit() {
    try {
      const formData = new FormData(this.modal.querySelector('#editUserForm'));
      const userData = {
        username: formData.get('username'),
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        phoneVerified: formData.get('status')
      };
      // Add profilePicture if a new one was uploaded
      if (this.newProfilePicture) {
        userData.profilePicture = this.newProfilePicture;
      }
      await updateUser(this.currentUser.id, userData);
      this.closeModal();
      // Dispatch custom event to notify that user was updated
      const event = new CustomEvent('userUpdated', { detail: userData });
      document.dispatchEvent(event);
      // Reset newProfilePicture for next use
      this.newProfilePicture = null;
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user. Please try again.');
    }
  }

  openModal(user) {
    this.currentUser = user;
    const form = this.modal.querySelector('#editUserForm');
    // Populate form with user data
    form.username.value = user.username || '';
    form.fullName.value = user.fullName || '';
    form.email.value = user.email || '';
    form.phone.value = user.phone || '';
    form.status.value = user.phoneVerified?.toString() || 'false';
    // Set profile image preview
    const imgPreview = this.modal.querySelector('#edit-profile-picture');
    imgPreview.src = user.profilePicture || 'https://i.ibb.co/277hTSg8/generic-profile.jpg';
    // Reset newProfilePicture
    this.newProfilePicture = null;
    this.modal.style.display = 'block';
  }

  closeModal() {
    this.modal.style.display = 'none';
    this.currentUser = null;
  }
}

// Add styles for the modal
const styles = `
  .modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
  }

  .modal-content {
    background-color: #1e1e1e;
    margin: 5% auto;
    padding: 25px;
    border: 1px solid #333;
    width: 80%;
    max-width: 600px;
    border-radius: 12px;
    color: #fff;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #333;
  }

  .modal-header h2 {
    color: #fff;
    margin: 0;
    font-size: 1.5rem;
  }

  .close {
    color: #888;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  .close:hover {
    color: rgb(212, 130, 30);
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #f1efef;
  }

  .form-group input,
  .form-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid #333;
    border-radius: 6px;
    background-color: #2a2a2a;
    color: #fff;
    font-size: 14px;
  }

  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: rgb(212, 130, 30);
  }

  .form-group input::placeholder {
    color: #666;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 25px;
  }

  .save-btn,
  .cancel-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .save-btn {
    background-color: rgb(212, 130, 30);
    color: white;
  }

  .cancel-btn {
    background-color: #333;
    color: #fff;
  }

  .save-btn:hover {
    background-color: rgb(212, 130, 50);
  }

  .cancel-btn:hover {
    background-color: #444;
  }

  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .modal-content {
    animation: modalFadeIn 0.3s ease forwards;
  }
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet); 