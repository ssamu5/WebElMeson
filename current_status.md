# Estado Actual del Proyecto

**Última actualización**: 2026-05-27

## ✅ Completado

### Fase 0 - Setup
- [x] Next.js 14 inicializado con TypeScript y Tailwind CSS
- [x] Dependencias instaladas: Supabase, Resend, jose, clsx, tailwind-merge, sharp
- [x] Tailwind configurado con paleta neon (rosa, negro, ámbar)
- [x] Imágenes optimizadas a WebP (de 5-15 MB a <0.15 MB c/u)
- [x] Supabase proyecto creado: `xnfnhradjasjzmlgrrvi` (región eu-west-1)
- [x] Esquema de base de datos aplicado (6 tablas + RLS + índices)
- [x] Menú completo sembrado (6 raciones, 7 burgers €10, 6 burgers €13, 3 postres, burger del mes)
- [x] CLAUDE.md creado
- [x] .env.local creado (faltan 2 claves: service_role y Resend)
- [x] Estructura de carpetas creada
- [x] Types TypeScript definidos
- [x] Supabase clients (client.ts, server.ts) creados
- [x] Utilidades (cn, formatPrice, formatDate, siteConfig)

## 🔄 En Progreso

### Fase 0 - Setup (resto)
- [ ] Push inicial a GitHub

### Fase 1 - Base UI
- [ ] globals.css con animaciones neon y variables CSS
- [ ] layout.tsx raíz con fuentes Bebas Neue + Inter
- [ ] Navbar (mobile hamburger + desktop)
- [ ] Footer
- [ ] Componentes UI base (Button, NeonText, Card, Badge, SectionTitle)

## ⏳ Pendiente

- Fase 2: Página Inicio
- Fase 3: Página Carta  
- Fase 4: Página Foodtruck (calendario, notificaciones)
- Fase 5: Info Adicional + Galería
- Fase 6: Admin Panel completo
- Fase 7: SEO + Deploy Vercel

## ⚠️ Pendiente de acción manual (propietario)

1. **Service Role Key**: Ir a https://supabase.com/dashboard/project/xnfnhradjasjzmlgrrvi/settings/api → copiar `service_role` key → pegar en `.env.local`
2. **Resend API Key**: Crear cuenta en https://resend.com → obtener API key → pegar en `.env.local`
3. **Contraseña Admin**: Cambiar `ADMIN_PASSWORD` en `.env.local` por una contraseña segura antes de poner la web en producción

## 🐛 Problemas conocidos

- Ninguno por ahora

## 📝 Notas

- Las imágenes originales están en `Fotos_Referencia/` — las optimizadas para web en `public/images/`
- El admin panel estará en `/admin` — guardar como bookmark en el móvil
