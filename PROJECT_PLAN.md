# Forum Web App - Technical Plan

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Spring Boot 3.2.x (Java 17+) |
| Build | Maven |
| Database | MySQL 8.x |
| ORM | Spring Data JPA + Hibernate |
| Auth | Spring Security + JWT |
| Frontend | React 18 + Vite |
| Rich Text | React-Quill |
| Image Upload | Local storage |
| Search | MySQL FULLTEXT |
| Container | Docker + Docker Compose |

---

## Project Structure

```
forum-app/
├── backend/                 # Spring Boot API
│   ├── src/main/java/
│   │   └── com/forum/
│   │       ├── config/      # Security, CORS, etc.
│   │       ├── controller/  # REST controllers
│   │       ├── service/     # Business logic
│   │       ├── repository/  # Data access
│   │       ├── model/       # Entities
│   │       ├── dto/         # Data transfer objects
│   │       └── exception/   # Error handling
│   └── src/main/resources/
│       └── application.yml
├── frontend/                # React app
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API calls
│   │   ├── context/         # Auth state, etc.
│   │   └── utils/           # Helpers
│   └── vite.config.js
└── docker-compose.yml
```

---

## Database Schema (MySQL)

### users
| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT | PK, auto-increment |
| username | VARCHAR(50) | unique |
| email | VARCHAR(100) | unique |
| password | VARCHAR(255) | bcrypt hashed |
| avatar | VARCHAR(500) | image URL |
| role | ENUM | USER, MODERATOR, ADMIN |
| created_at | TIMESTAMP | |

### categories
| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT | PK |
| name | VARCHAR(100) | |
| description | TEXT | |
| slug | VARCHAR(100) | URL-friendly |

### posts
| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT | PK |
| title | VARCHAR(255) | |
| content | TEXT | rich HTML |
| user_id | BIGINT | FK → users |
| category_id | BIGINT | FK → categories |
| view_count | INT | default 0 |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### comments
| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT | PK |
| content | TEXT | |
| user_id | BIGINT | FK → users |
| post_id | BIGINT | FK → posts |
| parent_id | BIGINT | FK → comments (nullable, for nested) |
| created_at | TIMESTAMP | |

### images
| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT | PK |
| filename | VARCHAR(255) | |
| url | VARCHAR(500) | |
| post_id | BIGINT | FK → posts (nullable) |

---

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login, return JWT
- `GET /api/auth/me` - Get current user

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category (admin)

### Posts
- `GET /api/posts` - List posts (paginated, filterable)
- `GET /api/posts/{id}` - Get post with comments
- `POST /api/posts` - Create post (auth)
- `PUT /api/posts/{id}` - Update post (owner/admin)
- `DELETE /api/posts/{id}` - Delete post (owner/admin)
- `GET /api/posts/search?q=` - Search posts

### Comments
- `GET /api/posts/{id}/comments` - Get comments for post
- `POST /api/posts/{id}/comments` - Add comment (auth)
- `DELETE /api/comments/{id}` - Delete comment

### Images
- `POST /api/images/upload` - Upload image (auth)
- `GET /api/images/{id}` - Get image

---

## Implementation Phases

### Phase 1 - Core (MVP)
1. User registration/login with JWT
2. Category listing
3. Create/view posts
4. Add comments to posts
5. Basic Docker setup

### Phase 2 - Enhanced
1. Rich text editor for posts
2. Image upload for posts/avatars
3. Post search functionality
4. User profiles
5. Pagination

### Phase 3 - Advanced
1. Nested comments
2. Post view count
3. User roles (moderator, admin)
4. Post edit/delete by owner
5. Category management

---

## Docker MySQL Container

**Container Name:** forum-mysql
**Port:** 127.0.0.1:3306 (localhost only)
**Database:** forum_db
**Credentials:**
- Root: root / root
- User: forum_user / root

---

## Running the App

**Backend:** Port 8082
```bash
cd backend && mvn spring-boot:run
```

**Frontend:** Port 5173 (Vite dev server)
```bash
cd frontend && npm run dev
```