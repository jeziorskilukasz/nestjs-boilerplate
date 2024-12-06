import { RefreshEntity } from '~starter/modules/auth/entity/refresh.entity';

describe('RefreshEntity', () => {
  it('should correctly assign all properties', () => {
    const accessToken = 'eyJhb...adQssw5c';
    const refreshToken = 'eyJhb...adQssw5c';
    const tokenExpires = 1708531622031;

    const refreshEntity = new RefreshEntity();
    refreshEntity.accessToken = accessToken;
    refreshEntity.refreshToken = refreshToken;
    refreshEntity.tokenExpires = tokenExpires;

    expect(refreshEntity.accessToken).toBe(accessToken);
    expect(refreshEntity.refreshToken).toBe(refreshToken);
    expect(refreshEntity.tokenExpires).toBe(tokenExpires);
  });
});
