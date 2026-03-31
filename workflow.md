# 🧠 Project Technical Workflow

Welcome! If you are reading this, you probably want to learn *how* this Real-Time Process Monitoring Dashboard actually works under the hood. This document breaks down the core architecture, data flow, and the logic that powers the entire application.

By understanding this workflow, you can learn how web applications interact directly with the lower-level operating system.

---

## 🏗️ 1. The Architecture (Client-Server Model)

This project strictly follows a **Client-Server Architecture**. 
- **The Client (Frontend):** A React application built with Next.js. It runs in the user's web browser and is responsible for rendering the beautiful charts and dashboard you see.
- **The Server (Backend):** A Node.js application built with Express. It runs directly on the host operating system (your computer) and has special permissions to read system hardware data.

Because a web browser (Client) is sandboxed for security reasons, it *cannot* directly ask your computer for its CPU usage or list of processes. That's why we need the Server. The Client asks the Server, and the Server asks the Operating System.

## 🔄 2. The Data Flow Pipeline

Here is exactly what happens every 2 seconds when you have the dashboard open:

1. **The Poller (Frontend):** Inside `useProcessSimulation.ts`, a React `useEffect` hook sets up a `setInterval`. Every 2 seconds (2000ms), it triggers an asynchronous JavaScript `fetch()` request.
2. **The Request:** The browser sends two HTTP GET requests over the local network to `http://localhost:3001/api/system` and `http://localhost:3001/api/processes`.
3. **The System Query (Backend):** Inside `server.js`, Express receives the requests. It uses the `systeminformation` (`si`) package to execute low-level operating system commands.
    - On Linux, this involves reading files from the `/proc` directory.
    - On macOS, this involves running native C-level library calls like `sysctl`, `ps`, and `top`.
4. **The Response:** The backend gathers this raw, messy data, packages it up cleanly into a JSON (JavaScript Object Notation) format, and sends it back to the browser.
5. **The UI Update (Frontend):** The React frontend receives the JSON string, parses it into Javascript objects, and maps it via `setSystemMetrics` and `setProcesses`. React detects the state change and instantaneously redraws the charts (like the Recharts line graphs) to reflect the new numbers.

## 🔪 3. Managing Processes (Cross-Platform)

The most "OS-centric" feature of this project is the ability to kill, pause, or resume host computer processes straight from a button click on the web page. This is handled gracefully across Windows, macOS, and Linux!

Here is how that works:
1. When you click "Kill" on Process ID `1234`, the frontend fires a `POST` request to `http://localhost:3001/api/processes/1234/kill`.
2. The Node.js backend receives this request and dynamically checks your host Operating System (`process.platform`).
3. **On Linux/macOS:** The backend executes `process.kill(1234, 'SIGTERM')`. `SIGTERM` is a POSIX standard operating system signal that politely tells the process "Please terminate yourself."
4. **On Windows:** Since Windows does not natively support POSIX signals, the backend automatically falls back to forcefully executing the native Windows command `taskkill /PID 1234 /F`.
5. When you click "Pause" or "Resume" on Linux/macOS, the backend sends `SIGSTOP` (freeze process execution) or `SIGCONT`. On Windows, the dashboard politely lets you know that native pausing is unsupported.

## 🚀 4. Summary for Learning

If you modify and play with this codebase, you will learn:
* **Operating Systems:** How POSIX signals work (`SIGTERM`, `SIGSTOP`) and how kernel telemetry (CPU, RAM) can be queried.
* **Backend Dev:** How to write a REST API using Express and Node.js.
* **Frontend Dev:** How to use React Hooks (`useState`, `useEffect`) to manage state and fetch real-time data on an interval loop.

*Be sure to read the generously commented code in `Backened/server.js` and `Frontend/src/hooks/useProcessSimulation.ts` to see exactly where these concepts are applied!*
