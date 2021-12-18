/* eslint-disable no-console */
import { app } from './app';

const port = process.env.PORT || 3030;
const server = app.listen(port);

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection', p, reason);
  // eslint-disable-next-line @typescript-eslint/no-throw-literal
  throw reason;
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception', error);
  // Sentry.captureException(error);
  // Sentry.flush().then(() => process.exit(1));
});

server.on('listening', () => console.log(`> listening on port ${port}`));
