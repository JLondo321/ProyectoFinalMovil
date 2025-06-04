import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Alert, Modal, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../utils/context';
import CategoriesStyles from '../../styles/CategoriesStyles';

const CategoriesScreen = () => {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [loading, setLoading] = useState(false); // Para la carga inicial de categorías
  const [isAddingCategory, setIsAddingCategory] = useState(false); // Para el botón de añadir
  const [isDeletingCategory, setIsDeletingCategory] = useState(false); // Nuevo: para el botón de eliminar
  const [modalVisible, setModalVisible] = useState(false); // Modal de creación
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // NUEVOS ESTADOS PARA EL MODAL DE CONFIRMACIÓN DE ELIMINACIÓN
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [categoryToDeleteId, setCategoryToDeleteId] = useState(null);

  const categoryColors = [
    '#4CAF50', '#2196F3', '#FFC107', '#FF5722', '#9C27B0',
    '#3F51B5', '#009688', '#795548', '#607D8B', '#E91E63',
    '#FF9800', '#8BC34A', '#00BCD4', '#CDDC39', '#FFEB3B',
    '#F44336', '#673AB7', '#03A9F4', '#FFCDD2', '#B2DFDB'
  ];

  const iconOptions = [
    'apps-outline', 'fast-food-outline', 'home-outline', 'car-outline',
    'film-outline', 'medical-outline', 'briefcase-outline', 'restaurant-outline',
    'basket-outline', 'book-outline', 'bulb-outline', 'heart-outline',
    'leaf-outline', 'paw-outline', 'gift-outline', 'cash-outline',
    'cafe-outline', 'cart-outline', 'beer-outline', 'bicycle-outline'
  ];

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
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
      setCategories(data.categorias);
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
      // Limpiar mensajes y estados al enfocarse en la pantalla nuevamente
      setErrorMessage(null);
      setSuccessMessage(null);
      setIsAddingCategory(false);
      setIsDeletingCategory(false); // También limpiar este estado
      // Asegurarse de que el modal de creación esté cerrado y sus campos limpios
      setModalVisible(false);
      setNewCategoryName('');
      setSelectedColor(null);
      setSelectedIcon(null);
      // Asegurarse de que el modal de eliminación esté cerrado y su ID limpiado
      setShowDeleteConfirmationModal(false);
      setCategoryToDeleteId(null);
    }, [fetchCategories])
  );

  const addCategory = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!newCategoryName.trim()) {
      setErrorMessage('Por favor, ingresa un nombre para la categoría.');
      return;
    }
    if (!selectedColor) {
      setErrorMessage('Por favor, selecciona un color para la categoría.');
      return;
    }
    if (!selectedIcon) {
      setErrorMessage('Por favor, selecciona un icono para la categoría.');
      return;
    }

    setIsAddingCategory(true);
    try {
      const res = await fetch('http://localhost:3000/api/categorias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: newCategoryName.trim(),
          color: selectedColor,
          icono: selectedIcon
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Error al crear la categoría.');
      }

      setSuccessMessage('Categoría creada exitosamente.');
      setNewCategoryName('');
      setSelectedColor(null);
      setSelectedIcon(null);
      setModalVisible(false);

      setTimeout(() => {
        fetchCategories();
        setSuccessMessage(null);
      }, 1500);

    } catch (e) {
      setErrorMessage(e.message);
      console.error('Error adding category:', e);
    } finally {
      setIsAddingCategory(false);
    }
  };

  // NUEVA FUNCIÓN: Abre el modal de confirmación de eliminación
  const confirmDelete = (id) => {
    setCategoryToDeleteId(id);
    setShowDeleteConfirmationModal(true);
  };

  // FUNCIÓN EXISTENTE MODIFICADA: Ahora se llama desde el modal de confirmación
  const deleteCategory = async () => {
    if (!categoryToDeleteId) return; // Asegurarse de que hay un ID para eliminar

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsDeletingCategory(true); // Deshabilitar el botón de eliminar del modal

    try {
      const url = `http://localhost:3000/api/categorias/${categoryToDeleteId}`;
      console.log('URL de eliminación:', url);

      const res = await fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'No se pudo eliminar la categoría.');
      }

      setSuccessMessage('Categoría eliminada exitosamente.');
      setShowDeleteConfirmationModal(false); // Cierra el modal de confirmación
      setCategoryToDeleteId(null); // Limpia el ID a eliminar

      setTimeout(() => {
        fetchCategories();
        setSuccessMessage(null);
      }, 1500);

    } catch (e) {
      setErrorMessage(e.message);
      console.error('Error deleting category:', e);
    } finally {
      setIsDeletingCategory(false); // Habilitar el botón de eliminar del modal
    }
  };

  const renderCategoryItem = ({ item }) => {
    return (
      <View style={CategoriesStyles.categoryItem}>
        <View style={[CategoriesStyles.colorIndicator, { backgroundColor: item.color }]} />
        <Ionicons name={item.icono} size={24} color={item.color} style={CategoriesStyles.categoryIcon} />
        <Text style={CategoriesStyles.categoryName}>{item.nombre}</Text>
        <TouchableOpacity
          onPress={() => confirmDelete(item.id_categoria)} // Llama a la nueva función de confirmación
          style={CategoriesStyles.deleteButton}
          disabled={isDeletingCategory} // Deshabilitar si otra eliminación está en curso
        >
          <Ionicons name="trash-outline" size={24} color="#FF5722" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={CategoriesStyles.container}>
      <View style={CategoriesStyles.header}>
        <Text style={CategoriesStyles.title}>Categorías</Text>
        <TouchableOpacity style={CategoriesStyles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Mensaje de Error General */}
      {errorMessage && !modalVisible && !showDeleteConfirmationModal && ( // Solo muestra si no hay modales abiertos
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

      {loading ? (
        <ActivityIndicator size="large" color="#2E7D32" style={CategoriesStyles.loader} />
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id_categoria.toString()}
          ListEmptyComponent={<Text style={CategoriesStyles.emptyText}>No hay categorías</Text>}
          contentContainerStyle={categories.length === 0 ? { flexGrow: 1, justifyContent: 'center' } : null}
        />
      )}

      {/* Modal para Crear Categoría */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity style={CategoriesStyles.centeredView} activeOpacity={1} onPressOut={() => {
            if (!isAddingCategory) { // Solo cierra si no está en proceso de añadir
                setModalVisible(false);
                setNewCategoryName('');
                setSelectedColor(null);
                setSelectedIcon(null);
                setErrorMessage(null);
            }
        }}>
          <View style={CategoriesStyles.modalView} onStartShouldSetResponder={() => true}>
            <Text style={CategoriesStyles.modalTitle}>Nueva Categoría</Text>
            {errorMessage && modalVisible && (
                <View style={localStyles.errorContainerModal}>
                    <Text style={localStyles.errorMessageText}>{errorMessage}</Text>
                </View>
            )}

            <TextInput
              placeholder="Nombre de la categoría"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              style={CategoriesStyles.input}
              editable={!isAddingCategory}
            />

            <Text style={CategoriesStyles.label}>Color</Text>
            <TouchableOpacity
              style={[CategoriesStyles.dropdown, { backgroundColor: selectedColor || '#eee' }]}
              onPress={() => setShowColorPicker(true)}
              disabled={isAddingCategory}
            >
              <Text style={[CategoriesStyles.dropdownText, !selectedColor && { color: '#999' }]}>{selectedColor || 'Seleccionar color'}</Text>
              <Ionicons name="chevron-down-outline" size={16} color="#333" />
            </TouchableOpacity>

            <Modal visible={showColorPicker} transparent animationType="fade" onRequestClose={() => setShowColorPicker(false)}>
              <TouchableOpacity style={CategoriesStyles.pickerOverlay} onPress={() => setShowColorPicker(false)} />
              <View style={CategoriesStyles.pickerModal}>
                <ScrollView contentContainerStyle={CategoriesStyles.pickerGrid}>
                  {categoryColors.map(color => (
                    <TouchableOpacity
                      key={color}
                      style={[CategoriesStyles.pickerColor, { backgroundColor: color }, selectedColor === color && localStyles.selectedColorOption]}
                      onPress={() => { setSelectedColor(color); setShowColorPicker(false); }}
                    />
                  ))}
                </ScrollView>
              </View>
            </Modal>

            <Text style={CategoriesStyles.label}>Icono</Text>
            <TouchableOpacity
              style={CategoriesStyles.dropdown}
              onPress={() => setShowIconPicker(true)}
              disabled={isAddingCategory}
            >
              {selectedIcon ? <Ionicons name={selectedIcon} size={20} color="#333" /> : <Text style={CategoriesStyles.dropdownText}>Seleccionar icono</Text>}
              <Ionicons name="chevron-down-outline" size={16} color="#333" />
            </TouchableOpacity>

            <Modal visible={showIconPicker} transparent animationType="fade" onRequestClose={() => setShowIconPicker(false)}>
              <TouchableOpacity style={CategoriesStyles.pickerOverlay} onPress={() => setShowIconPicker(false)} />
              <View style={CategoriesStyles.pickerModal}>
                <ScrollView contentContainerStyle={CategoriesStyles.pickerGridIcons}>
                  {iconOptions.map(icon => (
                    <TouchableOpacity
                      key={icon}
                      style={[CategoriesStyles.pickerIcon, selectedIcon === icon && CategoriesStyles.selectedOption]}
                      onPress={() => { setSelectedIcon(icon); setShowIconPicker(false); }}
                    >
                      <Ionicons name={icon} size={24} color={selectedIcon === icon ? '#fff' : '#333'} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </Modal>

            <View style={CategoriesStyles.modalButtons}>
              <TouchableOpacity
                style={[CategoriesStyles.button, CategoriesStyles.buttonCancel]}
                onPress={() => {
                  setModalVisible(false);
                  setNewCategoryName('');
                  setSelectedColor(null);
                  setSelectedIcon(null);
                  setErrorMessage(null);
                }}
                disabled={isAddingCategory}
              >
                <Text style={CategoriesStyles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[CategoriesStyles.button, CategoriesStyles.buttonAdd, isAddingCategory && localStyles.disabledButton]}
                onPress={addCategory}
                disabled={isAddingCategory}
              >
                <Text style={CategoriesStyles.buttonText}>
                  {isAddingCategory ? 'Añadiendo...' : 'Añadir'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* NUEVO: Modal de Confirmación de Eliminación */}
      <Modal
        visible={showDeleteConfirmationModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!isDeletingCategory) { // Solo cierra si no está en proceso de eliminación
            setShowDeleteConfirmationModal(false);
            setCategoryToDeleteId(null);
          }
        }}
      >
        <TouchableOpacity
          style={CategoriesStyles.centeredView} // Reutiliza el estilo del modal existente
          activeOpacity={1}
          onPressOut={() => {
            if (!isDeletingCategory) { // Solo cierra si no está en proceso de eliminación
              setShowDeleteConfirmationModal(false);
              setCategoryToDeleteId(null);
            }
          }}
        >
          <View style={localStyles.deleteConfirmationModalView} onStartShouldSetResponder={() => true}>
            <Text style={localStyles.deleteConfirmationTitle}>Eliminar Categoría</Text>
            <Text style={localStyles.deleteConfirmationMessage}>
              ¿Estás seguro que deseas eliminar esta categoría? Esta acción no se puede deshacer.
            </Text>
            {isDeletingCategory && (
              <ActivityIndicator size="small" color="#2E7D32" style={{ marginVertical: 10 }} />
            )}
            <View style={localStyles.deleteConfirmationButtonContainer}>
              <TouchableOpacity
                style={[localStyles.deleteConfirmationButton, localStyles.deleteConfirmationCancelButton]}
                onPress={() => {
                  if (!isDeletingCategory) {
                    setShowDeleteConfirmationModal(false);
                    setCategoryToDeleteId(null);
                  }
                }}
                disabled={isDeletingCategory}
              >
                <Text style={localStyles.deleteConfirmationCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[localStyles.deleteConfirmationButton, localStyles.deleteConfirmationDeleteButton, isDeletingCategory && localStyles.disabledButton]}
                onPress={deleteCategory} // Llama a la función de eliminación real
                disabled={isDeletingCategory}
              >
                <Text style={localStyles.deleteConfirmationDeleteButtonText}>
                  {isDeletingCategory ? 'Eliminando...' : 'Eliminar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// Estilos locales para los mensajes de error/éxito y botón deshabilitado
const localStyles = StyleSheet.create({
  errorContainer: {
    backgroundColor: '#ffe0e0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ff9999',
    marginHorizontal: 20,
  },
  errorContainerModal: {
    backgroundColor: '#ffe0e0',
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ff9999',
    alignSelf: 'stretch',
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
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#99ff99',
    marginHorizontal: 20,
  },
  successMessageText: {
    color: '#2E7D32',
    fontSize: 14,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  selectedColorOption: {
    borderWidth: 2,
    borderColor: '#333',
  },
  // NUEVOS ESTILOS PARA EL MODAL DE CONFIRMACIÓN DE ELIMINACIÓN
  deleteConfirmationModalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%', // Ajusta el ancho del modal
    maxHeight: '80%', // Ajusta la altura máxima
  },
  deleteConfirmationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  deleteConfirmationMessage: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
  },
  deleteConfirmationButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  deleteConfirmationButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  deleteConfirmationCancelButton: {
    backgroundColor: '#ccc',
  },
  deleteConfirmationDeleteButton: {
    backgroundColor: '#FF5722', // Color de peligro para eliminar
  },
  deleteConfirmationCancelButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteConfirmationDeleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CategoriesScreen;