import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import { Avatar, Button, Image, Tab, TabView, Text, makeStyles } from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';
import Layout from '@components/LayoutNormal';
import { AddressBalanceParams, TransferRecordParams, getAddressBalance, transferRecord } from '@api/wallet';
import { getUniqueId } from 'react-native-device-info';
import { getSymbolKline } from '@api/symbol';
import { LineChart } from 'react-native-chart-kit';
import moment from 'moment';
import { getActivity } from '@api/home';
import { getData } from '@common/utils/storage';
type Props = {
  fullWidth?: boolean;
  navigation: any;
  route: any;
};

const chartConfig = {
  backgroundColor: '#F5F5FF',
  backgroundGradientFrom: '#F5F5FF',
  backgroundGradientTo: '#F5F5FF',
  // backgroundGradientFrom: 'RGBA(171, 159, 241, 1)',
  // backgroundGradientTo: 'RGBA(93, 76, 215, 1)',
  decimalPlaces: 0,
  yAxisLabel: '$',
  yAxisSuffix: 'k',
  // yAxisInterval: 100,
  color: (opacity = 1) => `rgba(171, 159, 241, ${opacity})`,
  style: {
    // verticalLines: {
    //   strokeWidth: 0,
    //   strokeDasharray: [4, 4], // 设置虚线样式
    //   stroke: 'rgba(0, 0, 0, 0.5)',
    // },
    // horizontalLines: {
    //   strokeWidth: 0,
    //   strokeDasharray: [4, 4], // 设置虚线样式
    //   stroke: 'rgba(0, 0, 0, 0.5)',
    // },
    // axisLineColor: 'red', // 坐标轴线的颜色
    // axisLineWidth: 2, // 坐标轴线的宽度
    // 其他样式属性
  },
};
const TokenDetail = (props: Props) => {
  const [activity, setActivity] = useState<Record<string, any>>({});
  const [index, setIndex] = useState(0);
  const [kLine, setKLine] = useState<{ labels: string[]; datasets: any[] }>({
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  });
  const [addressBalance, setAddressBalance] = useState<any>();
  const [tokenInfo, setTokenInfo] = useState<Record<string, any>>({});
  const [record, setRecord] = useState<any>({
    [-1]: {
      loading: false,
      data: {},
    },
    0: {
      loading: false,
      data: {},
    },
    1: {
      loading: false,
      data: {},
    },
  });
  const styles = useStyles(props);
  const { width } = Dimensions.get('window');
  const initData = useCallback(async () => {
    const { contract_addr: contract_address, ...rest } = tokenInfo?.tokenDetail || {};
    const res = await getAddressBalance({
      wallet_uuid: tokenInfo?.wallet_uuid,
      device_id: tokenInfo?.device_id,
      ...rest,
      contract_address,
    } as AddressBalanceParams);
    if (res.data) {
      setAddressBalance(res.data || {});
    }
    console.log(1111, res, {
      wallet_uuid: tokenInfo?.wallet_uuid,
      device_id: tokenInfo?.device_id,
      ...rest,
      contract_address,
    });
  }, [tokenInfo]);

  const initKLine = useCallback(async () => {
    //TODO 接口不通
    const res = await getSymbolKline({
      symbol: tokenInfo?.tokenDetail?.symbol as string,
    });
    if (res.data) {
      const currentKLine = (res.data.kline || []).filter((item, index) => index < 10);
      setKLine({
        labels: currentKLine.map((item) => moment(item.time).format('ss')) as string[],
        datasets: [
          {
            data: currentKLine.map((item) => Number(item.price)) as number[],
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // 设置折线颜色
          },
        ],
      });
    }
  }, [tokenInfo]);

  const getTransferRecord = useCallback(
    async (type: number) => {
      setRecord((prev: any) => {
        return {
          ...prev,
          [type]: {
            ...prev[type],
            loading: true,
          },
        };
      });
      const { chain, contract_addr: contractAddr, symbol, address } = tokenInfo?.tokenDetail || {};
      const params: TransferRecordParams = {
        chain,
        contractAddr,
        symbol,
        ownerAddr: address,
        pageNum: 1,
        pageSize: 100,
      };
      if (type !== -1) {
        params.type = type;
      }
      const res = await transferRecord(params);
      console.log(44444, params, JSON.stringify(res));
      if (res.data) {
        setRecord((prev: any) => {
          return {
            ...prev,
            [type]: {
              ...prev[type],
              loading: false,
              ...res.data,
            },
          };
        });
      } else {
        setRecord((prev: any) => {
          return {
            ...prev,
            [type]: {
              ...prev[type],
              loading: false,
            },
          };
        });
      }
    },
    [tokenInfo]
  );

  const initActivity = useCallback(async () => {
    const { symbol } = tokenInfo?.tokenDetail || {};
    const res = await getActivity({
      pageNum: '1',
      pageSize: '1',
      status: 1,
      symbol,
    });
    console.log(55555, res);
  }, [tokenInfo]);

  const initInfo = async () => {
    const [device_id, wallet_uuid, current_token_detail] = await Promise.all([
      getUniqueId(),
      getData('wallet_uuid'),
      getData('current_token_detail'),
    ]);
    const current_token_detail_obj = JSON.parse(current_token_detail);
    props.navigation?.setOptions({
      title: `${current_token_detail_obj?.symbol}详情`,
    });
    setTokenInfo({
      device_id,
      wallet_uuid,
      tokenDetail: current_token_detail_obj,
    });
  };

  useEffect(() => {
    if (JSON.stringify(tokenInfo) !== '{}') {
      initData();
      initKLine();
      getTransferRecord(-1);
      initActivity();
    }
  }, [getTransferRecord, initActivity, initData, initKLine, tokenInfo]);

  useEffect(() => {
    initInfo();
  }, [props.navigation]);

  const handleChange = (e: number) => {
    setIndex(e);
    getTransferRecord(e - 1);
  };

  const rqDatas = React.useCallback(async () => {
    try {
      if (tokenInfo?.tokenDetail?.symbol) {
        const activityRes = await getActivity({
          pageNum: '1',
          pageSize: '10',
          status: 1,
          symbol: tokenInfo?.tokenDetail?.symbol,
        });
        setActivity(activityRes.data);
      }
    } catch (e) {}
  }, [tokenInfo?.tokenDetail?.symbol]);
  useEffect(() => {
    // 在组件挂载或标题更新时执行
    rqDatas();
  }, [rqDatas]);

  return (
    <Layout
      containerStyle={{ paddingHorizontal: 0, paddingVertical: 0 }}
      fixedChildren={
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(255, 255, 255, 1)',
            paddingHorizontal: 23,
            paddingVertical: 13,
          }}
        >
          <Button
            onPress={() => {
              props?.navigation.navigate('transferPayment');
            }}
            buttonStyle={{
              // backgroundColor: '#8B7FEA',
              alignItems: 'baseline',
              display: 'flex',
              paddingHorizontal: 27,
            }}
          >
            <Icon name={'creditcard'} color={'#fff'} /> 转账
          </Button>
          <Button
            onPress={() => {
              props?.navigation.navigate('collection');
            }}
            buttonStyle={{
              backgroundColor: '#2667FF',
              alignItems: 'baseline',
              display: 'flex',
              paddingHorizontal: 27,
            }}
          >
            <Icon name={'qrcode'} color={'#fff'} /> 收款
          </Button>
          <Button
            onPress={() => {
              props?.navigation.navigate('swap');
            }}
            buttonStyle={{
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#252525',
              overflow: 'hidden',
              alignItems: 'baseline',
              display: 'flex',
              paddingHorizontal: 27,
            }}
          >
            <Icon name="swap" color="#252525" />
            <Text style={{ color: '#252525' }}>兑换</Text>
          </Button>
        </View>
      }
    >
      <StatusBar
        backgroundColor="#3251EA" // 替换为你想要的背景颜色
        barStyle="light-content" // 替换为你想要的图标和文字颜色
      />
      <SafeAreaView style={[styles.container, { height: Dimensions.get('window').height }]}>
        <LinearGradient
          colors={['#3251EA', '#3251EA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginHorizontal: 32,
              paddingBottom: 22,
            }}
          >
            <View>
              <Text style={{ fontSize: 52, color: '#ECECEC' }}>
                {addressBalance?.balance}
                <Text style={{ fontSize: 12, color: '#ECECEC' }}>{addressBalance?.tokenName}</Text>
              </Text>
              <Text style={{ fontSize: 14, color: '#ECECEC' }}>≈${addressBalance?.asset_usd}</Text>
            </View>
          </View>
          <View style={styles.scrollContainer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 26,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={{ fontSize: 18 }}>{addressBalance?.tokenName} =</Text>
                <Text style={{ fontSize: 14 }}>${addressBalance?.asset_usd}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  props?.navigation.navigate('swap');
                }}
              >
                <Text style={{ color: '#3B28CC', fontSize: 12 }}>
                  去兑换 <Icon name="right" />
                </Text>
              </TouchableOpacity>
            </View>
            {kLine.labels.length > 0 && kLine.datasets[0].data.length > 0 && (
              <LineChart
                data={kLine}
                height={160}
                width={width - 26}
                // yLabelsOffset={50}
                // withVerticalLabels={false}
                // withHorizontalLabels={false}
                // withInnerLines={false}
                withOuterLines={false}
                chartConfig={chartConfig}
                yAxisInterval={100}
                bezier
                style={{
                  paddingTop: 16,
                }}
              />
            )}
          </View>
        </LinearGradient>
        {activity?.lists?.length > 0 && (
          <View style={{ paddingHorizontal: 16, marginVertical: 15 }}>
            <TouchableOpacity
              onPress={() => {
                props?.navigation.navigate('coinDetail');
              }}
              style={styles.bannerContainer}
            >
              <Image
                source={{ uri: activity?.lists[0]?.coverPicture }}
                style={styles.banner}
                // PlaceholderContent={<ActivityIndicator />}
              />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.scrollContainer1}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 32 }}>
            <View style={{ flex: 1 }}>
              <Tab
                value={index}
                onChange={handleChange}
                dense
                indicatorStyle={{
                  backgroundColor: '#3B28CC',
                  height: 4,
                  borderRadius: 2,
                }}
                titleStyle={(active: boolean) => {
                  return { fontSize: 12, marginVertical: 8, color: active ? '#3B28CC' : '#AEAEAE' };
                }}
              >
                <Tab.Item>全部</Tab.Item>
                <Tab.Item>转出</Tab.Item>
                <Tab.Item>转入</Tab.Item>
              </Tab>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity
                onPress={() => {
                  props?.navigation.navigate('searchHistory');
                }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    backgroundColor: '#F3F3F3',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 6,
                    marginRight: 6,
                  }}
                >
                  <Icon name="search1" color={'#5A5A5A'} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flex: 1, paddingBottom: 380 }}>
            <TabView value={index} onChange={handleChange} animationType="spring">
              {[-1, 0, 1].map((item) => {
                return (
                  <TabView.Item style={{ width: '100%' }} key={item}>
                    <ScrollView style={{ paddingHorizontal: 25 }}>
                      {record[item]?.lists?.length > 0 ? (
                        record[item]?.lists?.map((item) => (
                          <TouchableOpacity
                            key={item}
                            onPress={() => {
                              props?.navigation.navigate('coinDetail');
                            }}
                          >
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderBottomWidth: 1,
                                borderColor: '#F9F9F9',
                                paddingVertical: 10,
                              }}
                            >
                              {/* <Avatar rounded source={{ uri: 'https://randomuser.me/api/portraits/men/36.jpg' }} /> */}
                              <View
                                style={{
                                  backgroundColor: 'rgba(240, 240, 255, 1)',
                                  height: 21,
                                  width: 21,
                                  borderRadius: 100,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Icon
                                  name="pay-circle-o1"
                                  color={'rgba(59, 40, 204, 1)'}
                                  style={{ backgroundColor: 'rgba(240, 240, 255, 1)', borderRadius: 100 }}
                                />
                              </View>

                              <View style={{ flex: 1, marginRight: 14, marginLeft: 10 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                                  <Text>{item.type === 0 ? '转出' : '转入'}</Text>
                                  <Text>{item.amount}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                                  <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.listPrice}>¥ {item.amount}</Text>
                                  </View>
                                  <View>
                                    <Text style={{ color: '#999999' }}>{moment(item.ctime).format('DD.MM.YY')}</Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                        ))
                      ) : (
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                          <View>
                            <Image
                              source={require('@assets/images/emptyRecord.png')}
                              style={styles.img}
                              PlaceholderContent={<ActivityIndicator />}
                            />
                          </View>
                          <Text style={{ fontSize: 10, marginTop: 18, marginBottom: 28, color: '#AEAEAE' }}>
                            暂无数据
                          </Text>
                        </View>
                      )}
                      {/* {record[item].loading && (
                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 16 }}>
                          <Text>Loading...</Text>
                        </View>
                      )} */}
                    </ScrollView>
                  </TabView.Item>
                );
              })}
            </TabView>
          </View>
        </View>
      </SafeAreaView>
    </Layout>
  );
};

const useStyles = makeStyles((theme, props: Props) => {
  // console.log(11111, theme.colors, props);
  return {
    gradient: {
      // height: '100%',
    },
    button: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 2,
      paddingHorizontal: 8,
      backgroundColor: '#EDEDED',
      borderRadius: 10,
    },
    scrollContainer: {
      paddingVertical: 16,
      // paddingHorizontal: 26,
      borderTopLeftRadius: 20, // 左上角边框半径
      borderTopRightRadius: 20, // 右上角边框半径
      borderBottomRightRadius: 0, // 右下角边框半径
      borderBottomLeftRadius: 0, // 左下角边框半径
      backgroundColor: '#F5F5FF',
      // shadowColor: '#CED8F7',
      // shadowOffset: { width: 0, height: 2 },
      // shadowOpacity: 0.6,
      // shadowRadius: 4,
      // elevation: 4,
      // height: '100%',
    },
    listPrice: {
      color: '#999999',
      fontSize: 12,
    },
    green: {
      color: '#5BCC47',
      fontSize: 12,
    },
    scrollContainer1: {
      paddingTop: 16,
      // paddingHorizontal: 25,
      borderTopLeftRadius: 20, // 左上角边框半径
      borderTopRightRadius: 20, // 右上角边框半径
      borderBottomRightRadius: 0, // 右下角边框半径
      borderBottomLeftRadius: 0, // 左下角边框半径
      backgroundColor: '#fff',
      shadowColor: '#CED8F7',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.6,
      shadowRadius: 4,
      elevation: 4,
      height: '100%',
    },
    img: {
      width: 156,
      height: 102,
      aspectRatio: 1,
      marginTop: 16,
      // marginBottom: 112,
    },
    container: {
      backgroundColor: theme.colors.white,
    },
    bannerContainer: {
      height: 59,
    },
    banner: {
      width: '100%',
      height: '100%',
      aspectRatio: 1,
      borderRadius: 4,
    },
  };
});

export default TokenDetail;
