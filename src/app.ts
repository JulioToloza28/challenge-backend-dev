import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { swaggerUi, swaggerSpec } from "./utils/swagger";
import apiRoutes from "./routes";

const app = express();
const PORT = process.env.PORT || 3000; 


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", apiRoutes);
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
  });

export default app;
