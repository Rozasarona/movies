import React from 'react';
import { Input } from 'antd';
import  debounce from 'lodash.debounce';

function Search({ onSearchTextChange, value }) {
    const onInput = async (event) => {
        await onSearchTextChange(event.target.value);
    }

    return (
        <div className="searchContainer">
            <Input defaultValue={value} onInput={debounce(onInput, 300)} placeholder="Type to search..." />
        </div>
    );
}

export default Search;