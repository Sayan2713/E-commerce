// Both backend and admin-backend point at the same MongoDB database, but
// each is its own Node process with its own Mongoose instance - so each
// defines its own copy of the schemas it needs, rather than one process
// reaching into the other's source folder via a relative path.
//
// (An earlier version of this file did `require('../../../backend/src/models/...')`
// to avoid duplicating schema code. That's fragile across machines/OSes -
// it depends on the exact folder layout after extraction, which broke on
// Windows for some path/extraction setups. Duplicated model files, kept in
// sync by hand, are the more robust choice for two independently-run
// services like this. If you want true single-source schemas later, pull
// them into a shared npm workspace package instead - e.g. `@clothstore/models` -
// imported by both backend and admin-backend as a real dependency.)
module.exports = {
  Product: require('./Product'),
  Category: require('./Category'),
  Banner: require('./Banner'),
  Coupon: require('./Coupon'),
  DeliveryZone: require('./DeliveryZone'),
  GstConfig: require('./GstConfig'),
  Order: require('./Order'),
  User: require('./User'),
};
