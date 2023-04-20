const path = require('path');
const moment = require('moment');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;

const logEvent = async (message, fileName) => {
  try {
    const dateItem = moment(new Date()).format('LLL');
    const logItem = `${dateItem}\t${uuid()}\t${message}\n`;

    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      fs.mkdirSync(path.join(__dirname, '..', 'logs'));
    }

    await fsPromises.appendFile(
      path.join(__dirname, '..', 'logs', fileName),
      logItem
    );
  } catch (err) {
    console.error(err);
  }
};

const logger=(req,res,next)=>{
    const message=`${req.method} ${req.url} ${req.headers.origin}`;

    logEvent(message,'reqLogs.log');
    next();
}


module.exports={logger,logEvent};