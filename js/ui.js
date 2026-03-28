/**
 * Warpapalel - Gestor de Interfaz de Usuario (UI)
 * Maneja toda la interacción con el DOM y actualizaciones visuales
 */

import { gameState } from './gamestate.js';

/**
 * Clase para gestionar la interfaz de usuario
 */
export class UIManager {
    constructor() {
        // Referencias a elementos del DOM
        this.elementos = {
            historia: document.getElementById('historia'),
            statsJugador: document.getElementById('statsJugador'),
            xpInfo: document.getElementById('xpInfo'),
            infoPet: document.getElementById('infoPet'),
            nombrePet: document.getElementById('nombrePet'),
            inventario: document.getElementById('inventario'),
            combateUI: document.getElementById('combateUI'),
            nombreEnemigo: document.getElementById('nombreEnemigo'),
            barraEnemigo: document.getElementById('barraEnemigo'),
            hpJugador: document.getElementById('hpJugador'),
            barraJugador: document.getElementById('barraJugador'),
            log: document.getElementById('log'),
            botones: document.getElementById('botones')
        };
    }

    /**
     * Agrega un mensaje al log de combate
     * @param {string} texto - Mensaje a mostrar
     * @param {string} clase - Clase CSS para el color/estilo
     */
    agregarLog(texto, clase = '') {
        const div = document.createElement('div');
        if (clase) {
            div.className = clase;
        }
        div.innerHTML = texto;
        this.elementos.log.appendChild(div);
        this.elementos.log.scrollTop = this.elementos.log.scrollHeight;
    }

    /**
     * Actualiza las estadísticas del jugador en pantalla
     */
    actualizarStats() {
        this.elementos.statsJugador.innerHTML = `
            ❤️ HP: ${Math.floor(gameState.jugador.hp)}/${gameState.jugador.hpMax} &nbsp;&nbsp;
            ⚔️ Ataque: ${gameState.jugador.ataque} &nbsp;&nbsp;
            ⭐ Nivel: ${gameState.jugador.nivel} &nbsp;&nbsp;
            💰 Oro: ${gameState.jugador.oro}
        `;

        const progreso = gameState.obtenerProgresoExp();
        this.elementos.xpInfo.innerHTML = `
            Exp: ${gameState.jugador.experiencia} / ${gameState.jugador.expNecesaria} 
            <span style="color:#88ffcc">(${progreso}%)</span>
        `;

        this.elementos.inventario.textContent = 
            `Hierbas: ${gameState.inventario.hierbas} | Madera: ${gameState.inventario.madera} | Cristales: ${gameState.inventario.cristales} | Pociones: ${gameState.inventario.pociones}`;
    }

    /**
     * Actualiza el texto de la historia/narrativa
     * @param {string} texto - Texto de la historia
     */
    actualizarHistoria(texto) {
        this.elementos.historia.innerHTML = texto;
    }

    /**
     * Actualiza el nombre del enemigo en combate
     * @param {string} nombre - Nombre del enemigo
     */
    actualizarNombreEnemigo(nombre) {
        this.elementos.nombreEnemigo.textContent = nombre;
    }

    /**
     * Actualiza la barra de vida del enemigo
     * @param {number} porcentaje - Porcentaje de vida (0-100)
     */
    actualizarBarraEnemigo(porcentaje) {
        this.elementos.barraEnemigo.style.width = `${porcentaje}%`;
    }

    /**
     * Actualiza la barra de vida del jugador
     * @param {number} porcentaje - Porcentaje de vida (0-100)
     */
    actualizarBarraJugador(porcentaje) {
        this.elementos.barraJugador.style.width = `${porcentaje}%`;
    }

    /**
     * Actualiza el texto de HP del jugador
     * @param {number} hpActual - HP actual
     * @param {number} hpMax - HP máximo
     */
    actualizarHPJugador(hpActual, hpMax) {
        this.elementos.hpJugador.textContent = `${hpActual}/${hpMax}`;
    }

    /**
     * Muestra la UI de combate
     */
    mostrarCombateUI() {
        this.elementos.combateUI.style.display = 'block';
    }

    /**
     * Oculta la UI de combate
     */
    ocultarCombateUI() {
        this.elementos.combateUI.style.display = 'none';
    }

    /**
     * Muestra la información de la mascota si existe una
     */
    mostrarPetUI() {
        if (gameState.pet) {
            this.elementos.nombrePet.textContent = `${gameState.pet.nombre} ${gameState.pet.emoji}`;
            this.elementos.infoPet.style.display = 'block';
        }
    }

    /**
     * Oculta la información de la mascota
     */
    ocultarPetUI() {
        this.elementos.infoPet.style.display = 'none';
    }

    /**
     * Muestra los botones de exploración
     */
    mostrarBotonesExploracion() {
        this.elementos.botones.innerHTML = `
            <button onclick="window.juego.explorar()" class="btn-normal" aria-label="Explorar el bosque">
                🌲 Explorar
            </button>
            <button onclick="window.juego.descansar()" class="btn-normal" aria-label="Descansar para recuperar HP">
                🏕️ Descansar
            </button>
            <button onclick="window.juego.craftearPocion()" class="btn-craft" aria-label="Craftar poción con 3 hierbas">
                🛠️ Craftar Poción (3 hierbas)
            </button>
            <button onclick="window.juego.guardarPartida()" class="btn-normal" aria-label="Guardar partida actual">
                💾 Guardar Partida
            </button>
            ${gameState.existePartidaGuardada() ? 
                `<button onclick="window.juego.borrarPartida()" class="btn-detener" aria-label="Borrar partida guardada">
                    🗑️ Borrar Guardado
                </button>` : ''}
        `;
    }

    /**
     * Muestra los botones de combate
     */
    mostrarBotonesCombate() {
        const texto = gameState.atacando ? '⏹️ Detener Ataque' : '▶️ Iniciar Ataque Automático';
        const clase = gameState.atacando ? 'btn-detener' : 'btn-atacar';

        this.elementos.botones.innerHTML = `
            <button onclick="window.juego.toggleAtaque()" class="${clase}" aria-label="${texto}">
                ${texto}
            </button>
            ${gameState.inventario.pociones > 0 ? 
                `<button onclick="window.juego.usarPocion()" class="btn-normal" aria-label="Usar poción (${gameState.inventario.pociones} disponibles)">
                    ❤️ Usar Poción (${gameState.inventario.pociones})
                </button>` : ''}
            <button onclick="window.juego.huirCombate()" class="btn-normal" aria-label="Intentar huir del combate">
                🏃 Huir
            </button>
        `;
    }

    /**
     * Muestra el botón para reiniciar el juego después de game over
     */
    mostrarBotonReiniciar() {
        this.elementos.botones.innerHTML = `
            <button onclick="window.juego.reiniciarJuego()" class="btn-normal" aria-label="Comenzar nueva aventura">
                🔄 Nueva Aventura
            </button>
        `;
    }

    /**
     * Muestra la pantalla de exploración
     */
    mostrarExploracion() {
        this.actualizarHistoria(
            'Estás en los bosques de Asteria.<br>¿Qué harás ahora?'
        );
        this.mostrarBotonesExploracion();
    }

    /**
     * Inicializa la UI con los valores por defecto
     */
    inicializar() {
        this.ocultarPetUI();
        this.ocultarCombateUI();
        this.actualizarStats();
    }
}
