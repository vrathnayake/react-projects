import * as actionType from '../actions/actionTypes';

const initialState = {
    ingredients : null ,
    totalPrice : 4,
    error: false
}
const INGREDIENT_PRICES = {
    salad: 0.5,
    meat: 1.3,
    bacon: 0.3,
    cheese: 0.7
}

const burgerBuilderReducer = (state = initialState, action)=>{

    switch(action.type){
        case actionType.ADD_INGREDIENT:
        return{
            ...state,
            ingredients:{
                ...state.ingredients,
                [action.ingredientName] : state.ingredients[action.ingredientName] + 1
            },
            totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName]

        };
        case actionType.REMOVE_INGREDIENT:
        return{
            ...state,
            ingredients:{
                ...state.ingredients,
                [action.ingredientName] : state.ingredients[action.ingredientName] - 1
            },
            totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName]
        };
        case actionType.SET_INGREDIENTS:
        return{
            ...state,
            totalPrice : 4,
            ingredients: {
                //if you want to change the orger of the ingredients
                salad: action.ingredients.salad,
                bacon: action.ingredients.bacon,
                cheese: action.ingredients.cheese,
                meat: action.ingredients.meat
            },               
            error: false
        };
        case actionType.FETCH_INGFAILED:
        return{
            ...state,
            error: true
        };
        default:{
            return state;
        }
    }
}

export default burgerBuilderReducer;