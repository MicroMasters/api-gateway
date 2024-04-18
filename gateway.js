const express = require("express");
const app = express();
const helmet = require("helmet");
const PORT = 3000;
const routes = require("./routes");
const { default: helmet } = require("helmet");

app.use(express.json());
app.use(helmet());

app.use(routes);

app.listen(PORT, () => {
  console.log(`Gateway has started on port ${PORT}`);
});
