import React from 'react';
import { Input } from 'antd';



class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = { typeOfSearch: ''}

    this.onInput = this.onInput.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    onInput(event) {
        this.setState({typeOfSearch: event.target.value })
    }

    this.onSubmit(event) {

    }

    this.componentDidUpdate() {
        
    }

    render() {

    }

    return(
        <div className="searchContainer">
            <Input placeholder="Type to search..." />
        </div>
    )
}

export default Search;