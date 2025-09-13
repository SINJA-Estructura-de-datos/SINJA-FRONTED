# 🔧 Guía de Configuración - Sistema SINJA

## 📋 Configuración Actual: SPRING BOOT ✅

El sistema está configurado para trabajar con **Spring Boot** en puerto `8080`.

### 🏃‍♂️ Para usar con Spring Boot:
```bash
# 1. Ejecutar backend Spring Boot
# (debe estar corriendo en puerto 8080)

# 2. Servir frontend
python3 -m http.server 3000
# o usar cualquier servidor HTTP
```

---

## 🔄 Cómo cambiar a JSON Server

### Paso 1: Cambiar configuración de API
En `script.js`, líneas 33-45, **comentar Spring Boot** y **descomentar JSON Server**:

```javascript
// COMENTAR ESTA SECCIÓN (Spring Boot):
/*
const API_BASE_URL = 'http://localhost:8080';
const API_ENDPOINTS = {
    SEARCH: '/search',
    SAVE: '/save',
    DELETE: '/delete'
};
*/

// DESCOMENTAR ESTA SECCIÓN (JSON Server):
const API_BASE_URL = 'http://localhost:8081';
const API_ENDPOINTS = {
    SEARCH: '/student',
    SAVE: '/student',
    DELETE: '/student'
};
```

### Paso 2: Cambiar URLs en funciones de API
1. **En buscarEstudiantePorId()** (~línea 410):
   ```javascript
   // COMENTAR: const url = `${API_BASE_URL}${API_ENDPOINTS.SEARCH}?id=${normalizedId}`;
   // DESCOMENTAR: const url = `${API_BASE_URL}${API_ENDPOINTS.SEARCH}/${normalizedId}`;
   ```

2. **En eliminarEstudiantePorId()** (~línea 530):
   ```javascript
   // COMENTAR: const url = `${API_BASE_URL}${API_ENDPOINTS.DELETE}?id=${id}`;
   // DESCOMENTAR: const url = `${API_BASE_URL}${API_ENDPOINTS.DELETE}/${id}`;
   ```

### Paso 3: Ejecutar JSON Server
```bash
# Ejecutar JSON Server
json-server --watch db.json --port 8081

# Servir frontend
python3 -m http.server 3000
```

---

## 📊 Comparación de Configuraciones

| Aspecto | Spring Boot | JSON Server |
|---------|-------------|-------------|
| **Puerto** | 8080 | 8081 |
| **Búsqueda** | `/search?id=123` | `/student/123` |
| **Guardar** | `POST /save` | `POST /student` |
| **Eliminar** | `/delete?id=123` | `DELETE /student/123` |
| **Configuración** | Personalizada | REST estándar |

---

## ⚠️ Notas Importantes

1. **CORS**: Ambos servidores deben tener CORS habilitado
2. **db.json**: Solo necesario para JSON Server
3. **Validación**: Funciona igual en ambas configuraciones
4. **Logs**: Sistema de logs funciona en ambas configuraciones

---

## 🎯 Recomendación

- **Desarrollo/Testing**: Usar JSON Server (más fácil setup)
- **Producción**: Usar Spring Boot (más robusto)

El sistema está **optimizado para Spring Boot** por defecto, con comentarios claros para cambiar a JSON Server cuando sea necesario.
