import React, { Component } from 'react';
import AUX from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummery from '../../components/Burger/OrderSummery/OrderSummery';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner'

//global constatnt
const INGREDIENT_PRICES = {
    salad: 0.5,
    meat: 1.3,
    bacon: 0.3,
    cheese: 0.7
}

class BurgerBuilder extends Component {

    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        total_price: 4,
        purchaseable: false,
        purchasing: false,
        loading: false
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
        this.setState({loading: true});
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.total_price.toFixed(2),
            customer: {
                name: 'Vindi',
                address: {
                    street: 'yale ave',
                    zip: '19809',
                    country: 'U.S'
                },
                email: 'vrathnayake@gmail.com'
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders.json', order)
            .then(response => this.setState({loading: false, purchasing: false}))
            .catch(err => this.setState({loading: true, purchasing: false}));
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
            ...this.state.ingredients
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let orderSummery = <OrderSummery
            totalPrice={this.state.total_price}
            ingredients={this.state.ingredients}
            purchCancel={this.purchaseCancelHandler}
            purchCont={this.purchaseContinueHandler} />

        if (this.state.loading) {
            orderSummery = <Spinner/>;
        }
        return (
            <AUX>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} >
                   {orderSummery}
                </Modal>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls
                    addIngredient={this.addIngredientHandler}
                    removeIngredient={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    purchaseable={this.state.purchaseable}
                    purchasing={this.purchaseHandler}
                    price={this.state.total_price}
                />
            </AUX>
        );
    }

}

export default BurgerBuilder;