const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

exports.runCodeInDocker = (image, compileCmd, runCmd, code, input, codeFilename) => {
  return new Promise((resolve) => {
    const id = uuidv4();
    const tempDir = path.join(__dirname, '../temp', id);
    
    try {
      fs.mkdirSync(tempDir, { recursive: true });
      fs.writeFileSync(path.join(tempDir, codeFilename), code);
      fs.writeFileSync(path.join(tempDir, 'input.txt'), input || '');

      // Convert path for Docker volume mounting. Using standard paths.
      // Docker Desktop handles standard absolute paths well.
      const volumePath = tempDir;
      
      const script = compileCmd ? `${compileCmd} && ${runCmd} < input.txt` : `${runCmd} < input.txt`;
      const cmd = `docker run --network none --rm -v "${volumePath}:/app" -w /app ${image} sh -c "${script}"`;

      const timeout = 10000; // 10s execution timeout

      exec(cmd, { timeout }, (error, stdout, stderr) => {
        // Cleanup temp files
        try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
        
        if (error) {
          if (error.killed) {
            return resolve({ success: false, output: 'Execution Timed Out (Limit: 10s)' });
          }
          return resolve({ success: false, output: stderr || stdout || error.message });
        }
        resolve({ success: true, output: stdout });
      });
    } catch (err) {
      try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
      resolve({ success: false, output: 'Server Error: Failed to prepare execution environment.' });
    }
  });
};
