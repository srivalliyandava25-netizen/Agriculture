import { FarmingActivity } from '../models/FarmingActivity.js';
import { Notification } from '../models/Notification.js';
import { createDueActivityReminders } from '../services/activityReminderService.js';

export const getMyActivities = async (req, res, next) => {
  try {
    await createDueActivityReminders();
    const { status, cropName } = req.query;
    const query = { user: req.user.id };

    if (status === 'completed') query.completed = true;
    if (status === 'pending') query.completed = false;
    if (cropName) query.cropName = new RegExp(cropName, 'i');

    const activities = await FarmingActivity.find(query).sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: activities.length,
      activities
    });
  } catch (error) {
    next(error);
  }
};

export const createActivity = async (req, res, next) => {
  try {
    const { title, cropName, activityType, dueDate, priority, notes, reminderSet } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Title and due date are required.'
      });
    }

    const activity = await FarmingActivity.create({
      user: req.user.id,
      title,
      cropName: cropName || '',
      activityType: activityType || 'other',
      dueDate: new Date(dueDate),
      priority: priority || 'medium',
      notes: notes || '',
      reminderSet: reminderSet !== undefined ? reminderSet : true
    });

    if (activity.reminderSet) {
      await Notification.create({
        user: req.user.id,
        type: 'activity_reminder',
        title: `Reminder: ${activity.title}`,
        message: `Scheduled ${activity.activityType} task for ${activity.cropName || 'farm'} is set for ${new Date(activity.dueDate).toLocaleDateString()}.`,
        link: '/calendar'
      });
    }

    res.status(201).json({
      success: true,
      activity
    });
  } catch (error) {
    next(error);
  }
};

export const updateActivity = async (req, res, next) => {
  try {
    const activity = await FarmingActivity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found.' });
    }

    if (activity.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const { title, activityType, dueDate, completed, priority, notes } = req.body;

    if (title) activity.title = title;
    if (activityType) activity.activityType = activityType;
    if (dueDate) activity.dueDate = new Date(dueDate);
    if (priority) activity.priority = priority;
    if (notes !== undefined) activity.notes = notes;

    if (completed !== undefined) {
      activity.completed = completed;
      activity.completedAt = completed ? new Date() : null;
    }

    await activity.save();

    res.status(200).json({
      success: true,
      activity
    });
  } catch (error) {
    next(error);
  }
};

export const deleteActivity = async (req, res, next) => {
  try {
    const activity = await FarmingActivity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found.' });
    }

    if (activity.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    await FarmingActivity.findByIdAndDelete(req.params.id);
    await Notification.deleteMany({ activity: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Activity deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Automatically populates a full season calendar schedule for a given crop
 */
export const generateCropSchedule = async (req, res, next) => {
  try {
    const { cropName = 'Wheat', sowingDate } = req.body;
    const baseDate = sowingDate ? new Date(sowingDate) : new Date();

    const addDays = (d, days) => new Date(d.getTime() + days * 24 * 60 * 60 * 1000);

    const scheduleTemplates = [
      {
        title: `Pre-Sowing Land Prep & FYM Incorporation`,
        activityType: 'fertilizer',
        dueDate: addDays(baseDate, -7),
        priority: 'high',
        notes: 'Incorporate 4 tons/acre well-decomposed FYM and complete primary tillage.'
      },
      {
        title: `Seed Treatment & Sowing`,
        activityType: 'sowing',
        dueDate: baseDate,
        priority: 'high',
        notes: `Treat seeds with bio-fungicide/Rhizobium and sow at optimum depth with basal DAP.`
      },
      {
        title: `Crown Root Initiation (CRI) First Irrigation`,
        activityType: 'irrigation',
        dueDate: addDays(baseDate, 21),
        priority: 'high',
        notes: 'Critical irrigation stage (20-25 days after sowing) followed by first top-dressing of Urea.'
      },
      {
        title: `First Weeding & Hoeing`,
        activityType: 'weeding',
        dueDate: addDays(baseDate, 35),
        priority: 'medium',
        notes: 'Perform manual hoeing or light interculture to aerate root zone.'
      },
      {
        title: `Tillering Stage Second Irrigation & Top Dressing`,
        activityType: 'irrigation',
        dueDate: addDays(baseDate, 45),
        priority: 'medium',
        notes: 'Apply remaining split dose of Nitrogen in moist soil.'
      },
      {
        title: `Foliar Pest & Disease Monitoring`,
        activityType: 'pest_monitoring',
        dueDate: addDays(baseDate, 65),
        priority: 'medium',
        notes: 'Inspect lower leaf canopies for aphid or rust signs.'
      },
      {
        title: `Grain Filling / Milking Stage Irrigation`,
        activityType: 'irrigation',
        dueDate: addDays(baseDate, 85),
        priority: 'high',
        notes: 'Maintain adequate moisture for bold grain formation.'
      },
      {
        title: `Harvesting & Threshing`,
        activityType: 'harvesting',
        dueDate: addDays(baseDate, 120),
        priority: 'high',
        notes: 'Harvest when grains are hard and moisture drops below 14%.'
      }
    ];

    const createdActivities = [];
    for (const item of scheduleTemplates) {
      const act = await FarmingActivity.create({
        user: req.user.id,
        title: `${cropName}: ${item.title}`,
        cropName,
        activityType: item.activityType,
        dueDate: item.dueDate,
        priority: item.priority,
        notes: item.notes,
        reminderSet: true
      });
      createdActivities.push(act);
      await Notification.create({
        user: req.user.id,
        activity: act._id,
        type: 'activity_reminder',
        title: `Scheduled: ${act.title}`,
        message: `This ${act.activityType} activity is scheduled for ${act.dueDate.toLocaleDateString()}.`,
        link: '/calendar'
      });
    }

    res.status(201).json({
      success: true,
      message: `Generated ${createdActivities.length} scheduled activities for ${cropName}.`,
      activities: createdActivities
    });
  } catch (error) {
    next(error);
  }
};

