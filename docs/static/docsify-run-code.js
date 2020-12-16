(function () {
    "use strict";

    function randId() {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        return Math.random().toString(36).substr(2, 9);
    };

    function _typeof(obj) {
        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
            _typeof = function (obj) {
                return typeof obj;
            };
        } else {
            _typeof = function (obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
        }
        return _typeof(obj);
    }

    function styleInject(css, ref) {
        if (ref === void 0) ref = {};
        var insertAt = ref.insertAt;
        if (!css || typeof document === "undefined") {
            return;
        }
        var head = document.head || document.getElementsByTagName("head")[0];
        var style = document.createElement("style");
        style.type = "text/css";
        if (insertAt === "top") {
            if (head.firstChild) {
                head.insertBefore(style, head.firstChild);
            } else {
                head.appendChild(style);
            }
        } else {
            head.appendChild(style);
        }
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
    }
    var css = `.imjoy-window{border-style: solid;border-width: 1px;color: #b3b3b3; width: 100%; height:600px;max-width:100%; max-height:200vh; height: 100%;}
    .docsify-run-button,.docsify-run-button span,.fullscreen-button,.fullscreen-button span, .docsify-edit-button,.docsify-edit-button span{cursor:pointer;transition:all .25s ease}
    .docsify-run-button,.docsify-edit-button,.fullscreen-button{z-index:1;height: 35px;margin-right: 6px;overflow:visible;padding:.65em .8em;border:0;border-radius:0;outline:0;font-size:1em;background:var(--theme-color,grey);color:#fff;opacity:0.7}
    .docsify-run-button span, .fullscreen-button span, .docsify-edit-button span{border-radius:3px;background:inherit;pointer-events:none}
    .docsify-run-button:focus,pre:hover .docsify-run-button, .fullscreen-button:focus,pre:hover .fullscreen-button, .docsify-edit-button:focus,pre:hover .docsify-edit-button{opacity:1}

    .docsify-close-button{position: absolute;right: 4px;top: 4px;height: 42px;z-index:3;cursor:pointer;padding:.65em .8em;border:0;border-radius:0;outline:0;font-size:1em;background:var(--theme-color,grey);color:#fff;}
    .docsify-fullscreen-button{position: absolute;right: 42px;top: 4px;height: 42px;z-index:3;cursor:pointer;padding:.65em .8em;border:0;border-radius:0;outline:0;font-size:1em;background:var(--theme-color,grey);color:#fff;}
    .docsify-loader {position: absolute;left: 13px;margin-top: 5px;display: inline-block;transform: translate(-50%, -50%);transform: -webkit-translate(-50%, -50%);transform: -moz-translate(-50%, -50%);transform: -ms-translate(-50%, -50%);border: 6px solid #f3f3f3; /* Light grey */border-top: 6px solid #448aff; /* Blue */border-radius: 50%;width: 30px;height: 30px;animation: spin 2s linear infinite;}
    @keyframes spin {0% { transform: rotate(0deg); }100% { transform: rotate(360deg); }}
    .docsify-status {position: absolute;left: 130px;display: inline-block;font-size:13px;}
    .docsify-progressbar-container{display: inline-block;position: absolute; width: 100%;left: 0; height:3px;color:#000!important;background-color:#f1f1f1!important}
    .docsify-status .tooltiptext {visibility: hidden; width: 120px;background-color: black;color: #fff;text-align: center;border-radius: 6px;padding: 5px 0;position: absolute;z-index: 1;}
    .docsify-status:hover .tooltiptext {visibility: visible!important;}
    .show-code-button{text-align: center; color: var(--docsifytabs-tab-highlight-color); cursor: pointer;}
    `;
    styleInject(css);

    const i18n = {
        runButtonText: "Run",
        editButtonText: "Edit",
        errorText: "Error",
        successText: "Done"
    };

    function execute(preElm, mode) {
        mode = mode || 'run';
        var codeElm = preElm.querySelector("code");
        const code = codeElm.textContent || codeElm.innerText;
        const showCodeBtn = preElm.querySelector('.show-code-button');

        showCodeBtn.style.display = 'none';

        try {

            const id = randId();
            preElm.pluginConfig = preElm.pluginConfig || {};
            preElm.pluginConfig.id = id;

            preElm.pluginConfig.namespace = id;
            preElm.pluginConfig.lang = preElm.getAttribute('data-lang');

            const outputFullscreenElm = preElm.querySelector(".fullscreen-button");
            outputFullscreenElm.onclick = () => {
                const outputElem = document.getElementById('output_' + id);
                if (outputElem.requestFullscreen) {
                    outputElem.requestFullscreen();
                } else if (outputElem.webkitRequestFullscreen) {
                    /* Safari */
                    outputElem.webkitRequestFullscreen();
                } else if (outputElem.msRequestFullscreen) {
                    /* IE11 */
                    outputElem.msRequestFullscreen();
                }
            }
            let hideCodeBlock = preElm.pluginConfig.hide_code_block;
            if (mode === 'edit') {
                // remove the github corner in edit mode
                const githubCorner = document.querySelector('.github-corner')
                if (githubCorner) githubCorner.parentNode.removeChild(githubCorner);
            }
            const customElements = preElm.querySelectorAll(":scope > div[id]")
            for (const elm of customElements) {
                preElm.removeChild(elm);
            }

            if (mode === 'edit') {
                const customElements = preElm.querySelectorAll(":scope > button")
                for (const elm of customElements) {
                    elm.style.display = "none";
                }
                preElm.pluginConfig.window_id = 'code_' + id;
                preElm.insertAdjacentHTML('afterBegin', `<div id="${'code_' + id}"></div><div id="${'output_' + id}"></div>`)
                preElm.insertAdjacentHTML('afterBegin', `<button class="docsify-close-button" id="${'close_' + id}">x</button>`);
                preElm.insertAdjacentHTML('afterBegin', `<button class="docsify-fullscreen-button" id="${'fullscreen_' + id}">+</button>`);
                preElm.insertAdjacentHTML('afterBegin', `<div id="${'progress_container_' + id}" style="top: 1px;" class="docsify-progressbar-container"><div class="docsify-progressbar" style="background-color:#2196F3!important;height:3px;" id="${'progress_' + id}"> </div></div>`)
                preElm.insertAdjacentHTML('beforeEnd', `<div class="docsify-status" style="font-size:13px;left: 4px;" id="${'status_' + id}"></div>`);
                const closeElem = document.getElementById('close_' + id)
                const fullscreenElm = document.getElementById('fullscreen_' + id);
                const statusElem = document.getElementById('status_' + id);
                const editorElem = document.getElementById('code_' + id);
                const outputElem = document.getElementById('output_' + id);
                const editorHeight = parseInt(preElm.pluginConfig.editor_height || "600px")
                statusElem.style.top = `${editorHeight-20}px`;
                editorElem.style.height = `${editorHeight}px`
                closeElem.onclick = function () {
                    editorElem.parentNode.removeChild(editorElem)

                    outputElem.parentNode.removeChild(outputElem)
                    if (hideCodeBlock) {
                        showCodeBtn.style.display = "block";
                        codeElm.style.display = "none";
                    } else {
                        showCodeBtn.style.display = "none";
                        codeElm.style.display = "block";
                    }

                    for (const elm of customElements) {
                        elm.style.display = "inline-block";
                    }
                    this.parentNode.removeChild(this)
                    fullscreenElm.parentNode.removeChild(fullscreenElm);
                }
                fullscreenElm.onclick = function () {
                    if (preElm.requestFullscreen) {
                        preElm.requestFullscreen();
                    } else if (preElm.webkitRequestFullscreen) {
                        /* Safari */
                        preElm.webkitRequestFullscreen();
                    } else if (preElm.msRequestFullscreen) {
                        /* IE11 */
                        preElm.msRequestFullscreen();
                    }
                }

                preElm.style.overflow = "hidden";
                outputElem.style.overflow = "auto";

            } else {
                // run mode
                preElm.pluginConfig.window_id = 'output_' + id;
                preElm.insertAdjacentHTML('beforeEnd', `<div id="${'progress_container_' + id}" class="docsify-progressbar-container"><div class="docsify-progressbar" style="background-color:#2196F3!important;height:3px;" id="${'progress_' + id}"> </div></div>`)
                preElm.insertAdjacentHTML('beforeEnd', `<div class="docsify-status" style="margin-top: 8px;" id="${'status_' + id}"/>`);
                preElm.insertAdjacentHTML('beforeEnd', `<div id="${'code_' + id}"></div><div id="${'output_' + id}"></div>`)
                codeElm.style.display = "block";
                showCodeBtn.style.display = 'none';
                const outputElem = document.getElementById('output_' + id);
                outputElem.style.overflow = 'auto';
            }
            const loader = preElm.querySelector(".docsify-loader")
            loader.style.display = "inline-block";
            const runBtn = preElm.querySelector(".docsify-run-button")
            if (runBtn) runBtn.innerHTML = "&nbsp; &nbsp; &nbsp; ";
            if (window.imjoyApp) {
                window.imjoyApp.runCode(mode, preElm.pluginConfig, code).finally(() => {
                    loader.style.display = "none";
                    const runBtn = preElm.querySelector(".docsify-run-button")
                    if (runBtn) runBtn.innerHTML = i18n.runButtonText;
                    const outputElem = document.getElementById('output_' + id);
                    if (outputElem && outputElem.children.length > 0)
                        outputFullscreenElm.style.display = "inline-block";

                })
            } else {
                window.document.addEventListener("imjoy_app_started", () => {
                    window.imjoyApp.runCode(mode, preElm.pluginConfig, code).finally(() => {
                        loader.style.display = "none";
                        const runBtn = preElm.querySelector(".docsify-run-button")
                        if (runBtn) runBtn.innerHTML = i18n.runButtonText;
                    })
                })
            }

            if (hideCodeBlock || mode === 'edit') {
                codeElm.style.display = "none";
                if (mode !== 'edit') {
                    showCodeBtn.style.display = "block";

                }
            }
            document.addEventListener("fullscreenchange", function (e) {

                const fullScreenMode = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                if (e.target === preElm) {
                    const closeElem = document.getElementById('close_' + id)
                    const fullscreenElm = document.getElementById('fullscreen_' + id);
                    const editorElem = document.getElementById('code_' + id);
                    const outputElem = document.getElementById('output_' + id);
                    const statusElem = document.getElementById('status_' + id);
                    if (fullScreenMode) {
                        closeElem.style.display = "none";
                        fullscreenElm.style.display = "none";
                        preElm.style.padding = "0";
                        editorElem.style.height = "calc( 100vh - 4px )";
                        editorElem.style.width = "50%";
                        editorElem.style.display = "inline-block";
                        outputElem.style.width = "50%";
                        outputElem._oldHeight = outputElem.style.height;
                        outputElem.style.height = "calc( 100vh - 4px )";
                        outputElem.style.minHeight = "calc( 100vh - 4px )";
                        outputElem.style.display = "inline-block";
                        statusElem.style.top = null
                        statusElem.style.bottom = "1px";
                    } else {
                        closeElem.style.display = "inline-block";
                        fullscreenElm.style.display = "inline-block";
                        preElm.style.padding = "3px";
                        delete outputElem.style.minHeight;
                        editorElem.style.height = preElm.pluginConfig.editor_height || "600px";
                        editorElem.style.width = "100%";
                        editorElem.style.display = "block";
                        outputElem.style.width = "100%";
                        outputElem.style.height = outputElem._oldHeight || '600px';
                        outputElem.style.display = "block";
                        statusElem.style.bottom = null
                        const editorHeight = parseInt(preElm.pluginConfig.editor_height || "600px")
                        statusElem.style.top = `${editorHeight-20}px`;
                        preElm.scrollIntoView();
                    }
                    return
                }
                const outputElem = document.getElementById('output_' + id);
                if (e.target === outputElem) {
                    if (fullScreenMode) {
                        outputElem.style.width = "100%";
                        outputElem._oldHeight = outputElem.style.height;
                        outputElem.style.height = "calc( 100vh - 4px )";
                        outputElem.style.display = "block";
                        // if(outputElem.children[0])outputElem.children[0].style.height = "100%";
                    } else {
                        outputElem.style.width = "100%";
                        outputElem.style.height = outputElem._oldHeight || '600px';
                        outputElem.style.display = "block";
                        // if(outputElem.children[0]) outputElem.children[0].style.height = null
                        outputElem.scrollIntoView();
                    }
                }
            });
        } catch (err) {
            console.error("docsify-run-code: ".concat(err));
        }
    }

    function docsifyRunCode(hook, vm) {
        hook.doneEach(function () {
            var targetElms = Array.apply(null, document.querySelectorAll("pre[data-lang]"));

            if (vm.config.runCode) {
                Object.keys(i18n).forEach(function (key) {
                    var textValue = vm.config.runCode[key];
                    if (typeof textValue === "string") {
                        i18n[key] = textValue;
                    } else if (_typeof(textValue) === "object") {
                        Object.keys(textValue).some(function (match) {
                            var isMatch = location.href.indexOf(match) > -1;
                            i18n[key] = isMatch ? textValue[match] : i18n[key];
                            return isMatch;
                        });
                    }
                });
            }
            var template = ['<button class="docsify-run-button">', '<span class="label">'.concat(i18n.runButtonText, "</span>"), "</button>",
                '<button class="docsify-edit-button">', '<span class="label">'.concat(i18n.editButtonText, "</span>"), "</button>",
                '<div class="docsify-loader"></div>',
                '<button class="fullscreen-button" style="position:absolute; right:0px">+</button>'
            ].join("");

            targetElms.forEach(function (elm) {
                try {
                    const tmp = elm.previousSibling.previousSibling;
                    if (tmp && tmp.nodeName === "#comment" && tmp.nodeValue.trim().startsWith("ImJoyPlugin")) {
                        const ctrlStr = tmp.nodeValue.trim()
                        if (ctrlStr === 'ImJoyPlugin') {
                            elm.pluginConfig = {};
                        } else {
                            elm.pluginConfig = JSON.parse(ctrlStr.split(':').slice(1).join(":") || "{}");
                        }
                        elm.insertAdjacentHTML("beforeEnd", template);

                        elm.querySelector(".docsify-loader").style.display = "none";
                        elm.querySelector(".fullscreen-button").style.display = "none";

                        const codeElm = elm.querySelector("code");
                        codeElm.insertAdjacentHTML('beforeBegin', `<div class="show-code-button">+ show source code</div>`);
                        const showCodeBtn = elm.querySelector('.show-code-button');
                        showCodeBtn.onclick = () => {
                            codeElm.style.display = 'block';
                            showCodeBtn.style.display = 'none';
                        }
                        if (elm.pluginConfig.hide_code_block) {

                            codeElm.style.display = 'none';
                        } else {
                            showCodeBtn.style.display = 'none'
                        }
                        if (elm.pluginConfig.startup_mode) {
                            const mode = elm.pluginConfig.startup_mode;
                            execute(elm, mode, true)
                            delete elm.pluginConfig.startup_mode
                        }

                    }
                } catch (e) {
                    console.error(e)
                }

            });
        });
        hook.mounted(function () {
            var listenerHost = document.querySelector(".content");
            listenerHost.addEventListener("click", function (evt) {
                const isRunCodeButton = evt.target.classList.contains("docsify-run-button");
                const isEditCodeButton = evt.target.classList.contains("docsify-edit-button");
                if (isRunCodeButton || isEditCodeButton) {
                    var buttonElm = evt.target.tagName === "BUTTON" ? evt.target : evt.target.parentNode;
                    const mode = isEditCodeButton ? "edit" : "run";
                    execute(buttonElm.parentNode, mode)
                }
            });
        });
    }
    if (document.querySelector('link[href*="docsify-run-code"]')) {
        console.warn("[Deprecation] Link to external docsify-run-code stylesheet is no longer necessary.");
    }
    window.DocsifyRunCodePlugin = {
        init: function init() {
            return function (hook, vm) {
                hook.ready(function () {
                    console.warn("[Deprecation] Manually initializing docsify-run-code using window.DocsifyRunCodePlugin.init() is no longer necessary.");
                });
            };
        }
    };
    window.$docsify = window.$docsify || {};
    window.$docsify.plugins = [docsifyRunCode].concat(window.$docsify.plugins || []);
})();