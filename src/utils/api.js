const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getToken = () => {
  return localStorage.getItem('userToken');
};

const setToken = (token) => {
  localStorage.setItem('userToken', token);
};

const clearToken = () => {
  localStorage.removeItem('userToken');
};

const apiCall = async (endpoint, method = 'GET', data = null) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
  };

  const config = {
    method,
    headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (response.status === 401) {
    clearToken();
    throw new Error('Unauthorized');
  }

  return response;
};

export const signIn = async (email, firstName, country, language) => {
  const response = await apiCall('/user/signin', 'POST', {
    email,
    first_name: firstName,
    country,
    language,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Sign in failed');
  }

  if (data.isNewUser) {
    return {
      isNewUser: true,
      message: data.message
    };
  } else {
    return {
      isNewUser: false,
      token: data.token
    };
  }
};

export const verifyEmail = async (email, verificationCode) => {
  const response = await apiCall('/user/verify', 'POST', {
    email,
    verification_code: verificationCode,
  });

  if (!response.ok) {
    throw new Error('Verification failed');
  }

  const data = await response.json();
  setToken(data.token);
  return data;
};

export const fetchNews = async (user) => {
  try {
    const firstTimeEver = user.isFirstTimeEver;
    const firstTimeToday = user.isFirstTimeToday;
    const currentTime = new Date().toISOString();

    const queryParams = new URLSearchParams({
      first_time_ever: firstTimeEver,
      first_time_today: firstTimeToday,
      current_time: currentTime,
    }).toString();

    console.log(`Fetching news with query params: ${queryParams}`);
    const response = await apiCall(`/public/latest_news?${queryParams}`, 'GET');

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};