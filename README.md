# **Fairway Finder**
https://fairway-finder-tawny.vercel.app/

## **Project Overview**
**Fairway Finder** is a web application designed to help golfers locate courses, view details, and track rounds. The app currently runs as a static website using **Live Server**, with course data stored in local JSON files.

## **Features**
- 🏌️ **Display golf courses** on an interactive map.
- 📍 **View course details**, including location, par, and difficulty.
- 🔍 **Search and filter** golf courses.
- ⚡ **Simple and lightweight** front-end setup.

## **Tech Stack**
- **Frontend:** HTML, CSS, JavaScript
- **Data Storage:** Local JSON files
- **Hosting (Current):** Live Server (for local development)

## **Installation & Setup**
### **Prerequisites**
- Install [**VS Code**](https://code.visualstudio.com/) or another text editor.
- Install the **Live Server** extension in VS Code.

### **Steps to Run Locally**
1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/fairway-finder.git
   cd fairway-finder
   ```
2. **Open the project folder** in VS Code.
3. **Start Live Server** by right-clicking `index.html` and selecting **Open with Live Server**.
4. The app will open in your **default browser**.

## **Deployment Options**
### **Option 1: Netlify/Vercel (Static Hosting)**
✅ **Best for static JSON data.**
- Steps:
  - Push your project to **GitHub**.
  - Connect the repo to **Netlify** or **Vercel**.
  - Deploy with **one click**.

### **Option 2: Render/Railway (API Backend)**
✅ **Required if you plan to serve data dynamically.**
- Steps:
  - Set up a **Node.js + Express** server.
  - Deploy the server on **Render** or **Railway**.
  - Fetch course data from an **API instead of local JSON**.

## **Future Improvements**
- 🔄 **Migrate data storage** from JSON files to a database (**MongoDB Atlas**).
- 🔑 **Implement user authentication** and profile tracking.
- ⭐ **Add user-submitted reviews** for courses.
- 🎨 **Improve UI/UX** with animations and styling.

## **Contributing**
If you want to contribute:
- **Fork** the repository.
- **Create a feature branch** (`git checkout -b feature-name`).
- **Commit your changes** (`git commit -m "Added new feature"`).
- **Push to your fork** and submit a **PR (Pull Request)**.

## **License**
This project is licensed under the **MIT License**.

