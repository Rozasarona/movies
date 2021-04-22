import React from 'react';
import { Input } from 'antd';
import  debounce from 'lodash.debounce';



class Search extends React.Component {

    constructor(props) {
        super(props);
        this.onInput = this.onInput.bind(this);
    }

    onInput(event) {
        this.props.onSearchTextChange(event.target.value);
    }

    componentDidUpdate() {

    }

    render() {
        return(
            <div className="searchContainer">
                <Input onInput = {debounce(this.onInput, 300)}  placeholder="Type to search..." />
            </div>
        );
    }
}

export default Search;