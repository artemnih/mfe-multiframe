var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b ||= {})
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// ../node_modules/@softarc/native-federation-runtime/fesm2022/softarc-native-federation-runtime.mjs
function mergeImportMaps(map1, map2) {
  return {
    imports: __spreadValues(__spreadValues({}, map1.imports), map2.imports),
    scopes: __spreadValues(__spreadValues({}, map1.scopes), map2.scopes)
  };
}
var nfNamespace = "__NATIVE_FEDERATION__";
var global = globalThis;
global[nfNamespace] ??= {
  externals: /* @__PURE__ */ new Map(),
  remoteNamesToRemote: /* @__PURE__ */ new Map(),
  baseUrlToRemoteNames: /* @__PURE__ */ new Map()
};
var globalCache = global[nfNamespace];
var externals = globalCache.externals;
function getExternalKey(shared) {
  return `${shared.packageName}@${shared.version}`;
}
function getExternalUrl(shared) {
  const packageKey = getExternalKey(shared);
  return externals.get(packageKey);
}
function setExternalUrl(shared, url) {
  const packageKey = getExternalKey(shared);
  externals.set(packageKey, url);
}
function getDirectory(url) {
  const parts = url.split("/");
  parts.pop();
  return parts.join("/");
}
function joinPaths(path1, path2) {
  while (path1.endsWith("/")) {
    path1 = path1.substring(0, path1.length - 1);
  }
  if (path2.startsWith("./")) {
    path2 = path2.substring(2, path2.length);
  }
  return `${path1}/${path2}`;
}
var remoteNamesToRemote = globalCache.remoteNamesToRemote;
var baseUrlToRemoteNames = globalCache.baseUrlToRemoteNames;
function addRemote(remoteName, remote) {
  remoteNamesToRemote.set(remoteName, remote);
  baseUrlToRemoteNames.set(remote.baseUrl, remoteName);
}
function getRemoteNameByBaseUrl(baseUrl) {
  return baseUrlToRemoteNames.get(baseUrl);
}
function isRemoteInitialized(baseUrl) {
  return baseUrlToRemoteNames.has(baseUrl);
}
function getRemote(remoteName) {
  return remoteNamesToRemote.get(remoteName);
}
function appendImportMap(importMap) {
  document.head.appendChild(Object.assign(document.createElement("script"), {
    type: "importmap-shim",
    innerHTML: JSON.stringify(importMap)
  }));
}
function initFederation() {
  return __async(this, arguments, function* (remotesOrManifestUrl = {}) {
    const remotes = typeof remotesOrManifestUrl === "string" ? yield loadManifest(remotesOrManifestUrl) : remotesOrManifestUrl;
    const hostImportMap = yield processHostInfo();
    const remotesImportMap = yield processRemoteInfos(remotes);
    const importMap = mergeImportMaps(hostImportMap, remotesImportMap);
    appendImportMap(importMap);
    return importMap;
  });
}
function loadManifest(remotes) {
  return __async(this, null, function* () {
    return yield fetch(remotes).then((r) => r.json());
  });
}
function processRemoteInfos(remotes) {
  return __async(this, null, function* () {
    const processRemoteInfoPromises = Object.keys(remotes).map((remoteName) => __async(this, null, function* () {
      try {
        const url = remotes[remoteName];
        return yield processRemoteInfo(url, remoteName);
      } catch (e) {
        console.error(`Error loading remote entry for ${remoteName} from file ${remotes[remoteName]}`);
        return null;
      }
    }));
    const remoteImportMaps = yield Promise.all(processRemoteInfoPromises);
    const importMap = remoteImportMaps.reduce((acc, remoteImportMap) => remoteImportMap ? mergeImportMaps(acc, remoteImportMap) : acc, {
      imports: {},
      scopes: {}
    });
    return importMap;
  });
}
function processRemoteInfo(federationInfoUrl, remoteName) {
  return __async(this, null, function* () {
    const baseUrl = getDirectory(federationInfoUrl);
    const remoteInfo = yield loadFederationInfo(federationInfoUrl);
    if (!remoteName) {
      remoteName = remoteInfo.name;
    }
    const importMap = createRemoteImportMap(remoteInfo, remoteName, baseUrl);
    addRemote(remoteName, __spreadProps(__spreadValues({}, remoteInfo), {
      baseUrl
    }));
    return importMap;
  });
}
function createRemoteImportMap(remoteInfo, remoteName, baseUrl) {
  const imports = processExposed(remoteInfo, remoteName, baseUrl);
  const scopes = processRemoteImports(remoteInfo, baseUrl);
  return {
    imports,
    scopes
  };
}
function loadFederationInfo(url) {
  return __async(this, null, function* () {
    const info = yield fetch(url).then((r) => r.json());
    return info;
  });
}
function processRemoteImports(remoteInfo, baseUrl) {
  const scopes = {};
  const scopedImports = {};
  for (const shared of remoteInfo.shared) {
    const outFileName = getExternalUrl(shared) ?? joinPaths(baseUrl, shared.outFileName);
    setExternalUrl(shared, outFileName);
    scopedImports[shared.packageName] = outFileName;
  }
  scopes[baseUrl + "/"] = scopedImports;
  return scopes;
}
function processExposed(remoteInfo, remoteName, baseUrl) {
  const imports = {};
  for (const exposed of remoteInfo.exposes) {
    const key = joinPaths(remoteName, exposed.key);
    const value = joinPaths(baseUrl, exposed.outFileName);
    imports[key] = value;
  }
  return imports;
}
function processHostInfo() {
  return __async(this, null, function* () {
    const hostInfo = yield loadFederationInfo("./remoteEntry.json");
    const imports = hostInfo.shared.reduce((acc, cur) => __spreadProps(__spreadValues({}, acc), {
      [cur.packageName]: "./" + cur.outFileName
    }), {});
    for (const shared of hostInfo.shared) {
      setExternalUrl(shared, "./" + shared.outFileName);
    }
    return {
      imports,
      scopes: {}
    };
  });
}
function loadRemoteModule(optionsOrRemoteName, exposedModule) {
  return __async(this, null, function* () {
    const options = normalizeOptions(optionsOrRemoteName, exposedModule);
    yield ensureRemoteInitialized(options);
    const remoteName = getRemoteNameByOptions(options);
    const remote = getRemote(remoteName);
    if (!remote) {
      throw new Error("unknown remote " + remoteName);
    }
    const exposed = remote.exposes.find((e) => e.key === options.exposedModule);
    if (!exposed) {
      throw new Error(`Unknown exposed module ${options.exposedModule} in remote ${remoteName}`);
    }
    const url = joinPaths(remote.baseUrl, exposed.outFileName);
    const module = yield importShim(url);
    return module;
  });
}
function getRemoteNameByOptions(options) {
  let remoteName;
  if (options.remoteName) {
    remoteName = options.remoteName;
  } else if (options.remoteEntry) {
    const baseUrl = getDirectory(options.remoteEntry);
    remoteName = getRemoteNameByBaseUrl(baseUrl);
  } else {
    throw new Error("unexpcted arguments: Please pass remoteName or remoteEntry");
  }
  if (!remoteName) {
    throw new Error("unknown remoteName " + remoteName);
  }
  return remoteName;
}
function ensureRemoteInitialized(options) {
  return __async(this, null, function* () {
    if (options.remoteEntry && !isRemoteInitialized(getDirectory(options.remoteEntry))) {
      const importMap = yield processRemoteInfo(options.remoteEntry);
      appendImportMap(importMap);
    }
  });
}
function normalizeOptions(optionsOrRemoteName, exposedModule) {
  let options;
  if (typeof optionsOrRemoteName === "string" && exposedModule) {
    options = {
      remoteName: optionsOrRemoteName,
      exposedModule
    };
  } else if (typeof optionsOrRemoteName === "object" && !exposedModule) {
    options = optionsOrRemoteName;
  } else {
    throw new Error("unexpected arguments: please pass options or a remoteName/exposedModule-pair");
  }
  return options;
}
export {
  initFederation,
  loadRemoteModule,
  processRemoteInfo
};
//# sourceMappingURL=@angular-architects_native-federation.js.map
