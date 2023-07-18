import { darkColors, lightColors } from '@rneui/base';
// 定义一个扩展了 Colors 类型的自定义类型
export type CustomColors = typeof defineTheme;
const customTheme = {
  primary: '#3B28CC',
  success: '#48AE60',
  // purple: '#D7D7FA',
  // purple1: '#CDCEEE',
  // purple2: '#F8F8FF',
  // primary: '#000000',
};

export const defineTheme = {
  // dark 模式下的样式定义
  darkColors: {
    ...darkColors,
    // ...Platform.select({
    //   default: darkColors.platform.android,
    //   ios: darkColors.platform.ios,
    // }),
    ...customTheme,
    purple: 'rgba(215, 215, 250, 0.45)',
    purple1: '#CDCEEE',
    purple2: '#F8F8FF',
    purpleBg: 'rgba(230, 227, 253, 0.45)',
    grey: '#141414',
    greyTitle: 'rgba(67, 67, 67, 0.45)',
  },
  lightColors: {
    ...lightColors,
    // ...Platform.select({
    //   default: lightColors.platform.android,
    //   ios: lightColors.platform.ios,
    // }),
    ...customTheme,
    purple: 'rgba(215, 215, 250, 1)',
    purple1: '#CDCEEE',
    purple2: '#F8F8FF',
    purpleBg: 'rgba(230, 227, 253, 1)',
    grey: 'rgba(245, 245, 245, 1)',
    greyTitle: 'rgba(67, 67, 67, 1)',
  },
  components: {
    Button: {
      radius: 6, // 自定义圆角大小
      titleStyle: {
        lineHeight: 20,
      },
    },
    Input: {
      containerStyle: {
        paddingHorizontal: 0,
      },
      // inputStyle: {
      //   paddingHorizontal: 100,
      // },
      labelStyle: {
        fontWeight: 'bold',
        lineHeight: 22,
        fontSize: 16,
        marginBottom: 6,
        paddingLeft: 7,
        color: 'greyTitle',
      },
      inputContainerStyle: {
        height: 58,
        paddingHorizontal: 12,
        borderRadius: 9,
        borderWidth: 1,
        // borderColor: '#D7D7FA',
        // backgroundColor: '#F8F8FF',
        borderColor: 'purple',
        backgroundColor: 'background',
      },
    },
  },
  mode: 'light',
};
