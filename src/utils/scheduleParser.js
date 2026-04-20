export const parseSchedule = (rawSchedule) => {
  if (!Array.isArray(rawSchedule)) return [];
  return rawSchedule
    .filter(session => session && session.title)
    .map(session => ({
      ...session,
      startTime: session.startTime || 'TBD',
      room: session.room || 'Main Hall',
      title: session.title.trim(),
    }));
};