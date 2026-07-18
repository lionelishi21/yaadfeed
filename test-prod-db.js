const mongoose = require('mongoose');
const uri = "mongodb+srv://lionelishmael_db_user:QlyPp6dgKy9WyKCl@cluster0.peqgshw.mongodb.net/yardvybes?appName=Cluster0";
mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 }).then(() => {
  console.log("Connected to prod DB successfully!");
  process.exit(0);
}).catch(err => {
  console.error("Failed to connect:", err.message);
  process.exit(1);
});
