const db = require("../db/queries");
const passport = require("passport");


const getMembershipPage = (req, res) => {
  res.render("member", { title: "Membership Page" });
};
const memberCode = 1234;
const adminCode = 4321;
const updateMembershipStatus = async (req, res) => {
  try {
    const userId = req.user?.id; // Assuming user ID is stored in session
    if (!userId) {
      return res.status(401).send("Unauthorized: No user session found");
    } else if (req.body.memberCode == memberCode) {
      await db.updateMembershipStatus( userId,true);
      res.redirect('/members-only');
    } else if (req.body.memberCode == adminCode) {
      await db.updateMembershipStatus(userId, true);
      await db.updateAdminStatus(userId, true);
      res.redirect('/members-only');
    } else {
      res.render("member", {
        title: "Membership Page",
        error: "Invalid membership code",
      });
    }
  } catch (error) {
    console.error("Error updating membership status:", error);
    res.status(500).send("Internal Server Error");
  }
};

const checkMembershipStatus = async (req, res) => {
  try {
    const userId = req.user?.id; // Assuming user ID is stored in session
    if (!userId) {
      return res.status(401).send("Unauthorized: No user session found");
    }

    const status = await db.membershipStatus(userId);
    if (!status) {
       getMembershipPage(req, res);
      return;
    }else{
        res.redirect('/members-only');
    }
  } catch (error) {
    console.error("Error checking membership status:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getMembershipPage,
    updateMembershipStatus,
    checkMembershipStatus,
};