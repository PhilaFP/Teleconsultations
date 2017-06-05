import React from "react";
import {Layer, Rect, Stage, Group, Image as KonvaImage} from 'react-konva';

import CommentEditor from "./CommentEditor";
import CommentView from "./CommentView";

const getFilterFromName = name => {
    switch (name) {
        case "Konva.Filters.Threshold": return Konva.Filters.Threshold;
        case "Konva.Filters.Grayscale": return Konva.Filters.Grayscale;
        case "Konva.Filters.Brighten": return Konva.Filters.Brighten;
        case "Konva.Filters.Posterize": return Konva.Filters.Posterize;
    }
}

export default class PhotoViewer extends React.Component {
    constructor(...props) {
        super(...props);

        this.ref = {
            img: null
        };

        this.state = {
            comment: null,
            coords: {
                width: 700,
                height: 700
            },
            image: null
        };

        this.lastWindowWidth = window.innerWidth;
        this.lastWindowHeight = window.innerHeight;
        this.resizeTimeout = null;

        this.onResize = () => {
            // clear the timeout
            if(this.resizeTimeout)
                clearTimeout(this.resizeTimeout);
            // start timing for event "completion"
            this.resizeTimeout = setTimeout(this.saveCoordinates, 250);
        }


    };

    saveCoordinates = () => {
        if(this.ref.img) {
            this.setState({
                coords: {
                    width: this.ref.img.clientWidth,
                    height: this.ref.img.clientHeight
                }
            });
        }
    };

    componentDidMount() {
       //window.addEventListener('resize', this.onResize, false);
          }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.photoId !== this.props.photoId){
            const image = new window.Image();
            image.src = this.props.image.photo ;
            image.crossOrigin = "Anonymous";
            image.onload = () => {
                this.setState({
                    image: image
                });
            }
        }
        else if (this.rect){
            this.rect.cache();
        }
    }

    componentWillUnmount() {
        //window.removeEventListener("resize", this.onResize, false);
    }

    registerImage = ref => {
        this.ref.img = ref;

        if (ref) {
            ref.onload = this.saveCoordinates;
        } else {
            this.setState({ coords: {} });
        }
    };

    onOverlayClick = event => {
        const x = event.nativeEvent.layerX / this.state.coords.width;
        const y = event.nativeEvent.layerY / this.state.coords.height;
        this.setState({
            comment: {
                x: x,
                y: y
            }
        });

    };

    publish = comment => {
        this.props.publishComment({
            comment: comment,
            coordinates: this.state.comment,
            id: this.props.photoId
        });

        this.clearNewComment();
    };

    clearNewComment = () => {
        this.setState({
            comment: null
        })
    };

    render() {
        if (!this.props.image)
            return <div className="photo-viewer"/>;

        //const overlayX = this.state.coords.width || 0;
        const overlayX = 700;
        const overlayY = 700;
        const style = {
            position: "absolute",
            width: `${overlayX}px`,
            height: `${overlayY}px`,
            left: "0px",
            top: "0px"
        };

        const filtersParameters = this.props.image.filters.reduce((result,filter) => {
                const parameterName = Object.keys(filter).filter(key => key !== "name");
                parameterName.forEach(name => {
                    result[name] = filter[name];
                });
                return result
            }, {}
        );

        const filters = this.props.image.filters.map((filter) => getFilterFromName(filter.name) );

        return (
            <div className="photo-viewer">
                <div>
                {(this.state.image)?

                    <Stage width = "700" height = "700" >
                        <Layer>
                            <KonvaImage
                                image={this.state.image}
                                filters={filters}
                                ref={(node) => {
                                    this.rect = node;
                                }}
                                {...filtersParameters}
                            />
                        </Layer>
                    </Stage> :

                    null
                    }

                {/* <img src={ this.props.image.photo } ref={ this.registerImage }/> */}

                <span style={ style } className="overlay"  onClick={ this.onOverlayClick }/>
                <CommentView comments={ this.props.image.comments } />
                {
                    (this.state.comment) ?
                        <CommentEditor x={ this.state.comment.x } y={ this.state.comment.y} publish={ this.publish } abort={ this.clearNewComment }/>
                        : null
                }
                </div>
            </div>
        );
    }
}