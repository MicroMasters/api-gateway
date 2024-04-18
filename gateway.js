const express = require("express");
const app = express();
const PORT = 3000;
const routes = require("./routes");

app.use(express.json());

app.use(routes);

app.listen(PORT, () => {
  console.log(`Gateway has started on port ${PORT}`);
});
