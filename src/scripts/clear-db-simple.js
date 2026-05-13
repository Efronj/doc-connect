const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up database...');
  
  try {
    const deleteComments = await prisma.comment.deleteMany({});
    console.log(`Deleted ${deleteComments.count} comments.`);
    
    const deleteLikes = await prisma.like.deleteMany({});
    console.log(`Deleted ${deleteLikes.count} likes.`);
    
    const deletePosts = await prisma.post.deleteMany({});
    console.log(`Deleted ${deletePosts.count} posts.`);
    
    const deleteUsers = await prisma.user.deleteMany({});
    console.log(`Deleted ${deleteUsers.count} users.`);

    console.log('Database cleared successfully!');
  } catch (error) {
    console.error('Error clearing database:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
