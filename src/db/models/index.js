'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/database.json')[env];
const db = {};



// define our database connection using the sequelize object.
let sequelize = new Sequelize({
  host: config.host,
  username: config.username,
  password: config.password,
  port: config.port,
  database: config.database,
  dialect: config.dialect,
});


// Testing the connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully!!");
  })
  .catch((err) => {
    console.log("Error while connecting dataabase ==>>>>", err);
  });


// model associations
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// model associations 
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.categories = require('./categories')(sequelize, Sequelize);
db.products = require('./products')(sequelize, Sequelize);
<<<<<<< HEAD
=======
// db.productCategories = require('./productcategories')(sequelize, Sequelize);
>>>>>>> ce54e13e25c54f986d07b5662d9841e197f19f4e
db.product_categories = require('./product_categories')(sequelize, Sequelize);
db.customers = require('./customers')(sequelize, Sequelize);
db.addresses = require('./addresses')(sequelize, Sequelize);
db.paymentStatusMaster = require('./payment_status_master')(sequelize, Sequelize);
db.orderStatusMaster = require('./order_status_master')(sequelize, Sequelize);
db.orders = require('./orders')(sequelize, Sequelize);
db.order_items = require('./order_items')(sequelize, Sequelize);

// associations between models 
db.categories.hasMany(db.categories, { as: 'children', foreignKey: 'parent_id' });
db.categories.belongsTo(db.categories, { as: 'parent', foreignKey: 'parent_id' });

<<<<<<< HEAD
=======

>>>>>>> ce54e13e25c54f986d07b5662d9841e197f19f4e
db.products.hasMany(db.product_categories, { as: 'product_categories', foreignKey: 'product_id' });
db.product_categories.belongsTo(db.products, { as: 'product', foreignKey: 'product_id' });

db.categories.hasMany(db.product_categories, { as: 'product_categories', foreignKey: 'category_id' });
db.product_categories.belongsTo(db.categories, { as: 'category', foreignKey: 'category_id' });

<<<<<<< HEAD
=======


>>>>>>> ce54e13e25c54f986d07b5662d9841e197f19f4e
// db.products.belongsToMany(db.categories, { through: db.productCategories, foreignKey: 'product_id' });
// db.categories.belongsToMany(db.products, { through: db.productCategories, foreignKey: 'category_id' });

db.customers.hasMany(db.addresses, { as: 'addresses', foreignKey: 'customer_id' });
db.addresses.belongsTo(db.customers, { as: 'customer', foreignKey: 'customer_id' });

db.paymentStatusMaster.hasMany(db.orders, { as: 'orders', foreignKey: 'payment_status' });
db.orders.belongsTo(db.paymentStatusMaster, { as: 'payment_status_master', foreignKey: 'payment_status' });

db.orderStatusMaster.hasMany(db.orders, { as: 'orders', foreignKey: 'order_status' });
db.orders.belongsTo(db.orderStatusMaster, { as: 'order_status_master', foreignKey: 'order_status' });

db.customers.hasMany(db.orders, { as: 'orders', foreignKey: 'customer_id' });
db.orders.belongsTo(db.customers, { as: 'customer', foreignKey: 'customer_id' });

db.addresses.hasMany(db.orders, { as: 'orders_', foreignKey: 'delivery_address_id' });
db.orders.belongsTo(db.addresses, { as: 'delivery_address', foreignKey: 'delivery_address_id' });

db.addresses.hasMany(db.orders, { as: 'orders', foreignKey: 'shipping_address_id' });
db.orders.belongsTo(db.addresses, { as: 'shipping_address', foreignKey: 'shipping_address_id' });

db.orders.hasMany(db.order_items, { as: 'order_items', foreignKey: 'order_id' });
db.order_items.belongsTo(db.orders, { as: 'order', foreignKey: 'order_id' });

db.products.hasMany(db.order_items, { as: 'order_items', foreignKey: 'product_id' });
db.order_items.belongsTo(db.products, { as: 'product', foreignKey: 'product_id' });

module.exports = db;