import app from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';
import { createDueActivityReminders } from './services/activityReminderService.js';

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(config.port, () => {
      console.log(`[Mitti Mitra Server] Listening on port ${config.port} in ${config.nodeEnv} mode`);
      console.log(`[Mitti Mitra Server] Health check available at http://localhost:${config.port}/api/health`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`[Server Start Failure]: Port ${config.port} is already in use.`);
      } else {
        console.error(`[Server Start Failure]: ${error.message}`);
      }
      process.exitCode = 1;
    });

    createDueActivityReminders().catch((error) => console.error('[Activity Reminders]', error.message));
    const reminderInterval = setInterval(() => {
      createDueActivityReminders().catch((error) => console.error('[Activity Reminders]', error.message));
    }, 15 * 60 * 1000);
    reminderInterval.unref();

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error(`[Unhandled Rejection]: ${err.message}`);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error(`[Server Start Failure]: ${error.message}`);
    process.exit(1);
  }
};

startServer();

