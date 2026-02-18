# 📈 Trading Journal

A comprehensive full-stack trading journal application built with Next.js 16, designed to help traders track, analyze, and improve their trading performance across multiple markets.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.3.1-2D3748)
![License](https://img.shields.io/badge/License-Personal-green)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Database Models](#️-database-models)
- [Environment Variables](#-environment-variables)
- [API Routes](#-api-routes)
- [Deployment](#-deployment)

## ✨ Features

### 📊 Trade Management
- **Multi-Market Support** - Trade across NSE, BSE, Forex, Crypto, and US Futures
- **Automated Calculations** - Automatic P&L, Risk/Reward ratio, and percentage gain/loss
- **Trade Import** - CSV upload with broker-specific parsers (Zerodha, Upstox, etc.)
- **Setup Ratings** - Rate your trade setups (A+, A, B, C)
- **Emotional Tracking** - Log your emotional state for each trade
- **Screenshots & Tags** - Attach images and tag trades for better organization

### 📈 Advanced Analytics
- **Performance Dashboard** - Real-time overview of your trading statistics
- **Calendar Heatmap** - Visualize your trading activity over time
- **Cumulative P&L Chart** - Track your account growth
- **Strategy Comparison** - Compare performance across different playbooks
- **Win Rate & R:R Analysis** - Detailed performance metrics
- **Printable Reports** - Export analytics for review

### 📝 Trading Journal
- **Daily Entries** - Document pre-market, post-market, and weekly reflections
- **Emotion Tracking** - Record your mental state and market conditions
- **Entry Ratings** - Self-score your journal entries
- **Tagging System** - Organize entries with custom tags
- **Share Entries** - Optionally share insights with the community

### 🎯 Playbooks (Trading Strategies)
- **Strategy Templates** - Define your trading setups in detail
- **Entry/Exit Rules** - Document clear entry and exit criteria
- **Risk Management** - Set position sizing and risk rules
- **Performance Tracking** - Link trades to strategies and track performance
- **Market-Specific** - Create playbooks for different market conditions

### 💬 Community Features
- **Real-time Chat** - Connect with other traders via WebSocket
- **Channel System** - Organized discussions (general, announcements, etc.)
- **Trade Feed** - Share and discuss trades with the community
- **Mentor System** - Connect traders with experienced mentors

### 💳 Subscription Management
- **Tier System** - Basic and Pro plans
- **Razorpay Integration** - Secure payment processing
- **Subscription Tracking** - Manage active/cancelled/expired subscriptions
- **Feature Gating** - Premium features for Pro users

### 🔒 Authentication & Security
- **NextAuth.js v5** - Industry-standard authentication
- **Google OAuth** - Quick sign-in with Google
- **Email/Password** - Traditional authentication with bcrypt
- **JWT Sessions** - Secure token-based sessions
- **Route Protection** - Middleware-based access control
- **Role-Based Access** - Trader, Mentor, and Admin roles

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 16.1.6](https://nextjs.org) with App Router
- **Language:** [TypeScript](https://www.typescriptlang.org)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com) (23 components)
- **Forms:** [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev)
- **Charts:** [Recharts](https://recharts.org)
- **Tables:** [TanStack Table](https://tanstack.com/table)
- **Icons:** [Lucide React](https://lucide.dev)

### Backend
- **Runtime:** Node.js
- **Database:** PostgreSQL
- **ORM:** [Prisma 6.3.1](https://www.prisma.io)
- **Authentication:** [NextAuth.js v5](https://next-auth.js.org)
- **Password Hashing:** bcryptjs
- **File Parsing:** PapaParse (CSV)
- **Payments:** Razorpay

### Development Tools
- **Linting:** ESLint 9
- **Type Checking:** TypeScript strict mode
- **Database Migrations:** Prisma Migrate

## 📦 Project Structure

```
trading-journal/
├── prisma/
│   └── schema.prisma              # Database schema with 9 models
│
├── public/                        # Static assets
│   ├── next.svg
│   ├── vercel.svg
│   └── ...
│
├── src/
│   ├── app/
│   │   ├── admin/                # Admin dashboard
│   │   │   └── page.tsx         # User/trade statistics
│   │   │
│   │   ├── api/
│   │   │   ├── auth/            # NextAuth.js routes
│   │   │   │   └── [...nextauth]/route.ts
│   │   │   ├── messages/        # Chat API endpoints
│   │   │   │   └── route.ts
│   │   │   ├── payment/         # Razorpay integration
│   │   │   │   └── create-order/route.ts
│   │   │   └── sync/
│   │   │       └── zerodha/     # Broker sync API
│   │   │           └── route.ts
│   │   │
│   │   ├── dashboard/
│   │   │   ├── analytics/       # Advanced charts & metrics
│   │   │   ├── community/       # Chat & trade feed
│   │   │   ├── journal/         # Daily journal CRUD
│   │   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   ├── playbooks/       # Strategy management
│   │   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   ├── subscription/    # Billing & plans
│   │   │   ├── trades/
│   │   │   │   ├── create/      # Manual trade entry
│   │   │   │   ├── import/      # CSV upload
│   │   │   │   └── page.tsx     # Trade data table
│   │   │   ├── layout.tsx       # Dashboard shell with nav
│   │   │   └── page.tsx         # Overview dashboard
│   │   │
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Landing page
│   │   └── globals.css          # Tailwind styles
│   │
│   ├── components/
│   │   ├── analytics/           # Chart components
│   │   │   ├── calendar-heatmap.tsx
│   │   │   ├── overview-chart.tsx
│   │   │   ├── stats-cards.tsx
│   │   │   ├── strategy-comparison.tsx
│   │   │   ├── recent-trades.tsx
│   │   │   └── print-button.tsx
│   │   │
│   │   ├── community/
│   │   │   ├── chat-window.tsx
│   │   │   └── trade-feed.tsx
│   │   │
│   │   ├── forms/
│   │   │   ├── trade-entry-form.tsx
│   │   │   ├── journal-entry-form.tsx
│   │   │   ├── playbook-form.tsx
│   │   │   └── csv-upload-form.tsx
│   │   │
│   │   ├── notifications/
│   │   │   └── notification-list.tsx
│   │   │
│   │   ├── subscription/
│   │   │   └── pricing-cards.tsx
│   │   │
│   │   ├── trades/
│   │   │   ├── data-table.tsx
│   │   │   └── trade-columns.tsx
│   │   │
│   │   └── ui/                  # 23 shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── form.tsx
│   │       ├── table.tsx
│   │       └── ...
│   │
│   ├── lib/
│   │   ├── actions/             # Server actions
│   │   │   ├── trade-actions.ts
│   │   │   ├── journal-actions.ts
│   │   │   ├── playbook-actions.ts
│   │   │   ├── csv-actions.ts
│   │   │   └── chat.ts
│   │   │
│   │   ├── validations/         # Zod schemas
│   │   │   ├── trade.ts
│   │   │   ├── journal.ts
│   │   │   ├── playbook.ts
│   │   │   └── message.ts
│   │   │
│   │   ├── csv-parsers.ts       # Broker-specific parsers
│   │   ├── prisma.ts            # Prisma client instance
│   │   └── utils.ts             # Utility functions
│   │
│   ├── auth.config.ts           # NextAuth configuration
│   ├── auth.ts                  # NextAuth setup
│   └── middleware.ts            # Route protection
│
├── .env                         # Environment variables
├── .gitignore
├── components.json              # shadcn/ui config
├── next.config.ts               # Next.js configuration
├── package.json
├── postcss.config.mjs
├── tsconfig.json                # TypeScript config
└── README.md
```

## 🗄️ Database Models

The application uses **9 PostgreSQL models** via Prisma:

1. **User** - Trader profiles with role-based access (TRADER/MENTOR/ADMIN)
2. **Account** - OAuth account connections (NextAuth)
3. **Session** - User sessions (NextAuth)
4. **Trade** - Core trading records with P&L calculations
5. **TradeScreenshot** - Image attachments for trades
6. **TradeTag** - Custom tags for trades
7. **Journal** - Daily trading journal entries
8. **Playbook** - Trading strategy templates
9. **Subscription** - User subscription management (BASIC/PRO)
10. **Notification** - In-app notifications
11. **Message** - Community chat messages

### Key Relationships
- Users can have multiple Trades, Journals, Playbooks, Subscriptions
- Trades can be linked to Playbooks (strategies)
- Users can mentor other users (self-referential)
- All models include timestamps (createdAt, updatedAt)

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** database
- **Google OAuth** credentials (optional)
- **Razorpay** account (optional, for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JeevaByte/Trading-Journal.git
   cd Trading-Journal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory (see [Environment Variables](#-environment-variables))

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev --name init
   
   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🔐 Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/trading_journal"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-generate-with-openssl"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Razorpay (Optional)
RAZORPAY_KEY_ID="your-razorpay-key"
RAZORPAY_KEY_SECRET="your-razorpay-secret"

# Zerodha Kite API (Optional)
KITE_API_KEY="your-kite-api-key"
KITE_API_SECRET="your-kite-api-secret"
```

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## 🛣️ API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/auth/[...nextauth]` | NextAuth.js authentication |
| GET | `/api/messages?channel=general` | Fetch chat messages |
| POST | `/api/payment/create-order` | Create Razorpay order |
| GET | `/api/sync/zerodha` | Get Zerodha login URL |
| POST | `/api/sync/zerodha` | Sync trades from Zerodha |

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub** (Already done ✅)
2. **Import to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy!

3. **Set up PostgreSQL**
   - Use [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Vercel Postgres](https://vercel.com/storage/postgres)
   - Update `DATABASE_URL` in Vercel environment variables

4. **Run database migrations**
   ```bash
   npx prisma migrate deploy
   ```

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- AWS (Amplify, EC2)
- Railway
- Render
- DigitalOcean App Platform

## 📸 Screenshots

_Coming soon..._

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📝 License

This project is for personal use.

---

**Built with ❤️ by JeevaByte**

For questions or support, please open an issue on GitHub.
