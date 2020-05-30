import React from 'react';

class View extends React.Component {

    constructor(props){
        super(props);
        this.state = {

        }
       this.video = document.querySelector('video');
    }
    componentDidMount() {
        
    }



   
    /* const canvas = document.querySelector('canvas');
    const video = document.querySelector('video');

    const stream = canvas.captureStream();
    video.srcObject = stream; */
    render(){
        return (<div><video playsinline autoplay></video></div>)
    }
}

export default View;
