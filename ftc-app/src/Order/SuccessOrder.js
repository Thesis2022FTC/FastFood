import React,{useState} from 'react'
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { Redirect,useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';
import ReactStars from "react-rating-stars-component";
import { render } from "react-dom";
import {Button} from 'react-bootstrap'
import { doc, setDoc, collection, query, where, onSnapshot,addDoc} from "firebase/firestore";
import db from '../config';

const SuccessOrder = () => {
    const { isLogin } = useSelector(state => state.user)
    const auth = getAuth();
    const user = auth.currentUser;
    const history=useHistory()
    const [rate,setrate]=useState(0)
    const [comment,setComment]=useState(0)
    const ratingChanged = (newRating) => {
        setrate(newRating)
      };
   
      const handleSubmit=()=>{
        const myRate = {
           uid:user.uid,
           rating:rate,
           comment:comment
        }

         addDoc(collection(db, "rating"), myRate);
        alert("Rating successfully sent.")
      }

    return (
        <div className='auth-wrapper '>
            <div className='auth-inner '>
            <p>Hi {user.displayName},</p><p>Thank you for your advanced order. The QR code valid only for today {moment().format('LL')}. </p>
            <button className="btn btn-primary form-control" style={{ marginBottom: 10 }} onClick={()=>history.push('/dashboard')}>
                Go Back to Dashboard
            </button>
          <div id='rating'>
        Rate your experience.
          <ReactStars
          count={5}
          onChange={ratingChanged}
          size={48}
          isHalf={true}
          emptyIcon={<i className="far fa-star"></i>}
          halfIcon={<i className="fa fa-star-half-alt"></i>}
          fullIcon={<i className="fa fa-star"></i>}
          activeColor="#ffd700"
        />
        <input className='form-control' type='text' placeholder='comments' name='comment' onChange={(e)=>setComment(e.target.value)}/>
        <Button variant='warning' className="btn btn-warning text-right" onClick={handleSubmit} style={{marginTop:10}}>Submit</Button>
          </div>
        </div>
        </div >
    )


}


export default SuccessOrder;