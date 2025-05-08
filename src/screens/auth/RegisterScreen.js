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
 
  const handleRegister = () => {
    if (!nombre || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor, complete todos los campos');
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
  
    // Si todo está bien, mostramos el mensaje de éxito
    Alert.alert(
      'Registro Exitoso',
      'Tu cuenta ha sido creada correctamente',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login')
        }
      ]
    );
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
