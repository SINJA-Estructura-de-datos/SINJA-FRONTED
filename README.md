# 🎓 Sistema SINJA v2.0
## Sistema de Información para Nuevos Ingresos y Administración

### 📋 Descripción
Sistema web para gestión de estudiantes de la Universidad de Antioquia, Facultad de Ingeniería. Permite registrar, consultar y eliminar información de estudiantes con validación en tiempo real.

### 🚀 Características
- ✅ **Registro de estudiantes** con validación completa
- ✅ **Consulta de estudiantes** por ID
- ✅ **Eliminación de estudiantes** 
- ✅ **Validación en tiempo real** de formularios
- ✅ **Interfaz responsive** y moderna
- ✅ **Integración con Spring Boot** backend
- ✅ **Sistema de logs** para debugging
- ✅ **Manejo de errores** centralizado

### 📁 Estructura del Proyecto
```
frontend SINJA/
├── index.html      # Aplicación principal
├── script.js       # Lógica de la aplicación (modular)
├── styles.css      # Estilos CSS responsivos
├── db.json         # Base de datos de prueba (JSON Server)
└── README.md       # Esta documentación
```

### 🛠️ Tecnologías Utilizadas
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Spring Boot (puerto 8080)
- **Testing**: JSON Server (opcional)
- **Arquitectura**: Modular con 7 namespaces

### 🏃‍♂️ Cómo ejecutar

#### Opción 1: Con Spring Boot (Producción)
1. Ejecutar backend Spring Boot en puerto 8080
2. Servir archivos frontend con cualquier servidor HTTP
3. Abrir `index.html` en el navegador

#### Opción 2: Con JSON Server (Testing)
```bash
# Instalar JSON Server
npm install -g json-server

# Ejecutar servidor de prueba
json-server --watch db.json --port 8080

# Servir frontend
python3 -m http.server 3000
```

### 🔧 Configuración
El sistema está configurado para conectarse a:
- **Backend URL**: `http://localhost:8080`
- **Endpoints**:
  - `GET /search?id={id}` - Buscar estudiante
  - `POST /save` - Guardar estudiante
  - `DELETE /delete?id={id}` - Eliminar estudiante

### 🎯 Funcionalidades

#### Registro de Estudiantes
- Campos: ID, Nombre, Apellido, Lugar de Nacimiento, Carrera, Ciudad, Puntaje
- Validación en tiempo real
- Verificación de duplicados

#### Consulta de Estudiantes  
- Búsqueda por ID
- Visualización completa de datos
- Opción de eliminación directa

#### Sistema de Logs
- Logs detallados en consola del navegador
- Modo debug activable con `window.SINJA_DEBUG`
- Seguimiento completo de operaciones

### 👨‍💻 Desarrollado por
**Universidad de Antioquia**  
Facultad de Ingeniería  
Sistema SINJA v2.0

### 📝 Notas
- Requiere CORS habilitado en el backend
- Optimizado para navegadores modernos
- Diseño responsive para móviles y desktop
