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
}

const API_URL =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';

const CryptoDashboard: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(API_URL)
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
  }, []);

  return (
    <section className="crypto-dashboard">
      <h2 className="crypto-title">Top 10 Cryptocurrencies</h2>
      {loading && <div className="crypto-status">Loading...</div>}
      {error && <div className="crypto-status error">{error}</div>}
      <div className="crypto-cards">
        {coins.map((coin, i) => (
          <motion.div
            className="crypto-card"
            key={coin.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
          >
            <img src={coin.image} alt={coin.name} className="crypto-logo" />
            <div className="crypto-name">{coin.name} <span className="crypto-symbol">({coin.symbol.toUpperCase()})</span></div>
            <div className="crypto-price">${coin.current_price.toLocaleString()}</div>
            <div
              className={
                'crypto-change ' +
                (coin.price_change_percentage_24h > 0
                  ? 'positive'
                  : coin.price_change_percentage_24h < 0
                  ? 'negative'
                  : '')
              }
            >
              {coin.price_change_percentage_24h > 0 ? '+' : ''}
              {coin.price_change_percentage_24h.toFixed(2)}%
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CryptoDashboard;
