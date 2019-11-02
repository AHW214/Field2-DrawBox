System.register("lib", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("geo", [], function (exports_2, context_2) {
    "use strict";
    var Show, Line, Polygon, Parallelogram, Parallelepiped;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            Show = class Show {
                // @ts-ignore
                constructor(color = vec(1.0, 1.0, 1.0, 1.0)) {
                    this.color = color;
                }
            };
            Line = class Line extends Show {
                constructor(p1, p2, color) {
                    super(color);
                    this.p1 = p1;
                    this.p2 = p2;
                    this.draw = () => {
                        // @ts-ignore
                        var fline = new FLine();
                        fline.color = this.color;
                        fline.moveTo(this.p1);
                        fline.lineTo(this.p2);
                        // @ts-ignore
                        layer.lines.fline = fline;
                    };
                }
            };
            exports_2("Line", Line);
            Polygon = class Polygon extends Show {
                constructor(vertices, color) {
                    super(color);
                    this.draw = () => {
                        // @ts-ignore
                        var fline = new FLine();
                        fline.color = this.color;
                        fline.filled = true;
                        fline.moveTo(this.vertices[0]);
                        this.vertices.forEach(v => fline.lineTo(v));
                        // @ts-ignore
                        layer.lines.fline = fline;
                    };
                    if (vertices.length < 3) {
                        throw new Error("Plane requires at least 3 vertices");
                    }
                    this.vertices = vertices;
                }
                get numSides() {
                    return this.vertices.length;
                }
            };
            Parallelogram = class Parallelogram extends Polygon {
                constructor(v1, v2, v3, color) {
                    var v4 = v3 + (v1 - v2);
                    super(new Array(v1, v2, v3, v4), color);
                }
            };
            exports_2("Parallelogram", Parallelogram);
            Parallelepiped = class Parallelepiped extends Show {
                constructor(base, side, color) {
                    super(color);
                    this.draw = () => {
                        this.faces.forEach(f => f.draw());
                    };
                    var b1v = base.vertices;
                    var b2v = b1v.map(v => v + side);
                    var vertSets = [b1v,
                        b2v,
                        [b1v[0], b1v[1], b2v[1], b2v[0]],
                        [b1v[2], b1v[3], b2v[3], b2v[2]],
                        [b1v[0], b1v[2], b2v[2], b2v[0]],
                        [b1v[1], b1v[3], b2v[3], b2v[1]]
                    ];
                    this.faces = vertSets.map(vs => new Polygon(vs, color));
                }
            };
            exports_2("Parallelepiped", Parallelepiped);
        }
    };
});
System.register("state", ["geo"], function (exports_3, context_3) {
    "use strict";
    var geo_1, ZeroDimensions, OneDimension, TwoDimensions, ThreeDimensions;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (geo_1_1) {
                geo_1 = geo_1_1;
            }
        ],
        execute: function () {
            ZeroDimensions = class ZeroDimensions {
                constructor() {
                    this.onTick = () => {
                    };
                    this.onExit = () => new OneDimension();
                }
            };
            exports_3("ZeroDimensions", ZeroDimensions);
            OneDimension = class OneDimension {
                constructor() {
                    this.onTick = () => {
                        // @ts-ignore
                        var p2 = layer.vrRightHandPosition();
                        this.line = new geo_1.Line(this.p1, p2);
                        this.line.draw();
                    };
                    this.onExit = () => new TwoDimensions(this.line.p1, this.line.p2);
                    // @ts-ignore
                    this.p1 = layer.vrRightHandPosition();
                }
            };
            exports_3("OneDimension", OneDimension);
            TwoDimensions = class TwoDimensions {
                constructor(p1, p2) {
                    this.p1 = p1;
                    this.p2 = p2;
                    this.onTick = () => {
                        // @ts-ignore
                        var p3 = layer.vrRightHandPosition();
                        this.parallelogram = new geo_1.Parallelogram(this.p1, this.p2, p3);
                        this.parallelogram.draw();
                    };
                    this.onExit = () => new ThreeDimensions(this.parallelogram);
                }
            };
            exports_3("TwoDimensions", TwoDimensions);
            ThreeDimensions = class ThreeDimensions {
                constructor(parallelogram) {
                    this.parallelogram = parallelogram;
                    this.onTick = () => {
                        // @ts-ignore
                        var side = layer.vrRightHandPosition() - this.parallelogram.vertices[2];
                        this.parallelepiped = new geo_1.Parallelepiped(this.parallelogram, side);
                        this.parallelepiped.draw();
                    };
                    this.onExit = () => new ZeroDimensions();
                }
            };
            exports_3("ThreeDimensions", ThreeDimensions);
        }
    };
});
System.register("main", ["state"], function (exports_4, context_4) {
    "use strict";
    var state_1, layer, state;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (state_1_1) {
                state_1 = state_1_1;
            }
        ],
        execute: function () {
            //@ts-ignore
            layer = _.stage.withName("draw box");
            layer.vrDefaults();
            layer.lines.clear();
            state = new state_1.ZeroDimensions();
            // @ts-ignore
            layer.vrButtons.triggerDown.myCallback = () => {
                state = state.onExit();
            };
            // @ts-ignore
            while (_.wait()) {
                state.onTick();
            }
        }
    };
});
