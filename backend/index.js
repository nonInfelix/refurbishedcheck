const express = require("express");
const scraper = require("./scraper");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );

  next();
});

app.get("/api/data", async (req, res) => {
  try {
    const search = req.query.search;
    console.log(search);
    const products = await scraper.runScraper(search);
    res.json(products);
  } catch (error) {
    console.error("Fehler beim Abrufen der Daten:", error);
    res.status(500).json({ error: "Serverfehler beim Abrufen der Daten" });
  }
});

app.listen(3000, () => {
  console.log("Server gestartet auf Port 3000");
});
