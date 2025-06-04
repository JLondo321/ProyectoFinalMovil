// src/screens/auth/RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RegisterStyles from '../../styles/RegisterStyles'; // Asegúrate de que esta ruta sea correcta

const RegisterScreen = ({ navigation }) => {
  const [nombre, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async () => {
    setErrorMessage(null); // Limpiar errores anteriores
    setSuccessMessage(''); // Limpiar mensajes anteriores de éxito

    // **Validaciones Front-end Mejoradas**

    // 1. Campos vacíos
    if (!nombre.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage('Por favor, complete todos los campos.');
      return;
    }

    // 2. Validación de formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Por favor, introduce un correo electrónico válido.');
      return;
    }

    // 3. Contraseñas no coinciden
    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    // 4. Validación de longitud y complejidad de contraseña (opcional, pero recomendado)
    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    
    // if (!/[A-Z]/.test(password)) { setErrorMessage('La contraseña debe incluir al menos una mayúscula.'); return; }
    // if (!/[0-9]/.test(password)) { setErrorMessage('La contraseña debe incluir al menos un número.'); return; }
    // if (!/[!@#$%^&*]/.test(password)) { setErrorMessage('La contraseña debe incluir al menos un carácter especial.'); return; }


    // **Lógica de Registro (Comunicación con el Backend)**
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          email,
          password,
        }),
      });

      const data = await response.json();
      console.log('DATA:', data);
      console.log('STATUS:', response.status);

      if (response.ok) { // response.ok es true para status 200-299
        setSuccessMessage(data.message || 'Tu cuenta ha sido creada correctamente.');

        // Retraso, limpieza de campos y navegación
        setTimeout(() => {
          setName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setSuccessMessage(''); // Opcional: limpiar el mensaje de éxito después de la navegación
          navigation.navigate('Login');
        }, 2000); // Espera 2 segundos (2000 milisegundos)
        
      } else {
        // Manejar errores específicos del backend
        setErrorMessage(data.message || 'No se pudo registrar el usuario. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      setErrorMessage('Hubo un problema al conectar con el servidor. Inténtalo más tarde.');
    }
  };

  return (
    <ScrollView style={RegisterStyles.container} contentContainerStyle={RegisterStyles.contentContainer}>
      <View style={RegisterStyles.headerContainer}>
        <TouchableOpacity
          style={RegisterStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={RegisterStyles.headerTitle}>Crear cuenta</Text>
      </View>

      <View style={RegisterStyles.formatContainer}>
        {/* Mensaje de Error General */}
        {errorMessage && (
          <View style={localStyles.errorContainer}>
            <Text style={localStyles.errorMessageText}>{errorMessage}</Text>
          </View>
        )}

        {/* Mensaje de Éxito General */}
        {successMessage && (
          <View style={localStyles.successContainer}>
            <Text style={localStyles.successMessageText}>{successMessage}</Text>
          </View>
        )}

        <Text style={RegisterStyles.label}>Nombre completo</Text>
        <View style={RegisterStyles.inputContainer}>
          <Ionicons name="person-outline" size={20} color='#666' style={RegisterStyles.icon} />
          <TextInput
            style={RegisterStyles.input}
            placeholder="Ingresa tu nombre"
            value={nombre}
            onChangeText={setName}
          />
        </View>

        <Text style={RegisterStyles.label}>Correo electrónico</Text>
        <View style={RegisterStyles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={RegisterStyles.icon} />
          <TextInput
            style={RegisterStyles.input}
            placeholder="Ingresa tu correo"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Text style={RegisterStyles.label}>Contraseña</Text>
        <View style={RegisterStyles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={RegisterStyles.icon} />
          <TextInput
            style={RegisterStyles.input}
            placeholder="Crea una contraseña"
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

        <Text style={RegisterStyles.label}>Confirmar contraseña</Text>
        <View style={RegisterStyles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={RegisterStyles.icon} />
          <TextInput
            style={RegisterStyles.input}
            placeholder="Confirma tu contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons
              name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={RegisterStyles.button}
          onPress={handleRegister}
        >
          <Text style={RegisterStyles.Button}>Registrarse</Text>
        </TouchableOpacity>

        <View style={RegisterStyles.loginContainer}>
          <Text style={RegisterStyles.loginText}>¿Ya tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={RegisterStyles.loginLink}>Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

// Estilos locales para los mensajes de error/éxito (se mantienen los mismos)
const localStyles = StyleSheet.create({
  errorContainer: {
    backgroundColor: '#ffe0e0', // Rojo claro
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ff9999',
  },
  errorMessageText: {
    color: '#D32F2F', // Rojo oscuro
    fontSize: 14,
    textAlign: 'center',
  },
  successContainer: {
    backgroundColor: '#e0ffe0', // Verde claro
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#99ff99',
  },
  successMessageText: {
    color: '#2E7D32', // Verde oscuro
    fontSize: 14,
    textAlign: 'center',
  },
});


export default RegisterScreen;