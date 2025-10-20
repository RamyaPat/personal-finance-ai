# Personal Finance Management App

A full-stack personal finance management application built with Next.js, Supabase, Tailwind CSS, and Recharts.

## Features

- **Authentication**: Secure user signup and login with JWT tokens (Supabase Auth)
- **Dashboard**: Comprehensive overview with summary cards showing total income, expenses, and balance
- **Transaction Management**: Add, edit, and delete income/expense transactions
- **Budget Tracking**: Set and monitor budgets by category with progress indicators
- **Data Visualization**:
  - Pie chart showing expenses by category
  - Line chart displaying balance over time
- **Responsive Design**: Beautiful, mobile-friendly interface
- **Dark Mode Support**: System-based theme switching
- **Real-time Updates**: Instant UI updates after data changes

## Tech Stack

### Frontend
- **Next.js 13**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality UI components
- **Recharts**: Data visualization library
- **Lucide React**: Icon library
- **Sonner**: Toast notifications
- **date-fns**: Date formatting

### Backend
- **Supabase**: Backend-as-a-Service
  - PostgreSQL database
  - Authentication with JWT
  - Row Level Security (RLS) policies
  - Real-time subscriptions

## Project Structure

```
project/
├── app/
│   ├── auth/
│   │   └── page.tsx          # Authentication page (login/signup)
│   ├── dashboard/
│   │   └── page.tsx          # Main dashboard page
│   ├── layout.tsx            # Root layout with providers
│   ├── page.tsx              # Home page (redirects)
│   └── globals.css           # Global styles
├── components/
│   ├── dashboard/
│   │   ├── SummaryCards.tsx  # Income/expense/balance cards
│   │   ├── ExpenseChart.tsx  # Pie chart for expenses
│   │   └── BalanceChart.tsx  # Line chart for balance
│   ├── transactions/
│   │   ├── TransactionForm.tsx  # Add/edit transaction form
│   │   └── TransactionTable.tsx # Transaction list with actions
│   ├── budgets/
│   │   ├── BudgetForm.tsx    # Add/edit budget form
│   │   └── BudgetList.tsx    # Budget cards with progress bars
│   └── ui/                   # shadcn/ui components
├── contexts/
│   └── AuthContext.tsx       # Authentication context provider
├── lib/
│   ├── supabase.ts           # Supabase client and types
│   ├── api.ts                # API service layer
│   └── utils.ts              # Utility functions
└── .env                      # Environment variables
```

## Database Schema

### Tables

**transactions**
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to auth.users)
- `date` (date)
- `category` (text)
- `description` (text)
- `amount` (decimal)
- `type` ('income' | 'expense')
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**budgets**
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to auth.users)
- `category` (text)
- `limit_amount` (decimal)
- `period` ('monthly' | 'yearly')
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Policies enforce authentication and ownership checks

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone or navigate to the project directory**
```bash
cd /path/to/project
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Variables**
The `.env` file is already configured with Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

4. **Database Setup**
The database tables and RLS policies have already been created via migrations.

### Running the Application

#### Development Mode
```bash
npm run dev
```
The app will be available at `http://localhost:3000`

#### Production Build
```bash
npm run build
npm start
```

## Usage Guide

### 1. Authentication
- Navigate to the app
- Sign up with email and password
- Or sign in if you already have an account

### 2. Dashboard Overview
After logging in, you'll see:
- **Summary Cards**: Total income, expenses, and current balance
- **Charts**: Visual representation of spending and balance trends
- **Tabs**: Switch between Transactions and Budgets views

### 3. Managing Transactions
- Click "Add Transaction" button
- Fill in:
  - Date
  - Type (Income/Expense)
  - Category
  - Description
  - Amount
- View all transactions in a sortable table
- Edit or delete existing transactions

### 4. Setting Budgets
- Switch to the "Budgets" tab
- Click "Add Budget" button
- Choose:
  - Category
  - Budget limit amount
  - Period (Monthly/Yearly)
- Monitor spending against budgets with progress bars
- Get alerts when over budget

### 5. Data Visualization
- **Expense Pie Chart**: Shows breakdown of expenses by category
- **Balance Line Chart**: Displays balance changes over time

## Categories

### Income Categories
- Salary
- Freelance
- Investment
- Other

### Expense Categories
- Food
- Transportation
- Entertainment
- Shopping
- Bills
- Healthcare
- Education
- Other

## Security Features

- **JWT Authentication**: Secure token-based auth via Supabase
- **Row Level Security**: Database-level access control
- **Input Validation**: Form validation on client and server
- **HTTPS**: Encrypted communication
- **Session Management**: Automatic token refresh

## Responsive Design

The app is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1280px+)
- Tablet (768px+)
- Mobile (320px+)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Build Issues
If you encounter build issues:
```bash
rm -rf .next
npm run build
```

### Database Connection Issues
- Verify `.env` credentials are correct
- Check Supabase project is active
- Ensure RLS policies are properly configured

### Authentication Issues
- Clear browser cookies/localStorage
- Check Supabase Auth settings
- Verify email confirmation is disabled (or handle confirmation flow)

## Future Enhancements

Potential features to add:
- Export data to CSV/PDF
- Recurring transactions
- Multi-currency support
- Financial goals tracking
- Receipt uploads
- Bank account integration
- Expense predictions using ML
- Category customization
- Shared budgets for families
- Mobile app (React Native)

## Development Commands

```bash
# Development
npm run dev          # Start dev server

# Building
npm run build        # Create production build
npm start            # Start production server

# Type Checking
npm run typecheck    # Run TypeScript compiler check

# Linting
npm run lint         # Run ESLint
```

## License

This project is open source and available for educational purposes.

## Support

For issues or questions:
1. Check this README
2. Review Supabase documentation
3. Check Next.js documentation
4. Review component documentation in code comments
