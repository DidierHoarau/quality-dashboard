import axios from 'axios';
import { Config } from './Config';

describe('/api/users/', () => {
  //
  test('GET /api/users/', async () => {
    const response = await axios.get(`${Config.APIURL}/users`);
    expect(response.data).toHaveProperty('users');
    expect(Array.isArray(response.data.users)).toBeTruthy();
  });

  test('POST /api/user (if no user)', async () => {
    const response = await axios.get(`${Config.APIURL}/users`);
    if (response.data.users.length == 0) {
      const response = await axios.post(`${Config.APIURL}/users`, {
        username: 'admin',
        password: 'admin'
      });
      expect(response.data).toHaveProperty('id');
    }
  });
});
