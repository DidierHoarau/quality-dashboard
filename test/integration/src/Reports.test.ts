import axios from 'axios';
import * as request from 'request';
import * as FormData from 'form-data';
import * as fs from 'fs';
import { Config } from './Config';

describe('/api/reports/', () => {
  //
  test('GET /api/reports/', async () => {
    const response = await axios.get(`${Config.APIURL}/reports`);
    expect(response.data).toHaveProperty('groups');
    expect(Array.isArray(response.data.groups)).toBeTruthy();
  });

  describe('POST /api/reports/', () => {
    //
    test('Send a report', async () => {
      await sendFile(
        `${__dirname}/../samples/test-report.html`,
        `${Config.APIURL}/reports/quality-dashboard/server/dev/integration-test/jest-html-reporter`
      );
    });
  });
});

function sendFile(filepath: string, url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const req = request.post(url, (err, resp, body) => {
      if (err) {
        reject('Error!');
      } else {
        resolve(body);
      }
    });
    const form = req.form();
    form.append('report', fs.createReadStream(filepath), {
      filename: filepath,
      contentType: 'text/plain'
    });
  });
}
