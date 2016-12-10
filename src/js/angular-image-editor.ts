/// <reference path="../../../minute/_all.d.ts" />

module Minute {

    export class AngularImageEditor implements ng.IServiceProvider {
        constructor() {
            this.$get.$inject = ['$rootScope', '$ui', '$q', '$http'];
        }

        $get = ($rootScope: ng.IRootScopeService, $ui: any, $q: ng.IQService, $http: ng.IHttpService) => {
            let service: any = {};
            let template = `
            <div class="box box-lg" ng-init="data.hide = hide">
                <div class="box-header with-border">
                    <b class="pull-left"><span translate="">Drag image to fit frame</span></b>
                    <a class="pull-right close-button" href=""><i class="fa fa-times"></i></a>
                    <div class="clearfix"></div>
                </div>
    
                <div class="box-body">
                    <div class="progress" ng-show="!data.init">
                        <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 90%">
                            <span translate="">Processing image..</span>
                        </div>
                    </div>
                    <image-cropper image-url="{{data.src}}" width="854" height="480" show-controls="false" fit-on-init="false" center-on-init="true" check-cross-origin="true"
                                   zoom-step="0.1" api="data.setApi" ng-mouseenter="data.hover = true" ng-mouseleave="data.hover = false"></image-cropper>
                    <img src="/static/bower_components/angular-image-editor/src/assets/images/youtube-bar.png" width="100%" class="hidden-xs hidden-sm" style="opacity: {{data.hover && '0.05' || '1'}}">
                </div>
    
                <div class="box-footer with-border">
                    <div class="pull-left">
                        <button type="button" class="btn btn-flat btn-default btn-sm" ng-click="data.api.rotate(-90)">
                            <i class="fa fa-undo"></i> <span translate="" class="hidden-xs hidden-sm">Rotate left</span>
                        </button>
                        <button type="button" class="btn btn-flat btn-default btn-sm" ng-click="data.api.zoomOut(0.2)">
                            <i class="fa fa-minus"></i> <span translate="" class="hidden-xs hidden-sm">Zoom out</span>
                        </button>
                        <button type="button" class="btn btn-flat btn-default btn-sm" ng-click="data.api.fit()">
                            <i class="fa fa-window-restore"></i> <span translate="" class="hidden-xs hidden-sm">Fit image</span>
                        </button>
                        <button type="button" class="btn btn-flat btn-default btn-sm" ng-click="data.api.zoomIn(0.2)">
                            <i class="fa fa-plus"></i> <span translate="" class="hidden-xs hidden-sm">Zoom in</span>
                        </button>
                        <button type="button" class="btn btn-flat btn-default btn-sm" ng-click="data.api.rotate(90)">
                            <i class="fa fa-repeat"></i> <span translate="" class="hidden-xs hidden-sm">Rotate left</span>
                        </button>
                    </div>
                    <button type="button" class="btn btn-flat btn-primary pull-right" ng-disabled="!data.init" ng-click="data.save()">
                        <span translate>Update image</span> <i class="fa fa-fw fa-angle-right"></i>
                    </button>
                </div>
             </div>`;

            service.edit = (url) => {
                var deferred = $q.defer();
                let data: any = {src: url, init: false};

                data.save = () => {
                    if (data.api) {
                        data.init = false;
                        var dataUri = data.api.crop();
                        var postData = {file: Minute.Utils.basename(url), data: dataUri};

                        $http.post('/generic/data-uploader', postData).then((obj: any) => {
                            deferred.resolve(obj.data.url);
                        }).finally(data.hide);
                    }
                };

                data.setApi = (api) => {
                    data.api = api;
                    data.init = true;
                };

                $ui.popup(template, false, null, {ctrl: service, data: data});

                return deferred.promise;
            };

            service.init = () => {
                return service;
            };

            return service.init();
        }
    }

    angular.module('AngularImageEditor', ['MinuteFramework', 'imageCropper'])
        .provider("$cropper", AngularImageEditor);
}