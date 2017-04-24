/// <reference path="../../../minute/_all.d.ts" />

module Minute {

    export class AngularImageEditor implements ng.IServiceProvider {
        constructor() {
            this.$get.$inject = ['$rootScope', '$ui', '$q', '$http', '$timeout'];
        }

        $get = ($rootScope: ng.IRootScopeService, $ui: any, $q: ng.IQService, $http: ng.IHttpService, $timeout: ng.ITimeoutService) => {
            let service: any = {};
            let template = `
            <div class="box box-lg" ng-style="{maxWidth: options.width + 30}">
                <div class="box-header with-border">
                    <b class="pull-left"><span translate="">Drag image to fit frame</span></b>
                    <a class="pull-right close-button" href=""><i class="fa fa-times"></i></a>
                    <div class="clearfix"></div>
                </div>
    
                <div class="box-body">
                    <div class="progress" ng-show="!options.init">
                        <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 90%">
                            <span translate="">Processing image..</span>
                        </div>
                    </div>
                    <div ng-style="{width: options.width, height: options.height}" ng-show="options.init" style="background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAFXRFWHRDcmVhdGlvbiBUaW1lAAfhAgMKFw5DFFE+AAAAB3RJTUUH4QIDChgiI1XCYgAAAAlwSFlzAAALEgAACxIB0t1+/AAAACtJREFUeNpjPH36NAM2YGJiglWciYFEMKqBGMD4//9/rBJnzpwZKn4YDhoAPiMIfb3XiN8AAAAASUVORK5CYII=)">
                        <canvas id="canvas" width="{{options.width}}" height="{{options.height}}" style="cursor:move">Canvas is not supported</canvas>
                    </div>
                </div>
                
                <hr>
    
                <div class="box-footer with-border" ng-show="options.init">
                    <div class="pull-left">
                        <button type="button" class="btn btn-flat btn-default btn-sm" ng-click="rotate(-90)">
                            <i class="fa fa-undo"></i> <span translate="" class="hidden-xs hidden-sm">Rotate left</span>
                        </button>
                        <button type="button" class="btn btn-flat btn-default btn-sm" ng-click="rotate(90)">
                            <i class="fa fa-repeat"></i> <span translate="" class="hidden-xs hidden-sm">Rotate right</span>
                        </button>
                        <span class="divider"></span>
                        <button type="button" class="btn btn-flat btn-default btn-sm" ng-click="zoom(0.1)">
                            <i class="fa fa-plus"></i> <span translate="" class="hidden-xs hidden-sm">Zoom in</span>
                        </button>
                        <button type="button" class="btn btn-flat btn-default btn-sm" ng-click="zoom(-0.1)">
                            <i class="fa fa-minus"></i> <span translate="" class="hidden-xs hidden-sm">Zoom out</span>
                        </button>
                        <span class="divider"></span>
                        <div class="btn-group">
                            <button type="button" class="btn btn-flat btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fa fa-arrows"></i> <span translate="" class="hidden-xs hidden-sm">Position</span> <span class="caret"></span>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a href="#" ng-click="fit()"><i class="fa fa-fw fa-window-restore"></i> Fit image</a></li>
                                <li><a href="#" ng-click="center()"><i class="fa fa-align-center"></i> Center image</a></li>
                            </ul>
                        </div>
                        <span class="divider"></span>
                        <div class="btn-group">
                            <button type="button" class="btn btn-flat btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fa fa-tint"></i> <span translate="" class="hidden-xs hidden-sm">Filters</span> <span class="caret"></span>
                            </button>
            
                            <ul class="dropdown-menu">
                                <li><a href="#" ng-click="flipV()"><i class="fa fa-fw fa-arrows-v"></i> Flip vertical</a></li>
                                <li><a href="#" ng-click="flipH()"><i class="fa fa-fw fa-arrows-h"></i> Flip horizontal</a></li>
                                <li role="separator" class="divider"></li>
                                <li><a href="#" ng-click="filterBw()"><i class="fa fa-fw {{bw && 'fa-check' || 'fa-tint'}}"></i> Black &amp; White</a></li>
                                <li><a href="#" ng-click="filterBlur()"><i class="fa fa-fw fa-low-vision"></i> Blur image</a></li>
                            </ul>
                        </div>
                    </div>
                    <button type="button" class="btn btn-flat btn-primary pull-right" ng-disabled="!options.init" ng-click="crop()">
                        <span translate>Save</span> <i class="fa fa-fw fa-angle-right"></i>
                    </button>
                    
                    <div class="clearfix"></div>    
                </div>
             </div>`;

            service.popup = (src, options: any = {width: 854, height: 480}) => {
                let deferred = $q.defer();
                let $scope: any = $rootScope.$new();
                let img = new Image();
                let canvas, stage, bmp;
                let createjs: any = window['createjs'];
                let params: any = {};

                $scope.options = angular.extend({width: 854, height: 480, init: false}, options || {});

                $scope.go = function () {
                    canvas = document.getElementById('canvas');
                    stage = new createjs.Stage(canvas);
                    bmp = new createjs.Bitmap(img).set();

                    bmp.on("pressmove", function (evt) {
                        let ct = evt.currentTarget;

                        ct.x = evt.stageX;
                        ct.y = evt.stageY;

                        stage.update();
                    });

                    bmp.on('mousedown', function (evt) {
                        let ct = evt.currentTarget,
                            local = ct.globalToLocal(evt.stageX, evt.stageY),
                            nx = ct.regX - local.x,
                            ny = ct.regY - local.y;
                        //set the new regX/Y
                        ct.regX = local.x;
                        ct.regY = local.y;
                        //adjust the real-position, otherwise the new regX/Y would cause a jump
                        ct.x -= nx;
                        ct.y -= ny;
                    });

                    stage.addChild(bmp);
                    createjs.Touch.enable(stage);
                    $scope.center();
                    $timeout(() => $scope.options.init = true);
                };

                $scope.center = function () {
                    bmp.regX = img.width / 2;
                    bmp.regY = img.height / 2;
                    bmp.x = canvas.width / 2;
                    bmp.y = canvas.height / 2;

                    stage.update();
                };

                $scope.fit = function () {
                    let scaleX = canvas.width / img.width;
                    let scaleY = canvas.height / img.height;

                    bmp.scaleX = Math.max(scaleX, scaleY) * (bmp.scaleX < 0 ? -1 : 1);
                    bmp.scaleY = Math.max(scaleX, scaleY) * (bmp.scaleY < 0 ? -1 : 1);
                    $scope.center();
                };

                $scope.zoom = function (by) {
                    let scale = bmp.scaleX + by;//Math.max(canvas.width / img.width, canvas.height / img.height, bmp.scaleX + by);
                    bmp.scaleX = scale * (bmp.scaleX < 0 ? -1 : 1);
                    bmp.scaleY = scale * (bmp.scaleY < 0 ? -1 : 1);

                    stage.update();
                };

                $scope.rotate = function (deg) {
                    bmp.rotation += deg;
                    stage.update();
                };

                $scope.crop = function () {
                    let postData = {file: Minute.Utils.basename(src), data: canvas.toDataURL("image/png")};
                    $scope.options.init = false;

                    $http.post('/generic/data-uploader', postData).then((obj: any) => {
                        deferred.resolve(obj.data.url);
                    }).finally($scope.hide);
                };

                $scope.flipV = function () {
                    bmp.scaleY = -bmp.scaleY;
                    stage.update();
                };

                $scope.flipH = function () {
                    bmp.scaleX = -bmp.scaleX;
                    stage.update();
                };

                $scope.filterBw = function () {
                    $scope.bw = !$scope.bw;
                    let colorMatrix = new createjs.ColorMatrix();
                    colorMatrix.adjustSaturation($scope.bw ? -100 : 0);
                    let blackAndWhiteFilter = new createjs.ColorMatrixFilter(colorMatrix);
                    bmp.filters = [blackAndWhiteFilter];
                    bmp.cache(0, 0, img.width, img.height);
                    stage.update();
                };

                $scope.filterBlur = function () {
                    let blurFilter = new createjs.BlurFilter(64, 0, 1);
                    bmp.filters = (bmp.filters || []).concat(blurFilter);
                    bmp.cache(0, 0, img.width, img.height);
                    stage.update();
                };

                img.onload = $scope.go;
                img.crossOrigin = 'anonymous';
                img.src = src + ((/\?/.test(src) ? '&' : '?') + 'timestamp=' + Math.random());

                $ui.popup(template, false, $scope, params);

                return deferred.promise;
            };

            service.init = () => {
                return service;
            };

            return service.init();
        }
    }

    angular.module('AngularImageEditor', ['MinuteFramework'])
        .provider("$cropper", AngularImageEditor);
}