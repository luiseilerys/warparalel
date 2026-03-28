/**
 * Warpapalel - Sistema de Combate
 * Maneja toda la lógica de combates, enemigos y acciones de batalla
 */

import { gameState } from './gamestate.js';
import { 
    COMBATE, ENEMIGO_BASE, RECOMPENSAS, INCREMENTOS_NIVEL, MASCOTAS 
} from './constants.js';

/**
 * Clase para gestionar el sistema de combate
 */
export class CombatSystem {
    constructor(uiManager) {
        this.uiManager = uiManager;
    }

    /**
     * Inicia un combate con un enemigo aleatorio
     */
    iniciarCombate() {
        const nombreEnemigo = COMBATE.ENEMIGOS[
            Math.floor(Math.random() * COMBATE.ENEMIGOS.length)
        ];

        gameState.enemigoActual = {
            nombre: nombreEnemigo,
            hp: ENEMIGO_BASE.HP_BASE + gameState.jugador.nivel * ENEMIGO_BASE.HP_POR_NIVEL,
            hpMax: ENEMIGO_BASE.HP_BASE + gameState.jugador.nivel * ENEMIGO_BASE.HP_POR_NIVEL,
            ataque: ENEMIGO_BASE.ATAQUE_BASE + gameState.jugador.nivel * ENEMIGO_BASE.ATAQUE_POR_NIVEL
        };

        gameState.enCombate = true;
        gameState.atacando = false;

        this.uiManager.mostrarCombateUI();
        this.uiManager.actualizarNombreEnemigo(gameState.enemigoActual.nombre);
        this.uiManager.agregarLog(
            `¡Un ${gameState.enemigoActual.nombre} te emboscó!`, 
            'log-enemigo'
        );
        
        this.actualizarBarras();
        this.uiManager.mostrarBotonesCombate();
    }

    /**
     * Alterna el estado de ataque automático
     */
    toggleAtaque() {
        if (!gameState.enCombate) return;
        
        gameState.atacando = !gameState.atacando;

        if (gameState.atacando) {
            this.uiManager.agregarLog(
                '¡Tu héroe inició el ataque automático!', 
                'log-exito'
            );
            this.iniciarAtaquesAutomaticos();
        } else {
            this.detenerAtaquesAutomaticos();
            this.uiManager.agregarLog('El héroe se detuvo.', 'log-advertencia');
        }
        
        this.uiManager.mostrarBotonesCombate();
    }

    /**
     * Inicia los intervalos de ataque automático para héroe, pet y enemigo
     */
    iniciarAtaquesAutomaticos() {
        // Ataque del héroe
        gameState.intervalos.heroe = setInterval(() => {
            if (!gameState.enCombate || !gameState.atacando) return;
            
            const dano = this.calcularDano(gameState.jugador.ataque);
            gameState.enemigoActual.hp -= dano;
            
            this.uiManager.agregarLog(`¡Atacaste por ${dano} daño!`, 'log-exito');
            this.actualizarBarras();
            
            if (gameState.enemigoActual.hp <= 0) {
                this.victoria();
            }
        }, COMBATE.VELOCIDAD_ATAQUE_HEROE);

        // Ataque de la mascota (si tiene una)
        if (gameState.pet) {
            gameState.intervalos.pet = setInterval(() => {
                if (!gameState.enCombate || !gameState.atacando) return;
                
                const dano = this.calcularDano(gameState.pet.ataque);
                gameState.enemigoActual.hp -= dano;
                
                this.uiManager.agregarLog(
                    `${gameState.pet.emoji} atacó por ${dano}`, 
                    'log-pet'
                );
                this.actualizarBarras();
                
                if (gameState.enemigoActual.hp <= 0) {
                    this.victoria();
                }
            }, COMBATE.VELOCIDAD_ATAQUE_PET);
        }

        // Ataque del enemigo
        gameState.intervalos.enemigo = setInterval(() => {
            if (!gameState.enCombate) return;
            
            const dano = this.calcularDano(gameState.enemigoActual.ataque);
            gameState.jugador.hp -= dano;
            
            this.uiManager.agregarLog(
                `¡El ${gameState.enemigoActual.nombre} te hirió por ${dano}!`, 
                'log-error'
            );
            this.actualizarBarras();
            
            if (gameState.jugador.hp <= 0) {
                this.gameOver();
            }
        }, COMBATE.VELOCIDAD_ATAQUE_ENEMIGO);
    }

    /**
     * Detiene todos los ataques automáticos
     */
    detenerAtaquesAutomaticos() {
        gameState.detenerCombate();
    }

    /**
     * Calcula el daño con variación aleatoria
     * @param {number} ataqueBase - Valor base de ataque
     * @returns {number} Daño calculado con variación
     */
    calcularDano(ataqueBase) {
        const variacionMin = 0.7;
        const variacionMax = 0.55;
        return Math.floor(ataqueBase * (variacionMin + Math.random() * variacionMax));
    }

    /**
     * Usa una poción para curar al jugador
     */
    usarPocion() {
        if (gameState.inventario.pociones <= 0) return;
        
        gameState.inventario.pociones--;
        const curacionMin = 60;
        const curacionMax = 35;
        const curacion = curacionMin + Math.floor(Math.random() * curacionMax);
        
        gameState.jugador.hp = Math.min(
            gameState.jugador.hp + curacion, 
            gameState.jugador.hpMax
        );
        
        this.uiManager.agregarLog(
            `¡Usaste una poción y recuperaste ${curacion} HP!`, 
            'log-exito'
        );
        
        this.uiManager.actualizarStats();
        this.actualizarBarras();
        this.uiManager.mostrarBotonesCombate();
    }

    /**
     * Intenta huir del combate
     */
    huirCombate() {
        if (Math.random() < COMBATE.PROBABILIDAD_HUIR) {
            this.uiManager.agregarLog('¡Escapaste con éxito!', 'log-exito');
            this.terminarCombate(false);
        } else {
            this.uiManager.agregarLog('¡No lograste huir!', 'log-advertencia');
        }
    }

    /**
     * Maneja la victoria en combate
     */
    victoria() {
        this.terminarCombate(true);
        
        const oroGanado = RECOMPENSAS.ORO_MIN + 
            Math.floor(Math.random() * RECOMPENSAS.ORO_MAX);
        const expGanada = RECOMPENSAS.EXP_BASE + 
            gameState.jugador.nivel * RECOMPENSAS.EXP_POR_NIVEL;

        gameState.jugador.oro += oroGanado;
        
        const subioNivel = gameState.agregarExperiencia(expGanada);

        this.uiManager.agregarLog(
            `¡Victoria contra el ${gameState.enemigoActual.nombre}!`, 
            'log-victoria'
        );
        this.uiManager.agregarLog(
            `+${oroGanado} oro | +${expGanada} exp`, 
            'log-exito'
        );

        // Recompensa adicional: cristales
        gameState.inventario.cristales += 
            Math.floor(Math.random() * RECOMPENSAS.CRISTALES_MAX);

        if (subioNivel) {
            this.uiManager.agregarLog(
                `¡SUBISTE AL NIVEL ${gameState.jugador.nivel}!`, 
                'log-legendaria'
            );
            this.uiManager.agregarLog(
                'La dificultad para subir de nivel ha aumentado.', 
                'log-advertencia'
            );
        }

        this.uiManager.actualizarStats();
        setTimeout(() => {
            this.uiManager.mostrarExploracion();
        }, 1600);
    }

    /**
     * Termina el combate actual
     * @param {boolean} victoria - True si el jugador ganó
     */
    terminarCombate(victoria = false) {
        gameState.enCombate = false;
        gameState.atacando = false;
        gameState.enemigoActual = null;
        
        this.detenerAtaquesAutomaticos();
        this.uiManager.ocultarCombateUI();
        
        if (!victoria) {
            this.uiManager.agregarLog('Combate terminado.', 'log-info');
        }
        
        if (!victoria && gameState.jugador.hp > 0) {
            this.uiManager.mostrarExploracion();
        }
    }

    /**
     * Maneja la derrota del jugador
     */
    gameOver() {
        this.terminarCombate(false);
        this.uiManager.agregarLog(
            '<strong>¡Has sido derrotado en Asteria... Fin de la aventura.</strong>', 
            'log-error'
        );
        this.uiManager.mostrarBotonReiniciar();
    }

    /**
     * Actualiza las barras de vida en la UI
     */
    actualizarBarras() {
        if (!gameState.enemigoActual) return;
        
        const porcEnemigo = Math.max(0, 
            (gameState.enemigoActual.hp / gameState.enemigoActual.hpMax) * 100
        );
        const porcJugador = gameState.obtenerPorcentajeHP();
        
        this.uiManager.actualizarBarraEnemigo(porcEnemigo);
        this.uiManager.actualizarBarraJugador(porcJugador);
        this.uiManager.actualizarHPJugador(
            Math.floor(gameState.jugador.hp), 
            gameState.jugador.hpMax
        );
    }
}
