import express from "express"
import { auth } from "../middleware/auth"
import { createTask, deleteTask, generatePDF, getTasks, updateTask , uploadFile} from "../controller/taskController"

const router = express.Router()

router.get("/", auth, getTasks)
router.post("/", auth, createTask)
router.put("/:id", auth, updateTask)
router.delete("/:id", auth, deleteTask)
router.get("/pdf", auth, generatePDF)
router.post("/:id/upload", auth, uploadFile)

export default router
