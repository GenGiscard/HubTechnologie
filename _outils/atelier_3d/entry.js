import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
window.THREE = THREE; window.OrbitControls = OrbitControls; window.TransformControls = TransformControls; window.mergeGeometries = mergeGeometries;
