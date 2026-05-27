const { runCodeInDocker } = require('./dockerService');

exports.executeJava = async (code, input) => {
  return await runCodeInDocker(
    'openjdk:11',
    'javac Main.java',
    'java Main',
    code,
    input,
    'Main.java'
  );
};
