import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => {
      // (order) => console.log(order),
      console.log(`order here: ${order}`);
      Router.push('/orders/[orderId]', `/orders/${order.id}`);
    },
  });

  return (
    <>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      <button className='btn btn-primary' onClick={() => doRequest()}>
        Order
      </button>
      {errors}
    </>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;

  const { data: ticket } = await client.get('/api/tickets/' + ticketId);

  return { ticket };
};

export default TicketShow;
