# Firebase Storage Security Rules

## 🔧 **Fix the "Unknown Error" in Firebase Storage**

The error you're seeing is likely due to Firebase Storage security rules. Follow these steps to fix it:

### **Step 1: Go to Firebase Console**
1. Visit [console.firebase.google.com](https://console.firebase.google.com)
2. Select your project: `english-83d38`
3. Click on "Storage" in the left sidebar

### **Step 2: Update Storage Rules**
1. Click on the "Rules" tab
2. Replace the existing rules with these:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read access to all videos
    match /videos/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.resource.size < 100 * 1024 * 1024 && // 100MB limit
        request.resource.contentType.matches('video/.*');
    }
    
    // Allow read/write access to user uploads
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### **Step 3: Publish Rules**
1. Click "Publish" to save the rules
2. Wait a few minutes for the rules to take effect

### **Step 4: Test Upload**
1. Go back to your admin dashboard
2. Try uploading a video file
3. Check the browser console for any errors

## 🔍 **Alternative Rules (More Permissive for Testing)**

If you're still having issues, try these more permissive rules for testing:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ Warning**: These rules allow anyone to read and write to your storage. Only use for testing, then switch back to the secure rules above.

## 🚨 **Common Issues and Solutions**

### **Issue 1: "Permission denied"**
- **Solution**: Check that you're logged in as admin
- **Solution**: Verify Storage rules are published

### **Issue 2: "File too large"**
- **Solution**: Check file size (limit is 100MB)
- **Solution**: Compress video if needed

### **Issue 3: "Invalid file type"**
- **Solution**: Only video files are allowed
- **Solution**: Check file extension (.mp4, .webm, .ogg, etc.)

### **Issue 4: "Storage not initialized"**
- **Solution**: Check Firebase config in `firebase-config.js`
- **Solution**: Verify Storage is enabled in Firebase Console

## 📋 **Checklist**

- [ ] Firebase Storage is enabled
- [ ] Storage rules are published
- [ ] Admin user is logged in
- [ ] Video file is under 100MB
- [ ] File is a valid video format
- [ ] Firebase config is correct

## 🔧 **Debug Steps**

1. **Open Browser Console** (F12)
2. **Check for errors** when uploading
3. **Verify Firebase connection** in console
4. **Test with small video file** first
5. **Check network tab** for failed requests

---

**After updating the rules, try uploading a video again. The error should be resolved! 🎉** 