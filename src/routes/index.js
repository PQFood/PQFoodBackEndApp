const siteRouter = require('./site');
const adminRouter = require('./admin');
const waiterRouter = require('./waiter');
const chefRouter = require('./chef')
const shipperRouter = require('./shipper')

function route(app) {

    app.use('/shipper',shipperRouter);
    app.use('/chef',chefRouter);
    app.use('/waiter',waiterRouter);
    app.use('/admin',adminRouter);
    app.use('/',siteRouter);
}

module.exports = route;
