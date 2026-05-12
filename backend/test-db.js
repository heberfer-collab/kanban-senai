const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.user.findMany().then(res => console.log('OK', res.length)).catch(e => console.error(e));
