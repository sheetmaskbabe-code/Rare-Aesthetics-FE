# My Rare Aesthetics

Premium website for **My Rare Aesthetics** — cosmetic product development, formulation, manufacturing support and consulting (Pretoria, South Africa).

**Founder:** Lindi-Grace

## Stack

- **Frontend:** React 19 + TypeScript + Vite, Tailwind CSS v4, Framer Motion
- **Backend:** Node.js + Express (ES Modules)
- **Database:** MongoDB via Mongoose (with in-memory fallback)
- **Media & File Storage:** Cloudinary (with Multer file upload & fallback)
- **Authentication:** JWT + Admin Key protection
- **Admin CMS:** Blog posts, Portfolio showcase & Customer enquiries

## Environment Setup (.env)

Copy `.env.example` to `.env` or update `.env` with your credentials:

```env
PORT=5000
NODE_ENV=development

# MongoDB Connection (Local or MongoDB Atlas)
MONGODB_URI=mongodb://127.0.0.1:27017/rare_aesthetics

# Cloudinary Credentials (from https://cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin Security
ADMIN_PASSWORD=Rare1357
ADMIN_API_KEY=Rare1357
JWT_SECRET=rare_aesthetics_super_secret_jwt_key_2026
```

## Running the Project

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start Backend Server:**
   ```bash
   npm run server
   ```
   Runs at `http://localhost:5000` (API proxy is configured in Vite).

3. **Start Frontend (Vite):**
   ```bash
   npm run dev
   ```
   Runs at `http://localhost:5173`.

4. **Seed Initial MongoDB Data (Optional):**
   ```bash
   npm run seed
   ```
   Seeds initial blog articles and portfolio showcases into MongoDB.

## API Endpoints

- `GET /api/health` — Service health check & connection status (MongoDB & Cloudinary)
- `POST /api/auth/login` — Admin login (returns JWT token)
- `GET /api/posts` — Get blog articles (public)
- `POST /api/posts` — Create / update blog article (Admin)
- `DELETE /api/posts/:id` — Delete blog article & clean up Cloudinary image (Admin)
- `GET /api/portfolio` — Get portfolio showcases (public)
- `POST /api/portfolio` — Create / update portfolio item (Admin)
- `DELETE /api/portfolio/:id` — Delete portfolio item & clean up Cloudinary image (Admin)
- `POST /api/upload` — Direct Cloudinary media upload (accepts image/document `file`)
- `POST /api/enquiry` — Submit contact form enquiry (with optional attachment)
- `GET /api/enquiries` — View customer enquiries (Admin)
- `PATCH /api/enquiries/:id` — Update enquiry status (Admin)
- `DELETE /api/enquiries/:id` — Delete enquiry (Admin)

## Admin Portal

Visit `/admin` in the browser:
- **Admin password:** `Rare1357`
- **Features:**
  - Create and edit blog articles with Cloudinary image upload.
  - Create and edit portfolio projects with Cloudinary image upload.
  - Review, track status, and manage customer contact enquiries and attachments.

## Brand palette

| Token | Hex |
|-------|-----|
| Light Lavender | `#E4D6E0` |
| Soft Orchid | `#D5B2DD` |
| Royal Plum | `#5F3A68` |
| Deep Blue | `#004F77` |
| Dark Plum | `#35213B` |
