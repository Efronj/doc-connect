import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up database...');
  
  // Clear sessions/tokens first if they were in DB (though they are JWT)
  // Clear all users
  const deleteUsers = await prisma.user.deleteMany({});
  console.log(`Deleted ${deleteUsers.count} users.`);
  
  // Clear all posts and comments to be thorough
  const deleteComments = await prisma.comment.deleteMany({});
  console.log(`Deleted ${deleteComments.count} comments.`);
  
  const deletePosts = await prisma.post.deleteMany({});
  console.log(`Deleted ${deletePosts.count} posts.`);

  console.log('Database cleared successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
