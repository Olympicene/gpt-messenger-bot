import config from '../database/config.js';
import { GPTrespond } from './ChatGPT.js';

async function EventHandler(event) {
  let threadIDs = config.allowed_threads;



  if (threadIDs.includes(event.threadID) && event.type == 'message') {
    GPTrespond(event);
  }
}

export default EventHandler;
