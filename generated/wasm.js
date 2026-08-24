
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime,
  createParam,
} = require('./runtime/wasm.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.4.1
 * Query Engine version: a9055b89e58b4b5bfb59600785423b1db3d0e75d
 */
Prisma.prismaVersion = {
  client: "6.4.1",
  engine: "a9055b89e58b4b5bfb59600785423b1db3d0e75d"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}





/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  password: 'password',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.ProjectScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  start_date: 'start_date',
  end_date: 'end_date',
  owner_id: 'owner_id',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.ProjectMemberScalarFieldEnum = {
  id: 'id',
  project_id: 'project_id',
  user_id: 'user_id',
  created_at: 'created_at'
};

exports.Prisma.TaskScalarFieldEnum = {
  id: 'id',
  project_id: 'project_id',
  assignee_id: 'assignee_id',
  title: 'title',
  description: 'description',
  status: 'status',
  priority: 'priority',
  due_date: 'due_date',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  title: 'title',
  status: 'status'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  name: 'name',
  price: 'price',
  category_id: 'category_id'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.UserOrderByRelevanceFieldEnum = {
  name: 'name',
  email: 'email',
  password: 'password'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.ProjectOrderByRelevanceFieldEnum = {
  name: 'name',
  description: 'description'
};

exports.Prisma.TaskOrderByRelevanceFieldEnum = {
  title: 'title',
  description: 'description'
};

exports.Prisma.CategoryOrderByRelevanceFieldEnum = {
  title: 'title'
};

exports.Prisma.ProductOrderByRelevanceFieldEnum = {
  name: 'name'
};
exports.TaskStatus = exports.$Enums.TaskStatus = {
  todo: 'todo',
  doing: 'doing',
  done: 'done'
};

exports.TaskPriority = exports.$Enums.TaskPriority = {
  low: 'low',
  medium: 'medium',
  high: 'high'
};

exports.Prisma.ModelName = {
  User: 'User',
  Project: 'Project',
  ProjectMember: 'ProjectMember',
  Task: 'Task',
  Category: 'Category',
  Product: 'Product'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "C:\\User\\Dev\\Practice\\Module 4\\SRS\\generated",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      }
    ],
    "previewFeatures": [
      "driverAdapters"
    ],
    "sourceFilePath": "C:\\User\\Dev\\Practice\\Module 4\\SRS\\prisma\\schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null,
    "schemaEnvPath": "../.env"
  },
  "relativePath": "../prisma",
  "clientVersion": "6.4.1",
  "engineVersion": "a9055b89e58b4b5bfb59600785423b1db3d0e75d",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "mysql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "generator client {\n  provider        = \"prisma-client-js\"\n  previewFeatures = [\"driverAdapters\"]\n  output          = \"../generated\"\n}\n\ndatasource db {\n  provider = \"mysql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nenum TaskStatus {\n  todo\n  doing\n  done\n}\n\nenum TaskPriority {\n  low\n  medium\n  high\n}\n\nmodel User {\n  id         Int      @id @default(autoincrement())\n  name       String   @db.VarChar(255)\n  email      String   @unique @db.VarChar(255)\n  password   String   @db.VarChar(255)\n  created_at DateTime @default(now())\n  updated_at DateTime @updatedAt\n\n  owned_projects  Project[]       @relation(\"ProjectOwner\")\n  member_projects ProjectMember[]\n  assigned_tasks  Task[]          @relation(\"TaskAssignee\")\n\n  @@map(\"users\")\n}\n\nmodel Project {\n  id          Int       @id @default(autoincrement())\n  name        String    @db.VarChar(255)\n  description String?   @db.Text\n  start_date  DateTime? @db.Date\n  end_date    DateTime? @db.Date\n  owner_id    Int\n  created_at  DateTime  @default(now())\n  updated_at  DateTime  @updatedAt\n\n  owner   User            @relation(\"ProjectOwner\", fields: [owner_id], references: [id], onDelete: Cascade)\n  members ProjectMember[]\n  tasks   Task[]\n\n  @@map(\"projects\")\n}\n\nmodel ProjectMember {\n  id         Int      @id @default(autoincrement())\n  project_id Int\n  user_id    Int\n  created_at DateTime @default(now())\n\n  project Project @relation(fields: [project_id], references: [id], onDelete: Cascade)\n  user    User    @relation(fields: [user_id], references: [id], onDelete: Cascade)\n\n  @@unique([project_id, user_id])\n  @@map(\"project_members\")\n}\n\nmodel Task {\n  id          Int          @id @default(autoincrement())\n  project_id  Int\n  assignee_id Int?\n  title       String       @db.VarChar(255)\n  description String?      @db.Text\n  status      TaskStatus   @default(todo)\n  priority    TaskPriority @default(medium)\n  due_date    DateTime?    @db.Date\n  created_at  DateTime     @default(now())\n  updated_at  DateTime     @updatedAt\n\n  project  Project @relation(fields: [project_id], references: [id], onDelete: Cascade)\n  assignee User?   @relation(\"TaskAssignee\", fields: [assignee_id], references: [id], onDelete: SetNull)\n\n  @@map(\"tasks\")\n}\n\nmodel Category {\n  id       Int       @id @default(autoincrement())\n  title    String\n  status   Boolean\n  products Product[]\n}\n\nmodel Product {\n  id          Int      @id @default(autoincrement())\n  name        String\n  price       Float\n  category_id Int\n  category    Category @relation(fields: [category_id], references: [id])\n}\n",
  "inlineSchemaHash": "eb9f6332220210e1de1a37178e04321e3108c32b78c25490b2770fb7a4c969a2",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"password\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"created_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"owned_projects\",\"kind\":\"object\",\"type\":\"Project\",\"relationName\":\"ProjectOwner\"},{\"name\":\"member_projects\",\"kind\":\"object\",\"type\":\"ProjectMember\",\"relationName\":\"ProjectMemberToUser\"},{\"name\":\"assigned_tasks\",\"kind\":\"object\",\"type\":\"Task\",\"relationName\":\"TaskAssignee\"}],\"dbName\":\"users\"},\"Project\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"start_date\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"end_date\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"owner_id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"created_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"owner\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ProjectOwner\"},{\"name\":\"members\",\"kind\":\"object\",\"type\":\"ProjectMember\",\"relationName\":\"ProjectToProjectMember\"},{\"name\":\"tasks\",\"kind\":\"object\",\"type\":\"Task\",\"relationName\":\"ProjectToTask\"}],\"dbName\":\"projects\"},\"ProjectMember\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"project_id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"user_id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"created_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"project\",\"kind\":\"object\",\"type\":\"Project\",\"relationName\":\"ProjectToProjectMember\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ProjectMemberToUser\"}],\"dbName\":\"project_members\"},\"Task\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"project_id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"assignee_id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"TaskStatus\"},{\"name\":\"priority\",\"kind\":\"enum\",\"type\":\"TaskPriority\"},{\"name\":\"due_date\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"created_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"project\",\"kind\":\"object\",\"type\":\"Project\",\"relationName\":\"ProjectToTask\"},{\"name\":\"assignee\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"TaskAssignee\"}],\"dbName\":\"tasks\"},\"Category\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"products\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"CategoryToProduct\"}],\"dbName\":null},\"Product\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"price\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"category_id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"category\",\"kind\":\"object\",\"type\":\"Category\",\"relationName\":\"CategoryToProduct\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = {
  getRuntime: () => require('./query_engine_bg.js'),
  getQueryEngineWasmModule: async () => {
    const loader = (await import('#wasm-engine-loader')).default
    const engine = (await loader).default
    return engine 
  }
}
config.compilerWasm = undefined

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

