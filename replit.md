# Work Permit AI Generation System (안전작업허가서 생성 시스템)

## Overview

This is a Korean-language manufacturing safety work permit generation system that leverages AI to automatically create safety work permits based on user input. The application helps manufacturing facility workers and safety managers create comprehensive work permits by analyzing work types, locations, and conditions, then generating safety procedures, hazard assessments, and risk evaluations informed by historical accident case data.

The system features a wizard-based permit creation flow, an AI chatbot for querying historical accident cases, and a dashboard for managing permits. It's designed specifically for Korean manufacturing environments with Korean-first UI/UX and terminology.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, built using Vite as the build tool and development server.

**Routing**: Wouter for client-side routing (lightweight alternative to React Router).

**UI Component Library**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling. The design follows Material Design principles with Fluent influences, optimized for enterprise productivity and Korean typography (Pretendard Variable font family).

**State Management**: 
- React Query (TanStack Query) for server state management and API data fetching
- Local React state (useState/useEffect) for UI state
- Form state managed by React Hook Form with Zod schema validation

**Form Validation**: Zod schemas defined in shared code for type-safe validation across client and server.

**Design System**: Custom Tailwind configuration with CSS variables for theming, supporting both light and dark modes. Korean-optimized typography with Pretendard Variable as primary font and Inter for English/numbers.

### Backend Architecture

**Runtime**: Node.js with Express.js framework.

**API Structure**: RESTful endpoints organized in `server/routes.ts`:
- `/api/chat/accident-cases` - POST endpoint for AI chatbot interactions
- `/api/permits` - POST endpoint for creating work permits
- Additional endpoints for retrieving permits by status

**AI Integration**: OpenAI-compatible API using Replit's AI Integrations service (configured via environment variables). The AI generates work permit content based on user input and references a mock accident case database stored in `server/openai.ts`.

**Session Management**: Express session middleware with connect-pg-simple for PostgreSQL-backed sessions (prepared but may use in-memory storage initially).

**Data Storage Interface**: Abstract `IStorage` interface allows switching between in-memory storage (`MemStorage`) and database-backed storage without changing application logic.

### Data Storage Solutions

**ORM**: Drizzle ORM configured for PostgreSQL database.

**Database Schema** (defined in `shared/schema.ts`):
- `users` table: User authentication (id, username, password)
- `work_permits` table: Comprehensive work permit data including work details, risk assessments, safety measures, and generated AI content (procedures, hazards, accident types, mitigation measures)

**Migration Strategy**: Drizzle Kit for schema migrations with configuration in `drizzle.config.ts`.

**Current Implementation**: In-memory storage (`MemStorage` class) for development. Production would use Drizzle ORM with PostgreSQL via Neon serverless driver (`@neondatabase/serverless`).

**Rationale**: Drizzle provides type-safe database queries and easy schema management. The abstraction layer allows starting with in-memory storage and migrating to PostgreSQL when needed without code changes to business logic.

### Multi-Step Wizard Flow

The permit creation process uses a 4-step wizard pattern:
1. Work type selection (electrical, confined space, hot work, etc.)
2. Basic information input (location, equipment, workers, dates)
3. Safety checklist selection
4. Review and submission with VOC (Voice of Customer) feedback collection

State is persisted to localStorage as draft data to prevent data loss.

### AI-Powered Features

**RAG-Based Accident Case Recommendations**: The system uses Retrieval-Augmented Generation (RAG) with FAISS vector similarity search to find and recommend relevant historical accident cases from an Excel database (`attached_assets/accident_List3_1762451020150.xlsx` containing 30 real accident cases from Korean manufacturing facilities).

Implementation details:
- **Vector Database**: FAISS (Facebook AI Similarity Search) with IndexFlatL2 for L2 distance similarity
- **Embedding Model**: OpenAI's text-embedding-3-small for converting accident cases and work permit information into vector embeddings
- **Data Source**: Excel file with columns: 작업유형, 기인물, 설비명, 재해발생일, 시간, 재해유형, 사고명, 나이, 근속, 재해정도, 발생상황, 발생원인, 시사점
- **Initialization**: Lazy loading on first API request; embeddings cached in memory for subsequent requests
- **API Endpoints**: 
  - `POST /api/accident-cases/similar` - Returns 2 most similar cases based on work type, name, description, and equipment
  - `GET /api/accident-cases/:id` - Returns specific case details
- **Concurrent Protection**: Initialization promise guards against redundant embedding work under concurrent requests
- **UI Integration**: Similar cases displayed in Step 4 (Review) with clickable titles opening detailed popup dialogs
- **Error Handling**: Graceful degradation when no similar cases found or API errors occur; users can proceed with submission

**Accident Case Chatbot**: Uses conversational AI to help users search historical accident cases and get safety recommendations based on work context.

**Work Permit Generation**: AI analyzes input work details and generates:
- Step-by-step procedures
- Potential hazards
- Accident type predictions
- Safety measures
- Risk assessment scores (complexity, scope, frequency, overall)
- Risk reasoning
- Mitigation measures

### Theme System

Custom theming using CSS variables in `client/src/index.css`:
- Separate light/dark mode color schemes
- Elevation/hover states using opacity overlays
- Consistent border and shadow treatments
- Korean-optimized contrast ratios

## External Dependencies

### Third-Party Services

**AI Service**: OpenAI API
- API key stored in Replit Secrets as `OPENAI_API_KEY`
- Used for:
  - Chatbot responses and work permit content generation
  - Text embeddings for RAG-based accident case similarity search (text-embedding-3-small model)
  - Vector similarity matching with FAISS for relevant case recommendations

**Database**: PostgreSQL (via Neon serverless when configured)
- Connection string via `DATABASE_URL` environment variable
- Drizzle ORM for type-safe database access

### Key NPM Packages

**UI Components**:
- `@radix-ui/*` - Headless UI primitives (dialogs, dropdowns, forms, etc.)
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` - Type-safe variant management for components
- `lucide-react` - Icon library

**Forms & Validation**:
- `react-hook-form` - Form state management
- `@hookform/resolvers` - Validation resolver
- `zod` - Schema validation
- `drizzle-zod` - Zod schema generation from Drizzle schemas

**Data Fetching**:
- `@tanstack/react-query` - Server state management
- `wouter` - Client-side routing

**AI & Vector Search**:
- `@langchain/openai` - OpenAI embeddings integration
- `faiss-node` - FAISS vector similarity search library
- `xlsx` - Excel file parsing for accident case data

**Database**:
- `drizzle-orm` - TypeScript ORM
- `@neondatabase/serverless` - Postgres serverless driver
- `connect-pg-simple` - PostgreSQL session store

**Development**:
- `vite` - Build tool and dev server
- `@vitejs/plugin-react` - React plugin for Vite
- `tsx` - TypeScript execution for Node.js
- `esbuild` - JavaScript bundler for server code

### Font Services

**CDN Fonts**:
- Pretendard Variable (from jsdelivr CDN) - Korean font
- Inter (from Google Fonts) - English/number font

### Build & Deployment

**Development**: Vite dev server with HMR, Replit-specific plugins for error overlays and dev tools

**Production Build**: 
- Client: Vite builds to `dist/public`
- Server: esbuild bundles to `dist/index.js`
- Start command runs bundled Node.js application

**Environment**: Designed to run on Replit with specific integrations for cartographer and dev banner plugins in development mode.