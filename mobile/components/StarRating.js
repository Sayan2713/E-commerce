import { View, Text } from 'react-native';

export default function StarRating({ value = 0, size = 14 }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Text key={s} style={{ fontSize: size, color: s <= Math.round(value) ? '#E8A33D' : '#DDD' }}>★</Text>
      ))}
    </View>
  );
}
