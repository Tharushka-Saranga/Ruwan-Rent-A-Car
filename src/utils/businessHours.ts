/**
 * Business Hours Utilities
 * Open daily: 7:00 AM - 9:00 PM (07:00 - 21:00)
 */

export interface BusinessStatus {
  isOpen: boolean;
  statusText: 'Open Now' | 'Closed Now';
  currentFormattedTime: string;
  hoursDisplay: string;
  nextEventText: string;
  openingTime: string;
  closingTime: string;
}

export const BUSINESS_OPEN_HOUR = 7; // 07:00 AM
export const BUSINESS_CLOSE_HOUR = 21; // 09:00 PM

export function getBusinessStatus(customDate?: Date): BusinessStatus {
  const now = customDate || new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const decimalTime = currentHours + currentMinutes / 60;

  const isOpen = decimalTime >= BUSINESS_OPEN_HOUR && decimalTime < BUSINESS_CLOSE_HOUR;

  // Format 12-hour string
  const currentFormattedTime = now.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  let nextEventText = '';
  if (isOpen) {
    const hoursLeft = Math.floor(BUSINESS_CLOSE_HOUR - decimalTime);
    const minutesLeft = Math.floor((BUSINESS_CLOSE_HOUR - decimalTime - hoursLeft) * 60);
    nextEventText = `Closes at 9:00 PM (${hoursLeft > 0 ? `${hoursLeft}h ` : ''}${minutesLeft}m remaining)`;
  } else {
    if (decimalTime >= BUSINESS_CLOSE_HOUR) {
      nextEventText = 'Opens tomorrow at 7:00 AM';
    } else {
      const hoursToOpen = Math.floor(BUSINESS_OPEN_HOUR - decimalTime);
      const minutesToOpen = Math.floor((BUSINESS_OPEN_HOUR - decimalTime - hoursToOpen) * 60);
      nextEventText = `Opens at 7:00 AM (${hoursToOpen > 0 ? `${hoursToOpen}h ` : ''}${minutesToOpen}m)`;
    }
  }

  return {
    isOpen,
    statusText: isOpen ? 'Open Now' : 'Closed Now',
    currentFormattedTime,
    hoursDisplay: '7:00 AM – 9:00 PM (Daily)',
    nextEventText,
    openingTime: '7:00 AM',
    closingTime: '9:00 PM',
  };
}
