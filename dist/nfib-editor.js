/**
 * @license text 2.0.15 Copyright jQuery Foundation and other contributors.
 * Released under MIT license, http://github.com/requirejs/text/LICENSE
 */
define("text", ["module"], function(module) {
        "use strict";

        function useDefault(value, defaultValue) {
            return void 0 === value || "" === value ? defaultValue : value
        }

        function isSamePort(protocol1, port1, protocol2, port2) {
            if (port1 === port2) return !0;
            if (protocol1 === protocol2) {
                if ("http" === protocol1) return useDefault(port1, "80") === useDefault(port2, "80");
                if ("https" === protocol1) return useDefault(port1, "443") === useDefault(port2, "443")
            }
            return !1
        }
        var text, fs, Cc, Ci, xpcIsWindows, progIds = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml2.XMLHTTP.4.0"],
            xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
            bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
            hasLocation = "undefined" != typeof location && location.href,
            defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ""),
            defaultHostName = hasLocation && location.hostname,
            defaultPort = hasLocation && (location.port || void 0),
            buildMap = {},
            masterConfig = module.config && module.config() || {};
        return text = {
            version: "2.0.15",
            strip: function(content) {
                if (content) {
                    content = content.replace(xmlRegExp, "");
                    var matches = content.match(bodyRegExp);
                    matches && (content = matches[1])
                } else content = "";
                return content
            },
            jsEscape: function(content) {
                return content.replace(/(['\\])/g, "\\$1").replace(/[\f]/g, "\\f").replace(/[\b]/g, "\\b").replace(/[\n]/g, "\\n").replace(/[\t]/g, "\\t").replace(/[\r]/g, "\\r").replace(/[\u2028]/g, "\\u2028").replace(/[\u2029]/g, "\\u2029")
            },
            createXhr: masterConfig.createXhr || function() {
                var xhr, i, progId;
                if ("undefined" != typeof XMLHttpRequest) return new XMLHttpRequest;
                if ("undefined" != typeof ActiveXObject)
                    for (i = 0; i < 3; i += 1) {
                        progId = progIds[i];
                        try {
                            xhr = new ActiveXObject(progId)
                        } catch (e) {}
                        if (xhr) {
                            progIds = [progId];
                            break
                        }
                    }
                return xhr
            },
            parseName: function(name) {
                var modName, ext, temp, strip = !1,
                    index = name.lastIndexOf("."),
                    isRelative = 0 === name.indexOf("./") || 0 === name.indexOf("../");
                return index !== -1 && (!isRelative || index > 1) ? (modName = name.substring(0, index), ext = name.substring(index + 1)) : modName = name, temp = ext || modName, index = temp.indexOf("!"), index !== -1 && (strip = "strip" === temp.substring(index + 1), temp = temp.substring(0, index), ext ? ext = temp : modName = temp), {
                    moduleName: modName,
                    ext: ext,
                    strip: strip
                }
            },
            xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,
            useXhr: function(url, protocol, hostname, port) {
                var uProtocol, uHostName, uPort, match = text.xdRegExp.exec(url);
                return !match || (uProtocol = match[2], uHostName = match[3], uHostName = uHostName.split(":"), uPort = uHostName[1], uHostName = uHostName[0], (!uProtocol || uProtocol === protocol) && (!uHostName || uHostName.toLowerCase() === hostname.toLowerCase()) && (!uPort && !uHostName || isSamePort(uProtocol, uPort, protocol, port)))
            },
            finishLoad: function(name, strip, content, onLoad) {
                content = strip ? text.strip(content) : content, masterConfig.isBuild && (buildMap[name] = content), onLoad(content)
            },
            load: function(name, req, onLoad, config) {
                if (config && config.isBuild && !config.inlineText) return void onLoad();
                masterConfig.isBuild = config && config.isBuild;
                var parsed = text.parseName(name),
                    nonStripName = parsed.moduleName + (parsed.ext ? "." + parsed.ext : ""),
                    url = req.toUrl(nonStripName),
                    useXhr = masterConfig.useXhr || text.useXhr;
                return 0 === url.indexOf("empty:") ? void onLoad() : void(!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort) ? text.get(url, function(content) {
                    text.finishLoad(name, parsed.strip, content, onLoad)
                }, function(err) {
                    onLoad.error && onLoad.error(err)
                }) : req([nonStripName], function(content) {
                    text.finishLoad(parsed.moduleName + "." + parsed.ext, parsed.strip, content, onLoad)
                }))
            },
            write: function(pluginName, moduleName, write, config) {
                if (buildMap.hasOwnProperty(moduleName)) {
                    var content = text.jsEscape(buildMap[moduleName]);
                    write.asModule(pluginName + "!" + moduleName, "define(function () { return '" + content + "';});\n")
                }
            },
            writeFile: function(pluginName, moduleName, req, write, config) {
                var parsed = text.parseName(moduleName),
                    extPart = parsed.ext ? "." + parsed.ext : "",
                    nonStripName = parsed.moduleName + extPart,
                    fileName = req.toUrl(parsed.moduleName + extPart) + ".js";
                text.load(nonStripName, req, function(value) {
                    var textWrite = function(contents) {
                        return write(fileName, contents)
                    };
                    textWrite.asModule = function(moduleName, contents) {
                        return write.asModule(moduleName, fileName, contents)
                    }, text.write(pluginName, nonStripName, textWrite, config)
                }, config)
            }
        }, "node" === masterConfig.env || !masterConfig.env && "undefined" != typeof process && process.versions && process.versions.node && !process.versions["node-webkit"] && !process.versions["atom-shell"] ? (fs = require.nodeRequire("fs"), text.get = function(url, callback, errback) {
            try {
                var file = fs.readFileSync(url, "utf8");
                "\ufeff" === file[0] && (file = file.substring(1)), callback(file)
            } catch (e) {
                errback && errback(e)
            }
        }) : "xhr" === masterConfig.env || !masterConfig.env && text.createXhr() ? text.get = function(url, callback, errback, headers) {
            var header, xhr = text.createXhr();
            if (xhr.open("GET", url, !0), headers)
                for (header in headers) headers.hasOwnProperty(header) && xhr.setRequestHeader(header.toLowerCase(), headers[header]);
            masterConfig.onXhr && masterConfig.onXhr(xhr, url), xhr.onreadystatechange = function(evt) {
                var status, err;
                4 === xhr.readyState && (status = xhr.status || 0, status > 399 && status < 600 ? (err = new Error(url + " HTTP status: " + status), err.xhr = xhr, errback && errback(err)) : callback(xhr.responseText), masterConfig.onXhrComplete && masterConfig.onXhrComplete(xhr, url))
            }, xhr.send(null)
        } : "rhino" === masterConfig.env || !masterConfig.env && "undefined" != typeof Packages && "undefined" != typeof java ? text.get = function(url, callback) {
            var stringBuffer, line, encoding = "utf-8",
                file = new java.io.File(url),
                lineSeparator = java.lang.System.getProperty("line.separator"),
                input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)),
                content = "";
            try {
                for (stringBuffer = new java.lang.StringBuffer, line = input.readLine(), line && line.length() && 65279 === line.charAt(0) && (line = line.substring(1)), null !== line && stringBuffer.append(line); null !== (line = input.readLine());) stringBuffer.append(lineSeparator), stringBuffer.append(line);
                content = String(stringBuffer.toString())
            } finally {
                input.close()
            }
            callback(content)
        } : ("xpconnect" === masterConfig.env || !masterConfig.env && "undefined" != typeof Components && Components.classes && Components.interfaces) && (Cc = Components.classes, Ci = Components.interfaces, Components.utils.import("resource://gre/modules/FileUtils.jsm"), xpcIsWindows = "@mozilla.org/windows-registry-key;1" in Cc, text.get = function(url, callback) {
            var inStream, convertStream, fileObj, readData = {};
            xpcIsWindows && (url = url.replace(/\//g, "\\")), fileObj = new FileUtils.File(url);
            try {
                inStream = Cc["@mozilla.org/network/file-input-stream;1"].createInstance(Ci.nsIFileInputStream), inStream.init(fileObj, 1, 0, !1), convertStream = Cc["@mozilla.org/intl/converter-input-stream;1"].createInstance(Ci.nsIConverterInputStream), convertStream.init(inStream, "utf-8", inStream.available(), Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER), convertStream.readString(inStream.available(), readData), convertStream.close(), inStream.close(), callback(readData.value)
            } catch (e) {
                throw new Error((fileObj && fileObj.path || "") + ": " + e)
            }
        }), text
    }), define("text!../html/nfib-editor.html", [], function() {
        return '{{#with content}}\r\n<div class="activity-body nfib-body">   \r\n    <h2><strong>{{getAdapterParams "activityName"}}</strong></h2>   \r\n    <div class="instructions">\r\n        {{#each instructions}} \r\n            <span class="edit-instruction">Edit Instructions:</span> <input value="{{{this.html}}}" class="edit-input edit-instruction-val" size="50"></input>\r\n        {{/each}} \r\n    </div>\r\n    \r\n    <div class="instructions questions">\r\n        {{#each questiondata}} \r\n            <span class="edit-answer">Enter correct answer: </span>\r\n            <input class="edit-input edit-answer-val" value="{{this.correctanswer}}" size="50"></input>\r\n        {{/each}}\r\n    </div>\r\n</div>\r\n{{/with}}'
    }), define("css", [], function() {
        if ("undefined" == typeof window) return {
            load: function(n, r, load) {
                load()
            }
        };
        var head = document.getElementsByTagName("head")[0],
            engine = window.navigator.userAgent.match(/Trident\/([^ ;]*)|AppleWebKit\/([^ ;]*)|Opera\/([^ ;]*)|rv\:([^ ;]*)(.*?)Gecko\/([^ ;]*)|MSIE\s([^ ;]*)|AndroidWebKit\/([^ ;]*)/) || 0,
            useImportLoad = !1,
            useOnload = !0;
        engine[1] || engine[7] ? useImportLoad = parseInt(engine[1]) < 6 || parseInt(engine[7]) <= 9 : engine[2] || engine[8] ? useOnload = !1 : engine[4] && (useImportLoad = parseInt(engine[4]) < 18);
        var cssAPI = {};
        cssAPI.pluginBuilder = "./css-builder";
        var curStyle, curSheet, ieCurCallback, createStyle = function() {
                curStyle = document.createElement("style"), head.appendChild(curStyle), curSheet = curStyle.styleSheet || curStyle.sheet
            },
            ieCnt = 0,
            ieLoads = [],
            createIeLoad = function(url) {
                curSheet.addImport(url), curStyle.onload = function() {
                    processIeLoad()
                }, ieCnt++, 31 == ieCnt && (createStyle(), ieCnt = 0)
            },
            processIeLoad = function() {
                ieCurCallback();
                var nextLoad = ieLoads.shift();
                return nextLoad ? (ieCurCallback = nextLoad[1], void createIeLoad(nextLoad[0])) : void(ieCurCallback = null)
            },
            importLoad = function(url, callback) {
                if (curSheet && curSheet.addImport || createStyle(), curSheet && curSheet.addImport) ieCurCallback ? ieLoads.push([url, callback]) : (createIeLoad(url), ieCurCallback = callback);
                else {
                    curStyle.textContent = '@import "' + url + '";';
                    var loadInterval = setInterval(function() {
                        try {
                            curStyle.sheet.cssRules, clearInterval(loadInterval), callback()
                        } catch (e) {}
                    }, 10)
                }
            },
            linkLoad = function(url, callback) {
                var link = document.createElement("link");
                if (link.type = "text/css", link.rel = "stylesheet", useOnload) link.onload = function() {
                    link.onload = function() {}, setTimeout(callback, 7)
                };
                else var loadInterval = setInterval(function() {
                    for (var i = 0; i < document.styleSheets.length; i++) {
                        var sheet = document.styleSheets[i];
                        if (sheet.href == link.href) return clearInterval(loadInterval), callback()
                    }
                }, 10);
                link.href = url, head.appendChild(link)
            };
        return cssAPI.normalize = function(name, normalize) {
            return ".css" == name.substr(name.length - 4, 4) && (name = name.substr(0, name.length - 4)), normalize(name)
        }, cssAPI.load = function(cssId, req, load, config) {
            (useImportLoad ? importLoad : linkLoad)(req.toUrl(cssId + ".css"), load)
        }, cssAPI
    }), define("css!../css/nfib-editor", [], function() {}), define("nfib-editor", ["text!../html/nfib-editor.html", "css!../css/nfib-editor.css"], function(nelsonFibTemplate) {
        nfibEditor = function() {
            "use strict";

            function init(elRoot, params, adaptor, htmlLayout, jsonContentObj, callback) {
                jsonContent = jQuery.extend(!0, {}, jsonContentObj), activityAdaptor = adaptor;
                var processedJsonContent = __parseAndUpdateJSONContent(jsonContent, params),
                    processedHTML = __processLayoutWithContent(__constants.TEMPLATES[htmlLayout], processedJsonContent);
                $(elRoot).html(processedHTML), $(__constants.DOM_SEL_ACTIVITY_BODY).attr(__constants.ADAPTOR_INSTANCE_IDENTIFIER, adaptor.getId()), $("." + __constants.DOM_EDIT_INSTRUCTION).blur(function() {
                    activityAdaptor.itemChangedInEditor()
                }), $("." + __constants.DOM_ANS_VAL).blur(function() {
                    activityAdaptor.itemChangedInEditor()
                }), $(".update-json").on("click", function() {
                    saveItemInEditor()
                }), callback && callback()
            }

            function getConfig() {
                return __config
            }

            function getStatus() {}

            function saveItemInEditor() {
                var activityBodyObjectRef = $(__constants.DOM_SEL_ACTIVITY_BODY).attr(__constants.ADAPTOR_INSTANCE_IDENTIFIER);
                jsonContent.content.instructions[0].html = $(".edit-instruction-val").val(), jsonContent.responses.i1.correct = $(".edit-answer-val").val(), activityAdaptor.submitEditChanges(jsonContent, activityBodyObjectRef)
            }

            function __processLayoutWithContent(layoutHTML, contentJSON) {
                var compiledTemplate = Handlebars.compile(layoutHTML),
                    compiledHTML = compiledTemplate(contentJSON);
                return compiledHTML
            }

            function __parseAndUpdateJSONContent(jsonContent, params) {
                var question = [],
                    interaction_id = "i1";
                return jsonContent.content.displaySubmit = activityAdaptor.displaySubmit, $.each(jsonContent.content.canvas.data.questiondata, function(num) {
                    question.push({
                        text: this.text,
                        correctanswer: jsonContent.responses[interaction_id].correct,
                        interactionId: interaction_id
                    })
                }), jsonContent.content.questiondata = question, jsonContent
            }
            var activityAdaptor, jsonContent, __config = {},
                __constants = {
                    DOM_SEL_ACTIVITY_BODY: ".activity-body",
                    DOM_EDIT_INSTRUCTION: "edit-instruction-val",
                    DOM_ANS_VAL: "edit-answer-val",
                    ADAPTOR_INSTANCE_IDENTIFIER: "data-objectid",
                    TEMPLATES: {
                        NFIB_EDITOR: nelsonFibTemplate
                    }
                };
            return {
                init: init,
                getStatus: getStatus,
                getConfig: getConfig,
                saveItemInEditor: saveItemInEditor
            }
        }
    }),
    function(c) {
        var d = document,
            a = "appendChild",
            i = "styleSheet",
            s = d.createElement("style");
        s.type = "text/css", d.getElementsByTagName("head")[0][a](s), s[i] ? s[i].cssText = c : s[a](d.createTextNode(c))
    }(".edit-instruction, .edit-answer{\r\n  font-size: 20px;\r\n}\r\n\r\n.edit-input{\r\n  margin-left: 20px;\r\n  padding-left: 5px;\r\n}");