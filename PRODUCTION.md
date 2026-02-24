# Guía de Seguridad y Producción

## 🔒 Arquitectura de Seguridad

Este CRM utiliza un modelo de **Multi-tenancy Rígido** donde los datos de cada cliente residen en bases de datos (proyectos de Supabase) físicamente separadas.

### 1. Encriptación de Conexiones
Todas las llaves de API de los clientes se almacenan en la Master Database utilizando **AES-256-GCM**.
- **IV (Initialization Vector)**: Único por cada registro.
- **Auth Tag**: Asegura la integridad del mensaje.
- **Master Key**: Debe rotarse anualmente y almacenarse como variable de entorno secreta en el proveedor de hosting.

### 2. Aislamiento de Red (VPC)
Para despliegues de grado bancario, se recomienda:
- **Supabase VPC**: Conectar Next.js con Supabase utilizando túneles privados (Direct Connect o VPC Peering).
- **IP Allowlisting**: Configurar las bases de datos de los clientes para aceptar tráfico exclusivamente de las direcciones IP de salida de la aplicación (Vercel/AWS).

### 3. Monitoreo y Auditoría
- **Sentry**: Integrado para captura de errores en frontend y backend.
- **PostHog**: Utilizado para analítica de uso respetando la privacidad (sin capturar PII).
- **Audit Logs**: Cada acceso a la base de datos de un cliente a través del middleware dinámico deja un registro de auditoría en la Master DB.

## 🚀 Despliegue en Vercel

1. Clonar el repositorio.
2. Configurar las variables de entorno en el panel de Vercel.
3. El archivo `vercel.json` ya incluye los headers de seguridad necesarios (CSP, HSTS, FrameOptions).
4. El despliegue se activa automáticamente con cada `git push` a la rama `main`.

## 📈 Onboarding de Clientes
Utilizar el script `lib/scripts/onboard-client.ts` para automatizar la creación de nuevos tenants. El script maneja la encriptación de llaves automáticamente.
