export const DEFAULT_ADMIN = {
  id: '1',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin' as const,
  avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff'
};

// at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:644:26)
// at ModuleJob.run (node:internal/modules/esm/module_job:274:25)
// at file:///opt/render/project/src/server.js:71:1
// at startServer (file:///opt/render/project/src/server.js:47:20)
// at Mongoose.connect (/opt/render/project/src/node_modules/mongoose/lib/index.js:416:15)
// at NativeConnection.openUri (/opt/render/project/src/node_modules/mongoose/lib/connection.js:766:34)
// at NativeConnection.createClient (/opt/render/project/src/node_modules/mongoose/lib/drivers/node-mongodb-native/connection.js:206:11)
// MongoDB connection error: MongooseError: The `uri` parameter to `openUri()` must be a string, got "undefined". Make sure the first parameter to `mongoose.connect()` or `mongoose.createConnection()` is a string.
// > node --no-deprecation server.js
// > sembeza-backend@1.0.0 start

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  ENDPOINTS: {
    AUTH: '/api/auth',
    PRODUCTS: '/api/products',
    ORDERS: '/api/orders',
    USERS: '/api/users',
    HEALTH: '/api/health'
  }
};