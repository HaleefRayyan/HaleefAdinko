# Install

## Prerequisites

- [Node.js](https://nodejs.org) v18 or later
- [MySQL](https://www.mysql.com) v8 or later
- [nodemon](https://nodemon.io) (installed automatically as a dependency)

## 1. Clone the repository

```bash
git clone https://github.com/haleef/haleefadinko.git
cd haleefadinko
```

## 2. Install dependencies

```bash
npm install
```

This installs:

| Package | Purpose |
|---|---|
| `express` | HTTP server framework |
| `mysql2` | MySQL database driver |
| `dotenv` | Environment variable loader |
| `multer` | File upload middleware |
| `nodemon` | Auto-restart on file changes |

## 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=3000

DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=haleefadinko
```

> **Note:** `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD`, and `DB_NAME` are all required. The server will fail to connect to the database if any of these are missing.

## 4. Set up the database

Create the database in MySQL, then run your schema migrations:

```sql
CREATE DATABASE haleefadinko;
```

Make sure your tables (`portfolio`, `kategori_layanan`, `contact`, `testimoni`) exist before starting the server.

## 5. Start the server

```bash
npm start
```

This runs `nodemon src/index.js`. The server will be available at `http://localhost:3000` (or whichever `PORT` you set).

You should see:

```
Server berhasil di running di port 3000
```

## Static assets

Images uploaded via the API are served from `/assets`. Place files under `public/images/` and they will be accessible at:

```
http://localhost:3000/assets/<filename>
```
