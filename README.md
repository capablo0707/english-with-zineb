# ENGLISH WITH ZINEB - E-Learning Website

A modern, responsive e-learning platform designed for English language instruction, specifically tailored for bachelor students. This website features a teacher-focused home page, free video content, admin management system, and student access to premium content.

## 🌟 Features

### 🎥 **Video Management**
- **File Upload System**: Upload video files directly (MP4, WebM, OGV) instead of URLs
- **File Validation**: Automatic file type and size validation (100MB limit)
- **Progress Tracking**: Visual upload progress indicators
- **Video Players**: Native HTML5 video players for uploaded content
- **Dual Support**: Works with both uploaded files and YouTube URLs

### 👨‍💼 **Admin Dashboard**
- **Video Upload**: Add videos to free and paid sections with file upload
- **Student Management**: Create and manage student accounts
- **Statistics**: View total videos, students, and content distribution
- **File Information**: Display file size, type, and upload date
- **Real-time Updates**: Instant dashboard updates after uploads

### 👨‍🎓 **Student Dashboard**
- **Premium Access**: View paid videos with progress tracking
- **Learning Stats**: Track watched videos, time spent, and achievements
- **Video Playback**: Watch uploaded videos with native controls
- **Progress Tracking**: Visual progress bars for each video

### 🏠 **Home Page**
- **Teacher Profile**: Professional presentation of instructor
- **Free Courses**: Showcase available free content
- **Contact Form**: Easy communication with students
- **Responsive Design**: Works on all devices

## 🚀 Quick Start

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for development)
- **For production**: Firebase account (free)

### Installation
1. Download or clone all files to your web server directory
2. Open `index.html` in your web browser
3. The website is ready to use!

### Database Setup (For Production)
For hosting on Netlify or other static hosts, you'll need a database:

1. **Firebase Setup** (Recommended):
   - Follow the detailed guide in `DATABASE_SETUP.md`
   - Create Firebase project and enable services
   - Update `firebase-config.js` with your credentials

2. **Alternative Databases**:
   - Supabase (PostgreSQL)
   - MongoDB Atlas
   - PlanetScale (MySQL)

### Default Login Credentials

#### Admin Access
- **Username**: `admin`
- **Password**: `admin123`

#### Student Access
- **Email**: `student1@example.com`
- **Password**: `password123`

## 📁 File Structure

```
english-with-zineb/
├── index.html              # Main home page
├── login.html              # Login page for admin and students
├── admin-dashboard.html    # Admin management dashboard
├── student-dashboard.html  # Student learning dashboard
├── styles.css              # Main stylesheet
├── script.js               # Main JavaScript functionality
├── firebase-config.js      # Firebase database configuration
├── DATABASE_SETUP.md       # Database setup guide
└── README.md               # This file
```

## 🎯 How to Use

### 1. Home Page (`index.html`)
- Navigate through different sections using the navigation menu
- View teacher information and academy statistics
- Access free learning resources
- Contact the academy through the contact form

### 2. Login System (`login.html`)
- Choose between Student and Admin login
- Enter credentials to access respective dashboards
- Automatic redirection based on user type

### 3. Admin Dashboard (`admin-dashboard.html`)
- **Overview Tab**: View platform statistics
- **Free Videos Tab**: Manage public video content
- **Paid Videos Tab**: Manage premium video content
- **Students Tab**: Manage student accounts

#### Adding Videos (Admin)
1. Navigate to "Free Videos" or "Paid Videos" tab
2. Click "Add Video" button
3. Fill in the form:
   - Title
   - Duration (in minutes)
   - Level (Beginner/Intermediate/Advanced)
   - Video URL (YouTube embed URL)
   - Description
4. Click "Add Video" to save

#### Adding Students (Admin)
1. Navigate to "Students" tab
2. Click "Add Student" button
3. Fill in student details:
   - Full Name
   - Email
   - Password
4. Click "Add Student" to create account

### 4. Student Dashboard (`student-dashboard.html`)
- **Overview Tab**: View learning statistics and progress
- **Premium Videos Tab**: Access paid video content
- **Progress Tab**: Track learning history and achievements

## 🎨 Design Features

- **Modern Gradient Backgrounds**: Beautiful color schemes
- **Smooth Animations**: Hover effects and transitions
- **Responsive Grid Layout**: Adapts to all screen sizes
- **Interactive Elements**: Buttons, forms, and video players
- **Professional Typography**: Clean and readable fonts
- **Card-based Design**: Organized content presentation

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript**: Interactive functionality
- **Font Awesome**: Icons
- **Google Fonts**: Typography

### Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

### Data Storage
- Uses browser's localStorage for data persistence
- No server required for basic functionality
- Data persists between sessions

## 🎥 Video Integration

### Supported Video Platforms
- YouTube (recommended)
- Any platform that provides embed URLs

### Adding YouTube Videos
1. Get the embed URL from YouTube
2. Format: `https://www.youtube.com/embed/VIDEO_ID`
3. Add to admin dashboard

## 📱 Mobile Responsiveness

The website is fully responsive and includes:
- Mobile-friendly navigation
- Touch-optimized buttons
- Responsive video grids
- Adaptive typography
- Optimized layouts for small screens

## 🔒 Security Notes

This is a frontend-only implementation for demonstration purposes. For production use, consider:
- Server-side authentication
- Database integration
- HTTPS implementation
- Input validation and sanitization
- Session management

## 🚀 Deployment

### Local Development
1. Place files in your web server directory
2. Access via `http://localhost/your-folder`

### Web Hosting (Static Sites like Netlify)
1. **Setup Database** (Required):
   - Follow `DATABASE_SETUP.md` guide
   - Create Firebase project
   - Update `firebase-config.js`

2. **Deploy Files**:
   - Upload all files to your web hosting provider
   - Ensure all files are in the same directory
   - Access via your domain name

3. **Test Everything**:
   - Test login functionality
   - Test video uploads
   - Test student management

## 🎯 Customization

### Changing Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #fbbf24;
    --gradient-start: #667eea;
    --gradient-end: #764ba2;
}
```

### Adding Content
- Modify the sample data in `script.js`
- Update the admin dashboard to add real content
- Customize the teacher information on the home page

## 📞 Support

For questions or issues:
1. Check the browser console for errors
2. Ensure all files are in the same directory
3. Verify that JavaScript is enabled
4. Clear browser cache if needed

## 📄 License

This project is created for educational purposes. Feel free to modify and use for your own projects.

---

**Happy Learning! 🎓**

*ENGLISH WITH ZINEB - Empowering students to master English through innovative online learning.* 