# Database Setup Guide for Netlify Hosting

## 🗄️ **Firebase Database Setup (Recommended)**

### **Step 1: Create Firebase Project**

1. **Go to Firebase Console**:
   - Visit [firebase.google.com](https://firebase.google.com)
   - Click "Get Started" or "Go to console"
   - Sign in with your Google account

2. **Create New Project**:
   - Click "Add project"
   - Enter project name: `english-with-zineb`
   - Enable Google Analytics (optional)
   - Click "Create project"

### **Step 2: Enable Services**

1. **Enable Authentication**:
   - In Firebase console, go to "Authentication"
   - Click "Get started"
   - Go to "Sign-in method" tab
   - Enable "Email/Password"
   - Click "Save"

2. **Enable Firestore Database**:
   - Go to "Firestore Database"
   - Click "Create database"
   - Choose "Start in test mode" (for development)
   - Select location closest to your users
   - Click "Done"

3. **Enable Storage** (for video uploads):
   - Go to "Storage"
   - Click "Get started"
   - Choose "Start in test mode"
   - Select location
   - Click "Done"

### **Step 3: Get Configuration**

1. **Get Firebase Config**:
   - Click the gear icon ⚙️ next to "Project Overview"
   - Select "Project settings"
   - Scroll down to "Your apps"
   - Click the web icon (</>)
   - Register app with name: `english-with-zineb-web`
   - Copy the config object

2. **Update firebase-config.js**:
   Replace the placeholder config in `firebase-config.js`:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};
```

### **Step 4: Set Up Security Rules**

1. **Firestore Rules**:
   Go to Firestore Database → Rules and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to videos
    match /videos/{videoId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.type == 'admin';
    }
    
    // Allow read/write access to users
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow read/write access to students
    match /students/{studentId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.type == 'admin';
    }
    
    // Allow read/write access to progress
    match /progress/{progressId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

2. **Storage Rules**:
   Go to Storage → Rules and update:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /videos/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.resource.size < 100 * 1024 * 1024 && // 100MB limit
        request.resource.contentType.matches('video/.*');
    }
  }
}
```

## 🚀 **Alternative Database Options**

### **Option 2: Supabase (PostgreSQL)**
- **Pros**: Free tier, PostgreSQL, real-time features
- **Setup**: [supabase.com](https://supabase.com)

### **Option 3: MongoDB Atlas**
- **Pros**: Free tier, NoSQL, easy setup
- **Setup**: [mongodb.com/atlas](https://mongodb.com/atlas)

### **Option 4: PlanetScale (MySQL)**
- **Pros**: Free tier, MySQL, serverless
- **Setup**: [planetscale.com](https://planetscale.com)

## 📁 **File Upload with Firebase Storage**

### **Updated Video Upload Function**

Replace the current video upload in `admin-dashboard.html`:

```javascript
async function addVideo(type, event) {
    event.preventDefault();
    
    const title = document.getElementById(`${type}VideoTitle`).value;
    const duration = document.getElementById(`${type}VideoDuration`).value;
    const level = document.getElementById(`${type}VideoLevel`).value;
    const fileInput = document.getElementById(`${type}VideoFile`);
    const file = fileInput.files[0];
    const description = document.getElementById(`${type}VideoDescription`).value;
    
    if (!file) {
        alert('Please select a video file.');
        return;
    }

    try {
        // Upload file to Firebase Storage
        const storageRef = storage.ref();
        const videoRef = storageRef.child(`videos/${Date.now()}_${file.name}`);
        const uploadTask = await videoRef.put(file);
        const downloadURL = await uploadTask.ref.getDownloadURL();
        
        // Save video data to Firestore
        const videoData = {
            title,
            duration: `${duration} min`,
            level,
            videoUrl: downloadURL,
            description,
            type,
            fileName: file.name,
            fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
            fileType: file.type,
            uploadDate: new Date()
        };
        
        await DatabaseService.addVideo(videoData);
        
        // Reset form
        event.target.reset();
        hideAddVideoForm(type);
        
        // Clear file info
        const fileInfo = document.getElementById(`${type}VideoFileInfo`);
        const progressBar = document.getElementById(`${type}VideoProgress`);
        if (fileInfo) fileInfo.innerHTML = '';
        if (progressBar) progressBar.style.width = '0%';
        
        // Reload dashboard
        loadDashboardData();
        
        alert('Video uploaded successfully!');
    } catch (error) {
        console.error('Error uploading video:', error);
        alert('Error uploading video. Please try again.');
    }
}
```

## 🔧 **Migration from localStorage**

### **Step 1: Update Login System**

Replace localStorage authentication with Firebase Auth:

```javascript
// In login.html
async function loginUser(type) {
    const email = document.getElementById(`${type}Email`).value;
    const password = document.getElementById(`${type}Password`).value;
    
    try {
        const user = await DatabaseService.loginUser(email, password);
        const userDoc = await db.collection('users').doc(user.uid).get();
        const userData = userDoc.data();
        
        if (userData.type === type) {
            localStorage.setItem('currentUser', JSON.stringify({
                uid: user.uid,
                name: userData.name,
                email: userData.email,
                type: userData.type
            }));
            
            if (type === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'student-dashboard.html';
            }
        } else {
            alert('Invalid credentials for this account type.');
        }
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
}
```

### **Step 2: Update Data Loading**

Replace localStorage data loading with Firestore queries:

```javascript
// In admin-dashboard.html
async function loadDashboardData() {
    try {
        const videos = await DatabaseService.getVideos();
        const students = await DatabaseService.getStudents();
        
        // Update stats
        document.getElementById('totalVideos').textContent = videos.length;
        document.getElementById('totalStudents').textContent = students.length;
        document.getElementById('freeVideos').textContent = videos.filter(v => v.type === 'free').length;
        document.getElementById('paidVideos').textContent = videos.filter(v => v.type === 'paid').length;
        
        // Load videos and students...
    } catch (error) {
        console.error('Error loading data:', error);
    }
}
```

## 🎯 **Deployment Steps**

### **1. Update Configuration**
- Replace Firebase config in `firebase-config.js`
- Test locally first

### **2. Deploy to Netlify**
- Upload all files to Netlify
- Ensure `firebase-config.js` is included

### **3. Set Environment Variables** (Optional)
In Netlify dashboard:
- Go to Site settings → Environment variables
- Add Firebase config as environment variables

### **4. Test Everything**
- Test login functionality
- Test video uploads
- Test student management
- Test progress tracking

## 🔒 **Security Best Practices**

1. **Enable Authentication**: Require login for admin functions
2. **Set Proper Rules**: Restrict access based on user roles
3. **Validate Inputs**: Check file types and sizes
4. **Use HTTPS**: Netlify provides this automatically
5. **Monitor Usage**: Check Firebase console for usage

## 💰 **Costs**

### **Firebase Free Tier** (Spark Plan):
- **Authentication**: 10,000 users/month
- **Firestore**: 1GB storage, 50,000 reads/day, 20,000 writes/day
- **Storage**: 5GB storage, 1GB downloads/day
- **Perfect for small to medium projects**

### **Upgrade When Needed**:
- Blaze Plan (pay-as-you-go) when you exceed free limits
- Very affordable for most use cases

## 🆘 **Troubleshooting**

### **Common Issues**:
1. **CORS Errors**: Check Firebase rules
2. **Upload Failures**: Verify file size limits
3. **Authentication Errors**: Check Firebase Auth setup
4. **Database Errors**: Verify Firestore rules

### **Debug Steps**:
1. Check browser console for errors
2. Verify Firebase config is correct
3. Test Firebase services in console
4. Check network tab for failed requests

---

**Your e-learning website is now ready for production with a real database! 🚀** 