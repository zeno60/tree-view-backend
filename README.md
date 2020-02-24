Backend services for tree-view application.  The application is written in typescript and uses an express server to host restful routes to update the tree.  Tree data is persisted in a backend postgres database and uses typeorm to create and update database entities.

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode on port 3000. Use the ```DB_PASSWORD``` environment variable to connect to backend postgres database.