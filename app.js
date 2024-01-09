var express = require("express"),
  port = 8000,
  app = express(),
  session = require("express-session"),
  MongoStore = require("connect-mongodb-session")(session),
  database = require("./database"),
  ObjectId = require("mongodb").ObjectId,
  connectionOption = {
    domainsEnabled: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  connectionString = process.env.db2;
const findBy = "6437e0015b99a2d4a07ee8a3";
const mainTenantId = "642ab340cd09ea5cdc9b2104";

//session create
var store = new MongoStore({
  uri: connectionString,
  databaseName: "connect_mongodb_session_test",
  collection: "sessions",
  connectionOptions: connectionOption,
});
store.on("error", function (error) {
  console.log(error);
});
app.use(
  session({
    secret: "sessionSecret",
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
    resave: true,
    saveUninitialized: true,
  })
);

//insert rec
app.get("/", function (req, res) {
  database.getDatabase(function (err, db) {
    const query = {
      _id: findBy,
      _tenantId: {
        _id: ObjectId(mainTenantId),
      },
      _accessibleTenants: [],
      _defaultTenantId: ObjectId(mainTenantId),
    };
    db.create("tenants", query, function (err, rec) {
      if (err) res.status(500).json(err);
      else res.status(200).json(rec);
    });
  });
});

//update
app.get("/update", function (req, res) {
  //const findBy = "645ba61accd86010893de0bd";
  database.getDatabase(function (err, db) {
    db.collection("tenants").updateOne(
      { _id: ObjectId(findBy) },
      {
        $push: {
          _accessibleTenants: {
            _tenantId: ObjectId("6437e0015b99a2d4a07ee8a3"),
            role: "",
            secid: "",
            _isDeleted: false,
            name: "tenant2",
          },
        },
      },
      {},
      function (err, rec) {
        if (err) res.status(500).json(err);
        else res.status(200).json(rec);
      }
    );
  });
});

//retrieve
app.get("/retrieve", function (req, res) {
  const findBy = "6437e0015b99a2d4a07ee8a3";
  database.getDatabase(function (err, db) {
    db.retrieve(
      "tenants",
      {
        _accessibleTenants: {
          $elemMatch: {
            _isDeleted: false,
            _tenantId: ObjectId(findBy),
          },
        },
      },
      function (err, stack) {
        if (err) res.status(500).json(err);
        else res.status(200).json(stack);
      }
    );
  });
});

//delete
app.get("/delete", function (req, res) {
  database.getDatabase(function (err, db) {
    db.collection("tenants").updateOne(
      {
        _id: ObjectId(findBy),
        _accessibleTenants: {
          $elemMatch: {
            _tenantId: ObjectId(findBy),
          },
        },
      },
      { $set: { "_accessibleTenants.$._isDeleted": true } },
      function (err, tenant) {
        if (err) res.status(500).json(err);
        else res.status(200).json(tenant);
      }
    );
  });
});

app.listen(port, function () {
  console.log("");
  console.log(
    "domainsEnabled:" +
      connectionOption.domainsEnabled +
      "  http://localhost:" +
      port +
      "/"
  );
});
