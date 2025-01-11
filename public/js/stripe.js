import axios from 'axios';
import { showAlert } from './alerts';


export const bookTour = async tourId=>{
  try{
    const stripe = Stripe('pk_test_51QfNGIEYE9dQH4UDIXFnkZhk95xTax9x4kikXGHJdZT4W6ObpEWkjO3fwmNWa5tiJJenXKAUqSsIFhfppGsVhNVs00umugiNav');
  // 1) get checkout session from api 
  const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);


  //2) create checkout form
  await stripe.redirectToCheckout({
    sessionId:session.data.session.id
  })
  }catch(err){

    showAlert('error',err);
  }

};