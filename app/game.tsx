import { Text, View } from 'react-native';

export default function GamePage() {
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <Text style={{ color: '#fff', textAlign: 'center', marginTop: 100 }}>
        Game Canvas — MnemonicEngine
      </Text>
      {/* TODO: Wire up Skia canvas, tile renderer, camera, etc. */}
    </View>
  );
}
