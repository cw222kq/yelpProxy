"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var app = (0, express_1.default)();
var PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.listen(PORT, function () {
    console.log("Server is running on port ".concat(PORT));
});
