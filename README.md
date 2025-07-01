# 🏢 Check-in Check-out System

A modern, beautiful, and responsive check-in/check-out system built with React, TypeScript, Vite, and Ant Design.

## ✨ Features

- **Modern UI/UX**: Beautiful gradient designs and smooth animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Real-time Clock**: Live time display with automatic updates
- **Dashboard Analytics**: Comprehensive statistics and charts
- **User Authentication**: Secure login system with form validation
- **Check-in/Check-out**: Easy time tracking with location and notes
- **Employee Management**: View and manage employee attendance
- **Reports**: Detailed attendance reports and analytics

## 🚀 Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **UI Library**: Ant Design 5
- **Routing**: React Router DOM 6
- **Styling**: CSS3 with custom animations
- **Date/Time**: Day.js

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd checkin-checkout-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── Login.tsx          # Login component
│   ├── checkin/
│   │   └── CheckInCheckOut.tsx # Check-in/Check-out component
│   ├── dashboard/
│   │   └── Dashboard.tsx      # Dashboard with analytics
│   └── layout/
│       ├── Header.tsx         # Application header
│       ├── Sidebar.tsx        # Navigation sidebar
│       └── MainLayout.tsx     # Main layout wrapper
├── App.tsx                    # Main application component
├── main.tsx                   # Application entry point
└── index.css                  # Global styles
```

## 🎨 Design Features

### Color Scheme
- **Primary**: Gradient from `#667eea` to `#764ba2`
- **Success**: `#52c41a` (Green)
- **Warning**: `#faad14` (Orange)
- **Error**: `#ff4d4f` (Red)
- **Info**: `#1890ff` (Blue)

### Animations
- **Fade In**: Smooth entrance animations for cards
- **Slide In**: Sidebar slide-in effect
- **Hover Effects**: Interactive button and card hover states
- **Pulse**: Attention-grabbing pulse animations

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## �� Configuration

### Environment Variables
The application uses environment variables for API configuration. Create a `.env` file in the root directory:

```bash
# Copy env.example to .env
cp env.example .env

# Edit .env file with your API configuration
VITE_API_BASE_URL=http://localhost:8080
```

For production deployment, update the API URL:
```bash
VITE_API_BASE_URL=https://your-production-api.com
```

### Vite Configuration
The project uses Vite for fast development and building. Configuration is in `vite.config.ts`:

- **Port**: 3000
- **Auto-open**: Enabled
- **Alias**: `@` points to `src/`
- **Source maps**: Enabled for production

### Ant Design Theme
Custom theme configuration in `App.tsx`:

```typescript
theme={{
  token: {
    colorPrimary: '#667eea',
    borderRadius: 8,
  },
}}
```

## 📱 Usage

### Login
1. Enter your username and password
2. Click "Sign In" or use social login options
3. You'll be redirected to the dashboard

### Dashboard
- View real-time statistics
- Monitor employee attendance
- Check weekly progress charts
- See recent activity

### Check-in/Check-out
1. Navigate to "Check-in/Check-out" from sidebar
2. Click "Check In" to start your work day
3. Add location and optional notes
4. Click "Check Out" when leaving
5. View your working hours and status

## 🎯 Key Components

### Login Component
- Beautiful gradient background
- Form validation
- Social login options
- Remember me functionality

### Dashboard Component
- Statistics cards with gradients
- Progress charts
- Recent activity table
- Responsive grid layout

### CheckInCheckOut Component
- Real-time clock display
- Status indicators
- Modal confirmations
- Working hours calculation

### Layout Components
- Collapsible sidebar
- User dropdown menu
- Responsive design
- Smooth animations

## 🔒 Security Features

- Form validation
- Password visibility toggle
- Session management
- Protected routes

## 🌟 Performance Optimizations

- **Code Splitting**: Automatic with Vite
- **Tree Shaking**: Unused code elimination
- **Fast Refresh**: Instant updates during development
- **Optimized Builds**: Production-ready bundles

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel/Netlify
1. Connect your repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Ant Design** for the beautiful UI components
- **Vite** for the fast build tool
- **React** for the amazing framework
- **TypeScript** for type safety

---

Made with ❤️ using modern web technologies
