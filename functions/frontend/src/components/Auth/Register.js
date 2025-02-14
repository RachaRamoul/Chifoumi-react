import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "../../styles/register.css";
import { FaUser, FaLock } from "react-icons/fa";
import React from 'react';


const Register = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    try {
      const response = await fetch("https://chifoumi.kmarques.dev/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (!data.token) {
          console.error("🚨 Erreur : le token n'est pas présent !");
          return;
        }

        login(data.token);
        alert("Inscription réussie !");
        navigate("/matches");
      } else {
        setError(data.message || "Nom d'utilisateur déjà pris !");
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
      setError("Erreur réseau, veuillez réessayer.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="logo-circle">
            <img
              src="/src/assets/trophy-icon.png"
              alt=""
              className=""
            />
          </div>
          <h1 className="register-title">Inscription au Chifoumi</h1>
        </div>
        <form onSubmit={handleSubmit} className="register-form">
          {error && <p className="error">{error}</p>}
          <div className="form-group">
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input
                type="text"
                id="username"
                name="username"
                className="form-input"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nom d'utilisateur"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mot de passe"
                required
              />
            </div>
          </div>
          <button type="submit" className="form-btn">S'inscrire</button>
        </form>
        <p className="login-link">
          Déjà un compte ? <a href="/login">Se connecter</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
