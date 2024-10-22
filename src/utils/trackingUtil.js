import { trackEvents } from './api';

const eventQueue = [];
const QUEUE_FLUSH_INTERVAL = 15000; // Flush queue every 15 seconds

export const trackEvent = (eventType, newsItemId, newsItemTitle, currentNewsIndex, audioPlaybackTime = null, additionalData = {}) => {
  const event = {
    eventType,
    newsItemId,
    newsItemTitle,
    currentNewsIndex,
    timestamp: Date.now(),
    audioPlaybackTime,
    additionalData
  };

  eventQueue.push(event);
};

const flushQueue = async () => {
  if (eventQueue.length === 0) return;

  const eventsToSend = [...eventQueue];
  eventQueue.length = 0;

  try {
    await trackEvents(eventsToSend);
  } catch (error) {
    console.error('Failed to send events:', error);
    // Add the events back to the queue
    eventQueue.push(...eventsToSend);
  }
};

// Start the interval to flush the queue periodically
setInterval(flushQueue, QUEUE_FLUSH_INTERVAL);

// Flush queue when the window is about to unload
window.addEventListener('beforeunload', flushQueue);

// Track visibility changes
document.addEventListener('visibilitychange', () => {
  trackEvent('visibilityChange', null, null, null, { isVisible: !document.hidden });
});

// Track session start
export const trackSessionStart = () => {
  trackEvent('sessionStart', null, null);
};

// Make sure to call trackSessionStart when the app initializes
