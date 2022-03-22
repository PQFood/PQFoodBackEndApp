const siteRouter = require('./site');
const adminRouter = require('./admin');
const waiterRouter = require('./waiter');

function route(app) {
    app.use('/waiter',waiterRouter);
    app.use('/admin',adminRouter);
    app.use('/',siteRouter);
}

module.exports = route;
