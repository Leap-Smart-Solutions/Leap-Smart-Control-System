   - 4.3.3 Backend Development
      - 4.3.3.1 Tools and Technologies
      - 4.3.3.2 Backend Design Pattern
      - 4.3.3.3 Authentication and Authorization
      - 4.3.3.4 Users Management System
      - 4.3.3.5 Orders Management System
      - 4.3.3.6 Issues Management System
      - 4.3.3.7 Items Management System
      - 4.3.3.8 Inventory Management System
      - 4.3.3.9 Automated Email Invoicing
      - 4.3.3.10 Real-Time Database and IoT Integration
      - 4.3.3.11 Backend Testing

**4.3.3 Backend Development**

This section details the server-side architecture, technologies, and functionalities that power the Leap smart home system. The backend is responsible for handling user authentication, managing data, processing business logic, and ensuring seamless communication between the user interfaces (web and mobile) and the IoT devices.

**4.3.3.1 Tools and Technologies**

The backend is built using a modern JavaScript stack, chosen for its performance, scalability, and rich ecosystem. The primary tools include:

- **Node.js**: A runtime environment for executing JavaScript on the server-side.
- **Express.js**: A minimal and flexible Node.js web application framework used to build our API endpoints.
- **Firebase**: A comprehensive platform from Google that provides several crucial backend services.

**4.3.3.2 Backend Design Pattern**

The Leap system's backend is initially designed using a monolithic architecture. This approach centralizes the codebase, which simplifies development, testing, and deployment in the early stages of the project. All core functionalities—including user management, device control, and API endpoints—are managed within a single, unified application. This pattern was chosen for its straightforwardness, allowing for rapid development and iteration, which aligns with our Agile methodology.

As the system grows in complexity and user load, we plan to evolve towards a microservices architecture to enhance scalability and maintainability, as mentioned in our future work.

**4.3.3.3 Authentication and Authorization**

Secure access is managed through a multi-layered authentication and authorization process:

- **User Authentication**: We use Firebase Authentication to manage user sign-up and login processes. It provides a secure and easy-to-implement solution for handling user credentials, including email/password authentication.
- **Phone Verification**: To enhance security and validate user identity, we have implemented a phone number verification step during signup using a custom WhatsApp OTP (One-Time Password) service. This service is an open-source project available at https://github.com/Abd-El-Rahman-Mohamed/whatsapp-otp and is deployed on Railway at https://whatsapp-otp-production.up.railway.app. When a user signs up, an OTP is sent to their WhatsApp number, which they must enter to complete registration.
- **Email Verification**: To enhance security and validate user identity, we have implemented an email verification step during signup using Firebase Authentication. When a user signs up, a verification email is automatically sent to their registered email address. The user must click the verification link in the email to complete their registration. This ensures that only users with valid email addresses can access the system. The verification status is tracked in Firebase, and users cannot access certain features until their email is verified. This is followed by phone verification using WhatsApp OTP for additional security.
- **Password Management**: The system implements comprehensive password management features to ensure account security:

  - **Change Password**: Authenticated users can change their password through their profile settings:
    - Requires current password verification
    - Updates password in Firebase Authentication
    - Maintains session security during password change

  - **Reset Password**: Users who have forgotten their password can request a reset:
    - Accessible from the login page
    - Requires email verification
    - Sends password reset link to user's registered email
    - Link expires after 24 hours for security
    - Allows setting a new password without knowing the old one
    - Requires email verification before allowing password reset
    - Sends confirmation email after successful reset

  - **Security Features**:
    - Rate limiting on password attempts
    - Secure password storage using Firebase Authentication
    - Automatic session invalidation on password change
- **Profile Image Management**: The system provides a user-friendly interface for managing profile pictures:

  - **Image Upload**: Users can update their profile picture through their profile settings:
    - Supports common image formats (JPG, PNG, JPEG)
    - Drag-and-drop interface for easy upload
    - Using Imgbb image hosting platform for Image hosting

  - **Image Processing**:
    - Automatic image resizing to standard dimensions
    - Maintains aspect ratio
    - Stores images urls in Firebase Firestore database

  - **Storage and Retrieval**:
    - Secure storage in Firebase Storage
    - Image hosting platform delivery for fast image loading

  - **User Experience**:
    - Real-time preview of selected image
    - Immediate update across all user interfaces
    - Fallback to default avatar if upload fails
    - Error handling for failed uploads

- **Role-Based Access Control**: The system distinguishes between two main roles: 'User' and 'Admin'. By default, all new sign-ups are assigned the 'User' role. To elevate a user's privileges to 'Admin', the user must contact the system owner directly. This manual process ensures a high level of security for administrative functions.
 **Order-Based Access Control**: To ensure that only verified customers can access certain features, the system implements an order-based access control mechanism. Specifically, access to the Living Room, Bedroom, and Kitchen control pages is restricted to users who have completed at least one order. This is implemented through a dual-check system:
  - The system verifies the user's authentication status
  - It then checks both the main orders collection and the user's subcollection for completed orders
  - Access is granted only if the user has at least one completed order
  - Users without completed orders are redirected to the Products to make an order
  This ensures that only legitimate customers who have purchased the system can access the smart home control features.

**4.3.3.4 Users Management System**

The backend implements a secure user management system that is exclusively accessible to administrators:

- **User Management**: Admins can manage user accounts through a dedicated interface, with each user's data stored in Firebase with the following structure:
  - User ID
  - User profile image
  - Email (verified)
  - Phone number (verified/not verified)
  - Username
  - Address

- **Admin Controls**: The system provides comprehensive administrative capabilities:
  - View all registered users and their details
  - Delete user accounts
  - Monitor user order history
  - Manage user order status
  - Access user issues

- **Security Features**:
  - Role-based access control ensures only admins can access the management interface

**4.3.3.5 Order Management System**

The backend implements a comprehensive order management system that handles the entire order lifecycle:

- **Order Creation**: Users can place orders through the shopping interface, with each order stored in Firebase with the following structure:
  - Order ID and timestamp
  - User ID and shipping information
  - Product details and quantities
  - Total price and payment status
  - Current status (pending, completed, canceled)
    pending is the default
  - Admin notes and tracking information

- **Order Processing**: The system provides different views for users and admins:
  - Users can view their order history and current order status
  - Admins can view all orders, update their status, and add tracking information
  - Admins can filter orders based on their status, and add tracking information
  - Updates ensure both users and admins are viewing the status changes
  - Order completion triggers access to smart home control features

**4.3.3.6 Issue Management System**

The backend implements a comprehensive issue management system that allows users to create and track support requests:

- **Issue Creation**: Users can create support tickets through a dedicated interface, providing details about their concerns or requirements. Each issue is stored in Firebase with the following structure:
  - Issue title and description
  - User ID and contact information
  - Creation timestamp
  - Current status (open, pending, closed)
    pending is the default
  - Priority level (set by admin)

- **Issue Processing**: The system provides different views for users and admins:
  - Users can create new issues and view their own issue history
  - Admins can view all issues, update their status, set priority levels, and add resolution notes
  - Updates ensure both users and admins are viewing the status changes
  - Admins can filter issues based on their priority, and status

**4.3.3.7 Items Management System**

The backend implements a secure items management system that is exclusively accessible to administrators:

- **Product Management**: Admins can manage the product catalog through a dedicated interface, with each product stored in Firebase with the following structure:
  - Product ID and name
  - Description and specifications
  - Price and availability status
  - Product images is Hosted at Imgbb for remote access instead of local hosting

- **Admin-Only Features**: The system provides comprehensive management capabilities exclusively for administrators:
  - Create new products with detailed specifications
  - Update existing product information and prices
  - Setting reorders
  - Upload and manage product images

- **Security Measures**:
  - Admin-only access enforced through Firebase Authentication
  - Input validation to prevent data corruption
  
**4.3.3.8 Inventory Management System**

The backend implements a secure inventory management system exclusively for administrators to manage IoT component parts:

- **Inventory Control**: Admins can manage the parts inventory through a dedicated interface, with each item stored in Firebase with the following structure:
  - Part ID and name
  - Current stock quantity
  - Last restock date
  - Cost per unit

- **Admin-Only Features**:
  - Add new parts to inventory
  - Update stock quantities
  - Track part usage in IoT components
  - View inventory and reorder history

- **Firebase Integration**: Inventory is stored in a secure Firestore collection with strict access control:
  - Only admin users can access and modify inventory data
  - Reorders monitoring
  - Audit trail of all inventory changes

- **Security Measures**:
  - Role-based access control ensures only admins can access inventory
  - All inventory changes are logged with admin ID and timestamp
  - Regular inventory audits can be performed

**4.3.3.9 Automated Email Invoicing**

After a user successfully places an order through the website, the backend automatically sends a detailed invoice to the user's registered email address. This functionality is implemented using EmailJS, a service that allows sending emails directly from the client-side or server-side code without needing a full backend server for email management.

**4.3.3.10 Real-Time Database and IoT Integration**

The core of our smart home control functionality relies on real-time data synchronization between the user interfaces and the connected IoT devices.

- **Firebase Real-Time Database**: We utilize Firebase's Real-Time Database, a NoSQL cloud database, to store and sync data instantly. This is crucial for real-time control of smart devices.
- **Living Room Lighting Control**: For example, the lighting in the 'Livingroom' is controlled by a specific entry in the database. The frontend application updates a value in the database, and the corresponding smart light (connected via an ESP module) listens for changes to that value.
  - Setting the value to 1 turns the light on.
  - Setting the value to 0 turns the light off. This ensures that commands from the web or mobile app are executed with minimal latency.

**4.3.3.11 Backend Testing**

To ensure the reliability and robustness of our backend, we have planned a comprehensive testing strategy that will be implemented in future iterations:

- **Unit Testing**: We plan to write unit tests for individual functions and modules (e.g., authentication logic, API route handlers) to verify their correctness in isolation.
- **Integration Testing**: We plan to conduct integration tests to ensure that different parts of the backend (like the API, database, and external services) work together seamlessly. This will include testing the end-to-end flow of user requests, from the API endpoint to the database and back.

*Note: While this testing strategy is planned, it has not been fully implemented in the current version. The only testing currently in place is manual testing for the phone verification system.*

### 7 .2 Future Work

**Backend Testing and Quality Assurance**
To ensure the reliability and robustness of the system, a comprehensive backend testing strategy will be implemented:

1. **Unit Testing Framework**
   - Implement automated unit tests for individual functions and modules
   - Focus on testing authentication logic, API route handlers, and database operations
   - Use testing frameworks like Jest or Mocha for JavaScript/Node.js components
   - Establish continuous integration to run tests automatically on code changes

2. **Integration Testing**
   - Develop end-to-end tests for complete user flows
   - Test interactions between different backend components (API, database, external services)
   - Implement automated API testing using tools like Postman or Supertest
   - Create test environments that mirror production settings

3. **Performance Testing**
   - Conduct load testing to ensure system stability under heavy usage
   - Implement stress testing to identify system breaking points
   - Monitor and optimize database query performance
   - Test real-time data synchronization with Firebase

4. **Security Testing**
   - Implement automated security testing for authentication and authorization
   - Conduct penetration testing for API endpoints
   - Test data encryption and secure storage practices
   - Regular security audits and vulnerability assessments