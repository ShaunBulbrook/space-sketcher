import React from 'react';
import PropTypes from 'prop-types';

import io from 'socket.io-client';
import * as three from 'three';

import OrbitControls from 'orbit-controls-es6';


class Stage extends React.Component {
	constructor(props) {
		super(props);
		this.renderRef = React.createRef();
		this.scene = new three.Scene();
		this.camera = new three.PerspectiveCamera(100, this.props.width/this.props.height, 1, 2000);
		this.renderer = new three.WebGLRenderer({antialias:true});
		this.data = [];
		this.cubes = [];

	}
	render() {
		return (
			<div className="Stage" ref={this.renderRef}></div>
		);
	}

	componentDidMount() {
		this.connectSocket();
		this.constructStage();

		this.animate();
	}

	connectSocket() {
		this.socket = io('localhost:3000');

		this.socket.on('generation', data => {
			this.data = data.data;
		});

	}

	constructStage() {
		this.renderer.setSize(this.props.width, this.props.height);
		this.renderRef.current.appendChild(this.renderer.domElement);


		//box prop
		this.pointGeom = new three.BoxGeometry( 10, 10, 10 );
		this.pointMat = new three.MeshBasicMaterial( {color: 0x00ff00} );


		//position camera
		this.controls = new OrbitControls(this.camera);
		this.controls.enabled = true;
		this.camera.position.x = -500;
		this.camera.position.z = -500;
		this.camera.position.y = -20;

		this.controls.target = new three.Vector3(0,50,0);
		this.controls.update();

		const gridHelper = new three.GridHelper(1000, 100);
		this.scene.add(gridHelper);
	}

	setupControls() {
		// TODO: Add key listeners
	}

	animate() {
		const moveSpeed = 0.3;
		// console.log(this.data.length);
		if(this.data.length){
			for(var i = 0; i < this.data.length; i++) {
				if(this.cubes[i]) {
					this.cubes[i].position.x = this.cubes[i].position.x < this.data[i].x -500 ? this.cubes[i].position.x += moveSpeed : this.cubes[i].position.x -= moveSpeed;
					this.cubes[i].position.y = this.cubes[i].position.y < this.data[i].fitness ? this.cubes[i].position.y += moveSpeed : this.cubes[i].position.y -= moveSpeed;
					this.cubes[i].position.z = this.cubes[i].position.z < this.data[i].y -500 ? this.cubes[i].position.z += moveSpeed : this.cubes[i].position.z -= moveSpeed;
				}
				else {
					this.cubes.push(new three.Mesh(this.pointGeom, this.pointMat));
					this.scene.add(this.cubes[i]);
					this.cubes[i].position.x = this.data[i].x -500;
					this.cubes[i].position.y = this.data[i].fitness;
					this.cubes[i].position.z = this.data[i].y -500;
				}
			}
		}


		this.renderer.render( this.scene, this.camera );
		window.requestAnimationFrame(this.animate.bind(this));
	}

}

Stage.propTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
};

export default Stage;
