import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import CategoryScreen from '../screens/CategoryScreen';
import ProductScreen from '../screens/ProductScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderSuccessScreen from '../screens/OrderSuccessScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { SavedItemsScreen, ChangePasswordScreen, PoliciesScreen } from '../screens/StubScreens';
import { ContactScreen, AboutScreen } from '../screens/ContactAboutScreens';
import EditProfileScreen from '../screens/EditProfileScreen';
import DeleteAccountScreen from '../screens/DeleteAccountScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const stackScreenOptions = { headerStyle: { backgroundColor: '#8B9A6E' }, headerTintColor: 'white' };

// Home tab carries its own stack for product/category/checkout screens.
// Login is no longer nested here - the hard login wall in App.js means this
// navigator only ever renders once the user is authenticated.
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'ClothStore' }} />
      <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} />
      <Stack.Screen name="Category" component={CategoryScreen} options={({ route }) => ({ title: route.params?.name || 'Category' })} />
      <Stack.Screen name="Product" component={ProductScreen} options={{ title: 'Product' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} options={{ title: 'Order Placed', headerBackVisible: false }} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ title: 'Profile' }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="SavedItems" component={SavedItemsScreen} options={{ title: 'Saved Items' }} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: 'Change Password' }} />
      <Stack.Screen name="Policies" component={PoliciesScreen} options={{ title: 'Legal & Policies' }} />
      <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} options={{ title: 'Delete Account' }} />
    </Stack.Navigator>
  );
}

// Bottom tabs = the 4 nav items from the spec: Home, Contact Us, About Us, Profile.
// Guest browsing is allowed everywhere; Buy Now / Save / account actions redirect
// to Login from within the screen itself (same rule as the web navbar).
export default function AppNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#8B9A6E' }}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Contact" component={ContactScreen} options={{ title: 'Contact Us' }} />
      <Tab.Screen name="About" component={AboutScreen} options={{ title: 'About Us' }} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}
