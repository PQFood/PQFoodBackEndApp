const siteRouter = require('./site');
const adminRouter = require('./admin');
const waiterRouter = require('./waiter');
const chefRouter = require('./chef')

function route(app) {
    app.use('/chef',chefRouter);
    app.use('/waiter',waiterRouter);
    app.use('/admin',adminRouter);
    app.use('/',siteRouter);
}

module.exports = route;
