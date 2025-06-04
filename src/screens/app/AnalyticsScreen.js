import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../utils/context';
import AnalyticsStyles from '../../styles/AnalyticsStyles'; // Asegúrate de que esta ruta sea correcta

// Componente auxiliar para las barras de progreso de categoría
const CategoryProgressBar = ({ name, amount, percentage, color }) => {
  const progressWidth = percentage ? `${Math.min(parseFloat(percentage), 100)}%` : '0%';

  return (
    <View style={AnalyticsStyles.categoryItem}>
      <View style={AnalyticsStyles.categoryHeader}>
        <Text style={AnalyticsStyles.categoryName}>{name}</Text>
        <Text style={AnalyticsStyles.categoryAmount}>${amount}</Text>
      </View>
      <View style={AnalyticsStyles.progressBarBackground}>
        <View style={[AnalyticsStyles.progressBarFill, { width: progressWidth, backgroundColor: color || '#2196F3' }]} />
      </View>
      <Text style={AnalyticsStyles.categoryPercentage}>{percentage}%</Text>
    </View>
  );
};

const AnalyticsScreen = () => {
  const { token } = useAuth();
  const [promedios, setPromedios] = useState(null);
  const [categorias, setCategorias] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const [promediosRes, categoriasRes] = await Promise.all([
            fetch('http://localhost:3000/api/analytics/promedios', {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch('http://localhost:3000/api/analytics/categorias', {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          if (!promediosRes.ok || !categoriasRes.ok) {
            throw new Error('Error al cargar los datos de análisis');
          }

          const promediosData = await promediosRes.json();
          const categoriasData = await categoriasRes.json();

          // Asegúrate de que 'promediosData' sea un array y tomas el primer elemento
          setPromedios(promediosData?.[0]); 
          setCategorias(categoriasData);
        } catch (error) {
          console.error(error);
          Alert.alert('Error', error.message);
        }
      };

      fetchData();
    }, [token])
  );

  if (!promedios) {
    return (
      <View style={AnalyticsStyles.container}>
        <Text style={AnalyticsStyles.loadingText}>Cargando análisis...</Text>
      </View>
    );
  }

  const egresos = categorias.filter(c => c.tipo_transaccion === 'egreso');
  // Si quieres mostrar los ingresos por categoría con el mismo formato, puedes descomentar:
  const ingresos = categorias.filter(c => c.tipo_transaccion === 'ingreso');

  // Función segura para mostrar números con dos decimales
  const formatNumber = (num) => {
    const n = Number(num);
    return isNaN(n) ? '0.00' : n.toFixed(2);
  };

  // Para porcentaje que podría ser null o string
  const formatPercentage = (num) => {
    const n = Number(num);
    // Asegurarse de que el porcentaje se muestre como un número entre 0 y 100
    return isNaN(n) ? '0' : Math.max(0, Math.min(100, n)).toFixed(0); // Redondea para el porcentaje visual
  };

  return (
    <ScrollView style={AnalyticsStyles.container} showsVerticalScrollIndicator={false}>
      {/* Título del período */}
      <Text style={AnalyticsStyles.headerText}>Análisis del periodo: {promedios.periodo}</Text>

      {/* Fila de tarjetas superiores */}
      <View style={AnalyticsStyles.cardRow}>
        {/* Promedio de Ingresos */}
        <View style={AnalyticsStyles.card}>
          <Ionicons name="cash-outline" size={24} color="#2E7D32" style={AnalyticsStyles.cardIcon} />
          <Text style={AnalyticsStyles.cardTitle}>Promedio de Ingresos</Text>
          <Text style={[AnalyticsStyles.cardValue, AnalyticsStyles.cardValueGreen]}>
            ${formatNumber(promedios.ingresos_mes)}
          </Text>
        </View>

        {/* Promedio de Gastos */}
        <View style={AnalyticsStyles.card}>
          <Ionicons name="cart-outline" size={24} color="#D32F2F" style={AnalyticsStyles.cardIcon} />
          <Text style={AnalyticsStyles.cardTitle}>Promedio de Gastos</Text>
          <Text style={[AnalyticsStyles.cardValue, AnalyticsStyles.cardValueRed]}>
            ${formatNumber(promedios.egresos_mes)}
          </Text>
        </View>
      </View>

      {/* Segunda fila de tarjetas */}
      <View style={AnalyticsStyles.cardRow}>
        {/* Porcentaje de Ahorro */}
        <View style={AnalyticsStyles.card}>
          <Ionicons name="piggy-bank-outline" size={24} color="#03A9F4" style={AnalyticsStyles.cardIcon} />
          <Text style={AnalyticsStyles.cardTitle}>Porcentaje de Ahorro</Text>
          <Text style={[AnalyticsStyles.cardValue, AnalyticsStyles.cardValueBlue]}>
            {formatPercentage(promedios.porcentaje_ahorro)}%
          </Text>
        </View>

        {/* Relación Ingresos/Gastos */}
        <View style={AnalyticsStyles.card}>
          <Ionicons name="stats-chart-outline" size={24} color="#757575" style={AnalyticsStyles.cardIcon} />
          <Text style={AnalyticsStyles.cardTitle}>Relación Ingresos/Gastos</Text>
          <Text style={[AnalyticsStyles.cardValue, AnalyticsStyles.cardValueDefault]}>
            {formatNumber(promedios.relacion_ingreso_egreso)}
          </Text>
        </View>
      </View>

      {/* Gastos promedio por categoría */}
      <View style={AnalyticsStyles.categorySection}>
        <Text style={AnalyticsStyles.categorySectionTitle}>
          <Ionicons name="folder-outline" size={20} color="#757575" style={{ marginRight: 5 }} />
          Gasto promedio por categoría
        </Text>
        {egresos.map((cat) => (
          <CategoryProgressBar
            key={cat.id_categoria}
            name={cat.nombre_categoria}
            amount={formatNumber(cat.monto_total)}
            percentage={formatPercentage(cat.porcentaje)}
            color={cat.color}
          />
        ))}
      </View>

      {/* Si quieres mostrar los ingresos por categoría con el mismo formato, puedes descomentar esto: */}
      { <View style={AnalyticsStyles.categorySection}>
        <Text style={AnalyticsStyles.categorySectionTitle}>
          <Ionicons name="folder-outline" size={20} color="#757575" style={{ marginRight: 5 }} />
          Ingresos promedio por categoría
        </Text>
        {ingresos.map((cat) => (
          <CategoryProgressBar
            key={cat.id_categoria}
            name={cat.nombre_categoria}
            amount={formatNumber(cat.monto_total)}
            percentage={formatPercentage(cat.porcentaje)}
            color={cat.color}
          />
        ))}
      </View>}

    </ScrollView>
  );
};


export default AnalyticsScreen;
