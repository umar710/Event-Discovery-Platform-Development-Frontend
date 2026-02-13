# Event Discovery Platform - Frontend

Live App: `https://event-discovery-platform-developmen-seven.vercel.app/events`

## 🚀 Quick Start

```bash
# Clone & install
git clone <your-repo>
cd client
npm install

# Set up environment (.env)
REACT_APP_API_URL=https://event-discovery-platform-development.onrender.com

# Start development server
npm start
```

## ✨ Features

- **User Authentication** - Login/Register with JWT
- **Event Discovery** - Browse events in responsive grid
- **Search & Filter** - Search by name, filter by category/location
- **Event Details** - View full event info with seat availability
- **Registration** - One-click register with capacity check
- **Dashboard** - View upcoming/past registrations, cancel bookings
- **Toast Notifications** - User-friendly feedback for all actions

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/events` | Browse all events |
| `/event/:id` | Event details & registration |
| `/dashboard` | User's registrations (private) |
| `/login` | User login |
| `/register` | New user registration |

## 🛠️ Tech Stack

- React.js (Hooks)
- React Router v6
- Context API (State management)
- Axios (HTTP client)
- Tailwind CSS (Styling)
- React Hot Toast (Notifications)
- date-fns (Date formatting)
- React Icons
- Vercel (Deployment)

## 📁 Folder Structure

```
client/
├── src/
│   ├── components/     # Navbar, EventCard, PrivateRoute
│   ├── pages/          # Events, EventDetails, Dashboard, Login, Register
│   ├── context/        # AuthContext.js
│   ├── App.js          # Routes setup
│   └── index.js
├── .env                # Environment variables
└── package.json
```

## 🔐 Authentication Flow

1. User registers/logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Token added to all API requests
5. Auth context provides user state globally

## 🌐 API Connection

The app connects to: `https://event-discovery-platform-development.onrender.com`

For local development, update `.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```

## 📦 Build for Production

```bash
npm run build
```

## ☁️ Deploy to Vercel

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variable `REACT_APP_API_URL`
4. Deploy!
