/// <reference path="../../../minute/_all.d.ts" />
var Minute;
(function (Minute) {
    var AngularImageEditor = (function () {
        function AngularImageEditor() {
            this.$get = function ($rootScope, $ui, $q, $http) {
                var service = {};
                var template = "\n            <div class=\"box box-lg\" ng-init=\"data.hide = hide\">\n                <div class=\"box-header with-border\">\n                    <b class=\"pull-left\"><span translate=\"\">Drag image to fit frame</span></b>\n                    <a class=\"pull-right close-button\" href=\"\"><i class=\"fa fa-times\"></i></a>\n                    <div class=\"clearfix\"></div>\n                </div>\n    \n                <div class=\"box-body\">\n                    <div class=\"progress\" ng-show=\"!data.init\">\n                        <div class=\"progress-bar progress-bar-striped active\" role=\"progressbar\" aria-valuenow=\"45\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 90%\">\n                            <span translate=\"\">Processing image..</span>\n                        </div>\n                    </div>\n                    <image-cropper image-url=\"{{data.src}}\" width=\"854\" height=\"480\" show-controls=\"false\" fit-on-init=\"false\" center-on-init=\"true\" check-cross-origin=\"true\"\n                                   zoom-step=\"0.1\" api=\"data.setApi\" ng-mouseenter=\"data.hover = true\" ng-mouseleave=\"data.hover = false\"></image-cropper>\n                    <img src=\"/static/bower_components/angular-image-editor/src/assets/images/youtube-bar.png\" width=\"100%\" class=\"hidden-xs hidden-sm\" style=\"opacity: {{data.hover && '0.05' || '1'}}\">\n                </div>\n    \n                <div class=\"box-footer with-border\">\n                    <div class=\"pull-left\">\n                        <button type=\"button\" class=\"btn btn-flat btn-default btn-sm\" ng-click=\"data.api.rotate(-90)\">\n                            <i class=\"fa fa-undo\"></i> <span translate=\"\" class=\"hidden-xs hidden-sm\">Rotate left</span>\n                        </button>\n                        <button type=\"button\" class=\"btn btn-flat btn-default btn-sm\" ng-click=\"data.api.zoomOut(0.2)\">\n                            <i class=\"fa fa-minus\"></i> <span translate=\"\" class=\"hidden-xs hidden-sm\">Zoom out</span>\n                        </button>\n                        <button type=\"button\" class=\"btn btn-flat btn-default btn-sm\" ng-click=\"data.api.fit()\">\n                            <i class=\"fa fa-window-restore\"></i> <span translate=\"\" class=\"hidden-xs hidden-sm\">Fit image</span>\n                        </button>\n                        <button type=\"button\" class=\"btn btn-flat btn-default btn-sm\" ng-click=\"data.api.zoomIn(0.2)\">\n                            <i class=\"fa fa-plus\"></i> <span translate=\"\" class=\"hidden-xs hidden-sm\">Zoom in</span>\n                        </button>\n                        <button type=\"button\" class=\"btn btn-flat btn-default btn-sm\" ng-click=\"data.api.rotate(90)\">\n                            <i class=\"fa fa-repeat\"></i> <span translate=\"\" class=\"hidden-xs hidden-sm\">Rotate left</span>\n                        </button>\n                    </div>\n                    <button type=\"button\" class=\"btn btn-flat btn-primary pull-right\" ng-disabled=\"!data.init\" ng-click=\"data.save()\">\n                        <span translate>Update image</span> <i class=\"fa fa-fw fa-angle-right\"></i>\n                    </button>\n                </div>\n             </div>";
                service.edit = function (url) {
                    var deferred = $q.defer();
                    var data = { src: url, init: false };
                    data.save = function () {
                        if (data.api) {
                            data.init = false;
                            var dataUri = data.api.crop();
                            var postData = { file: Minute.Utils.basename(url), data: dataUri };
                            $http.post('/generic/data-uploader', postData).then(function (obj) {
                                deferred.resolve(obj.data.url);
                            }).finally(data.hide);
                        }
                    };
                    data.setApi = function (api) {
                        data.api = api;
                        data.init = true;
                    };
                    $ui.popup(template, false, null, { ctrl: service, data: data });
                    return deferred.promise;
                };
                service.init = function () {
                    return service;
                };
                return service.init();
            };
            this.$get.$inject = ['$rootScope', '$ui', '$q', '$http'];
        }
        return AngularImageEditor;
    }());
    Minute.AngularImageEditor = AngularImageEditor;
    angular.module('AngularImageEditor', ['MinuteFramework', 'imageCropper'])
        .provider("$cropper", AngularImageEditor);
})(Minute || (Minute = {}));
