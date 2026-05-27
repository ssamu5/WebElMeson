# Estado Actual del Proyecto

**Última actualización**: 2026-05-27

## ✅ Completado

### Fases 0-7 — Web completa construida y compilada

**Fase 0 - Setup:**
- [x] Next.js 14 con TypeScript y Tailwind CSS
- [x] Supabase: proyecto `xnfnhradjasjzmlgrrvi` (eu-west-1), 6 tablas, RLS, Realtime
- [x] Menú completo sembrado (19 items + burger del mes)
- [x] Imágenes optimizadas a WebP (de 5-15 MB a <0.15 MB)
- [x] Fuentes locales: Inter + Bebas Neue (sin dependencia de red)
- [x] GitHub: https://github.com/ssamu5/WebElMeson.git

**Fase 1 - UI Base:**
- [x] globals.css: neon animations, variables CSS, scanlines, glassmorphism
- [x] Layout con Navbar (hamburger móvil) + Footer
- [x] Componentes: Button, Card, Badge, SectionTitle, NeonText

**Fases 2-5 - Páginas:**
- [x] Inicio: Hero, Burger del Mes (real-time), Best Sellers, Foodtruck Teaser, Instagram CTA
- [x] Carta: pestañas sticky, todas las secciones, burger del mes destacada
- [x] Foodtruck: ubicación hoy (real-time), calendario interactivo, formulario de notificaciones
- [x] Info Adicional: historia, valores, galería de marca, contacto, Google Maps
- [x] Galería: grid masonry, fotos de marca, CTA a Instagram

**Fase 6 - Admin Panel (URL: /admin):**
- [x] Login protegido con contraseña (cookie httpOnly, 7 días)
- [x] Middleware que protege /admin/dashboard/*
- [x] Dashboard: menú de todas las secciones
- [x] Hoy: editar ubicación del día + burgers (publicación en tiempo real)
- [x] Menú: toggle disponibilidad + toggle destacado con un toque
- [x] Calendario: añadir/editar/borrar eventos del foodtruck
- [x] Burger del Mes: cambiar nombre, ingredientes, historia, precio
- [x] Notificaciones: ver suscriptores, enviar notificaciones por pueblo

**Fase 7 - Build:**
- [x] Build de producción: ✓ 21 páginas compiladas sin errores
- [x] TypeScript: sin errores de tipos
- [x] ESLint: sin warnings

## ⚠️ Pendiente de acción manual (propietario)

### ANTES DE ABRIR LA WEB AL PÚBLICO:
1. **Service Role Key** → https://supabase.com/dashboard/project/xnfnhradjasjzmlgrrvi/settings/api
   - Copiar `service_role` key → pegar en `.env.local` (variable `SUPABASE_SERVICE_ROLE_KEY`)
   - Añadirla también en Vercel cuando hagas el deploy

2. **Resend API Key** → https://resend.com (gratis: 3.000 emails/mes)
   - Crear cuenta → crear API key → pegar en `.env.local` (variable `RESEND_API_KEY`)
   - Sin Resend, las notificaciones no se envían (pero el resto funciona)

3. **Contraseña Admin** → Cambiar `ADMIN_PASSWORD` en `.env.local` por una contraseña segura

4. **Deploy en Vercel** → Ver instrucciones en CLAUDE.md

## 🚀 Cómo ejecutar en local

```bash
cd "c:\Users\samul\OneDrive\Escritorio\WebElMeson"
npm run dev
```
Luego abre http://localhost:3000

**Panel admin**: http://localhost:3000/admin
**Contraseña actual**: ElMeson2026! (cambiar en .env.local)

## 📁 Estructura de páginas

| URL | Descripción |
|-----|-------------|
| / | Página de inicio |
| /carta | Carta completa con pestañas |
| /foodtruck | Foodtruck: calendario, ubicación, notificaciones |
| /info | Info del negocio y contacto |
| /galeria | Galería de fotos |
| /admin/login | Acceso al panel de administración |
| /admin/dashboard | Panel de admin (protegido) |

## 🔄 Flujo de uso diario (propietario)

1. Abre http://tu-dominio.com/admin en el móvil
2. Entra con la contraseña
3. Toca **"Hoy"** → pon la ubicación de hoy y las burgers que vas a servir
4. La web se actualiza en tiempo real

Para el calendario: toca **"Calendario"** → añade los eventos de las próximas semanas.
Para notificar a suscriptores: toca **"Notificaciones"** → selecciona pueblo → escribe mensaje → enviar.
