export const getLocationAsync = () => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve(`${latitude},${longitude}`);
          },
          (error) => {
            console.error("Error getting location:", error);
            resolve("unknown");
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        resolve("unknown");
      }
    });
  };
  
  