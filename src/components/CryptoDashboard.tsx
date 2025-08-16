import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './CryptoDashboard.css';

interface Coin {
  id: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  symbol: string;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
}

const BASE_API_URL =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&sparkline=false';

const CryptoDashboard: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Removed card flipping logic
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${BASE_API_URL}&per_page=${perPage}&page=1`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then((data) => {
        setCoins(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [perPage]);

  return (
    <section className="crypto-dashboard">
      <h2 className="crypto-title">Top Cryptocurrencies</h2>
      {loading && <div className="crypto-status">Loading...</div>}
      {error && <div className="crypto-status error">{error}</div>}
      <div className="crypto-cards">
        {coins.map((coin) => (
          <motion.div
            className="crypto-card"
            key={coin.id}
          >
            <div className="crypto-card-content">
              <div className="crypto-card-header-row">
                <img src={coin.image} alt={coin.name} className="crypto-logo" />
                <div className="crypto-header-info">
                  <div className="crypto-name">
                    {coin.name} <span className="crypto-symbol">({coin.symbol.toUpperCase()})</span>
                  </div>
                  <div className="crypto-price-row">
                    <span className="crypto-price">${coin.current_price.toLocaleString()}</span>
                    <span
                      className={
                        'crypto-change ' +
                        (coin.price_change_percentage_24h > 0
                          ? 'positive'
                          : coin.price_change_percentage_24h < 0
                          ? 'negative'
                          : '')
                      }
                      style={{ marginLeft: 8 }}
                    >
                      {coin.price_change_percentage_24h > 0 ? '+' : ''}
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
              <div><b>Market Cap:</b> ${coin.market_cap.toLocaleString()}</div>
              <div><b>24h Volume:</b> ${coin.total_volume.toLocaleString()}</div>
              <div><b>24h High:</b> ${coin.high_24h.toLocaleString()}</div>
              <div><b>24h Low:</b> ${coin.low_24h.toLocaleString()}</div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="crypto-load-more-row">
        <button
          className="crypto-load-more-btn"
          onClick={() => setPerPage(perPage + 10)}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      </div>
    </section>
  );
};
export default CryptoDashboard;
