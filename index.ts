import { config } from "dotenv";
import { startServer } from "./app/app";
import { populateDB } from "./app/utilities/populateDb";

config();
startServer();
populateDB(); 