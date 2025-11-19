import dotenv from "dotenv";
dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.info(`Server listening on ${PORT}`);
});
