// Clase Login para manejar el registro de usuarios
class Login {
  constructor() {
    // URL base del backend
    this.baseUrl = 'http://localhost:5000/api';
  }

  // Método para registrar un usuario
  async registrarUsuario(userData) {
    try {
      // Mostramos en consola los datos recibidos
      console.log('userData recibido:', userData);

      // Validaciones básicas: verificar que email, password y nombre no estén vacíos
      const validations = {
        email: userData?.email?.trim(),
        password: userData?.password?.trim(),
        nombre: userData?.nombre?.trim(),
      };

      // Verificamos si algún campo requerido está vacío
      const missingField = Object.entries(validations).find(
        ([, value]) => !value
      );

      // Si falta algún campo, lanzamos un error
      if (missingField) {
        throw new Error(`El campo ${missingField[0]} es requerido`);
      }

      // Construimos el payload que se enviará al backend
      const payload = {
        nombre: validations.nombre,
        email: validations.email,
        password: validations.password,
        direccion: userData.direccion?.trim() || '', // opcional
        telefono: userData.telefono?.trim() || '',   // opcional
        activo: true,                                 // usuario activo por defecto
        rol: "comprador",                             // rol fijo de comprador
      };

      // Mostramos el payload en consola
      console.log('Payload de registro:', payload);

      // Realizamos la petición POST al backend
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Obtenemos la respuesta en formato JSON
      const data = await response.json();

      // Mostramos la respuesta del servidor
      console.log('Respuesta del servidor:', {
        status: response.status,
        data,
      });

      // Si la respuesta no es OK, lanzamos un error
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Error en el registro');
      }

      // Retornamos objeto indicando éxito
      return {
        success: true,
        message: data.message || 'Usuario registrado exitosamente',
        data: data.usuario,
      };

    } catch (error) {
      // Capturamos cualquier error y lo mostramos en consola
      console.error('Error en registro:', error);
      return {
        success: false,
        error: error.message || 'Error al procesar el registro',
      };
    }
  }
}

// Creamos una instancia de la clase Login para exportarla
const loginInstance = new Login();
export default loginInstance;
