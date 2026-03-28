/**
 * Warpapalel - GameState
 * Maneja el estado global del juego y persistencia con localStorage
 */

import { JUGADOR_BASE, INCREMENTOS_NIVEL, EXP_CONFIG, STORAGE_KEY, VERSION_GUARDADO } from './constants.js';

/**
 * Clase para gestionar el estado del jugador
 */
export class GameState {
    constructor() {
        this.jugador = this.crearJugadorPorDefecto();
        this.inventario = this.crearInventarioPorDefecto();
        this.pet = null;
        this.enCombate = false;
        this.atacando = false;
        this.enemigoActual = null;
        
        // Intervalos para el combate automático
        this.intervalos = {
            heroe: null,
            pet: null,
            enemigo: null
        };
    }

    /**
     * Crea un objeto jugador con valores por defecto
     * @returns {Object} Objeto jugador inicializado
     */
    crearJugadorPorDefecto() {
        return {
            nombre: JUGADOR_BASE.NOMBRE,
            nivel: JUGADOR_BASE.NIVEL_INICIAL,
            hp: JUGADOR_BASE.HP_BASE,
            hpMax: JUGADOR_BASE.HP_BASE,
            ataque: JUGADOR_BASE.ATAQUE_BASE,
            oro: JUGADOR_BASE.ORO_INICIAL,
            experiencia: JUGADOR_BASE.EXPERIENCIA_INICIAL,
            expNecesaria: this.calcularExpNecesaria(JUGADOR_BASE.NIVEL_INICIAL)
        };
    }

    /**
     * Crea un inventario vacío por defecto
     * @returns {Object} Objeto inventario inicializado
     */
    crearInventarioPorDefecto() {
        return { 
            hierbas: 0, 
            madera: 0, 
            cristales: 0, 
            pociones: 2 
        };
    }

    /**
     * Calcula la experiencia necesaria para un nivel dado
     * @param {number} nivel - Nivel actual del jugador
     * @returns {number} Experiencia necesaria para el siguiente nivel
     */
    calcularExpNecesaria(nivel) {
        return Math.floor(EXP_CONFIG.BASE * Math.pow(EXP_CONFIG.MULTIPLICADOR, nivel - 1));
    }

    /**
     * Actualiza la experiencia necesaria según el nivel actual
     */
    actualizarExpNecesaria() {
        this.jugador.expNecesaria = this.calcularExpNecesaria(this.jugador.nivel);
    }

    /**
     * Agrega experiencia al jugador y verifica subidas de nivel
     * @param {number} cantidad - Cantidad de experiencia a agregar
     * @returns {boolean} True si subió de nivel, false en caso contrario
     */
    agregarExperiencia(cantidad) {
        this.jugador.experiencia += cantidad;
        let subioNivel = false;

        if (this.jugador.experiencia >= this.jugador.expNecesaria) {
            this.subirNivel();
            subioNivel = true;
        }

        return subioNivel;
    }

    /**
     * Sube al jugador al siguiente nivel
     */
    subirNivel() {
        this.jugador.nivel++;
        this.jugador.ataque += INCREMENTOS_NIVEL.ATAQUE;
        this.jugador.hpMax += INCREMENTOS_NIVEL.HP;
        this.jugador.hp = this.jugador.hpMax;
        this.jugador.experiencia = 0;
        this.actualizarExpNecesaria();
    }

    /**
     * Guarda el estado actual del juego en localStorage
     * @returns {boolean} True si se guardó exitosamente
     */
    guardarPartida() {
        try {
            const datosGuardado = {
                version: VERSION_GUARDADO,
                fecha: new Date().toISOString(),
                jugador: this.jugador,
                inventario: this.inventario,
                pet: this.pet
            };
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(datosGuardado));
            console.log('✅ Partida guardada correctamente');
            return true;
        } catch (error) {
            console.error('❌ Error al guardar:', error);
            return false;
        }
    }

    /**
     * Carga una partida guardada desde localStorage
     * @returns {boolean} True si se cargó una partida existente
     */
    cargarPartida() {
        try {
            const datosGuardados = localStorage.getItem(STORAGE_KEY);
            
            if (!datosGuardados) {
                console.log('ℹ️ No hay partida guardada');
                return false;
            }

            const datos = JSON.parse(datosGuardados);
            
            // Validar versión del guardado
            if (datos.version !== VERSION_GUARDADO) {
                console.warn('⚠️ Versión de guardado incompatible');
                return false;
            }

            // Restaurar datos
            this.jugador = { ...datos.jugador };
            this.inventario = { ...datos.inventario };
            this.pet = datos.pet || null;
            
            // Recalcular expNecesaria por seguridad
            this.actualizarExpNecesaria();

            console.log(`✅ Partida cargada: ${this.jugador.nombre}, Nivel ${this.jugador.nivel}`);
            return true;
        } catch (error) {
            console.error('❌ Error al cargar:', error);
            return false;
        }
    }

    /**
     * Elimina la partida guardada
     */
    borrarPartida() {
        try {
            localStorage.removeItem(STORAGE_KEY);
            console.log('🗑️ Partida eliminada');
            return true;
        } catch (error) {
            console.error('❌ Error al borrar:', error);
            return false;
        }
    }

    /**
     * Verifica si existe una partida guardada
     * @returns {boolean} True si hay partida guardada
     */
    existePartidaGuardada() {
        return localStorage.getItem(STORAGE_KEY) !== null;
    }

    /**
     * Reinicia el estado del juego a valores por defecto
     */
    reiniciar() {
        this.jugador = this.crearJugadorPorDefecto();
        this.inventario = this.crearInventarioPorDefecto();
        this.pet = null;
        this.enCombate = false;
        this.atacando = false;
        this.enemigoActual = null;
        this.detenerCombate();
    }

    /**
     * Detiene todos los intervalos de combate
     */
    detenerCombate() {
        if (this.intervalos.heroe) {
            clearInterval(this.intervalos.heroe);
            this.intervalos.heroe = null;
        }
        if (this.intervalos.pet) {
            clearInterval(this.intervalos.pet);
            this.intervalos.pet = null;
        }
        if (this.intervalos.enemigo) {
            clearInterval(this.intervalos.enemigo);
            this.intervalos.enemigo = null;
        }
    }

    /**
     * Obtiene el progreso de experiencia en porcentaje
     * @returns {number} Porcentaje de progreso (0-100)
     */
    obtenerProgresoExp() {
        return Math.min(100, Math.floor((this.jugador.experiencia / this.jugador.expNecesaria) * 100));
    }

    /**
     * Obtiene el porcentaje de HP actual
     * @returns {number} Porcentaje de HP (0-100)
     */
    obtenerPorcentajeHP() {
        return Math.max(0, Math.floor((this.jugador.hp / this.jugador.hpMax) * 100));
    }
}

// Exportar instancia singleton para uso global
export const gameState = new GameState();
