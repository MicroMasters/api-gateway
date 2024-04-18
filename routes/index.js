const express = require("express");
const router = express.Router();
const axios = require("axios");
const registry = require("./registry.json");

router.all("/:apiName/:path/:service/:route", (req, res) => {
  console.log(req.params.apiName);
  if (registry.services[req.params.apiName]) {
    console.log(
      `${registry.services[req.params.apiName].url}/${req.params.path}/${
        req.params.service
      }/${req.params.route}`
    );

    console.log({
      method: req.method,
      url: `${registry.services[req.params.apiName].url}/${req.params.path}/${
        req.params.service
      }/${req.params.route}`,
      headers: req.headers,
      data: req.body,
    });

    axios({
      method: req.method,
      url: `${registry.services[req.params.apiName].url}/${req.params.path}/${
        req.params.service
      }/${req.params.route}`,
      headers: req.headers,
      data: req.body,
    }).then((response) => {
      console.log(response);
      console.log(response.data);
      res.send(response.data);
    });
  } else {
    res.send("API Name doesn't exist");
  }
});

module.exports = router;
