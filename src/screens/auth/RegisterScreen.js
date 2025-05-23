// src/screens/auth/RegisterScreen.js
import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RegisterStyles from '../../styles/RegisterStyles';


const RegisterScreen =({navigation}) => {
  const [nombre, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState('');

 
  const handleRegister = async (e) => {
  e.preventDefault();
    setError(null); // Limpiar errores
    setMensajeExito(''); // Limpiar mensajes anteriores

  //validaciones
  if (!nombre || !email || !password || !confirmPassword) {
    Alert.alert('Error', 'Por favor, complete todos los campos');
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert('Error', 'Las contraseñas no coinciden');
    return;
  }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar el correo
    if (!emailRegex.test(email)) {
      setError('Por favor, introduce un correo electrónico válido.');
      return;
    }

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

   if (response.status === 200 || response.status === 201) {
  Alert.alert('Registro Exitoso', data.message || 'Tu cuenta ha sido creada correctamente');
  navigation.navigate('Login'); // navegar inmediatamente después

} else {
  Alert.alert('Error', data.message || 'No se pudo registrar el usuario');
}
  } catch (error) {
    console.error('Error en el registro:', error);
    Alert.alert('Error', 'Hubo un problema al conectar con el servidor');
  }
};

  
return(
  <ScrollView style ={RegisterStyles.container}>
    <View style ={RegisterStyles.headerContainer}>
      <TouchableOpacity
      style={RegisterStyles.backButton}
      onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#333"/>
      </TouchableOpacity>
      <Text style ={RegisterStyles.headerTitle}>Crear cuenta</Text>
    </View>

    <View style= {RegisterStyles.formatContainer}>
      <Text style= {RegisterStyles.label}>Nombre completo</Text>
      <View style= {RegisterStyles.inputContainer}>
        <Ionicons name="person-outline" size={20} color='#666' style={RegisterStyles.icon}/>
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

export default RegisterScreen;
