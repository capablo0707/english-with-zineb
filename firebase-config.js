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

// Database functions
const DatabaseService = {
    // User authentication
    async loginUser(email, password) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            return userCredential.user;
        } catch (error) {
            throw error;
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
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    },

    // Video management
    async addVideo(videoData) {
        try {
            const docRef = await db.collection('videos').add({
                ...videoData,
                createdAt: new Date()
            });
            return docRef.id;
        } catch (error) {
            throw error;
        }
    },

    async getVideos(type = null) {
        try {
            let query = db.collection('videos');
            if (type) {
                query = query.where('type', '==', type);
            }
            const snapshot = await query.get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            throw error;
        }
    },

    async deleteVideo(videoId) {
        try {
            await db.collection('videos').doc(videoId).delete();
        } catch (error) {
            throw error;
        }
    },

    // Student management
    async addStudent(studentData) {
        try {
            const docRef = await db.collection('students').add({
                ...studentData,
                createdAt: new Date()
            });
            return docRef.id;
        } catch (error) {
            throw error;
        }
    },

    async getStudents() {
        try {
            const snapshot = await db.collection('users').where('type', '==', 'student').get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            throw error;
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
        } catch (error) {
            throw error;
        }
    },

    async getWatchedVideos(userId) {
        try {
            const snapshot = await db.collection('progress')
                .where('userId', '==', userId)
                .get();
            return snapshot.docs.map(doc => doc.data().videoTitle);
        } catch (error) {
            throw error;
        }
    },

    // Quiz management
    async getQuizzes() {
        try {
            const snapshot = await db.collection('quizzes').orderBy('createdAt', 'desc').get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            throw error;
        }
    },
    async addQuiz(quizData) {
        try {
            const docRef = await db.collection('quizzes').add({
                ...quizData,
                createdAt: new Date()
            });
            return docRef.id;
        } catch (error) {
            throw error;
        }
    },
    async updateQuiz(quizId, quizData) {
        try {
            await db.collection('quizzes').doc(quizId).update({
                ...quizData,
                updatedAt: new Date()
            });
        } catch (error) {
            throw error;
        }
    },
    async deleteQuiz(quizId) {
        try {
            await db.collection('quizzes').doc(quizId).delete();
        } catch (error) {
            throw error;
        }
    }
};

// Export for use in other files
window.DatabaseService = DatabaseService; 