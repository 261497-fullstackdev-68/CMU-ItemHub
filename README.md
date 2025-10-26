# CMU-ItemHub / CampusBorrow

this project is about lending available item system from organization in CMU campus scope

# Team member

- Thiranat Kakanmee 650610762
- Tayakorn Aowrattanakul 650610763
- Natwara Chaiyasit 660610758

# Tech Stack

Frontend

- Framework: Next.js 15 (React 19)
- Language: TypeScript
- Styling: Tailwind CSS 4, Styled JSX
- HTTP Client: Axios
- Icons: Lucide React
- Auth / Token Handling: JSON Web Token (jsonwebtoken)
- Linting / Code Quality: ESLint (Next.js config)

Backend

- Framework: NestJS 11 (Node.js)
- Language: TypeScript
- ORM: Prisma 6
- Database: PostgreSQL
- Authentication: Passport + JWT
- File Storage: MinIO (S3-compatible object storage)
- Validation: class-validator, class-transformer
- Configuration Management: @nestjs/config
- HTTP Client: Axios
- Utilities: cookie-parser, reflect-metadata, RxJS
- Testing: Jest, Supertest
- Linting / Formatting: ESLint, Prettier

DevOps / Deployment

- Containerization: Docker, Docker Compose
- Package Managers: pnpm (backend), npm (frontend)
- Environment Management: .env + .env.local
- Database Migration / Seeding: Prisma CLI
- Version Control: Git (GitHub Repository)

# After clone this repo

- run "docker compose up" for deployment
- for developement cd in each folder and run "pnpm i"
- for backend due to using prisma run "npx prisma generate"

please check your env first

- to run frontend in local cd in frontend then run "pnpm dev"
- to run backend in local cd in backend then run "pnpm start:dev"

- if you want to set your role to system admin of app connect to your database and manually set it

# For seeding the seed data in database

- in backend docker container run "pnpm seed"
