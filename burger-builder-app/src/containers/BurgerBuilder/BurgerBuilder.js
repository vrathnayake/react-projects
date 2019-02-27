import React, { Component } from 'react';
import AUX from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummery from '../../components/Burger/OrderSummery/OrderSummery';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionTypes from '../../store/actions';

import { connect } from 'react-redux';



class BurgerBuilder extends Component {

    state = {
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        console.log(this.props);
        // axios.get('https://react-burger-app-vindi.firebaseio.com/ingredients.json')
        //     .then(response => {
        //         //console.log(response);
        //         this.setState({
        //             ingredients: response.data
        //         });
        //     }).catch(error=>{
        //         this.setState({error: true})
        //     });
    }

    purchaseHandler = () => {
        this.setState({
            purchasing: true
        });
    }

    purchaseCancelHandler = () => {
        this.setState({
            purchasing: false
        });
    }

    purchaseContinueHandler = () => {

        this.props.history.push('/checkout');
            
    }

    // You could also do this via redux
    updatePurchasabale(ingredients) {
        const sum = Object.keys(ingredients)
            .map((ing) => {
                return ingredients[ing];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);       
            return sum > 0
    }

    render() {
        const disabledInfo = {
            ...this.props.ings
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummery = null;
        let burger = (this.state.error) ? "Ingredients an not be loaded!" : <Spinner />

        if (this.props.ings) {
            burger = (
                <AUX>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        
                        addIngredient={this.props.onIngredientAdded}
                        removeIngredient={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        purchaseable={this.updatePurchasabale(this.props.ings)}
                        purchasing={this.purchaseHandler}
                        price={this.props.totPrice}
                    />
                </AUX>
            );
            orderSummery = <OrderSummery
                totalPrice={this.props.totPrice}
                ingredients={this.props.ings}
                purchCancel={this.purchaseCancelHandler}
                purchCont={this.purchaseContinueHandler} />
        }

        if (this.state.loading) {
            orderSummery = <Spinner />;
        }

        return (
            <AUX>
                <Modal show={this.state.purchasing}
                    modalClosed={this.purchaseCancelHandler} >
                    {orderSummery}
                </Modal>
                {burger}
            </AUX>
        );
    }

}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        totPrice: state.totalPrice
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName: ingName }),
        onIngredientRemoved: (ingName) => dispatch({ type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));