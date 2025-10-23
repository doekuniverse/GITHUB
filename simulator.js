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
    
    // Show Amazon Linux banner
    showWelcomeBanner();
    
    // Handle keyboard input
    document.addEventListener('keydown', handleKeyPress);
    
    // Handle clicks to focus input
    terminal.addEventListener('click', () => {
        focusInput();
    });
    
    focusInput();
});

function showWelcomeBanner() {
    const terminal = document.getElementById('terminal');
    const banner = `<span style="color: #ff9900;">   ,     #_</span>
<span style="color: #ff9900;">   ~\\_  ####_</span>        <span style="color: #ffffff; font-weight: bold;">Amazon Linux 2023</span>
<span style="color: #ff9900;">  ~~  \\_#####\\</span>
<span style="color: #ff9900;">  ~~     \\###|</span>      <span style="color: #00ff00;">https://aws.amazon.com/linux/amazon-linux-2023</span>
<span style="color: #ff9900;">  ~~       \\#/ ___</span>
<span style="color: #ff9900;">   ~~       V~' '</span>   Last login: ${new Date().toLocaleString()}
<span style="color: #ff9900;">    ~~~         /</span>
<span style="color: #ff9900;">      ~~._.   _/</span>
<span style="color: #ff9900;">         _/ _/</span>
<span style="color: #ff9900;">       _/m/'</span>

<span style="color: #ffff00;">Bienvenido al Simulador de Amazon Linux 2023</span>
<span style="color: #00ffff;">Escribe 'help' para ver los comandos disponibles</span>
`;
    terminal.innerHTML = banner;
    addPrompt();
}

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
    showWelcomeBanner();
}

function simulateCommand(cmd) {
    const parts = cmd.trim().split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);
    
    switch (command) {
        case 'help':
            return `<span style="color: #ffff00; font-weight: bold;">COMANDOS DISPONIBLES EN EL SIMULADOR:</span>

<span style="color: #00ffff;">📁 Sistema de Archivos:</span>
pwd, ls, cd, mkdir, touch, cat, rm, rmdir, cp, mv, ln, chmod, chown, chgrp
find, locate, tree, file, du, df, stat, readlink

<span style="color: #00ffff;">⚙️ Procesos y Servicios:</span>
ps, top, htop, kill, killall, pkill, pgrep, jobs, bg, fg, nohup
systemctl, service, journalctl, dmesg

<span style="color: #00ffff;">👤 Usuarios y Permisos:</span>
whoami, who, w, id, su, sudo, passwd, useradd, usermod, userdel, groupadd
groupdel, groupmod, groups, newgrp

<span style="color: #00ffff;">🌐 Red y Conectividad:</span>
ip, ifconfig, ping, traceroute, curl, wget, ss, netstat, route, hostname
dig, nslookup, host, nc, telnet, ssh, scp, rsync

<span style="color: #00ffff;">📦 Gestión de Paquetes:</span>
dnf, yum, rpm, yum-config-manager, dnf-automatic

<span style="color: #00ffff;">📝 Manipulación de Texto:</span>
cat, head, tail, less, more, grep, egrep, fgrep, awk, sed, cut, sort, uniq
wc, tr, paste, join, diff, patch, comm, column

<span style="color: #00ffff;">🗜️ Compresión y Archivado:</span>
tar, gzip, gunzip, bzip2, bunzip2, xz, unxz, zip, unzip, zcat

<span style="color: #00ffff;">✏️ Editores:</span>
nano, vi, vim

<span style="color: #00ffff;">💾 Almacenamiento y Discos:</span>
lsblk, fdisk, parted, mkfs, mount, umount, blkid, df, du

<span style="color: #00ffff;">📊 Información del Sistema:</span>
uname, hostname, uptime, date, cal, free, lscpu, lsmem, dmidecode

<span style="color: #00ffff;">🔧 Utilidades:</span>
echo, printf, clear, history, man, which, whereis, type, alias, unalias
export, env, printenv, set, source, bash, exit, logout

<span style="color: #00ff00;">Escribe cualquier comando para probarlo. Para más info: man [comando]</span>`;
        
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
        
        case 'rm':
            return args[0] ? `rm: removed '${args[0]}'` : 'rm: falta un operando';
        
        case 'rmdir':
            return args[0] ? `rmdir: removed directory '${args[0]}'` : 'rmdir: falta un operando';
        
        case 'cp':
            return args.length >= 2 ? `'${args[0]}' -> '${args[1]}'` : 'cp: faltan argumentos';
        
        case 'mv':
            return args.length >= 2 ? `renamed '${args[0]}' -> '${args[1]}'` : 'mv: faltan argumentos';
        
        case 'chmod':
            return args.length >= 2 ? `mode of '${args[1]}' changed to ${args[0]}` : 'chmod: faltan argumentos';
        
        case 'chown':
            return args.length >= 2 ? `ownership of '${args[1]}' changed` : 'chown: faltan argumentos';
        
        case 'chgrp':
            return args.length >= 2 ? `group of '${args[1]}' changed to ${args[0]}` : 'chgrp: faltan argumentos';
        
        case 'ln':
            return args.length >= 2 ? `created link '${args[1]}' -> '${args[0]}'` : 'ln: faltan argumentos';
        
        case 'id':
            return `uid=1000(ec2-user) gid=1000(ec2-user) groups=1000(ec2-user),4(adm),10(wheel),190(systemd-journal)`;
        
        case 'groups':
            return `ec2-user adm wheel systemd-journal`;
        
        case 'useradd':
            return args[0] ? `useradd: user '${args[0]}' created` : 'useradd: falta especificar usuario';
        
        case 'usermod':
            return args[args.length - 1] ? `usermod: user '${args[args.length - 1]}' modified` : 'usermod: falta especificar usuario';
        
        case 'userdel':
            return args[0] ? `userdel: user '${args[0]}' removed` : 'userdel: falta especificar usuario';
        
        case 'groupadd':
            return args[0] ? `groupadd: group '${args[0]}' created` : 'groupadd: falta especificar grupo';
        
        case 'groupdel':
            return args[0] ? `groupdel: group '${args[0]}' removed` : 'groupdel: falta especificar grupo';
        
        case 'passwd':
            return `Changing password for user ${args[0] || 'ec2-user'}.\nNew password: (password would be entered here)\nRetype new password:\npasswd: all authentication tokens updated successfully.`;
        
        case 'su':
            return `[root@ip-172-31-0-1 ~]# `;
        
        case 'sudo':
            if (args.length > 0) {
                return `[sudo] password for ec2-user:\n` + simulateCommand(args.join(' '));
            }
            return 'sudo: falta un comando para ejecutar';
        
        case 'kill':
            return args[0] ? `kill: sent signal to process ${args[0]}` : 'kill: falta especificar PID';
        
        case 'killall':
        case 'pkill':
            return args[0] ? `${command}: sent signal to processes matching '${args[0]}'` : `${command}: falta especificar nombre de proceso`;
        
        case 'pgrep':
            return args[0] ? `1234\n5678\n9012` : 'pgrep: falta especificar patrón';
        
        case 'htop':
            return `Interactive process viewer (simulated)
Press F10 or 'q' to quit (simulated)

  PID USER      PRI  NI  VIRT   RES   SHR S CPU% MEM%   TIME+  Command
    1 root       20   0  169M  13M  8652 S  0.0  0.3  0:02.15 systemd
 5679 root       20   0  125M  12M  8564 S  0.3  0.3  0:00.42 nginx
 1234 ec2-user   20   0  116M  3208  2844 S  0.0  0.1  0:00.01 bash`;
        
        case 'jobs':
            return `[1]+  Running                 sleep 100 &`;
        
        case 'bg':
            return `[1]+ sleep 100 &`;
        
        case 'fg':
            return `sleep 100`;
        
        case 'nohup':
            return args.length > 0 ? `nohup: ignoring input and appending output to 'nohup.out'` : 'nohup: falta especificar comando';
        
        case 'journalctl':
            return `-- Logs begin at Mon 2023-10-23 12:00:00 UTC, end at Mon 2023-10-23 15:42:18 UTC. --
Oct 23 15:00:12 ip-172-31-0-1 systemd[1]: Starting The nginx HTTP Server...
Oct 23 15:00:12 ip-172-31-0-1 systemd[1]: Started The nginx HTTP Server.
Oct 23 15:30:15 ip-172-31-0-1 sshd[1234]: Accepted publickey for ec2-user from 203.0.113.1`;
        
        case 'dmesg':
            return `[    0.000000] Linux version 6.1.19-30.43.amzn2023.x86_64
[    0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz-6.1.19-30.43.amzn2023.x86_64
[    1.234567] Memory: 4045312K/4194304K available
[    2.345678] Amazon Elastic Network Adapter (ENA) driver version 2.8.0`;
        
        case 'lsblk':
            return `NAME    MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS
xvda    202:0    0   20G  0 disk
└─xvda1 202:1    0   20G  0 part /
xvdf    202:80   0   50G  0 disk /data`;
        
        case 'blkid':
            return `/dev/xvda1: UUID="12345678-1234-1234-1234-123456789abc" TYPE="xfs" PARTUUID="abcdef01-02"
/dev/xvdf: UUID="87654321-4321-4321-4321-cba987654321" TYPE="xfs"`;
        
        case 'fdisk':
            return `Disk /dev/xvda: 20 GiB, 21474836480 bytes, 41943040 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt`;
        
        case 'mount':
            if (args.length === 0) {
                return `/dev/xvda1 on / type xfs (rw,relatime,attr2,inode64,logbufs=8,logbsize=32k,noquota)
/dev/xvdf on /data type xfs (rw,relatime,attr2,inode64,logbufs=8,logbsize=32k,noquota)
tmpfs on /dev/shm type tmpfs (rw,nosuid,nodev)`;
            }
            return args.length >= 2 ? `mounted ${args[0]} on ${args[1]}` : 'mount: faltan argumentos';
        
        case 'umount':
            return args[0] ? `umounted ${args[0]}` : 'umount: falta especificar dispositivo o punto de montaje';
        
        case 'tar':
            if (args.includes('-czf') || args.includes('-czvf')) {
                return args[1] ? `Created archive: ${args[1]}` : 'tar: falta especificar archivo';
            } else if (args.includes('-xzf') || args.includes('-xzvf')) {
                return args[1] ? `Extracted archive: ${args[1]}` : 'tar: falta especificar archivo';
            }
            return `tar: debe especificar una de las opciones '-Acdtrux'`;
        
        case 'gzip':
            return args[0] ? `${args[0]} compressed to ${args[0]}.gz` : 'gzip: falta especificar archivo';
        
        case 'gunzip':
            return args[0] ? `${args[0]} decompressed` : 'gunzip: falta especificar archivo';
        
        case 'zip':
            return args.length >= 2 ? `adding: ${args[1]} (stored 0%)\nCreated: ${args[0]}` : 'zip: faltan argumentos';
        
        case 'unzip':
            return args[0] ? `Archive:  ${args[0]}\n  inflating: file1.txt\n  inflating: file2.txt` : 'unzip: falta especificar archivo';
        
        case 'less':
        case 'more':
            return `(use 'q' to quit - simulated)
This is a simulated ${command} output.
In a real terminal, this would show file contents with pagination.
Use arrow keys to scroll, 'q' to quit.`;
        
        case 'awk':
            return `AWK command simulated. Pattern: ${args.join(' ')}
field1    field2    field3
value1    value2    value3`;
        
        case 'sed':
            return args.join(' ') ? `sed: pattern '${args.join(' ')}' applied` : 'sed: no se especificó ningún comando';
        
        case 'cut':
            return `field1
field2
field3`;
        
        case 'sort':
            return `line1\nline2\nline3`;
        
        case 'uniq':
            return `unique_line1\nunique_line2\nunique_line3`;
        
        case 'wc':
            if (args.includes('-l')) {
                return `      42 ${args[args.length - 1] || 'archivo'}`;
            } else if (args.includes('-w')) {
                return `     256 ${args[args.length - 1] || 'archivo'}`;
            } else if (args.includes('-c')) {
                return `    1542 ${args[args.length - 1] || 'archivo'}`;
            }
            return `      42     256    1542 ${args[0] || 'archivo'}`;
        
        case 'diff':
            return args.length >= 2 ? `1c1\n< Contenido del archivo ${args[0]}\n---\n> Contenido del archivo ${args[1]}` : 'diff: faltan argumentos';
        
        case 'nano':
        case 'vi':
        case 'vim':
            return `Editor ${command} simulado.\nEn un sistema real, esto abriría el editor ${command.toUpperCase()}.\nUsa Ctrl+X para salir de nano, o :q! para salir de vim.`;
        
        case 'which':
            return args[0] ? `/usr/bin/${args[0]}` : 'which: falta especificar comando';
        
        case 'whereis':
            return args[0] ? `${args[0]}: /usr/bin/${args[0]} /usr/share/man/man1/${args[0]}.1.gz` : 'whereis: falta especificar comando';
        
        case 'type':
            return args[0] ? `${args[0]} is /usr/bin/${args[0]}` : 'type: falta especificar comando';
        
        case 'alias':
            if (args.length === 0) {
                return `alias ll='ls -la'\nalias la='ls -A'\nalias l='ls -CF'`;
            }
            return `alias ${args.join(' ')} created`;
        
        case 'export':
            return args[0] ? `Variable ${args[0]} exported` : 'export: falta especificar variable';
        
        case 'env':
        case 'printenv':
            return `PATH=/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin
HOME=/home/ec2-user
USER=ec2-user
SHELL=/bin/bash
LANG=en_US.UTF-8
AWS_DEFAULT_REGION=us-east-1`;
        
        case 'set':
            return `BASH=/bin/bash\nBASH_VERSION='5.2.15(1)-release'\nHOME=/home/ec2-user\nHOSTNAME=ip-172-31-0-1\nPATH=/usr/local/bin:/usr/bin:/bin`;
        
        case 'lscpu':
            return `Architecture:                    x86_64
CPU op-mode(s):                  32-bit, 64-bit
Byte Order:                      Little Endian
Address sizes:                   46 bits physical, 48 bits virtual
CPU(s):                          2
On-line CPU(s) list:             0,1
Thread(s) per core:              2
Core(s) per socket:              1
Socket(s):                       1
Vendor ID:                       GenuineIntel
Model name:                      Intel(R) Xeon(R) Platinum 8259CL CPU @ 2.50GHz`;
        
        case 'cal':
            return `    October 2023
Su Mo Tu We Th Fr Sa
 1  2  3  4  5  6  7
 8  9 10 11 12 13 14
15 16 17 18 19 20 21
22 23 24 25 26 27 28
29 30 31`;
        
        case 'traceroute':
            return `traceroute to ${args[0] || 'google.com'} (142.250.185.46), 30 hops max, 60 byte packets
 1  172.31.0.1 (172.31.0.1)  0.532 ms  0.498 ms  0.485 ms
 2  * * *
 3  100.66.8.86 (100.66.8.86)  1.234 ms  1.198 ms  1.165 ms`;
        
        case 'dig':
            return `; <<>> DiG 9.16.42 <<>> ${args[0] || 'example.com'}
;; ANSWER SECTION:
${args[0] || 'example.com'}.    86400   IN  A   93.184.216.34

;; Query time: 23 msec
;; SERVER: 172.31.0.2#53(172.31.0.2)
;; WHEN: Mon Oct 23 15:42:18 UTC 2023`;
        
        case 'nslookup':
            return `Server:         172.31.0.2
Address:        172.31.0.2#53

Non-authoritative answer:
Name:   ${args[0] || 'example.com'}
Address: 93.184.216.34`;
        
        case 'host':
            return `${args[0] || 'example.com'} has address 93.184.216.34`;
        
        case 'ssh':
            return args[0] ? `Connecting to ${args[0]}... (simulated)\nIn a real system, this would establish an SSH connection.` : 'ssh: falta especificar host';
        
        case 'scp':
            return args.length >= 2 ? `${args[0]}    100%  1234KB   5.6MB/s   00:00` : 'scp: faltan argumentos';
        
        case 'rsync':
            return args.length >= 2 ? `sending incremental file list\n${args[0]}\n\nsent 1,234 bytes  received 56 bytes  2,580.00 bytes/sec` : 'rsync: faltan argumentos';
        
        case 'route':
            return `Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
default         172.31.0.1      0.0.0.0         UG    100    0        0 eth0
172.31.0.0      0.0.0.0         255.255.240.0   U     100    0        0 eth0`;
        
        case 'service':
            return args[1] ? `${args[0]}.service - ${args[1]}ing service` : 'service: faltan argumentos';
        
        case 'exit':
        case 'logout':
            return `<span style="color: #00ff00;">logout\n\nConnection to ip-172-31-0-1 closed.</span>`;
        
        case 'reboot':
        case 'shutdown':
            return `<span style="color: #ff0000;">Broadcast message from ec2-user@ip-172-31-0-1
System is going down for reboot NOW!</span>`;
        
        case 'stat':
            return args[0] ? `  File: ${args[0]}
  Size: 1234      \tBlocks: 8          IO Block: 4096   regular file
Device: ca01h/51713d\tInode: 1234567     Links: 1
Access: (0644/-rw-r--r--)  Uid: ( 1000/ec2-user)   Gid: ( 1000/ec2-user)
Access: 2023-10-23 15:00:00.000000000 +0000
Modify: 2023-10-23 15:00:00.000000000 +0000
Change: 2023-10-23 15:00:00.000000000 +0000` : 'stat: falta especificar archivo';
        
        case 'locate':
            return args[0] ? `/home/ec2-user/${args[0]}\n/usr/share/doc/${args[0]}\n/var/log/${args[0]}` : 'locate: falta especificar patrón';
        
        case 'printf':
            return args.join(' ');
        
        case 'bash':
            return `GNU bash, version 5.2.15(1)-release (x86_64-amazon-linux-gnu)\nType 'help' for list of commands.`;
        
        case 'source':
            return args[0] ? `Sourced ${args[0]}` : 'source: falta especificar archivo';
        
        case 'lsmem':
            return `RANGE                                  SIZE  STATE REMOVABLE BLOCK
0x0000000000000000-0x000000007fffffff  2.0G online       yes  0-15
0x0000000100000000-0x000000017fffffff  2.0G online       yes 32-47

Memory block size:       128M
Total online memory:     4.0G
Total offline memory:    0B`;
        
        case 'dmidecode':
            return `# dmidecode 3.3
BIOS Information
        Vendor: Amazon EC2
        Version: 1.0
        Release Date: 10/16/2017`;
        
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
