export const isNewDay = (lastLoginDate, currentDate) => {
    if (!lastLoginDate) return true;
    return new Date(lastLoginDate).toDateString() !== new Date(currentDate).toDateString();
  };