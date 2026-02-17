# 🔒 SECURITY NOTICE

## ⚠️ IMPORTANT: API Key Security

**Date**: February 18, 2026  
**Status**: RESOLVED

### Issue Identified
The Google Gemini API key was accidentally exposed in the repository in the following file:
- `finsync-reality-lens/Backend/.env`

### Actions Taken

1. ✅ **Removed exposed API key** from `finsync-reality-lens/Backend/.env`
2. ✅ **Created `.gitignore`** to exclude all `.env` files from version control
3. ✅ **Removed `.env` files from git tracking** using `git rm --cached`
4. ✅ **Committed and pushed** security fixes to GitHub
5. ✅ **Updated both `.env` files** to use placeholder values

### Required Actions for Developers

If you're setting up this project, you **MUST** add your own API keys:

#### 1. Backend Configuration
Create/update `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/finsync-ai
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GEMINI_API_KEY=YOUR_ACTUAL_GEMINI_API_KEY_HERE
PORT=5000
NODE_ENV=development
LANDING_PAGE_URL=http://localhost:5173
DASHBOARD_URL=http://localhost:5174
REALITY_LENS_URL=http://localhost:5175
PYTHON_BACKEND_URL=http://localhost:8000
```

#### 2. Reality Lens Backend Configuration
Create/update `finsync-reality-lens/Backend/.env`:
```env
GOOGLE_API_KEY=YOUR_ACTUAL_GEMINI_API_KEY_HERE
```

### How to Get Your API Keys

#### Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it into your `.env` files
5. **NEVER commit this key to git**

#### MongoDB URI
- For local development: `mongodb://localhost:27017/finsync-ai`
- For cloud (MongoDB Atlas): Get your connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

#### JWT Secret
Generate a secure random string:
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### Security Best Practices

1. **Never commit `.env` files** - They are now in `.gitignore`
2. **Use environment variables** for all sensitive data
3. **Rotate API keys regularly** - Especially after exposure
4. **Use different keys** for development and production
5. **Enable API key restrictions** in Google Cloud Console:
   - Restrict by IP address
   - Restrict by API (only allow Gemini API)
   - Set usage quotas

### Files Now Protected

The following files are now excluded from git tracking:
- `backend/.env`
- `finsync-reality-lens/Backend/.env`
- Any other `.env` files in the project

### Verification

To verify `.env` files are ignored:
```bash
git status
# Should NOT show .env files as untracked
```

### If You Accidentally Commit API Keys

1. **Immediately revoke the key** in Google Cloud Console
2. **Generate a new key**
3. **Remove the key from git history**:
   ```bash
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch path/to/.env" \
   --prune-empty --tag-name-filter cat -- --all
   ```
4. **Force push** (⚠️ Use with caution):
   ```bash
   git push origin --force --all
   ```

### Contact

If you notice any security issues, please report them immediately.

---

**Status**: ✅ All exposed keys have been removed and the repository is now secure.
