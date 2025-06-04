// src/screens/auth/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LoginStyles from '../../styles/LoginStyles'; // Asegúrate de que esta ruta sea correcta
import { useAuth } from '../../utils/context';

const LoginScreen = ({ navigation, setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Estado para mensajes de error
  const { login } = useAuth(); // Usar función del contexto

  const handleLogin = async () => {
    // Validaciones de frontend
    if (!email.trim() || !password.trim()) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    // Validación básica de formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, introduce un correo electrónico válido.');
      return;
    }

    setError(null); // Limpiar errores previos
    setLoading(true); // Iniciar estado de carga

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json(); // Siempre intenta parsear la respuesta para obtener el mensaje de error

      if (!response.ok) {
        console.error('Error de respuesta del servidor:', data);
        setError(data.message || 'Error al iniciar sesión. Credenciales incorrectas o problema del servidor.'); // Mensaje más descriptivo
        return;
      }

      login(data.token); // Llamar a la función login con el token recibido
      Alert.alert('Éxito', 'Inicio de sesión exitoso'); // Puedes mantener este Alert o eliminarlo si prefieres una transición silenciosa
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Error en la solicitud:', err);
      setError('No se pudo conectar con el servidor. Inténtalo nuevamente más tarde.'); // Mensaje genérico para problemas de red/servidor
    } finally {
      setLoading(false); // Finalizar estado de carga
    }
  };

  return (
    <View style={LoginStyles.container}>
      <View style={LoginStyles.logoContainer}>
        <Text style={LoginStyles.logoText}>Acciones & Gestión</Text>
        <Text style={LoginStyles.tagline}>Gestiona tus finanzas personales</Text>
      </View>

      <View style={LoginStyles.formContainer}>
        <Text style={LoginStyles.label}>Correo electrónico</Text>
        <View style={LoginStyles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={LoginStyles.icon} />
          <TextInput
            style={LoginStyles.input}
            placeholder="Ingresa tu correo"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading} // Deshabilitar durante la carga
          />
        </View>

        <Text style={LoginStyles.label}>Contraseña</Text>
        <View style={LoginStyles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={LoginStyles.icon} />
          <TextInput
            style={LoginStyles.input}
            placeholder="Ingresa tu contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!loading} // Deshabilitar durante la carga
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={loading}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Mensaje de error visible */}
        {error && (
          <View style={localStyles.errorMessageBox}>
            <Text style={localStyles.errorMessageText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[LoginStyles.button, loading && localStyles.disabledButton]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={LoginStyles.buttonText}>Iniciar sesión</Text>
          )}
        </TouchableOpacity>

        <View style={LoginStyles.registerContainer}>
          <Text style={LoginStyles.registerText}>¿No tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')} disabled={loading}>
            <Text style={LoginStyles.registerLink}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Estilos locales para el mensaje de error y botón deshabilitado
const localStyles = StyleSheet.create({
  errorMessageBox: {
    backgroundColor: '#ffe0e0', // Fondo rojo claro
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ff9999', // Borde rojo
    alignSelf: 'stretch', // Ocupa todo el ancho disponible
    alignItems: 'center',
  },
  errorMessageText: {
    color: '#D32F2F', // Texto rojo oscuro
    fontSize: 14,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.7, // Reduce la opacidad cuando el botón está deshabilitado
  },
});

export default LoginScreen;
