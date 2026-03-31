# 🚀 Real-Time Process Monitoring Dashboard

Hey there! Welcome to the **Real-Time Process Monitoring Dashboard**. If you've ever wanted a sleek, modern, and highly visual way to see exactly what your computer is up to right now—you're in the right place. (Plus, it makes for a fantastic OS college assignment 😉).

This project wasn't just built to look cool; it actually hooks directly into your machine's hardware and operating system to give you live, down-to-the-second metrics.

## 🤔 What does this project do?
At its core, this is a web-based task manager on steroids. It gives you a beautiful, graphical interface to monitor your computer's health and processes in real time. 

Here are some of the main things you can do with it:
* **View Live CPU & Memory Usage:** Watch your machine's processor and RAM consumption fluctuate in real time with smooth, interactive charts.
* **Track Network Traffic:** See your incoming and outgoing data speeds.
* **See Real Device Processes:** Yep! This isn't just dummy data—the dashboard shows the actual apps and background processes currently running on your computer. 
* **Manage Processes (Cross-Platform):** See a rogue process eating all your CPU? You can click "Kill Process" right from the dashboard! The backend dynamically detects if you are on Windows, macOS, or Linux, and executes the perfect native OS command (like `taskkill` or `SIGTERM`) to securely terminate it.

## ⚙️ How does it work?
The project is split into two halves that talk to each other constantly:

1. **The Backend (Express & Node.js):** 
   Located in the `Backened/` folder, this is the brain of the operation. It uses an incredibly handy Node.js library called `systeminformation` to securely query your operating system. Every few seconds, it asks your computer: *"Hey, what's your CPU load? How much RAM is free? Give me a list of all your active processes."* It then exposes this data through a custom REST API (`/api/system` & `/api/processes`).

2. **The Frontend (Next.js & React):**
   Located in the `Frontend/` folder, this is the pretty face of the project. Built with Next.js, Tailwind CSS, and Recharts, it constantly fetches data from the backend API. It takes raw, boring numbers and turns them into glassmorphism cards, circular gauges, and smooth line charts. 

When you click "Kill" on a process in the UI, the frontend shoots a quick `POST` request to the backend with the Process ID (PID), and the backend runs a native command to terminate it.

## 🛠️ How to Install and Run
I have set this up to be as effortless as possible to run. No more opening three different terminal tabs! 

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Step 1: Install everything
Open your terminal, navigate to this main `OS_Project` folder, and install the required dependencies.

```bash
# Navigate to the project folder
cd OS_Project

# Install concurrently (the magic package that runs everything together)
npm install

# Install the dependencies for both the Backend and Frontend
npm run install-all
```

### Step 2: Start the Dashboard!
Once everything is installed, you only ever need to run one command from the main folder:

```bash
npm start
```
*That's it!* This command will automatically boot up the backend API on port `3001` and launch the beautiful Next.js frontend on port `3000`.

### Step 3: View it
Open your favorite web browser and go to:
👉 **[http://localhost:3000](http://localhost:3000)**

## 💻 Does this actually show MY device's processes?
**Absolutely.** Everything you see on the screen—the CPU jumps, the RAM allocation, and the list of active processes (like Chrome, Visual Studio Code, kernel_task, etc.)—is 100% real data pulled straight from the computer you are running the `npm start` command on. 

Have fun, and be careful not to kill any critical system processes! 😅
