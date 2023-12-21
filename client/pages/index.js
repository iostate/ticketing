import axios from 'axios';
import buildClient from '../api/build-client';
import Link from 'next/link';
import Router from 'next/router';
const Landing = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href='/tickets/[ticketId]' as={`/tickets/${ticket.id}`}>
            View Ticket
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className='table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
  // console.log(tickets);
  // const res = await client.get('/api/auth/currentuser');
  // console.log(res.data);
  // return currentUser ? (
  //   <div>
  //     <h2>You are currently signed in</h2>
  //   </div>
  // ) : (
  //   <div>
  //     <h2>You are currently not signed in</h2>
  //   </div>
  // );
};

// https://nextjs.org/docs/pages/api-reference/functions/get-initial-props
// For the initial page load, getInitialProps
// will run on the server only.getInitialProps
// will then also run on the client when
// navigating to a different route with the
// next / link component or by using next/router.
Landing.getInitialProps = async (context, client, currentUser) => {
  // const client = buildClient(ctx);
  // const { data } = await client.get('/api/users/currentuser');
  // return data;
  const { data } = await client.get('/api/tickets');
  return { tickets: data };
};

export default Landing;
