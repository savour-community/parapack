import IconFont from '@assets/iconfont';
import LayoutNormal from '@components/LayoutNormal';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { makeStyles } from '@rneui/base';
import Activity from '@screen/Activity';
import Asset from '@screen/Asset';
import { DAppScreen } from "@screen/DApp";
import Swap from '@screen/Swap';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StatusBar, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
const Screen1 = () => {
  return <Text>11111</Text>;
};
const Screen2 = () => {
  return <Text>22222</Text>;
};
const BAR = [
  {
    icon: 'shengtaidianjiqian',
    title: 'ecology',
  },
  {
    icon: 'huodongdianjiqian',
    title: 'activity',
  },
  {
    icon: 'duihuandianjiqian',
    title: 'swap',
  },
  {
    icon: 'liaotiandianjiqian',
    title: 'chat',
  },
  {
    icon: 'zichandianjiqian',
    title: 'asset',
  },
];
const App = (props: any) => {
  const mode = useColorScheme() || 'light';
  const { t } = useTranslation();
  // 获取传递的参数
  const tab = props.route.params?.tab || 'ecology';
  const styles = useStyles(props);

  const renderScreen = (prop: any) => {
    switch (tab) {
      case 'ecology':
        return <DAppScreen {...props} />;
      case 'activity':
        return <Activity {...props} />;
      case 'swap':
        return <Swap {...props} />;
      case 'chat':
        return <Screen2 {...props} />;
      case 'asset':
        return <Asset {...props} />;
      default:
        return null;
    }
  };

  return (
    <>
      <StatusBar
        backgroundColor={mode === 'light' ? DefaultTheme.colors.background : DarkTheme.colors.background} // 替换为你想要的背景颜色
        barStyle={`${mode === 'light' ? 'dark' : 'light'}-content`} // 替换为你想要的图标和文字颜色
      />
      <LayoutNormal
        fixedStyle={styles.bottom}
        containerStyle={styles.container}
        fixedChildren={
          <View style={styles.bar}>
            {BAR.map((item) => {
              const color = tab !== item.title ? '#C9C9C9' : '#3B28CC';
              return (
                <TouchableOpacity
                  style={styles.barItem}
                  key={item.title}
                  onPress={() => props.navigation.navigate('home', { tab: item.title })}
                >
                  {/* <Icon name={item.icon} size={15} color={color} /> */}
                  <IconFont name={item.icon} color={color} />
                  <Text
                    style={{
                      ...styles.title,
                      color,
                    }}
                  >
                    {t(`common.${item.title}`)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        }
      >
        {renderScreen(props)}
      </LayoutNormal>
    </>
  );
};
const useStyles = makeStyles((theme) => {
  return {
    container: {
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
    bottom: {
      height: 50,
      position: 'relative',
      top: -30,
    },
    bar: {
      height: 80,
      flexDirection: 'row',
      paddingHorizontal: 0,
      paddingVertical: 11,
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: 24, // 左上角边框半径
      borderTopRightRadius: 24, // 右上角边框半径
      borderBottomRightRadius: 0, // 右下角边框半径
      borderBottomLeftRadius: 0, // 左下角边框半径
      ...Platform.select({
        ios: {
          shadowColor: 'black',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.6,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    barItem: { flex: 1, alignItems: 'center' },
    title: {
      color: '#C9C9C9',
      fontSize: 10,
      marginTop: 4,
    },
  };
});
export default App;
