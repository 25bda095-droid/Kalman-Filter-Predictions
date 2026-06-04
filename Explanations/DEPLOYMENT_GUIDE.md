# 🚀 Complete Deployment Guide

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Streamlit Cloud Deployment](#streamlit-cloud-deployment)
3. [Alternative Deployments](#alternative-deployments)
4. [Troubleshooting](#troubleshooting)
5. [Performance Optimization](#performance-optimization)

---

## Local Development Setup

### Prerequisites Check

Before starting, verify you have:
```bash
# Check Python version (need 3.8+)
python --version

# Check pip is installed
pip --version

# Check git is installed
git --version
```

### Step 1: Clone Repository

```bash
# Using HTTPS (simpler for most users)
git clone https://github.com/yourusername/kalman-filter-car-game.git
cd kalman-filter-car-game

# OR using SSH (if you set up SSH keys)
git clone git@github.com:yourusername/kalman-filter-car-game.git
cd kalman-filter-car-game
```

### Step 2: Create Virtual Environment

**Why virtual environment?** 
- Isolates project dependencies
- Prevents conflicts with other Python projects
- Easily reproducible on other machines

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**On Windows (Command Prompt):**
```bash
python -m venv venv
venv\Scripts\activate
```

**On Windows (PowerShell):**
```bash
python -m venv venv
venv\Scripts\Activate.ps1
```

**Verify activation:**
```bash
# You should see (venv) prefix in terminal
# If not, activation failed - try commands above again
```

### Step 3: Install Dependencies

```bash
# Upgrade pip first (recommended)
pip install --upgrade pip

# Install from requirements.txt
pip install -r requirements.txt

# Verify installation
pip list
```

Expected output includes:
- streamlit >= 1.28.0
- numpy >= 1.24.3
- pandas >= 2.0.3
- plotly >= 5.17.0

### Step 4: Run Application Locally

```bash
# From project root directory
streamlit run streamlit_app.py

# Output will show:
# You can now view your Streamlit app in your browser.
# Local URL: http://localhost:8501
# Network URL: http://XXX.XXX.XXX.XXX:8501
```

**Access the app:**
- Local browser: Open `http://localhost:8501`
- Remote machine: Use Network URL (if on same network)
- Port forwarding: SSH tunnel if remote

### Step 5: Development Workflow

```bash
# Make changes to code
# nano streamlit_app.py  (or use your editor)

# Streamlit auto-reloads on file save
# Watch terminal for changes detected

# Commit changes
git add .
git commit -m "Add new visualization feature"
git push origin main
```

---

## Streamlit Cloud Deployment

### What is Streamlit Cloud?

- Free hosting for Streamlit apps
- Automatic deployment from GitHub
- SSL certificate included
- Shared link for collaboration
- Auto-scaling with traffic

### Step 1: Create GitHub Repository

```bash
# Initialize if not done
git init
git add .
git commit -m "Initial commit"

# Create empty repository on GitHub.com
# Then push:
git remote add origin https://github.com/yourusername/kalman-filter-car-game.git
git branch -M main
git push -u origin main

# Verify on GitHub (check repo appears online)
```

**Files GitHub expects:**
```
✅ streamlit_app.py     (main file)
✅ kalman_filter.py     (imported module)
✅ requirements.txt     (dependencies)
❌ venv/               (excluded by .gitignore)
❌ __pycache__/        (excluded by .gitignore)
```

### Step 2: Sign Up for Streamlit Cloud

1. Go to https://share.streamlit.io/
2. Click "Sign up"
3. Choose "Sign up with GitHub"
4. Authorize Streamlit to access repositories
5. Verify email

### Step 3: Deploy Application

1. **Click "New app"** button
2. **Select repository:**
   - Account: your GitHub username
   - Repository: `kalman-filter-car-game`
   - Branch: `main`
3. **Configure deployment:**
   - Main file path: `streamlit_app.py`
   - Python version: 3.11 (default)
4. **Click "Deploy"**

**Deployment process:**
```
⏳ Installing dependencies from requirements.txt...
⏳ Building application...
✅ App deployed successfully!

Your app is live at:
https://share.streamlit.io/yourusername/kalman-filter-car-game
```

### Step 4: Share Your App

**Share link:**
```
https://share.streamlit.io/yourusername/kalman-filter-car-game
```

**Create short link** (optional):
- Use bit.ly or tinyurl.com
- Easier to share verbally/in chat

**Embed in website** (optional):
```html
<iframe 
  src="https://share.streamlit.io/yourusername/kalman-filter-car-game?embedded=true"
  style="height: 800px; width: 100%; border: none;">
</iframe>
```

### Step 5: Update Deployed App

**Any changes auto-deploy:**
```bash
# Edit code locally
nano streamlit_app.py

# Test locally
streamlit run streamlit_app.py

# Commit and push
git add .
git commit -m "Improve filter visualization"
git push origin main

# ✅ Streamlit Cloud detects push
# ⏳ Redeploying in ~1-2 minutes
# ✅ Live app updated automatically!
```

**View deployment logs:**
1. Go to https://share.streamlit.io/
2. Click your app
3. Click three dots ⋮ > Settings
4. View "Logs" tab

---

## Alternative Deployments

### Heroku Deployment (Deprecated)

Heroku is no longer recommended (free tier removed in 2022), but documentation exists for paid tiers. Use Streamlit Cloud instead.

### Docker Deployment (Advanced)

**Create `Dockerfile`:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8501

CMD ["streamlit", "run", "streamlit_app.py"]
```

**Build and run locally:**
```bash
docker build -t kalman-filter-game .
docker run -p 8501:8501 kalman-filter-game
```

**Deploy to cloud:**
- Google Cloud Run
- AWS ECS
- DigitalOcean App Platform
- Any Docker-compatible hosting

### AWS Lambda + API Gateway (Experimental)

Streamlit isn't ideal for serverless (stateless), but possible with workarounds. Not recommended for this interactive app.

### Self-hosted VPS (Full Control)

**On DigitalOcean/Linode/AWS EC2:**

```bash
# Connect via SSH
ssh root@your_server_ip

# Install Python and dependencies
apt update && apt install python3.11 python3.11-venv python3-pip
apt install nginx supervisor

# Clone repository
cd /home
git clone https://github.com/yourusername/kalman-filter-car-game.git
cd kalman-filter-car-game

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install packages
pip install -r requirements.txt

# Run with supervisor (daemon)
sudo nano /etc/supervisor/conf.d/kalman-filter.conf
```

**Supervisor config:**
```ini
[program:kalman-filter]
command=/home/kalman-filter-car-game/venv/bin/streamlit run streamlit_app.py --server.port=8501 --server.address=0.0.0.0
directory=/home/kalman-filter-car-game
autostart=true
autorestart=true
stderr_logfile=/var/log/kalman-filter.err.log
stdout_logfile=/var/log/kalman-filter.out.log
```

**Setup nginx proxy:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8501;
        proxy_set_header Host $host;
    }
}
```

---

## Troubleshooting

### Local Development Issues

**Problem: "ModuleNotFoundError: No module named 'kalman_filter'"**

Solution:
```bash
# Verify file exists
ls kalman_filter.py

# Verify in same directory as streamlit_app.py
ls streamlit_app.py

# If in different directories, either:
# 1. Move files to same directory, or
# 2. Add directory to Python path in streamlit_app.py:
import sys
sys.path.insert(0, '/path/to/kalman_filter')
from kalman_filter import Kalman2DFilter
```

**Problem: "No module named 'streamlit'"**

Solution:
```bash
# Check virtual environment activated
which python  # Should show venv path

# Reinstall streamlit
pip uninstall streamlit -y
pip install streamlit==1.28.0

# Or reinstall all
pip install -r requirements.txt
```

**Problem: Port 8501 already in use**

Solution:
```bash
# Use different port
streamlit run streamlit_app.py --server.port 8502

# Or find and kill process using 8501
# macOS/Linux:
lsof -i :8501
kill -9 <PID>

# Windows:
netstat -ano | findstr :8501
taskkill /PID <PID> /F
```

**Problem: Slow performance / simulation takes forever**

Solution:
```bash
# Reduce simulation duration slider (50 instead of 200)
# Reduce time step (0.1 instead of 0.01)
# Use faster machine

# Or profile to find bottleneck:
pip install streamlit-profiler
# Then analyze
```

### Deployment Issues

**Problem: "Streamlit Cloud won't deploy - build fails"**

Common causes and solutions:

**1. Wrong Python version specified:**
```bash
# Check requirements.txt specifies compatible versions
cat requirements.txt

# Streamlit Cloud uses Python 3.11 by default
# Some old packages incompatible - update:
pip install --upgrade streamlit numpy pandas plotly
pip freeze > requirements.txt
```

**2. Missing files in repository:**
```bash
# Verify all needed files committed
git status

# Add missing files
git add kalman_filter.py streamlit_app.py requirements.txt
git commit -m "Add missing files"
git push origin main
```

**3. Syntax errors in code:**
```bash
# Test locally first
python -m py_compile streamlit_app.py
python -m py_compile kalman_filter.py

# Fix any errors shown
```

**Check deployment logs:**
1. Go to https://share.streamlit.io/
2. Find your app in list
3. Click it
4. Click ⋮ (three dots)
5. Click "Settings"
6. View "Logs" tab

**Example error log:**
```
ERROR: pip's dependency resolver does not currently take into account...
ModuleNotFoundError: No module named 'plotly'
```

**Fix:** Update requirements.txt with explicit versions.

**Problem: "App won't load - stuck on Loading..."**

Possible causes:

1. **Simulation too complex:**
   ```python
   # Add early exit
   if duration > 100:
       st.warning("Duration >100 may be slow, reducing to 100")
       duration = 100
   ```

2. **Infinite loop in code:**
   - Check for `while True:` loops
   - Use `st.spinner()` for long operations

3. **Memory limit exceeded:**
   - Don't store huge arrays in session state
   - Clear session state periodically

4. **Browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (macOS)
   - Or clear browser cache

**Problem: "Kalman filter diverges / estimates blow up"**

Likely causes:

1. **Process noise Q too low:**
   ```python
   # Increase Q
   process_noise_pos = 0.1  # Try 1.0 instead
   process_noise_vel = 0.01  # Try 0.1 instead
   ```

2. **Measurement noise R too high:**
   ```python
   # Decrease R
   measurement_noise = 50.0  # Try 5.0 instead
   ```

3. **Time step dt too large:**
   ```python
   # Smaller time step
   dt = 0.1  # Try 0.01 instead
   ```

**Problem: "Graphs not showing / blank plots"**

Solution:
```bash
# Check browser console (F12)
# Look for JavaScript errors

# Try:
1. Hard refresh (Ctrl+Shift+R)
2. Clear cache and cookies
3. Try different browser
4. Check internet speed

# If still broken:
pip install --upgrade plotly
```

---

## Performance Optimization

### Streamlit Caching

**Problem:** App reruns entire script on every interaction.

**Solution: Use `@st.cache_data`**
```python
import streamlit as st
from kalman_filter import Kalman2DFilter

@st.cache_data
def run_kalman_simulation(init_pos_x, init_pos_y, ...):
    """Cache simulation results"""
    kf = Kalman2DFilter(dt=0.1)
    # ... simulation code ...
    return results

# Call cached function
results = run_kalman_simulation(
    init_pos_x, init_pos_y, ...
)
```

**How it works:**
- First call: Runs simulation, caches result
- Same inputs: Returns cached result instantly
- Different inputs: Runs again, caches new result

**Tip:** Only cache expensive computations

### Reduce Simulation Size

```python
# In streamlit app, cap duration
duration = st.sidebar.slider("Duration", 10, 500, 100)
if duration > 200:
    st.warning("Large simulations may be slow. Consider reducing duration.")
    duration = min(duration, 200)
```

### Optimize Plotting

```python
# Only show recent 100 points to avoid huge plots
max_points = 100
if len(data['time']) > max_points:
    plot_data = subsample_data(data, max_points)
else:
    plot_data = data
```

### Use Streamlit Secret for API Keys (if extending)

```bash
# Create .streamlit/secrets.toml
[secrets]
api_key = "your_key_here"

# In code:
import streamlit as st
api_key = st.secrets["api_key"]
```

---

## Monitoring & Maintenance

### Check App Status

**Streamlit Cloud:**
- Dashboard: https://share.streamlit.io/
- Each app shows: Status, Last updated, Build time

### View Logs

**Streamlit Cloud:**
```
App page → ⋮ (menu) → Settings → Logs tab
```

**Local:**
```bash
# Streamlit prints logs to terminal
# Watch for:
# - SessionState warnings
# - Memory warnings
# - Performance metrics
```

### Update Dependencies

```bash
# Check for outdated packages
pip list --outdated

# Update all
pip install --upgrade pip setuptools wheel
pip install --upgrade -r requirements.txt

# Update requirements.txt
pip freeze > requirements.txt

# Test locally
streamlit run streamlit_app.py

# Commit and push to auto-redeploy
git add requirements.txt
git commit -m "Update dependencies"
git push origin main
```

---

## Scaling Considerations

### For Large Simulations

If users want 1000+ steps:

1. **Implement chunked processing:**
   ```python
   # Process in chunks to show progress
   for chunk_start in range(0, duration, chunk_size):
       run_chunk()
       st.progress(chunk_start / duration)
   ```

2. **Add multiprocessing:**
   ```python
   from multiprocessing import Pool
   with Pool(4) as pool:
       results = pool.map(simulate_one_instance, instances)
   ```

3. **Implement background tasks:**
   - Use Celery + Redis
   - Requires more infrastructure

### For Multiple Concurrent Users

Streamlit Cloud handles scaling automatically, but consider:

1. **Limit per-session computation:**
   ```python
   max_duration = 200  # Per user
   ```

2. **Use @st.cache_data wisely:**
   - Cache expensive computations
   - Don't cache user-specific state

3. **Monitor resource usage:**
   - Check dashboard metrics
   - Upgrade plan if needed

---

## Conclusion

Your Kalman Filter car game is now deployable locally and in the cloud! Start with Streamlit Cloud for simplicity, then explore alternatives as your needs grow.

**Next steps:**
1. ✅ Deploy to Streamlit Cloud
2. Share link with classmates/colleagues
3. Collect feedback
4. Extend with Extended Kalman Filter (EKF)
5. Add real GPS/IMU data

Happy filtering! 🚀
