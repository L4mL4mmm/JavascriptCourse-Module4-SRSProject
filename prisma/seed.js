const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('123456', 10);

  const user1 = await prisma.user.create({
    data: {
      name: 'Nguyen Van A',
      email: 'vana@example.com',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Tran Thi B',
      email: 'thib@example.com',
      password: hashedPassword,
    },
  });

  await prisma.project.create({
    data: {
      name: 'Task Management App',
      description: 'Project building Node.js APIs',
      owner_id: user1.id,
      members: {
        create: [{ user_id: user2.id }],
      },
      tasks: {
        create: [
          {
            title: 'Design Schema',
            description: 'Setup Prisma and ERD',
            status: 'done',
            priority: 'high',
            assignee_id: user1.id,
          },
          {
            title: 'Implement Auth APIs',
            description: 'JWT and bcrypt',
            status: 'todo',
            priority: 'medium',
            assignee_id: user2.id,
          },
        ],
      },
    },
  });

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });