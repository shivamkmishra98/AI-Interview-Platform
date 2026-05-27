const { runCodeInDocker } = require('./dockerService');

exports.executeCpp = async (code, input) => {
  return await runCodeInDocker(
    'gcc:latest',
    'g++ main.cpp -o main',
    './main',
    code,
    input,
    'main.cpp'
  );
};
