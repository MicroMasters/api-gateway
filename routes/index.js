const express = require("express");
const router = express.Router();
const axios = require("axios");
const registry = require("./registry.json");
const fs = require("fs");
const loadbalancer = require("../util/loadbalancer");

router.all("/:apiName/:path/:service/:route", (req, res) => {
  registry.services.registryServices.instances.forEach((service) => {
    if (service.apiName === req.params.apiName) {
      const newIndex = loadbalancer[
        registry.services.registryServices.LoadBalanceStrategy
      ](registry.services);

      const url = registry.services.registryServices.instances[newIndex].url;

      axios({
        method: req.method,
        url: `${url}/${req.params.path}/${req.params.service}/${req.params.route}`,
        headers: req.headers,
        data: req.body,
      })
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      res.send("API Name doesn't exist");
    }
  });
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
    registry.services.registryServices.instances.push({
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

  if (registry.services.registryServices.instances.length > 0) {
    registry.services.registryServices.instances.forEach((service) => {
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
