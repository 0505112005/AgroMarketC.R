import { useState } from "react";
import axios from "../axiosConfig";


const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/login", form); // Corrección aquí
      localStorage.setItem("token", res.data.token);
      alert("Inicio de sesión exitoso");
    } catch (err) {
      alert(err.response?.data?.mensaje || "Error al iniciar sesión");
    }
  };

  return (
    <div>
      <h1>Agro Verde es una página en donde podrás encontrar productos alimenticios agricolas de nuestro Cantón</h1>

      <div class="row justify-content-center">
        <div class="col-sm-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">ERES PRODUCTOR?</h5>
              <p class="card-text">...</p>
              <a href="#" class="btn btn-primary">LOGIN</a>
              <button type="button" class="btn btn-warning">Registarse</button>
            </div>
          </div>
        </div>

        <div class="col-sm-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">USUARIO</h5>
              <p class="card-text">...</p>
              <a href="#" class="btn btn-primary">LOGIN</a>
              <button type="button" class="btn btn-warning">Registarse</button>
            </div>
          </div>
        </div>
      </div>


      
      
      <h4>Esta es la página de Inicio</h4>

    </div>
  )
};

export default Login;
