const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const DATA_FILE = path.join(
  __dirname,
  "..",
  "data",
  "routeOptimizer.json"
);

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

/*
  GET complete route optimizer dashboard data
*/
router.get("/", (req, res) => {
  try {
    const data = readData();

    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to load route optimizer data"
    });
  }
});

/*
  GET only route waypoints
*/
router.get("/waypoints", (req, res) => {
  const data = readData();

  res.json({
    success: true,
    waypoints: data.waypoints
  });
});

/*
  GET current vehicle telemetry
*/
router.get("/telemetry", (req, res) => {
  const data = readData();

  res.json({
    success: true,
    vehicle: data.vehicle,
    telemetry: data.telemetry
  });
});

/*
  POST new telemetry reading

  This is the endpoint that can later receive
  real GPS / IoT / reefer sensor data.
*/
router.post("/telemetry", (req, res) => {
  try {
    const data = readData();

    const {
      latitude,
      longitude,
      temperature,
      humidity,
      speedKmph,
      fuelLevel
    } = req.body;

    if (temperature !== undefined) {
      data.telemetry.temperature = Number(temperature);
    }

    if (humidity !== undefined) {
      data.telemetry.humidity = Number(humidity);
    }

    if (speedKmph !== undefined) {
      data.telemetry.speedKmph = Number(speedKmph);
    }

    if (fuelLevel !== undefined) {
      data.telemetry.fuelLevel = Number(fuelLevel);
    }

    data.telemetry.lastUpdated = new Date().toISOString();

    /*
      Simple cold-chain freshness calculation.

      Target temperature = 4°C
      Safe range = 2°C to 6°C
    */
    const currentTemp = data.telemetry.temperature;

    if (currentTemp >= 2 && currentTemp <= 6) {
      data.telemetry.spoilageIndex = 99.2;
    } else if (currentTemp <= 8) {
      data.telemetry.spoilageIndex = 94.5;
    } else {
      data.telemetry.spoilageIndex = 82.0;
    }

    /*
      In a real system, latitude and longitude
      would be stored in a GPS position field.
    */
    if (latitude !== undefined && longitude !== undefined) {
      data.telemetry.latitude = Number(latitude);
      data.telemetry.longitude = Number(longitude);
    }

    writeData(data);

    res.json({
      success: true,
      message: "Telemetry updated successfully",
      telemetry: data.telemetry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to update telemetry"
    });
  }
});

/*
  POST simulate a spoilage / route disruption event
*/router.post("/simulate-event", (req, res) => {
  try {
    const data = readData();

    const { eventType } = req.body;

    if (eventType === "temperature_spike") {
      data.telemetry.temperature = 8.7;
      data.telemetry.spoilageIndex = 82.0;
    }

    if (eventType === "traffic_delay") {
      data.metrics.optimizedTransitHours = 8.1;
      data.metrics.transitTimeReducedHours = 1.4;
    }

    if (eventType === "clear") {
      data.telemetry.temperature = 4.2;
      data.telemetry.spoilageIndex = 99.2;
      data.metrics.optimizedTransitHours = 6.8;
      data.metrics.transitTimeReducedHours = 2.7;
    }

    data.telemetry.lastUpdated = new Date().toISOString();

    writeData(data);

    res.json({
      success: true,
      message: `Event ${eventType} simulated`,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to simulate event"
    });
  }
});

module.exports = router;