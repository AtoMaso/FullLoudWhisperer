"use strict";
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var app_component_1 = require('./app.component');
var router_deprecated_1 = require('@angular/router-deprecated');
var common_1 = require('@angular/common');
var http_1 = require('@angular/http');
var core_1 = require('ng2-idle/core');
var authentication_service_1 = require('./services/authentication.service');
var processmessage_service_1 = require('./services/processmessage.service');
var pagetitle_service_1 = require('./services/pagetitle.service');
var logger_service_1 = require('./services/logger.service');
platform_browser_dynamic_1.bootstrap(app_component_1.AppComponent, [http_1.HTTP_PROVIDERS, common_1.FORM_PROVIDERS,
    router_deprecated_1.ROUTER_PROVIDERS, core_1.IDLE_PROVIDERS,
    authentication_service_1.AuthenticationService, processmessage_service_1.ProcessMessageService,
    pagetitle_service_1.PageTitleService, logger_service_1.LoggerService]);
//# sourceMappingURL=main.js.map