// ==============================================
// BathiXen Security Enhancer Module
// ThirdVisionPlus Engineering | CEO: Eng. Kushan Prasanga
// Version: 1.0.1 (Logout button removed)
// ==============================================

(function() {
  'use strict';
  
  console.log('🔒 Security Enhancer Module loaded');
  
  // ==============================================
  // 1. Session Timeout & Auto-Logout
  // ==============================================
  class SessionManager {
    constructor(timeoutMinutes = 30) {
      this.timeout = timeoutMinutes * 60 * 1000; // milliseconds
      this.timer = null;
      this.init();
    }
    
    init() {
      // Only run if user is logged in
      if (!localStorage.getItem('userLoggedIn')) return;
      
      this.resetTimer();
      this.setupListeners();
      
      // Show session warning
      this.showSessionInfo();
    }
    
    resetTimer() {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => this.logout(), this.timeout);
    }
    
    setupListeners() {
      ['click', 'mousemove', 'keypress', 'scroll'].forEach(event => {
        document.addEventListener(event, () => this.resetTimer());
      });
    }
    
    logout() {
      if (confirm('⏰ ඔබ දිගු වේලාවක් අක්‍රියව සිටියෙහි. නැවත ලොග් වන්න.')) {
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userEmail');
        window.location.replace('login.html');
      }
    }
    
    showSessionInfo() {
      const email = localStorage.getItem('userEmail');
      if (!email) return;
      
      // Add session info to UI (e.g., next to user display)
      const userDisplay = document.getElementById('user-info-display');
      if (userDisplay) {
        const timeoutMinutes = this.timeout / 60000;
        const sessionSpan = document.createElement('span');
        sessionSpan.id = 'session-timeout-indicator';
        sessionSpan.style.cssText = `
          margin-left: 8px;
          background: #333;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 8px;
          color: #ffd700;
        `;
        sessionSpan.textContent = `⏱️ ${timeoutMinutes}min timeout`;
        userDisplay.appendChild(sessionSpan);
      }
    }
  }
  
  // ==============================================
  // 2. Login History Logger
  // ==============================================
  class LoginHistory {
    constructor() {
      this.userEmail = localStorage.getItem('userEmail');
      if (!this.userEmail) return;
      this.logLogin();
    }
    
    async logLogin() {
      console.log(`🔐 Login recorded for ${this.userEmail} at ${new Date().toISOString()}`);
      
      // Store in localStorage as fallback
      const history = JSON.parse(localStorage.getItem('loginHistory') || '[]');
      history.push({
        email: this.userEmail,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });
      localStorage.setItem('loginHistory', JSON.stringify(history.slice(-10))); // Keep last 10
    }
    
    showHistory() {
      const history = JSON.parse(localStorage.getItem('loginHistory') || '[]');
      if (history.length === 0) return 'No login history';
      
      return history.map(entry =>
        `${new Date(entry.timestamp).toLocaleString()} - ${entry.userAgent.substring(0, 30)}...`
      ).join('<br>');
    }
  }
  
  // ==============================================
  // 3. Security Dashboard Button (Adds to UI)
  // ==============================================
  function addSecurityButton() {
    if (document.getElementById('security-dashboard-btn')) return;
    if (!localStorage.getItem('userLoggedIn')) return;
    
    const btn = document.createElement('div');
    btn.id = 'security-dashboard-btn';
    btn.innerHTML = '🔒';
    btn.title = 'Security Dashboard';
    btn.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 20px;
      width: 40px;
      height: 40px;
      background: #ff3131;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(255,49,49,0.3);
      z-index: 9998;
      border: 2px solid #fff;
    `;
    
    btn.onclick = showSecurityDashboard;
    document.body.appendChild(btn);
  }
  
  function showSecurityDashboard() {
    const history = new LoginHistory().showHistory();
    
    const html = `
      <div style="position:fixed; bottom:130px; right:20px; background:#1a1a1a; border-radius:15px; padding:20px; border:2px solid #ff3131; width:300px; z-index:10000;">
        <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
          <span style="color:#ff3131; font-weight:bold;">🔒 ආරක්ෂක පුවරුව</span>
          <button onclick="this.parentElement.parentElement.remove()" style="background:none; border:none; color:#888; cursor:pointer;">✕</button>
        </div>
        
        <div style="background:#000; border-radius:8px; padding:12px; margin-bottom:15px;">
          <div style="color:#ffd700; font-size:12px; margin-bottom:8px;">📱 Device ID:</div>
          <div style="color:#39ff14; font-size:10px; word-break:break-all;">${localStorage.getItem('bathiXen_device_unique_id') || 'Not set'}</div>
        </div>
        
        <div style="background:#000; border-radius:8px; padding:12px; margin-bottom:15px;">
          <div style="color:#ffd700; font-size:12px; margin-bottom:8px;">📋 අවසන් ලොගින්:</div>
          <div style="color:#aaa; font-size:10px;">${history}</div>
        </div>
        
        <!-- 🚪 සියලුම සැසි අවසන් කරන්න බොත්තම ඉවත් කර ඇත -->
        
      </div>
    `;
    
    // Remove existing dashboard
    const existing = document.querySelector('div[style*="bottom:130px"]');
    if (existing) existing.remove();
    
    document.body.insertAdjacentHTML('beforeend', html);
  }
  
  // ==============================================
  // Initialize modules
  // ==============================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new SessionManager(30);
      new LoginHistory();
      addSecurityButton();
    });
  } else {
    new SessionManager(30);
    new LoginHistory();
    addSecurityButton();
  }
  
})();