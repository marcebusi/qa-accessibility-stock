# qa-accessibility-stock

Suite de accesibilidad para **stock-system-obra-main** usando **axe-core + Playwright**.

Valida conformidad WCAG 2.1 AA en las páginas principales de la aplicación.

## Stack

| Herramienta | Versión | Rol |
|---|---|---|
| Playwright | ^1.49 | Browser automation |
| @axe-core/playwright | ^4.10 | Motor de análisis WCAG |
| axe-core | ^4.10 | Reglas de accesibilidad |

## Requisitos

- Node.js >= 18
- Frontend corriendo en `http://localhost:5173`
- Backend corriendo en `http://localhost:3001`
- Usuario de prueba `qa@test.com` / `TestPass123!` en la DB

## Instalación

```bash
npm install
npx playwright install chromium
```

## Ejecución

```bash
# Correr todos los tests
npm test

# Con reporte HTML
npm run test:report
npm run report
```

## Variables de entorno

| Variable | Default | Descripción |
|---|---|---|
| `BASE_URL` | `http://localhost:5173` | URL del frontend |
| `EMPRESA_SLUG` | `dev` | Slug de la empresa en la URL |

## Páginas testeadas

| Página | Ruta |
|---|---|
| Login | `/login` |
| Productos | `/:empresa/productos` |
| Entradas | `/:empresa/entradas` |
| Salidas | `/:empresa/salidas` |
| Obras | `/:empresa/obras` |
| Personal | `/:empresa/personal` |

## Suites

### `Accesibilidad WCAG 2.1 AA`
Falla el test si hay violaciones de impacto **critical** o **serious**. Estas son las que impiden o dificultan gravemente el uso a personas con discapacidad.

### `Reporte completo WCAG`
Imprime todas las violaciones encontradas (incluyendo moderate y minor) pero solo falla por violaciones **critical**. Útil para tener visibilidad sin bloquear el CI.

## Niveles de impacto axe-core

| Impacto | Descripción |
|---|---|
| `critical` | Bloquea completamente el acceso a usuarios con discapacidad |
| `serious` | Dificulta gravemente el uso |
| `moderate` | Crea dificultades significativas |
| `minor` | Molestia menor, no bloquea el acceso |
