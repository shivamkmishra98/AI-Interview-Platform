const { executePython } = require('../execute/compilePython');
const { executeCpp } = require('../execute/compileCpp');
const { executeJava } = require('../execute/compileJava');

// @desc    Execute code in a sandbox container
// @route   POST /api/execute
// @access  Private
exports.runCode = async (req, res) => {
  try {
    const { language, code, input } = req.body;

    if (!language || !code) {
      return res.status(400).json({ success: false, error: 'Language and code are required' });
    }

    let result;

    switch (language.toLowerCase()) {
      case 'python':
        result = await executePython(code, input);
        break;
      case 'cpp':
      case 'c++':
        result = await executeCpp(code, input);
        break;
      case 'java':
        result = await executeJava(code, input);
        break;
      default:
        return res.status(400).json({ success: false, error: 'Unsupported language' });
    }

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
