import Link from 'next/link';

export default ({ currentUser }) => {
    const links = [
        !currentUser && { label: 'Sign up', href: '/auth/signup' },
        !currentUser && { label: 'Sign in', href: '/auth/signin' },
        currentUser && { label: 'Sell Tickets', href: '/tickets/new' },
        currentUser && { label: 'My Orders', href: '/orders' },
        currentUser && { label: 'Sign out', href: '/auth/signout' }

    ]
        .filter(linkConfig => linkConfig)
        .map(({ label, href }) => {
            return <li key={href} className='nav-item'>
                <Link href={href}>
                    <h className='nav-link'>{label}</h>
                </Link>
            </li>
        });
    

    return <nav className="navbar navbar-light bg-light">
        <Link href="/">
            <h className='navbar-brand'>GitTix</h>
        </Link>

        <div className='d-flex justify-content-end'>
            <ul className='nav d-flex align-items-center'>
                {links}
            </ul>
        </div>
    </nav>
};