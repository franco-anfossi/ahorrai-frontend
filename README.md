# AhorrAI - Financial Management App

A modern financial management application built with Next.js 14, React, and Tailwind CSS.

## 🚀 Features

- **Financial Dashboard**: Comprehensive overview of expenses and spending patterns
- **AI Receipt Processing**: Scan and automatically extract expense data from receipts
- **Manual Expense Registration**: Add expenses manually with detailed categorization
- **Price Comparison**: Compare prices across different retailers
- **Budget Management**: Set and track budgets by category
- **Categories**: Create, view, update and delete spending categories
- **Expense Details**: Detailed view and editing of individual expenses

## 🛠 Tech Stack

- **Framework**: Next.js 14.2.5 (stable)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Icons**: Lucide React
- **Charts**: Recharts & D3
- **Forms**: React Hook Form
- **Animations**: Framer Motion

## 📦 Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## 🏗 Project Structure

```
ahorrai_6016/
├── pages/                 # Next.js pages (routing)
│   ├── _app.js           # App wrapper
│   ├── _document.js      # Document wrapper
│   ├── index.js          # Home page (dashboard)
│   └── [page].js         # Other pages
├── src/
│   ├── components/       # Reusable components
│   │   ├── ui/          # UI components
│   │   └── AppIcon.jsx  # Icon component
│   ├── pages/           # Page components
│   │   ├── financial-dashboard/
│   │   ├── manual-expense-register/
│   │   ├── price-compare/
│   │   └── ...
│   ├── store/           # Redux store
│   └── styles/          # Global styles
├── public/              # Static assets
└── next.config.js       # Next.js configuration
```

## 🔄 Migration from Vite + React Router

This project has been successfully migrated from Vite + React Router to Next.js 14. Key changes:

### ✅ Completed Migrations

1. **Routing**: Converted from React Router to Next.js file-based routing
2. **Navigation**: Updated all `useNavigate` hooks to use Next.js `useRouter`
3. **Configuration**: Replaced Vite config with Next.js config
4. **Build System**: Updated from Vite to Next.js build system
5. **Styling**: Maintained Tailwind CSS configuration
6. **State Management**: Preserved Redux setup

### 🔧 Key Changes Made

- **File Structure**: Moved from `src/App.jsx` to `pages/_app.js`
- **Routing**: Converted route definitions to file-based routing in `pages/`
- **Navigation**: Updated all navigation calls from `navigate()` to `router.push()`
- **Error Handling**: Enhanced ErrorBoundary for Next.js compatibility
- **Configuration**: Updated all config files for Next.js

## 🎨 Design System

The app uses a comprehensive design system with:

- **Color Palette**: Primary blues, secondary colors, and semantic colors
- **Typography**: Inter font family with consistent sizing
- **Spacing**: Tailwind's spacing scale
- **Components**: Reusable UI components with consistent styling
- **Animations**: Smooth transitions and micro-interactions

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Mobile devices (primary focus)
- Tablets
- Desktop screens

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Configuration Files

- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `jsconfig.json` - JavaScript/TypeScript configuration

## 🏗 Architecture

The application follows clean architecture principles:

- **Hexagonal Architecture**: Clear separation of concerns
- **Clean Code**: Well-structured, readable code
- **Inversion of Dependencies**: Proper dependency management
- **Error Handling**: Comprehensive error boundaries and handling

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For any issues or questions, please contact the development team.
