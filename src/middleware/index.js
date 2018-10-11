const { authenticate } = require('@feathersjs/authentication').express;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const multer = require('multer');
const XLSX = require('xlsx');
const _ = require('lodash');

module.exports = function (app) {

  const upload = multer({ dest: app.get('uploadDir'), limits: { fileSize: app.get('fileSize') } });

  // 上传excel
  app.post('/uploadgoods', authenticate('jwt'), upload.single('file'), async (req, res) => {
    try {
      var workbook = XLSX.readFile(req.file.path, { raw: true, cellHTML: false });
      const fields = 'brand,barcode,goodnum,styleno,name,color,size,series,year,price,season,warehouse,badnum,intime'.split(',');
      var models = [];
      var store = workbook.Sheets[workbook.SheetNames[0]];
      var keys = Object.keys(store);
      for (let k of keys) {
        let index = parseInt(k.substring(1));
        if (!models[index - 1]) {
          models[index - 1] = {};
        }
        let v = store[k].w;
        v = v === '/' ? '' : v;
        models[index - 1][fields[k.charCodeAt(0) - 65]] = v || '';
      }
      // 过滤掉最后统计行
      if (!models[models.length - 1].barcode || !models[models.length - 1].brand) {
        models.pop();
      }
      // 过滤掉标题行
      if (models[0].brand === '品牌') {
        models.shift();
      }
      // 记录上传日志
      var log = await app.service('uploadlog').Model.create({
        user: req.user.email,
        path: req.file.path,
        filename: req.file.filename,
        originalname: req.file.originalname,
        status: false
      });
      await _.chunk(models, 1000)
        .reduce((p, curr) => {
          return p.then(function () {
            return app.service('goods').Model.bulkCreate(curr);
          });
        }, app.service('goods').Model.truncate());
      await app.service('uploadlog').Model.update({ status: true }, { where: { id: log.id } });
      models = null;
      workbook = null;
    } catch (e) {
      // console.log(e);
      res.status(500).json({ error: 1 });
    }
    res.json({ error: 0 });
  });

  // 查询商品接口
  app.get('/goodslist', authenticate('jwt'), async (req, res) => {
    const { limit = 20, brand, barcode, season, warehouse, styleno, name, skip = 0 } = req.query;
    let query = { $limit: limit, $skip: skip };
    if (brand) {
      query.brand = { $like: `%${brand}%` };
    }
    if (season) {
      query.season = { $like: `%${season}%` };
    }
    if (warehouse) {
      query.warehouse = warehouse;
    }
    if (barcode) {
      query.barcode = barcode;
    }
    if (styleno) {
      query.styleno = { $like: `%${styleno}%` };
    }
    if (name) {
      query.name = { $like: `%${name}%` };
    }
    try {
      const data = await app.service('goods').find({
        query
      });
      res.json(data);
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: 1 });
    }

  });

  app.get('/downloadgoods', authenticate('jwt', { jwtFromRequest: [ExtractJwt.fromUrlQueryParameter('token')] }), async (req, res) => {
    let { email } = req.user;
    // 查找最近的文件
    let log = await app.service('uploadlog').find({ query: { $limit: 1, status: 1, $sort: { createdAt: -1 } } });
    log = log.data[0];
    if (log) {
      app.get('logger').log('info', '[%s] download file %s', email, log.path + '(' + log.originalname + ')');
      res.download(log.path, log.originalname);
    } else {
      res.status(404).json({ error: 1 });
    }
  });
};
