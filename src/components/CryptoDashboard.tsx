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
  const [flipped, setFlipped] = useState<string | null>(null);
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
      <h2 className="crypto-title">Top 10 Cryptocurrencies</h2>
      {loading && <div className="crypto-status">Loading...</div>}
      {error && <div className="crypto-status error">{error}</div>}
      <div className="crypto-cards">
        {coins.map((coin) => (
          <motion.div
            className="crypto-card"
            key={coin.id}
            onClick={() => setFlipped(flipped === coin.id ? null : coin.id)}
            style={{ perspective: 1000, cursor: 'pointer' }}
          >
            <motion.div
              className="crypto-card-inner"
              animate={{ rotateY: flipped === coin.id ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              style={{ position: 'relative', width: '100%', height: '100%' }}
            >
              {/* Front Side */}
              <div className="crypto-card-front">
                <img src={coin.image} alt={coin.name} className="crypto-logo" />
                <div className="crypto-name">
                  {coin.name} <span className="crypto-symbol">({coin.symbol.toUpperCase()})</span>
                </div>
                <div className="crypto-price">${coin.current_price.toLocaleString()}</div>
              </div>
              {/* Back Side */}
              <div className="crypto-card-back">
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
                <div><b>Market Cap:</b> ${coin.market_cap.toLocaleString()}</div>
                <div><b>24h Volume:</b> ${coin.total_volume.toLocaleString()}</div>
                <div><b>24h High:</b> ${coin.high_24h.toLocaleString()}</div>
                <div><b>24h Low:</b> ${coin.low_24h.toLocaleString()}</div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <button
          className="crypto-load-more-btn"
          onClick={() => setPerPage(perPage + 10)}
          disabled={loading}
          style={{
            padding: '0.7rem 2.2rem',
            borderRadius: '24px',
            background: 'var(--accent1)',
            color: 'var(--color-text)',
            fontWeight: 600,
            fontSize: '1.1rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 16px var(--accent1)55',
            transition: 'background 0.2s, box-shadow 0.2s',
            margin: '0 auto',
          }}
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      </div>
    </section>
  );
};
export default CryptoDashboard;
