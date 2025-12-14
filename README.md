# Sweet Shop Management System

A full-stack TDD Kata implementation of a Sweet Shop Management System with React frontend, Node.js/TypeScript backend, and PostgreSQL database.

## Features

### Backend API (RESTful)
- **Authentication**: JWT-based auth with OTP email verification
- **User Management**: Registration, login, role-based access (User/Admin)
- **Sweet Management**: CRUD operations for sweets inventory
- **Order Management**: Complete order lifecycle
- **AI Integration**: Gemini-powered sweet image generation
- **Search & Filtering**: Advanced search by name, category, price range

### Frontend (React/TypeScript)
- **Modern UI**: Responsive design with Tailwind CSS
- **Real-time Updates**: Live inventory and cart management
- **Admin Panel**: Full CRUD operations for sweets
- **AI Sommelier**: AI-powered sweet recommendations
- **Shopping Cart**: Complete e-commerce flow

### Database
- **PostgreSQL**: Production-ready database
- **Prisma ORM**: Type-safe database operations
- **Migrations**: Version-controlled schema changes

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT, bcrypt
- **Email**: Nodemailer with Gmail SMTP
- **AI**: Google Gemini 2.0
- **Testing**: Jest, Supertest
- **Deployment**: Vercel (Frontend + Backend)

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Gmail account for email (or configure alternative SMTP)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sweet-shop-management-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database URL and other configs
   npx prisma migrate dev
   npx prisma generate
   npm run seed
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ..
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register/initiate` - Start registration
- `POST /api/auth/register/verify` - Complete registration with OTP
- `POST /api/auth/login` - User login

### Sweets Endpoints (Protected)
- `GET /api/sweets` - List all sweets
- `POST /api/sweets` - Add new sweet (Admin)
- `PUT /api/sweets/:id` - Update sweet (Admin)
- `DELETE /api/sweets/:id` - Delete sweet (Admin)
- `GET /api/sweets/search` - Search sweets
- `POST /api/sweets/:id/purchase` - Purchase sweet
- `POST /api/sweets/:id/restock` - Restock sweet (Admin)

### Orders Endpoints (Protected)
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order

## Testing

```bash
cd backend
npm test
```

## Deployment

### Vercel Deployment

1. **Create Vercel Account**
   - Sign up at https://vercel.com

2. **Set up PostgreSQL**
   - Use Vercel Postgres or external provider
   - Update `DATABASE_URL` in environment variables

3. **Deploy Backend**
   ```bash
   cd backend
   vercel --prod
   ```

4. **Deploy Frontend**
   ```bash
   cd ..
   vercel --prod
   ```

5. **Environment Variables**
   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_SECRET`: Secure random string
   - `GEMINI_API_KEY`: Google Gemini API key
   - `EMAIL_*`: Email configuration

## My AI Usage

### AI Tools Used
- **GitHub Copilot**: Used for code completion, boilerplate generation, and debugging assistance
- **ChatGPT**: Used for brainstorming API architecture, troubleshooting deployment issues, and generating test cases

### How AI Was Used
1. **Code Generation**: Copilot helped generate initial controller structures, middleware, and utility functions
2. **Testing**: ChatGPT assisted in writing comprehensive test cases and understanding Jest patterns
3. **Debugging**: Both tools helped identify and fix TypeScript errors and database connection issues
4. **Documentation**: AI helped structure this README and API documentation
5. **Architecture Decisions**: ChatGPT provided insights on best practices for the tech stack

### AI Impact on Workflow
- **Productivity**: AI tools significantly sped up development by providing code suggestions and catching errors early
- **Learning**: Working with AI helped understand modern development patterns and best practices
- **Quality**: AI-assisted code reviews and suggestions improved code quality and consistency
- **Challenges**: Had to verify AI-generated code for correctness and ensure it matched project requirements

### Co-authored Commits
All commits involving AI assistance are marked with co-author trailers:
```
Co-authored-by: GitHub Copilot <copilot@github.com>
Co-authored-by: ChatGPT <chatgpt@openai.com>
```

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/     # API route handlers
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Database operations
│   │   ├── middlewares/     # Auth & validation
│   │   ├── routes/          # API routes
│   │   ├── tests/           # Unit & integration tests
│   │   └── utils/           # Helper functions
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   ├── migrations/      # DB migrations
│   │   └── seed.ts          # Test data
│   └── package.json
├── components/               # React components
├── contexts/                 # React context providers
├── services/                 # Frontend API services
├── types.ts                  # TypeScript types
└── package.json
```

## Contributing

1. Follow TDD principles - write tests before implementation
2. Use meaningful commit messages
3. Update documentation for API changes
4. Ensure all tests pass before committing

## License

MIT License - see LICENSE file for details
