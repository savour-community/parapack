import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, TouchableOpacity, Appearance } from 'react-native';
import { Button } from 'react-native-ui-lib';
import { Props } from 'react-native-ui-lib/src/components/button/ButtonTypes';
import Icon from 'react-native-vector-icons/FontAwesome';
interface DAppProps {
  navigation?: any;
  mode?: string;
}
const SubmitScreen = (props: DAppProps) => {
  const colorScheme = Appearance.getColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const Onreview = () => {
    props?.navigation.navigate('Review');
  };
  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      <View style={styles.iconContainer}>
        <Icon name="check-circle" size={150} color="blue" />
      </View>
      <Text style={styles.fonttext}>提交成功</Text>

      <Text style={styles.texts}>审核通过后, 会以邮件形式通知</Text>
      <TouchableOpacity style={[styles.button, { backgroundColor: 'blue' }]} onPress={() => Onreview()}>
        <Text style={[styles.buttonText, { color: isDarkMode ? 'white' : '#fff' }]}>取消申请</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 50,
  },
  button: {
    width: '80%',
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  fonttext: {
    fontSize: 18,
  },
  texts: {
    fontSize: 12,
    marginBottom: 350,
  },
});

export default SubmitScreen;
