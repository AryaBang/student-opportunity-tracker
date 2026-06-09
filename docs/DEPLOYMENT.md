# Deployment Guide

## Prerequisites

- GitHub account
- Vercel account (frontend)
- Railway/Render account (backend)
- PostgreSQL database (hosted)

## Frontend Deployment (Vercel)

### Step 1: Connect Repository

1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select "student-opportunity-tracker" folder as root

### Step 2: Add Environment Variables

In Vercel project settings, add:

```
NEXT_PUBLIC_API_URL=https://your-backend-url/api
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url
```

### Step 3: Deploy

Vercel automatically deploys on git push to main branch.

```bash
git push origin main
```

Frontend URL: `https://your-project.vercel.app`

## Backend Deployment (Railway)

### Step 1: Connect Repository

1. Go to [Railway](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Choose your repository

### Step 2: Add Services

#### PostgreSQL Database

1. Click "Add Service"
2. Select "PostgreSQL"
3. Railway creates DATABASE_URL automatically

#### Create Web Service

1. Click "Add Service"
2. Select "GitHub Repo"
3. Choose the repository

### Step 3: Configure Environment Variables

In Railway variables, add:

```
NODE_ENV=production
PORT=5000
JWT_SECRET=your_long_random_secret_key
JWT_REFRESH_SECRET=your_long_random_refresh_key
FRONTEND_URL=https://your-frontend-url
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Step 4: Deploy

Railway automatically deploys on git push.

```bash
git push origin main
```

Backend URL: `https://your-backend-url`

## Database Migration on Production

```bash
# SSH into backend server
railway run bash

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed
```

## Environment Setup Summary

### Frontend (.env.production)
```
NEXT_PUBLIC_API_URL=https://your-backend-url/api
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url
```

### Backend (.env.production)
```
DATABASE_URL=postgresql://user:password@host:5432/db
REDIS_URL=redis://host:port
NODE_ENV=production
PORT=5000
JWT_SECRET=<secure-key>
JWT_REFRESH_SECRET=<secure-key>
FRONTEND_URL=https://your-frontend-url
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Monitoring

### Vercel
- Dashboard shows deployments and analytics
- Automatic rollback on failed builds

### Railway
- View logs: `railway logs`
- Monitor metrics in dashboard
- Set up alerts for errors

## CI/CD Pipeline

Both Vercel and Railway support:

- Automatic testing on push
- Automatic deployment to staging/production
- Rollback capabilities
- Environment-based deployments

Add to your repository:

```bash
# Install test dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Add test script to package.json
"test": "jest"

# Create GitHub workflow for CI
```

## Security Checklist

- [ ] Change all default secrets
- [ ] Enable HTTPS
- [ ] Set up firewall rules
- [ ] Enable database backups
- [ ] Configure rate limiting
- [ ] Set up error logging (e.g., Sentry)
- [ ] Enable CORS restrictions
- [ ] Use environment variables for secrets

## Troubleshooting

### Build Fails

```bash
# Check logs
railway logs
vercel logs

# Verify environment variables are set
# Check database connection
```

### Database Connection Error

```
Error: could not translate host name "localhost" to address

# Solution: Use production DATABASE_URL, not localhost
```

### API Calls Failing

```
CORS error

# Solution: Update FRONTEND_URL in backend .env
```

## Rollback

### Vercel
1. Go to Deployments
2. Click the previous working deployment
3. Click "Redeploy"

### Railway
1. Go to Deployments
2. Select previous version
3. Redeploy

## Performance Optimization

### Frontend
- Enable image optimization
- Use code splitting
- Minify CSS/JS (automatic)

### Backend
- Use caching (Redis)
- Add pagination
- Index database queries
- Enable compression

## Support

Check logs and documentation for each platform:
- Vercel: https://vercel.com/docs
- Railway: https://docs.railway.app
