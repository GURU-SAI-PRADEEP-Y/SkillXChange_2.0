// Generate a unique Google Meet link using a UUID
export function generateGoogleMeetLink(): string {
  const meetId = crypto.randomUUID().replace(/-/g, '').substring(0, 12);
  return `https://meet.google.com/${meetId}`;
}