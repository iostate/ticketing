import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router'

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    // onSuccess: (payment) => console.log(payment),
    onSuccess: () => Router.push('/orders')
  });

  const { email } = currentUser;
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <>
      <div>Order Show</div>
      <div>Time left to pay: {timeLeft} seconds</div>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey='pk_test_51ON3z8KSF9LQbi9F8GyZ2RRyJsUhGcPc5ViPmOH5yIToReOBKrSZaEr0fsZzPmOoY0IaGOAJ0cybBHAvo8nS9BII008oOGQhcR'
        amount={order.ticket.price}
        email={email}
      />
      {errors}
    </>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get('/api/orders/' + orderId);

  return { order: data };
};
export default OrderShow;
