// Terminal Simulator for Amazon Linux
let currentDir = '~';
let fileSystem = {
    '/': {
        'home': {
            'ec2-user': {
                'archivo.txt': 'Este es un archivo de prueba',
                'script.sh': '#!/bin/bash\necho "Hola Mundo"'
            }
        },
        'var': {
            'log': {
                'messages': 'Oct 22 15:00:00 ip-172-31-0-1 systemd[1]: Started Session',
                'nginx': {}
            },
            'www': {
                'html': {
                    'index.html': '<html><body>Welcome to Amazon Linux</body></html>'
                }
            }
        },
        'etc': {
            'os-release': 'NAME="Amazon Linux"\nVERSION="2023"\nID="amzn"\nID_LIKE="fedora"',
            'hostname': 'ip-172-31-0-1',
            'passwd': 'root:x:0:0:root:/root:/bin/bash\nec2-user:x:1000:1000::/home/ec2-user:/bin/bash'
        }
    }
};

let commandHistory = [];
let historyIndex = -1;
let currentInput = '';

// Initialize terminal
document.addEventListener('DOMContentLoaded', function() {
    const inputLine = document.getElementById('input-line');
    const terminal = document.getElementById('terminal');
    
    // Handle keyboard input
    document.addEventListener('keydown', handleKeyPress);
    
    // Handle clicks to focus input
    terminal.addEventListener('click', () => {
        focusInput();
    });
    
    focusInput();
});

function handleKeyPress(e) {
    const inputLine = document.getElementById('input-line');
    
    if (e.key === 'Enter') {
        e.preventDefault();
        const command = currentInput.trim();
        if (command) {
            executeCommand(command);
            commandHistory.push(command);
            historyIndex = commandHistory.length;
        }
        currentInput = '';
        updateInputLine();
    } else if (e.key === 'Backspace') {
        e.preventDefault();
        currentInput = currentInput.slice(0, -1);
        updateInputLine();
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            currentInput = commandHistory[historyIndex];
            updateInputLine();
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            currentInput = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            currentInput = '';
        }
        updateInputLine();
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        currentInput += e.key;
        updateInputLine();
    } else if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        clearTerminal();
    } else if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        currentInput = '';
        updateInputLine();
        addOutput('^C');
        addPrompt();
    }
}

function updateInputLine() {
    const inputLine = document.getElementById('input-line');
    inputLine.textContent = currentInput;
}

function focusInput() {
    // Visual feedback
}

function executeCommand(cmd) {
    const terminal = document.getElementById('terminal');
    
    // Show command
    const cmdDiv = document.createElement('div');
    cmdDiv.className = 'output';
    cmdDiv.innerHTML = `[ec2-user@ip-172-31-0-1 ${currentDir}]$ ${cmd}`;
    terminal.appendChild(cmdDiv);
    
    // Execute and show result
    const result = simulateCommand(cmd);
    if (result) {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'output';
        resultDiv.innerHTML = result.replace(/\n/g, '<br>');
        terminal.appendChild(resultDiv);
    }
    
    // Add new prompt
    addPrompt();
    
    // Scroll to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

function addPrompt() {
    const terminal = document.getElementById('terminal');
    const promptDiv = document.createElement('div');
    promptDiv.className = 'output';
    promptDiv.innerHTML = `[ec2-user@ip-172-31-0-1 ${currentDir}]$ <span id="input-line"></span><span class="cursor">_</span>`;
    terminal.appendChild(promptDiv);
}

function addOutput(text) {
    const terminal = document.getElementById('terminal');
    const outputDiv = document.createElement('div');
    outputDiv.className = 'output';
    outputDiv.innerHTML = text.replace(/\n/g, '<br>');
    terminal.appendChild(outputDiv);
}

function clearTerminal() {
    const terminal = document.getElementById('terminal');
    terminal.innerHTML = '';
    addOutput('<span style="color: #00ff00;">Amazon Linux 2023 Simulator</span>');
    addPrompt();
}

function simulateCommand(cmd) {
    const parts = cmd.trim().split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);
    
    switch (command) {
        case 'help':
            return `Comandos disponibles:
<span style="color: #00ffff;">Sistema de Archivos:</span> pwd, ls, cd, mkdir, touch, cat, find, tree, file, du, df
<span style="color: #00ffff;">Procesos:</span> ps, top, kill, whoami, hostname, uptime, free, date, uname, w
<span style="color: #00ffff;">Red:</span> ip, ping, curl, ifconfig, ss, netstat
<span style="color: #00ffff;">Paquetes:</span> dnf, yum, rpm
<span style="color: #00ffff;">Servicios:</span> systemctl
<span style="color: #00ffff;">Utilidades:</span> echo, clear, history, man, grep, head, tail

Escribe cualquier comando para probarlo. Para más info: man [comando]`;
        
        case 'pwd':
            return currentDir === '~' ? '/home/ec2-user' : currentDir;
        
        case 'ls':
            if (args.includes('-l') || args.includes('-la') || args.includes('-al')) {
                return `total 8
drwxr-xr-x 2 ec2-user ec2-user 4096 Oct 22 15:00 .
drwxr-xr-x 3 root     root     4096 Oct 22 14:30 ..
-rw-r--r-- 1 ec2-user ec2-user  220 Oct 22 15:00 archivo.txt
-rwxr-xr-x 1 ec2-user ec2-user  147 Oct 22 15:05 script.sh`;
            }
            return 'archivo.txt  script.sh';
        
        case 'cd':
            if (!args[0] || args[0] === '~') {
                currentDir = '~';
            } else if (args[0] === '..') {
                currentDir = currentDir === '~' ? '~' : '/';
            } else {
                currentDir = args[0];
            }
            return '';
        
        case 'echo':
            return args.join(' ');
        
        case 'whoami':
            return 'ec2-user';
        
        case 'hostname':
            return 'ip-172-31-0-1.ec2.internal';
        
        case 'date':
            return new Date().toString();
        
        case 'uptime':
            return ' 15:42:18 up 3 days,  2:15,  1 user,  load average: 0.23, 0.31, 0.28';
        
        case 'free':
            if (args.includes('-h')) {
                return `              total        used        free      shared  buff/cache   available
Mem:           3.8Gi       1.2Gi       1.5Gi       8.0Mi       1.1Gi       2.3Gi
Swap:          2.0Gi          0B       2.0Gi`;
            }
            return `              total        used        free      shared  buff/cache   available
Mem:        4045312     1258884     1573428        8192     1213000     2456428
Swap:       2097148           0     2097148`;
        
        case 'df':
            if (args.includes('-h')) {
                return `Filesystem      Size  Used Avail Use% Mounted on
devtmpfs        1.9G     0  1.9G   0% /dev
tmpfs           1.9G     0  1.9G   0% /dev/shm
/dev/xvda1       20G  4.2G   16G  21% /
/dev/xvdf        50G  8.5G   42G  17% /data`;
            }
            return `Filesystem     1K-blocks    Used Available Use% Mounted on
/dev/xvda1      20971520 4404316  16567204  21% /`;
        
        case 'ps':
            if (args.includes('aux') || args.includes('-aux')) {
                return `USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.1 169520 13140 ?        Ss   Oct20   0:02 /usr/lib/systemd/systemd
ec2-user  1234  0.0  0.0 116564  3208 pts/0    Ss   14:30   0:00 -bash
nginx     5678  0.0  0.1  47564  8952 ?        S    15:00   0:00 nginx: worker process
root      5679  0.0  0.2 125256 12840 ?        Ss   15:00   0:00 nginx: master process`;
            }
            return `  PID TTY          TIME CMD
 1234 pts/0    00:00:00 bash
 5432 pts/0    00:00:00 ps`;
        
        case 'top':
            return `top - 15:42:18 up 3 days,  2:15,  1 user,  load average: 0.23, 0.31, 0.28
Tasks: 142 total,   1 running, 141 sleeping,   0 stopped,   0 zombie
%Cpu(s):  2.3 us,  1.2 sy,  0.0 ni, 96.2 id,  0.3 wa,  0.0 hi,  0.0 si,  0.0 st
MiB Mem :   3955.2 total,   1536.8 free,   1228.3 used,   1190.1 buff/cache
MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   2397.2 avail Mem

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
 5679 root      20   0  125256  12840   8564 S   0.3   0.3   0:00.42 nginx
    1 root      20   0  169520  13140   8652 S   0.0   0.3   0:02.15 systemd`;
        
        case 'ip':
            if (args[0] === 'addr' || args[0] === 'a') {
                return `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
    inet6 ::1/128 scope host
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 9001 qdisc pfifo_fast state UP qlen 1000
    link/ether 02:42:ac:11:00:02 brd ff:ff:ff:ff:ff:ff
    inet 172.31.0.2/20 brd 172.31.15.255 scope global dynamic eth0
    inet6 fe80::42:acff:fe11:2/64 scope link`;
            }
            return 'Uso: ip [ OPTIONS ] OBJECT { COMMAND | help }';
        
        case 'ifconfig':
            return `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 9001
        inet 172.31.0.2  netmask 255.255.240.0  broadcast 172.31.15.255
        inet6 fe80::42:acff:fe11:2  prefixlen 64  scopeid 0x20<link>
        ether 02:42:ac:11:00:02  txqueuelen 1000  (Ethernet)`;
        
        case 'ping':
            const host = args[0] || 'google.com';
            return `PING ${host} (142.250.185.46) 56(84) bytes of data.
64 bytes from ${host}: icmp_seq=1 ttl=117 time=1.23 ms
64 bytes from ${host}: icmp_seq=2 ttl=117 time=1.45 ms

--- ${host} ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1001ms
rtt min/avg/max/mdev = 1.230/1.340/1.450/0.110 ms`;
        
        case 'cat':
            if (args[0] === '/etc/os-release') {
                return `NAME="Amazon Linux"
VERSION="2023"
ID="amzn"
ID_LIKE="fedora"
VERSION_ID="2023"
PLATFORM_ID="platform:al2023"
PRETTY_NAME="Amazon Linux 2023"
ANSI_COLOR="0;33"
CPE_NAME="cpe:2.3:o:amazon:amazon_linux:2023"
HOME_URL="https://aws.amazon.com/linux/"`;
            } else if (args[0] === '/etc/passwd') {
                return `root:x:0:0:root:/root:/bin/bash
ec2-user:x:1000:1000::/home/ec2-user:/bin/bash
nginx:x:996:994:Nginx web server:/var/lib/nginx:/sbin/nologin`;
            }
            return args[0] ? `cat: ${args[0]}: No such file or directory` : 'Este es un archivo de prueba';
        
        case 'uname':
            if (args.includes('-a')) {
                return 'Linux ip-172-31-0-1 6.1.19-30.43.amzn2023.x86_64 #1 SMP PREEMPT_DYNAMIC Wed Mar 15 16:26:32 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux';
            } else if (args.includes('-r')) {
                return '6.1.19-30.43.amzn2023.x86_64';
            }
            return 'Linux';
        
        case 'systemctl':
            if (args[0] === 'status') {
                const service = args[1] || 'nginx';
                return `● ${service}.service - The ${service} HTTP Server
   Loaded: loaded (/usr/lib/systemd/system/${service}.service; enabled; vendor preset: disabled)
   Active: active (running) since Mon 2023-10-23 15:00:12 UTC; 42min ago
 Main PID: 5679 (${service})
    Tasks: 5 (limit: 4656)
   Memory: 8.9M
   CGroup: /system.slice/${service}.service
           ├─5679 ${service}: master process /usr/sbin/${service}
           └─5680 ${service}: worker process

Oct 23 15:00:12 ip-172-31-0-1 systemd[1]: Starting The ${service} HTTP Server...
Oct 23 15:00:12 ip-172-31-0-1 systemd[1]: Started The ${service} HTTP Server.`;
            } else if (args[0] === 'list-units') {
                return `UNIT                                LOAD   ACTIVE SUB     DESCRIPTION
session-1.scope                     loaded active running Session 1 of user ec2-user
nginx.service                       loaded active running The nginx HTTP Server
sshd.service                        loaded active running OpenSSH server daemon
systemd-journald.service            loaded active running Journal Service

LOAD   = Reflects whether the unit definition was properly loaded.
ACTIVE = The high-level unit activation state, i.e. generalization of SUB.
SUB    = The low-level unit activation state, values depend on unit type.`;
            }
            return 'Uso: systemctl [OPTIONS...] COMMAND ...';
        
        case 'dnf':
        case 'yum':
            if (args[0] === 'list') {
                return `Installed Packages
bash.x86_64                      5.2.15-1.amzn2023.0.2                @System
nginx.x86_64                     1:1.24.0-1.amzn2023.0.1              @System
python3.x86_64                   3.11.2-2.amzn2023.0.4                @System`;
            } else if (args[0] === 'search') {
                return `Last metadata expiration check: 0:15:32 ago on Mon Oct 23 14:27:18 2023.
========================= Name Matched: ${args[1] || 'package'} =========================
nginx.x86_64 : High performance web server
python3.x86_64 : Python 3 interpreter`;
            }
            return `usage: dnf [options] COMMAND

List of Main Commands:

install         install a package or packages on your system
update          update a package or packages on your system
check-update    check for available package updates
remove          remove a package or packages from your system
list            list a package or groups of packages
info            show details about a package or group of packages
search          search package details for the given string`;
        
        case 'rpm':
            if (args.includes('-qa')) {
                return `bash-5.2.15-1.amzn2023.0.2.x86_64
systemd-252.4-1158.amzn2023.0.1.x86_64
nginx-1.24.0-1.amzn2023.0.1.x86_64
python3-3.11.2-2.amzn2023.0.4.x86_64`;
            }
            return 'Uso: rpm [OPTION...]';
        
        case 'w':
        case 'who':
            return ` 15:42:18 up 3 days,  2:15,  1 user,  load average: 0.23, 0.31, 0.28
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
ec2-user pts/0    203.0.113.1      14:30    0.00s  0.04s  0.01s w`;
        
        case 'history':
            return commandHistory.map((cmd, i) => `  ${i + 1}  ${cmd}`).join('\n');
        
        case 'clear':
            clearTerminal();
            return '';
        
        case 'mkdir':
            return args[0] ? `Directorio '${args[0]}' creado` : 'mkdir: falta un operando';
        
        case 'touch':
            return args[0] ? `Archivo '${args[0]}' creado` : 'touch: falta un operando';
        
        case 'find':
            return `/home/ec2-user/archivo.txt
/home/ec2-user/script.sh
/var/www/html/index.html`;
        
        case 'grep':
            return args.join(' ') ? `Resultado de grep para: ${args.join(' ')}` : 'grep: falta patrón de búsqueda';
        
        case 'man':
            const manCmd = args[0] || 'command';
            return `<span style="color: #00ffff;">NAME</span>
       ${manCmd} - manual page for ${manCmd}

<span style="color: #00ffff;">SYNOPSIS</span>
       ${manCmd} [OPTIONS]...

<span style="color: #00ffff;">DESCRIPTION</span>
       This is a simulated man page. In a real system, this would show
       comprehensive documentation for the ${manCmd} command.

Use arrow keys to scroll. Press 'q' to quit (simulated).`;
        
        case 'curl':
            return `<html>
<head><title>Example Domain</title></head>
<body>
<h1>Example Domain</h1>
<p>This is a simulated curl response.</p>
</body>
</html>`;
        
        case 'wget':
            return `--2023-10-23 15:42:20--  ${args[0] || 'http://example.com'}
Resolving example.com... 93.184.216.34
Connecting to example.com|93.184.216.34|:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 1256 (1.2K) [text/html]
Saving to: 'index.html'

index.html          100%[===================>]   1.23K  --.-KB/s    in 0s

2023-10-23 15:42:20 (45.2 MB/s) - 'index.html' saved [1256/1256]`;
        
        case 'ss':
        case 'netstat':
            return `Netid  State      Recv-Q Send-Q Local Address:Port               Peer Address:Port
tcp    LISTEN     0      128    0.0.0.0:22                  0.0.0.0:*
tcp    LISTEN     0      128    0.0.0.0:80                  0.0.0.0:*
tcp    ESTAB      0      0      172.31.0.2:22               203.0.113.1:54321`;
        
        case 'du':
            if (args.includes('-sh')) {
                return '4.2G\t' + (args[args.length - 1] !== '-sh' ? args[args.length - 1] : '/var/log');
            }
            return '4321\t./archivo.txt\n8765\t./script.sh';
        
        case 'tree':
            return `.
├── archivo.txt
└── script.sh

0 directories, 2 files`;
        
        case 'file':
            return args[0] ? `${args[0]}: ASCII text` : 'file: missing operand';
        
        case 'head':
        case 'tail':
            return `Línea 1 del archivo
Línea 2 del archivo
Línea 3 del archivo`;
        
        default:
            return `bash: ${command}: comando no encontrado
Escribe 'help' para ver los comandos disponibles`;
    }
}

// Function for quick command buttons
function executeQuickCommand(cmd) {
    currentInput = cmd;
    updateInputLine();
    // Simulate enter key
    executeCommand(cmd);
    commandHistory.push(cmd);
    historyIndex = commandHistory.length;
    currentInput = '';
    updateInputLine();
}

// Add cursor blink animation
const style = document.createElement('style');
style.textContent = `
    .cursor {
        animation: blink 1s step-end infinite;
    }
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }
    kbd {
        background: #f4f4f4;
        border: 1px solid #ccc;
        border-radius: 3px;
        padding: 2px 6px;
        font-family: monospace;
        font-size: 0.9em;
    }
`;
document.head.appendChild(style);
