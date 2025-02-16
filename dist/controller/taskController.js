"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = exports.generatePDF = exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Multer configuration
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage });
// Get tasks
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        const tasks = yield Task_1.default.find({ user: req.user.id });
        res.json(tasks);
    }
    catch (err) {
        console.error("Error fetching tasks:", err);
        res.status(500).send("Server error");
    }
});
exports.getTasks = getTasks;
// Create task
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        const { title, description, dueDate, status } = req.body;
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }
        const newTask = new Task_1.default({
            user: req.user.id,
            title,
            description,
            dueDate,
            status,
        });
        const task = yield newTask.save();
        res.json(task);
    }
    catch (err) {
        console.error("Error creating task:", err);
        res.status(500).send("Server error");
    }
});
exports.createTask = createTask;
// Update task
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        const { title, description, dueDate, status } = req.body;
        let task = yield Task_1.default.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "User not authorized" });
        }
        task = yield Task_1.default.findByIdAndUpdate(req.params.id, { title, description, dueDate, status }, { new: true });
        res.json(task);
    }
    catch (err) {
        console.error("Error updating task:", err);
        res.status(500).send("Server error");
    }
});
exports.updateTask = updateTask;
// Delete task
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        const task = yield Task_1.default.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "User not authorized" });
        }
        yield task.deleteOne();
        res.json({ message: "Task removed" });
    }
    catch (err) {
        console.error("Error deleting task:", err);
        res.status(500).send("Server error");
    }
});
exports.deleteTask = deleteTask;
// Generate PDF code
const generatePDF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        const tasks = yield Task_1.default.find({ user: req.user.id });
        const doc = new pdfkit_1.default();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=tasks.pdf");
        doc.pipe(res);
        doc.fontSize(20).text("Task List", { align: "center" });
        doc.moveDown();
        tasks.forEach((task, index) => {
            doc.fontSize(14).text(`${index + 1}. ${task.title}`);
            doc.fontSize(12).text(`Description: ${task.description}`);
            doc.text(`Due Date: ${new Date(task.dueDate).toLocaleDateString()}`);
            doc.text(`Status: ${task.status}`);
            doc.moveDown();
        });
        doc.end();
    }
    catch (err) {
        console.error("Error generating PDF:", err);
        res.status(500).send("Server error");
    }
});
exports.generatePDF = generatePDF;
// Upload file
exports.uploadFile = [
    upload.single("file"),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized access" });
            }
            const task = yield Task_1.default.findById(req.params.id);
            if (!task) {
                return res.status(404).json({ message: "Task not found" });
            }
            if (task.user.toString() !== req.user.id) {
                return res.status(401).json({ message: "User not authorized" });
            }
            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }
            task.file = `/uploads/${req.file.filename}`;
            yield task.save();
            res.json({ file: task.file });
        }
        catch (err) {
            console.error("Error uploading file:", err);
            res.status(500).send("Server error");
        }
    }),
];
