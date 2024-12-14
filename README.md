# Bingo Bond
Bingo Bond allows you to create bingo cards of plans with your friends so that you can enjoy time with your loved ones, one activity at a time.

### Inorder to test the application locally:
1. Clone the repository: `git clone https://github.com/actuallyakshat/bingo-bond.git`
2. Install dependencies: `pnpm install`
3. Set Environment Variables:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
PRISMA_FIELD_ENCRYPTION_KEY=
CLOAK_KEYCHAIN=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
MAIL_HOST=
MAIL_USER=
MAIL_PASS=
DATABASE_URL=
```
4. Migrate Prisma Scehmas: `pnpm dlx prisma migrate dev --name migration_name` and then `npx prisma generate`  
5. Run the local server: `pnpm dev`

### Tech Stack Used
- Next.js
- Typescript
- Cloudinary (For Image Uploads)
- Nodemailer (For Email Reminders)
- ShadCN UI
- Clerk Auth
- Tailwind
- Prisma-Field-Encryption
- Cron Jobs
- Postgres (Neon Tech)
- Prisma
- Vercel Analytics

### Have any queries?
Feel free to contact me on LinkedIn or Instagram! You can find the link to my socials from my GitHub Profile.
