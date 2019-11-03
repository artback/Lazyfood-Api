import https from 'https';
import socket from 'socket.io';
import chalk from 'chalk';
import fs from 'fs';
import apolloServer from '~/core/graphql';
import mongoose from '~/core/mongoose';
import redis from '~/core/redis';

import { PORT, HOST } from './env';
import app from './app';

const options = {
  key: fs.readFileSync('localhost.key'),
  cert: fs.readFileSync('localhost.cert'),
  requestCert: false,
  rejectUnauthorized: false,
};
const server = https.Server(options, app);
const io = socket(server);

app.set('socket', io);
io.origins(['*:*']);
apolloServer.installSubscriptionHandlers(server);

server.listen(Number(PORT), HOST, () => {
  console.log(chalk.hex('#009688')(' [*] App: Bootstrap Succeeded.'));
  console.log(chalk.hex('#009688')(` [*] Host: https://${HOST}:${PORT}/.`));
  console.log(
    `🚀 Server ready at https://localhost:${PORT}${apolloServer.graphqlPath}`,
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`,
  );

  mongoose.connection.once('open', () =>
    console.log(chalk.hex('#009688')(' [*] Mongo: Connection Succeeded.')),
  );
  mongoose.connection.on('error', err => console.error(err));

  redis.on('connect', () =>
    console.log(chalk.hex('#009688')(' [*] Redis: Connection Succeeded.')),
  );
  redis.on('error', err => console.error(err));
});

io.on('connection', connSocket => {
  console.log(chalk.hex('#009688')(' [*] Socket: Connection Succeeded.'));
  connSocket.on('disconnect', () =>
    console.log(chalk.hex('#009688')(' [*] Socket: Disconnected.')),
  );
});

export default server;
