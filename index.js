const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
var right = 0, left = 0, up = 0, down = 0, forward=0;

    var render = function() {

      canvasCtx.canvas.width = document.documentElement.clientWidth * 0.3;
      canvasCtx.canvas.height = document.documentElement.clientHeight * 0.6;

      
    };

    window.addEventListener("resize", render);

    render();


    
function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
  
  canvasCtx.drawImage(
      results.image, 0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
  if (results.multiFaceLandmarks) {
    for (const landmarks of results.multiFaceLandmarks) {
      
      drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, {color: '#E0E0E0'});
      
    }
  }

  if (results.multiFaceGeometry){
    
    for (const facegeometry of results.multiFaceGeometry){
      const pt_matrix = facegeometry.getPoseTransformMatrix().getPackedDataList();
      const pt_matrix_three_js_format = new THREE.Matrix4().fromArray(pt_matrix);
      const euler_angles = new THREE.Euler().setFromRotationMatrix(pt_matrix_three_js_format, 'XYZ');
      const pitch = THREE.MathUtils.radToDeg(euler_angles['x']);
      const yaw = THREE.MathUtils.radToDeg(euler_angles['y']);
      const roll = THREE.MathUtils.radToDeg(euler_angles['z']);

      

      canvasCtx.font = "20px Georgia";
      
     
      
     

      

      if(yaw<-15)
      {
        right++;
        canvasCtx.fillText("right", 20, 60);
        document.getElementById("right").innerHTML=(right/10).toFixed(2)+"s";
      }

      else if (yaw>15)
      {
        left++;
        canvasCtx.fillText("left", 20, 60);
        document.getElementById("left").innerHTML=(left/10).toFixed(2)+"s";
      }

      else if(pitch>15)
      {
        down++;

        canvasCtx.fillText("down", 20, 60);
        document.getElementById("down").innerHTML=(down/10).toFixed(2)+"s";

      }

      else if(pitch<-20)
      {
        up++;
        canvasCtx.fillText("up", 20, 60);
        document.getElementById("up").innerHTML=(up/10).toFixed(2)+"s";
        
      }

      



      else{
        forward++;
        canvasCtx.fillText("forward", 20, 60);
        document.getElementById("forward").innerHTML=(forward/10).toFixed(2)+"s";
      }

      
    }
  }

 
  canvasCtx.restore();
}

const faceMesh = new FaceMesh({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
}});
faceMesh.setOptions({
  maxNumFaces: 1,
  enableFaceGeometry: true,
  refineLandmarks: false,
  minDetectionConfidence: 0.3,
  minTrackingConfidence: 0.1
});
faceMesh.onResults(onResults);


const camera = new Camera(videoElement, {
  onFrame: async () => {
    await faceMesh.send({image: videoElement});
  },
  width: canvasCtx.canvas.width,
  height: canvasCtx.canvas.width
});






  

function stopCam() {


camera.stop();


}

function startCam() {


  camera.start();
  
  
  }


