# 🚀 Quick Start Guide - Travel Weather App

## ⚡ Get Started in 5 Minutes

### Step 1: Set Up Supabase (2 minutes)

1. Visit **https://supabase.com** → Click "Start your project"
2. Sign in with GitHub (or create account - it's FREE)
3. Click "New project"
4. Fill in:
   - **Name**: travel-weather-app
   - **Database Password**: (generate strong password)
   - **Region**: Choose closest to you
5. Click "Create new project" (wait ~2 minutes)

### Step 2: Create Database Table (1 minute)

1. In Supabase dashboard, click "SQL Editor" (left sidebar)
2. Click "+ New query"
3. Copy-paste this SQL:

\`\`\`sql
create table public.destinations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  country text not null,
  month text not null,
  temperature text,
  visited boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.destinations enable row level security;

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
\`\`\`

4. Click "Run" (bottom right)
5. You should see "Success. No rows returned"

### Step 3: Get API Credentials (30 seconds)

1. Click "Settings" (left sidebar) → "API"
2. Find these two values:
   - **URL** (looks like: `https://abc123.supabase.co`)
   - **anon public** key (long string of random characters)
3. Keep this tab open!

### Step 4: Configure App (30 seconds)

1. In your code editor, create a file called `.env` (no extension)
2. Add these lines (replace with YOUR values from Step 3):

\`\`\`
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...your-key-here
\`\`\`

3. Save the file

### Step 5: Start the App! (30 seconds)

Open terminal and run:

\`\`\`bash
npm start
\`\`\`

Then choose:
- Press **w** = Open in web browser (easiest to test)
- Press **i** = iOS simulator (Mac only)
- Press **a** = Android emulator
- Scan QR code = Test on your phone (install Expo Go app first)

## ✅ Testing the App

1. **Sign Up**: Create account with your email
2. **Search**: Try searching for:
   - "Japan" (country search)
   - "March" (month search)
3. **Save**: Click "💾 Save" on any result
4. **View**: Go to "My Destinations" to see saved items

## 🌐 Deploy to Web (BONUS - 100% FREE)

### Option 1: Vercel (Recommended)

\`\`\`bash
# Build for web
npx expo export:web

# Install Vercel CLI
npm install -g vercel

# Deploy (follow prompts)
vercel
\`\`\`

### Option 2: Netlify

\`\`\`bash
# Build for web  
npx expo export:web

# Drag and drop the 'web-build' folder to netlify.com/drop
\`\`\`

## 📱 Build Mobile Apps

### iOS (requires Mac + Apple Developer account $99/year)

\`\`\`bash
npx expo build:ios
\`\`\`

### Android (Google Play $25 one-time)

\`\`\`bash
npx expo build:android
\`\`\`

## 💡 Pro Tips

**One Codebase = 3 Platforms**
- Make changes once, it updates everywhere (web, iOS, Android)

**Free Forever?**
- Yes! Supabase free tier: 500MB database, 50K users/month
- Vercel/Netlify: Free hosting forever
- Only pay for app store publishing fees

**Offline Mode**
- App caches data, works without internet
- Syncs when you reconnect

**Security**
- All data encrypted
- Each user only sees their own destinations
- Passwords never stored in plain text

## 🆘 Common Issues

**"Supabase connection failed"**
- Check `.env` file exists and has correct values
- Make sure you ran the SQL to create the table
- Verify Supabase project is "Active" (green status)

**"Metro bundler error"**
\`\`\`bash
npx expo start -c
\`\`\`

**"Module not found"**
\`\`\`bash
rm -rf node_modules
npm install
\`\`\`

## 🎉 You're Done!

Your app is now:
- ✅ Running on web, iOS, and Android
- ✅ Connected to cloud database
- ✅ User authenticated
- ✅ Ready to publish

Need help? Check README.md for full documentation.
