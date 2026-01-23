# SwapConnect Frontend

<div align="center">

**Modern Device Swapping & Marketplace Platform**

Built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Building](#-building)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## 🎯 Overview

SwapConnect Frontend is a modern, responsive web application that enables users to:

- **Buy** quality tech devices at competitive prices
- **Sell** their used devices to a wide audience
- **Swap** devices with other users directly
- **Trade-in** old devices for instant valuations

Built with cutting-edge technologies and best practices, this application provides a seamless, fast, and secure user experience.

---

## ✨ Features

### Core Features

- 🛍️ **Product Marketplace**: Browse thousands of tech devices
- 🔄 **Device Swapping**: Exchange devices with other users
- 💰 **Wallet System**: Manage funds, deposits, and withdrawals
- 📊 **Dashboard**: Track orders, products, and bids
- 🔍 **Advanced Search**: Filter by category, price, brand, and more
- 💳 **Secure Checkout**: Multi-step checkout with payment integration
- 📱 **Trade-In Calculator**: Get instant device valuations
- 🔔 **Real-time Notifications**: Stay updated on orders and messages
- ⭐ **Reviews & Ratings**: Rate products and sellers
- 🎯 **Bid System**: Make offers on products

### Technical Features

- ⚡ **Server-Side Rendering**: Fast initial page loads with Next.js
- 🎨 **Dark Mode**: Complete theme system with CSS variables
- 📱 **Responsive Design**: Mobile-first, works on all devices
- 🔒 **Authentication**: Secure Firebase authentication
- 🌐 **API Integration**: RESTful API with React Query
- 🎭 **Smooth Animations**: Framer Motion for delightful UX
- 📊 **Error Tracking**: Bugsnag integration for monitoring
- 🔄 **Real-time Updates**: Socket.io for live features
- ♿ **Accessible**: WCAG 2.1 AA compliant (in progress)
- 🌍 **SEO Optimized**: Meta tags and structured data

---

## 🛠️ Tech Stack

### Core

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript 5.9](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4.1](https://tailwindcss.com/)
- **UI Library**: [React 19](https://react.dev/)

### State Management

- **Global State**: [Zustand 5.0](https://zustand-demo.pmnd.rs/)
- **Server State**: [TanStack Query 5.90](https://tanstack.com/query/latest)

### UI Components

- **Primitives**: [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion 11](https://www.framer.com/motion/)

### Forms & Validation

- **Form Handling**: [React Hook Form 7.56](https://react-hook-form.com/)
- **Validation**: [Yup 1.6](https://github.com/jquense/yup)

### Authentication & Backend

- **Auth**: [Firebase 11](https://firebase.google.com/)
- **HTTP Client**: [Axios 1.9](https://axios-http.com/)
- **Real-time**: [Socket.io Client 4.8](https://socket.io/)

### Developer Tools

- **Linting**: ESLint 9
- **Git Hooks**: Husky 9.1
- **Error Tracking**: Bugsnag 8.4

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js**: v20.x or higher ([Download](https://nodejs.org/))
- **npm** or **yarn**: Latest version
- **Git**: For version control

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-org/swapconnect.git
cd swapconnect/apps/frontend
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
# Backend API
NEXT_PUBLIC_BACKEND_API_URL=https://swapconnect-api.onrender.com/api

# Dashboard URL
NEXT_PUBLIC_DASHBOARD_URL=https://swapconnect-v2-dashboard.vercel.app/dashboard

# Error Tracking
NEXT_PUBLIC_BUGSNAG_API_KEY=your_bugsnag_api_key_here

# Firebase Configuration (if using Firebase)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
apps/frontend/
├── public/                    # Static assets
│   ├── images/               # Image files
│   └── favicon.ico           # Favicon
│
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/          # Auth routes group
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── ...
│   │   ├── dashboard/       # Protected dashboard routes
│   │   ├── shop/            # Shop page
│   │   ├── product/         # Product details
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── globals.css      # Global styles
│   │
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── ...
│   │   ├── landingpage/    # Landing page components
│   │   ├── navbar/         # Navigation components
│   │   └── ...
│   │
│   ├── lib/                # Utilities and helpers
│   │   ├── api.ts          # API client
│   │   ├── utils.ts        # Utility functions
│   │   └── constants.ts    # App constants
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useAuthToken.ts
│   │   └── ...
│   │
│   ├── store/              # Zustand stores
│   │   ├── authStore.ts
│   │   ├── cartStore.ts
│   │   └── ...
│   │
│   └── types/              # TypeScript type definitions
│       └── index.ts
│
├── .env.local              # Environment variables (gitignored)
├── .env.example            # Environment variables template
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
├── THEME_SYSTEM.md         # Design system documentation
├── APP_IMPROVEMENTS.md     # Improvement suggestions
└── README.md               # This file
```

---

## 💻 Development

### Available Scripts

```bash
# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint

# Fix ESLint errors
npm run lint:fix
```

### Development Workflow

1. **Create a new branch**

```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages

3. **Test your changes**

```bash
npm run dev
# Test in browser
```

4. **Lint your code**

```bash
npm run lint
```

5. **Commit and push**

```bash
git add .
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```

6. **Create a Pull Request**

---

## 🏗️ Building

### Production Build

```bash
npm run build
```

This will:

1. Type-check with TypeScript
2. Compile and optimize code
3. Generate static pages
4. Create optimized bundles

### Build Output

```
Route (app)                                Size     First Load JS
┌ ○ /                                      142 B          87.4 kB
├ ○ /_not-found                            142 B          87.4 kB
├ ○ /about                                 142 B          87.4 kB
├ ○ /shop                                  142 B          87.4 kB
└ ƒ /product/[id]                          142 B          87.4 kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

### Analyzing Bundle Size

```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Analyze bundle
ANALYZE=true npm run build
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**

```bash
npm install -g vercel
```

2. **Login to Vercel**

```bash
vercel login
```

3. **Deploy**

```bash
vercel
```

For production:

```bash
vercel --prod
```

### Manual Deployment

1. **Build the application**

```bash
npm run build
```

2. **Start the production server**

```bash
npm run start
```

The app will run on port 3000 by default.

### Environment Variables on Vercel

Add these in your Vercel project settings:

- `NEXT_PUBLIC_BACKEND_API_URL`
- `NEXT_PUBLIC_DASHBOARD_URL`
- `NEXT_PUBLIC_BUGSNAG_API_KEY`

---

## 🔐 Environment Variables

### Required Variables

| Variable                      | Description                        | Example                             |
| ----------------------------- | ---------------------------------- | ----------------------------------- |
| `NEXT_PUBLIC_BACKEND_API_URL` | Backend API base URL               | `https://api.swapconnect.com/api`   |
| `NEXT_PUBLIC_DASHBOARD_URL`   | Dashboard URL                      | `https://dashboard.swapconnect.com` |
| `NEXT_PUBLIC_BUGSNAG_API_KEY` | Bugsnag API key for error tracking | `abc123...`                         |

### Optional Variables

| Variable                           | Description          | Default |
| ---------------------------------- | -------------------- | ------- |
| `NEXT_PUBLIC_FIREBASE_API_KEY`     | Firebase API key     | -       |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | -       |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`  | Firebase project ID  | -       |

### Security Notes

- ⚠️ Only use `NEXT_PUBLIC_` prefix for client-safe values
- 🔒 Never commit `.env.local` to version control
- 🔑 Rotate API keys regularly
- 🛡️ Use environment-specific values

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Backend API Not Responding

**Error**: `Failed to fetch` or `Network error`

**Possible Causes**:

- Backend server is down (Render free tier sleeps after inactivity)
- Incorrect `NEXT_PUBLIC_BACKEND_API_URL`
- Network connectivity issues
- CORS configuration

**Solutions**:

```bash
# Check if backend is accessible
curl https://swapconnect-api.onrender.com/api/health

# Verify environment variable
echo $NEXT_PUBLIC_BACKEND_API_URL

# Wait 30-60s for backend to wake up from cold start
```

#### 2. Build Errors

**Error**: `Module not found` or `Cannot find module`

**Solutions**:

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install

# Clear Next.js cache only
rm -rf .next

# Rebuild
npm run build
```

#### 3. Styling Not Working

**Error**: Tailwind classes not applying

**Solutions**:

```bash
# Check tailwind.config.js content paths
# Ensure globals.css is imported in layout.tsx

# Clear cache
rm -rf .next

# Restart dev server
npm run dev
```

#### 4. TypeScript Errors

**Error**: Type errors during build

**Solutions**:

```bash
# Check TypeScript configuration
cat tsconfig.json

# Run type check
npx tsc --noEmit

# Update types
npm install --save-dev @types/node @types/react @types/react-dom
```

#### 5. Port Already in Use

**Error**: `Port 3000 is already in use`

**Solutions**:

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 npm run dev
```

---

## 🎨 Styling Guide

### Tailwind CSS

This project uses Tailwind CSS 4 with a custom design system.

#### Using Theme Colors

```tsx
// Use CSS variables from theme
<div className="bg-brand-primary text-white">SwapConnect</div>

// Available theme colors:
// - brand-primary
// - brand-primary-hover
// - brand-light
// - brand-lighter
// - page-bg
// - card-bg
// - text-primary
// - text-secondary
// - text-muted
```

#### Responsive Design

```tsx
// Mobile-first approach
<div className="w-full md:w-1/2 lg:w-1/3">Responsive width</div>

// Breakpoints:
// - sm: 640px
// - md: 768px
// - lg: 1024px
// - xl: 1280px
// - 2xl: 1536px
```

See [`THEME_SYSTEM.md`](THEME_SYSTEM.md) for complete design system documentation.

---

## 🧪 Testing (Coming Soon)

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

### Coverage

```bash
npm run test:coverage
```

---

## 📊 Performance

### Optimization Checklist

- ✅ Next.js Image component for optimized images
- ✅ Code splitting with dynamic imports
- ✅ React Query for data caching
- ✅ Tailwind CSS purging unused styles
- ⚠️ Bundle size monitoring (in progress)
- ⚠️ Lighthouse score optimization (target: 90+)

### Performance Tips

1. **Use Next.js Image Component**

```tsx
import Image from "next/image";

<Image
  src="/image.jpg"
  alt="Description"
  width={500}
  height={300}
  loading="lazy"
/>;
```

2. **Dynamic Imports for Heavy Components**

```tsx
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <Skeleton />,
  ssr: false,
});
```

3. **Memoize Expensive Computations**

```tsx
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

---

## 🤝 Contributing

We welcome contributions! Please see the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

### Quick Start for Contributors

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Run tests and linting
6. Submit a pull request

### Code Style

- Use TypeScript for all new code
- Follow ESLint rules
- Use Tailwind CSS for styling
- Write meaningful commit messages (Conventional Commits)
- Add JSDoc comments for complex functions

---

## 📚 Additional Resources

- **Main README**: [../../README.md](../../README.md)
- **Theme System**: [THEME_SYSTEM.md](THEME_SYSTEM.md)
- **Improvements**: [APP_IMPROVEMENTS.md](APP_IMPROVEMENTS.md)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind Docs**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **React Query Docs**: [tanstack.com/query](https://tanstack.com/query/latest)

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first approach
- Vercel for hosting and deployment
- All open-source contributors

---

<div align="center">

**SwapConnect Frontend — Built with ❤️ and ☕**

[Report Bug](https://github.com/your-org/swapconnect/issues) • [Request Feature](https://github.com/your-org/swapconnect/issues) • [Documentation](https://github.com/your-org/swapconnect/wiki)

</div>
