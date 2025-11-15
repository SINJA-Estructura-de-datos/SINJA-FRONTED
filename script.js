/**
 * ===============================================
 * SISTEMA DE REGISTRO Y CONSULTA DE ESTUDIANTES SINJA
 * Universidad de Antioquia - Facultad de Ingeniería
 * ===============================================
 
// ===============================================
// CONFIGURACIÓN GLOBAL DE LA APLICACIÓN
// ===============================================
/**
 * Para cambiar a Spring Boot, comenta la configuración de abajo
 * y descomenta esta configuración:
 */
const API_BASE_URL = 'http://localhost:8080';
const API_ENDPOINTS = {
    SEARCH: '/search',    // GET /search?id=123
    SAVE: '/save',        // POST /save (body JSON)
    DELETE: '/delete',   // DELETE /delete?id=123
    CAMPUS_SEARCH: '/search/campus'  // GET /students/campus?campus=MEDELLIN
};

/**
 * Configuración de timeouts y delays
 * @constant {Object}
 */
const CONFIG = {
    ALERT_TIMEOUT: 5000,
    SUCCESS_REDIRECT_DELAY: 2000,
    LOADING_MIN_TIME: 300
};

// ===============================================
// SISTEMA DE VALIDACIÓN DE CAMPOS
// ===============================================

/**
 * Validadores para cada campo del formulario
 * Cada validador es una función que recibe un valor y retorna boolean
 * @constant {Object}
 */
const validators = {
    /**
     * Valida que el ID sea numérico (más flexible)
     * @param {string} value - Valor a validar
     * @returns {boolean} - True si es válido
     */
    id: (value) => {
        const trimmed = value.trim();
        return trimmed.length > 0 && !isNaN(parseInt(trimmed)) && parseInt(trimmed) > 0;
    },
    
    /**
     * Valida que el nombre contenga solo letras, espacios y acentos
     * @param {string} value - Valor a validar
     * @returns {boolean} - True si es válido
     */
    name: (value) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value) && value.trim().length > 0,
    
    /**
     * Valida que el apellido contenga solo letras, espacios y acentos
     * @param {string} value - Valor a validar
     * @returns {boolean} - True si es válido
     */
    lastName: (value) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value) && value.trim().length > 0,
    
    /**
     * Valida que el lugar de nacimiento no esté vacío
     * @param {string} value - Valor a validar
     * @returns {boolean} - True si es válido
     */
    bornPlace: (value) => value.trim().length > 0,
    
    /**
     * Valida que se haya seleccionado una carrera
     * @param {string} value - Valor a validar
     * @returns {boolean} - True si es válido
     */
    degree: (value) => value.trim().length > 0,
    
    /**
     * Valida que se haya seleccionado un campus
     * @param {string} value - Valor a validar
     * @returns {boolean} - True si es válido
     */
    place: (value) => value.trim().length > 0,
    
    /**
     * Valida que el puntaje esté entre 0 y 500
     * @param {string} value - Valor a validar
     * @returns {boolean} - True si es válido
     */
    scoreAdmision: (value) => {
        const num = parseInt(value);
        return !isNaN(num) && num >= 0 && num <= 100;
    }
};

// ===============================================
// SISTEMA DE NAVEGACIÓN Y CONTROL DE UI
// ===============================================

/**
 * Controla la visibilidad de las secciones de la aplicación
 * @namespace Navigation
 */
const Navigation = {
    /**
     * Muestra la pantalla principal y oculta todas las demás secciones
     * Resetea el formulario para limpiar cualquier dato previo
     * @function
     */
    showMainScreen() {
        console.log('🏠 Navegando a pantalla principal');
        this.hideAllSections();
        document.getElementById('mainScreen').classList.add('active');
        FormManager.resetForm();
    },

    /**
     * Muestra el formulario de registro de estudiantes
     * @function
     */
    showRegistroForm() {
        console.log('📝 Navegando a formulario de registro');
        this.hideAllSections();
        document.getElementById('registroForm').classList.add('active');
    },

    /**
     * Muestra el modal de consulta de estudiantes
     * Enfoca automáticamente el campo de ID para mejor UX
     * @function
     */
    showConsultaModal() {
        console.log('🔍 Abriendo modal de consulta');
        const modal = document.getElementById('consultaModal');
        const inputId = document.getElementById('consultaId');
        
        modal.style.display = 'block';
        // Pequeño delay para asegurar que el modal esté visible antes del focus
        setTimeout(() => inputId.focus(), 100);
    },

    /**
     * Cierra el modal de consulta y limpia todos los datos
     * Resetea tanto el input como los resultados mostrados
     * @function
     */
    closeModal() {
        console.log('❌ Cerrando modal de consulta');
        const modal = document.getElementById('consultaModal');
        const resultDiv = document.getElementById('resultadoConsulta');
        const inputId = document.getElementById('consultaId');
        
        modal.style.display = 'none';
        resultDiv.innerHTML = '';
        inputId.value = '';
    },

    /**
     * Oculta todas las secciones principales de la aplicación
     * Función auxiliar utilizada por otras funciones de navegación
     * @private
     * @function
     */
    hideAllSections() {
        const sections = document.querySelectorAll('.form-section');
        sections.forEach(section => section.classList.remove('active'));
    },

    /**
     * Muestra el modal de éxito de registro
     * @function
     */
    showSuccessModal() {
        console.log('✅ Mostrando modal de registro exitoso');
        const modal = document.getElementById('successModal');
        modal.style.display = 'block';
    },

    /**
     * Cierra el modal de éxito de registro y regresa a pantalla principal
     * @function
     */
    closeSuccessModal() {
        console.log('❌ Cerrando modal de registro exitoso y regresando a pantalla principal');
        const modal = document.getElementById('successModal');
        modal.style.display = 'none';
        // Regresar a pantalla principal después de cerrar el modal
        setTimeout(() => {
            Navigation.showMainScreen();
        }, 300);
    },

    /**
     * Muestra el modal de éxito de eliminación
     * @function
     */
    showDeleteSuccessModal() {
        console.log('🗑️ Mostrando modal de eliminación exitosa');
        const modal = document.getElementById('deleteSuccessModal');
        modal.style.display = 'block';
    },

    /**
     * Cierra el modal de éxito de eliminación
     * @function
     */
    closeDeleteSuccessModal() {
        console.log('❌ Cerrando modal de eliminación exitosa');
        const modal = document.getElementById('deleteSuccessModal');
        modal.style.display = 'none';
    }
};

// Crear aliases globales para compatibilidad con HTML onclick
const showMainScreen = () => Navigation.showMainScreen();
const showRegistroForm = () => Navigation.showRegistroForm();
const showConsultaModal = () => Navigation.showConsultaModal();
const closeModal = () => Navigation.closeModal();
const showSuccessModal = () => Navigation.showSuccessModal();
const closeSuccessModal = () => Navigation.closeSuccessModal();
const showDeleteSuccessModal = () => Navigation.showDeleteSuccessModal();
const closeDeleteSuccessModal = () => Navigation.closeDeleteSuccessModal();

// ===============================================
// SISTEMA DE VALIDACIÓN Y GESTIÓN DE FORMULARIOS
// ===============================================

/**
 * Gestiona la validación y el estado del formulario de registro
 * @namespace FormManager
 */
const FormManager = {
    /**
     * Valida un campo individual del formulario aplicando el validador correspondiente
     * Muestra/oculta los mensajes de error visualmente
     * @param {HTMLElement} field - Elemento del campo a validar
     * @returns {boolean} - True si el campo es válido, false en caso contrario
     */
    validateField(field) {
        const fieldName = field.name;
        const value = field.value;
        const formGroup = field.parentNode;
        
        console.log(`🔍 Validando campo: ${fieldName} = "${value}"`);
        
        // Verificar si existe un validador para este campo
        if (validators[fieldName]) {
            const isValid = validators[fieldName](value);
            
            if (isValid) {
                formGroup.classList.remove('error');
                console.log(`✅ Campo ${fieldName} válido`);
            } else {
                formGroup.classList.add('error');
                console.log(`❌ Campo ${fieldName} inválido`);
            }
            
            return isValid;
        } else {
            // Si no hay validador, asumir que es válido
            formGroup.classList.remove('error');
            return true;
        }
    },

    /**
     * Valida todos los campos obligatorios del formulario
     * @returns {boolean} - True si todos los campos son válidos
     */
    validateForm() {
        console.log('📋 Validando formulario completo...');
        
        const form = document.getElementById('personForm');
        const inputs = form.querySelectorAll('input[required], select[required]');
        let isValid = true;
        let invalidFields = [];

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
                invalidFields.push(input.name);
            }
        });

        if (isValid) {
            console.log('✅ Formulario válido');
        } else {
            console.log('❌ Formulario inválido. Campos con errores:', invalidFields);
        }

        return isValid;
    },

    /**
     * Extrae y estructura los datos del formulario
     * @param {FormData} formData - Datos del formulario
     * @returns {Object} - Objeto con los datos del estudiante estructurados
     */
    extractStudentData(formData) {
        const student = {
            id: parseInt(formData.get('id')),
            name: formData.get('name').trim(),
            lastName: formData.get('lastName').trim(),
            bornPlace: formData.get('bornPlace').trim(),
            degree: formData.get('degree'),
            place: formData.get('place'),
            scoreAdmision: parseInt(formData.get('scoreAdmision'))
        };
        
        console.log('📦 Datos extraídos del formulario:', student);
        return student;
    },

    /**
     * Resetea el formulario a su estado inicial limpio
     * Remueve errores, mensajes de alerta y limpia todos los campos
     * @function
     */
    resetForm() {
        console.log('🔄 Reseteando formulario...');
        
        const form = document.getElementById('personForm');
        if (!form) return;
        
        // Limpiar todos los campos
        form.reset();
        
        // Remover todas las clases de error
        const errorGroups = form.querySelectorAll('.form-group.error');
        errorGroups.forEach(group => group.classList.remove('error'));
        
        // Remover todos los mensajes de alerta
        const alerts = document.querySelectorAll('.success-message, .error-alert');
        alerts.forEach(alert => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        });
        
        console.log('✅ Formulario reseteado correctamente');
    }
};

// Crear aliases globales para compatibilidad
const validateField = (field) => FormManager.validateField(field);
const validateForm = () => FormManager.validateForm();
const resetForm = () => FormManager.resetForm();

// ===============================================
// CAPA DE ACCESO A DATOS (API SERVICE)
// ===============================================

/**
 * Servicio centralizado para todas las operaciones con la API REST
 * Maneja la comunicación con el backend Spring Boot
 * @namespace ApiService
 */
const ApiService = {
    /**
     * Construye la URL completa para un endpoint específico
     * @private
     * @param {string} endpoint - Endpoint de la API
     * @param {Object} params - Parámetros de consulta (opcional)
     * @returns {string} - URL completa
     */
    buildUrl(endpoint, params = {}) {
        const url = new URL(API_BASE_URL + endpoint);
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                url.searchParams.append(key, params[key]);
            }
        });
        return url.toString();
    },

    /**
     * Procesa la respuesta del servidor manejando diferentes formatos
     * @private
     * @param {Response} response - Respuesta del fetch
     * @returns {Promise<Object|null>} - Datos procesados o null
     */
    async processResponse(response) {
        const responseText = await response.text();
        console.log('📄 Respuesta cruda del servidor:', responseText);
        
        if (!responseText.trim()) {
            console.log('⚠️ Respuesta vacía del servidor');
            return null;
        }
        
        try {
            return JSON.parse(responseText);
        } catch (parseError) {
            console.log('❌ Error al parsear JSON:', parseError);
            console.log('📄 Contenido que no se pudo parsear:', responseText);
            throw new Error(`Respuesta del servidor no es JSON válido: ${responseText}`);
        }
    },

    /**
     * Busca un estudiante por su ID en la base de datos
     * @param {number} id - ID único del estudiante
     * @returns {Promise<Object|null>} - Datos del estudiante encontrado o null si no existe
     * @throws {Error} - Si hay problemas de conexión o el servidor responde con error
     */
    async buscarEstudiantePorId(id) {
        // 🔧 NORMALIZAR ID para búsqueda (asegurar string)
        const normalizedId = String(id).trim();
        console.log('🔍 API: Buscando estudiante con ID:', normalizedId);
        
        try {
            const url = `${API_BASE_URL}${API_ENDPOINTS.SEARCH}?id=${normalizedId}`

            console.log('🌐 URL construida:', url);
            
            const response = await fetch(url);
                     
            console.log('📡 Status de búsqueda:', response.status);
            console.log('📡 Response OK:', response.ok);
            
            if (response.ok) {
                // SIMPLIFICADO: usar directamente response.json()
                const data = await response.json();
                console.log('✅ Estudiante encontrado (directo):', data);
                return data;
            } else if (response.status === 404) {
                console.log('ℹ️ Estudiante no encontrado (404)');
                return null;
            } else {
                const errorText = await response.text();
                console.log('❌ Error del servidor:', response.status, errorText);
                throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
            }
        } catch (fetchError) {
            console.error('❌ Error en búsqueda:', fetchError);
            throw new Error(`Error al buscar estudiante: ${fetchError.message}`);
        }
    },

    /**
     * Guarda un nuevo estudiante en la base de datos
     * @param {Object} student - Datos completos del estudiante a guardar
     * @returns {Promise<Object>} - Datos del estudiante guardado (con posibles cambios del servidor)
     * @throws {Error} - Si hay problemas de conexión o validación en el servidor
     */
    async guardarEstudiante(student) {
        console.log('💾 API: Guardando estudiante:', student);
        
        try {
            // 🔧 NORMALIZAR DATOS (asegurar tipos correctos)
            const normalizedStudent = {
                ...student,
                id: String(student.id),                    // Forzar ID como string
                scoreAdmision: parseInt(student.scoreAdmision) // Forzar score como number
            };
            console.log('📝 Datos normalizados:', normalizedStudent);
            
            // ⚡ VALIDACIÓN DE DUPLICADOS (antes de guardar)
            console.log('🔍 Verificando si ID ya existe...');
            const existingStudent = await this.buscarEstudiantePorId(normalizedStudent.id);
            if (existingStudent) {
                console.log('❌ Estudiante con este ID ya existe');
                throw new Error('El registro ya existe en la base de datos');
            }   
            const url = `${API_BASE_URL}${API_ENDPOINTS.SAVE}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(normalizedStudent)
            });
          
            console.log('📡 Status del registro:', response.status);
            
            if (response.ok) {
                const data = await this.processResponse(response);
                console.log('✅ Estudiante guardado exitosamente:', data);
                return data || normalizedStudent; // Devolver datos normalizados si la respuesta está vacía
            } else {
                const errorText = await response.text();
                console.log('❌ Error del servidor:', errorText);
                throw new Error(`Error al registrar: ${response.status} - ${errorText}`);
            }
        } catch (fetchError) {
            console.error('❌ Error en guardado:', fetchError);
            throw new Error(`Error al guardar estudiante: ${fetchError.message}`);
        }
    },

    /**
     * Elimina un estudiante por su ID de la base de datos
     * @param {number} id - ID del estudiante a eliminar
     * @returns {Promise<boolean>} - True si se eliminó exitosamente
     * @throws {Error} - Si hay problemas de conexión o el estudiante no existe
     */
    async eliminarEstudiantePorId(id) {
        console.log('🗑️ API: Eliminando estudiante con ID:', id);
        
        try {

            const url = `${API_BASE_URL}${API_ENDPOINTS.DELETE}?id=${id}`;
            
            const response = await fetch(url, {
                method: 'DELETE'
            });      
            console.log('📡 Status de eliminación:', response.status);
            
            if (response.ok) {
                console.log('✅ Estudiante eliminado exitosamente');
                return true;
            } else {
                const errorText = await response.text();
                console.log('❌ Error del servidor:', errorText);
                throw new Error(`Error al eliminar: ${response.status} - ${errorText}`);
            }
        } catch (fetchError) {
            console.error('❌ Error en eliminación:', fetchError);
            throw new Error(`Error al eliminar estudiante: ${fetchError.message}`);
        }
    },

    /**
     * Busca todos los estudiantes de un campus específico
     * @param {string} campus - Campus a buscar
     * @returns {Promise<Array>} - Array de estudiantes del campus
     * @throws {Error} - Si hay problemas de conexión
     */
    async buscarEstudiantesPorCampus(campus) {
        console.log('🏫 API: Buscando estudiantes del campus:', campus);
        
        try {

            const url = `${API_BASE_URL}${API_ENDPOINTS.CAMPUS_SEARCH}?campusUdea=${campus}`;
            console.log('🌐 URL construida:', url);
            
            const response = await fetch(url);
            console.log('📡 Status de búsqueda por campus:', response.status);
            
            if (response.ok) {
                const students = await response.json();
                console.log('✅ Estudiantes encontrados:', students);
                return Array.isArray(students) ? students : [students];
            } else {
                const errorText = await response.text();
                console.log('❌ Error del servidor:', errorText);
                throw new Error(`Error al buscar estudiantes: ${response.status} - ${errorText}`);
            }
        } catch (fetchError) {
            console.error('❌ Error en búsqueda por campus:', fetchError);
            throw new Error(`Error al buscar estudiantes por campus: ${fetchError.message}`);
        }
    }
};

// Crear aliases para compatibilidad con código existente
const buscarEstudiantePorId = (id) => ApiService.buscarEstudiantePorId(id);
const guardarEstudiante = (student) => ApiService.guardarEstudiante(student);
const eliminarEstudiantePorId = (id) => ApiService.eliminarEstudiantePorId(id);
const buscarEstudiantesPorCampus = (campus) => ApiService.buscarEstudiantesPorCampus(campus);

// ===============================================
// CONTROLADORES DE LÓGICA DE NEGOCIO
// ===============================================

/**
 * Controladores principales para las operaciones de estudiantes
 * @namespace StudentController
 */
const StudentController = {
    /**
     * Maneja el proceso completo de registro de un nuevo estudiante
     * Incluye validación, verificación de duplicados y guardado
     * @param {Event} e - Evento de envío del formulario
     * @async
     */
    async handleRegistration(e) {
        e.preventDefault();
        console.log('📝 Iniciando proceso de registro...');
        
        try {
            UiManager.showLoading(true);
            
            // 1. Validar formulario
            console.log('🔍 Validando formulario...');
            const isFormValid = FormManager.validateForm();
            console.log('📋 Resultado validación:', isFormValid);
            
            if (!isFormValid) {
                console.log('❌ Formulario inválido');
                UiManager.showAlert('Por favor, corrija los errores en el formulario', 'error');
                return;
            }
            console.log('✅ Formulario válido, continuando...');
            
            // 2. Extraer datos del formulario
            const formData = new FormData(e.target);
            const student = FormManager.extractStudentData(formData);
            
            // 3. Verificar si el estudiante ya existe
            console.log('🔍 Verificando duplicados...');
            const existeEstudiante = await ApiService.buscarEstudiantePorId(student.id);
            
            if (existeEstudiante) {
                UiManager.showAlert('⚠️ Ya existe un estudiante con este ID', 'error');
                return;
            }
            
            // 4. Guardar nuevo estudiante
            console.log('💾 Guardando nuevo estudiante...');
            await ApiService.guardarEstudiante(student);
            
            // 5. Mostrar éxito y resetear
            console.log('✅ Registro completado exitosamente');
            Navigation.showSuccessModal();
            FormManager.resetForm();
            
        } catch (error) {
            console.error('❌ Error en registro:', error);
            this.handleError(error);
        } finally {
            UiManager.showLoading(false);
        }
    },

    /**
     * Maneja la búsqueda y visualización de un estudiante por ID
     * @async
     */
    async handleSearch() {
        console.log('🔍 Iniciando búsqueda de estudiante...');
        
        const id = document.getElementById('consultaId').value.trim();
        
        // Validar ID ingresado (validación relajada)
        if (!id || id.trim() === '') {
            UiManager.showAlert('Por favor, ingrese un ID', 'error');
            return;
        }
        
        // Verificar que sea numérico
        if (isNaN(parseInt(id))) {
            UiManager.showAlert('El ID debe ser numérico', 'error');
            return;
        }

        try {
            console.log('🔄 Mostrando loading...');
            UiManager.showConsultaLoading(true);
            
            // Buscar estudiante
            console.log('🚀 Llamando a ApiService.buscarEstudiantePorId con ID:', parseInt(id));
            const student = await ApiService.buscarEstudiantePorId(parseInt(id));
            
            // Mostrar resultado
            UiManager.showSearchResult(student);
            
        } catch (error) {
            console.error('❌ Error en búsqueda:', error);
            UiManager.showSearchError('Error al realizar la consulta. Verifique la conexión con el servidor.');
        } finally {
            UiManager.showConsultaLoading(false);
        }
    },

    /**
     * Maneja la búsqueda de estudiantes por campus
     * @async
     */
    async handleCampusSearch() {
        console.log('🏫 Iniciando búsqueda de estudiantes por campus...');
        
        const campus = document.getElementById('consultaCampus').value;
        const sortBy = document.getElementById('sortBy').value;
        
        console.log('📊 Valores obtenidos:', { campus, sortBy });
        
        // Validar campus seleccionado
        if (!campus || campus.trim() === '') {
            UiManager.showAlert('Por favor, seleccione un campus', 'error');
            return;
        }

        try {
            console.log('🔄 Mostrando loading...');
            UiManager.showConsultaLoading(true);
            
            // Buscar estudiantes por campus
            console.log('🚀 Llamando a ApiService.buscarEstudiantesPorCampus con campus:', campus);
            let students = await ApiService.buscarEstudiantesPorCampus(campus);
            
            console.log('📋 Estudiantes obtenidos de la API:', students);
            console.log('📊 Tipo de dato:', Array.isArray(students) ? 'Array' : typeof students);
            console.log('📊 Longitud:', students.length);
            
            // Aplicar ordenamiento si se seleccionó una opción
            if (sortBy && sortBy !== 'default') {
                console.log(`🔄 Aplicando ordenamiento por: ${sortBy}`);
                students = this.sortStudents(students, sortBy);
                console.log(`✅ Estudiantes ordenados por: ${sortBy}`);
                console.log('📋 Estudiantes después del ordenamiento:', students);
                
                // Mostrar alerta temporal para confirmar ordenamiento
                UiManager.showAlert(`Resultados ordenados por ${sortBy === 'lastName' ? 'apellido' : 'carrera'}`, 'success');
            } else {
                console.log('ℹ️ No se aplicó ordenamiento (sortBy es default o vacío)');
            }
            
            // Mostrar resultados
            UiManager.showCampusResults(students, campus, sortBy);
            
        } catch (error) {
            console.error('❌ Error en búsqueda por campus:', error);
            UiManager.showSearchError('Error al realizar la consulta. Verifique la conexión con el servidor.');
        } finally {
            UiManager.showConsultaLoading(false);
        }
    },

    /**
     * Ordena un array de estudiantes según el criterio especificado
     * @param {Array} students - Array de estudiantes a ordenar
     * @param {string} sortBy - Criterio de ordenamiento ('lastName' o 'degree')
     * @returns {Array} - Array ordenado
     */
    sortStudents(students, sortBy) {
        console.log(`🔄 Ordenando ${students.length} estudiantes por: ${sortBy}`);
        console.log('📋 Array original:', students.map(s => ({ name: s.name, lastName: s.lastName, degree: s.degree })));
        
        // Crear una copia del array para no modificar el original
        const studentsCopy = [...students];
        console.log('📋 Copia creada:', studentsCopy.length, 'estudiantes');
        
        const sorted = studentsCopy.sort((a, b) => {
            let valueA, valueB;
            
            switch (sortBy) {
                case 'lastName':
                    valueA = (a.lastName || '').toLowerCase();
                    valueB = (b.lastName || '').toLowerCase();
                    console.log(`🔤 Comparando apellidos: "${valueA}" vs "${valueB}"`);
                    break;
                case 'degree':
                    valueA = (a.degree || '').toLowerCase();
                    valueB = (b.degree || '').toLowerCase();
                    console.log(`🎓 Comparando carreras: "${valueA}" vs "${valueB}"`);
                    break;
                default:
                    console.log('⚠️ Criterio de ordenamiento no reconocido');
                    return 0; // Sin cambios
            }
            
            if (valueA < valueB) {
                console.log(`⬅️ "${valueA}" viene antes que "${valueB}"`);
                return -1;
            }
            if (valueA > valueB) {
                console.log(`➡️ "${valueA}" viene después que "${valueB}"`);
                return 1;
            }
            console.log(`⚖️ "${valueA}" y "${valueB}" son iguales`);
            return 0;
        });
        
        console.log('📋 Array ordenado:', sorted.map(s => ({ name: s.name, lastName: s.lastName, degree: s.degree })));
        return sorted;
    },

    /**
     * Maneja la eliminación de un estudiante con confirmación
     * @param {number} id - ID del estudiante a eliminar
     * @async
     */
    async handleDeletion(id) {
        console.log('🗑️ Iniciando proceso de eliminación...');
        
        // Confirmación del usuario
        if (!confirm('¿Está seguro de que desea eliminar este estudiante?')) {
            console.log('❌ Eliminación cancelada por el usuario');
            return;
        }

        try {
            await ApiService.eliminarEstudiantePorId(id);
            
            console.log('✅ Eliminación completada exitosamente');
            Navigation.showDeleteSuccessModal();
            Navigation.closeModal();
            
        } catch (error) {
            console.error('❌ Error en eliminación:', error);
            UiManager.showAlert(`❌ Error: ${error.message}`, 'error');
        }
    },

    /**
     * Maneja errores de manera centralizada
     * @private
     * @param {Error} error - Error a manejar
     */
    handleError(error) {
        console.error('🚨 Manejando error:', error);
        
        // Verificar tipos específicos de error
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            UiManager.showAlert(
                '❌ No se puede conectar al servidor. Verifique que JSON Server esté ejecutándose en puerto 8081', 
                'error'
            );
        } else if (error.message.includes('CORS')) {
            UiManager.showAlert(
                '❌ Error de CORS. Verifique la configuración del servidor', 
                'error'
            );
        } else {
            UiManager.showAlert(`❌ Error: ${error.message}`, 'error');
        }
    }
};

// Crear aliases globales para compatibilidad con HTML
const handleSubmit = (e) => StudentController.handleRegistration(e);
const buscarPersona = () => StudentController.handleSearch();
const buscarPorCampus = () => StudentController.handleCampusSearch();
const eliminarEstudiante = (id) => StudentController.handleDeletion(id);

// ===============================================
// GESTIÓN DE INTERFAZ DE USUARIO (UI MANAGER)
// ===============================================

/**
 * Gestiona todos los aspectos visuales y de interacción de la aplicación
 * @namespace UiManager
 */
const UiManager = {
    /**
     * Controla la visibilidad del indicador de carga del formulario principal
     * @param {boolean} show - True para mostrar, false para ocultar
     */
    showLoading(show) {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = show ? 'block' : 'none';
            console.log(show ? '⏳ Mostrando indicador de carga' : '✅ Ocultando indicador de carga');
        }
    },

    /**
     * Controla la visibilidad del indicador de carga del modal de consulta
     * @param {boolean} show - True para mostrar, false para ocultar
     */
    showConsultaLoading(show) {
        const loadingElement = document.getElementById('consultaLoading');
        if (loadingElement) {
            loadingElement.style.display = show ? 'block' : 'none';
            console.log(show ? '⏳ Mostrando carga de consulta' : '✅ Ocultando carga de consulta');
        }
    },

    /**
     * Muestra una alerta temporal en el formulario de registro
     * @param {string} message - Mensaje a mostrar al usuario
     * @param {string} type - Tipo de alerta ('success' | 'error')
     */
    showAlert(message, type) {
        console.log(`🔔 Mostrando alerta ${type}: ${message}`);
        
        // Crear elemento de alerta
        const alertDiv = document.createElement('div');
        alertDiv.className = type === 'success' ? 'success-message' : 'error-alert';
        alertDiv.innerHTML = message;
        
        // Insertarlo en el DOM
        const form = document.getElementById('registroForm');
        if (form) {
            const targetElement = form.querySelector('form');
            if (targetElement) {
                form.insertBefore(alertDiv, targetElement);
                
                // Auto-remover después del timeout
                setTimeout(() => {
                    if (alertDiv.parentNode) {
                        alertDiv.parentNode.removeChild(alertDiv);
                        console.log('🗑️ Alerta removida automáticamente');
                    }
                }, CONFIG.ALERT_TIMEOUT);
            }
        }
    },

    /**
     * Muestra el resultado de una búsqueda de estudiante en el modal
     * @param {Object|null} student - Datos del estudiante encontrado o null si no existe
     */
    showSearchResult(student) {
        const resultadoDiv = document.getElementById('resultadoConsulta');
        if (!resultadoDiv) return;
        
        if (!student) {
            console.log('❌ Mostrando resultado: estudiante no encontrado');
            resultadoDiv.innerHTML = `
                <div class="error-alert">
                    ❌ No se encontró ningún estudiante con el ID especificado
                </div>
            `;
            return;
        }

        console.log('✅ Mostrando datos del estudiante encontrado');
        resultadoDiv.innerHTML = `
            <div class="result-card">
                <h4>✅ Estudiante Encontrado</h4>
                <div class="result-item">
                    <strong>ID:</strong> ${student.id || 'N/A'}
                </div>
                <div class="result-item">
                    <strong>Nombre:</strong> ${student.name || 'N/A'}
                </div>
                <div class="result-item">
                    <strong>Apellido:</strong> ${student.lastName || 'N/A'}
                </div>
                <div class="result-item">
                    <strong>Lugar de Nacimiento:</strong> ${student.bornPlace || 'N/A'}
                </div>
                <div class="result-item">
                    <strong>Carrera:</strong> ${student.degree || 'N/A'}
                </div>
                <div class="result-item">
                    <strong>Campus:</strong> ${student.place || 'N/A'}
                </div>
                <div class="result-item">
                    <strong>Puntaje de Admisión:</strong> ${student.scoreAdmision || 'N/A'}
                </div>
                <div class="result-actions" style="margin-top: 15px; text-align: center;">
                    <button class="submit-btn" onclick="eliminarEstudiante(${student.id})" 
                            style="background: #e74c3c; width: auto; padding: 10px 20px;">
                        🗑️ Eliminar Estudiante
                    </button>
                </div>
            </div>
        `;
    },

   /**
     * Muestra los resultados de una búsqueda por campus
     * @param {Array} students - Array de estudiantes encontrados
     * @param {string} campus - Nombre del campus consultado
     * @param {string} sortBy - Criterio de ordenamiento aplicado
     */
    showCampusResults(students, campus, sortBy = 'default') {
        const resultadoDiv = document.getElementById('resultadoConsulta');
        if (!resultadoDiv) return;
        
        if (!students || students.length === 0) {
            console.log('❌ No se encontraron estudiantes en el campus:', campus);
            resultadoDiv.innerHTML = `
                <div class="error-alert">
                    ❌ No se encontraron estudiantes en el campus ${campus}
                </div>
            `;
            return;
        }

        console.log(`✅ Mostrando ${students.length} estudiantes del campus ${campus}`);
        
        // Determinar el texto de ordenamiento
        let sortText = '';
        if (sortBy === 'lastName') {
            sortText = ' (ordenado por apellido)';
        } else if (sortBy === 'degree') {
            sortText = ' (ordenado por carrera)';
        }
        
        let studentsHtml = `
            <div class="campus-results">
                <h4>🏫 Estudiantes del Campus ${campus}${sortText}</h4>
                <p class="results-count">Total: ${students.length} estudiante(s)</p>
        `;
        
        students.forEach((student, index) => {
            studentsHtml += `
                <div class="student-list-item">
                    <div class="student-header">
                        <span class="student-number">#${index + 1}</span>
                        <span class="student-id">ID: ${student.id}</span>
                    </div>
                    <div class="student-info">
                        <strong>${student.name} ${student.lastName}</strong> - ${student.degree}<br>
                        <small>Lugar: ${student.bornPlace} | Puntaje: ${student.scoreAdmision}</small>
                    </div>
                </div>
            `;
        });
        
        studentsHtml += `</div>`;
        resultadoDiv.innerHTML = studentsHtml;
    },

    /**
     * Muestra un error en el área de resultados de búsqueda
     * @param {string} message - Mensaje de error a mostrar
     */
    showSearchError(message) {
        console.log('❌ Mostrando error de búsqueda:', message);
        
        const resultadoDiv = document.getElementById('resultadoConsulta');
        if (resultadoDiv) {
            resultadoDiv.innerHTML = `
                <div class="error-alert">
                    ❌ ${message}
                </div>
            `;
        }
    }
};

// Crear aliases globales para compatibilidad
const showLoading = (show) => UiManager.showLoading(show);
const showConsultaLoading = (show) => UiManager.showConsultaLoading(show);
const showAlert = (message, type) => UiManager.showAlert(message, type);
const mostrarResultadoConsulta = (student) => UiManager.showSearchResult(student);

// ===============================================
// INICIALIZACIÓN Y CONFIGURACIÓN DE EVENTOS
// ===============================================

/**
 * Gestiona la inicialización de la aplicación y configuración de eventos
 * @namespace AppInitializer
 */
const AppInitializer = {
    /**
     * Inicializa todos los componentes de la aplicación cuando el DOM está listo
     * Configura event listeners, validaciones y funcionalidades interactivas
     */
    init() {
        console.log('🚀 Iniciando aplicación SINJA...');
        
        this.setupFormHandlers();
        this.setupValidationHandlers();
        this.setupModalHandlers();
        this.setupKeyboardShortcuts();
        
        console.log('✅ Aplicación SINJA inicializada correctamente');
    },

    /**
     * Configura los manejadores principales del formulario de registro
     * @private
     */
    setupFormHandlers() {
        const form = document.getElementById('personForm');
        if (form) {
            form.addEventListener('submit', StudentController.handleRegistration);
            console.log('📝 Formulario de registro configurado');
        } else {
            console.warn('⚠️ No se encontró el formulario de registro');
        }
    },

    /**
     * Configura la validación en tiempo real de los campos del formulario
     * @private
     */
    setupValidationHandlers() {
        const inputs = document.querySelectorAll('#personForm input, #personForm select');
        
        inputs.forEach(input => {
            // Validar cuando el campo pierde el foco
            input.addEventListener('blur', function() {
                FormManager.validateField(this);
            });
            
            // Limpiar errores mientras el usuario escribe
            input.addEventListener('input', function() {
                const formGroup = this.parentNode;
                formGroup.classList.remove('error');
            });
        });
        
        console.log(`✅ Validación configurada para ${inputs.length} campos`);
    },

    /**
     * Configura los manejadores del modal de consulta
     * @private
     */
    setupModalHandlers() {
        // Configurar cierre del modal al hacer clic fuera
        const modal = document.getElementById('consultaModal');
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    Navigation.closeModal();
                }
            });
        }

        // Configurar el campo de consulta
        const consultaInput = document.getElementById('consultaId');
        if (consultaInput) {
            consultaInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    StudentController.handleSearch();
                }
            });
        }
        
        console.log('🔍 Modal de consulta configurado');
    },

    /**
     * Configura atajos de teclado para mejorar la experiencia del usuario
     * @private
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // ESC para cerrar modal
            if (e.key === 'Escape') {
                const modal = document.getElementById('consultaModal');
                if (modal && modal.style.display === 'block') {
                    Navigation.closeModal();
                }
            }
            
            // Ctrl/Cmd + Enter para enviar formulario
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                const form = document.getElementById('personForm');
                if (form && document.getElementById('registroForm').classList.contains('active')) {
                    form.dispatchEvent(new Event('submit'));
                }
            }
        });
        
        console.log('⌨️ Atajos de teclado configurados');
    }
};

// ===============================================
// PUNTO DE ENTRADA DE LA APLICACIÓN
// ===============================================

/**
 * Inicialización principal cuando el DOM está completamente cargado
 * Este es el punto de entrada de toda la aplicación
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM cargado completamente');
    
    try {
        // Inicializar la aplicación
        AppInitializer.init();
        
        // Mostrar información de la aplicación en consola
        console.log(`
            SISTEMA SINJA   
        `);
        
    } catch (error) {
        console.error('❌ Error crítico al inicializar la aplicación:', error);
        
        // Mostrar mensaje de error al usuario
        if (document.body) {
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #e74c3c;
                color: white;
                padding: 15px;
                border-radius: 5px;
                z-index: 9999;
                max-width: 300px;
            `;
            errorDiv.innerHTML = `
                <strong>Error de Inicialización</strong><br>
                La aplicación no pudo iniciarse correctamente.<br>
                Por favor, recargue la página.
            `;
            document.body.appendChild(errorDiv);
        }
    }
});

// ===============================================
// INFORMACIÓN DE DEPURACIÓN (SOLO EN DESARROLLO)
// ===============================================

/**
 * Funciones de ayuda para desarrollo y depuración
 * Estas funciones solo deben usarse en desarrollo
 */
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Exportar namespaces principales para debugging en consola
    window.SINJA_DEBUG = {
        ApiService,
        FormManager,
        Navigation,
        StudentController,
        UiManager,
        AppInitializer,
        validators,
        CONFIG
    };
    
    console.log('🛠️ Modo desarrollo activado. Use window.SINJA_DEBUG para debugging');
};