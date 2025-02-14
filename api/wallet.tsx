import http from '@common/utils/http';
import { IResponse } from 'typings/global';
const DEFAULT_DATA = {
  // device_id: 'bd1aae254aa24f14',
  // wallet_uuid: '43ef50c7-9a05-4d47-a7fb-6d68c22dcef3',
};

export interface AddressList {
  address: string;
  asset_cny: string;
  asset_usd: string;
  balance: string;
  id: number;
  index: string;
}
export interface Token {
  address: string;
  chain: string;
  contract_addr: string;
  index: number;
  symbol: string;
}

export interface AddressBalanceParams {
  /**
   * 地址
   */
  address: string;
  /**
   * 链名称
   */
  chain: string;
  /**
   * 合约地址
   */
  contract_address?: string;
  /**
   * 设备id
   */
  device_id: string;
  /**
   * 币名称
   */
  symbol: string;
  /**
   * 钱包uuid
   */
  wallet_uuid: string;
}
export interface AddressBalanceParamsData {
  asset_cny: string;
  asset_usd: string;
  balance: string;
  data_stat: string[];
}

export function getAddressBalance(data: AddressBalanceParams): Promise<IResponse<AddressBalanceParamsData | null>> {
  return http.post(`/wallet/address/balance`, {
    ...data,
    ...DEFAULT_DATA,
  });
}
export interface ChainBalanceParams {
  chain: string;
  device_id: string;
  wallet_uuid: string;
}
export interface ChainBalanceData {
  asset_cny: string;
  asset_usd: string;
  chain: string;
  device_id: string;
  network: string;
  token_list: TokenList[];
  wallet_name: string;
  wallet_uuid: string;
}

export interface TokenList {
  address_list: AddressList[];
  asset_cny: string;
  asset_usd: string;
  balance: string;
  contract_addr: string;
  id: number;
  logo: string;
  symbol: string;
}

export function getChainBalance(data: ChainBalanceParams): Promise<IResponse<ChainBalanceData | null>> {
  return http.post(`/wallet/chain/balance`, data);
}

export function getChainIdBalance(data: {
  address: string;
  device_id: string;
  wallet_uuid: string;
  chain_id: string;
}): Promise<IResponse<ChainBalanceData | null>> {
  return http.post(`/wallet/chainId/balance`, data);
}

export interface CreateWalletParams {
  device_id: string;
  mnemonic_code: string;
  password: string;
  tokens: Token[];
  wallet_name: string;
  wallet_uuid: string;
}
export function createWallet(data: CreateWalletParams): Promise<IResponse<string>> {
  return http.post(`/wallet/create`, data);
}
export interface BatchCreateWalletParams {
  batch_wallet: BatchWallet[];
}

export interface BatchWallet {
  device_id: string;
  mnemonic_code: string;
  password: string;
  tokens: Token[];
  wallet_name: string;
  wallet_uuid: string;
}

export function batchCreateWallet(data: BatchCreateWalletParams): Promise<IResponse<string>> {
  return http.post(`/wallet/batchCreate`, data);
}
export interface DeviceBalanceParams {
  device_id: string;
  wallet_uuid?: string;
}

export interface DeviceBalanceData {
  token_list: DeviceBalanceTokenList[];
  total_asset_cny: string;
  total_asset_usd: string;
}

export interface DeviceBalanceTokenList {
  /**
   * 是否备份过
   */
  backup: boolean;
  wallet_asset_cny: string;
  wallet_asset_usd: string;
  wallet_balance?: WalletBalance[];
  wallet_name?: string;
  wallet_uuid: string;
}

export interface WalletBalance {
  address: string;
  asset_cny: string;
  asset_usd: string;
  balance: string;
  chain: string;
  contract_addr: string;
  id: number;
  index: number;
  logo: string;
  symbol: string;
}

export function getDeviceBalance(data: DeviceBalanceParams): Promise<IResponse<DeviceBalanceData | null>> {
  return http.post(`/wallet/device/balance`, {
    ...data,
    // device_id: 'bd1aae254aa24f14',
  });
}
export interface UpdateWalletParams {
  device_id: string;
  wallet_name: string;
  wallet_uuid: string;
}
export function updateWallet(data: UpdateWalletParams): Promise<IResponse<string>> {
  return http.post(`/wallet/update`, data);
}

export interface DeleteWalletParams {
  chain?: string;
  contract_addr?: string;
  device_id: string;
  symbol?: string;
  wallet_uuid: string;
}
export function deleteWallet(data: DeleteWalletParams): Promise<IResponse<string>> {
  return http.post(`/wallet/delete`, data);
}
export interface TransferParams {
  /**
   * 链名称
   */
  chain: string;
  /**
   * 转账内容
   */
  raw_tx: string;
  /**
   * 币种名称
   */
  symbol: string;
}

export function transfer(data: TransferParams): Promise<IResponse<string>> {
  return http.post(`/wallet/transfer`, data);
}
export interface TransferRecordParams {
  chain: string;
  contractAddr?: string;
  symbol: string;
  type?: number; //类型，1=转入，0=转出
  ownerAddr: string;
  pageNum: number;
  pageSize: number;
}
export interface Datum {
  amount?: string;
  chain?: string;
  confirm?: number;
  contractAddr?: string;
  ctime?: number;
  fromAddr?: string;
  symbol?: string;
  toAddr?: string;
  type?: number;
}
export function transferRecord(data: TransferRecordParams): Promise<IResponse<Datum[] | null>> {
  return http.post(`/wallet/transfer/record`, data);
}
export interface SymbolGasParams {
  chain: string;
}
export interface SymbolGasData {
  /**
   * 快到账需要gas
   */
  fast: number;
  /**
   * 快到帐需要时间，单位：分钟
   */
  fastTime: number;
  /**
   * 快到账需要gas折合usdt
   */
  fastUsdt: string;
  /**
   * gas费币种
   */
  gasFeeSymbol: string;

  limitPrice: number;
  /**
   * 慢到账需要gas
   */
  low: number;
  /**
   * 慢到帐需要时间，单位：分钟
   */
  lowTime: number;
  /**
   * 慢到账需要gas折合usdt
   */
  lowUsdt: string;
  /**
   * 推荐到账需要gas
   */
  recommend: number;
  /**
   * 推荐到帐需要时间，单位：分钟
   */
  recommendTime: number;
  /**
   * 推荐到账需要gas折合usdt
   */
  recommendUsdt: string;
}
export function symbolGas(data: SymbolGasParams): Promise<IResponse<SymbolGasData | null>> {
  return http.post(`/wallet/symbol/gas`, data);
}

export interface AddSymbolTokenParams {
  address: string;
  chain: string;
  contract_addr?: string;
  device_id: string;
  index: number;
  symbol?: string;
  wallet_uuid: string;
}
export function addSymbolToken(data: AddSymbolTokenParams): Promise<IResponse<string>> {
  return http.post(`/wallet/symbol/token`, data);
}

export function walletBackUp(data: { device_id: string; wallet_uuid?: string }): Promise<IResponse<string>> {
  return http.post(`/wallet/backup`, data);
}

/**
 * 获取钱包中已经添加的币种
 * @param data
 * @returns
 */
export interface AddedWalletSymbols {
  chain: string;
  contractAddr?: string;
  /**
   * 链上的主币名称
   */
  mainChainSymbol: string;
  /**
   * 代币
   */
  tokenName: string;
}

export function walletSymbols(data: {
  device_id: string;
  wallet_uuid?: string;
}): Promise<IResponse<AddedWalletSymbols[]>> {
  return http.post(`/wallet/walletSymbols`, data);
}

export function walletNonce(data: { address: string; chain: string; symbol: string }): Promise<
  IResponse<{
    nonce: string;
  }>
> {
  return http.post(`/wallet/nonce`, data);
}

export function btcGasPrice(data: {}): Promise<IResponse<{ gasPrice: number; symbolRate: number }>> {
  return http.post(`/wallet/btc/gasPrice`, data);
}

export function getUtxo(data: { address: string }): Promise<
  IResponse<
    {
      device_id: string;
      wallet_uuid: string;
      chain: string;
      symbol: string;
      contract_addr: string;
      address: string;
      index: 0;
    }[]
  >
> {
  return http.post(`/wallet/utxo`, data);
}

export function get1InchKey(data: {}): Promise<IResponse<string>> {
  return http.post(`/1inch`, data);
}
