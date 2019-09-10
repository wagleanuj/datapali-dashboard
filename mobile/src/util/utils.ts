export function request(API_URL: string, queryName: string, requestBody: any, onErrorMessage: string, token: string) {
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) { headers.Authorization = token; }
    return fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: headers,
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error(onErrorMessage || 'Failed');
        }
        return res.json();
      })
      .then(resData => {
        if (resData.errors) {
          throw resData.errors[0]; // throw the first error only
        } else if (resData.data && resData.data[queryName]) {
          return resData.data[queryName];
        }
      })
      .catch(err => {
        throw err;
      });
  }
