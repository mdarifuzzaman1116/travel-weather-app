# Travel Weather App - React Native + Expo

A cross-platform travel weather application built with React Native and Expo. Works on iOS, Android, and Web with a single codebase.

## 🚀 Features

- ✅ Cross-platform (iOS, Android, Web)
- ✅ User authentication with Supabase
- ✅ Search destinations by country or month
- ✅ Save favorite destinations
- ✅ Real-time data sync across devices
- ✅ Works offline with cached data
- ✅ Installable as PWA on web

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Expo CLI: `npm install -g expo-cli`
- (Optional) iOS Simulator or Android Emulator for testing

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase (FREE)

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" (100% free, no credit card needed)
3. Create a new project
4. Wait for database to provision (~2 minutes)

### 3. Create Database Table

In your Supabase project dashboard:

1. Go to **SQL Editor**
2. Click **New Query**
3. Paste this SQL:

```sql
-- Create destinations table
create table public.destinations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  country text not null,
  month text not null,
  temperature text,
  visited boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.destinations enable row level security;

-- Create policies
create policy "Users can view their own destinations"
  on public.destinations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own destinations"
  on public.destinations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own destinations"
  on public.destinations for update
  using (auth.uid() = user_id);

create policy "Users can delete their own destinations"
  on public.destinations for delete
  using (auth.uid() = user_id);
```

4. Click **Run** to execute

### 4. Get Your Supabase Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (the long string)

### 5. Configure Environment

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### 6. Start the App

```bash
npm start
```

This will open Expo DevTools in your browser. From there you can:
- Press `w` to open in web browser
- Press `i` to open in iOS Simulator (Mac only)
- Press `a` to open in Android Emulator
- Scan QR code with Expo Go app on your phone

## 📱 Running on Devices

### Web
```bash
npm run web
```
Visit http://localhost:19006

### iOS (Mac only)
```bash
npm run ios
```

### Android
```bash
npm run android
```

## 🌐 Deploy to Web (FREE)

1. Build for web:
   ```bash
   npx expo export:web
   ```

2. Deploy to Vercel (free):
   ```bash
   npm install -g vercel
   vercel
   ```

## 📦 Build for App Stores

### iOS (requires Mac + $99/year Apple Developer account)
```bash
npx expo build:ios
```

### Android (one-time $25 Google Play fee)
```bash
npx expo build:android
```

## 🎯 Usage

1. **Sign Up**: Create an account with your email
2. **Search**: Search for countries (Japan, Maldives, etc.) or months (March, July, etc.)
3. **Save**: Tap "💾 Save" to add destinations to your list
4. **View Saved**: Go to "My Destinations" to see your saved places
5. **Mark Visited**: Toggle visited status for destinations you've been to

## 💰 Cost Breakdown

- **Development**: FREE
- **Supabase**: FREE (up to 500MB DB, 50K monthly active users)
- **Web Hosting**: FREE (Vercel/Netlify)
- **App Store Publishing**:
  - Apple: $99/year
  - Google Play: $25 one-time

## 🔐 Security

- Authentication handled by Supabase
- Row Level Security (RLS) ensures users only see their own data
- Passwords hashed with bcrypt
- API keys stored securely in environment variables

## 🆘 Troubleshooting

**Metro bundler won't start:**
```bash
npx expo start -c
```

**Dependencies issues:**
```bash
rm -rf node_modules
npm install
```

**Supabase connection errors:**
- Check your `.env` file has correct credentials
- Ensure Supabase project is active
- Verify database table is created

## 📚 Tech Stack

- **Frontend**: React Native + Expo
- **Backend**: Supabase (PostgreSQL + Auth)
- **Navigation**: React Navigation
- **State**: React Hooks
- **Storage**: AsyncStorage + Supabase

## 📄 License

MIT
