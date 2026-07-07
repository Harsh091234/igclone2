#   Instagram Clone 
Instagram is a social media platform that lets users share photos, videos, Stories, and Reels, connect with friends and creators, and discover content based on their interests. It also supports direct messaging.

##  Live Preview
**Site Url:** [https://igclone2-client.vercel.app/](https://igclone2-client.vercel.app/)

## Features
*  **JWT Authentication** – Signup, login, email verification, password reset
*  **Secure Backend** – CSRF protection, rate limiting, and protected APIs
*  **Posts** – Create, edit, delete photo/video posts
* **Likes & Comments** – Engage with posts in real time
* **Stories** – Share 24-hour disappearing stories
*  **Reels** – Upload and explore short-form videos
* **Follow System** – Follow and unfollow users
*  **Real-Time Chat** – Instant messaging with Socket.IO
*  **Notifications** – Real-time alerts for likes, comments, follows, and messages
*  **Search & Explore** – Discover users 
*  **User Profiles** – Custom profiles with posts and follower


## Tech Stacks

* **Frontend** – React.js, Vite, Tailwind CSS, React Router, Redux Toolkit, Axios
* **Backend** – Node.js, Express.js
* **Database** – MongoDB, Redis
* **Authentication** – JWT, bcryptjs
* **Validation** – Zod
* **Real-Time** – Socket.IO
* **Media Storage** – Cloudinary
* **Media Processing** – FFmpeg (Docker), React Easy Crop
* **Security** – CSRF Protection, Rate Limiting,  CORS
* **Monorepo** – Turborepo
* **Containerization** – Docker
* **Deployment** – Vercel, Render

### 🧰 Development Tools
- **Build Tool:** Vite  
- **Package Manager:** pnpm  

## Screenshots
![Screenshot 1](/client/public/Screenshots/s1.png)
![Screenshot 2](/client/public/Screenshots/s2.png)
![Screenshot 3](/client/public/Screenshots/s3.png)
![Screenshot 4](/client/public/Screenshots/s4.png)
![Screenshot 5](/client/public/Screenshots/s5.png)
![Screenshot 6](/client/public/Screenshots/s6.png)
![Screenshot 7](/client/public/Screenshots/s7.jpg)



## Getting Started


### Prerequisites
- Node.js (version specified in package.json)
- pnpm 
- MongoDB database (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Harsh091234/igclone2.git
   cd click-an-cart
   ```

2. **Build project**

   ```bash
   # for client
    cd client
    pnpm install

   # for server
   cd client
   pnpm install
   docker build -t <tag_name>
   ```

### Running the Application

#### Development Mode (Live Preview)

1. **Start the Backend Server**
   ```bash
   cd server
   docker run --env-file .env -p 4000:4000 --name igclone_server <tag_name>
   ```

2. **Start the Frontend Development Server**
   ```bash
   cd client
   pnpm dev
   ```

3. **Access the Application**
   - Open your browser and navigate to `http://localhost:5173`
