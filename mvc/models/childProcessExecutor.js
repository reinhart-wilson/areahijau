import { spawn } from 'child_process';

export const runPython = async (scriptPath, params) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [scriptPath].concat(params));

        let output = '';
        let error = '';

        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            error += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                resolve(output);
            } else {
                reject(new Error(`Proses Python error dengan kode ${code}. Error: ${error}`));
            }
        });
    });
}
