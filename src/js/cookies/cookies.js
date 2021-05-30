// created for cookie functionality reusability

// sets cookie value
export function setCookie(key, cookieValue, maxAge) {
    /**
     * checks if cookie value was passed as string
     * otherwise converts it to string
     */
    if (typeof cookieValue === 'string') {
        document.cookie = `${key}=${cookieValue};path=/;max-age=${maxAge}`;
    } else {
        document.cookie = `${key}=${JSON.stringify(cookieValue)};path=/;max-age=${maxAge}`;
    }
}

// get cookie by key
export function getCookieByKey(key) {
    return document.cookie?.split('; ')?.find(row => row.startsWith(key))?.split('=')[1] ?? '[]';
}

// delete cookie by key
export function deleteCookieByKey(key) {
    document.cookie = `${key}=;max-age=0;`
}