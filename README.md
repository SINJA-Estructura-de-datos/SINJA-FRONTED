# 🎓 Sistema SINJA
## Sistema de información para rastrear el nivel de estudiantes nuevos.

### 📋 Descripción
Sistema web para gestión de estudiantes nuevos en la facultad de ingeniería en Universidad de Antioquia. Permite registrar, consultar y eliminar información de estudiantes.

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
├── consultas.html  
├── styles.css      # Estilos CSS responsivos
├── script.js       # Lógica de la aplicación (modular)
└── README.md       # Esta documentación
```

### 🛠️ Tecnologías Utilizadas
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Spring Boot (puerto 8080)
- **Testing**: JSON Server (opcional)
- **Arquitectura**: Modular con 7 namespaces



### 🎯 Funcionalidades

#### Registro de Estudiantes
- Campos: ID, Nombre, Apellido, Lugar de Nacimiento, Carrera, Ciudad, Puntaje
- Validación en tiempo real
- Verificación de duplicados

#### Consulta de Estudiantes  
- Búsqueda por ID
- Busqueda por campus
- Visualización completa de datos
- Opción de eliminación directa

### 📝 Notas
- Requiere CORS habilitado en el backend
- Optimizado para navegadores modernos
- Diseño responsive para móviles y desktop
