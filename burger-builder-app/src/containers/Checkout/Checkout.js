import React, { Component } from 'react';
import CheckoutSummery from '../../components/Order/CheckoutSummery/CheckoutSummery';
import {Route} from 'react-router-dom';
import ContactData from '../../containers/Checkout/ContactData/ContactData';



class Checkout extends Component {

    state = {
        ingredients:null,
        totalPrice: 0

    }
    componentWillMount(){
        console.log(this.props)
        const query = new URLSearchParams(this.props.location.search);
        let price = 0;
        const newIngredients = {};
        for (let param of query.entries()){
            if(param[0] === 'price'){
                price = param[1];
            }
            else{
                newIngredients[param[0]] = +param[1];
            }
            
        }

        this.setState({ingredients:newIngredients, totalPrice:price});
    }

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
                ingredients={this.state.ingredients}
                checkoutCanceled={this.checkoutCanceledHandler}
                checkoutContinued={this.checkoutContinuedHandler}/>
                
                {/* <Route path={this.props.match.path +'/contact-data'} component={ContactData} /> */}
                <Route 
                path={this.props.match.path +'/contact-data'}
                render={(props)=>(<ContactData ingredients={this.state.ingredients} price={this.state.totalPrice} {...props}/>) } />
            </div>
        );
    }


}
export default Checkout;