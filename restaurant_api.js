const express = require("express");

const sync = require("./models/sync");

const app = express();

sync(app);
