# Task Management System - Frontend

A modern, responsive React-based frontend for the Task Management System built with TypeScript, Vite, and Tailwind CSS.

## 🚀 Tech Stack

- **React 18** - Latest version with hooks and context
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Query (TanStack Query)** - Server state management
- **React Router DOM** - Client-side routing
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Zustand** - State management

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (Radix-based)
│   ├── layouts/         # Layout components
│   └── molecules/       # Complex components
├── hooks/               # Custom React hooks
├── pages/               # Page components
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Dashboard pages
│   └── admin/          # Admin panel pages
├── services/           # API service layer
├── stores/             # State management (Zustand)
├── types/              # TypeScript type definitions
├── lib/                # Utility functions
└── styles/             # Global styles
```

## 🔧 Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <https://github.com/Paskab012/fe_task_management_system.git>
   cd fe_task_management_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:3000/api/v1
   VITE_APP_NAME=Task Management System
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 🔐 Role-Based Access Control (RBAC) Implementation

The frontend implements comprehensive RBAC with the following user roles:

### 🦸‍♂️ Super Admin
- **Full system access**
- Create, edit, delete users, boards, and tasks
- Manage user roles and organization settings
- Access to all system features

### 👨‍💼 Admin
- **Organization-level management**
- Create, edit, delete boards and tasks within their organization
- Assign tasks to users
- Manage organization members

### 👤 User
- **Limited access to assigned content**
- View and update only their assigned tasks
- View public boards and organization boards
- Cannot create or delete content

### 👥 Guest
- **Read-only public access**
- View only public boards
- No access to tasks or management features
- Limited UI functionality

## 📄 Core Pages Implemented

### Authentication Pages
- **Login Page** (`/auth/login`)
  - Email/password authentication
  - Role-based redirect after login
  - Form validation with Zod schemas

- **Register Page** (`/auth/register`)
  - User registration form
  - Input validation and error handling

### Dashboard Pages
- **Main Dashboard** (`/dashboard`)
  - Role-specific welcome screen
  - Quick stats and recent activity
  - Navigation to main features

- **User Dashboard** (`/dashboard/tasks`)
  - Lists user's assigned tasks
  - Task status management
  - Filter and search functionality

- **Boards Management** (`/dashboard/boards`)
  - Board listing with role-based visibility
  - Create, edit, delete boards (admin only)
  - Board member management

- **User Management** (`/dashboard/users`)
  - User CRUD operations (admin/super admin only)
  - Role assignment
  - User status management

### Guest Access
- **Public Boards View**
  - Frontend filtering for guest users
  - Only displays boards with `visibility: "public"`
  - Limited interaction capabilities

## 🛡️ Security Features

### Authentication & Authorization
- **JWT Token Management**
  - Secure token storage in memory
  - Automatic token refresh
  - Protected route handling

- **Route Protection**
  - `ProtectedRoute` component for authenticated pages
  - Role-based route access
  - Automatic redirect for unauthorized access

### Data Security
- **Input Validation**
  - Zod schemas for form validation
  - Frontend and backend validation
  - XSS protection through proper escaping

- **API Security**
  - Automatic auth header injection
  - Request/response interceptors
  - Error handling and user feedback

## 🎨 UI/UX Features

### Design System
- **Consistent Component Library**
  - Radix UI primitives for accessibility
  - Custom design tokens with Tailwind
  - Dark mode support

### Responsive Design
- **Mobile-First Approach**
  - Breakpoint-based layouts
  - Touch-friendly interactions
  - Adaptive navigation

### User Experience
- **Loading States**
  - Skeleton screens during data fetching
  - Loading spinners for actions
  - Progressive loading

- **Error Handling**
  - Toast notifications for feedback
  - Error boundaries for crash recovery
  - Graceful degradation

### Accessibility
- **WCAG Compliance**
  - Keyboard navigation support
  - Screen reader compatibility
  - Focus management
  - Color contrast compliance

## 🔄 State Management

### Global State (Zustand)
- **Auth Store** - User authentication state
- **Theme Store** - Dark/light mode preferences

### Server State (React Query)
- **Caching Strategy** - Intelligent data caching
- **Background Updates** - Automatic data synchronization
- **Optimistic Updates** - Immediate UI feedback

## 📱 Responsive Features

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

### Adaptive Components
- Navigation transforms to mobile menu
- Card layouts adjust to screen size
- Forms optimize for touch input

## 🚀 Performance Optimizations

### Code Splitting
- Route-based code splitting
- Component lazy loading
- Dynamic imports for heavy components

### Bundle Optimization
- Tree shaking for unused code
- Asset optimization with Vite
- Compression and minification

## 🧪 Available Scripts

```bash
# Development
yarn run dev          # Start dev server
yarn run build        # Build for production
yarn run preview      # Preview production build

## 🔧 Configuration

### Vite Configuration
- TypeScript support
- Path aliases for imports
- Asset optimization
- Development proxy setup

### Tailwind Configuration
- Custom color palette
- Extended spacing scale
- Component-specific utilities
- Dark mode support

### ESLint Configuration
- TypeScript-aware rules
- React-specific linting
- Accessibility checks
- Code formatting standards

## 🐛 Debugging

### Development Tools
- React Developer Tools
- Redux DevTools (for Zustand)
- Network request monitoring
- Console error tracking

### Common Issues
1. **API Connection Issues**
   - Check VITE_API_URL environment variable
   - Verify backend server is running
   - Check CORS configuration

2. **Authentication Problems**
   - Clear browser storage
   - Check token expiration
   - Verify API endpoints

## 🔮 Future Enhancements

### Planned Features
- Real-time notifications with WebSocket
- Advanced task filtering and sorting
- File attachment support
- Team collaboration features
- Advanced reporting dashboard

### Performance Improvements
- Service worker for offline support
- Virtual scrolling for large lists
- Image optimization and lazy loading
- CDN integration for assets

## 🤝 Contributing

### Development Guidelines
1. Follow TypeScript strict mode
2. Use functional components with hooks
3. Implement proper error boundaries
4. Write accessible components
5. Follow naming conventions
6. Add proper TypeScript types

### Code Style
- Use Prettier for formatting
- Follow ESLint rules
- Use semantic commit messages
- Write self-documenting code

## 📞 Support

For technical issues or questions:
1. Check the troubleshooting guide
2. Review console errors
3. Verify environment configuration
4. Contact the development team

---

Built with ❤️ by PasKab_dev using modern React best practices and industry-standard tools.