export const isNewDay = (lastLoginDate, currentDate) => {
    if (!lastLoginDate) return true;
    const lastLogin = new Date(lastLoginDate);
    const current = new Date(currentDate);
    const diffInHours = (current - lastLogin) / (1000 * 60 * 60);
    return diffInHours > 2 || lastLogin.toDateString() !== current.toDateString();
};