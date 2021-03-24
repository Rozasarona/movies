import React from 'react';
//import ReactDOM from 'react-dom';
import './App.css';


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
        };
    }
    componentDidMount() {
        fetch("https://api.themoviedb.org/3/search/movie?api_key=2174bad4d702278c7b79c6172f192382&language=en-US&query=return&page=1&include_adult=false")
            .then(res => res.json())
            .then(
               (result) => {
                   this.setState({
                       items: result.items
                   });
                   console.log(result);
               },
               
            )         
     }
    
    render()  {
        return(
            <div>Hello!</div>
        );
    }
}

export default App;