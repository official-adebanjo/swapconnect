# SwapConnect v2 Monorepo

<div align="center">

![SwapConnect Logo](https://res.cloudinary.com/ds83mhjcm/image/upload/v1720710233/SwapConnect/swapconnect-full-logo-trans_lodvax.png)

**Nigeria's Premier Platform for Swapping, Buying, and Selling Tech Devices**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Turborepo](https://img.shields.io/badge/Turborepo-latest-ef4444?logo=turborepo)](https://turbo.build/)

</div>

---

## 📖 Overview

SwapConnect is a modern, full-stack marketplace platform that enables users to swap, buy, and sell tech devices sustainably. This monorepo contains two Next.js applications managed with Turborepo for optimal build performance and developer experience.

### 🎯 Mission

Empowering individuals to upgrade their devices affordably, sustainably, and with confidence while fostering a circular economy that reduces electronic waste.

---

## 📦 Project Structure

```
swapconnect/
├── apps/
│   ├── frontend/          # Main user-facing application
│   │   ├── src/
│   │   │   ├── app/       # Next.js App Router pages
│   │   │   ├── components/# Reusable React components
│   │   │   ├── lib/       # Utilities and helpers
│   │   │   ├── hooks/     # Custom React hooks
│   │   │   └── store/     # Zustand state management
│   │   ├── public/        # Static assets
│   │   └── package.json
│   │
│   └── dashboard/         # Admin dashboard (separate app)
│       └── ...
│
├── turbo.json            # Turborepo configuration
├── package.json          # Root package.json
└── README.md            # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20.x or higher
- **npm** or **yarn**: Latest version
- **Git**: For version control

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-org/swapconnect.git
cd swapconnect
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

This will install dependencies for the root workspace and all apps.

3. **Set up environment variables**

Create `.env.local` files in each app directory:

```bash
# apps/frontend/.env.local
NEXT_PUBLIC_BACKEND_API_URL=https://swapconnect-api.onrender.com/api
NEXT_PUBLIC_DASHBOARD_URL=https://swapconnect-v2-dashboard.vercel.app/dashboard
NEXT_PUBLIC_BUGSNAG_API_KEY=your_bugsnag_key
```

4. **Run the development server**

```bash
# Run all apps in parallel
npm run dev

# Or run specific app
cd apps/frontend
npm run dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Available Commands

### Root Level Commands

| Command         | Description                        |
| --------------- | ---------------------------------- |
| `npm run dev`   | Start all apps in development mode |
| `npm run build` | Build all apps for production      |
| `npm run lint`  | Lint all apps                      |
| `npm run clean` | Clean all build artifacts          |

### Turborepo Commands

```bash
# Run a task across all workspaces
npx turbo run <task>

# Run with caching
npx turbo run build

# Run in parallel
npx turbo run dev --parallel

# Force rebuild (ignore cache)
npx turbo run build --force

# Filter to specific app
npx turbo run build --filter=frontend
```

### Frontend Specific Commands

```bash
cd apps/frontend

npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

---

## 🏗️ Tech Stack

### Frontend Application

| Technology          | Purpose                             | Version |
| ------------------- | ----------------------------------- | ------- |
| **Next.js**         | React framework with App Router     | 16.0.10 |
| **React**           | UI library                          | 19.0.0  |
| **TypeScript**      | Type safety                         | 5.9.3   |
| **Tailwind CSS**    | Utility-first CSS                   | 4.1.7   |
| **Zustand**         | State management                    | 5.0.4   |
| **React Query**     | Server state management             | 5.90.19 |
| **Framer Motion**   | Animations                          | 11.13.1 |
| **Lucide React**    | Icon library                        | 0.511.0 |
| **React Hook Form** | Form handling                       | 7.56.4  |
| **Yup**             | Schema validation                   | 1.6.1   |
| **Axios**           | HTTP client                         | 1.9.0   |
| **Firebase**        | Authentication & real-time features | 11.10.0 |
| **Socket.io**       | Real-time communication             | 4.8.1   |
| **Bugsnag**         | Error tracking                      | 8.4.0   |

### Development Tools

- **Turborepo**: Monorepo build system
- **ESLint**: Code linting
- **Husky**: Git hooks
- **Lint-staged**: Pre-commit linting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

---

## 📱 Key Features

### User Features

- ✅ **Device Marketplace**: Browse, search, and filter tech devices
- ✅ **Swap System**: Exchange devices with other users
- ✅ **Secure Checkout**: Multi-step checkout with payment integration
- ✅ **User Dashboard**: Manage orders, products, and wallet
- ✅ **Trade-In Calculator**: Get instant valuations for devices
- ✅ **Real-time Notifications**: Stay updated on orders and bids
- ✅ **Wallet System**: Fund wallet and manage transactions
- ✅ **Bid System**: Make offers on products
- ✅ **Product Reviews**: Rate and review purchases

### Technical Features

- ⚡ **Server-Side Rendering**: Fast initial page loads
- 🎨 **Dark Mode Support**: Theme system with CSS variables
- 📱 **Responsive Design**: Mobile-first approach
- 🔒 **Authentication**: Secure login with Firebase
- 🌐 **API Integration**: RESTful API with proper error handling
- 🎭 **Animations**: Smooth transitions with Framer Motion
- 📊 **Analytics**: Bugsnag error tracking and performance monitoring
- 🔄 **Real-time Updates**: Socket.io for live features

---

## 🎨 Design System

SwapConnect uses a comprehensive design system with:

- **Color Palette**: Brand colors with light/dark mode support
- **Typography**: Inter font family with consistent sizing
- **Components**: Reusable UI components in `src/components/ui/`
- **Animations**: Standardized motion patterns
- **Spacing**: Consistent spacing scale
- **Responsive Breakpoints**: Mobile-first responsive design

See [`apps/frontend/THEME_SYSTEM.md`](apps/frontend/THEME_SYSTEM.md) for details.

---

## 📂 Application Routes

### Public Routes

- `/` - Landing page
- `/shop` - Product marketplace
- `/about` - About SwapConnect
- `/swap` - Device swap interface
- `/trade-in-calculator` - Device valuation tool
- `/product/[id]` - Product details
- `/category/[name]` - Category products
- `/cart` - Shopping cart
- `/checkout` - Checkout process

### Authentication Routes (Group: `(auth)`)

- `/login` - User login
- `/signup` - User registration
- `/forget-password` - Password recovery
- `/reset-password` - Password reset

### Protected Routes (Dashboard)

- `/dashboard` - User dashboard
- `/dashboard/products` - Manage products
- `/dashboard/orders` - Order history
- `/dashboard/bid` - Bid management
- `/dashboard/wallet` - Wallet management
- `/dashboard/notifications` - Notifications
- `/dashboard/settings` - Account settings
- `/dashboard/support` - Support tickets

---

## 🔧 Configuration

### Turborepo Configuration (`turbo.json`)

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    }
  }
}
```

### Environment Variables

#### Frontend Required Variables

```env
NEXT_PUBLIC_BACKEND_API_URL=<backend_api_url>
NEXT_PUBLIC_DASHBOARD_URL=<dashboard_url>
NEXT_PUBLIC_BUGSNAG_API_KEY=<bugsnag_key>
```

---

## 🚢 Deployment

### Frontend Deployment (Vercel)

1. **Connect Repository**: Link GitHub repo to Vercel
2. **Configure Build**:
   - Build Command: `cd apps/frontend && npm run build`
   - Output Directory: `apps/frontend/.next`
3. **Set Environment Variables**: Add all required env vars
4. **Deploy**: Push to main branch for automatic deployment

### Build Optimization

```bash
# Analyze bundle size
cd apps/frontend
npm run build

# Check build output
ls -lh .next/static/chunks/
```

---

## 🧪 Testing

### Running Tests (To be implemented)

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

---

## 🐛 Debugging

### Common Issues

#### 1. Backend API Not Responding

**Error**: `Failed to fetch`

**Solution**:

- Check if backend is running (Render free tier may sleep)
- Verify `NEXT_PUBLIC_BACKEND_API_URL` is correct
- Check network connectivity
- Backend may need 30-60s to wake up from cold start

#### 2. Build Errors

**Error**: `Module not found`

**Solution**:

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

#### 3. Styling Issues

**Error**: Tailwind classes not working

**Solution**:

- Check `tailwind.config.js` content paths
- Ensure `globals.css` is imported in `layout.tsx`
- Clear Next.js cache: `rm -rf .next`

---

## 📊 Performance

### Optimization Checklist

- ✅ Next.js Image optimization
- ✅ Code splitting with dynamic imports
- ✅ React Query for data caching
- ✅ Tailwind CSS purging
- ⚠️ Bundle size monitoring (needs improvement)
- ⚠️ Lighthouse score optimization (in progress)

### Current Metrics

- **Build Time**: ~88s
- **Bundle Size**: TBD (needs analysis)
- **Lighthouse Score**: TBD (needs testing)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Code Standards

- Use TypeScript for all new code
- Follow ESLint rules
- Write meaningful commit messages
- Add tests for new features
- Update documentation

---

## 📝 Documentation

- **Frontend README**: [`apps/frontend/README.md`](apps/frontend/README.md)
- **Theme System**: [`apps/frontend/THEME_SYSTEM.md`](apps/frontend/THEME_SYSTEM.md)
- **Improvements**: [`apps/frontend/APP_IMPROVEMENTS.md`](apps/frontend/APP_IMPROVEMENTS.md)
- **API Documentation**: TBD

---

## 🔐 Security

- **Environment Variables**: Never commit `.env` files
- **API Keys**: Use `NEXT_PUBLIC_` prefix only for client-safe values
- **Authentication**: Firebase Auth with secure tokens
- **HTTPS**: Always use HTTPS in production
- **Input Validation**: Yup schema validation on all forms

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-org/swapconnect/issues)
- **Email**: support@swapconnect.com
- **Documentation**: [Wiki](https://github.com/your-org/swapconnect/wiki)

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing framework
- **Vercel**: For hosting and deployment
- **Tailwind CSS**: For the utility-first CSS framework
- **Open Source Community**: For all the amazing libraries

---

## 🗺️ Roadmap

### Q1 2026

- [ ] Implement comprehensive testing
- [ ] Performance optimization (bundle size reduction)
- [ ] Enhanced SEO and metadata
- [ ] Accessibility improvements

### Q2 2026

- [ ] PWA support
- [ ] Mobile app (React Native)
- [ ] Advanced search with AI
- [ ] Real-time chat system

### Q3 2026

- [ ] Internationalization (i18n)
- [ ] Multi-currency support
- [ ] Advanced analytics dashboard
- [ ] Seller verification system

---

<div align="center">

**SwapConnect — Upgrade your tech, simplify your life. 🚀**

Made with ❤️ by the SwapConnect Team

[Website](https://swapconnect.com) • [Twitter](https://twitter.com/swapconnect) • [LinkedIn](https://linkedin.com/company/swapconnect)

</div>
