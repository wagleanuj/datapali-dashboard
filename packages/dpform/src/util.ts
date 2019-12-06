
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
export function getReadablePath(nu: number[]) {
    return nu.slice(1).map(item => item + 1).join('.');

}
export function getRandomId(startingText?: string) {
    if (!startingText) {
        startingText = '';
    }
    const S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return startingText + (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
}
