/**
 * Warpapalel - Constantes del juego
 * Archivo de configuración con valores balanceados
 */

// Probabilidades de exploración (en porcentaje)
export const PROBABILIDADES = {
    ENEMIGO: 0.48,      // 48% - Encuentro con enemigo
    ORO: 0.28,          // 28% - Encontrar oro (0.48 + 0.28 = 0.76)
    MATERIALES: 0.12,   // 12% - Recolectar materiales (0.76 + 0.12 = 0.88)
    PET: 0.03,          // 3% - Mascota legendaria (0.88 + 0.03 = 0.91)
    QUEST: 0.06,        // 6% - Quest menor (0.91 + 0.06 = 0.97)
    NADA: 0.03          // 3% - No encontrar nada
};

// Configuración de experiencia
export const EXP_CONFIG = {
    BASE: 100,
    MULTIPLICADOR: 1.35
};

// Stats base del jugador
export const JUGADOR_BASE = {
    NOMBRE: "Aventurero",
    NIVEL_INICIAL: 1,
    HP_BASE: 170,
    ATAQUE_BASE: 25,
    ORO_INICIAL: 90,
    EXPERIENCIA_INICIAL: 0
};

// Incrementos por nivel
export const INCREMENTOS_NIVEL = {
    HP: 45,
    ATAQUE: 9
};

// Configuración de combate
export const COMBATE = {
    VELOCIDAD_ATAQUE_HEROE: 920,      // ms entre ataques del héroe
    VELOCIDAD_ATAQUE_PET: 1350,       // ms entre ataques de la mascota
    VELOCIDAD_ATAQUE_ENEMIGO: 1150,   // ms entre ataques del enemigo
    PROBABILIDAD_HUIR: 0.45,          // 45% probabilidad de huir exitosamente
    ENEMIGOS: [
        "Goblin", 
        "Lobo Salvaje", 
        "Esqueleto Guerrero", 
        "Elemental de Fuego", 
        "Araña Venenosa"
    ]
};

// Escalado de enemigos
export const ENEMIGO_BASE = {
    HP_BASE: 125,
    HP_POR_NIVEL: 35,
    ATAQUE_BASE: 19,
    ATAQUE_POR_NIVEL: 8
};

// Recompensas
export const RECOMPENSAS = {
    ORO_MIN: 42,
    ORO_MAX: 58,
    EXP_BASE: 50,
    EXP_POR_NIVEL: 22,
    CRISTALES_MAX: 2
};

// Exploración - recompensas
export const EXPLORACION = {
    ORO_MIN: 26,
    ORO_MAX: 52,
    HIERBAS_MIN: 1,
    HIERBAS_MAX: 3,
    MADERA_MAX: 3,
    QUEST_EXP: 22
};

// Crafting
export const CRAFTING = {
    POCION: {
        HIERBAS_REQUERIDAS: 3,
        CURACION_MIN: 60,
        CURACION_MAX: 35
    }
};

// Descanso
export const DESCANSO = {
    CURACION: 72
};

// Mascotas disponibles
export const MASCOTAS = {
    slime: { nombre: "Slime Azul", emoji: "🟦", ataque: 14 },
    lobo: { nombre: "Lobo de Mana", emoji: "🐺", ataque: 20 },
    hada: { nombre: "Hada Luminosa", emoji: "🧚", ataque: 17 },
    golem: { nombre: "Golemito", emoji: "🪨", ataque: 24 }
};

// Sistema de guardado
export const STORAGE_KEY = 'warpapalel_save_v1';
export const VERSION_GUARDADO = '1.0';
