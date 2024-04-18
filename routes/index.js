const express = require("express");
const router = express.Router();
const axios = require("axios");
const registry = require("./registry.json");
const fs = require("fs");

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

router.post("/register", (req, res) => {
  const registrationInfo = req.body;

  registrationInfo.url =
    registrationInfo.protocol +
    "://" +
    registrationInfo.host +
    ":" +
    registrationInfo.port +
    "/";

  registry.services[registrationInfo.apiName] = { ...registrationInfo };

  fs.writeFile("./routes/registry.json", JSON.stringify(registry), (error) => {
    if (error) {
      res.send("Could not register" + registrationInfo.apiName + "\n" + error);
    } else {
      res.send("Successfully registered '" + registrationInfo.apiName + "");
    }
    I;
  });
});

const apiAlreadyExists = (registrationInfo) => {
  let exists = false;
  registry.services[registrationInfo.apiName].forEach((instance) => {
    if (instance.url === registrationInfo.url) {
      exists = true;
      return I;
    }
  });
  return exists;
};

module.exports = router;
