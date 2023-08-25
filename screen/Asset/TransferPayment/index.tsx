import { Button, Input, Text } from '@rneui/themed';
import * as React from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Layout from '../../../components/Layout';
import Icon from 'react-native-vector-icons/AntDesign';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';
import { SymbolGasData, WalletBalance, getAddressBalance, symbolGas, transfer, walletNonce } from '@api/wallet';
import { getUniqueId } from 'react-native-device-info';
import { getData } from '@common/utils/storage';
import { executeQuery } from '@common/utils/sqlite';
import { SignTransaction } from 'savourlabs-wallet-sdk/wallet';
import { CHAIN_MAP } from '@common/constants';
import Big from 'big.js';
import BottomOverlay from '@components/BottomOverlay';
import { showToast } from '@common/utils/platform';

const FEE_TYPE = [
  {
    type: 'low',
    title: '慢',
    price: '0.00073',
    usdtPrice: '3.27',
    time: '约60分钟',
  },
  {
    type: 'recommend',
    title: '推荐',
    price: '0.00073',
    usdtPrice: '$ 3.27',
    time: '约30分钟',
  },
  {
    type: 'fast',
    title: '快',
    price: '0.00073',
    usdtPrice: '3.27',
    time: '约10分钟',
  },
  {
    type: 'custom',
    title: '自定义',
  },
];
const TransferPayment = ({ navigation, route }) => {
  const { t } = useTranslation();
  const [token, seToken] = useState<WalletBalance>();

  const [form, setForm] = useState({
    fromAddr: '',
    toAddr: route?.params?.address || '',
    amount: '',
    symbol: '',
    contractAddr: '',
    sign: '',
    chain: '',
  });

  const [list, setList] = useState<any[]>([]);
  const [gasPrice, setGasPrice] = useState<string>('');
  const [gasLimit, setGasLimit] = useState<string>('');
  const [activeType, setActiveType] = useState<'recommend' | 'low' | 'fast' | 'custom'>('recommend');
  const [gas, setGas] = useState<SymbolGasData>();
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const handleConfirmed = async () => {
    const [wallet_uuid, nonceRes] = await Promise.all([
      getData('wallet_uuid'),
      walletNonce({
        chain: token?.chain as string,
        symbol: token?.symbol as string,
        address: token?.address as string,
      }),
    ]);

    const sqliteData = await executeQuery({
      customExec: (tx, resolve, reject) => {
        tx.executeSql(
          `
          SELECT * 
          FROM asset 
          WHERE chain_id = (
            SELECT id
            FROM chain
            WHERE chainName = ?
          )
          AND tokenName = ?
          AND contract_addr = ?
      `,
          [token?.chain, token?.symbol, token?.contract_addr],
          (txObj, resultSet) => {
            if (resultSet.rows.length > 0) {
              const { contractUnit, chainListId } = resultSet.rows.item(0);
              console.log(888888, resultSet.rows.item(0), nonceRes);
              tx.executeSql(
                `
                    SELECT * 
                    FROM account 
                    WHERE wallet_id = (
                      SELECT id
                      FROM wallet
                      WHERE wallet_uuid = ?
                    )
                    AND address = ?
                `,
                [wallet_uuid, token?.address],
                async (txObj2, resultSet2) => {
                  if (resultSet2.rows.length > 0) {
                    // 获取第一条数据

                    // const gasPriceInGwei = new Big(gas?.[`${activeType}`]).toNumber(); // Example gas price in Gwei
                    // const gasLimit = new Big(`${gas?.gasLimit}`).toNumber();
                    const accountData = resultSet2.rows.item(0);
                    const params = {
                      privateKey: accountData.priv_key.replace('0x', ''),
                      nonce: Number(nonceRes.data?.nonce || 0),
                      from: token?.address,
                      to: form.toAddr || '',
                      amount: form.amount,
                      gasPrice: new Big(activeType === 'custom' ? gasPrice : gas?.[`${activeType}`]).toNumber(),
                      gasLimit: new Big(`${activeType === 'custom' ? gasLimit : gas?.gasLimit}`).toNumber(),
                      decimal: contractUnit, //contractUnit
                      chainId: chainListId,
                      tokenAddress: '0x00',
                      // gasLimit: 21000,
                      // gasPrice: 750000000000,
                      // privateKey: '0cc9a688f5608f4b5ae64444d936282ca5ff1fcf9cdd09fe34d4475a5b1a8d65',
                      // nonce: 0,
                      // from: '0x1c176b36166F74BB5DBC19a340a896A68DeA1385',
                      // to: '0x36FCde42B307915a94542132AbE5b273bFfF4376',
                      // gasLimit: 21000,
                      // decimal: 18,
                      // chainId: 1,
                      // tokenAddress: '0x00',
                    };
                    console.log(
                      77777,
                      token?.symbol.toLowerCase(),
                      CHAIN_MAP[token?.chain] || token?.chain?.toLocaleLowerCase(),
                      params
                    );
                    try {
                      const raw_tx = await SignTransaction(
                        CHAIN_MAP[token?.chain] || token?.chain?.toLocaleLowerCase(),
                        params
                      );
                      const res = await transfer({
                        raw_tx: raw_tx as string,
                        chain: token?.chain as string,
                        symbol: token?.symbol as string,
                      });
                      console.log(
                        'transfer =====>',
                        {
                          raw_tx: raw_tx as string,
                          chain: token?.chain as string,
                          symbol: token?.symbol as string,
                        },
                        res
                      );
                    } catch (e) {
                      showToast(`${e}`);
                      console.log('raw_tx', e);
                    }
                  } else {
                    console.log('Account not found.');
                  }
                },
                (txObj) => {
                  console.log('Error executing SQL query:', txObj);
                }
              );
            }
          },
          (txObj) => {
            console.log('Error executing SQL query:', txObj);
          }
        );
      },
    });
  };

  const handleSelect = (type) => {
    setActiveType(type);
  };

  const initData = useCallback(async () => {
    const [device_id, wallet_uuid, current_token_detail] = await Promise.all([
      getUniqueId(),
      getData('wallet_uuid'),
      getData('current_token_detail'),
    ]);
    const currentTokenDetail = JSON.parse(current_token_detail || '{}');
    const [addressBalanceRes, gasRes] = await Promise.all([
      getAddressBalance({
        device_id,
        wallet_uuid,
        chain: currentTokenDetail?.chain,
        symbol: currentTokenDetail?.symbol,
        address: currentTokenDetail?.address,
        contract_address: currentTokenDetail?.contract_addr,
      }),
      symbolGas({
        chain: currentTokenDetail?.chain as string,
      }),
    ]);
    if (addressBalanceRes.data) {
      seToken({
        ...addressBalanceRes.data,
        ...currentTokenDetail,
      });
    }
    if (gasRes?.data) {
      setList(
        FEE_TYPE.map((item) => {
          if (item.type === 'custom') {
            return {
              ...item,
            };
          } else {
            // const estimatedCost = gasPrice * gasLimit
            // const actualCostInEther = estimatedCost / 10^18
            const pows = new Big(10).pow(gasRes.data.contractUnit);
            const symbolPrice = new Big(gasRes.data[`${item?.type}`]).times(gasRes.data.gasLimit).div(pows);
            const price = symbolPrice.times(gasRes.data.symbolRate);
            return {
              ...item,
              time: `约${gasRes.data[`${item?.type}Time`]}分钟`,
              usdtPrice: `${price.toFixed(gasRes.data.amountUnit).toString()}`,
              price: `${symbolPrice.toFixed(gasRes.data.amountUnit).toString()}`,
            };
          }
        })
      );
      setGas(gasRes.data);
      console.log(11111, gasRes.data);
    }
  }, [route?.params]);

  useEffect(() => {
    initData();
  }, [initData, navigation]);

  const handleOpen = () => {
    if (!form?.toAddr) {
      return showToast(`输入或者黏贴钱包地址`);
    } else if (!form?.amount) {
      return showToast(`输入正确的转出数量`);
    } else {
      if (activeType === 'custom') {
        if (new Big(gasPrice) < (new Big(gas?.low) || 0)) {
          return showToast(`Gas Price至少为${gas?.low}`);
        }
        if (Number(gasLimit) < 21000) {
          return showToast(`Gas Limit至少为21000`);
        }
      }
      toggleOverlay();
    }
  };

  const priceDetail = React.useMemo(() => {
    if (activeType === 'custom') {
      let price = 0;
      let usdtPrice = 0;
      if (gasLimit && gasPrice) {
        const pows = new Big(10).pow(gas.contractUnit);
        const symbolPrice = new Big(gasPrice).times(gasLimit).div(pows);
        const symbolUsdtPrice = symbolPrice.times(gas.symbolRate);
        price = symbolPrice.toFixed(gas.amountUnit);
        usdtPrice = symbolUsdtPrice.toFixed(gas.amountUnit);
      }
      return {
        price,
        usdtPrice,
      };
    } else {
      const current = list?.find((item) => item.type === activeType);
      return {
        price: current?.price || 0,
        usdtPrice: current?.usdtPrice || 0,
      };
    }
  }, [gasLimit, gasPrice, activeType, list]);

  return (
    <Layout
      fixedChildren={
        <View style={styles.button}>
          <Button onPress={handleOpen}>确定</Button>
        </View>
      }
    >
      <SafeAreaView style={styles.layout}>
        <View style={styles.overview}>
          <Text style={styles.overviewTitle}>{token?.symbol} 余额</Text>
          <Text style={styles.money}>
            <Text style={styles.moneyStrong}>
              {token?.balance} {token?.symbol}
            </Text>
            ≈ $ {token?.asset_usd}
          </Text>
        </View>
        <View>
          <Text style={styles.title}>收款账号</Text>
          <Input
            value={form.toAddr}
            onChangeText={(toAddr) => {
              setForm((prev) => {
                return {
                  ...prev,
                  toAddr,
                };
              });
            }}
          />
        </View>
        <View>
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'baseline',
              flexDirection: 'row',
            }}
          >
            <View>
              <Text style={styles.title}>转账金额</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation?.navigate('searchToken', {
                  go: 'transferPayment',
                });
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text>{token?.symbol}</Text>
                <Icon name="caretdown" style={{ marginLeft: 8 }} />
              </View>
            </TouchableOpacity>
          </View>

          <Input
            value={form.amount}
            keyboardType="numeric"
            onChangeText={(amount) => {
              setForm((prev) => {
                return {
                  ...prev,
                  amount,
                };
              });
            }}
          />
        </View>
        <View>
          <Text style={styles.title}>矿工费用</Text>
          <View style={styles.group}>
            {(list || []).map((item) => {
              const style =
                activeType === item.type
                  ? {
                      ...styles.item,
                      ...styles.activeItem,
                    }
                  : styles.item;
              if (item.type === 'custom') {
                return (
                  <TouchableOpacity
                    key={item.type}
                    onPress={() => {
                      handleSelect(item.type);
                    }}
                  >
                    <View
                      // eslint-disable-next-line react-native/no-inline-styles
                      style={{
                        ...style,
                        paddingBottom: 0,
                      }}
                    >
                      <Text style={styles.groupTitle}>{item.title}</Text>
                      <Icon
                        // eslint-disable-next-line react-native/no-inline-styles
                        style={{
                          ...styles.icon,
                          display: activeType === item.type ? 'flex' : 'none',
                        }}
                        name="check"
                      />
                    </View>
                  </TouchableOpacity>
                );
              }
              return (
                <TouchableOpacity
                  key={item.type}
                  onPress={() => {
                    handleSelect(item.type);
                  }}
                >
                  <View style={{ ...style }}>
                    <Text style={styles.groupTitle}>{item.title}</Text>
                    <Text style={styles.groupSubTitle}>
                      {item.price} {token?.symbol}
                    </Text>
                    <Text style={styles.groupSubTitle}>$ {item.usdtPrice} Usdt</Text>
                    <Text style={styles.time}>{item.time}</Text>
                    <Icon
                      // eslint-disable-next-line react-native/no-inline-styles
                      style={{
                        ...styles.icon,
                        display: activeType === item.type ? 'flex' : 'none',
                      }}
                      name="check"
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          {activeType === 'custom' && (
            <View style={styles.custom}>
              <View style={{ flex: 1 }}>
                <Text style={styles.customTitle}>Fee per byte（sat/b）</Text>
                <Input
                  value={gasPrice}
                  keyboardType="numeric"
                  onChangeText={(price) => {
                    setGasPrice(price);
                  }}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 13 }}>
                <Text style={styles.customTitle}>Size（sat/b）</Text>
                <Input
                  value={gasLimit}
                  keyboardType="numeric"
                  onChangeText={(limit) => {
                    setGasLimit(limit);
                  }}
                />
              </View>
            </View>
          )}
        </View>
        <BottomOverlay visible={visible} title={'交易详情'} onBackdropPress={toggleOverlay}>
          <View style={{ marginTop: 16 }}>
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 16 }}>{token?.chain}</Text>
            </View>
            <View style={{ marginBottom: 16 }}>
              <View>
                <Text style={{ color: '#9397AF', fontSize: 14, marginRight: 2 }}>付款地址</Text>
              </View>

              <Text>{token?.address || ''}</Text>
            </View>
            <View style={{ marginBottom: 16 }}>
              <View>
                <Text style={{ color: '#9397AF', fontSize: 14, marginRight: 2 }}>收款地址</Text>
              </View>
              <Text>{form.toAddr || ''}</Text>
            </View>
            <View style={{ marginBottom: 16 }}>
              <View>
                <Text style={{ color: '#9397AF', fontSize: 14, marginRight: 2 }}>矿工费</Text>
              </View>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 20 }}>{priceDetail.price}</Text>
                <Text style={{ fontSize: 14 }}>≈$ {priceDetail.usdtPrice}</Text>
              </View>
            </View>
          </View>
          <Button onPress={handleConfirmed}>确定</Button>
        </BottomOverlay>
      </SafeAreaView>
    </Layout>
  );
};
const styles = StyleSheet.create({
  layout: {
    marginBottom: 120,
  },
  overview: {
    borderRadius: 9,
    borderColor: '#E2E2E2',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 38,
  },
  overviewTitle: {
    color: '#9F9F9F',
    fontSize: 14,
  },
  money: {
    fontSize: 16,
  },
  moneyStrong: {
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 35,
  },
  title: {
    fontWeight: 'bold',
    // color: '#434343',
    lineHeight: 22,
    fontSize: 16,
    marginBottom: 6,
    paddingLeft: 7,
  },
  group: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
  },
  groupTitle: {
    textAlign: 'center',
  },
  groupSubTitle: {
    fontSize: 8,
    lineHeight: 11,
    color: '#9E9E9E',
    textAlign: 'center',
  },
  item: {
    display: 'flex',
    justifyContent: 'center',
    width: 72,
    height: 72,
    borderRadius: 9,
    borderColor: '#E2E2E2',
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
    paddingBottom: 18,
  },
  activeItem: {
    borderColor: '#8B7FEA',
  },
  time: {
    fontSize: 8,
    color: '#9E9E9E',
    lineHeight: 11,
    paddingVertical: 4,
    backgroundColor: '#F8F8FF',
    textAlign: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  custom: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'rgba(249, 249, 249, 1)',
    borderRadius: 9,
    paddingVertical: 13,
    paddingHorizontal: 11,
    marginTop: 10,
  },
  customTitle: {
    color: '#9E9E9E',
    fontSize: 10,
    marginBottom: 6,
  },
  icon: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 26,
    height: 16,
    backgroundColor: '#8B7FEA',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 16,
    borderTopLeftRadius: 0, // 左上角边框半径
    borderTopRightRadius: 4, // 右上角边框半径
    borderBottomRightRadius: 0, // 右下角边框半径
    borderBottomLeftRadius: 4, // 左下角边框半径
    overflow: 'hidden',
  },
  button: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
});
const pickerStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    padding: 0,
    height: 22,
    lineHeight: 22,
    // paddingVertical: 12,
    // paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    // color: 'black',
    // paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    padding: 0,
    height: 22,
    lineHeight: 22,
    // paddingHorizontal: 10,
    // paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    // color: 'black',
    // paddingRight: 0, // to ensure the text is never behind the icon
  },
});
export default TransferPayment;
