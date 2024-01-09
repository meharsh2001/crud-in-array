# Express MongoDB CRUD Operations

This project demonstrates basic CRUD operations using Express.js and MongoDB. The application focuses on handling tenants, with features like insertion, retrieval, updating, and deletion of tenant records.

## Project Structure

- **Database Module (`database.js`):**
  - Handles MongoDB connections and provides functions for CRUD operations.
- **Express App (`app.js`):**
  - Sets up an Express application.
  - Configures session management with MongoDB using `express-session` and `connect-mongodb-session`.
  - Implements CRUD operations for managing tenant records.
  - Uses the `database` module to interact with MongoDB.
- **Environment Variables (`.env`):**
  - Contains the MongoDB connection string.

## Express App Routes

1. **Insert Record (`/`):**

   - Inserts a new tenant record into the MongoDB collection.
   - The inserted record includes details such as `_id`, `_tenantId`, `_accessibleTenants`, and `_defaultTenantId`.

2. **Update Record (`/update`):**

   - Updates a specific tenant record by adding a new entry to the `_accessibleTenants` array.
   - The update includes details such as `_tenantId`, `role`, `secid`, `_isDeleted`, and `name`.

3. **Retrieve Record (`/retrieve`):**

   - Retrieves tenant records based on specified conditions.
   - Uses the `retrieve` function from the `database` module to fetch records where `_accessibleTenants` match the provided criteria.

4. **Delete Record (`/delete`):**

   - Deletes a specific tenant record by setting `_isDeleted` to `true` in the `_accessibleTenants` array.
   - Uses the `updateOne` method from the MongoDB collection.

## Usage

1. Ensure that MongoDB is running and accessible.
2. Set the MongoDB connection string in the `.env` file.
3. Install dependencies: `npm install`.
4. Run the application: `node app.js`.
5. Access the CRUD operations through the specified routes.

## Note

- This project assumes the presence of a `database` module (not provided) that handles MongoDB connections and CRUD operations.
- Ensure that the required modules (`express`, `express-session`, `connect-mongodb-session`, and `mongodb`) are installed.

## Links

- **GitHub Repository:** [express-mongodb-crud](https://chat.openai.com/c/0096860e-1138-4400-9732-a1a859dbdba1#)
- **Analysis Sheet:** [MongoDB CRUD Analysis Sheet](https://chat.openai.com/c/0096860e-1138-4400-9732-a1a859dbdba1#)
