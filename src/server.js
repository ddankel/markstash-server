const app = require("./app");
const port = process.env.PORT || 8000;

// Listen on defined port
app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
