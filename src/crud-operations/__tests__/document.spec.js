import { List } from '../../core/document';

describe('CRUD Operations', () => {
  it('test', async () => {
    const list = await new List();
    expect(list).toBeTruthy();
  });
});
