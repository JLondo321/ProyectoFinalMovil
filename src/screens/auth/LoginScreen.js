// src/screens/auth/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LoginStyles from '../../styles/LoginStyles';


const LoginScreen = ({ navigation, setIsAuthenticated }) => { //Hacer el cambio a JWT
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, complete todos los campos');
      return;
    }
    
    // En una implementación real, aquí irían las llamadas a la API para autenticación
    
    // Simulación de error de credenciales:
    if (email !== 'test@example.com' || password !== 'password') {
      Alert.alert('Error', 'Correo o contraseña incorrecta');
      return;
    }
    
    // Si todo es correcto, navegar a la pantalla principal
    // En un proyecto real, se establecería un token de autenticación
    
    Alert.alert('Éxito', 'Inicio de sesión exitoso');
    setIsAuthenticated(true);
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
        >
          <Text style={LoginStyles.buttonText}>Iniciar sesión</Text>
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