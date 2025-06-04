import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import TransactionStyles from '../../styles/TransactionStyles';
import { useAuth } from '../../utils/context';

const TransactionScreen = ({ navigation }) => {
  const { token, refreshUser } = useAuth();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [isIncome, setIsIncome] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [note, setNote] = useState('');
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchCategories = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/users/user', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al cargar categorías');
          }
          const data = await response.json();
          // Asegurarse de que el backend envía 'id_categoria' y 'nombre'
          setCategories(data.categorias);
        } catch (error) {
          setErrorMessage(error.message);
          console.error('Error fetching categories:', error);
        }
      };

      fetchCategories();
      // Limpiar mensajes y estados al enfocarse en la pantalla nuevamente
      setErrorMessage(null);
      setSuccessMessage('');
      setIsSaving(false);
      // Limpiar campos también al volver a la pantalla para una experiencia limpia
      setTitle('');
      setAmount('');
      setIsIncome(false);
      setSelectedCategory(null); // Esto es importante si la categoría puede haber sido seleccionada previamente
      setNote('');

    }, [token])
  );

  const handleSave = async () => {
    setErrorMessage(null);
    setSuccessMessage('');
    setIsSaving(true);

    // **Validaciones Front-end**
    if (!title.trim()) {
      setErrorMessage('Por favor ingresa un título para la transacción.');
      setIsSaving(false);
      return;
    }

    if (!amount.trim() || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setErrorMessage('Por favor ingresa un monto válido y mayor que cero.');
      setIsSaving(false);
      return;
    }

    if (!selectedCategory) {
      setErrorMessage('Por favor selecciona una categoría para la transacción.');
      setIsSaving(false);
      return;
    }

    // *** VALIDACIÓN ELIMINADA:
    // const tipoTransaccion = isIncome ? 'ingreso' : 'egreso';
    // const categoriaSeleccionadaCorrecta = categories.find(
    //   cat => cat.id_categoria === selectedCategory.id_categoria && cat.tipo_transaccion === tipoTransaccion
    // );
    // if (!categoriaSeleccionadaCorrecta) {
    //   setErrorMessage('La categoría seleccionada no coincide con el tipo de transacción.');
    //   setIsSaving(false);
    //   return;
    // }
    // *** FIN DE VALIDACIÓN ELIMINADA ***


    try {
      const response = await fetch('http://localhost:3000/api/transactions/transacciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo: title.trim(),
          monto: parseFloat(amount),
          tipo_transaccion: isIncome ? 'ingreso' : 'egreso',
          id_categoria: selectedCategory.id_categoria, // Se usa directamente la ID de la categoría seleccionada
          nota: note.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar la transacción');
      }

      setSuccessMessage('Transacción guardada exitosamente.');
      await refreshUser();

      // Limpiar campos y programar navegación con retraso
      setTitle('');
      setAmount('');
      setIsIncome(false); // Resetea el switch a su estado inicial
      setSelectedCategory(null);
      setNote('');

      setTimeout(() => {
        setSuccessMessage('');
        navigation.goBack();
      }, 2500);

    } catch (error) {
      setErrorMessage(error.message);
      console.error('Error saving transaction:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // *** LÓGICA DE FILTRADO DE CATEGORÍAS ELIMINADA ***
  // const filteredCategories = categories.filter(
  //   cat => cat.tipo_transaccion === (isIncome ? 'ingreso' : 'egreso')
  // );
  // *** FIN DE LÓGICA DE FILTRADO ELIMINADA ***

  return (
    <View style={TransactionStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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

        {/* Tipo de transacción (Ingreso/Egreso) */}
        <View style={TransactionStyles.typeContainer}>
          <Text style={TransactionStyles.typeLabel}>Tipo de transacción</Text>
          <View style={TransactionStyles.typeSwitchContainer}>
            <Text style={[TransactionStyles.typeText, isIncome ? TransactionStyles.activeType : null]}>Ingreso</Text>
            <Switch
              value={isIncome}
              onValueChange={(value) => {
                setIsIncome(value);
                // No es necesario resetear selectedCategory si las categorías son las mismas para ambos tipos
                // setSelectedCategory(null); // Se comenta o elimina si las categorías son universales
              }}
              trackColor={{ false: '#D32F2F', true: '#2E7D32' }}
              thumbColor="#fff"
              disabled={isSaving}
            />
            <Text style={[TransactionStyles.typeText, !isIncome ? TransactionStyles.activeType : null]}>Egreso</Text>
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
              editable={!isSaving}
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
            editable={!isSaving}
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
            {/* Ahora se mapean TODAS las categorías directamente, ya que no se filtran por tipo */}
            {categories.length > 0 ? (
              categories.map(category => (
                <TouchableOpacity
                  key={category.id_categoria}
                  style={[
                    TransactionStyles.categoryItem,
                    selectedCategory?.id_categoria === category.id_categoria
                      ? { backgroundColor: `${category.color}20`, borderColor: category.color }
                      : null,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                  disabled={isSaving}
                >
                  <View
                    style={[TransactionStyles.categoryIconContainer, { backgroundColor: category.color }]}
                  >
                    <Ionicons name={category.icono} size={18} color="#fff" />
                  </View>
                  <Text
                    style={[
                      TransactionStyles.categoryText,
                      selectedCategory?.id_categoria === category.id_categoria ? { color: category.color } : null,
                    ]}
                  >
                    {category.nombre}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={localStyles.noCategoriesText}>No hay categorías disponibles.</Text>
            )}
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
            editable={!isSaving}
          />
        </View>
      </ScrollView>

      {/* Botón guardar */}
      <TouchableOpacity
        style={[TransactionStyles.saveButton, isSaving && localStyles.disabledButton]}
        onPress={handleSave}
        disabled={isSaving}
      >
        <Text style={TransactionStyles.saveButtonText}>
          {isSaving ? 'Guardando...' : 'Guardar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos locales para los mensajes de error/éxito y botón deshabilitado
const localStyles = StyleSheet.create({
  errorContainer: {
    backgroundColor: '#ffe0e0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ff9999',
  },
  errorMessageText: {
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
  },
  successContainer: {
    backgroundColor: '#e0ffe0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#99ff99',
  },
  successMessageText: {
    color: '#2E7D32',
    fontSize: 14,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  noCategoriesText: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    color: '#666',
    fontSize: 14,
  },
});

export default TransactionScreen;