export const setAdminAuth = (isAuthenticated: boolean) => {
    document.cookie = `isAdminAuthenticated=${isAuthenticated}; path=/; max-age=${60 * 60 * 24}`;
    localStorage.setItem('isAdminAuthenticated', String(isAuthenticated));
};

export const clearAdminAuth = () => {
    document.cookie = 'isAdminAuthenticated=; path=/; max-age=0';
    localStorage.removeItem('isAdminAuthenticated');
};

export const isAdminAuthenticated = (): boolean => {
    const cookieAuth = document.cookie
        .split('; ')
        .find(row => row.startsWith('isAdminAuthenticated='))
        ?.split('=')[1] === 'true';

    const localStorageAuth = localStorage.getItem('isAdminAuthenticated') === 'true';

    return cookieAuth || localStorageAuth;
};
