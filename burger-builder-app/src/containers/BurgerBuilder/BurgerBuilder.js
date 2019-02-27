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

//global constatnt
const INGREDIENT_PRICES = {
    salad: 0.5,
    meat: 1.3,
    bacon: 0.3,
    cheese: 0.7
}

class BurgerBuilder extends Component {

    state = {
        //ingredients: null,
        total_price: 4,
        purchaseable: false,
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

        //alert("You have continued!");
        this.setState({ loading: true });

        const queryParams = [];
        for (let i in this.state.ingredients) {
            queryParams.push(decodeURIComponent(i) + '=' + decodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price=' + this.state.total_price);
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });
    }

    updatePurchasabale(ingredients) {

        const sum = Object.keys(ingredients)
            .map((ing) => {
                return ingredients[ing];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);

        this.setState({
            purchaseable: sum > 0
        });
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;

        const priceAddition = INGREDIENT_PRICES[type];
        const currentPrice = this.state.total_price;
        const updatedPrice = currentPrice + priceAddition;

        this.setState({
            ingredients: updatedIngredients,
            total_price: updatedPrice
        });

        this.updatePurchasabale(updatedIngredients);

    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];

        if (oldCount <= 0) {
            return;
        }

        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;

        const priceDeduction = INGREDIENT_PRICES[type];
        const currentPrice = this.state.total_price;
        const updatedPrice = currentPrice - priceDeduction;

        this.setState({
            ingredients: updatedIngredients,
            total_price: updatedPrice
        });

        this.updatePurchasabale(updatedIngredients);

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
                        // addIngredient={this.addIngredientHandler}
                        // removeIngredient={this.removeIngredientHandler}
                        addIngredient={this.props.onIngredientAdded}

                        removeIngredient={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        purchaseable={this.state.purchaseable}
                        purchasing={this.purchaseHandler}
                        price={this.state.total_price}
                    />
                </AUX>
            );
            orderSummery = <OrderSummery
                totalPrice={this.state.total_price}
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
        ings: state.ingredients
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName: ingName }),
        onIngredientRemoved: (ingName) => dispatch({ type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));