import React, { useState } from 'react';
import getStripe from '../../utils/stripejs';

const cardStyles = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  alignItems: 'flex-start',
  padding: '1rem',
  marginBottom: '1rem',
  boxShadow: '5px 5px 25px 0 rgba(46,61,73,.2)',
  backgroundColor: '#fff',
  borderRadius: '6px',
  maxWidth: '300px',
};
const buttonStyles = {
  display: 'block',
  fontSize: '13px',
  textAlign: 'center',
  color: '#000',
  padding: '12px',
  boxShadow: '2px 5px 10px rgba(0,0,0,.1)',
  backgroundColor: 'rgb(255, 178, 56)',
  borderRadius: '6px',
  letterSpacing: '1.5px',
};

const buttonDisabledStyles = {
  opacity: '0.5',
  cursor: 'not-allowed',
};

const formatPrice = (amount, currency) => {
  let price = (amount / 100).toFixed(2);
  let numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  });
  return numberFormat.format(price);
};

const { addItem } = useShoppingCart();

const ProductCard = ({ priceNode }) => {
  const [loading, setLoading] = useState(false);

  const price = priceNode.id;
  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true);

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      mode: 'payment',
      lineItems: [{ price, quantity: 1 }],
      successUrl: `${window.location.origin}/page-2/`,
      cancelUrl: `${window.location.origin}/advanced`,
    });

    if (error) {
      console.warn('Error:', error);
      setLoading(false);
    }
  };

  return (
    <div style={cardStyles}>
      {console.log(priceNode)}
      <h4>{priceNode.product.name}</h4>
      <p>Price: {formatPrice(priceNode.unit_amount, priceNode.currency)}</p>
      <form onSubmit={handleSubmit}>
        <button disabled={loading} style={loading ? { ...buttonStyles, ...buttonDisabledStyles } : buttonStyles}>
          BUY ME
        </button>
      </form>
      <button
        onClick={() => addItem(priceNode.product)}
        aria-label={`Add ${priceNode.product.name} to your cart`}
        style={{ height: 50, width: 100, marginBottom: 30 }}
      >
        Add to cart
      </button>
    </div>
  );
};

export default ProductCard;
