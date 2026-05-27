const Interview = require('../models/Interview');

// @desc    Get user performance analytics
// @route   GET /api/feedback/analytics
// @access  Private
exports.getAnalyticsDashboard = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user.id, status: 'completed' }).sort('createdAt');

    if (!interviews || interviews.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalInterviews: 0,
          averageScore: 0,
          performanceTrend: [],
          categoryAverages: []
        }
      });
    }

    let totalScore = 0;
    const categoryMap = {};
    const performanceTrend = [];

    interviews.forEach(interview => {
      totalScore += interview.overallScore;
      
      // Tracking for radar chart / category insights
      if (!categoryMap[interview.category]) {
        categoryMap[interview.category] = { total: 0, count: 0 };
      }
      categoryMap[interview.category].total += interview.overallScore;
      categoryMap[interview.category].count += 1;

      // Tracking for line chart
      performanceTrend.push({
        date: interview.createdAt.toISOString().split('T')[0],
        score: interview.overallScore,
        category: interview.category,
      });
    });

    const categoryAverages = Object.keys(categoryMap).map(cat => ({
      subject: cat,
      score: Math.round(categoryMap[cat].total / categoryMap[cat].count),
      fullMark: 100
    }));

    // Calculate strong and weak topics
    const sortedCategories = [...categoryAverages].sort((a, b) => b.score - a.score);
    const strongTopics = sortedCategories.slice(0, 2).map(c => c.subject);
    const weakTopics = sortedCategories.slice(-2).reverse().map(c => c.subject);

    res.status(200).json({
      success: true,
      data: {
        totalInterviews: interviews.length,
        averageScore: Math.round(totalScore / interviews.length),
        performanceTrend,
        categoryAverages,
        strongTopics,
        weakTopics,
        history: interviews // returning full history for filtering
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
