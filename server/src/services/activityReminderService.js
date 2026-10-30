import { FarmingActivity } from '../models/FarmingActivity.js';
import { Notification } from '../models/Notification.js';

export const createDueActivityReminders = async () => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(startOfToday);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

  const activities = await FarmingActivity.find({
    completed: false,
    reminderSet: true,
    dueDate: { $gte: startOfToday, $lt: dayAfterTomorrow }
  });

  let created = 0;
  for (const activity of activities) {
    const due = new Date(activity.dueDate);
    const isToday = due < tomorrow;
    const message = isToday
      ? `Today is the scheduled date for ${activity.title}${activity.cropName ? ` (${activity.cropName})` : ''}.`
      : `Tomorrow is the scheduled date for ${activity.title}${activity.cropName ? ` (${activity.cropName})` : ''}.`;

    const reminderExists = await Notification.exists({ user: activity.user, activity: activity._id, message });
    if (!reminderExists) {
      await Notification.create({
        user: activity.user,
        activity: activity._id,
        type: 'activity_reminder',
        title: isToday ? `Due today: ${activity.title}` : `Reminder: ${activity.title}`,
        message,
        link: '/calendar'
      });
      created += 1;
    }
  }

  return created;
};
