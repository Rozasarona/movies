import React from 'react';
import { Input } from 'antd';
import  debounce from 'lodash.debounce';

class Search extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            searchTerm: ''
        }
    }

    setSearchTerm = searchValue => {
        this.setState({
            searchTerm: searchValue,
        });
    };

    onInput = async (event) => {
        await this.props.onSearchTextChange(event.target.value);
        this.setSearchTerm();
    };

    render() {
        return (
            <div className="searchContainer">
                <Input defaultValue={this.searchTerm} onInput={debounce(this.onInput, 300)} placeholder="Type to search..." />
            </div>
        );
    }
}

export default Search;