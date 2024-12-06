import { ConsentService } from '~starter/consent/consent.service';
import { PrismaService } from '~starter/providers/prisma/prisma.service';

jest.mock('~starter/providers/prisma/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    consent: {
      deleteMany: jest
        .fn()
        .mockImplementation(() => Promise.resolve({ count: 1 })),
      findFirst: jest.fn().mockImplementation(() =>
        Promise.resolve({
          userId: 'someUserId',
          privacyPolicyAccepted: true,
          termsAccepted: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          termsVersion: '1.0',
          privacyPolicyVersion: '1.0',
        }),
      ),
    },
  })),
}));

describe('ConsentService', () => {
  let service: ConsentService;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = new PrismaService();
    service = new ConsentService(prismaService);
  });

  it('should call deleteMany with the correct userId', async () => {
    const userId = 'someUserId';
    await service.deleteMany(userId);
    expect(prismaService.consent.deleteMany).toHaveBeenCalledWith({
      where: { userId },
    });
  });

  it('should call findFirst with the correct userId and return expected data', async () => {
    const userId = 'someUserId';
    const result = await service.findFirst(userId);
    expect(prismaService.consent.findFirst).toHaveBeenCalledWith({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        privacyPolicyAccepted: true,
        termsAccepted: true,
        createdAt: true,
        updatedAt: true,
        termsVersion: true,
        privacyPolicyVersion: true,
      },
    });
    expect(result).toHaveProperty('userId', 'someUserId');
  });
});
