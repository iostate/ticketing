import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
const AppComponent = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

// getInitialProps for a Custom App component
// === {Context, ctx}
// unlike a pages/ component which is ctx
AppComponent.getInitialProps = async (Context) => {
  // console.log(Object.keys(ctx.req));
  const client = buildClient(Context.ctx);
  const { data } = await client.get('/api/users/currentuser');

  // returns currentUser
  const pageProps = await Context.Component.getInitialProps(Context.ctx);
  console.log(pageProps);

  return data;
};

export default AppComponent;
