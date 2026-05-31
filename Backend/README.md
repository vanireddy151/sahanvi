# Sahanvi Backend

## MongoDB Setup

The backend expects MongoDB from `MONGODB_URI` in `.env`.

For this project, `.env` is configured for MongoDB Atlas and the database name is `sahanvi_handlooms`.

Run these commands after MongoDB is installed and running:

```powershell
cd Q:\Sahanvi\Backend
npm.cmd run setup:db
npm.cmd run seed:admins
npm.cmd start
```

`setup:db` creates/initializes the database collections and indexes.

`seed:admins` creates the approved admin users from `.env`.

If you change MongoDB Atlas users or clusters later, replace `MONGODB_URI` in `.env` with the new Atlas connection string, then run the same commands.

## Optional Docker MongoDB

If Docker is available, you can start MongoDB with:

```powershell
cd Q:\Sahanvi\Backend
docker compose up -d
npm.cmd run setup:db
npm.cmd run seed:admins
npm.cmd start
```
