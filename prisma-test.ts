import prisma from './lib/prisma';

const testConnection = async () => {
  try {
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log('データベース接続成功:', result);
  } catch (e) {
    console.error('データベース接続エラー:', e);
  } finally {
    await prisma.$disconnect();
  }
};

testConnection();