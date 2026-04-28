# Testing Guide for File Integrity Monitoring System

## 🧪 Automated Testing

### Test Backend Health
```powershell
# Test if backend is running
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "File Integrity Monitoring System backend is running",
  "timestamp": "2026-04-27T10:30:00"
}
```

### Test Hash Generation
```powershell
# Create a test file
"Hello, FIMS!" | Out-File -FilePath testfile.txt -Encoding UTF8

# Generate hash using curl
$content = [System.IO.File]::ReadAllBytes('testfile.txt')
curl -F 'file=@testfile.txt' http://localhost:5000/hash-file
```

Expected: JSON with hash, filename, size

### Test Alerts Endpoint
```powershell
curl http://localhost:5000/alerts
```

Expected:
```json
{
  "alerts": [],
  "total_alerts": 0
}
```

## 🖥️ Manual Testing Workflow

### Test 1: Basic File Hashing

1. **Start both servers**
   - Terminal 1: `npm run dev`
   - Terminal 2: `python src/python/backend.py`

2. **Open browser** to http://localhost:5173

3. **Navigate to Dashboard**
   - Verify page loads
   - Check all 3 stat cards display
   - Check footer appears

4. **Go to File Scanner**
   - Click file upload area
   - Select a test file (any type)
   - Click "Generate SHA-256 Hash"
   - Wait for hash to appear
   - Verify hash is displayed (64 characters for SHA-256)

5. **Test Modification Detection**
   - Copy the generated hash
   - Paste into "Stored Hash" field
   - Click "Detect Modification"
   - Should show "✅ Safe"

### Test 2: File Modification Detection

1. **Upload same file again**
   - Make a small change to the file (add 1 character)
   - Save the file
   - Go back to File Scanner
   - Upload the modified file
   - Generate hash again (should be different)

2. **Detect modification**
   - Keep original hash in "Stored Hash"
   - Click "Detect Modification"
   - Should show "⚠️ Unauthorized Modification Detected"

3. **Check Alerts**
   - Navigate to Alerts page
   - Should see the alert in the table
   - Shows file name, timestamp, "Unauthorized" status
   - Includes details about hash mismatch

### Test 3: Navigation

1. **Test all nav buttons**
   - Dashboard → should load Dashboard
   - File Scanner → should load File Scanner
   - Alerts → should load Alerts
   - Back to Dashboard → active state should highlight

2. **Test responsive design**
   - Press F12 to open DevTools
   - Click device toggle (mobile view)
   - Test on different screen sizes
   - Layout should adjust properly

## 🔍 Browser DevTools Testing

### Console Errors
1. Open DevTools (F12)
2. Check Console tab
3. Should see NO errors
4. May see warnings (ignore vendor warnings)

### Network Tab
1. Go to File Scanner
2. Upload file and generate hash
3. Check Network tab:
   - POST /hash-file → 200 OK
   - Response should have hash
4. Compare hashes:
   - POST /detect-file → 200 OK
   - Response should have status

### Performance
1. Open DevTools
2. Go to Performance tab
3. Record page interactions
4. Check for smooth animations
5. No major jank or stuttering

## ✅ Checklist for Complete Testing

### Frontend
- [ ] Dashboard loads correctly
- [ ] All cards visible with proper styling
- [ ] Navbar navigation works
- [ ] File Scanner page loads
- [ ] File upload functionality works
- [ ] Hash display works
- [ ] Alerts page shows alerts
- [ ] Responsive design on mobile
- [ ] No console errors
- [ ] Smooth animations

### Backend
- [ ] Backend starts without errors
- [ ] Health endpoint works (GET /health)
- [ ] Hash generation works (POST /hash-file)
- [ ] Modification detection works (POST /detect-file)
- [ ] Alerts endpoint works (GET /alerts)
- [ ] No CORS errors
- [ ] Proper error handling

### Integration
- [ ] Frontend can call backend
- [ ] File upload and hash generation works end-to-end
- [ ] Hash comparison works end-to-end
- [ ] Alerts are created and displayed
- [ ] Refresh alerts page shows latest data
- [ ] Error messages display properly

## 🐛 Debugging Failed Tests

### Hash Generation Fails
**Issue:** Backend shows error on /hash-file
- Check file size (shouldn't be massive)
- Check file permissions
- Verify FormData is correct in browser

**Fix:**
```python
# Check backend logs
# Look for file reading errors
# Verify file is being received
```

### Modification Detection Doesn't Work
**Issue:** Comparison always returns same result
- Check both hashes are actually different
- Verify you're modifying file correctly
- Check hash comparison logic in backend

**Fix:**
```python
# Compare hashes manually
hash1 = "abc123"
hash2 = "def456"
print(hash1 == hash2)  # Should be False
```

### Alerts Not Appearing
**Issue:** Alerts page shows empty
- Check browser console for errors
- Verify backend is running
- Check network tab for GET /alerts call

**Fix:**
- Manually call GET /alerts in curl
- Check alerts_log in backend has data
- Verify API response is valid JSON

### CORS Errors in Console
**Issue:** "Access to XMLHttpRequest blocked by CORS"
- Backend Flask-CORS not working
- Missing CORS import or decorator

**Fix:**
```python
# Verify in backend.py
from flask_cors import CORS
CORS(app)  # Must be after Flask(app)
```

### Ports Already in Use
**Issue:** "Address already in use" on port 5000 or 5173

**Solution:**
```powershell
# Find process using port
Get-NetTCPConnection -LocalPort 5000 | Select-Object -ExpandProperty OwningProcess

# Kill the process (if safe)
Stop-Process -Id <PID> -Force

# Or use different port in vite.config.js or backend.py
```

## 📊 Test Results Template

```
Test Date: ___________
Tester: ___________
System: Windows / Python ___ / Node.js ___

FRONTEND
  Dashboard Load: ✅ / ❌
  Navigation: ✅ / ❌
  File Upload: ✅ / ❌
  Hash Generation: ✅ / ❌
  Result Display: ✅ / ❌
  Alerts Page: ✅ / ❌
  Responsive: ✅ / ❌
  Console Errors: ✅ / ❌

BACKEND
  Server Start: ✅ / ❌
  Health Endpoint: ✅ / ❌
  Hash Endpoint: ✅ / ❌
  Detect Endpoint: ✅ / ❌
  Alerts Endpoint: ✅ / ❌
  CORS: ✅ / ❌

INTEGRATION
  Full Flow Works: ✅ / ❌
  Alerts Created: ✅ / ❌
  Error Handling: ✅ / ❌

Overall Status: ✅ PASS / ⚠️ NEEDS WORK / ❌ FAILED

Notes:
_________________________________
_________________________________
```

## 🚀 Performance Testing

### Load Testing
1. Generate multiple hashes quickly
2. Upload multiple files in succession
3. Load alerts page with many alerts
4. Check browser memory usage (DevTools)
5. Verify no memory leaks

### Stress Testing
1. Upload large files (100MB+)
2. Generate many alerts (1000+)
3. Rapid page switching
4. Monitor for crashes/hangs

## 📝 Test Cases for Features

### File Hash Generation
```
Input: Any file
Process:
  1. Upload file
  2. Click Generate Hash
  3. Wait for response
Expected: Hash displayed (64 hex chars for SHA-256)
Status: ✅ / ❌
```

### Modification Detection (Safe)
```
Input: Same file, same hash
Process:
  1. Upload file, generate hash
  2. Copy hash to Stored Hash field
  3. Click Detect Modification
Expected: "Safe" result shown
Status: ✅ / ❌
```

### Modification Detection (Unsafe)
```
Input: Modified file, different hash
Process:
  1. Upload file, generate hash
  2. Modify file externally
  3. Upload modified file, generate new hash
  4. Compare with original hash
Expected: "Unauthorized Modification" alert
Status: ✅ / ❌
```

### Alert Logging
```
Input: Unauthorized modification detected
Expected:
  1. Alert is created
  2. Alert appears in Alerts page
  3. Alert has correct timestamp
  4. Alert shows file name and status
Status: ✅ / ❌
```

---

**All tests complete! Your FIMS system is ready for use. 🎉**
