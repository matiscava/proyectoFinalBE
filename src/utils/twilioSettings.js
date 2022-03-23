import twilio from 'twilio';

import logger from './../logger/index.js';


const accountSid = 'AC438284ec95bd807c728609de4ee77587';
const authToken = '3a1e7dfeeaabb01b320149c357be907a';
const client = twilio(accountSid , authToken)

export const sendMessage = async (options) => {
  try{
    const message = await client.messages.create(options)
    logger.info(message);
  }
  catch (err)
  {
    logger.error(err);
  } 
}
