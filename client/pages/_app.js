import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className='container'>
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

// getInitialProps for a Custom App component
// === {Context, ctx}
// unlike a pages/ component which is ctx
AppComponent.getInitialProps = async (Context) => {
  // console.log(Object.keys(ctx.req));
  const client = buildClient(Context.ctx);
  // const { data } = await client.get('/api/users/currentuser');
  const { data } = await client.get('/api/users/currentuser');
  // const data = {};

  // create pattern that runs getInitialProps
  // for any Component child of AppComponent
  // returns currentUser
  let pageProps = {};
  if (Context.Component.getInitialProps) {
    pageProps = await Context.Component.getInitialProps(
      Context.ctx,
      client,
      data.currentUser
    );
  }

  // ...data = {currentUser}
  return { pageProps, ...data };
};

export default AppComponent;
