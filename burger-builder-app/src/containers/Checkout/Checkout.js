import React, { Component } from 'react';
import CheckoutSummery from '../../components/Order/CheckoutSummery/CheckoutSummery';
import {Route} from 'react-router-dom';
import ContactData from '../../containers/Checkout/ContactData/ContactData';

import {connect} from 'react-redux';



class Checkout extends Component {

    

    checkoutCanceledHandler =()=>{
        this.props.history.goBack();
    }

    checkoutContinuedHandler =()=>{
        console.log('going to contact data', this.props.match.path);
        this.props.history.replace(this.props.match.path+'/contact-data/');
    }

    render() {
        return (
            <div>
                <CheckoutSummery 
                ingredients={this.props.ings}
                checkoutCanceled={this.checkoutCanceledHandler}
                checkoutContinued={this.checkoutContinuedHandler}/>
                
                 <Route path={this.props.match.path +'/contact-data'} component={ContactData} />
                {/* <Route 
                path={this.props.match.path +'/contact-data'}
                render={(props)=>(<ContactData ingredients={this.props.ings} price={this.props.totPrice} {...props}/>) } /> */}
            </div>
        );
    }


}

const mapStateToProps = state => {
    return{
        ings: state.ingredients,
        totPrice: state.totPrice
    };
}
export default connect(mapStateToProps)(Checkout);