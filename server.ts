// runtime imports
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

// type imports
import type { Request, Response } from "express";
import type { Market, MarketResponse } from "./types/markets";
import type {OldMarketsResponse} from "./types/markets" ;
import type {OldMarket} from "./types/markets";
import type { CryptocurrencyResponse } from './types/markets';
import type {CryptocurrencyData}  from "./types/markets";





const app = express();
app.use(cors()); 

app.get("/api/markets", async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      "https://api.wallex.ir/hector/web/v1/markets",
      {
        headers: { "x-api-key": process.env.WALLEX_API_KEY! }
      }
    ) as { data: MarketResponse };

    const marketsArray: Market[] = Object.values(response.data.result.markets);
    res.json(marketsArray);
  } catch (err) {
    console.error("Error fetching markets:", err);
    res.status(500).json({ error: "Failed to fetch markets" });
  }
});
app.get("/related/coin/:symbol", async (req: Request, res: Response) => {
  const { symbol }  = req.params;
if (!symbol) {
  return res.status(400).json({ error: "Symbol is required" });
}

  try {
    const resp = await axios.get("http://localhost:3120/api/markets") as { data: Market[] };

    // پیدا کردن کوین اصلی
    const current_coin = resp.data.find(coin => coin.symbol.toUpperCase() === symbol.toUpperCase());
    if (!current_coin) {
      return res.status(404).json({ error: "Coin not found" });
    }

    // پیدا کردن کوین‌های مرتبط بر اساس دسته‌بندی
    const filteredRelated = resp.data
      .filter(coin =>
        coin.symbol.toUpperCase() !== symbol.toUpperCase() &&
        coin.categories &&
        coin.categories.some(cat => current_coin.categories.includes(cat))
      )
      .slice(0, 20);

    // ساخت set از سمبل‌ها
    const setArray = new Set(filteredRelated.map(coin => coin.symbol.toUpperCase()));

    // گرفتن oldMarket
    const oldMarket = await axios.get("http://localhost:3120/api/oldmarkets") as { data: OldMarket[] };
    
    // فیلتر oldMarket فقط اونایی که مرتبط هستن
    const filteredOldMarket = oldMarket.data.filter(m => setArray.has(m.symbol.toUpperCase()));

    res.json(filteredOldMarket);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});







app.get("/api/oldmarkets", async (req: Request, res: Response) => {
    try{
         const response = await axios.get("https://api.wallex.ir/v1/markets") as { data:OldMarketsResponse};
  const oldMarketArray:OldMarket[] = Object.values(response.data.result.symbols) 
  res.json(oldMarketArray); 
    } catch(err){
 console.error("Error fetching markets:", err);
res.status(500).json({ error: "Failed to fetch markets" });
    }

});



app.get("/api/currencies/stats", async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      "https://api.wallex.ir/v1/currencies/stats"
   
    ) as { data: CryptocurrencyResponse };

    const marketsArray: CryptocurrencyData[] = response.data.result;
    res.json(marketsArray);
  } catch (err) {
    console.error("Error fetching markets:", err);
    res.status(500).json({ error: "Failed to fetch markets" });
  }
});
app.get("/markets/trending", async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const currency = String(req.query.currency) || "TMN".toUpperCase();


    const [marketsRes, statsRes] = await Promise.all([
      axios.get("https://api.wallex.ir/v1/markets") as {data:OldMarketsResponse},
      axios.get("https://api.wallex.ir/v1/currencies/stats") as {data:CryptocurrencyResponse}
    ]);

    const marketsArray: OldMarket[] = Object.values(marketsRes.data.result.symbols);
    const statsArray: CryptocurrencyData[] = statsRes.data.result;

    const ranked = new Map<string, number>(
      statsArray.map((s) => [s.key.toUpperCase(), s.rank])
    );

    const trending: (OldMarket & { rank: number })[] = marketsArray
      .filter((m) => m.symbol.toUpperCase().endsWith(currency))
      .map((m) => ({
        ...m,
        rank: ranked.get(m.baseAsset.toUpperCase()) ?? Infinity
      }))
      .sort((a, b) => a.rank - b.rank)
      .slice(0, limit);

    res.json(trending);
  } catch (err) {
    console.error("Error fetching trending markets:", err);
    res.status(500).json({ error: "Failed to fetch trending markets" });
  }
});











app.get("/coin/:baseAsset" , async (req:Request,res:Response)=>{
  const {baseAsset}=req.params

  
  try
  {
    const response = await axios.get("http://localhost:3120/api/oldmarkets") as {data:OldMarket[]}
    const data=response.data
    const base_asset = data.filter(coin=> coin.baseAsset===baseAsset)

      if (base_asset.length === 0) {
      return res.status(404).json({ error: "Coin not found" });
    }

    res.json(base_asset)
  
  } 
  catch(err)
  {
      console.error("Error fetching trending markets:", err);
      res.status(500).json({ error: "Failed to fetch trending markets" });
  }
})
const port = process.env.PORT || 3120;
app.listen(port, () => console.log(`Server running on port ${port}`));