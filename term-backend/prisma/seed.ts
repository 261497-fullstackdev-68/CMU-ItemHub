import {
  PrismaClient,
  Role,
  accountType,
  LoanStatus,
  Equipment,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // --- Create Categories ---
  const categoryNames = [
    'Electronics',
    'Tools',
    'Sports',
    'Laboratory',
    'Audio Equipment',
    'Other',
  ];
  const categories = await Promise.all(
    categoryNames.map((name) =>
      prisma.category.create({
        data: {
          categoryName: name,
          description: `Items related to ${name}`,
        },
      }),
    ),
  );
  console.log(`✅ Created ${categories.length} categories`);

  // --- Create Organizations ---
  const orgNames = ['TechU Engineering', 'Science Lab', 'Media Department'];
  const organizations = await Promise.all(
    orgNames.map((name) =>
      prisma.organization.create({
        data: {
          name,
          imageName: `${name.replace(/\s+/g, '_').toLowerCase()}.jpg`,
          imageUrl: `https://picsum.photos/seed/${name.replace(/\s+/g, '')}/400/300`,
        },
      }),
    ),
  );
  console.log(`✅ Created ${organizations.length} organizations`);

  // --- Create Users ---
  const admin = await prisma.user.create({
    data: {
      preName: 'Mr.',
      firstname: 'System',
      lastname: 'Admin',
      email: 'admin234@example.com',
      faculty: 'IT Department',
      accountType: accountType.MISEmpAcc,
      roles: {
        create: [{ role: Role.SYSTEM_ADMIN }],
      },
    },
  });

  const borrower = await prisma.user.create({
    data: {
      preName: 'Ms.',
      firstname: 'Alice',
      lastname: 'Borrower',
      email: 'alice2d2@example.com',
      faculty: 'Science',
      accountType: accountType.StdAcc,
      studentID: '65123456234',
      roles: {
        create: [{ role: Role.USER }],
      },
    },
  });

  console.log(`✅ Created admin and borrower users`);

  // --- Create Equipment for each Organization ---
  const equipmentItems: Equipment[] = []; // 👈 Explicitly typed

  for (const org of organizations) {
    for (let i = 1; i <= 3; i++) {
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];
      const item = await prisma.equipment.create({
        data: {
          organizationId: org.id,
          categoryId: randomCategory.id,
          name: `${org.name} Item ${i}`,
          description: `Equipment ${i} of ${org.name}`,
          totalQuantity: Math.floor(Math.random() * 10) + 1,
          isAvailable: true,
          imageName: `item_${org.id}_${i}.jpg`,
          imageUrl: `https://picsum.photos/seed/${org.id}_${i}/400/300`,
        },
      });
      equipmentItems.push(item);
    }
  }
  console.log(`✅ Created ${equipmentItems.length} equipment items`);

  // --- Create Sample Loan ---
  await prisma.equipmentLoan.create({
    data: {
      equipmentId: equipmentItems[0].id,
      borrowerId: borrower.id,
      amount: 1,
      status: LoanStatus.pending,
      note: 'For lab use',
    },
  });

  console.log('✅ Created one sample loan');
  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
