import React, { Component } from 'react';
import * as automl from '@tensorflow/tfjs-automl';
import '@tensorflow/tfjs-backend-webgl';
//import SampleDog from '../images/dogTest.jpg';
import './imageloader.css';

export class ImageLoader extends Component {

        
          constructor(props){
            super(props)
            this.state = {
                currentImage: '',
                previewImage: 'https://media.istockphoto.com/vectors/cat-and-dog-peeking-over-blank-sign-vector-id1141985544',
                predictScore: []
            }
          
          }

        fileSelectedHandle = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
        
            reader.onload = () =>{
              if(reader.readyState === 2) {
                const img = document.createElement("img"); //tensorflow requires an image element or ImageData as input.
                img.src = reader.result;
                this.setState({ currentImage: img, previewImage: reader.result });
              }
            }
            reader.readAsDataURL(file)
        }



    classifyImage = async () => {
        const model = await automl.loadImageClassification('./image_classification_model_v1/model.json')

        //const img = document.getElementById('animal_image');

        const {currentImage} = this.state
        const predictions = await model.classify(currentImage)

        console.log('predictions', predictions)
        this.setState({predictScore: predictions})
    }

    render() {

        const { previewImage } = this.state
        const { predictScore } = this.state

        const { label, prob } = predictScore.reduce(
            (acc, item) => (acc = acc.prob > item.prob ? acc : item),
            {}
          );

        return (
            <div className="container">
               <div className="img-main">
                <h2>Image Classification Demo</h2>
                <p>Upload an image of a cat or dog to check the prediction score</p>
                <div >
                    <input 
                        type="file" 
                        accept="image/*"
                        name="image-upload"
                        id="input"
                        onChange={this.fileSelectedHandle} 
                    />
                </div>
                <div className="img-display">
                    <img id="animal_image" src={previewImage} alt="a test" />

                      {this.state.predictScore.length ? 
                        <span 
                            className="img-result">
                            The classification model predicted the uploaded image is {Math.round(prob * 100)}% of a {label} 
                        </span>
                        : <div></div>
                      }
                     
                </div>
                    { this.state.currentImage === '' ?
                    <div></div>
                    :<button 
                        className="img-loader-button"
                        onClick={() => this.classifyImage()}>Predict Score
                    </button>
                      }
               </div>

            </div>
        )
    }
}

export default ImageLoader
