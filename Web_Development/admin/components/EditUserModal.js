import { updateUser } from "../../src/js/firebase/userOperations.js";

export class EditUserModal {
  constructor() {
    this.modal = null;
    this.currentUser = null;
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
                <label for="city">City</label>
                <input type="text" id="city" name="city">
              </div>
              <div class="form-group">
                <label for="status">Status</label>
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

  async handleSubmit() {
    try {
      const formData = new FormData(this.modal.querySelector('#editUserForm'));
      const userData = {
        username: formData.get('username'),
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        city: formData.get('city'),
        phoneVerified: formData.get('status')
      };

      await updateUser(this.currentUser.id, userData);
      this.closeModal();
      
      // Dispatch custom event to notify that user was updated
      const event = new CustomEvent('userUpdated', { detail: userData });
      document.dispatchEvent(event);
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
    form.city.value = user.city || '';
    form.status.value = user.status?.toLowerCase() || 'false';

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
    background-color: rgba(0,0,0,0.5);
  }

  .modal-content {
    background-color: #fefefe;
    margin: 5% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 600px;
    border-radius: 8px;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .close {
    color: #aaa;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
  }

  .close:hover {
    color: black;
  }

  .form-group {
    margin-bottom: 15px;
  }

  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  .form-group input,
  .form-group select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }

  .save-btn,
  .cancel-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .save-btn {
    background-color: #4CAF50;
    color: white;
  }

  .cancel-btn {
    background-color: #f44336;
    color: white;
  }

  .save-btn:hover {
    background-color: #45a049;
  }

  .cancel-btn:hover {
    background-color: #da190b;
  }
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet); 