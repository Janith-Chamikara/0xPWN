import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Rewards...');

  const rewards = [
    {
      name: 'Bronze Medal',
      description: 'Awarded for completing your first challenge!',
      imageUrl: 'bafkreievwi5na57p6nt7t7prp46l5sx4xgc4ornlwqzxxjn52pzpci5fcq',
      rarity: 'RARE',
    },
    {
      name: 'Silver Medal',
      description: 'Awarded for completing 5 challenges!',
      imageUrl: 'bafkreigl5bwgti7aue7fvqgtavn3q3mvrw5mmr5aiy2ylv4gntoqami6qa',
      rarity: 'RARE',
    },
    {
      name: 'Gold Medal',
      description: 'Awarded for completing 10 challenges!',
      imageUrl: 'bafkreigytec7zyr32eu7oladfjv463pc2ivbjdtmsvyqncgym4larsaicu',
      rarity: 'RARE',
    },
    {
      name: 'Platinum Medal',
      description: 'Awarded for completing 25 challenges!',
      imageUrl: 'bafkreictas5jnbz4gvx54kf5jnbob4c3e3z57ktvrhrvddf44yok3z2x5e',
      rarity: 'EPIC',
    },
    {
      name: 'Diamond Medal',
      description: 'Awarded for completing 50 challenges!',
      imageUrl: 'bafkreig5rwkoj3grc2fl2uddyihgz7tvhztkehfm4lbhij4qnupu3v2mha',
      rarity: 'LEGENDARY',
    },
    {
      name: 'Legendary Medal',
      description: 'Awarded for completing 100 challenges!',
      imageUrl: 'bafkreibxcctqeegpn6a5zhzxhlpxsmoshnqywapvwzupijmjyiot33pdba',
      rarity: 'MYTHIC',
    },
    {
      name: 'Champion Badge',
      description: 'Awarded for reaching 500 points!',
      imageUrl: 'bafkreifxcuciwb35duvy37gjm7lhliguzui2apgw5eka6heklhsrsstile',
      rarity: 'LEGENDARY',
    },
  ];

  // Create all rewards
  for (const reward of rewards) {
    await prisma.rewardCatalog.create({
      data: reward,
    });
  }

  console.log(`✅ Created ${rewards.length} rewards`);

  console.log('Seeding Challenge Categories...');

  const categories = [
    {
      name: 'Web Exploitation',
      description:
        'Challenges that focus on exploiting web applications and finding vulnerabilities.',
    },
    {
      name: 'Cryptography',
      description:
        'Challenges that involve encryption, decryption, and cryptographic protocols.',
    },
    {
      name: 'Reverse Engineering',
      description:
        'Challenges that involve analyzing and breaking down compiled programs.',
    },
    {
      name: 'Forensics',
      description:
        'Challenges related to analyzing digital evidence and extracting information.',
    },
    {
      name: 'Steganography',
      description:
        'Challenges that involve hiding information within different types of media.',
    },
    {
      name: 'Binary Exploitation',
      description:
        'Challenges that involve exploiting vulnerabilities in compiled code and binary programs.',
    },
    {
      name: 'Networking',
      description:
        'Challenges that involve exploiting network protocols and services.',
    },
    {
      name: 'OSINT',
      description:
        'Challenges that require using open-source intelligence techniques to gather information.',
    },
    {
      name: 'Miscellaneous',
      description:
        'Miscellaneous challenges that do not fit into any specific category.',
    },
    {
      name: 'Cryptoanalysis',
      description:
        'Challenges focusing on breaking or analyzing cryptographic algorithms.',
    },
  ];

  // Create all categories
  for (const category of categories) {
    await prisma.category.create({
      data: category,
    });
  }

  console.log(`✅ Created ${categories.length} challenge categories`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
