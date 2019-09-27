const express = require('express');
const vega = require('vega');
const app = express();
const path = require('path');
const router = express.Router();
const tmp = require('tmp');
const fs = require('fs');

const stackedBarChartSpec = require('./stacked-bar-chart.spec.json');
app.use(express.json());

router.get('/sample', function(req, res) {

  var view = new vega.View(vega.parse(stackedBarChartSpec))
    .renderer('none')
    .initialize();

  tmp.file(function _tempFileCreated(err, path, fd, cleanupCallback) {
    if (err) throw err;
    view.toCanvas().then(function (img) {
      fs.writeFileSync(fd, img.toBuffer());
      res.sendFile(path)
    }).catch(function (err) {
      res.status(400);
      res.send(err);
    }).finally(() => cleanupCallback());
  });
});


router.post('/', function(req, res) {
  var view = new vega.View(vega.parse(req.body))
    .renderer('none')
    .initialize();

  tmp.file(function _tempFileCreated(err, path, fd, cleanupCallback) {
    if (err) throw err;
    view.toCanvas().then(function (img) {
      console.log('Writing PNG to file...');
      fs.writeFileSync(fd, img.toBuffer());
      res.sendFile(path)
    }).catch(function (err) {
      console.log("Error writing PNG to file:");
      console.error(err);
      res.status(400);
      res.send(err);
    }).finally(() => cleanupCallback());
  });
});


app.use('/', router);
app.listen(process.env.port || 3333);

