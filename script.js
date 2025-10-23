// Basic script for interactivity
document.addEventListener('DOMContentLoaded', function() {
    const commandInput = document.getElementById('command-input');
    const terminal = document.getElementById('terminal');
    let currentDir = '~';

    if (commandInput) {
        commandInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const command = commandInput.value.trim();
                if (command) {
                    executeCommand(command);
                    commandInput.value = '';
                }
            }
        });
    }

    function executeCommand(cmd) {
        const outputDiv = document.createElement('div');
        outputDiv.className = 'output';
        outputDiv.textContent = `[ec2-user@ip-172-31-0-1 ${currentDir}]$ ${cmd}`;
        terminal.appendChild(outputDiv);

        const resultDiv = document.createElement('div');
        resultDiv.className = 'output';

        let result = simulateCommand(cmd);
        resultDiv.innerHTML = result.replace(/\n/g, '<br>');
        terminal.appendChild(resultDiv);

        // Add new prompt
        const newPrompt = document.createElement('div');
        newPrompt.className = 'output';
        newPrompt.textContent = `[ec2-user@ip-172-31-0-1 ${currentDir}]$ `;
        terminal.appendChild(newPrompt);

        terminal.scrollTop = terminal.scrollHeight;
    }

    function simulateCommand(cmd) {
        const parts = cmd.split(' ');
        const command = parts[0];
        const args = parts.slice(1);

        switch (command) {
            case 'pwd':
                return '/home/ec2-user';
            case 'ls':
                if (args.includes('-l')) {
                    return 'total 0<br>-rw-r--r-- 1 ec2-user ec2-user 0 Oct 22 15:00 archivo.txt<br>drwxr-xr-x 2 ec2-user ec2-user 6 Oct 22 15:00 directorio';
                }
                return 'archivo.txt directorio';
            case 'cd':
                if (args[0] === '/home') {
                    currentDir = '/home';
                    return '';
                } else if (args[0] === '..') {
                    currentDir = '~';
                    return '';
                } else {
                    currentDir = args[0] || '~';
                    return '';
                }
            case 'echo':
                return args.join(' ');
            case 'mkdir':
                return `Directorio '${args[0]}' creado.`;
            case 'touch':
                return `Archivo '${args[0]}' creado.`;
            case 'ps':
                return 'PID TTY          TIME CMD<br>1234 pts/0    00:00:00 bash<br>5678 pts/0    00:00:00 ps';
            case 'clear':
                terminal.innerHTML = '<div class="output">[ec2-user@ip-172-31-0-1 ~]$ </div><input type="text" id="command-input" placeholder="Escribe un comando aquí..." autofocus>';
                return '';
            default:
                return `bash: ${command}: comando no encontrado`;
        }
    }
});
