import axios from 'axios';
import { showAlert } from './alerts';


export const bookTour = async tourId=>{
  console.log("Tour ID:", tourId);
  try{
    const stripe = Stripe('pk_test_51QfNGIEYE9dQH4UDIXFnkZhk95xTax9x4kikXGHJdZT4W6ObpEWkjO3fwmNWa5tiJJenXKAUqSsIFhfppGsVhNVs00umugiNav');
  // 1) get checkout session from api 
  const session = await axios(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`);
  console.log(session);

  //2) create checkout form
  await stripe.redirectToCheckout({
    sessionId:session.data.session.id
  })


  }catch(err){
    console.log(err);
    showAlert('error',err);
  }

};