class Login {
  constructor() {
    this.baseUrl = 'http://localhost:5000/api';
  }

  async registrarUsuario(userData) {
    try {
      const validations = {
        email: userData?.email?.trim(),
        password: userData?.password?.trim(),
        nombre: userData?.nombre?.trim()
      };

      const missingField = Object.entries(validations).find(
        ([, value]) => !value
      );

      if (missingField) {
        throw new Error(`El campo ${missingField[0]} es requerido`);
      }

      const payload = {
        nombre: validations.nombre,
        email: validations.email,
        password: validations.password,
        rol: userData.rol || "cliente",
        direccion: userData.direccion?.trim() || '',
        telefono: userData.telefono?.trim() || '',
        activo: true
      };

      console.log('Payload de registro:', payload);

      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', {
        status: response.status,
        data
      });

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Error en el registro');
      }

      return {
        success: true,
        message: data.message || 'Usuario registrado exitosamente',
        data: data.usuario
      };

    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        error: error.message || 'Error al procesar el registro'
      };
    }
  }
}


const loginInstance = new Login();
export default loginInstance;
