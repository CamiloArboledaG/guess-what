# Tareas de mejora - Guess What Game

## Bugs / Código muerto
- [ ] Eliminar `finalScore` state (nunca se usa, tiene eslint-disable)
- [ ] Eliminar validación `numbers[newIndex] === null` (nunca es true)
- [ ] Eliminar `showPenalty` state y su bloque JSX muerto
- [ ] Eliminar `animatedPenalty` y toda la lógica de penalización de tiempo del score
- [ ] Fix: el timer arranca al cargar la página, debe arrancar al primer click o al presionar "Jugar"

## Arquitectura / Código
- [ ] Reemplazar los 12 `<Button>` hardcodeados por un `.map()` dinámico
- [ ] Renombrar componente `Button` → `Card` (semánticamente es una carta, no un botón)
- [ ] Reemplazar inline styles de `Button.tsx` por clases Tailwind
- [ ] Extraer la lógica del juego a un custom hook `useGame` para limpiar `page.tsx`

## Reglas del juego
- [ ] Eliminar penalización de -1 por fallo (confuso y casi invisible)
- [ ] Eliminar penalización de tiempo del score final
- [ ] Cambiar sistema de puntaje a: Intentos + Tiempo (más intuitivo)
- [ ] Timer arranca en 0 al presionar "Jugar" (no al cargar)
- [ ] Agregar niveles de dificultad: Easy (8 cartas / 4 pares), Hard (12 cartas / 6 pares)

## UX
- [ ] Crear pantalla de inicio con: título, instrucciones breves y botón "Jugar"
- [ ] Cambiar "Game Over" por "¡Ganaste!" o "Victoria" en pantalla de resultados
- [ ] Mostrar "Intentos" y "Tiempo" claramente durante el juego
- [ ] Mostrar resumen final con: Intentos, Tiempo, Mejor tiempo (localStorage)
- [ ] Guardar mejor tiempo en localStorage por dificultad
- [ ] Agregar selector de dificultad en pantalla de inicio

## Diseño visual
- [ ] Definir identidad visual: paleta de colores, tipografía, tema de las cartas (usar emojis como contenido de las cartas en vez de números)
- [ ] Diseñar carta tapada con patrón/color de fondo distintivo (visible y atractiva)
- [ ] Diseñar carta revelada con fondo diferente y número/emoji grande
- [ ] Estados visuales claros: tapada / volteando / revelada / error / éxito / ya encontrada
- [ ] Fondo con gradiente o patrón sutil en lugar del negro liso
- [ ] Responsive: que las cartas se vean bien en móvil

## Animaciones
- [ ] Animación flip 3D en cartas al voltear (CSS transform rotateY con Framer Motion)
- [ ] Animación shake en cartas cuando el par es incorrecto
- [ ] Animación pulse/bounce en cartas cuando el par es correcto
- [ ] Animación de entrada de las cartas al inicio (stagger)
- [ ] Animación de transición entre pantalla de inicio → juego → resultados
- [ ] Animación de celebración al ganar (confetti o similar con Framer Motion)
- [ ] Hover scale en cartas tapadas para indicar que son clickeables

## Pantalla de resultados
- [ ] Mostrar "¡Ganaste!" con animación de entrada
- [ ] Mostrar: Intentos, Tiempo final, Mejor tiempo
- [ ] Indicar si se batió el mejor tiempo (nuevo récord)
- [ ] Botón "Jugar de nuevo" y botón "Cambiar dificultad"
