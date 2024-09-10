export const fetchNews = async (userId) => {
    try {
      const response = await fetch(`https://api.openink.co/concoct?userId=${userId}&noOfNews=10`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  };
  