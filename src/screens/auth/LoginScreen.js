// src/screens/auth/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LoginStyles from '../../styles/LoginStyles';
import { useAuth } from '../../utils/context';

const LoginScreen = ({ navigation, setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError ] = useState(null);
  const { login } = useAuth(); //  Usar función del contexto

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, complete todos los campos');
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

      if (!response.ok) {
        const data = await response.json(); // Mover la obtención de datos fuera de la verificación
        console.error('Error de respuesta:', data); // Imprimir el error de respuesta
        setError(data.message || 'Error al iniciar sesión.'); // Mostrar mensaje de error
        return; // Salir si hay un error
      }

       const data = await response.json();
      login(data.token); // Llamar a la función login con el token recibido
      Alert.alert('Éxito', 'Inicio de sesión exitoso');
       setIsAuthenticated(true);
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setError('Error en el servidor. Inténtalo nuevamente más tarde.'); // Mensaje genérico para el usuario
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
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons 
              name={showPassword ? "eye-off-outline" : "eye-outline"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={LoginStyles.button}
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
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={LoginStyles.registerLink}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
