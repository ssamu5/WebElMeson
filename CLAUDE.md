# El Mesón Smashburgers - Guía para Claude

## Proyecto
Web profesional mobile-first para El Mesón Smashburgers (Fustiñana, Navarra).
GitHub: https://github.com/ssamu5/WebElMeson.git

## Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Estilos**: Tailwind CSS con paleta neon rosa/negro custom
- **Base de datos**: Supabase (PostgreSQL + Realtime) — proyecto: `xnfnhradjasjzmlgrrvi`
- **Hosting**: Vercel (deploy automático desde GitHub)
- **Emails**: Resend

## Comandos
```bash
npm run dev      # Servidor de desarrollo en http://localhost:3000
npm run build    # Build de producción
npm run lint     # Linting
node scripts/optimize-images.mjs  # Optimizar imágenes (solo si se añaden fotos nuevas)
```

## Estructura clave
```
src/app/          → Páginas (Next.js App Router)
src/components/   → Componentes React
src/lib/          → Supabase clients, utils, constantes
src/types/        → TypeScript types
public/images/    → Imágenes optimizadas (WebP)
Fotos_Referencia/ → Imágenes originales (NO usar en la web directamente)
supabase/         → Migraciones SQL
scripts/          → Scripts de utilidad
```

## Colores de marca
| Variable | Hex | Uso |
|----------|-----|-----|
| brand.pink | #E8189A | Color principal, CTAs, neon |
| brand.pink-glow | #FF40B8 | Efectos glow |
| brand.pink-dark | #A01068 | Hover states |
| dark.DEFAULT | #0A0A0A | Fondo principal |
| brand.amber | #FF8C00 | Acento secundario |

## Base de datos (Supabase)
Tablas: `menu_items`, `burger_del_mes`, `foodtruck_locations`, `today_special`, `notification_subscribers`, `gallery_images`
- Lectura pública habilitada en todas las tablas (RLS SELECT para todos)
- Escritura solo desde server-side con `SUPABASE_SERVICE_ROLE_KEY`
- Realtime habilitado en: menu_items, burger_del_mes, foodtruck_locations, today_special

## Admin Panel
URL: `/admin` (no enlazada en ningún sitio público)
Auth: Cookie httpOnly con `ADMIN_PASSWORD` y `ADMIN_SESSION_SECRET` del .env.local
El propietario lo usa desde el móvil para actualizar la web sin tocar código.

## Variables de entorno pendientes de configurar
1. `SUPABASE_SERVICE_ROLE_KEY` → obtener en https://supabase.com/dashboard/project/xnfnhradjasjzmlgrrvi/settings/api
2. `RESEND_API_KEY` → obtener en https://resend.com (plan gratuito: 3.000 emails/mes)
3. `ADMIN_PASSWORD` → cambiar por una contraseña segura antes de producción

## Deploy en Vercel
1. Hacer push a GitHub
2. Conectar el repo en https://vercel.com
3. Añadir todas las variables de entorno del .env.local en Vercel
4. El deploy es automático con cada push a main

## Convenciones
- Componentes: PascalCase, archivos `.tsx`
- Utilities: camelCase, archivos `.ts`
- Siempre usar `cn()` de `src/lib/utils/cn.ts` para clases condicionales de Tailwind
- Imágenes: siempre usar `next/image`, nunca `<img>` directamente
- Supabase server-side: usar `createAdminClient()` solo en API routes (`/api/**`)
- Supabase client-side: usar `createClient()` de `lib/supabase/client.ts`
