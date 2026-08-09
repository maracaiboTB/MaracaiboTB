# Conectar Django con Supabase

Este proyecto usa Supabase como una base PostgreSQL mediante el ORM de Django.
No necesita el SDK de Supabase para guardar productos y pedidos.

## 1. Obtener la URL

En Supabase abre **Connect > Connection string > URI**. Copia tanto
**Transaction pooler** en `DATABASE_URL` como **Session pooler** en
`DIRECT_URL`. Reemplaza `[YOUR-PASSWORD]` por la contraseña de la base de
datos.

## 2. Configurar la variable

En producción crea una variable de entorno llamada `DATABASE_URL` con esa URI.
No guardes la contraseña en el repositorio.

Para desarrollo local, copia `.env.example` como `.env` y reemplaza el valor
de ejemplo. Django lee ese archivo automáticamente y `.gitignore` evita que se
publique:

```powershell
Copy-Item .env.example .env
```

También puedes probar la conexión solamente durante la sesión actual:

```powershell
$env:DATABASE_URL='postgresql://postgres.PROJECT_REF:PASSWORD@HOST:6543/postgres'
python manage.py check --database default
```

Si la contraseña contiene caracteres especiales, usa la URI copiada por
Supabase, que incluye la codificación necesaria.

## 3. Crear las tablas

Para migraciones usa temporalmente `DIRECT_URL`, porque el pooler de sesión
admite todas las operaciones de creación de tablas:

```powershell
$directLine = Get-Content .env | Where-Object { $_ -like 'DIRECT_URL=*' }
$env:DATABASE_URL = $directLine.Substring('DIRECT_URL='.Length)
python manage.py migrate
python manage.py createsuperuser
```

## 4. Copiar los datos actuales de SQLite (opcional)

Antes de cambiar `DATABASE_URL`, exporta los datos locales:

```powershell
python manage.py dumpdata --natural-foreign --natural-primary --exclude contenttypes --exclude auth.permission --indent 2 -o datos.json
```

Luego configura `DATABASE_URL`, ejecuta `migrate` y carga la copia:

```powershell
python manage.py loaddata datos.json
```

El archivo `datos.json` puede contener datos personales de pedidos; no debe
subirse al repositorio.

## Imágenes

Supabase cubre aquí la base de datos, no los archivos de `ImageField`. El
proyecto conserva Cloudinary para imágenes cuando existe `CLOUDINARY_URL` y
usa la carpeta local `media/` en desarrollo.
