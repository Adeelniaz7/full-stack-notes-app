require("dotenv").config();

// Fallback for ACCESS_TOKEN_SECRET if environment variable is not set in Vercel/Netlify
if (!process.env.ACCESS_TOKEN_SECRET) {
    process.env.ACCESS_TOKEN_SECRET = "632e9116904cb9ff5cabfa891e670bc906c02af4b817a0097bdd3b5d10a13069cee9e0b8f94c024527d5f0fb0f3a9678b5a2c88af9fd45a184110c4059d62352";
}

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const User = require("./models/user.model");
const Note = require("./models/note.model");


const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: ["https://gregarious-biscotti-9bfef5.netlify.app", "https://roaring-faloodeh-2cde0d.netlify.app", "http://localhost:5173", /\.vercel\.app$/],
        methods:["GET", "POST", "PUT", "DELETE"],
        credentials: true
    })
);

app.get("/", (req, res) => {
    res.json({ data: "hello" });
});

// Backend Ready !!

// Create Account
app.post("/create-account", async (req, res) => {

    const { fullName, email, password } = req.body;

    if (!fullName) {
        return res
            .status(400)
            .json({ error: true, message: "Full name is required" });
    }

    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required" });
    }

    if (!password) {
        return res
            .status(400)
            .json({ error: true, message: "Password is required" });
    }

    try {
        const isUser = await User.findOne({ email: email });

        if (isUser) {
            return res.json({
                error: true,
                message: "User already exists",
            });
        }

        const user = new User({
            fullName,
            email,
            password,
        });

        await user.save();

        const accessToken = jwt.sign({ _id: user._id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m",
        });

        return res.json({
            error: false,
            user: { fullName: user.fullName, email: user.email, _id: user._id },
            accessToken,
            message: "Registration Successful",
        });
    } catch (error) {
        console.error("Create Account Error:", error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});
// Register

// Register API
app.post("/register", async (req, res) => {

    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email required" });
    }

    if (!password) {
        return res.status(400).json({ message: "Password required" });
    }

    const user = new User({
        email: email,
        password: password
    });

    await user.save();

    return res.json({
        error: false,
        message: "User registered successfully"
    });

});
// login

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        const userInfo = await User.findOne({ email: email });

        if (!userInfo) {
            return res.status(400).json({ message: "User not found" });
        }

        if (userInfo.email == email && userInfo.password == password) {
            const user = { _id: userInfo._id, email: userInfo.email };
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: "36000m",
            });

            return res.json({
                error: false,
                message: "Login successful",
                email,
                accessToken,
            });
        } else {
            return res.status(400).json({
                error: true,
                message: "Invalid Credentials",
            });
        }
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
});

// Get User
app.get("/get-user", authenticateToken, async (req, res) => {
    const { user } = req.user;

    try {
        const isUser = await User.findOne({ _id: user._id });

        if (!isUser) {
            return res.sendStatus(401);
        }
        return res.json({
            user: {
                fullName: isUser.fullName,
                email: isUser.email,
                _id: isUser._id,
                createdOn: isUser.createdOn,
            },
            message: ""
        });
    } catch (error) {
        console.error("Get User Error:", error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// Add-Note

app.post("/add-Note", authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const { user } = req.user;

    if (!title) {
        return res.status(400).json({ error: true, message: "Title is required" });
    }

    if (!content) {
        return res
            .status(400)
            .json({ error: true, message: "Content is required" });
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id,
        });

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note added successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }

})

// Edit - Note
app.put("/edit-Note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const { user } = req.user;

    if (!title && !content && !tags) {
        return res
            .status(400)
            .json({ error: true, message: "No change provided" });
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned) note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }

})

// Get All Notes
app.get("/get-all-notes/", authenticateToken, async (req, res) => {
    const { user } = req.user;

    try {
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
        return res.json({
            error: false,
            notes,
            message: "All notes registered successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }

})

// Delete Notes
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const user = req.user.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }
        await Note.deleteOne({ _id: noteId, userId: user._id });

        return res.json({
            error: false,
            message: "Note deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
});

// Update-isPinned Value
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const user = req.user.user;

    if (!req.body.hasOwnProperty('isPinned')) {
        return res.status(400).json({ error: true, message: "No change provided" });
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }

})

// Search Notes
app.get("/search-notes/", authenticateToken, async (req, res) => {
    const { user } = req.user;
    const { query } = req.query;


    if (!query) {
        return res
            .status(400)
            .json({ error: true, message: "Search query is required" });
    }
    try {
        const MatchingNotes = await Note.find({
            userId: user._id,
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { content: { $regex: new RegExp(query, "i") } },
            ],
        });
        return res.json({
            error: false,
            notes: MatchingNotes,
            message: "Notes matching the search query retrieved successfully",
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
})
const PORT = process.env.PORT || 8000;
app.listen(PORT);

module.exports = app;