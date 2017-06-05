import React from "react";
import {Layer, Rect, Stage, Group} from 'react-konva';
import Slider from 'react-rangeslider'


const getParameterName = name => {
    switch (name) {
        case "Konva.Filters.Threshold": return "threshold";
        case "Konva.Filters.Grayscale": return "grayscale";
        case "Konva.Filters.Brighten": return "brightness";
        case "Konva.Filters.Posterize": return "levels";
    }
}

export default class PhotoFilter extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            image: null,
            value: null,
            filterType: null,
            filterTypeToDelete: null
        }
    }

    addFilter = () => {
        const getFilter = {
            name: this.state.filterType,
            [getParameterName(this.state.filterType)]: this.state.value
        }

        this.props.filter(getFilter,this.props.photoId);
    }


    handle = event => {
        const { value } = event.target;

        this.setState({ filterType: value });
    };


    render() {
        return (
            <div>
                <h3> Filter image </h3>
                <div className="radio">
                    <label>
                        <input type="radio" value="Konva.Filters.Threshold" checked={this.state.filterType === "Konva.Filters.Threshold"} onChange = {this.handle} />
                        Threshold
                    </label>
                </div>
                <div className="radio">
                    <label>
                        <input type="radio" value="Konva.Filters.Grayscale" checked={this.state.filterType === "Konva.Filters.Grayscale"} onChange = {this.handle} />
                        Grayscale
                    </label>
                </div>
                <div className="radio">
                    <label>
                        <input type="radio" value="Konva.Filters.Brighten" checked={this.state.filterType === "Konva.Filters.Brighten"} onChange = {this.handle} />
                        Brightness
                    </label>
                </div>
                <div className="radio">
                    <label>
                        <input type="radio" value="Konva.Filters.Posterize" checked={this.state.filterType === "Konva.Filters.Posterize"} onChange = {this.handle} />
                        Posterize
                    </label>
                </div>


                <div>
                    <Slider value = {this.state.value} step={0.1} min={0} max={1} onChange={(value) => this.setState({value: value})} />
                </div>

                <button onClick={this.addFilter}> Filter </button>


            </div>
        );

    }
}