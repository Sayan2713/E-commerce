import { View, TouchableOpacity, Text } from 'react-native';

export default function StarPicker({ value, onChange, size = 30 }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <TouchableOpacity key={s} onPress={() => onChange(s)}>
          <Text style={{ fontSize: size, color: s <= value ? '#E8A33D' : '#DDD' }}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
