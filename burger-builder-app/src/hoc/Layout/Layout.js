import React, {Component} from 'react';
import AUX from '../Auxiliary/Auxiliary';
import classes from './Layout.css';
import Toolbar from '../../components/Navigation/ToolBar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component {

    state = {
        showSideDrawer: false
    }

    sideDrawerCloseHandler=()=>{
        this.setState({showSideDrawer:false})
    }

    sideDrawerToggleHandler=()=>{       
        this.setState((prevState)=>{
            return{showSideDrawer:!prevState.showSideDrawer};           
        });
    }

    render() {
        return(
             <AUX>
        <div>
            <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler}/>
            <SideDrawer open={this.state.showSideDrawer} closed={this.sideDrawerCloseHandler}/>
        </div>
        <main className={classes.Content}>
            {this.props.children}
        </main>
    </AUX>
    );
    }
       
};

export default Layout;