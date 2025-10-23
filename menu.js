// Menú de navegación global para todas las páginas
function loadGlobalMenu() {
    const menuHTML = `
        <nav class="main-nav">
            <a href="../index.html">🏠 Inicio</a>
            <a href="filesystem.html">📁 Archivos</a>
            <a href="packages.html">📦 Paquetes</a>
            <a href="users.html">👥 Usuarios</a>
            <a href="processes.html">⚙️ Procesos</a>
            <a href="networking.html">🌐 Redes</a>
            <a href="security.html">🔒 Seguridad</a>
            <a href="storage.html">💾 Almacenamiento</a>
            <a href="monitoring.html">📊 Monitoreo</a>
            <a href="text.html">📝 Texto</a>
            <a href="vim.html">⚡ VIM</a>
            <a href="nano.html">📝 NANO</a>
            <a href="automation.html">🤖 Automatización</a>
            <a href="simulator.html">💻 Simulador</a>
            <a href="exercises.html">🎯 Ejercicios</a>
        </nav>
    `;
    
    // Buscar el elemento nav existente en el header y reemplazarlo
    const header = document.querySelector('header');
    const existingNav = header.querySelector('nav');
    if (existingNav) {
        existingNav.outerHTML = menuHTML;
    } else {
        header.insertAdjacentHTML('beforeend', menuHTML);
    }
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadGlobalMenu);
} else {
    loadGlobalMenu();
}
