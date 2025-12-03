# Project Summary

This YouTube clone is a modern video streaming platform built with React and Firebase that offers both
familiar YouTube features and innovative additions like location-based video search.

**Key Technologies:**

- Frontend: React 19, Vite, Tailwind CSS, Material-UI
- Backend: Firebase (Auth, Firestore, Storage)
- APIs: YouTube Data API v3, Leaflet maps
- Openstreetmaps: Map tiles for location-based search
- Player: React Player for video playback

**Core Features:**

1. User Authentication - Google OAuth and email/password login
2. Video Discovery - Home feed with categorized content (coding, music, gaming, sports, Red Bull)
3. Standard Video Search - Traditional search as in YouTube
4. Location-Based Video Search - Unique location-based video discovery, select areas on a map to find videos from specific geographic locations.
5. Personalization - Watch history tracking with Firestore storage
6. Responsive Design - Mobile-first with dark theme YouTube-style interface

**Unique Selling Points:**

- Location-Based Video Search - Select areas on a map to find videos from specific geographic locations
- Multi-Category System - Predefined content categories with local JSON datasets    
- Comprehensive Watch History - Persistent viewing history with management features 

The project demonstrates modern React development practices with proper state management, API integration,
and a clean architecture that goes beyond basic YouTube replication to offer additional functionality.

---
  
## Development Commands
### Core Scripts
- `npm run dev` - Start development server with hot reload and host access
- `npm run build` - Build production bundle
- `npm run lint` - Run ESLint across the entire codebase

**Key Development Commands:**
- `npm run dev` - Development server with host access
- `npm run build` - Production build
- `npm run lint` - Code linting
- `npm run preview` - Preview production build

**Architecture Highlights:**
- Global state management with AuthContext and MapContext
- Component structure with protected routes and layout wrappers
- Data layer architecture with YouTube API integration and local fallback system
- Unique features like location-based video search and multi-category content system
- Firebase integration for authentication and watch history
- Tailwind CSS + Material-UI styling system

The documentation focuses on the architectural patterns that require understanding multiple files and
provides practical guidance for future development work, avoiding obvious instructions and generic practices
that can be easily discovered.

---

## Development Commands

### Core Scripts
- `npm run dev` - Start development server with hot reload and host access
- `npm run build` - Build production bundle
- `npm run lint` - Run ESLint across the entire codebase
- `npm run preview` - Preview production build locally

### Environment Requirements
- React 19.1.1+ with TypeScript definitions (The project doesn't use TypeScript, files are .js and .jsx)
- Vite 7.1.7+ with React and Tailwind plugins
- Firebase project configured for authentication and Firestore
- Valid Google YouTube Data API v3 key

## Architecture Overview

### Global State Management
- **AuthContext** (`src/auth/AuthContext.jsx`): Firebase authentication state with user profiles
- **MapContext** (`src/context/MapContext.jsx`): Leaflet map instance reference for location-based features
- Both contexts are wrapped at the root level in `src/index.jsx`

### Component Structure
- **Layout Components**: `src/layout/Main.jsx` wraps authenticated routes with navbar and context
- **Route Components**: Protected `ProfileUser` route uses `AuthRoute` wrapper; public routes include `/login`, `/signup`
- **Core Pages**: `Feed`, `VideoDetail`, `ChannelDetail`, `SearchFeed`, `AdvancedSearchFeed`

### Data Layer Architecture
- **YouTube API Integration**: `src/utils/fetchFromAPI.js` handles all external API calls with fallback to empty array
- **Local Data System**: Category-specific JSON files in `src/utils/` (coding.json, music.json, gaming.json, etc.)
- **User Service**: `src/utils/userService.js` manages Firebase user profiles and watch history
- **Constants**: `src/utils/constants.jsx` defines categories, demo data, and Leaflet map markers

### Key Unique Features
1. **Multi-Category Content System**: Predefined categories use local JSON data or YouTube API calls
2. **Location-Based Video Search**: `AdvancedSearchFeed` component integrates Leaflet maps with YouTube API location search
3. **Firebase Watch History**: Automatic tracking of viewed videos with Firestore persistence

### API Configuration
- YouTube API base URL: `https://www.googleapis.com/youtube/v3`
- Environment variable: `VITE_GOOGLE_YOUTUBE_API_KEY`
- API fetch function `fetchFromAPI` returns empty array on error to ensure graceful degradation

### Routing Architecture
- Public routes: `/`, `/video/:id`, `/channel/:id`, `/search/:searchTerm`, `/search-advanced`, `/login`, `/signup`, `*` (404)
- Protected routes: `/profile`
- `AuthRoute` component handles route protection and redirect logic

### Styling System
- Tailwind CSS 4.1.17 with Vite plugin
- Material-UI components for consistent design
- Dark theme with YouTube-style black background
