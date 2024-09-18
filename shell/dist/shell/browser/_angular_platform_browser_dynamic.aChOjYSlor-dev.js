// ../node_modules/@angular/platform-browser-dynamic/fesm2022/platform-browser-dynamic.mjs
import * as i0 from "@angular/core";
import { Compiler, ViewEncapsulation, Injector, createPlatformFactory, platformCore, COMPILER_OPTIONS, CompilerFactory, Injectable, PLATFORM_ID, Version } from "@angular/core";
import { CompilerConfig, ResourceLoader } from "@angular/compiler";
import { \u0275PLATFORM_BROWSER_ID } from "@angular/common";
import { \u0275INTERNAL_BROWSER_PLATFORM_PROVIDERS } from "@angular/platform-browser";
var COMPILER_PROVIDERS = [{
  provide: Compiler,
  useFactory: () => new Compiler()
}];
var JitCompilerFactory = class {
  /** @internal */
  constructor(defaultOptions) {
    const compilerOptions = {
      defaultEncapsulation: ViewEncapsulation.Emulated
    };
    this._defaultOptions = [compilerOptions, ...defaultOptions];
  }
  createCompiler(options = []) {
    const opts = _mergeOptions(this._defaultOptions.concat(options));
    const injector = Injector.create({
      providers: [COMPILER_PROVIDERS, {
        provide: CompilerConfig,
        useFactory: () => {
          return new CompilerConfig({
            defaultEncapsulation: opts.defaultEncapsulation,
            preserveWhitespaces: opts.preserveWhitespaces
          });
        },
        deps: []
      }, opts.providers]
    });
    return injector.get(Compiler);
  }
};
function _mergeOptions(optionsArr) {
  return {
    defaultEncapsulation: _lastDefined(optionsArr.map((options) => options.defaultEncapsulation)),
    providers: _mergeArrays(optionsArr.map((options) => options.providers)),
    preserveWhitespaces: _lastDefined(optionsArr.map((options) => options.preserveWhitespaces))
  };
}
function _lastDefined(args) {
  for (let i = args.length - 1; i >= 0; i--) {
    if (args[i] !== void 0) {
      return args[i];
    }
  }
  return void 0;
}
function _mergeArrays(parts) {
  const result = [];
  parts.forEach((part) => part && result.push(...part));
  return result;
}
var platformCoreDynamic = createPlatformFactory(platformCore, "coreDynamic", [{
  provide: COMPILER_OPTIONS,
  useValue: {},
  multi: true
}, {
  provide: CompilerFactory,
  useClass: JitCompilerFactory,
  deps: [COMPILER_OPTIONS]
}]);
var ResourceLoaderImpl = class _ResourceLoaderImpl extends ResourceLoader {
  get(url) {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "text";
    xhr.onload = function() {
      const response = xhr.response;
      let status = xhr.status;
      if (status === 0) {
        status = response ? 200 : 0;
      }
      if (200 <= status && status <= 300) {
        resolve(response);
      } else {
        reject(`Failed to load ${url}`);
      }
    };
    xhr.onerror = function() {
      reject(`Failed to load ${url}`);
    };
    xhr.send();
    return promise;
  }
  static {
    this.\u0275fac = /* @__PURE__ */ (() => {
      let \u0275ResourceLoaderImpl_BaseFactory;
      return function ResourceLoaderImpl_Factory(__ngFactoryType__) {
        return (\u0275ResourceLoaderImpl_BaseFactory || (\u0275ResourceLoaderImpl_BaseFactory = i0.\u0275\u0275getInheritedFactory(_ResourceLoaderImpl)))(__ngFactoryType__ || _ResourceLoaderImpl);
      };
    })();
  }
  static {
    this.\u0275prov = /* @__PURE__ */ i0.\u0275\u0275defineInjectable({
      token: _ResourceLoaderImpl,
      factory: _ResourceLoaderImpl.\u0275fac
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i0.\u0275setClassMetadata(ResourceLoaderImpl, [{
    type: Injectable
  }], null, null);
})();
var INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS = [\u0275INTERNAL_BROWSER_PLATFORM_PROVIDERS, {
  provide: COMPILER_OPTIONS,
  useValue: {
    providers: [{
      provide: ResourceLoader,
      useClass: ResourceLoaderImpl,
      deps: []
    }]
  },
  multi: true
}, {
  provide: PLATFORM_ID,
  useValue: \u0275PLATFORM_BROWSER_ID
}];
var VERSION = new Version("18.2.4");
var platformBrowserDynamic = createPlatformFactory(platformCoreDynamic, "browserDynamic", INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS);
export {
  JitCompilerFactory,
  VERSION,
  platformBrowserDynamic,
  INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS as \u0275INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
  platformCoreDynamic as \u0275platformCoreDynamic
};
/*! Bundled license information:

@angular/platform-browser-dynamic/fesm2022/platform-browser-dynamic.mjs:
  (**
   * @license Angular v18.2.4
   * (c) 2010-2024 Google LLC. https://angular.io/
   * License: MIT
   *)
*/
//# sourceMappingURL=_angular_platform_browser_dynamic.aChOjYSlor-dev.js.map
