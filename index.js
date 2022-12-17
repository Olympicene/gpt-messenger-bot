import appRoot from 'app-root-path';
import { promisify } from 'es6-promisify';
import config from './database/config.js';
import EventHandler from './src/EventHandler.js';
import FBchat from 'facebook-chat-api';
import schedule from 'node-schedule';
import fs from 'fs';

//promisify login
const login = promisify(FBchat);
const appstate = JSON.parse(
  fs.readFileSync(appRoot + '/database/appstate.json', 'utf8')
);

//login
const api = await login({ appState: appstate }).catch((err) => {
  console.error(err);
});

//settings
api.setOptions(config.apiOptions);

//listener
api.listenMqtt((err, event) => {
  if (err) return console.error(err);

  if (config.DEBUG) console.log(event);

  EventHandler(event);
});

//reset timeout every night
let rule = new schedule.RecurrenceRule();
rule.tz = config.time_zone;
rule.hour = 0;
rule.minute = 0;

schedule.scheduleJob(rule, async () => {
  process.exit(1);
});

//helpful send function
function send(contents, threadID, replyID) {
  new Promise((resolve, reject) => {
    api.sendMessage(
      contents,
      threadID,
      (err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(`message sent`);
      },
      replyID
    );
  });
}

export { send, api };
