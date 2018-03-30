import React, {Component} from 'react';
import SubCategory from './SubCategory/SubCategory';
import classes from './Category.module.css';
import Transition from 'react-transition-group/Transition';

class Category extends Component {
    state = {
        categoryOpen: true,
        contentHeight: 100000
    }
    
    categoryToggleHandler = () => {
        const height = this.divElement.scrollHeight;
        this.setState((prevState) => {
            return (
                {categoryOpen: !prevState.categoryOpen,
                 contentHeight: height}
            );
        });
    }

    componentDidMount() {
        const height = this.divElement.scrollHeight;
        this.setState({ contentHeight: height });
    }

    render() {

        const subcat_markup = this.props.subcategories.map(({id, name, description, totalPosts, lastActiveThread, path}) => {
            return (
                <SubCategory 
                    key={id}
                    name={name}
                    description={description}
                    totalPosts={totalPosts}
                    lastActiveThread={lastActiveThread}
                    pathName={path} />
            );
        });

        const duration = {
                            enter: 1,
                            exit: 500,
                        };

        const defaultStyle =
        {
            'transition': `all ${duration.exit}ms`,
            'overflow': 'hidden'
        };

        const transitionStyles = {
            entering:  
                {
                    'max-height': `${this.state.contentHeight}px`,
                    'visibility': 'hidden'
                },
            entered:  
                {
                    'max-height': '0px',
                    'visibility': 'hidden'
                },
            exiting:  
                {
                    'max-height': `${this.state.contentHeight}px` 
                }
        };

        return (
            <div className={classes.Category}>
                <div 
                    onClick={this.categoryToggleHandler} 
                    className={classes.Header}>
                    {this.props.name}
                </div>
                <div className={classes.Wrap}>
                    <Transition
                        in={!this.state.categoryOpen}
                        timeout={duration}>
                        {(state) => (
                            <div
                                style={{
                                    ...defaultStyle,
                                    ...transitionStyles[state]
                                }}
                                ref={ (divElement) => {this.divElement = divElement}}>
                                {subcat_markup}
                            </div>
                        )}
                    </Transition>
                    
                </div>
            </div>
        );
    }
    
}

export default Category;