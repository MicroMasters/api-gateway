const express = require("express");
const router = express.Router();
const axios = require("axios");
const registry = require("./registry.json");
const fs = require("fs");

router.all("/:apiName/:path/:service/:route", (req, res) => {
  if (registry.services[req.params.apiName]) {
    axios({
      method: req.method,
      url: `${registry.services[req.params.apiName].url}/${req.params.path}/${
        req.params.service
      }/${req.params.route}`,
      headers: req.headers,
      data: req.body,
    }).then((response) => {
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

  if (apiAlreadyExists(registrationInfo)) {
    res.send(
      "API already exists for " +
        registrationInfo.apiName +
        " at " +
        registrationInfo.url +
        "\n"
    );
    return;
  } else {
    registry.services.registryServices.push({
      ...registrationInfo,
    });

    fs.writeFile(
      "./routes/registry.json",
      JSON.stringify(registry),
      (error) => {
        if (error) {
          res.send(
            "Could not register" + registrationInfo.apiName + "\n" + error
          );
        } else {
          res.send("Successfully registered '" + registrationInfo.apiName + "");
        }
      }
    );
  }
});

router.post("/unregister", (req, res) => {
  const registrationInfo = req.body;
  if (apiAlreadyExists(registrationInfo)) {
    const index = registry.services.registryServices.findIndex((instance) => {
      return registrationInfo.url == instance.url;
    });

    registry.services.registryServices.splice(index, 1);
    fs.writeFile(
      "./routes/registry.json",
      JSON.stringify(registry),
      (error) => {
        if (error) {
          res.send(
            "Could not unregister registrationInfo.apiName" + "\n*" + error
          );
        } else {
          res.send(
            "Successfully unregistered " + registrationInfo.apiName + " "
          );
        }
      }
    );
  } else {
    res.send(
      "Configuration does not exist for " +
        registrationInfo.apiName +
        " at " +
        registrationInfo.url +
        "\n"
    );
  }
});

const apiAlreadyExists = (registrationInfo) => {
  let exists = false;

  if (registry.services.registryServices.length > 0) {
    registry.services.registryServices.forEach((service) => {
      if (
        service.host === registrationInfo.host &&
        service.port === registrationInfo.port
      ) {
        exists = true;
      }
    });
  }
  return exists;
};

module.exports = router;
