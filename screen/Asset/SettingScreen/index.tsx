import { DeviceBalanceData, deleteWallet, getDeviceBalance, updateWallet } from '@api/wallet';
import { SUCCESS_CODE } from '@common/constants';
import { showToast } from '@common/utils/platform';
import { executeQuery } from '@common/utils/sqlite';
import { getData } from '@common/utils/storage';
import { updateWalletTable } from '@common/wallet';
import BottomOverlay from '@components/BottomOverlay';
import Layout from '@components/Layout';
import ValidatePassword from '@components/ValidatePassword';
import { makeStyles, Avatar, Button, Dialog, Input, ListItem, Switch } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity, Clipboard } from 'react-native';
import { getUniqueId } from 'react-native-device-info';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import { DecodeMnemonic } from 'savourlabs-wallet-sdk/wallet';
const SettingScreen = (props: any) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const [walletInfo, setWalletInfo] = useState<DeviceBalanceData>();
  const [device_id, setDeviceId] = useState('');
  const [privateDialog, setPrivate] = useState({
    visible: false,
    text: '',
  });
  const [mnemonicDialog, setMnemonic] = useState({
    visible: false,
    text: '',
  });
  const [walletNameDialog, setWalletNameDialog] = useState({
    visible: false,
    wallet_name: '',
    device_id: '',
    wallet_uuid: '',
  });
  const [validate, setValidate] = useState({
    visible: false,
    type: 'private',
  });
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [wallet_uuid, setWalletUuid] = useState('');
  const getWalletInfo = async () => {
    const [device_id, wallet_uuid] = await Promise.all([getUniqueId(), getData('wallet_uuid')]);
    setDeviceId(device_id);
    setWalletUuid(wallet_uuid);
    const res = await getDeviceBalance({
      device_id,
      wallet_uuid,
    });
    if (res.code === SUCCESS_CODE && res?.data) {
      setWalletInfo(res?.data);
      setWalletNameDialog((prev) => {
        return {
          ...prev,
          wallet_name: res?.data?.token_list?.[0]?.wallet_name || '',
          device_id,
          wallet_uuid,
        };
      });
    }
  };

  useEffect(() => {
    getWalletInfo();
  }, [props.navigation]);

  const toggleDialog = () => {
    setPrivate({
      visible: !privateDialog.visible,
      text: '',
    });
  };

  const toggleMnemonicDialog = () => {
    setMnemonic({
      visible: !mnemonicDialog.visible,
      text: '',
    });
  };

  const handleEditor = async () => {
    const { visible, ...rest } = walletNameDialog;
    const res = await updateWallet(rest);
    if (res.code === SUCCESS_CODE) {
      getWalletInfo();
      setWalletNameDialog((prev) => {
        return {
          ...prev,
          visible: false,
        };
      });
      showToast(t('settingScreen.successfulModification'));
    }
  };
  const toggleDialogDelete = () => {
    setDeleteVisible((visible) => {
      return !visible;
    });
  };
  const toggleWalletName = () => {
    setWalletNameDialog((prev) => {
      return {
        ...prev,
        visible: !prev.visible,
      };
    });
  };

  const handleDelete = async () => {
    try {
      const res = await deleteWallet({
        device_id,
        wallet_uuid,
      });
      if (res.code === SUCCESS_CODE) {
        toggleDialogDelete();
        updateWalletTable(wallet_uuid, {
          key: 'is_del = ?',
          value: [1],
        });
        setTimeout(() => {
          showToast(t('settingScreen.successfullyDeleted'), {
            onHide: () => {
              props?.navigation?.navigate('home', {
                tab: 'asset',
              });
            },
          });
        }, 0);
      }
    } catch (e) {
      console.log(111111, e);
    }
  };

  const toggleValidate = async () => {
    setValidate((prev) => {
      return {
        ...prev,
        visible: !prev.visible,
      };
    });
  };

  return (
    <Layout
      fixedChildren={
        <View>
          <Button
            onPress={toggleDialogDelete}
            buttonStyle={{
              backgroundColor: 'rgba(244, 244, 244, 1)',
              borderRadius: 3,
              borderColor: 'rgba(208, 31, 31, 1)',
            }}
            titleStyle={{ marginHorizontal: 20, color: 'rgba(208, 31, 31, 1)' }}
          >
            {t('asset.deleteWallet')}
          </Button>
        </View>
      }
    >
      <SafeAreaView>
        <View>
          <ListItem>
            <Avatar rounded source={{ uri: 'https://randomuser.me/api/portraits/men/36.jpg' }} />
            <View style={{ flex: 1, marginRight: 14, marginLeft: 10, flexDirection: 'row' }}>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <View>
                  <Text style={styles.text}>{walletInfo?.token_list[0]?.wallet_name}</Text>
                </View>
                <View style={{ flexDirection: 'row', width: 150, alignItems: 'center' }}>
                  <Text numberOfLines={1} ellipsizeMode="tail" style={styles.text}>
                    Id: {walletInfo?.token_list[0]?.wallet_uuid}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      Clipboard.setString(walletInfo?.token_list[0]?.wallet_uuid || '');
                    }}
                  >
                    <Icon name="copy1" />
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <View
                  style={{
                    backgroundColor: '#F1F1F1',
                    paddingHorizontal: 12,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ lineHeight: 17, fontSize: 12, color: 'rgba(0, 0, 0, 1)' }}>
                    {t('settingScreen.modify')}
                  </Text>
                </View>
              </View>
            </View>
          </ListItem>
        </View>
        <ListItem onPress={toggleWalletName}>
          <ListItem.Content>
            <ListItem.Title>{t('asset.editWalletName')}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <ListItem
          onPress={() => {
            executeQuery({
              customExec: (tx) => {
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
                  [wallet_uuid, walletInfo?.token_list[0]?.wallet_balance[0]?.address],
                  (txObj, resultSet) => {
                    if (resultSet.rows.length > 0) {
                      // 获取私钥
                      const privateKey = resultSet.rows.item(0).priv_key;
                      setPrivate({
                        visible: true,
                        text: privateKey,
                      });
                      console.log('Private key:', privateKey);
                    } else {
                      console.log(
                        'No matching record found',
                        wallet_uuid,
                        walletInfo?.token_list[0]?.wallet_balance[0]?.address,
                        JSON.stringify(resultSet)
                      );
                    }
                  },
                  (txObj, error) => {
                    console.log('Error executing SQL query:', error);
                  }
                );
              },
            });
          }}
        >
          <ListItem.Content>
            <ListItem.Title>{t('asset.viewPrivateKey')}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        {!walletInfo?.token_list?.[0].backup ? (
          <ListItem
            onPress={() => {
              props?.navigation.navigate('startBackup');
            }}
          >
            <ListItem.Content>
              <ListItem.Title>{t('asset.backupWallet')}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        ) : (
          <ListItem
            onPress={async () => {
              try {
                const [wallet_uuid] = await Promise.all([getData('wallet_uuid')]);
                const sqliteData = await executeQuery({
                  customExec: (tx, resolve, reject) => {
                    return tx.executeSql(
                      `SELECT * FROM wallet WHERE wallet_uuid = ? `,
                      [wallet_uuid],
                      (txObj, resultSet) => {
                        console.log(99999, resultSet);
                        if (resultSet.rows.length > 0) {
                          const walletData = resultSet.rows.item(0);
                          resolve(walletData);
                        } else {
                          reject('Wallet not found.');
                        }
                      },
                      (txObj, error) => {
                        reject('Wallet Found Error.');
                      }
                    );
                  },
                });
                if (sqliteData) {
                  const mnemonic = await DecodeMnemonic({
                    encrytMnemonic: sqliteData?.mnemonic_code,
                    language: 'english',
                  });
                  setMnemonic({
                    visible: true,
                    text: mnemonic,
                  });
                }
              } catch (error) {
                showToast(t('backupMnemonics.errorDecodingMnemonics'));
                console.error('解析助记词时出错:', error);
              }
            }}
          >
            <ListItem.Content>
              <ListItem.Title>{t('settingScreen.viewMnemonics')}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        )}

        <ListItem>
          <ListItem.Content>
            <ListItem.Title>{t('asset.FaceFingerprintPay')}</ListItem.Title>
          </ListItem.Content>
          <Switch />
        </ListItem>
        <ListItem>
          <ListItem.Content>
            <ListItem.Title>{t('asset.passwordlessPayment')}</ListItem.Title>
          </ListItem.Content>
          <Switch />
        </ListItem>
        <ListItem>
          <ListItem.Content>
            <ListItem.Title>{t('asset.authorizationVerification')}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <ListItem>
          <ListItem.Content>
            <ListItem.Title>{t('asset.nodeSettings')}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </SafeAreaView>

      <BottomOverlay
        visible={deleteVisible}
        title={t('asset.confirmDeleteWallet')}
        onBackdropPress={toggleDialogDelete}
      >
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
          <Text>{t('asset.confirmDeleteWalletDesc')}</Text>
        </View>
        <View style={{ marginBottom: 16 }}>
          <Button title={t('common.confirm')} onPress={handleDelete} />
        </View>
        <Button title={t('common.cancel')} onPress={toggleDialogDelete} type="outline" />
      </BottomOverlay>
      <ValidatePassword
        visible={validate.visible}
        onBackdropPress={toggleValidate}
        validateCorrect={() => {
          toggleValidate();
        }}
      />
      <BottomOverlay
        visible={walletNameDialog.visible}
        title={t('asset.editWalletName')}
        onBackdropPress={toggleWalletName}
      >
        <View style={{ marginTop: 16 }}>
          <Input
            placeholder={t('settingScreen.pleaseInputWalletName') || ''}
            value={walletNameDialog.wallet_name}
            onChangeText={(wallet_name) => {
              setWalletNameDialog((prev) => {
                return {
                  ...prev,
                  wallet_name,
                };
              });
            }}
          />
        </View>
        <Button onPress={handleEditor}>{t('settingScreen.confirm')}</Button>
      </BottomOverlay>
      <Dialog isVisible={privateDialog.visible} onBackdropPress={toggleDialog}>
        <Dialog.Title title={t('settingScreen.privateKey') || ''} />
        <Text>{privateDialog.text}</Text>
        <Dialog.Actions>
          <Dialog.Button
            title={t('settingScreen.copy') || ''}
            onPress={() => {
              Clipboard.setString(privateDialog?.text || '');
            }}
          />
          <Dialog.Button title={t('settingScreen.cancel') || ''} onPress={toggleDialog} />
        </Dialog.Actions>
      </Dialog>
      <Dialog isVisible={mnemonicDialog.visible} onBackdropPress={toggleMnemonicDialog}>
        <Dialog.Title title={t('settingScreen.viewMnemonics') || ''} />
        <Text>{mnemonicDialog.text}</Text>
        <Dialog.Actions>
          <Dialog.Button
            title={t('settingScreen.copy') || ''}
            onPress={() => {
              Clipboard.setString(mnemonicDialog?.text || '');
            }}
          />
          <Dialog.Button title={t('settingScreen.cancel') || ''} onPress={toggleMnemonicDialog} />
        </Dialog.Actions>
      </Dialog>
    </Layout>
  );
};
const useStyles = makeStyles((theme: any) => {
  return {
    text: {
      color: theme.colors.black,
    },
  };
});
export default SettingScreen;
