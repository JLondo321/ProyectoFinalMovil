import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TransactionStyles from '../../styles/TransactionStyles';

// Datos de ejemplo 
const categories = [
  { id: 1, name: 'Alimentación', icon: 'fast-food-outline', color: '#FF9800' },
  { id: 2, name: 'Vivienda', icon: 'home-outline', color: '#2196F3' },
  { id: 3, name: 'Transporte', icon: 'car-outline', color: '#9C27B0' },
  { id: 4, name: 'Entretenimiento', icon: 'film-outline', color: '#F44336' },
  { id: 5, name: 'Salud', icon: 'medical-outline', color: '#4CAF50' },
  { id: 6, name: 'Trabajo', icon: 'briefcase-outline', color: '#607D8B' },
  { id: 7, name: 'Otros', icon: 'apps-outline', color: '#795548' },
];

const TransactionScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [isIncome, setIsIncome] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [note, setNote] = useState('');

  const handleSave = () => {
    // Validación básica
    if (!title.trim()) {
      Alert.alert('Error', 'Por favor ingresa un título');
      return;
    }

    if (!amount.trim() || isNaN(parseFloat(amount))) {
      Alert.alert('Error', 'Por favor ingresa un monto válido');
      return;
    }

    if (!selectedCategory) {
      Alert.alert('Error', 'Por favor selecciona una categoría');
      return;
    }

    // Aquí se guardaría la transacción
    Alert.alert(
      'Éxito',
      'Transacción guardada correctamente',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  return (
    <View style={TransactionStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Tipo de transacción (Ingreso/Egreso) */}
        <View style={TransactionStyles.typeContainer}>
          <Text style={TransactionStyles.typeLabel}>Tipo de transacción</Text>
          <View style={TransactionStyles.typeSwitchContainer}>
            <Text style={[
              TransactionStyles.typeText,
              isIncome ? TransactionStyles.activeType : null
            ]}>Ingreso</Text>
            <Switch
              value={isIncome}
              onValueChange={setIsIncome}
              trackColor={{ false: '#D32F2F', true: '#2E7D32' }}
              thumbColor="#fff"
            />
            <Text style={[
              TransactionStyles.typeText,
              !isIncome ? TransactionStyles.activeType : null
            ]}>Egreso</Text>
          </View>
        </View>
        
        {/* Monto */}
        <View style={TransactionStyles.inputContainer}>
          <Text style={TransactionStyles.label}>Monto</Text>
          <View style={TransactionStyles.amountInputContainer}>
            <Text style={TransactionStyles.currencySymbol}>$</Text>
            <TextInput
              style={TransactionStyles.amountInput}
              placeholder="0"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>
        </View>
        
        {/* Título */}
        <View style={TransactionStyles.inputContainer}>
          <Text style={TransactionStyles.label}>Título</Text>
          <TextInput
            style={TransactionStyles.input}
            placeholder="Ej: Salario, Compra supermercado"
            value={title}
            onChangeText={setTitle}
          />
        </View>
        
        {/* Categorías */}
        <View style={TransactionStyles.categoryContainer}>
          <Text style={TransactionStyles.label}>Categoría</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={TransactionStyles.categoryScrollContent}
          >
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  TransactionStyles.categoryItem,
                  selectedCategory?.id === category.id ? 
                    { backgroundColor: `${category.color}20`, borderColor: category.color } : null
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <View 
                  style={[
                    TransactionStyles.categoryIconContainer, 
                    { backgroundColor: category.color }
                  ]}
                >
                  <Ionicons name={category.icon} size={18} color="#fff" />
                </View>
                <Text 
                  style={[
                    TransactionStyles.categoryText,
                    selectedCategory?.id === category.id ? { color: category.color } : null
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Nota */}
        <View style={TransactionStyles.inputContainer}>
          <Text style={TransactionStyles.label}>Nota (opcional)</Text>
          <TextInput
            style={[TransactionStyles.input, TransactionStyles.noteInput]}
            placeholder="Agregar una nota o descripción"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
          />
        </View>
      </ScrollView>
      
      {/* Botón guardar */}
      <TouchableOpacity 
        style={TransactionStyles.saveButton}
        onPress={handleSave}
      >
        <Text style={TransactionStyles.saveButtonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TransactionScreen;