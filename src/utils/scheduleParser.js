export const parseSchedule = (scheduleRaw) => {
  if (!Array.isArray(scheduleRaw)) return [];
  return scheduleRaw.map(session => ({
    id: session.id || Math.random().toString(36).substr(2, 9),
    title: session.title || "TBA",
    room: session.room || "TBA",
    speaker: session.speaker || "TBA",
    startTime: new Date(session.startTime || Date.now()),
    capacity: session.capacity || 100
  })).sort((a, b) => a.startTime - b.startTime);
};
