const User = require('../models/User');
const Interview = require('../models/Interview');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    await user.save();
    
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get Leaderboard
// @route   GET /api/user/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res) => {
  try {
    // Basic leaderboard based on total interviews completed or average score.
    // For simplicity, we'll fetch all users, then calculate their average score from interviews.
    // A better approach in production is to maintain an aggregate stat on the User model.
    const users = await User.find().select('name');
    const interviews = await Interview.find({ status: 'completed' });

    const userStats = users.map(user => {
      const userInterviews = interviews.filter(i => i.user.toString() === user._id.toString());
      const totalInterviews = userInterviews.length;
      const avgScore = totalInterviews > 0 
        ? userInterviews.reduce((acc, curr) => acc + curr.overallScore, 0) / totalInterviews
        : 0;
      
      return {
        id: user._id,
        name: user.name,
        totalInterviews,
        avgScore: Math.round(avgScore)
      };
    });

    // Sort by avg score descending
    const leaderboard = userStats
      .filter(u => u.totalInterviews > 0)
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 10); // top 10

    res.status(200).json({ success: true, data: leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
