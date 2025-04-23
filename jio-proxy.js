const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("Missing ?url param");

  try {
    const response = await axios.get(targetUrl, {
      proxy: {
        host: "109.236.82.42",
        port: 9999,
        auth: {
          username: process.env.PROXY_USER,
          password: process.env.PROXY_PASS
        }
      },
      responseType: "stream"
    });

    res.set(response.headers);
    response.data.pipe(res);
  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Proxy running on port ${port}`));
