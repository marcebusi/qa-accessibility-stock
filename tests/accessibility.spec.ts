import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { LoginPage } from '../pages/LoginPage'

const EMPRESA = process.env.EMPRESA_SLUG ?? 'dev'

const PAGES = [
  { name: 'Login',      path: '/login' },
  { name: 'Productos',  path: `/${EMPRESA}/productos` },
  { name: 'Entradas',   path: `/${EMPRESA}/entradas` },
  { name: 'Salidas',    path: `/${EMPRESA}/salidas` },
  { name: 'Obras',      path: `/${EMPRESA}/obras` },
  { name: 'Personal',   path: `/${EMPRESA}/personal` },
]

// Login una vez y reutilizar el estado de sesión
test.describe('Accesibilidad WCAG 2.1 AA', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page)
    await login.login()
  })

  for (const { name, path } of PAGES.filter(p => p.path !== '/login')) {
    test(`${name} — sin violaciones críticas`, async ({ page }) => {
      await page.goto(path)
      await page.waitForLoadState('networkidle')

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()

      const critical = results.violations.filter(v => v.impact === 'critical')
      const serious  = results.violations.filter(v => v.impact === 'serious')

      if (results.violations.length > 0) {
        console.log(`\n[${name}] Violaciones encontradas:`)
        for (const v of results.violations) {
          console.log(`  [${v.impact}] ${v.id}: ${v.description}`)
          for (const node of v.nodes.slice(0, 2)) {
            console.log(`    → ${node.target}`)
          }
        }
      }

      expect(critical, `Violaciones CRÍTICAS en ${name}`).toHaveLength(0)
      expect(serious,  `Violaciones SERIAS en ${name}`).toHaveLength(0)
    })
  }

  test('Login — sin violaciones críticas', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    const critical = results.violations.filter(v => v.impact === 'critical')
    const serious  = results.violations.filter(v => v.impact === 'serious')

    if (results.violations.length > 0) {
      console.log('\n[Login] Violaciones encontradas:')
      for (const v of results.violations) {
        console.log(`  [${v.impact}] ${v.id}: ${v.description}`)
        for (const node of v.nodes.slice(0, 2)) {
          console.log(`    → ${node.target}`)
        }
      }
    }

    expect(critical, 'Violaciones CRÍTICAS en Login').toHaveLength(0)
    expect(serious,  'Violaciones SERIAS en Login').toHaveLength(0)
  })
})

// Test separado: reporte completo de todas las violaciones (no falla el CI, solo informa)
test.describe('Reporte completo WCAG', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page)
    await login.login()
  })

  for (const { name, path } of PAGES.filter(p => p.path !== '/login')) {
    test(`${name} — reporte de todas las violaciones`, async ({ page }) => {
      await page.goto(path)
      await page.waitForLoadState('networkidle')

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()

      console.log(`\n[${name}] Resumen: ${results.violations.length} violaciones, ${results.passes.length} reglas OK`)
      for (const v of results.violations) {
        console.log(`  [${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} elemento/s)`)
      }

      // Este test solo falla si hay violaciones CRÍTICAS
      const critical = results.violations.filter(v => v.impact === 'critical')
      expect(critical).toHaveLength(0)
    })
  }
})
