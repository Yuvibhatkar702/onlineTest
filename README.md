# TestPortal - Complete Assessment Platform Clone

A comprehensive assessment platform inspired by TestPortal.net, built with the MERN stack (MongoDB, Express.js, React, Node.js). This application provides all the functionality of the original TestPortal with modern design and additional features.

## 🚀 Features

### Core Functionality
- **User Management**: Complete authentication system with role-based access (Admin, Teacher, Student)
- **Assessment Creation**: Build comprehensive tests with multiple question types
- **Question Bank**: Organize questions by categories with import/export capabilities
- **Real-time Assessment**: Secure test-taking environment with anti-cheating measures
- **Advanced Analytics**: Detailed reporting and performance tracking
- **AI Integration**: AI-powered question generation and content improvement

### Security Features
- **Anti-Cheating Technology**: Browser lockdown, tab switching detection, copy-paste prevention
- **Secure Authentication**: JWT tokens, password hashing, account lockout protection
- **Real-time Monitoring**: Live proctoring capabilities and session tracking
- **Data Encryption**: Secure data transmission and storage

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between themes for better user experience
- **Real-time Notifications**: Instant updates and alerts
- **Collaborative Features**: Share assessments with team members

## 🛠 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Socket.io** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **OpenAI API** - AI-powered features

### Frontend
- **React.js** - User interface library
- **Material-UI (MUI)** - React component library
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **Socket.io Client** - Real-time features

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Development server auto-restart

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16.0 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** - Package manager (comes with Node.js)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd TestPortal
```

### 2. Install Server Dependencies
```bash
cd server
npm install
```

### 3. Install Client Dependencies
```bash
cd ../client
npm install
```

### 4. Environment Configuration

Create a `.env` file in the server directory:
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/testportal

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d

# OpenAI API (for AI features)
OPENAI_API_KEY=your-openai-api-key

# Email Configuration (for notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Upload
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

Create a `.env` file in the client directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 5. Database Setup

Make sure MongoDB is running on your system:
```bash
# On Windows (if installed as service)
net start MongoDB

# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

### 6. Start the Application

#### Development Mode
Start both server and client in development mode:

**Terminal 1 - Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Client:**
```bash
cd client
npm start
```

#### Production Mode
```bash
# Build the client
cd client
npm run build

# Start the server
cd ../server
npm start
```

The application will be available at:
- **Client**: http://localhost:3000
- **Server API**: http://localhost:5000/api

## 📁 Project Structure

```
TestPortal/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store and slices
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                # Node.js backend
│   ├── middleware/        # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── server.js         # Main server file
├── package.json          # Root package.json
└── README.md
```

## 🎯 Usage

### For Administrators
1. **User Management**: Create and manage user accounts
2. **System Configuration**: Set up organization settings
3. **Analytics**: View comprehensive system analytics

### For Teachers/Educators
1. **Create Assessments**: Build tests with various question types
2. **Manage Question Bank**: Organize and categorize questions
3. **Monitor Progress**: Track student performance in real-time
4. **Generate Reports**: Export detailed analytics and reports

### For Students
1. **Take Assessments**: Complete assigned tests securely
2. **View Results**: Check scores and feedback
3. **Track Progress**: Monitor learning progress over time

## 🔐 Security Features

- **Authentication**: Secure login with JWT tokens
- **Authorization**: Role-based access control
- **Anti-Cheating**: Multiple detection mechanisms
- **Data Protection**: Encrypted sensitive data
- **Session Management**: Secure session handling
- **Rate Limiting**: Protection against abuse

## 📊 Key Features Breakdown

### Assessment Creation
- Multiple question types (MCQ, True/False, Short Answer, Essay)
- Rich text editor with formatting options
- Image and file attachments
- Time limits and scheduling
- Randomization options

### Question Bank Management
- Categorization and tagging
- Bulk import/export
- Question difficulty levels
- Usage statistics
- AI-powered question generation

### Analytics & Reporting
- Real-time dashboards
- Performance analytics
- Detailed reporting
- Export capabilities
- Custom report generation

### Security & Monitoring
- Browser lockdown during tests
- Webcam and microphone monitoring
- Tab switching detection
- Copy-paste prevention
- Suspicious activity alerts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 API Documentation

The API documentation is available at `/api/docs` when running the server in development mode.

Key API endpoints:
- `POST /api/auth/login` - User authentication
- `GET /api/assessments` - Get assessments
- `POST /api/assessments` - Create assessment
- `GET /api/questions` - Get questions
- `POST /api/results` - Submit assessment results

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the connection string in `.env`

2. **Port Already in Use**
   - Change the PORT in `.env` file
   - Kill processes using the port: `netstat -ano | findstr :5000`

3. **NPM Install Errors**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall

4. **CORS Issues**
   - Check client and server URLs match
   - Verify CORS configuration in server.js

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by TestPortal.net
- Built with modern web technologies
- Community feedback and contributions

## 📞 Support

For support, email support@testportal.com or create an issue in the repository.

---

**Note**: This is a complete clone of TestPortal.net functionality with modern improvements and additional features. The application is ready for production use with proper environment configuration.

### Advanced Features
- **Microsoft Teams Integration**
- **API for Third-party Integrations**
- **Progress Tracking Over Time**
- **Group Performance Analysis**
- **Automated Grading System**
- **Report Generation & Export**
- **Mobile Responsive Design**
- **Enterprise Security**

## 🛠 Tech Stack

### Frontend
- **React.js** - Modern UI framework
- **Material-UI** - Professional component library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Chart.js** - Data visualization
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Socket.io** - Real-time communication
- **Multer** - File uploads
- **OpenAI API** - AI question generation

### Development Tools
- **Nodemon** - Development server
- **Concurrently** - Run multiple scripts
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd testportal-clone
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   Create `.env` files in both server and client directories:
   
   **Server (.env)**
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   OPENAI_API_KEY=your_openai_api_key
   CLOUDINARY_URL=your_cloudinary_url
   NODE_ENV=development
   PORT=5000
   ```

   **Client (.env)**
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SOCKET_URL=http://localhost:5000
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

   This will start both the server (port 5000) and client (port 3000).

## 🏗 Project Structure

```
testportal-clone/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store
│   │   ├── utils/          # Utility functions
│   │   ├── styles/         # Global styles
│   │   └── App.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   ├── config/            # Configuration files
│   └── server.js
├── package.json           # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Assessments
- `GET /api/assessments` - Get all assessments
- `POST /api/assessments` - Create assessment
- `GET /api/assessments/:id` - Get specific assessment
- `PUT /api/assessments/:id` - Update assessment
- `DELETE /api/assessments/:id` - Delete assessment

### Questions
- `POST /api/questions/generate` - AI question generation
- `POST /api/questions` - Create question
- `GET /api/questions` - Get questions
- `PUT /api/questions/:id` - Update question

### Results
- `POST /api/results` - Submit test results
- `GET /api/results/:assessmentId` - Get assessment results
- `GET /api/results/analytics/:assessmentId` - Get analytics

## 🎯 Usage

### For Instructors
1. Register as an instructor
2. Create assessments with various question types
3. Configure access settings and timing
4. Monitor real-time progress
5. Analyze results and generate reports

### For Test Takers
1. Access tests via link or access code
2. No registration required
3. Take assessments with anti-cheating measures
4. View immediate results (if enabled)

### For Administrators
1. Manage all users and assessments
2. Configure platform settings
3. Monitor system usage
4. Generate comprehensive reports

## 🔒 Security Features

- **JWT Authentication** - Secure user sessions
- **Role-based Access Control** - Granular permissions
- **Input Validation** - Prevent malicious inputs
- **Rate Limiting** - Prevent abuse
- **CORS Protection** - Cross-origin security
- **Data Encryption** - Sensitive data protection
- **Anti-Cheating Measures** - Honest Respondent Technology

## 📊 Analytics & Reporting

- Individual performance tracking
- Group statistics and comparisons
- Question difficulty analysis
- Progress tracking over time
- Exportable reports (PDF, Excel)
- Real-time dashboard
- Performance trends

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deploy to Heroku
1. Create Heroku app
2. Set environment variables
3. Connect to MongoDB Atlas
4. Deploy using Git

### Deploy to AWS/DigitalOcean
1. Set up server instance
2. Install Node.js and MongoDB
3. Configure environment variables
4. Set up reverse proxy (Nginx)
5. Configure SSL certificate

## 🔄 Updates & Maintenance

- Regular security updates
- Feature enhancements
- Bug fixes and improvements
- Performance optimizations

---

**Note**: This is a complete functional clone of TestPortal.net built with modern technologies. All features from the original platform have been implemented with additional improvements and modern design patterns.
#   o n l i n e T e s t  
 