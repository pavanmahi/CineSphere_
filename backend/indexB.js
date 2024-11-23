import express from "express";
import mongoose, { Mongoose } from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;
mongoose
  .connect(
    "mongodb+srv://pavan4376:pavan4376@cluster0.fmkfb3a.mongodb.net/MOVIE_APP?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("connected to cloud database");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema, "users");
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const doc = await User.findOne({ username: username });
    if (!doc) {
      res.json({ message: "Username does not exist", status: 100 });
    } else {
      if (doc.password === password) {
        res.cookie('username', username, {
          maxAge: 604800000, // 7 days in milliseconds
          sameSite: 'None',  // For cross-origin requests
          secure: true,      // Ensure this is set to true when using SameSite: None
        });        
        res.json({ message: "Login successful", status: 200 });
      } else {
        res.json({ message: "Password is incorrect", status: 101 });
      }
    }
  } catch (err) {
    res.json({ message: err.message });
  }
});

app.post("/adduser", async (req, res) => {
  const { name, username, email, password } = req.body;
  try {
    const doc = await User.findOne({ user: username });
    if (!doc) {
      const newUser = new User({
        name: name,
        username: username,
        email: email,
        password: password,
      });
      await newUser.save();
      res.json({ message: "User added successfully", status: 200 });
    } else {
      res.json({ message: "User already exists", status: 100 });
    }
  } catch (err) {
    res.json({ message: err.message });
  }
});

app.get("/users/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const doc = await User.findOne({ username: username });
    if (doc) {
      res.json(doc);
      console.log(doc);
    } else {
      res.json({ message: "User not found", status: 100 });
    }
  } catch (err) {
    res.json({ message: err.message });
  }
});

app.post("/update", async (req, res) => {
  const { username, name, email, password } = req.body;
  try {
    const updatedUser = await User.findOneAndUpdate(
      { username: username },
      { name: name, email: email, password: password },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found", status: 404 });
    } else {
      res.status(200).json({
        message: "User updated successfully",
        status: 200,
        user: updatedUser,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", status: 500 });
  }
});

const fvrtSchema = new mongoose.Schema({
  username: String,
  id: String,
  title: String,
  original_title: String,
  release_date: String,
  popularity: String,
  vote_average: String,
  overview: String,
  poster_path: String,
});
const fvrt = mongoose.model("fvrt", fvrtSchema, "fvrt");

app.post("/isWatched", async (req, res) => {
  const { username, movie_id } = req.body;
  try {
    const doc = await fvrt.findOne({ username: username, id: movie_id });
    if (doc) {
      res.json({ status: 200 });
    } else {
      res.json({ status: 404 });
    }
  } catch (err) {
    res.json({ status: 505 });
  }
});
const likedSchema = new mongoose.Schema({
  username: String,
  id: String,
  title: String,
  original_title: String,
  release_date: String,
  popularity: String,
  vote_average: String,
  overview: String,
  poster_path: String,
});
const liked = mongoose.model("liked", likedSchema, "liked");
app.post("/isLiked", async (req, res) => {
  const { username, movie_id } = req.body;
  try {
    const doc = await liked.findOne({ username: username, id: movie_id });
    if (doc) {
      res.json({ status: 200 });
    } else {
      res.json({ status: 404 });
    }
  } catch (err) {
    res.json({ status: 505 });
  }
});

app.post("/addfvrt", async (req, res) => {
  const {
    username,
    movie_id,
    title,
    original_title,
    year,
    popularity,
    rating,
    overview,
    poster_path,
  } = req.body;
  try {
    const doc = await fvrt.findOne({ username: username, id: movie_id });
    if (doc) {
      res.json({ status: 200 });
    } else {
      const newfvrt = new fvrt({
        username: username,
        id: movie_id,
        title: title,
        original_title: original_title,
        release_date: year,
        popularity: popularity,
        vote_average: rating,
        overview: overview,
        poster_path: poster_path,
      });
      await newfvrt.save();
      res.json({ status: 200 });
    }
  } catch (err) {
    res.json({ status: 500 });
  }
});

app.post("/addliked", async (req, res) => {
  const {
    username,
    movie_id,
    title,
    original_title,
    year,
    popularity,
    rating,
    overview,
    poster_path,
  } = req.body;
  try {
    const doc = await liked.findOne({ username: username, id: movie_id });
    if (doc) {
      res.json({ status: 200 });
    } else {
      const newliked = new liked({
        username: username,
        id: movie_id,
        title: title,
        original_title: original_title,
        release_date: year,
        popularity: popularity,
        vote_average: rating,
        overview: overview,
        poster_path: poster_path,
      });
      await newliked.save();
      res.json({ status: 200 });
    }
  } catch (err) {
    res.status(500);
  }
});

app.post("/removeliked", async (req, res) => {
  const { username, movie_id } = req.body;
  try {
    const doc = await liked.findOneAndDelete({
      username: username,
      id: movie_id,
    });
    if (doc) {
      res.json({ status: 200 });
    } else {
      res.json({ status: 404 });
    }
  } catch (err) {
    res.json({ status: 500 });
  }
});

app.post("/removefvrt", async (req, res) => {
  const { username, movie_id } = req.body;
  try {
    const doc = await fvrt.findOneAndDelete({
      username: username,
      id: movie_id,
    });
    if (doc) {
      res.json({ status: 200 });
    } else {
      res.json({ status: 404 });
    }
  } catch (err) {
    res.json({ status: 505 });
  }
});

app.get("/showwatch/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const doc = await fvrt.find({ username: username }).lean();
    if (doc) {
      res.json(doc);
    } else {
      res.json({ status: 404 });
    }
  } catch (err) {
    res.json({ status: 500 });
  }
});

app.get("/showliked/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const doc = await liked.find({ username: username }).lean();
    if (doc) {
      res.json(doc);
    } else {
      res.json({ status: 404 });
    }
  } catch (err) {
    res.json({ status: 500 });
  }
});

const reviewSchema = new mongoose.Schema({
  username: String,
  id: String,
  review: String,
});
const reviewdb = mongoose.model("reviewdb", reviewSchema, "reviewdb");
app.post("/addreview", async (req, res) => {
  const { username, movie_id, review } = req.body;
  try {
    if (review.length) {
      const newreview = new reviewdb({
        username: username,
        id: movie_id,
        review: review,
      });
      await newreview.save();
      res.json({ status: 200 });
    } else {
      res.json({ message: "review shouldn't be empty !", status: 404 });
    }
  } catch (err) {
    res.json({ status: 500, message: "error in adding review" });
  }
});

app.get("/showreview/:movie_id", async (req, res) => {
  const movie_id = req.params.movie_id;
  try {
    const docs = await reviewdb.find({ id: movie_id }).lean();
    console.log(" why why why ", docs);
    if (docs) {
      res.json(docs);
      console.log("Here it is backend: ", docs);
    } else {
      res.json({
        status: 404,
        message: "No reviews found",
      });
    }
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.json({
      status: 500,
      message: "Internal server error",
    });
  }
});
