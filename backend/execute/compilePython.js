const { runCodeInDocker } = require('./dockerService');

exports.executePython = async (code, input) => {
  return await runCodeInDocker(
    'python:3.9-slim',
    null,
    'python main.py',
    code,
    input,
    'main.py'
  );
};
