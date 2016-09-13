import THREE from 'three';
import Object3 from 'awv3/three/object3';

var canvas2d = document.createElement( 'canvas' );
canvas2d.width = 128;
canvas2d.height = 128;
var context = canvas2d.getContext( '2d' );
var gradient = context.createRadialGradient( canvas2d.width / 2, canvas2d.height / 2, 0, canvas2d.width / 2, canvas2d.height / 2, canvas2d.width / 2 );
gradient.addColorStop( 0.1, 'rgba(0,0,0,0.15)' );
gradient.addColorStop( 1, 'rgba(0,0,0,0)' );
context.fillStyle = gradient;
context.fillRect( 0, 0, canvas2d.width, canvas2d.height );
var shadowTexture = new THREE.CanvasTexture( canvas2d );
var shadowMaterial = new THREE.MeshBasicMaterial( { map: shadowTexture, transparent: true } );

export default class Presentation extends Object3 {
    constructor(models, options = {}, criteria = undefined) {
        super();

        this.criteria = criteria;
        this.options = {
            shadow: true,
            lights: true,
            edges: 0.3,
            ambient: 0,
            light: 1,
            ...options
        };

        this._objects = new Object3();
        super.add(this._objects);

        if (models && models.length > 0) {
            this.add(models);
        }
    }

    add(args) {
        this._objects.add(args);
        this._objects.centerGeometry().updateMaterials();
        this._objects.traverse(item => {
            if (item.type === 'Mesh') {

                let values = {
                    color: item.material.color,
                    emissive: new THREE.Color(0),
                    metalness: 0.5,
                    roughness: 0.8,
                    clearCoat: 0.3,
                    clearCoatRoughness: 0.7
                };

                if (this.criteria) {
                    values = { ...values, ...this.criteria({
                        item,
                        radius: item.getRadius(),
                        hsl: item.material.color && item.material.color.getHSL()
                    }, values) };
                }

                item.castShadow = true;
                item.receiveShadow = true;

                if (item.material instanceof THREE.MultiMaterial) {

                    delete values.color;
                    item.material.materials = item.material.materials.map(item => {
                        let material = new THREE.MeshPhysicalMaterial({
                            reflectivity: 1,
                            fog: false,
                            polygonOffset: true,
                            polygonOffsetFactor: 1,
                            polygonOffsetUnits: 1,
                            transparent: true,
                            color: item.color,
                            opacity: item.opacity,
                            ...values
                        });

                        material.meta = item.meta;
                        material.parent = item.parent;
                        material.dispose();
                        return material;
                    });

                } else {

                    item.material = new THREE.MeshPhysicalMaterial({
                        reflectivity: 1,
                        fog: false,
                        polygonOffset: true,
                        polygonOffsetFactor: 1,
                        polygonOffsetUnits: 1,
                        transparent: true,
                        opacity: item.material.opacity,
                        ...values,
                    });

                }

            } else if (item.type === 'LineSegments') {
                if (this.options.edges) {

                    if (item.material instanceof THREE.MultiMaterial) {
                        item.material.materials.forEach(item => item.opacity = this.options.edges);
                    } else {
                        item.material.opacity = this.options.edges;
                    }
                } else {
                    item.destroy();
                }
            }
        });

        this.update();
    }

    update() {

        this.viewFound().then( () => {

            this._lights && this._lights.destroy();
            this._stage && this._stage.destroy();

            this._stage = new Object3();
            super.add(this._stage);

            this._lights = new Object3();
            this._lights.interactive = false;
            this._lights.tweens = false;
            super.add(this._lights);

            this._objects.updateBounds();
            var min = this._objects.bounds.box.min;
            var max = this._objects.bounds.box.max;
            let width = max.distanceTo(new THREE.Vector3(min.x, max.y, max.z));
            let height = max.distanceTo(new THREE.Vector3(max.x, min.y, max.z));
            let depth = max.distanceTo(new THREE.Vector3(max.x, max.y, min.z));

            this._stage.position.copy(this._objects.position);
            this._stage.position.y -= height / 1.2;
            this._stage.rotation.x = - Math. PI / 2;

            if (this.options.ambient) {
                let ambient = new THREE.AmbientLight(0xffffff);
                ambient.intensity = this.options.ambient;
                this._lights.add(ambient);
            }

            let coords = this._objects.updateBounds().getRadius() * 6;
            this._lights.add(new THREE.PointLight(0xffffff, this.options.light / 2).setPosition(-coords, 0, 0));
            this._lights.add(new THREE.SpotLight(0xffffff, this.options.light / 2).setPosition(0, -coords, -coords * 2));
            this._lights.add(new THREE.PointLight(0xffffff, this.options.light / 2).setPosition(coords, 0, 0));
            this._lights.add(new THREE.PointLight(0xffffff, this.options.light / 2).setPosition(0, coords, 0));
            this._lights.add(new THREE.PointLight(0xffffff, this.options.light / 2).setPosition(0, 0, coords));

            let vec = this.parent.worldToLocal(new THREE.Vector3(-coords / 2, coords, coords / 2));
            let spotLight = new THREE.SpotLight( 0xffffff, this.options.light, coords * 1.5, Math.PI / 6 );
            spotLight.position.copy(vec);
            spotLight.target = this._objects;
            spotLight.castShadow = true;
            spotLight.penumbra = 1;
            spotLight.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 10, 1, 100, coords * 1.5 ) );
            spotLight.shadow.mapSize.width = 2048;
            spotLight.shadow.mapSize.height = 2048;
            this._lights.add( spotLight );

            var shadowGeo = new THREE.PlaneBufferGeometry( width * 1.2, depth * 1.2, 1, 1 );
            var mesh = new THREE.Mesh( shadowGeo, shadowMaterial )
            this._stage.add( mesh );
        })
    }

    getModels() {
        return this._objects;
    }

    getLights() {
        return this._lights;
    }

    getStage() {
        return this._stage;
    }

}
