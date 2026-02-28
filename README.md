# CRM Call Center Enterprise

Sistema CRM nivel enterprise con arquitectura multi-tenant, integración de IA para análisis de llamadas, y dashboard analítico estilo Power BI.

## 🚀 Características Principales

- **Multi-tenancy**: Cada organización tiene su propia base de datos aislada
- **Seguridad**: Encriptación AES-256 para credenciales sensibles
- **IA Analytics**: Análisis de rendimiento de agentes y predicciones con OpenAI/Claude/Gemini
- **Dashboard Interactivo**: Visualizaciones estilo Power BI con Tremor
- **Gestión de Llamadas**: Tabla dinámica con campos personalizables
- **Reportes**: Generación de PDFs ejecutivos

## 📋 Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Base de Datos**: PostgreSQL (vía Supabase)
- **Estilos**: Tailwind CSS + Shadcn UI
- **IA**: Vercel AI SDK
- **Gráficos**: Tremor
- **Tablas**: TanStack Table v8

## 📁 Estructura del Proyecto

```
crm-callcenter-enterprise/
├── app/                    # Next.js App Router
├── components/             # Componentes React
├── lib/
│   ├── supabase/          # Clientes de Supabase
│   │   ├── schemas/       # Esquemas SQL
│   │   ├── master-client.ts
│   │   └── dynamic-client.ts
│   ├── encryption/        # Módulo de encriptación
│   └── ai/               # Integración con IA
├── types/                # Tipos TypeScript
└── middleware.ts         # Middleware de autenticación
```

## 🔧 Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local`:

```env
# Master Database (Supabase Principal)
NEXT_PUBLIC_SUPABASE_URL=your_master_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_master_service_role_key

# Clave de Encriptación (generar con: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
ENCRYPTION_KEY=your_encryption_key

# Opcional: Para desarrollo
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Instalación de Dependencias

```bash
npm install
```

### 3. Configurar Bases de Datos

Sigue las instrucciones en `lib/supabase/SETUP.md` para:
1. Crear la Master Database
2. Crear Client Database(s)
3. Ejecutar los esquemas SQL
4. Configurar Storage buckets

## 🗄️ Esquemas de Base de Datos

### Master Database (`master-schema.sql`)

- **organizations**: Información de cada organización/cliente
- **client_connections**: Credenciales encriptadas de Supabase y API keys de IA
- **users**: Usuarios del sistema vinculados a organizaciones
- **audit_logs**: Registro de auditoría de acciones críticas

### Client Database (`client-schema.sql`)

- **calls**: Registros de llamadas con campos dinámicos JSONB
- **suggestions**: Sistema de mejora continua
- **agents**: Información y estadísticas de agentes
- **ai_analytics**: Resultados de análisis de IA

## 🔐 Seguridad

- **Encriptación**: Todas las API keys se almacenan encriptadas con AES-256-GCM
- **RLS**: Row Level Security habilitado en todas las tablas
- **Middleware**: Protección de rutas y verificación de autenticación
- **Headers de Seguridad**: X-Frame-Options, CSP, etc.

## 📦 Fase 1 Completada

✅ Arquitectura de datos y multi-tenancy implementada:
- Esquemas SQL para Master y Client databases
- Módulo de encriptación AES-256
- Cliente maestro de Supabase
- Factory de clientes dinámicos
- Middleware de Next.js
- Documentación de configuración

## 🚧 Próximos Pasos

- **Fase 2**: Autenticación y Layout Base
- **Fase 3**: Dashboard Principal (Power BI Style)
- **Fase 4**: Módulo de Gestión de Llamadas
- **Fase 5**: IA Analytics & Proyecciones
- **Fase 6**: Módulo de Sugerencias
- **Fase 7**: Ajustes y Configuración
- **Fase 8**: Infraestructura de Producción

## 📚 Documentación

- [Configuración de Supabase](lib/supabase/SETUP.md)
- [Plan de Implementación](../brain/implementation_plan.md)

## 🤝 Contribución

Este es un proyecto privado. Para reportar problemas o sugerencias, usa el módulo de sugerencias del sistema.

## 📄 Licencia

Propietario - Todos los derechos reservados
