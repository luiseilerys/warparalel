/**
 * Warpapalel - Punto de entrada principal
 * Inicializa el juego y coordina todos los sistemas
 */

import { gameState } from './gamestate.js';
import { UIManager } from './ui.js';
import { CombatSystem } from './combat.js';
import { ExplorationSystem } from './exploration.js';

/**
 * Clase principal del juego que coordina todos los sistemas
 */
class Warpapalel {
    constructor() {
        this.uiManager = new UIManager();
        this.combatSystem = new CombatSystem(this.uiManager);
        this.explorationSystem = new ExplorationSystem(this.uiManager, this.combatSystem);
        
        // Exponer métodos al objeto window para los handlers HTML
        window.juego = this;
    }

    /**
     * Inicializa el juego
     */
    iniciar() {
        console.log('🌟 Iniciando Warpapalel...');
        
        // Intentar cargar partida guardada
        if (gameState.cargarPartida()) {
            this.uiManager.agregarLog(
                `¡Bienvenido de nuevo, ${gameState.jugador.nombre}!`, 
                'log-info'
            );
            this.uiManager.actualizarStats();
            
            if (gameState.pet) {
                this.uiManager.mostrarPetUI();
            }
            
            this.uiManager.mostrarExploracion();
        } else {
            // Nueva partida
            const nombre = prompt('¿Cómo te llamas, aventurero de Asteria?', 'ManaKnight');
            if (nombre && nombre.trim()) {
                gameState.jugador.nombre = nombre.trim();
            }

            this.uiManager.agregarLog(
                `¡Bienvenido a Warpapalel, ${gameState.jugador.nombre}!`, 
                'log-info'
            );
            this.uiManager.agregarLog(
                'Los pets son extremadamente raros... solo un 3% de probabilidad al explorar.', 
                'log-advertencia'
            );
            
            this.uiManager.inicializar();
            this.uiManager.mostrarExploracion();
        }

        // Guardado automático cada 30 segundos
        setInterval(() => {
            if (!gameState.enCombate) {
                this.guardarPartida();
            }
        }, 30000);
    }

    /**
     * Acción: Explorar
     */
    explorar() {
        this.explorationSystem.explorar();
    }

    /**
     * Acción: Descansar
     */
    descansar() {
        this.explorationSystem.descansar();
    }

    /**
     * Acción: Craftar poción
     */
    craftearPocion() {
        this.explorationSystem.craftearPocion();
    }

    /**
     * Acción: Toggle ataque automático en combate
     */
    toggleAtaque() {
        this.combatSystem.toggleAtaque();
    }

    /**
     * Acción: Usar poción en combate
     */
    usarPocion() {
        this.combatSystem.usarPocion();
    }

    /**
     * Acción: Huir del combate
     */
    huirCombate() {
        this.combatSystem.huirCombate();
    }

    /**
     * Acción: Guardar partida
     */
    guardarPartida() {
        if (gameState.guardarPartida()) {
            this.uiManager.agregarLog('💾 Partida guardada exitosamente', 'log-info');
            this.uiManager.mostrarBotonesExploracion();
        } else {
            this.uiManager.agregarLog('❌ Error al guardar la partida', 'log-error');
        }
    }

    /**
     * Acción: Borrar partida guardada
     */
    borrarPartida() {
        if (confirm('¿Estás seguro de que quieres borrar tu partida guardada? Esta acción no se puede deshacer.')) {
            if (gameState.borrarPartida()) {
                this.uiManager.agregarLog('🗑️ Partida eliminada', 'log-info');
                this.uiManager.mostrarBotonesExploracion();
            }
        }
    }

    /**
     * Acción: Reiniciar juego completo
     */
    reiniciarJuego() {
        if (confirm('¿Estás seguro de que quieres comenzar una nueva aventura? Perderás todo tu progreso actual.')) {
            gameState.reiniciar();
            this.uiManager.elementos.log.innerHTML = '';
            this.iniciar();
        }
    }
}

// Iniciar el juego cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const juego = new Warpapalel();
    juego.iniciar();
});
