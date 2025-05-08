import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/AnalyticsStyles';
// Este componente sería para mostrar las estadísticas en cajas individuales
const StatBox = ({ title, value, icon, color }) => {
  return (
    <View style={styles.statBox}>
      <View style={styles.statHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={[styles.statValue, {color: color}]}>{value}</Text>
    </View>
  );
};

// Componente para mostrar la distribución de gastos por categoría
const CategoryDistribution = ({ categories }) => {
  return (
    <View style={styles.categoriesContainer}>
      <Text style={styles.sectionTitle}>Gasto promedio por categoría</Text>
      {categories.map((category, index) => (
        <View key={index} style={styles.categoryItem}>
          <View style={styles.categoryHeader}>
            <View style={[styles.categoryDot, {backgroundColor: category.color}]} />
            <Text style={styles.categoryName}>{category.name}</Text>
          </View>
          <Text style={styles.categoryValue}>${category.average}</Text>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                {width: `${category.percentage}%`, backgroundColor: category.color}
              ]} 
            />
          </View>
          <Text style={styles.categoryPercentage}>{category.percentage}%</Text>
        </View>
      ))}
    </View>
  );
};

const AnalyticsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  
  // Simular la carga de datos
  useEffect(() => {
    // Aquí se haría la petición a la API para obtener los datos reales
    // Por ahora usamos datos de ejemplo
    setTimeout(() => {
      setAnalyticsData({
        averageIncome: 1250.00,
        averageExpense: 850.00,
        savingsPercentage: 32,
        incomeExpenseRatio: 1.47,
        categories: [
          { name: 'Alimentación', average: 320, percentage: 38, color: '#FF6B6B' },
          { name: 'Transporte', average: 180, percentage: 21, color: '#4ECDC4' },
          { name: 'Entretenimiento', average: 150, percentage: 18, color: '#FFD166' },
          { name: 'Servicios', average: 120, percentage: 14, color: '#118AB2' },
          { name: 'Otros', average: 80, percentage: 9, color: '#073B4C' }
        ]
      });
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Cargando datos de análisis...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Análisis Financiero</Text>
        <Text style={styles.headerSubtitle}>Resumen de tus finanzas</Text>
      </View>

      <View style={styles.statsContainer}>
        <StatBox 
          title="Promedio de Ingresos" 
          value={`$${analyticsData.averageIncome}`} 
          icon="trending-up-outline" 
          color="#2E7D32"
        />
        <StatBox 
          title="Promedio de Gastos" 
          value={`$${analyticsData.averageExpense}`} 
          icon="trending-down-outline" 
          color="#C62828"
        />
      </View>

      <View style={styles.statsContainer}>
        <StatBox 
          title="Porcentaje de Ahorro" 
          value={`${analyticsData.savingsPercentage}%`} 
          icon="save-outline" 
          color="#1565C0"
        />
        <StatBox 
          title="Relación Ingresos/Gastos" 
          value={analyticsData.incomeExpenseRatio.toFixed(2)} 
          icon="swap-vertical-outline" 
          color={analyticsData.incomeExpenseRatio > 1 ? "#2E7D32" : "#C62828"}
        />
      </View>

      <CategoryDistribution categories={analyticsData.categories} />
    </ScrollView>
  );
};

export default AnalyticsScreen;
