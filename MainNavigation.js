import React, {useState} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 

// Screens - Auth
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';

//Screens - App
import DashBoardScreen from './src/screens/app/DashBoardScreen';
import TransactionScreen from './src/screens/app/TransactionScreen';
import TransactionListScreen from './src/screens/app/TransactionListScreen';
import CategoriesScreen from './src/screens/app/CategoriesScreen';
import AnalyticsScreen from './src/screens/app/AnalyticsScreen';

//Navegadores
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

//tabNavigator
const BottomTabNavigator = () => {
    return (
     <Tab.Navigator
       screenOptions = {({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
           let iconName;

        if(route.name === 'Dashboard'){
            iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Transacciones'){
            iconName = focused ? 'cash' : 'cash-outline';
        } else if (route.name === 'Análisis'){
            iconName = focused ? 'pie-chart' : 'pie-chart-outline';
        }
         return <Ionicons name={iconName} size={size} color={color}/>;
        },
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: 'gray',
       })}
    >
      <Tab.Screen
      name="Dashboard"
      component={DashBoardScreen}
      options={{headerShown:false}}
      />
      <Tab.Screen
      name="Transacciones"
      component={TransactionListScreen}
      options={{headerShown:false}}
      />
      <Tab.Screen
      name="Análisis"
      component={AnalyticsScreen}
      options={{headerShown:false}}
      />
   </Tab.Navigator>
    );
};

// Componente de la pantalla de cierre de sesión
const LogoutScreen = ({ navigation, setIsAuthenticated }) => {
  const handleLogout = () => {
    // Aquí iría la lógica para cerrar sesión (limpiar tokens, etc.)
    setIsAuthenticated(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cerrar Sesión</Text>
      <Text style={styles.message}>¿Estás seguro que deseas cerrar sesión?</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.logoutButton]} 
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AppDrawerNavigator = ({ setIsAuthenticated }) => {
  const navigation = useNavigation();

  const goToHomeButton = () => (
    <TouchableOpacity onPress={() => navigation.navigate('AppDrawer', { screen: 'Inicio' })} style={{ marginRight: 15 }}>
      <Ionicons name="home-outline" size={24} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2E7D32',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerActiveTintColor: '#2E7D32',
      }}
    >
      <Drawer.Screen
        name="Inicio"
        component={BottomTabNavigator}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Nueva Transacción"
        component={TransactionScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="add-circle-outline" size={22} color={color} />
          ),
          headerRight: goToHomeButton,
        }}
      />
      <Drawer.Screen
        name="Categorías"
        component={CategoriesScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="list-outline" size={22} color={color} />
          ),
          headerRight: goToHomeButton,
        }}
      />
      <Drawer.Screen
        name="Cerrar Sesión"
        children={(props) => (
          <LogoutScreen {...props} setIsAuthenticated={setIsAuthenticated} />
        )}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="log-out-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

//Main Navigation
const MainNavigation = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return(
   <Stack.Navigator screenOptions={{headerShown: false}}>
   {!isAuthenticated ? (
    //Auth Stack
    <>
     <Stack.Screen 
       name="Login" 
       children={(props) => <LoginScreen {...props} setIsAuthenticated={setIsAuthenticated} />} 
     />
     <Stack.Screen name="Register" component={RegisterScreen}/>
    </>
   ) : (
    //App Stack
    <Stack.Screen 
      name="AppDrawer" 
      children={(props) => <AppDrawerNavigator {...props} setIsAuthenticated={setIsAuthenticated} />}
    />
    )}
</Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 120,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  logoutButton: {
    backgroundColor: '#C62828',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default MainNavigation;