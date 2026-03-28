# Warpapalel

🌟 **RPG Incremental de Navegador** 🌟

Embárcate en una aventura épica en los bosques encantados de Asteria. ¡Conviértete en el héroe legendario que el mundo necesita!

## 🎮 Cómo Jugar

1. **Abre el juego**: Simplemente abre `index.html` en tu navegador web moderno.
2. **Personaliza tu héroe**: Ingresa un nombre para tu aventurero.
3. **Explora**: Usa el botón "🌲 Explorar" para descubrir tesoros, enemigos y más.
4. **Combate**: Derrota enemigos para ganar experiencia y oro.
5. **Progresiona**: Sube de nivel para volverte más fuerte.

## ✨ Características

### 🗡️ Sistema de Combate
- Combate automático por turnos
- Enemigos variados con escalado de dificultad
- Barra de vida visual para ti y tus oponentes
- Opción de huir o usar pociones

### 🐾 Sistema de Mascotas
- 4 tipos de mascotas legendarias:
  - 🟦 Slime Azul
  - 🐺 Lobo de Mana
  - 🧚 Hada Luminosa
  - 🪨 Golemito
- **3% de probabilidad** al explorar (¡muy raro!)
- Las mascotas te ayudan en combate

### 📊 Progresión
- Sistema de experiencia con fórmula progresiva: `100 × 1.35^(nivel-1)`
- Aumento de stats con cada nivel
- Inventario para recursos y objetos

### 🛠️ Crafting
- Crea pociones de curación con 3 hierbas
- Recoge materiales explorando

### 💾 Sistema de Guardado
- Guardado automático cada 30 segundos
- Guardado manual cuando quieras
- Carga automática al volver

## 🎯 Probabilidades de Exploración

| Evento | Probabilidad |
|--------|-------------|
| 👹 Enemigo | 48% |
| 💰 Oro | 28% |
| 🌿 Materiales | 12% |
| 🐾 Mascota | 3% |
| 📜 Quest menor | 6% |
| 😶 Nada | 3% |

## 🏗️ Estructura del Proyecto

```
warpapalel/
├── index.html          # Archivo principal HTML
├── css/
│   └── styles.css      # Estilos y diseño responsive
├── js/
│   ├── main.js         # Punto de entrada y coordinador
│   ├── constants.js    # Constantes y configuración
│   ├── gamestate.js    # Gestión de estado y guardado
│   ├── combat.js       # Sistema de combate
│   ├── exploration.js  # Sistema de exploración
│   └── ui.js           # Gestor de interfaz de usuario
└── README.md           # Este archivo
```

## 🚀 Requisitos Técnicos

- Navegador moderno con soporte para ES6 Modules
- JavaScript habilitado
- LocalStorage habilitado (para guardar partidas)

## 🎨 Mejoras Implementadas

- ✅ Código modularizado en archivos separados
- ✅ Sistema de guardado con localStorage
- ✅ CSS externo con variables y diseño responsive
- ✅ Documentación JSDoc en funciones
- ✅ Constantes centralizadas para fácil ajuste
- ✅ Accesibilidad mejorada (ARIA labels, foco visible)
- ✅ Animaciones suaves
- ✅ GameState organizado para manejo de estado

## 🔧 Desarrollo

Para modificar el balance del juego, edita `js/constants.js`:

```javascript
export const PROBABILIDADES = {
    ENEMIGO: 0.48,
    PET: 0.03,
    // ... etc
};
```

## 📝 Licencia

Juego creado con fines educativos y de entretenimiento.

---

**¡Que comience tu aventura en Asteria!** ⚔️✨