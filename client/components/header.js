import Link from 'next/link';

export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    currentUser && { label: 'Sell Tickets', href: '/tickets/new' },
    currentUser && { label: 'My Orders', href: '/orders' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    .filter((link) => link)
    .map((link) => (
      <li className='nav-item'>
        <Link className='nav-link' href={link.href}>
          {link.label}
        </Link>
      </li>
    ));
  return (
    <nav className='navbar navbar-light bg-light'>
      <Link className='navbar-brand' href='/'>
        GitTix
      </Link>

      <div className='d-flex justify-content-end'>
        <ul className='nav d-flex align-items-center'>
          {/* {currentUser ? 'Sign out' : 'Sign in/up'} */}
          {links}
        </ul>
      </div>
    </nav>
  );
};
