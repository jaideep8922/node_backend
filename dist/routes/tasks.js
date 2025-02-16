"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const taskController_1 = require("../controller/taskController");
const router = express_1.default.Router();
router.get("/", auth_1.auth, taskController_1.getTasks);
router.post("/", auth_1.auth, taskController_1.createTask);
router.put("/:id", auth_1.auth, taskController_1.updateTask);
router.delete("/:id", auth_1.auth, taskController_1.deleteTask);
router.get("/pdf", auth_1.auth, taskController_1.generatePDF);
router.post("/:id/upload", auth_1.auth, taskController_1.uploadFile);
exports.default = router;
