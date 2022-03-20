import http from 'http';
import https from 'https';
import fs from 'fs';
import dotenv from 'dotenv';
import logger from './Helpers/logger';
import messages from './Helpers/messages';

// Load Environment variables
dotenv.config({
  path: './.env'
});
import app from './app';

interface StartOptions {
    sslKey?: string,
    sslCert?: string,
    port: number,
    bind: string,
};

/**
 *
 * @param {StartOptions} options Start options
 */
function start(options: StartOptions) {
  const port = options.port;
  const ssl = options.sslCert && options.sslKey;
  const sslOptions = !ssl ? {} : {
    key: fs.readFileSync(`${options.sslKey}`, 'utf8'),
    cert: fs.readFileSync(`${options.sslCert}`, 'utf8'),
  };

  const httpServer = ssl ? https.createServer(sslOptions, app) : http.createServer(app);
  httpServer.listen(port, options.bind, initApp).on('error', handleStartError);

  // eslint-disable-next-line require-jsdoc
  function initApp() {
    const pkg = require('../package.json');
    let msg = `WTF service ${pkg.version} running on`;
    msg += ssl ? ' https://' : ' http://';
    msg += `${options.bind}:${port}`;
    if (options.bind !== '127.0.0.1') logger.warn(messages.BIND_TO_LOCALHOST);
    logger.info(msg, options.bind, port);
  }

  // Handle unhandledRejection error
  process.on('unhandledRejection', (err: Error) => {
    logger.error(err.message, err);
    logger.info('UNHANDLED REJECTION. Shutting down...❌');
    // Close connection gracefully
    logger.exitOnError = true;
    httpServer.close(() => {
      process.exit(1);
    });
  });

  // Handle uncaughtException error
  process.on('uncaughtException', (err: Error) => {
    logger.error(err.name, err);
    logger.info('UNCAUGHT EXCEPTION. Shutting down...❌');
    // Close connection gracefully
    logger.exitOnError = true;
    httpServer.close(() => {
      process.exit(1);
    });
  });

  // eslint-disable-next-line require-jsdoc
  function handleStartError(err: Error) {
    logger.error(err.message, err);
  }
}

start({
  port: Number(process.env.PORT || 1111),
  bind: String(process.env.BIND || '127.0.0.1')
});


