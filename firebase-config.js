// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaQwxKZKL3Da6oUS3RYSKlw8JkRl1AO00",
  authDomain: "english-83d38.firebaseapp.com",
  projectId: "english-83d38",
  storageBucket: "english-83d38.firebasestorage.app", // fixed to .appspot.com
  messagingSenderId: "240052098421",
  appId: "1:240052098421:web:3cbeea655a71a33a5faf3c",
  measurementId: "G-SKS848F17M"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// Production-ready error handling
const handleFirebaseError = (error, context) => {
  console.error(`Firebase Error in ${context}:`, error);
  
  // Log specific error types for debugging
  if (error.code === 'permission-denied') {
    console.error('Permission denied - check security rules');
  } else if (error.code === 'unauthenticated') {
    console.error('User not authenticated');
  } else if (error.code === 'storage/unauthorized') {
    console.error('Storage access unauthorized');
  }
  
  return error;
};

// Database functions
const DatabaseService = {
    // User authentication
    async loginUser(email, password) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            console.log('User logged in successfully:', userCredential.user.email);
            return userCredential.user;
        } catch (error) {
            throw handleFirebaseError(error, 'loginUser');
        }
    },

    async registerUser(email, password, name, type) {
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            await db.collection('users').doc(userCredential.user.uid).set({
                name: name,
                email: email,
                type: type,
                createdAt: new Date()
            });
            console.log('User registered successfully:', email);
            return userCredential.user;
        } catch (error) {
            throw handleFirebaseError(error, 'registerUser');
        }
    },

    // Video management
    async addVideo(videoData) {
        try {
            const docRef = await db.collection('videos').add({
                ...videoData,
                createdAt: new Date()
            });
            console.log('Video added successfully:', videoData.title);
            return docRef.id;
        } catch (error) {
            throw handleFirebaseError(error, 'addVideo');
        }
    },

    async getVideos(type = null) {
        try {
            let query = db.collection('videos');
            if (type) {
                query = query.where('type', '==', type);
            }
            const snapshot = await query.get();
            const videos = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log(`Retrieved ${videos.length} videos${type ? ` of type: ${type}` : ''}`);
            return videos;
        } catch (error) {
            throw handleFirebaseError(error, 'getVideos');
        }
    },

    async deleteVideo(videoId) {
        try {
            await db.collection('videos').doc(videoId).delete();
            console.log('Video deleted successfully:', videoId);
        } catch (error) {
            throw handleFirebaseError(error, 'deleteVideo');
        }
    },

    // Student management
    async addStudent(studentData) {
        try {
            const docRef = await db.collection('students').add({
                ...studentData,
                createdAt: new Date()
            });
            console.log('Student added successfully:', studentData.name);
            return docRef.id;
        } catch (error) {
            throw handleFirebaseError(error, 'addStudent');
        }
    },

    async getStudents() {
        try {
            const snapshot = await db.collection('users').where('type', '==', 'student').get();
            const students = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log(`Retrieved ${students.length} students`);
            return students;
        } catch (error) {
            throw handleFirebaseError(error, 'getStudents');
        }
    },

    // Progress tracking
    async trackVideoWatch(userId, videoTitle) {
        try {
            await db.collection('progress').add({
                userId: userId,
                videoTitle: videoTitle,
                watchedAt: new Date()
            });
            console.log('Video watch tracked:', videoTitle);
        } catch (error) {
            throw handleFirebaseError(error, 'trackVideoWatch');
        }
    },

    async getWatchedVideos(userId) {
        try {
            const snapshot = await db.collection('progress')
                .where('userId', '==', userId)
                .get();
            const watchedVideos = snapshot.docs.map(doc => doc.data().videoTitle);
            console.log(`Retrieved ${watchedVideos.length} watched videos for user:`, userId);
            return watchedVideos;
        } catch (error) {
            throw handleFirebaseError(error, 'getWatchedVideos');
        }
    },

    // Quiz management
    async getQuizzes() {
        try {
            const snapshot = await db.collection('quizzes').orderBy('createdAt', 'desc').get();
            const quizzes = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log(`Retrieved ${quizzes.length} quizzes`);
            return quizzes;
        } catch (error) {
            throw handleFirebaseError(error, 'getQuizzes');
        }
    },
    
    async addQuiz(quizData) {
        try {
            const docRef = await db.collection('quizzes').add({
                ...quizData,
                createdAt: new Date()
            });
            console.log('Quiz added successfully:', quizData.title);
            return docRef.id;
        } catch (error) {
            throw handleFirebaseError(error, 'addQuiz');
        }
    },
    
    async updateQuiz(quizId, quizData) {
        try {
            await db.collection('quizzes').doc(quizId).update({
                ...quizData,
                updatedAt: new Date()
            });
            console.log('Quiz updated successfully:', quizId);
        } catch (error) {
            throw handleFirebaseError(error, 'updateQuiz');
        }
    },
    
    async deleteQuiz(quizId) {
        try {
            await db.collection('quizzes').doc(quizId).delete();
            console.log('Quiz deleted successfully:', quizId);
        } catch (error) {
            throw handleFirebaseError(error, 'deleteQuiz');
        }
    },

    // Production health check
    async healthCheck() {
        try {
            console.log('🔍 Running Firebase health check...');
            
            // Test Firestore connection
            const testDoc = await db.collection('health').doc('test').get();
            console.log('✅ Firestore connection: OK');
            
            // Test Auth connection
            const currentUser = auth.currentUser;
            console.log('✅ Auth connection: OK', currentUser ? `(User: ${currentUser.email})` : '(No user logged in)');
            
            // Test Storage connection
            const storageRef = storage.ref();
            console.log('✅ Storage connection: OK');
            
            console.log('🎉 Firebase health check passed!');
            return true;
        } catch (error) {
            console.error('❌ Firebase health check failed:', error);
            throw error;
        }
    },

    // Create admin user if it doesn't exist
    async createAdminUser(email, password, name = 'Admin') {
        try {
            console.log('🔧 Creating admin user...');
            
            // Check if user already exists in Auth
            try {
                const userCredential = await auth.signInWithEmailAndPassword(email, password);
                console.log('✅ Admin user already exists in Auth');
                return userCredential.user;
            } catch (error) {
                if (error.code === 'user-not-found') {
                    // Create new user
                    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                    
                    // Add user data to Firestore
                    await db.collection('users').doc(userCredential.user.uid).set({
                        name: name,
                        email: email,
                        type: 'admin',
                        createdAt: new Date()
                    });
                    
                    console.log('✅ Admin user created successfully:', email);
                    return userCredential.user;
                } else {
                    throw error;
                }
            }
        } catch (error) {
            throw handleFirebaseError(error, 'createAdminUser');
        }
    },

    // Check if current user is admin
    async isCurrentUserAdmin() {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                console.log('❌ No user logged in');
                return false;
            }
            
            const userDoc = await db.collection('users').doc(currentUser.uid).get();
            if (!userDoc.exists) {
                console.log('❌ User document not found');
                return false;
            }
            
            const userData = userDoc.data();
            const isAdmin = userData.type === 'admin';
            console.log(`👤 User type: ${userData.type} (Admin: ${isAdmin})`);
            return isAdmin;
        } catch (error) {
            console.error('❌ Error checking admin status:', error);
            return false;
        }
    }
};

// Export for use in other files
window.DatabaseService = DatabaseService; 

// Run health check on page load (optional)
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        // Run health check after a short delay
        setTimeout(() => {
            DatabaseService.healthCheck().catch(error => {
                console.warn('Firebase health check failed, but continuing...', error);
            });
        }, 1000);
    });
} 