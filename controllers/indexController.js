const db = require("../db/queries");

exports.getHome = async (req, res) => {
     if (req.isAuthenticated()) {
        return res.redirect("/member"); 
    }
  try {
    const messages = await db.getMessages();
    res.render("index", { messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).send("Internal Server Error");
  }
};

