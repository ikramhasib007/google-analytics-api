require('dotenv').config()
const express = require("express");
const { googleAnalyticsApi, numberWithCommas } = require("./lib");

const app = express();

async function getAnalyticsData() {
  try {
    const api = new googleAnalyticsApi();
    const data = await api.getAnalyticsData();
    return data;
  } catch (error) {
    console.log("error: ", error);
    throw Error(error.message);
  }
}

app.get("/api", async (req, res) => {
  const data = await getAnalyticsData();
  res.send(data);
});

app.get("/", async (req, res) => {
  const { response } = await getAnalyticsData();

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
        html, body {
          margin: 20px;
        }
        table {
          font-family: arial, sans-serif;
          border-collapse: collapse;
          width: 512px;
        }
        h2 {
          margin: 12px auto;
        }

        td, th {
          border: 1px solid #dddddd;
          text-align: left;
          padding: 8px;
        }

        tr:nth-child(even) {
          background-color: #dddddd;
        }
        </style>
      </head>
      <body>
        <h2>Product Page Interactions</h2>
        <table>
          <tr>
            ${[...response.dimensionHeaders, ...response.metricHeaders]
      .map((item) => `<th>${item.name}</th>`)
      .join("")}
          </tr>
          ${response.rows
      .map(
        (row) => `
                    <tr>
                      ${[...row.dimensionValues, ...row.metricValues]
            .map((item) => `<td>${numberWithCommas(item.value)}</td>`)
            .join("")}
                    </tr>
                  `
      )
      .join("")}
        </table>
      </body>
    </html>
    `);
});

async function main() {
  const port = +process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

main().catch((e) => {
  console.log(e);
  process.exit(1);
});
