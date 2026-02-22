# Tareas de mejora - Guess What Game

## Bugs / Código muerto
- [x] Eliminar `finalScore` state (nunca se usa, tiene eslint-disable)
- [x] Eliminar validación `numbers[newIndex] === null` (nunca es true)
- [x] Eliminar `showPenalty` state y su bloque JSX muerto
- [x] Eliminar `animatedPenalty` y toda la lógica de penalización de tiempo del score
- [x] Fix: el timer arranca al cargar la página, debe arrancar al primer click o al presionar "Jugar"

## Arquitectura / Código
- [x] Reemplazar los 12 `<Button>` hardcodeados por un `.map()` dinámico
- [x] Renombrar componente `Button` → `Card` (semánticamente es una carta, no un botón)
- [x] Reemplazar inline styles de `Button.tsx` por clases Tailwind
- [x] Extraer la lógica del juego a un custom hook `useGame` para limpiar `page.tsx`
- [x] Eliminar `Button.tsx` (ya no se importa en ningún lado, es código muerto)

## Reglas del juego
- [x] Eliminar penalización de -1 por fallo (confuso y casi invisible)
- [x] Eliminar penalización de tiempo del score final
- [x] Cambiar sistema de puntaje a: Intentos + Tiempo (más intuitivo)
- [x] Timer arranca en 0 al presionar "Jugar" (no al cargar)
- [x] Agregar niveles de dificultad: Easy (8 cartas / 4 pares), Hard (12 cartas / 6 pares)

## UX
- [x] Crear pantalla de inicio con: título, instrucciones breves y botón "Jugar"
- [x] Cambiar "Game Over" por "¡Ganaste!" o "Victoria" en pantalla de resultados
- [x] Mostrar "Intentos" y "Tiempo" claramente durante el juego
- [x] Mostrar resumen final con: Intentos, Tiempo, Mejor tiempo (localStorage)
- [x] Guardar mejor tiempo en localStorage por dificultad
- [x] Agregar selector de dificultad en pantalla de inicio

## Diseño visual
- [x] Definir identidad visual: paleta indigo/slate, Geist, emojis como contenido de las cartas
- [x] Diseñar carta tapada con patrón/color de fondo más elaborado (dot grid pattern indigo)
- [x] Diseñar carta revelada con fondo diferente y emoji grande
- [x] Estados visuales claros: tapada / volteando / revelada / error / éxito / ya encontrada
- [x] Fondo con gradiente (slate-950 → indigo-950) en lugar del negro liso
- [x] Responsive: ajustado para pantallas de 320px (p-4 sm:p-6, gap-2 sm:gap-3, w-16 sm:w-[72px])

## Animaciones
- [x] Animación flip 3D en cartas al voltear (Framer Motion rotateY)
- [x] Animación shake en cartas cuando el par es incorrecto
- [x] Animación pulse/bounce en cartas cuando el par es correcto
- [x] Animación de entrada de las cartas al inicio (stagger)
- [x] Animación de transición entre pantalla de inicio → juego → resultados
- [x] Animación de celebración al ganar (confetti con Framer Motion)
- [x] Hover scale en cartas tapadas para indicar que son clickeables

## Pantalla de resultados
- [x] Mostrar "¡Ganaste!" con animación de entrada
- [x] Mostrar: Intentos, Tiempo final, Mejor tiempo
- [x] Indicar si se batió el mejor tiempo (nuevo récord)
- [x] Botón "Jugar de nuevo" y botón "Cambiar dificultad"
