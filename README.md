# 🍕 Resto-Chain - Real-Time Restaurant Order Management

<div align="center">

![Restaurant](https://img.shields.io/badge/Restaurant-Management-orange?style=for-the-badge)
![Real-time](https://img.shields.io/badge/Real--time-Socket.IO-green?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue?style=for-the-badge)

**A modern, full-stack restaurant ordering system with real-time order tracking and management.**

· · · [Live Demo](https://resto-chain.vercel.app) · · ·

</div>

---

## 🌟 Features

### 🛒 Customer Experience

- **Browse Menu** - Categorized menu with real-time availability
- **Cart** - Add items, customize quantities, instant price calculations
- **Order Tracking** - Real-time order status updates via Socket.IO
- **Order History** - View all past orders with detailed breakdowns
- **User Profiles** - Manage personal info and delivery addresses
- **Secure Auth** - JWT-based authentication with persistent sessions

### 👨‍💼 Admin Dashboard

- **Order Management** - Accept, prepare, and deliver orders with one click
- **Menu Control** - Add, edit, delete menu items and categories
- **Customer Insights** - View customer data and order history
- **Real-time Notifications** - Instant alerts for new orders
- **Status Workflow** - Streamlined order lifecycle management
- **Analytics Ready** - Built.

### ⚡ Real-Time Features

- **Socket.IO Integration** - Instant bi-directional communication
- **Live Order Updates** - Customers see status changes instantly
- **Auto-reconnection** - Resilient connection management
- **Room-based Events** - Efficient targeted messaging

---

## 🛠️ Tech Stack

### Frontend

```typescript
⚛️  React 18 + TypeScript
🎨  Tailwind CSS
🚀  Vite
🔄  React Router v6
📦  Zustand (State Management)
🌐  Axios
🔌  Socket.IO Client
```

### Backend

```typescript
🟢  Node.js + Express
📘  TypeScript
🍃  MongoDB + Mongoose
🔐  JWT Authentication
🔌  Socket.IO Server
🍪  Cookie-based Sessions
```

### Deployment

```bash
🎯  Vercel (Frontend)
🚂  Render (Backend)
☁️  MongoDB Atlas (Database)
```

---

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│                 │         │                  │         │                 │
│  Customer App   │◄───────►│   Backend API    │◄───────►│  MongoDB Atlas  │
│  (React SPA)    │         │  (Express + TS)  │         │   (Database)    │
│                 │         │                  │         │                 │
└────────┬────────┘         └─────────┬────────┘         └─────────────────┘
         │                            │
         │      Socket.IO (WS)        │
         │◄──────────────────────────►│
         │                            │
┌────────▼────────┐         ┌─────────▼────────┐
│                 │         │                  │
│  Admin Panel    │◄───────►│   Real-time      │
│  (React SPA)    │         │   Event System   │
│                 │         │                  │
└─────────────────┘         └──────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **yarn**
- **MongoDB** (local or Atlas)

### 1. Clone the Repository

```bash
git clone https://github.com/Prince-Vaviya/resto-chain.git
cd resto-chain
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cat > .env << EOL
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
MONGODB_URI=mongodb://localhost:27017/resto-chain
PORT=3001
FRONTEND_URL=http://localhost:5173
EOL

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Create .env file (optional for local dev)
echo "VITE_API_URL=http://localhost:3001/api" > .env

# Start development server
npm run dev
```

### 4. Access the Application

- **Customer App**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin/login
- **Backend API**: http://localhost:3001/api

### 🎯 Demo Credentials

**Customer Login:**

```
Email: customer@example.com
Password: customer123
```

**Admin Login:**

```
Email: admin@example.com
Password: admin123
```

> **Note:** Make sure you have these demo accounts created in your database for testing.

---

## 📦 Environment Variables

### Backend (.env)

| Variable         | Description                | Example                                 |
| ---------------- | -------------------------- | --------------------------------------- |
| `JWT_SECRET`     | Secret key for JWT signing | `your-secret-key-here`                  |
| `JWT_EXPIRES_IN` | Token expiration time      | `7d`                                    |
| `MONGODB_URI`    | MongoDB connection string  | `mongodb://localhost:27017/resto-chain` |
| `PORT`           | Server port                | `3001`                                  |
| `FRONTEND_URL`   | Frontend URL for CORS      | `http://localhost:5173`                 |

### Frontend (.env)

| Variable       | Description     | Example                     |
| -------------- | --------------- | --------------------------- |
| `VITE_API_URL` | Backend API URL | `http://localhost:3001/api` |

---

## 🎨 Key Features Breakdown

### 🔐 Authentication System

- **JWT Tokens** - Secure, stateless authentication
- **HTTP-only Cookies** - XSS protection
- **Bearer Tokens** - For cross-origin requests
- **Auto Token Refresh** - Seamless user experience
- **Role-based Access** - Customer vs Admin separation

**Implementation:**

```typescript
// Request interceptor auto-attaches JWT token
api.interceptors.request.use((config) => {
  const token = getTokenFromStorage();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 🔄 Real-Time Order Updates

**Customer Side:**

```typescript
socket.emit("join_room", `customer_${userId}`);
socket.on("order_status_updated", (order) => {
  // Update UI instantly
  updateOrderInState(order);
});
```

**Admin Side:**

```typescript
// When admin updates order status
await api.put(`/orders/${orderId}/status`, { status });
// Backend emits to customer
io.to(`customer_${customerId}`).emit("order_status_updated", order);
```

### 🎯 State Management

**Zustand Stores:**

- `authStore` - User authentication & profile
- `menuStore` - Menu items & categories
- `cartStore` - Shopping cart with persistence

**Benefits:**

- ✅ No Redux boilerplate
- ✅ TypeScript-first
- ✅ Middleware support (persist)
- ✅ Small bundle size (~1KB)

---

## 🗂️ Project Structure

```
resto-chain/
├── backend/
│   ├── src/
│   │   ├── config/           # Database, environment config
│   │   ├── controllers/      # Request handlers
│   │   ├── middlewares/      # Auth, error handling
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API routes
│   │   ├── utils/            # Helper functions
│   │   ├── app.ts            # Express app setup
│   │   └── server.ts         # Server + Socket.IO
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── components/       # Reusable UI components
    │   ├── layouts/          # Customer & Admin layouts
    │   ├── lib/              # API client, Socket.IO
    │   ├── pages/            # Route pages
    │   │   ├── admin/        # Admin dashboard pages
    │   │   └── auth/         # Login/Register
    │   ├── store/            # Zustand stores
    │   ├── App.tsx           # Route configuration
    │   └── main.tsx          # App entry point
    ├── package.json
    ├── vercel.json           # Vercel deployment config
    └── tailwind.config.js    # Tailwind CSS config
```

---

## 🚢 Deployment Guide

### Frontend (Vercel)

1. **Connect GitHub Repository**

   ```bash
   # Vercel will auto-detect Vite
   Framework Preset: Vite
   Root Directory: frontend
   ```

2. **Environment Variables**

   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

3. **Build Settings**
   ```bash
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

### Backend (Render)

1. **Create Web Service**

   ```bash
   Environment: Node
   Root Directory: backend
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

2. **Environment Variables**
   ```
   JWT_SECRET=your-production-secret
   JWT_EXPIRES_IN=7d
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/resto-chain
   PORT=3001
   FRONTEND_URL=https://resto-chain.vercel.app
   ```

### Database (MongoDB Atlas)

1. Create cluster (M0 Free or higher)
2. Whitelist Render's IP or use `0.0.0.0/0` (allow all)
3. Create database user
4. Get connection string
5. Add to Render environment variables

---

## 🎯 API Endpoints

### Authentication

```
POST   /api/auth/register          - Register customer
POST   /api/auth/login             - Login customer
POST   /api/auth/logout            - Logout customer
PUT    /api/auth/profile           - Update profile
GET    /api/auth/customers         - Get all customers (admin)

POST   /api/admin/auth/login       - Admin login
POST   /api/admin/auth/logout      - Admin logout
```

### Menu

```
GET    /api/menu/categories        - Get all categories
POST   /api/menu/categories        - Create category (admin)
PUT    /api/menu/categories/:id    - Update category (admin)
DELETE /api/menu/categories/:id    - Delete category (admin)

GET    /api/menu/items             - Get all menu items
POST   /api/menu/items             - Create menu item (admin)
PUT    /api/menu/items/:id         - Update menu item (admin)
DELETE /api/menu/items/:id         - Delete menu item (admin)
```

### Orders

```
POST   /api/orders                 - Create order
GET    /api/orders/myorders        - Get customer orders
GET    /api/orders                 - Get all orders (admin)
PUT    /api/orders/:id/status      - Update order status (admin)
```

---

## 🎨 UI/UX Highlights

### Design System

- **Modern Aesthetics** - Clean, minimalist interface
- **Smooth Animations** - Framer Motion-ready
- **Responsive Design** - Mobile-first approach
- **Dark Mode Ready** - Structured for easy theming
- **Accessible** - ARIA labels, keyboard navigation

### Color Palette

```css
Primary:   #000000 (Black)
Secondary: #FFFFFF (White)
Accent:    #F97316 (Orange)
Success:   #22C55E (Green)
Warning:   #EAB308 (Yellow)
Error:     #EF4444 (Red)
```

### Components

- ✨ Glassmorphism cards
- 🎯 Smooth hover effects
- 📱 Bottom sheet modals
- 🔔 Toast notifications (ready)
- ⚡ Skeleton loaders

---

## 🧪 Testing (Coming Soon)

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

---

## 🐛 Known Issues & Roadmap

### Known Issues

- [ ] Socket.IO may disconnect on Render free tier sleep
- [ ] Image uploads not implemented (using emojis)

### Roadmap

- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Email notifications (SendGrid)
- [ ] SMS alerts for order updates
- [ ] Admin analytics dashboard
- [ ] Multi-restaurant support
- [ ] Delivery partner assignment
- [ ] Rating & review system
- [ ] Promotional codes & discounts
- [ ] Push notifications (PWA)
- [ ] Mobile apps (React Native)

---

## 🤝 Contributing

Contributions are what make the open-source community amazing! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 Best Practices Used

### Code Quality

- ✅ TypeScript strict mode
- ✅ ESLint + Prettier
- ✅ Consistent naming conventions
- ✅ Modular architecture
- ✅ DRY principles

### Security

- ✅ JWT with HTTP-only cookies
- ✅ Password hashing (bcrypt)
- ✅ CORS configuration
- ✅ Input validation
- ✅ XSS protection

### Performance

- ✅ Code splitting (React lazy)
- ✅ WebSocket over polling
- ✅ Optimistic UI updates
- ✅ Debounced search (ready)
- ✅ Persistent state (Zustand)

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Prince Vaviya**

- GitHub: [@Prince-Vaviya](https://github.com/Prince-Vaviya)
- Project Link: [https://github.com/Prince-Vaviya/resto-chain](https://github.com/Prince-Vaviya/resto-chain)

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [Socket.IO](https://socket.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Vercel](https://vercel.com/)
- [Render](https://render.com/)

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

Made with ❤️ and ☕ by Prince Vaviya

</div>
