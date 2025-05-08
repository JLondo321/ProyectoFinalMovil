import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Alert,Modal, ActivityIndicator} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/CategoriesStyles';

const CategoriesScreen = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Colores para las categorías
  const categoryColors = [
    '#4CAF50', '#2196F3', '#FFC107', '#FF5722', '#9C27B0', 
    '#3F51B5', '#009688', '#795548', '#607D8B', '#E91E63'
  ];

  useEffect(() => {
    // Simular la carga de categorías desde el backend
    loadCategories();
  }, []);

  const loadCategories = () => {
    setLoading(true);
    // Esta función se conectaría con el backend
    // Por ahora, usamos datos de prueba
    setTimeout(() => {
      setCategories([
        { id: '1', name: 'Comida', color: categoryColors[0] },
        { id: '2', name: 'Transporte', color: categoryColors[1] },
        { id: '3', name: 'Ocio', color: categoryColors[2] },
        { id: '4', name: 'Vivienda', color: categoryColors[3] },
        { id: '5', name: 'Servicios', color: categoryColors[4] },
      ]);
      setLoading(false);
    }, 1000);
  };

  const addCategory = () => {
    if (newCategory.trim() === '') {
      Alert.alert('Error', 'El nombre de la categoría no puede estar vacío');
      return;
    }

    // Verificar si la categoría ya existe
    if (categories.some(cat => cat.name.toLowerCase() === newCategory.toLowerCase())) {
      Alert.alert('Error', 'Esta categoría ya existe');
      return;
    }

    // Asignar un color aleatorio
    const randomColor = categoryColors[Math.floor(Math.random() * categoryColors.length)];
    
    // Crear la nueva categoría
    const newCategoryObj = { 
      id: Date.now().toString(), 
      name: newCategory,
      color: randomColor
    };

    // Aquí se enviaría la solicitud al backend
    // Por ahora, solo actualizamos el estado local
    setCategories([...categories, newCategoryObj]);
    setNewCategory('');
    setModalVisible(false);
  };

  const deleteCategory = (id) => {
    Alert.alert(
      'Eliminar Categoría',
      '¿Estás seguro de que quieres eliminar esta categoría?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => {
            // Aquí se enviaría la solicitud al backend
            // Por ahora, solo actualizamos el estado local
            setCategories(categories.filter(cat => cat.id !== id));
          },
          style: 'destructive',
        },
      ],
    );
  };

  const renderCategoryItem = ({ item }) => (
    <View style={styles.categoryItem}>
      <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
      <Text style={styles.categoryName}>{item.name}</Text>
      <TouchableOpacity onPress={() => deleteCategory(item.id)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={24} color="#FF5722" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categorías</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>Añadir</Text>
          <Ionicons name="add-circle" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#2E7D32" style={styles.loader} />
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          style={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay categorías. ¡Añade una!</Text>
          }
        />
      )}

      {/* Modal para añadir nueva categoría */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Nueva Categoría</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de la categoría"
              value={newCategory}
              onChangeText={setNewCategory}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => {
                  setModalVisible(false);
                  setNewCategory('');
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonAdd]}
                onPress={addCategory}
              >
                <Text style={styles.buttonText}>Añadir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CategoriesScreen;
