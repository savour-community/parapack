import * as React from 'react';
import { useState } from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import { Button, Input, Text, makeStyles } from '@rneui/themed';
import Layout from '@components/Layout';
import { rules } from '@common/utils/validation';
import Icon from 'react-native-vector-icons/AntDesign';
import { showToast } from '@common/utils/platform';
import { createImportWallet, getTableInfo } from '@common/wallet';
import { CreateMnemonic, DecodeMnemonic, MnemonicToSeed, CreateAddress } from 'savourlabs-wallet-sdk/wallet';
import { storeData } from '@common/utils/storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { executeQuery } from '@common/utils/sqlite';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

type Props = {
  fullWidth?: boolean;
  navigation: any;
};
const walletInfoDemo = {
  // mnemonic: 'hazard,notable,grid,napkin,penalty,genius,prison,squirrel,demise,speak,rain,seek',
  mnemonic: 'rebuild,naive,advance,pony,finger,abstract,below,cream,tired,keen,convince,series',
  wallet_name: 'S_9',
  password: '1234567a',
  confirmPassword: '1234567a',
  checked: true,
};
const defaultWalletInfo = {
  mnemonic: '',
  wallet_name: '',
  password: '',
  confirmPassword: '',
  checked: false,
};
const ImportWallet = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [walletInfo, setWalletInfo] = useState<{
    mnemonic: string;
    wallet_name: string;
    password: string;
    confirmPassword: string;
    checked: boolean;
  }>(defaultWalletInfo);
  const { t } = useTranslation();
  const getMnemonic = async () => {
    try {
      const sqliteData = await executeQuery({
        customExec: (tx, resolve, reject) => {
          return tx.executeSql(
            `SELECT * FROM wallet`,
            [],
            (txObj, resultSet) => {
              const rows = resultSet.rows;
              const data = [];
              for (let i = 0; i < rows.length; i++) {
                const row = rows.item(i);
                // 处理每一行数据
                data.push(row);
              }
              resolve(data);
            },
            (txObj, error) => {
              reject('Wallet Found Error.');
            }
          );
        },
      });
      if (
        sqliteData &&
        (sqliteData as Record<string, any>[])?.[0]?.has_submit === 1 &&
        (sqliteData as Record<string, any>[])?.[0]?.is_del === 0
      ) {
        for (let item of sqliteData as any[]) {
          const mnemonic = await DecodeMnemonic({ encrytMnemonic: item?.mnemonic_code, language: 'english' });
          if (mnemonic === walletInfo.mnemonic && item.is_del === 0) {
            showToast(t('importWallet.chainExistsThisMnemonicWallet'));
            return false;
          }
        }
        return true;
      }
      return true;
    } catch (error) {
      showToast(t('importWallet.errorDecodingMnemonics'));
      // console.error('解析助记词时出错:', error);
      return false;
    }
  };

  const handleImportWallet = async () => {
    if (!walletInfo.checked) {
      return showToast(t('importWallet.pleaseAgreeToTerms'));
    }
    if (!walletInfo.mnemonic) {
      return showToast(t('importWallet.pleaseFillInMnemonic'));
    }
    if (!rules.walletName.isVaild(walletInfo.wallet_name)) {
      return showToast(rules.walletName.message);
    }
    if (!rules.password.isVaild(walletInfo.password)) {
      return showToast(rules.password.message);
    }
    if (walletInfo.password !== walletInfo.confirmPassword) {
      return showToast(t('importWallet.passwordMismatch'));
    }
    const validateMnemonic = await getMnemonic();
    if (validateMnemonic) {
      setLoading(true);
      const createSuccess = await createImportWallet({
        wallet_name: walletInfo.wallet_name,
        password: walletInfo.password,
        mnemonic: walletInfo.mnemonic.split(',').join(' '),
      })
        .catch((e) => {
          console.log('createImportWallet', e);
        })
        .finally(() => {
          setLoading(false);
        });
      if (createSuccess && createSuccess.success) {
        storeData('wallet_uuid', createSuccess.wallet_uuid);
        props?.navigation?.navigate?.('home', { tab: 'asset' });
      }
    }
  };

  const styles = useStyles(props);

  return (
    <Layout
      fixedChildren={
        <View style={styles.button}>
          <Button onPress={handleImportWallet}>{i18next.t('asset.importWallet')}</Button>
        </View>
      }
    >
      <Spinner visible={loading} />
      <SafeAreaView style={{ marginBottom: 120 }}>
        <View style={styles.item}>
          <Input
            label={t('importWallet.mnemonics')}
            multiline
            numberOfLines={2}
            value={walletInfo.mnemonic}
            placeholder={t('importWallet.inputMnemonicSeparator')}
            onChangeText={(mnemonic) => {
              setWalletInfo((prev) => {
                return {
                  ...prev,
                  mnemonic,
                };
              });
            }}
          />
        </View>
        <View style={styles.item}>
          <Input
            label={t('importWallet.setIdentityWalletName')}
            value={walletInfo.wallet_name}
            placeholder={`${t('importWallet.caseLetters')}+${t('importWallet.numbers')}+${t('importWallet.underline')}`}
            onChangeText={(wallet_name) => {
              setWalletInfo((prev) => {
                return {
                  ...prev,
                  wallet_name,
                };
              });
            }}
          />
        </View>
        <View style={styles.item}>
          <Input
            label={t('importWallet.setPassword')}
            secureTextEntry={true}
            value={walletInfo.password}
            placeholder={t('importWallet.notLessThanEightDigits') || ''}
            onChangeText={(password) => {
              setWalletInfo((prev) => {
                return {
                  ...prev,
                  password,
                };
              });
            }}
          />
        </View>
        <View style={styles.item}>
          <Input
            label={t('importWallet.confirmPassword')}
            secureTextEntry={true}
            value={walletInfo.confirmPassword}
            placeholder={t('importWallet.notLessThanEightDigits') || ''}
            onChangeText={(confirmPassword) => {
              setWalletInfo((prev) => {
                return {
                  ...prev,
                  confirmPassword,
                };
              });
            }}
            // errorStyle={{color: 'red'}}
            // errorMessage="ENTER A VALID ERROR HERE"
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              setWalletInfo((prev) => {
                return {
                  ...prev,
                  checked: !prev.checked,
                };
              });
            }}
          >
            <View
              style={{
                borderColor: walletInfo.checked ? '#3B28CC' : '#E2E2E2',
                borderWidth: 1,
                borderRadius: 100,
                width: 14,
                height: 14,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8,
                overflow: 'hidden',
              }}
            >
              {walletInfo.checked && <Icon name="check" size={10} color={'#3B28CC'} />}
            </View>
          </TouchableOpacity>

          <Text>
            {t('importWallet.iHaveRead')} <Text style={styles.protocol}>{t('importWallet.userAgreement')}</Text>
            {t('importWallet.and')}
            <Text style={styles.protocol}>{t('importWallet.privacyPolicy')}</Text>
          </Text>
        </View>
      </SafeAreaView>
    </Layout>
  );
};
const useStyles = makeStyles((theme, props: Props) => {
  return {
    item: {},
    title: {
      fontWeight: 'bold',
      lineHeight: 22,
      fontSize: 16,
      marginBottom: 6,
      paddingLeft: 7,
    },
    button: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      padding: 25,
    },
    protocol: {
      color: '#4D6EF5',
    },
  };
});

export default ImportWallet;
