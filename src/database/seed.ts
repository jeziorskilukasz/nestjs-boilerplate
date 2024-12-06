import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { AuthProvidersEnum } from '../modules/auth/auth-providers.enum';
import { RoleNameEnum } from '../roles/roles.enum';
import { StatusNameEnum } from '../statuses/statuses.enum';

const prisma = new PrismaClient();

const USER_EMAIL = 'l.nest@redis.com';
const ADMIN_EMAIL = 'l.nest+admin@redis.com';
const INACTIVE_EMAIL = 'l.nest+inactive@redis.com';
const PERSONAL_DATA = {
  firstName: 'Luke',
  lastName: 'Nest',
};
const SAMPLE_PASSWORD = 'Qwerty1!';
const POLICY_VERSION = '1.0';

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: RoleNameEnum.admin },
    update: {},
    create: { name: RoleNameEnum.admin },
  });

  const userRole = await prisma.role.upsert({
    where: { name: RoleNameEnum.user },
    update: {},
    create: { name: RoleNameEnum.user },
  });

  const activeStatus = await prisma.status.upsert({
    where: { name: StatusNameEnum.active },
    update: {},
    create: { name: StatusNameEnum.active },
  });

  const inactiveStatus = await prisma.status.upsert({
    where: { name: StatusNameEnum.inactive },
    update: {},
    create: { name: StatusNameEnum.inactive },
  });

  const adminRoleId = (
    await prisma.role.findUnique({ where: { name: RoleNameEnum.admin } })
  ).id;

  const userRoleId = (
    await prisma.role.findUnique({ where: { name: RoleNameEnum.user } })
  ).id;

  const activeStatusId = (
    await prisma.status.findUnique({ where: { name: StatusNameEnum.active } })
  ).id;

  const inActiveStatusId = (
    await prisma.status.findUnique({ where: { name: StatusNameEnum.inactive } })
  ).id;

  const users = [
    {
      email: USER_EMAIL,
      provider: AuthProvidersEnum.email,
      role: userRoleId,
      status: activeStatusId,
      ...PERSONAL_DATA,
    },
    {
      email: ADMIN_EMAIL,
      provider: AuthProvidersEnum.email,
      role: adminRoleId,
      status: inActiveStatusId,
      ...PERSONAL_DATA,
    },
    {
      email: INACTIVE_EMAIL,
      provider: AuthProvidersEnum.email,
      role: userRoleId,
      status: inActiveStatusId,
      ...PERSONAL_DATA,
    },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(SAMPLE_PASSWORD, 10);
    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: hashedPassword,
        provider: user.provider,
        roleId: user.role,
        statusId: user.status,
      },
    });

    await prisma.article.upsert({
      where: {
        title: `Our company Introduces MongoDB Support by ${createdUser.email}`,
      },
      update: {
        authorId: createdUser.id,
      },
      create: {
        title: `Our company Introduces MongoDB Support by ${createdUser.email}`,
        body: 'At Our company, we understand the evolving needs of our clients and strive to support a wide range of technologies. We are excited to announce that our development tools now include full support for MongoDB, offering enhanced flexibility and performance for our projects.',
        description:
          'This update signifies our commitment to diversifying our tech stack and providing comprehensive solutions to meet our clients’ needs. MongoDB support opens up new possibilities for application development at Our company.',
        published: false,
        authorId: createdUser.id,
      },
    });

    await prisma.article.upsert({
      where: {
        title: `Our company Tech Update: Q1 Highlights by ${createdUser.email}`,
      },
      update: {
        authorId: createdUser.id,
      },
      create: {
        title: `Our company Tech Update: Q1 Highlights by ${createdUser.email}`,
        body: 'The first quarter has been busy at Our company, with our team focused on enhancing our service offerings. From new tool integrations to performance optimizations, we’ve implemented a series of improvements to ensure we stay at the forefront of technology.',
        description:
          'This quarterly update provides a glimpse into the latest developments within our ecosystem, showcasing how Our company continues to innovate and lead in the digital solutions space.',
        published: true,
        authorId: createdUser.id,
      },
    });

    await prisma.article.upsert({
      where: {
        title: `Enhancing Client Solutions with Flexible Tools by ${createdUser.email}`,
      },
      update: {
        authorId: createdUser.id,
      },
      create: {
        title: `Enhancing Client Solutions with Flexible Tools by ${createdUser.email}`,
        body: 'At Our company, we’re constantly exploring new ways to add value to our client projects. Our recent advancements include the introduction of flexible tooling options that cater to a diverse range of project requirements, ensuring tailor-made solutions that align perfectly with client objectives.',
        description:
          'This article discusses the impact of our latest tools and methodologies on project outcomes, emphasizing our dedication to delivering custom, high-quality digital products.',
        published: true,
        authorId: createdUser.id,
      },
    });

    await prisma.consent.create({
      data: {
        userId: createdUser.id,
        termsVersion: POLICY_VERSION,
        termsAccepted: true,
        privacyPolicyVersion: POLICY_VERSION,
        privacyPolicyAccepted: true,
      },
    });
  }

  console.log({
    adminRole,
    userRole,
    activeStatus,
    inactiveStatus,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    async function disconnectPrisma() {
      await prisma.$disconnect();
    }
    disconnectPrisma();
  });
