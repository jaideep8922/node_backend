import Task from "../models/Task";
import PDFDocument from "pdfkit";
import multer from "multer";
import path from "path";

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file:any, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Get tasks
export const getTasks = async (req: any, res: any) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).send("Server error");
  }
};

// Create task
export const createTask = async (req: any, res: any) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const { title, description, dueDate, status } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newTask = new Task({
      user: req.user.id,
      title,
      description,
      dueDate,
      status,
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).send("Server error");
  }
};

// Update task
export const updateTask = async (req: any, res: any) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const { title, description, dueDate, status } = req.body;
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    task = await Task.findByIdAndUpdate(req.params.id, { title, description, dueDate, status }, { new: true });

    res.json(task);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).send("Server error");
  }
};

// Delete task
export const deleteTask = async (req: any, res: any) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await task.deleteOne();
    res.json({ message: "Task removed" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).send("Server error");
  }
};

// Generate PDF code
export const generatePDF = async (req: any, res: any) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const tasks = await Task.find({ user: req.user.id });
    const doc = new PDFDocument();

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
  } catch (err) {
    console.error("Error generating PDF:", err);
    res.status(500).send("Server error");
  }
};

// Upload file
export const uploadFile = [
  upload.single("file"),
  async (req: any, res: any) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized access" });
      }

      const task = await Task.findById(req.params.id);

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
      await task.save();

      res.json({ file: task.file });
    } catch (err) {
      console.error("Error uploading file:", err);
      res.status(500).send("Server error");
    }
  },
];