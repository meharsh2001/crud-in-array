var db = [],
  mongoose = require("mongoose"),
  config = require("dotenv").config().parsed,
  connectionOption = {
    domainsEnabled: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  ObjectId = require("mongodb").ObjectId,
  _ = require("underscore");

function createDatabaseInstance(type, next) {
  //Db options
  if (!config.host) {
    config.host = "localhost";
  }
  if (config.dbSSL) {
    connectionOption.ssl = true;
    connectionOption.sslValidate = true;
    connectionOption.sslCA = `${__dirname}/certs/tlsca.pem`;
    connectionOption.sslKey = fs.readFileSync(`${__dirname}/certs/tlsckf.pem`);
  }
  var connectionString =
    type === "master" ? config.sessionDbName : config.dbName;
  connectionString = `mongodb://${config.host}:27017/${connectionString}`;
  try {
    return mongoose.createConnection(connectionString, connectionOption).then(
      function (conn) {
        this.conn = conn;
        this.conn.on("error", function (err) {
          console.log(err);
        });
        console.log("Connection established: " + connectionString);
        db[type] = this.conn;
        db[type].isReady = true;
        return next(
          null,
          _.extend(this.conn, {
            delete: _.bind(deleteOne, this.conn),
            create: _.bind(createOne, this.conn),
            retrieve: _.bind(retrieveOne, this.conn),
            update: _.bind(updateOne, this.conn),
          })
        );
      }.bind(this)
    );
  } catch (error) {
    console.log(error);
  }
}

function getDatabase(next, type) {
  if (!type) type = "master";
  if ("function" !== typeof next) {
    return next(new Error("getDatabase called without callback function"));
  }
  if (db[type] && db[type].isReady) return next(null, db[type]);
  else return createDatabaseInstance(type, next);
}

function createOne(dbName, query, callback) {
  if (query._id) query._id = ObjectId(query._id);
  this.collection(dbName).insertOne(query, callback);
}
function updateOne(dbName, findBy, query, options, callback) {
  if (findBy._id) findBy._id = ObjectId(findBy._id);
  if (typeof options === "function") {
    callback = options;
    options = { upsert: true };
  }
  this.collection(dbName).updateOne(findBy, { $set: query }, options, callback);
}
function retrieveOne(dbName, query, callback) {
  if (query._id) query._id = ObjectId(query._id);
  this.collection(dbName).find(query, function (err, filteredObj) {
    if (err) return callback(err);
    else
      filteredObj.toArray(callback);
  });
}
function deleteOne(dbName, query, callback) {
  if (query._id) query._id = ObjectId(query._id);
  this.collection(dbName).updateOne(
    query,
    { $set: { _isDeleted: true } },
    { upsert: true },
    callback
  );
}

module.exports = {
  getDatabase: getDatabase,
};
