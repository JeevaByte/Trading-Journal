import Papa from "papaparse"
import { parse, format } from "date-fns"

export type ParsedTrade = {
    entryDate: Date
    exitDate: Date
    instrument: string
    market: "NSE" | "BSE" | "FOREX" | "CRYPTO" | "US_FUTURES"
    direction: "LONG" | "SHORT"
    entryPrice: number
    exitPrice: number
    quantity: number
    fees: number
    source: "ZERODHA" | "ANGEL_ONE" | "UPSTOX"
    raw: any
}

// Zerodha: trade_date, tradingsymbol, exchange, segment, trade_type, quantity, price, order_id, trade_id, order_execution_time
// Note: We need to pair buy and sell trades to form a complete trade, or log individual legs?
// The prompt says "No scaling in/out support (single entry, single exit per trade)".
// But broker CSVs typically list individual executions (buy leg, sell leg).
// For MVP, we might need to group them by symbol/date? Or just log them as executions and let user pair them?
// The requirement says "Parse and normalize data into unified internal schema".
// And "Trades Taken Today: [auto-linked from trade log]".
// If we log raw executions, we can't calculate P&L per trade easily unless we match them.
// A simple matching strategy: FIFO (First In First Out) per symbol per day.
// Or just let user upload "Trade Report" which might have P&L?
// Zerodha Tradebook has individual trades.
// Let's implement a simple parser that returns raw rows first, and a heavier logic later to group them?
// Or for now, just map row-to-row if the CSV is a "Trade Report" (P&L report)? 
// The prompt says "Tradebook CSV export format", which is executions.
// Complex logic needed: Group by Symbol. Match Buy with Sell.
// For MVP Phase 2, maybe we just parse the rows and ask user to review/group? 
// Or auto-match assuming intraday or distinct trades?
// Let's implement basic row parsing and return a list of "Executions" which the UI can help group or we auto-group.

// Let's try to Auto-Group based on Symbol and Quantity matching.

interface RawExecution {
    date: Date
    symbol: string
    type: "BUY" | "SELL"
    qty: number
    price: number
    id: string
}

export const parseBrokerCSV = (file: File, broker: "ZERODHA" | "ANGEL_ONE" | "UPSTOX"): Promise<ParsedTrade[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                try {
                    const executions: RawExecution[] = []

                    results.data.forEach((row: any) => {
                        if (broker === "ZERODHA") {
                            // trade_date, tradingsymbol, trade_type, quantity, price
                            const dateStr = row["trade_date"]
                            const symbol = row["tradingsymbol"] || row["symbol"]
                            const type = row["trade_type"] // "buy" or "sell"
                            const qty = Math.abs(parseFloat(row["quantity"]))
                            const price = parseFloat(row["price"])

                            if (dateStr && symbol) {
                                executions.push({
                                    date: new Date(dateStr), // Assuming YYYY-MM-DD or similar standard
                                    symbol,
                                    type: type?.toUpperCase() === "BUY" ? "BUY" : "SELL",
                                    qty,
                                    price,
                                    id: row["trade_id"] || row["order_id"]
                                })
                            }
                        } else if (broker === "ANGEL_ONE") {
                            // Trade Date, Symbol, Buy/Sell, Quantity, Price
                            const dateStr = row["Trade Date"]
                            const symbol = row["Symbol"]
                            const type = row["Buy/Sell"]
                            const qty = Math.abs(parseFloat(row["Quantity"]))
                            const price = parseFloat(row["Price"])

                            if (dateStr && symbol) {
                                executions.push({
                                    date: new Date(dateStr), // Format dependent?
                                    symbol,
                                    type: type?.toUpperCase() === "BUY" ? "BUY" : "SELL",
                                    qty,
                                    price,
                                    id: row["Order ID"]
                                })
                            }
                        }
                        // Add Upstox logic similarly
                    })

                    // Basic FIFO Matching Logic
                    // This is a simplified matching for Beta. 
                    // Group by Symbol
                    const trades: ParsedTrade[] = []
                    const positions: Record<string, RawExecution[]> = {}

                    // Sort by date/time
                    executions.sort((a, b) => a.date.getTime() - b.date.getTime())

                    executions.forEach(exec => {
                        const key = exec.symbol
                        if (!positions[key]) positions[key] = []

                        // Check if we can close a position
                        // If I define Trade as Entry + Exit
                        // If I have a Buy, I keep it. If I have a Sell, I match with oldest Buy? (Long only logic for simplicity, need to handle Short too)

                        // Simplified: Just match raw pairs for now
                        const opposite = exec.type === "BUY" ? "SELL" : "BUY"
                        const matchIndex = positions[key].findIndex(p => p.type === opposite && p.qty === exec.qty)

                        if (matchIndex !== -1) {
                            // Match found!
                            const open = positions[key][matchIndex]
                            positions[key].splice(matchIndex, 1) // Remove matched execution

                            // Determine Entry/Exit
                            const isLong = open.type === "BUY"
                            const entry = isLong ? open : exec
                            const exit = isLong ? exec : open

                            trades.push({
                                entryDate: entry.date,
                                exitDate: exit.date,
                                instrument: key,
                                market: "NSE", // Default assume NSE for Indian brokers
                                direction: isLong ? "LONG" : "SHORT",
                                entryPrice: entry.price,
                                exitPrice: exit.price,
                                quantity: entry.qty,
                                fees: 0, // Need to calc fees
                                source: broker,
                                raw: { entry, exit }
                            })
                        } else {
                            positions[key].push(exec)
                        }
                    })

                    resolve(trades)
                } catch (e) {
                    reject(e)
                }
            },
            error: (err) => reject(err)
        })
    })
}
