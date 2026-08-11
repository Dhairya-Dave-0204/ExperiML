# Prisma + PostgreSQL Connection Management

## Overview

Prisma acts as the database access layer between the Node.js/Express backend and PostgreSQL.

The general architecture is:

```text
Express Backend
       │
       ▼
Prisma Client
       │
       ▼
Connection Pool
       │
       ▼
PostgreSQL
```

Prisma handles database interaction so application code does not need to manually open, use, and close PostgreSQL connections for every query.

---

## 1. How Prisma Connects to PostgreSQL

Prisma requires a PostgreSQL connection URL.

Conceptually:

```text
postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

Example:

```text
postgresql://postgres:password@localhost:5432/experiml
```

The connection information should be stored in an environment variable rather than hardcoded in application code.

```env
DATABASE_URL="postgresql://..."
```

Prisma uses this configuration to establish communication with PostgreSQL.

---

## 2. Prisma's Position in the Backend

The typical request flow is:

```text
Express Controller
       │
       ▼
Service Layer
       │
       ▼
Prisma Client
       │
       ▼
Connection Pool
       │
       ▼
PostgreSQL
```

For example:

```js
const user = await prisma.user.findUnique({
  where: {
    email,
  },
});
```

The application does not manually:

1. Open a PostgreSQL connection
2. Send a SQL query
3. Receive the result
4. Close the connection

Prisma handles the database interaction.

---

## 3. Connection Pooling

Prisma normally works with a pool of database connections rather than a single connection.

```text
Connection Pool

┌─────┬─────┬─────┬─────┐
│ C1  │ C2  │ C3  │ C4  │ ...
└─────┴─────┴─────┴─────┘
          │
          ▼
      PostgreSQL
```

When multiple requests need the database, available connections can be used concurrently.

```text
Request A ──► C1
Request B ──► C2
Request C ──► C3
```

After the queries finish, the connections become available for subsequent queries.

---

## 4. Why Use a Connection Pool?

Creating a brand-new database connection for every query would be inefficient.

Without pooling:

```text
Query
  ↓
Open connection
  ↓
Execute query
  ↓
Close connection

Query
  ↓
Open connection
  ↓
Execute query
  ↓
Close connection
```

With pooling:

```text
Connection Pool
      │
      ├── C1
      ├── C2
      ├── C3
      └── C4

Requests borrow available connections.

After a query finishes:

Connection
      ↓
Returned to pool
      ↓
Available for another request
```

This reduces connection-establishment overhead and allows multiple requests to use the database efficiently.

---

## 5. Is the Connection Active or Passive?

Prisma is primarily **demand-driven/lazy**.

Creating a Prisma Client does not necessarily mean that the entire connection pool is immediately established.

Conceptually:

```text
Server starts
      │
      ▼
PrismaClient created
      │
      ▼
No database query
      │
      ▼
No immediate need to establish database connections
```

When database work is required:

```text
Database query
      │
      ▼
Prisma establishes/uses database connections
      │
      ▼
Query executes
```

Therefore, Prisma does not continuously poll PostgreSQL just to determine whether the database is available.

It is not continuously monitoring PostgreSQL.

---

## 6. Does a Connection Close After Every Query?

No.

Connections are normally reused through the connection pool.

```text
Request A
   │
   ▼
Connection C1
   │
   ▼
Query completes
   │
   ▼
C1 becomes available again
```

Another request can subsequently use C1.

This is much more efficient than opening and closing a PostgreSQL connection for every query.

---

## 7. Can the Pool Size Be Modified?

Yes.

The exact configuration depends on the Prisma version and database driver.

For older Prisma versions, connection-pool configuration could be supplied through the PostgreSQL connection URL using parameters such as:

```text
connection_limit
pool_timeout
connect_timeout
```

Example:

```text
DATABASE_URL="postgresql://...?connection_limit=5"
```

For current Prisma versions using driver adapters, connection-pool configuration can depend on the underlying PostgreSQL driver.

For example, the PostgreSQL `pg` driver exposes settings such as:

```text
max
connectionTimeoutMillis
idleTimeoutMillis
maxLifetimeSeconds
```

Therefore, pool configuration should always be based on the Prisma version and driver being used rather than copied blindly from an older tutorial.

---

## 8. Why Pool Size Matters

PostgreSQL has a finite number of connections available.

Suppose:

```text
PostgreSQL maximum connections = 100
```

If several application instances each maintain their own connection pools, their combined connections can consume the database's available capacity.

For example:

```text
Express Instance 1 → 20 connections
Express Instance 2 → 20 connections
Express Instance 3 → 20 connections
Express Instance 4 → 20 connections
Express Instance 5 → 20 connections
```

Total:

```text
100 connections
```

This leaves no capacity for other database clients.

Therefore, pool size must be considered alongside:

- Database connection limit
- Number of application instances
- Expected concurrency
- Application workload
- Deployment architecture

---

## 9. What Happens When All Connections Are Busy?

Suppose the pool has five connections:

```text
Pool size = 5

C1 → busy
C2 → busy
C3 → busy
C4 → busy
C5 → busy
```

Another request arrives:

```text
Request #6
     │
     ▼
No connection available
```

The request may wait for a connection to become available.

```text
Request
   │
   ▼
No free connection
   │
   ▼
Wait
   │
   ├── Connection becomes available
   │       │
   │       ▼
   │    Execute query
   │
   └── Timeout
           │
           ▼
        Error
```

The relevant timeout configuration depends on the Prisma version and underlying driver.

---

## 10. Can Prisma Explicitly Connect?

Yes.

Prisma can establish a database connection explicitly with:

```js
await prisma.$connect();
```

However, explicit connection is not always required because Prisma can establish connections lazily when database work is performed.

For ExperiML, we may choose to explicitly verify the database connection during application startup.

Conceptually:

```text
Server starts
      │
      ▼
Load environment
      │
      ▼
Initialize Prisma
      │
      ▼
Connect / verify database
      │
      ▼
Start Express server
      │
      ▼
Accept requests
```

This can make database availability failures visible during startup rather than only after the first database request.

---

## 11. Disconnecting Prisma

Prisma provides:

```js
await prisma.$disconnect();
```

This closes the database connections managed by the Prisma Client.

However, this should **not** be done after every request.

Incorrect:

```text
Request
  ↓
Query
  ↓
$disconnect()
```

This would repeatedly destroy and recreate database connections and hurt performance.

Instead, a long-running Express application should keep its Prisma Client available while the application is running.

---

## 12. One PrismaClient or Multiple?

For the ExperiML Express backend, we should use a **single shared PrismaClient instance**.

Recommended architecture:

```text
src/
└── prisma/
    └── client.js
```

Conceptually:

```text
                    PrismaClient
                         │
                         ▼
                  Connection Pool
                         │
                         ▼
                    PostgreSQL
```

All services use the same Prisma Client:

```text
auth.service.js ──────────┐
project.service.js ──────┤
dataset.service.js ──────┤
experiment.service.js ───┤
artifact.service.js ─────┤
prediction.service.js ───┘
                │
                ▼
          Same PrismaClient
                │
                ▼
          Same Connection Pool
```

Avoid creating a new PrismaClient inside every service.

Bad pattern:

```js
// auth.service.js
const prisma = new PrismaClient();

// project.service.js
const prisma = new PrismaClient();

// dataset.service.js
const prisma = new PrismaClient();
```

This can create multiple connection pools and unnecessarily consume PostgreSQL connections.

---

## 13. ExperiML Database Architecture

The planned ExperiML architecture can therefore be visualized as:

```text
                         Express Backend
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
     Auth Service       Project Service      Dataset Service
          │                    │                    │
          └────────────────────┼────────────────────┘
                               │
                               ▼
                        Prisma Client
                        (single instance)
                               │
                               ▼
                        Connection Pool
                     ┌─────┬─────┬─────┐
                     │ C1  │ C2  │ C3  │ ...
                     └─────┴─────┴─────┘
                               │
                               ▼
                          PostgreSQL
```

---

## 14. Database Query Lifecycle

A typical database request follows this lifecycle:

```text
Frontend Request
      │
      ▼
Express Route
      │
      ▼
Controller
      │
      ▼
Service
      │
      ▼
Prisma Client
      │
      ▼
Acquire Available Connection
      │
      ▼
Execute Database Query
      │
      ▼
Return Result
      │
      ▼
Connection Becomes Available
      │
      ▼
Service
      │
      ▼
Controller
      │
      ▼
HTTP Response
      │
      ▼
Frontend
```

---

## 15. Important Mental Model

The easiest way to remember Prisma's connection behavior is:

```text
PrismaClient
     │
     ▼
Connection Pool
     │
     ├── Connection 1
     ├── Connection 2
     ├── Connection 3
     ├── Connection 4
     └── ...
     │
     ▼
PostgreSQL
```

The application does not normally manage individual PostgreSQL connections manually.

Instead:

```text
Application
     │
     ▼
Prisma
     │
     ▼
Pool management
     │
     ▼
PostgreSQL
```

---

## 16. Key Takeaways

1. **Prisma is the database access layer** between the Node.js application and PostgreSQL.
2. **Prisma normally uses connection pooling**, not a single permanent database connection.
3. **Connections are reusable.** A connection used for one query can later serve another query.
4. **Prisma is primarily demand-driven.** It does not continuously poll PostgreSQL just to monitor it.
5. **A PrismaClient can connect lazily** when database work is required.
6. **Pool size is configurable**, but the exact configuration depends on the Prisma version and underlying database driver.
7. **Pool size must account for the total number of application instances** and PostgreSQL's connection capacity.
8. **Do not disconnect after every query.**
9. **Use one shared PrismaClient instance** for the long-running Express application.
10. **Explicit `$connect()` and `$disconnect()` are available** when application lifecycle management requires them.

---

## 17. ExperiML Implementation Decision

For ExperiML, the intended architecture is:

```text
Node.js + Express
        │
        ▼
   Single PrismaClient
        │
        ▼
   Connection Pool
        │
        ▼
    PostgreSQL
```

The ML service will remain separate:

```text
Node.js + Express
        │
        ├──────────► PostgreSQL
        │
        └──────────► FastAPI ML Service
```

The Node.js backend will remain responsible for application/business operations, while FastAPI will later handle ML-specific operations.

---

## 18. Version Note

Prisma's connection architecture and configuration options can change between major versions.

When implementing the ExperiML backend, use the documentation corresponding to the exact Prisma version installed in the project rather than relying on configuration examples from older tutorials.

---

## References

- Prisma ORM documentation: https://docs.prisma.io/docs/orm
- Prisma connection pooling: https://docs.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections/connection-pool
- Prisma connection management: https://docs.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections/connection-management
