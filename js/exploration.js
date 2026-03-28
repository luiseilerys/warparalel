/**
 * Warpapalel - Sistema de Exploración
 * Maneja la exploración, encuentros y recolección de recursos
 */

import { gameState } from './gamestate.js';
import { 
    PROBABILIDADES, EXPLORACION, MASCOTAS, CRAFTING, DESCANSO 
} from './constants.js';

/**
 * Clase para gestionar el sistema de exploración
 */
export class ExplorationSystem {
    constructor(uiManager, combatSystem) {
        this.uiManager = uiManager;
        this.combatSystem = combatSystem;
    }

    /**
     * Ejecuta una acción de exploración con resultados aleatorios
     */
    explorar() {
        const azar = Math.random();

        if (azar < PROBABILIDADES.ENEMIGO) {
            // 48% - Enemigo
            this.combatSystem.iniciarCombate();
        } 
        else if (azar < PROBABILIDADES.ENEMIGO + PROBABILIDADES.ORO) {
            // 28% - Oro
            const oro = EXPLORACION.ORO_MIN + Math.floor(Math.random() * EXPLORACION.ORO_MAX);
            gameState.jugador.oro += oro;
            this.uiManager.agregarLog(
                `¡Encontraste <strong>${oro}</strong> de oro!`, 
                'log-victoria'
            );
        } 
        else if (azar < PROBABILIDADES.ENEMIGO + PROBABILIDADES.ORO + PROBABILIDADES.MATERIALES) {
            // 12% - Materiales
            const hierbasObtenidas = EXPLORACION.HIERBAS_MIN + 
                Math.floor(Math.random() * EXPLORACION.HIERBAS_MAX);
            const maderaObtenida = Math.floor(Math.random() * EXPLORACION.MADERA_MAX);
            
            gameState.inventario.hierbas += hierbasObtenidas;
            gameState.inventario.madera += maderaObtenida;
            
            this.uiManager.agregarLog(
                'Recolectaste hierbas y madera del bosque.', 
                'log-exito'
            );
        } 
        else if (azar < PROBABILIDADES.ENEMIGO + PROBABILIDADES.ORO + 
                 PROBABILIDADES.MATERIALES + PROBABILIDADES.PET && !gameState.pet) {
            // 3% - Pet (muy raro, solo si no tiene uno)
            const keys = Object.keys(MASCOTAS);
            const petKey = keys[Math.floor(Math.random() * keys.length)];
            gameState.pet = { ...MASCOTAS[petKey] };
            
            this.uiManager.agregarLog(
                `¡Suerte legendaria! Capturaste un <strong>${gameState.pet.nombre}</strong> ${gameState.pet.emoji}`, 
                'log-legendaria'
            );
            this.uiManager.mostrarPetUI();
        } 
        else if (azar < PROBABILIDADES.ENEMIGO + PROBABILIDADES.ORO + 
                 PROBABILIDADES.MATERIALES + PROBABILIDADES.PET + PROBABILIDADES.QUEST) {
            // 6% - Quest menor
            this.uiManager.agregarLog(
                '¡Encontraste una quest menor! Gana experiencia extra.', 
                'log-info'
            );
            gameState.agregarExperiencia(EXPLORACION.QUEST_EXP);
        } 
        else {
            // 3% - Nada
            this.uiManager.agregarLog(
                'Exploraste la zona pero no encontraste nada especial.', 
                'log-info'
            );
        }

        this.uiManager.actualizarStats();
    }

    /**
     * Crafta una poción usando hierbas
     */
    craftearPocion() {
        if (gameState.inventario.hierbas >= CRAFTING.POCION.HIERBAS_REQUERIDAS) {
            gameState.inventario.hierbas -= CRAFTING.POCION.HIERBAS_REQUERIDAS;
            gameState.inventario.pociones += 1;
            
            this.uiManager.agregarLog(
                '¡Craftaste una **Poción de Curación**!', 
                'log-exito'
            );
            this.uiManager.actualizarStats();
        } else {
            this.uiManager.agregarLog(
                `Necesitas al menos ${CRAFTING.POCION.HIERBAS_REQUERIDAS} hierbas para craftar una poción.`, 
                'log-error'
            );
        }
    }

    /**
     * Descansa para recuperar HP
     */
    descansar() {
        const curacionAntes = gameState.jugador.hp;
        gameState.jugador.hp = Math.min(
            gameState.jugador.hp + DESCANSO.CURACION, 
            gameState.jugador.hpMax
        );
        const curacionReal = gameState.jugador.hp - curacionAntes;
        
        if (curacionReal > 0) {
            this.uiManager.agregarLog(
                `Descansaste y recuperaste ${curacionReal} HP.`, 
                'log-exito'
            );
        } else {
            this.uiManager.agregarLog(
                'Tu HP ya está lleno.', 
                'log-info'
            );
        }
        
        this.uiManager.actualizarStats();
    }

    /**
     * Muestra la pantalla de exploración con las opciones disponibles
     */
    mostrarPantallaExploracion() {
        this.uiManager.actualizarHistoria(
            'Estás en los bosques de Asteria.<br>¿Qué harás ahora?'
        );

        this.uiManager.mostrarBotonesExploracion();
    }
}
