const express = require('express');
const path = require('path');
const cors = require('cors');
const si = require('systeminformation');
const app = express();

// Set the port. We use 3001 to avoid conflicting with the Next.js frontend which uses 3000.
const PORT = process.env.PORT || 3001;

// --- MIDDLEWARE ---
// CORS (Cross-Origin Resource Sharing) allows the React frontend on port 3000 to securely request data from this backend on port 3001.
app.use(cors());
// express.json() allows our server to automatically parse incoming request bodies as JSON objects.
app.use(express.json());
// ==== REAL-TIME OS TELEMETRY API Routes ====
// These endpoints power the actual Dashboard. They act as a bridge between the web browser and the machine's Operating System.

// 1. Fetch System Telemetry (CPU, Memory, Network)
app.get('/api/system', async (req, res) => {
  try {
    // Promise.all runs all these OS system information queries simultaneously instead of waiting for each one individually, saving time!
    const [cpu, mem, network, time, osInfo] = await Promise.all([
      si.currentLoad(), // Queries current CPU load. Under the hood, this might read /proc/stat on Linux or use sysctl on macOS.
      si.mem(), // Queries RAM usage.
      si.networkStats(), // Queries bytes sent/received by the network interface.
      si.time(), // Gets system uptime.
      si.osInfo() // Detects OS architecture.
    ]);
    res.json({ cpu, mem, network: network[0] || {}, time, osInfo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Fetch Active Processes
app.get('/api/processes', async (req, res) => {
  try {
    // Fetches the active process tree of the computer (similar to the 'top' or 'ps' command in terminal).
    const processes = await si.processes();
    res.json(processes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Kill a Process (Cross-Platform)
app.post('/api/processes/:pid/kill', (req, res) => {
  const pid = parseInt(req.params.pid, 10);
  try {
    if (process.platform === 'win32') {
      // Windows doesn't handle POSIX signals well natively, gracefully fallback to taskkill
      const { execSync } = require('child_process');
      execSync(`taskkill /PID ${pid} /F`);
    } else {
      // POSIX systems (Linux/macOS)
      process.kill(pid, 'SIGTERM');
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Pause a Process (Linux/macOS only)
app.post('/api/processes/:pid/pause', (req, res) => {
  const pid = parseInt(req.params.pid, 10);
  try {
    if (process.platform === 'win32') {
      return res.status(400).json({ error: 'Pause (SIGSTOP) is not natively supported on Windows.' });
    }
    // SIGSTOP forces the OS scheduler to freeze the process completely.
    process.kill(pid, 'SIGSTOP');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Resume a Process (Linux/macOS only)
app.post('/api/processes/:pid/resume', (req, res) => {
  const pid = parseInt(req.params.pid, 10);
  try {
    if (process.platform === 'win32') {
      return res.status(400).json({ error: 'Resume (SIGCONT) is not natively supported on Windows.' });
    }
    // SIGCONT tells the OS scheduler to resume executing a previously paused process.
    process.kill(pid, 'SIGCONT');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Real-Time API successfully listening on port ${PORT}! React app can now connect.`);
});
