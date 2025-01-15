# Microblog Application

Microblog is a full-stack CRUD application built using React, Flask, and PostgreSQL. This project implements user authentication, role-based access (admin functionality), and basic blogging features, including posts and comments.

## Features

### Core Functionality
- **User Authentication:** Secure login and signup functionality using JWT for session management.
- **Role-Based Access Control:** Admin users can perform privileged actions such as deleting any post or comment.
- **Posts Management:** Users can create, edit, and delete their own posts.
- **Comments Management:** Users can add comments to posts, edit their own comments, and delete them.
- **Dynamic Dashboard:** Displays posts and comments dynamically, allowing real-time updates for seamless interaction.
- **Profile Page:** Displays each users username, bio, and location, all which are able to be updated. It also displays the users past posts and comments

### Additional Features
- **Environment Configuration:** Sensitive information such as database credentials and secret keys are stored in environment variables for security.
- **Responsive Design:** Fully styled frontend with responsive elements for a smooth user experience.

## Tech Stack

### Frontend
- **React**: For building the user interface.
- **Axios**: For API communication.
- **CSS**: For styling components and pages.

### Backend
- **Flask**: Python-based framework for server-side logic and API endpoints.
- **Flask-SQLAlchemy**: ORM for managing database operations.
- **Flask-JWT-Extended**: For handling authentication and token-based authorization.

### Database
- **PostgreSQL**: A robust relational database for storing user information, posts, and comments.

## Setup and Installation

### Prerequisites
Ensure you have the following installed:
- Python (>= 3.8)
- Node.js (>= 14.x)
- PostgreSQL
- Git

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/SrikarKovvuri/microblog.git
   cd microblog
   ```
2. Set up a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables in a `.env` file:
   ```env
   DATABASE_URL=postgresql://<username>:<password>@localhost:5432/microblog
   SECRET_KEY=<your_secret_key>
   ```
5. Initialize the database:
   ```bash
   flask db init
   flask db migrate -m "Initial migration."
   flask db upgrade
   ```
6. Start the backend server:
   ```bash
   flask run
   ```

### Frontend Setup
1. Navigate to the `src` directory:
   ```bash
   cd src
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

### Running the Application
1. Start both the backend and frontend servers.
2. Open your browser and navigate to `http://localhost:3000` to access the application.


## Future Improvements
- Implement real-time updates using WebSockets for enhanced interactivity.
- Add unit and integration tests for both frontend and backend.
- Include OAuth-based authentication (e.g., Google, GitHub).
- Extend the admin functionality with detailed analytics and user management.

## Contributing
Feel free to fork this repository, make changes, and submit pull requests. Contributions are welcome!

## License
This project is licensed under the [MIT License](LICENSE).

---
Developed by [Srikar Kovvuri](https://github.com/SrikarKovvuri).
