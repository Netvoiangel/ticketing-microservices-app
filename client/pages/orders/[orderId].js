import { useEffect, useState } from "react";
import StripeCheckout from 'react-stripe-checkout';
import useRequest from "../../hooks/use-request";
import Router from 'next/router';

const OrderShow = ({ order, currentUser }) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: (payment) => Router.push('/orders'),
    });

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date(); 
            setTimeLeft(Math.round(msLeft / 1000));
        };

        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);

        return () => {
            clearInterval(timerId);
        }
    }, [order]);

    if (timeLeft < 0) {
        return <div>Order expired</div>
    }
    return ( <div>
            Time left to pay: {timeLeft} seconds
            <StripeCheckout 
                token={({ id }) => doRequest({ token: id })}
                stripeKey="pk_test_51PH2ppKv0iBLv21IzPhWwnGmdH61Wpn2Lf6nSVr4U02NxOAgYHTIcZUo1PM1pc8vqXXKm1LSiFbZKS7LP1hBzPhR00WLZ6W4l4"
                amount={order && order.ticket && order.ticket.price * 100}
                email={currentUser && currentUser.email}
            />
            {errors}
        </div>
    )
};

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);

    return { order: data };
};

export default OrderShow;