export default interface HistoryItem {
    fromAmount: number | string;
    fromCurrency: string;
    toAmount: number | string;
    toCurrency: string;
    date: string;
    id: string;
}