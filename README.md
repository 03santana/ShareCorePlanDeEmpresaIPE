# ShareCore — Prototipo web

Prototipo estático creado como demo para la idea ShareCore: versión mínima que muestra únicamente las ofertas disponibles (marketplace simulado).

Contenido:
- `index.html` — página reducida que muestra sólo la sección "Ofertas disponibles" con tarjetas generadas por `app.js`.
- `styles.css` — estilos simples.
- `app.js` — lógica mínima: genera tarjetas de dispositivos (simuladas) y maneja la acción de "Alquilar (prototipo)".

Cómo ejecutar (Windows):
1. Abrir el explorador de archivos y navegar a la carpeta del proyecto:
   `C:\Users\dorae\Documents\Trabajo_IPE_Empresa\sharecore-prototipo`
2. Abrir `index.html` en un navegador (doble clic), o desde PowerShell ejecutar:

```powershell
Start-Process "C:\Users\dorae\Documents\Trabajo_IPE_Empresa\sharecore-prototipo\index.html"
```

Pruebas rápidas:
- Haz clic en los botones "Alquilar (prototipo)" para ver la simulación (alert).
- Ya no hay formularios ni almacenamiento local de encuestas en esta versión reducida.

Notas:
- Esta versión es únicamente visual y demostrativa. No gestiona pagos ni autenticación.

Siguientes pasos sugeridos:
- Restaurar o implementar encuestas en un backend si quieres recolectar respuestas reales.
- Añadir autenticación y persistencia (API + base de datos).
- Implementar un flujo de reserva por horas con calendario y gestión de horarios.

Verificación (archivos presentes)
-------------------------------
He verificado que la carpeta del proyecto contiene los archivos principales del prototipo:

- `index.html` — interfaz con la sección "Ofertas disponibles".
- `styles.css` — estilos para la página.
- `app.js` — genera las tarjetas de dispositivos y maneja la acción de alquilar (simulación).
- `README.md` — este archivo con instrucciones y verificación.
- `NOTES.txt` — notas rápidas del prototipo.
- `.gitignore` — ignores básicos.

Entrega / Resumen final
-----------------------
Versión entregada: prototipo estático reducido que muestra únicamente las ofertas disponibles (marketplace simulado).

Qué incluye:
- Interfaz mínima con listados de dispositivos disponibles y botones de "Alquilar (prototipo)".
- Lógica front-end en `app.js` para generar tarjetas y simular la acción de alquiler.

Cómo probar (rápido):
1. Abrir `index.html` en un navegador (doble clic) o desde PowerShell:

```powershell
Start-Process "index.html"
```

2. Pulsar los botones "Alquilar (prototipo)" para ver la simulación.

Notas finales:
- El prototipo está pensado para presentación y pruebas locales. No está listo para producción.
- Si quieres que añada persistencia (backend), export CSV de encuestas, o un modal de reserva por horas, dime cuál de las opciones prefieres y lo implemento.

