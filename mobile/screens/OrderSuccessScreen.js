import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function OrderSuccessScreen({ route, navigation }) {
  const { orderId } = route.params;
  return (
    <View style={styles.screen}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>Order Placed Successfully 🎉</Text>
      <Text style={{ marginTop: 8 }}>Order ID: {orderId}</Text>
      <Text style={{ color: '#777', textAlign: 'center', marginTop: 8 }}>
        You'll see full order details and the GST invoice once your order is delivered.
      </Text>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.popToTop()}>
        <Text style={{ color: 'white' }}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#F7F2EB' },
  btn: { marginTop: 20, backgroundColor: '#8B9A6E', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
});
