/*!
 * jquery-confirm v3.3.2 (http://craftpip.github.io/jquery-confirm/)
 * Author: Boniface Pereira
 * Website: www.craftpip.com
 * Contact: hey@craftpip.com
 *
 * Copyright 2013-2017 jquery-confirm
 * Licensed under MIT (https://github.com/craftpip/jquery-confirm/blob/master/LICENSE)
 */
if (typeof jQuery === "undefined") { throw new Error("jquery-confirm requires jQuery"); } var jconfirm, Jconfirm; (function ($, window) { $.fn.confirm = function (options, option2) { if (typeof options === "undefined") { options = {}; } if (typeof options === "string") { options = { content: options, title: (option2) ? option2 : false }; } $(this).each(function () { var $this = $(this); if ($this.attr("jc-attached")) { console.warn("jConfirm has already been attached to this element ", $this[0]); return; } $this.on("click", function (e) { e.preventDefault(); var jcOption = $.extend({}, options); if ($this.attr("data-title")) { jcOption.title = $this.attr("data-title"); } if ($this.attr("data-content")) { jcOption.content = $this.attr("data-content"); } if (typeof jcOption.buttons == "undefined") { jcOption.buttons = {}; } jcOption["$target"] = $this; if ($this.attr("href") && Object.keys(jcOption.buttons).length == 0) { var buttons = $.extend(true, {}, jconfirm.pluginDefaults.defaultButtons, (jconfirm.defaults || {}).defaultButtons || {}); var firstBtn = Object.keys(buttons)[0]; jcOption.buttons = buttons; jcOption.buttons[firstBtn].action = function () { location.href = $this.attr("href"); }; } jcOption.closeIcon = false; var instance = $.confirm(jcOption); }); $this.attr("jc-attached", true); }); return $(this); }; $.confirm = function (options, option2) { if (typeof options === "undefined") { options = {}; } if (typeof options === "string") { options = { content: options, title: (option2) ? option2 : false }; } var putDefaultButtons = !(options.buttons == false); if (typeof options.buttons != "object") { options.buttons = {}; } if (Object.keys(options.buttons).length == 0 && putDefaultButtons) { var buttons = $.extend(true, {}, jconfirm.pluginDefaults.defaultButtons, (jconfirm.defaults || {}).defaultButtons || {}); options.buttons = buttons; } return jconfirm(options); }; $.alert = function (options, option2) { if (typeof options === "undefined") { options = {}; } if (typeof options === "string") { options = { content: options, title: (option2) ? option2 : false }; } var putDefaultButtons = !(options.buttons == false); if (typeof options.buttons != "object") { options.buttons = {}; } if (Object.keys(options.buttons).length == 0 && putDefaultButtons) { var buttons = $.extend(true, {}, jconfirm.pluginDefaults.defaultButtons, (jconfirm.defaults || {}).defaultButtons || {}); var firstBtn = Object.keys(buttons)[0]; options.buttons[firstBtn] = buttons[firstBtn]; } return jconfirm(options); }; $.dialog = function (options, option2) { if (typeof options === "undefined") { options = {}; } if (typeof options === "string") { options = { content: options, title: (option2) ? option2 : false, closeIcon: function () { } }; } options.buttons = {}; if (typeof options.closeIcon == "undefined") { options.closeIcon = function () { }; } options.confirmKeys = [13]; return jconfirm(options); }; jconfirm = function (options) { if (typeof options === "undefined") { options = {}; } var pluginOptions = $.extend(true, {}, jconfirm.pluginDefaults); if (jconfirm.defaults) { pluginOptions = $.extend(true, pluginOptions, jconfirm.defaults); } pluginOptions = $.extend(true, {}, pluginOptions, options); var instance = new Jconfirm(pluginOptions); jconfirm.instances.push(instance); return instance; }; Jconfirm = function (options) { $.extend(this, options); this._init(); }; Jconfirm.prototype = { _init: function () { var that = this; if (!jconfirm.instances.length) { jconfirm.lastFocused = $("body").find(":focus"); } this._id = Math.round(Math.random() * 99999); this.contentParsed = $(document.createElement("div")); if (!this.lazyOpen) { setTimeout(function () { that.open(); }, 0); } }, _buildHTML: function () { var that = this; this._parseAnimation(this.animation, "o"); this._parseAnimation(this.closeAnimation, "c"); this._parseBgDismissAnimation(this.backgroundDismissAnimation); this._parseColumnClass(this.columnClass); this._parseTheme(this.theme); this._parseType(this.type); var template = $(this.template); template.find(".jconfirm-box").addClass(this.animationParsed).addClass(this.backgroundDismissAnimationParsed).addClass(this.typeParsed); if (this.typeAnimated) { template.find(".jconfirm-box").addClass("jconfirm-type-animated"); } if (this.useBootstrap) { template.find(".jc-bs3-row").addClass(this.bootstrapClasses.row); template.find(".jc-bs3-row").addClass("justify-content-md-center justify-content-sm-center justify-content-xs-center justify-content-lg-center"); template.find(".jconfirm-box-container").addClass(this.columnClassParsed); if (this.containerFluid) { template.find(".jc-bs3-container").addClass(this.bootstrapClasses.containerFluid); } else { template.find(".jc-bs3-container").addClass(this.bootstrapClasses.container); } } else { template.find(".jconfirm-box").css("width", this.boxWidth); } if (this.titleClass) { template.find(".jconfirm-title-c").addClass(this.titleClass); } template.addClass(this.themeParsed); var ariaLabel = "jconfirm-box" + this._id; template.find(".jconfirm-box").attr("aria-labelledby", ariaLabel).attr("tabindex", -1); template.find(".jconfirm-content").attr("id", ariaLabel); if (this.bgOpacity !== null) { template.find(".jconfirm-bg").css("opacity", this.bgOpacity); } if (this.rtl) { template.addClass("jconfirm-rtl"); } this.$el = template.appendTo(this.container); this.$jconfirmBoxContainer = this.$el.find(".jconfirm-box-container"); this.$jconfirmBox = this.$body = this.$el.find(".jconfirm-box"); this.$jconfirmBg = this.$el.find(".jconfirm-bg"); this.$title = this.$el.find(".jconfirm-title"); this.$titleContainer = this.$el.find(".jconfirm-title-c"); this.$content = this.$el.find("div.jconfirm-content"); this.$contentPane = this.$el.find(".jconfirm-content-pane"); this.$icon = this.$el.find(".jconfirm-icon-c"); this.$closeIcon = this.$el.find(".jconfirm-closeIcon"); this.$holder = this.$el.find(".jconfirm-holder"); this.$btnc = this.$el.find(".jconfirm-buttons"); this.$scrollPane = this.$el.find(".jconfirm-scrollpane"); that.setStartingPoint(); this._contentReady = $.Deferred(); this._modalReady = $.Deferred(); this.$holder.css({ "padding-top": this.offsetTop, "padding-bottom": this.offsetBottom, }); this.setTitle(); this.setIcon(); this._setButtons(); this._parseContent(); this.initDraggable(); if (this.isAjax) { this.showLoading(false); } $.when(this._contentReady, this._modalReady).then(function () { if (that.isAjaxLoading) { setTimeout(function () { that.isAjaxLoading = false; that.setContent(); that.setTitle(); that.setIcon(); setTimeout(function () { that.hideLoading(false); that._updateContentMaxHeight(); }, 100); if (typeof that.onContentReady === "function") { that.onContentReady(); } }, 50); } else { that._updateContentMaxHeight(); that.setTitle(); that.setIcon(); if (typeof that.onContentReady === "function") { that.onContentReady(); } } if (that.autoClose) { that._startCountDown(); } }); this._watchContent(); if (this.animation === "none") { this.animationSpeed = 1; this.animationBounce = 1; } this.$body.css(this._getCSS(this.animationSpeed, this.animationBounce)); this.$contentPane.css(this._getCSS(this.animationSpeed, 1)); this.$jconfirmBg.css(this._getCSS(this.animationSpeed, 1)); this.$jconfirmBoxContainer.css(this._getCSS(this.animationSpeed, 1)); }, _typePrefix: "jconfirm-type-", typeParsed: "", _parseType: function (type) { this.typeParsed = this._typePrefix + type; }, setType: function (type) { var oldClass = this.typeParsed; this._parseType(type); this.$jconfirmBox.removeClass(oldClass).addClass(this.typeParsed); }, themeParsed: "", _themePrefix: "jconfirm-", setTheme: function (theme) { var previous = this.theme; this.theme = theme || this.theme; this._parseTheme(this.theme); if (previous) { this.$el.removeClass(previous); } this.$el.addClass(this.themeParsed); this.theme = theme; }, _parseTheme: function (theme) { var that = this; theme = theme.split(","); $.each(theme, function (k, a) { if (a.indexOf(that._themePrefix) === -1) { theme[k] = that._themePrefix + $.trim(a); } }); this.themeParsed = theme.join(" ").toLowerCase(); }, backgroundDismissAnimationParsed: "", _bgDismissPrefix: "jconfirm-hilight-", _parseBgDismissAnimation: function (bgDismissAnimation) { var animation = bgDismissAnimation.split(","); var that = this; $.each(animation, function (k, a) { if (a.indexOf(that._bgDismissPrefix) === -1) { animation[k] = that._bgDismissPrefix + $.trim(a); } }); this.backgroundDismissAnimationParsed = animation.join(" ").toLowerCase(); }, animationParsed: "", closeAnimationParsed: "", _animationPrefix: "jconfirm-animation-", setAnimation: function (animation) { this.animation = animation || this.animation; this._parseAnimation(this.animation, "o"); }, _parseAnimation: function (animation, which) { which = which || "o"; var animations = animation.split(","); var that = this; $.each(animations, function (k, a) { if (a.indexOf(that._animationPrefix) === -1) { animations[k] = that._animationPrefix + $.trim(a); } }); var a_string = animations.join(" ").toLowerCase(); if (which === "o") { this.animationParsed = a_string; } else { this.closeAnimationParsed = a_string; } return a_string; }, setCloseAnimation: function (closeAnimation) { this.closeAnimation = closeAnimation || this.closeAnimation; this._parseAnimation(this.closeAnimation, "c"); }, setAnimationSpeed: function (speed) { this.animationSpeed = speed || this.animationSpeed; }, columnClassParsed: "", setColumnClass: function (colClass) { if (!this.useBootstrap) { console.warn("cannot set columnClass, useBootstrap is set to false"); return; } this.columnClass = colClass || this.columnClass; this._parseColumnClass(this.columnClass); this.$jconfirmBoxContainer.addClass(this.columnClassParsed); }, _updateContentMaxHeight: function () { var height = $(window).height() - (this.$jconfirmBox.outerHeight() - this.$contentPane.outerHeight()) - (this.offsetTop + this.offsetBottom); this.$contentPane.css({ "max-height": height + "px" }); }, setBoxWidth: function (width) { if (this.useBootstrap) { console.warn("cannot set boxWidth, useBootstrap is set to true"); return; } this.boxWidth = width; this.$jconfirmBox.css("width", width); }, _parseColumnClass: function (colClass) { colClass = colClass.toLowerCase(); var p; switch (colClass) { case "xl": case "xlarge": p = "col-md-12"; break; case "l": case "large": p = "col-md-8 col-md-offset-2"; break; case "m": case "medium": p = "col-md-6 col-md-offset-3"; break; case "s": case "small": p = "col-md-4 col-md-offset-4"; break; case "xs": case "xsmall": p = "col-md-2 col-md-offset-5"; break; default: p = colClass; }this.columnClassParsed = p; }, initDraggable: function () { var that = this; var $t = this.$titleContainer; this.resetDrag(); if (this.draggable) { $t.on("mousedown", function (e) { $t.addClass("jconfirm-hand"); that.mouseX = e.clientX; that.mouseY = e.clientY; that.isDrag = true; }); $(window).on("mousemove." + this._id, function (e) { if (that.isDrag) { that.movingX = e.clientX - that.mouseX + that.initialX; that.movingY = e.clientY - that.mouseY + that.initialY; that.setDrag(); } }); $(window).on("mouseup." + this._id, function () { $t.removeClass("jconfirm-hand"); if (that.isDrag) { that.isDrag = false; that.initialX = that.movingX; that.initialY = that.movingY; } }); } }, resetDrag: function () { this.isDrag = false; this.initialX = 0; this.initialY = 0; this.movingX = 0; this.movingY = 0; this.mouseX = 0; this.mouseY = 0; this.$jconfirmBoxContainer.css("transform", "translate(" + 0 + "px, " + 0 + "px)"); }, setDrag: function () { if (!this.draggable) { return; } this.alignMiddle = false; var boxWidth = this.$jconfirmBox.outerWidth(); var boxHeight = this.$jconfirmBox.outerHeight(); var windowWidth = $(window).width(); var windowHeight = $(window).height(); var that = this; var dragUpdate = 1; if (that.movingX % dragUpdate === 0 || that.movingY % dragUpdate === 0) { if (that.dragWindowBorder) { var leftDistance = (windowWidth / 2) - boxWidth / 2; var topDistance = (windowHeight / 2) - boxHeight / 2; topDistance -= that.dragWindowGap; leftDistance -= that.dragWindowGap; if (leftDistance + that.movingX < 0) { that.movingX = -leftDistance; } else { if (leftDistance - that.movingX < 0) { that.movingX = leftDistance; } } if (topDistance + that.movingY < 0) { that.movingY = -topDistance; } else { if (topDistance - that.movingY < 0) { that.movingY = topDistance; } } } that.$jconfirmBoxContainer.css("transform", "translate(" + that.movingX + "px, " + that.movingY + "px)"); } }, _scrollTop: function () { if (typeof pageYOffset !== "undefined") { return pageYOffset; } else { var B = document.body; var D = document.documentElement; D = (D.clientHeight) ? D : B; return D.scrollTop; } }, _watchContent: function () { var that = this; if (this._timer) { clearInterval(this._timer); } var prevContentHeight = 0; this._timer = setInterval(function () { if (that.smoothContent) { var contentHeight = that.$content.outerHeight() || 0; if (contentHeight !== prevContentHeight) { that.$contentPane.css({ height: contentHeight }).scrollTop(0); prevContentHeight = contentHeight; } var wh = $(window).height(); var total = that.offsetTop + that.offsetBottom + that.$jconfirmBox.height() - that.$contentPane.height() + that.$content.height(); if (total < wh) { that.$contentPane.addClass("no-scroll"); } else { that.$contentPane.removeClass("no-scroll"); } } }, this.watchInterval); }, _overflowClass: "jconfirm-overflow", _hilightAnimating: false, highlight: function () { this.hiLightModal(); }, hiLightModal: function () { var that = this; if (this._hilightAnimating) { return; } that.$body.addClass("hilight"); var duration = parseFloat(that.$body.css("animation-duration")) || 2; this._hilightAnimating = true; setTimeout(function () { that._hilightAnimating = false; that.$body.removeClass("hilight"); }, duration * 1000); }, _bindEvents: function () { var that = this; this.boxClicked = false; this.$scrollPane.click(function (e) { if (!that.boxClicked) { var buttonName = false; var shouldClose = false; var str; if (typeof that.backgroundDismiss == "function") { str = that.backgroundDismiss(); } else { str = that.backgroundDismiss; } if (typeof str == "string" && typeof that.buttons[str] != "undefined") { buttonName = str; shouldClose = false; } else { if (typeof str == "undefined" || !!(str) == true) { shouldClose = true; } else { shouldClose = false; } } if (buttonName) { var btnResponse = that.buttons[buttonName].action.apply(that); shouldClose = (typeof btnResponse == "undefined") || !!(btnResponse); } if (shouldClose) { that.close(); } else { that.hiLightModal(); } } that.boxClicked = false; }); this.$jconfirmBox.click(function (e) { that.boxClicked = true; }); var isKeyDown = false; $(window).on("jcKeyDown." + that._id, function (e) { if (!isKeyDown) { isKeyDown = true; } }); $(window).on("keyup." + that._id, function (e) { if (isKeyDown) { that.reactOnKey(e); isKeyDown = false; } }); $(window).on("resize." + this._id, function () { that._updateContentMaxHeight(); setTimeout(function () { that.resetDrag(); }, 100); }); }, _cubic_bezier: "0.36, 0.55, 0.19", _getCSS: function (speed, bounce) { return { "-webkit-transition-duration": speed / 1000 + "s", "transition-duration": speed / 1000 + "s", "-webkit-transition-timing-function": "cubic-bezier(" + this._cubic_bezier + ", " + bounce + ")", "transition-timing-function": "cubic-bezier(" + this._cubic_bezier + ", " + bounce + ")" }; }, _setButtons: function () { var that = this; var total_buttons = 0; if (typeof this.buttons !== "object") { this.buttons = {}; } $.each(this.buttons, function (key, button) { total_buttons += 1; if (typeof button === "function") { that.buttons[key] = button = { action: button }; } that.buttons[key].text = button.text || key; that.buttons[key].btnClass = button.btnClass || "btn-default"; that.buttons[key].action = button.action || function () { }; that.buttons[key].keys = button.keys || []; that.buttons[key].isHidden = button.isHidden || false; that.buttons[key].isDisabled = button.isDisabled || false; $.each(that.buttons[key].keys, function (i, a) { that.buttons[key].keys[i] = a.toLowerCase(); }); var button_element = $('<button type="button" class="btn"></button>').html(that.buttons[key].text).addClass(that.buttons[key].btnClass).prop("disabled", that.buttons[key].isDisabled).css("display", that.buttons[key].isHidden ? "none" : "").click(function (e) { e.preventDefault(); var res = that.buttons[key].action.apply(that, [that.buttons[key]]); that.onAction.apply(that, [key, that.buttons[key]]); that._stopCountDown(); if (typeof res === "undefined" || res) { that.close(); } }); that.buttons[key].el = button_element; that.buttons[key].setText = function (text) { button_element.html(text); }; that.buttons[key].addClass = function (className) { button_element.addClass(className); }; that.buttons[key].removeClass = function (className) { button_element.removeClass(className); }; that.buttons[key].disable = function () { that.buttons[key].isDisabled = true; button_element.prop("disabled", true); }; that.buttons[key].enable = function () { that.buttons[key].isDisabled = false; button_element.prop("disabled", false); }; that.buttons[key].show = function () { that.buttons[key].isHidden = false; button_element.css("display", ""); }; that.buttons[key].hide = function () { that.buttons[key].isHidden = true; button_element.css("display", "none"); }; that["$_" + key] = that["$$" + key] = button_element; that.$btnc.append(button_element); }); if (total_buttons === 0) { this.$btnc.hide(); } if (this.closeIcon === null && total_buttons === 0) { this.closeIcon = true; } if (this.closeIcon) { if (this.closeIconClass) { var closeHtml = '<i class="' + this.closeIconClass + '"></i>'; this.$closeIcon.html(closeHtml); } this.$closeIcon.click(function (e) { e.preventDefault(); var buttonName = false; var shouldClose = false; var str; if (typeof that.closeIcon == "function") { str = that.closeIcon(); } else { str = that.closeIcon; } if (typeof str == "string" && typeof that.buttons[str] != "undefined") { buttonName = str; shouldClose = false; } else { if (typeof str == "undefined" || !!(str) == true) { shouldClose = true; } else { shouldClose = false; } } if (buttonName) { var btnResponse = that.buttons[buttonName].action.apply(that); shouldClose = (typeof btnResponse == "undefined") || !!(btnResponse); } if (shouldClose) { that.close(); } }); this.$closeIcon.show(); } else { this.$closeIcon.hide(); } }, setTitle: function (string, force) { force = force || false; if (typeof string !== "undefined") { if (typeof string == "string") { this.title = string; } else { if (typeof string == "function") { if (typeof string.promise == "function") { console.error("Promise was returned from title function, this is not supported."); } var response = string(); if (typeof response == "string") { this.title = response; } else { this.title = false; } } else { this.title = false; } } } if (this.isAjaxLoading && !force) { return; } this.$title.html(this.title || ""); this.updateTitleContainer(); }, setIcon: function (iconClass, force) { force = force || false; if (typeof iconClass !== "undefined") { if (typeof iconClass == "string") { this.icon = iconClass; } else { if (typeof iconClass === "function") { var response = iconClass(); if (typeof response == "string") { this.icon = response; } else { this.icon = false; } } else { this.icon = false; } } } if (this.isAjaxLoading && !force) { return; } this.$icon.html(this.icon ? '<i class="' + this.icon + '"></i>' : ""); this.updateTitleContainer(); }, updateTitleContainer: function () { if (!this.title && !this.icon) { this.$titleContainer.hide(); } else { this.$titleContainer.show(); } }, setContentPrepend: function (content, force) { if (!content) { return; } this.contentParsed.prepend(content); }, setContentAppend: function (content) { if (!content) { return; } this.contentParsed.append(content); }, setContent: function (content, force) { force = !!force; var that = this; if (content) { this.contentParsed.html("").append(content); } if (this.isAjaxLoading && !force) { return; } this.$content.html(""); this.$content.append(this.contentParsed); setTimeout(function () { that.$body.find("input[autofocus]:visible:first").focus(); }, 100); }, loadingSpinner: false, showLoading: function (disableButtons) { this.loadingSpinner = true; this.$jconfirmBox.addClass("loading"); if (disableButtons) { this.$btnc.find("button").prop("disabled", true); } }, hideLoading: function (enableButtons) { this.loadingSpinner = false; this.$jconfirmBox.removeClass("loading"); if (enableButtons) { this.$btnc.find("button").prop("disabled", false); } }, ajaxResponse: false, contentParsed: "", isAjax: false, isAjaxLoading: false, _parseContent: function () { var that = this; var e = "&nbsp;"; if (typeof this.content == "function") { var res = this.content.apply(this); if (typeof res == "string") { this.content = res; } else { if (typeof res == "object" && typeof res.always == "function") { this.isAjax = true; this.isAjaxLoading = true; res.always(function (data, status, xhr) { that.ajaxResponse = { data: data, status: status, xhr: xhr }; that._contentReady.resolve(data, status, xhr); if (typeof that.contentLoaded == "function") { that.contentLoaded(data, status, xhr); } }); this.content = e; } else { this.content = e; } } } if (typeof this.content == "string" && this.content.substr(0, 4).toLowerCase() === "url:") { this.isAjax = true; this.isAjaxLoading = true; var u = this.content.substring(4, this.content.length); $.get(u).done(function (html) { that.contentParsed.html(html); }).always(function (data, status, xhr) { that.ajaxResponse = { data: data, status: status, xhr: xhr }; that._contentReady.resolve(data, status, xhr); if (typeof that.contentLoaded == "function") { that.contentLoaded(data, status, xhr); } }); } if (!this.content) { this.content = e; } if (!this.isAjax) { this.contentParsed.html(this.content); this.setContent(); that._contentReady.resolve(); } }, _stopCountDown: function () { clearInterval(this.autoCloseInterval); if (this.$cd) { this.$cd.remove(); } }, _startCountDown: function () { var that = this; var opt = this.autoClose.split("|"); if (opt.length !== 2) { console.error("Invalid option for autoClose. example 'close|10000'"); return false; } var button_key = opt[0]; var time = parseInt(opt[1]); if (typeof this.buttons[button_key] === "undefined") { console.error("Invalid button key '" + button_key + "' for autoClose"); return false; } var seconds = Math.ceil(time / 1000); this.$cd = $('<span class="countdown"> (' + seconds + ")</span>").appendTo(this["$_" + button_key]); this.autoCloseInterval = setInterval(function () { that.$cd.html(" (" + (seconds -= 1) + ") "); if (seconds <= 0) { that["$$" + button_key].trigger("click"); that._stopCountDown(); } }, 1000); }, _getKey: function (key) { switch (key) { case 192: return "tilde"; case 13: return "enter"; case 16: return "shift"; case 9: return "tab"; case 20: return "capslock"; case 17: return "ctrl"; case 91: return "win"; case 18: return "alt"; case 27: return "esc"; case 32: return "space"; }var initial = String.fromCharCode(key); if (/^[A-z0-9]+$/.test(initial)) { return initial.toLowerCase(); } else { return false; } }, reactOnKey: function (e) { var that = this; var a = $(".jconfirm"); if (a.eq(a.length - 1)[0] !== this.$el[0]) { return false; } var key = e.which; if (this.$content.find(":input").is(":focus") && /13|32/.test(key)) { return false; } var keyChar = this._getKey(key); if (keyChar === "esc" && this.escapeKey) { if (this.escapeKey === true) { this.$scrollPane.trigger("click"); } else { if (typeof this.escapeKey === "string" || typeof this.escapeKey === "function") { var buttonKey; if (typeof this.escapeKey === "function") { buttonKey = this.escapeKey(); } else { buttonKey = this.escapeKey; } if (buttonKey) { if (typeof this.buttons[buttonKey] === "undefined") { console.warn("Invalid escapeKey, no buttons found with key " + buttonKey); } else { this["$_" + buttonKey].trigger("click"); } } } } } $.each(this.buttons, function (key, button) { if (button.keys.indexOf(keyChar) != -1) { that["$_" + key].trigger("click"); } }); }, setDialogCenter: function () { console.info("setDialogCenter is deprecated, dialogs are centered with CSS3 tables"); }, _unwatchContent: function () { clearInterval(this._timer); }, close: function (onClosePayload) { var that = this; if (typeof this.onClose === "function") { this.onClose(onClosePayload); } this._unwatchContent(); $(window).unbind("resize." + this._id); $(window).unbind("keyup." + this._id); $(window).unbind("jcKeyDown." + this._id); if (this.draggable) { $(window).unbind("mousemove." + this._id); $(window).unbind("mouseup." + this._id); this.$titleContainer.unbind("mousedown"); } that.$el.removeClass(that.loadedClass); $("body").removeClass("jconfirm-no-scroll-" + that._id); that.$jconfirmBoxContainer.removeClass("jconfirm-no-transition"); setTimeout(function () { that.$body.addClass(that.closeAnimationParsed); that.$jconfirmBg.addClass("jconfirm-bg-h"); var closeTimer = (that.closeAnimation === "none") ? 1 : that.animationSpeed; setTimeout(function () { that.$el.remove(); var l = jconfirm.instances; var i = jconfirm.instances.length - 1; for (i; i >= 0; i--) { if (jconfirm.instances[i]._id === that._id) { jconfirm.instances.splice(i, 1); } } if (!jconfirm.instances.length) { if (that.scrollToPreviousElement && jconfirm.lastFocused && jconfirm.lastFocused.length && $.contains(document, jconfirm.lastFocused[0])) { var $lf = jconfirm.lastFocused; if (that.scrollToPreviousElementAnimate) { var st = $(window).scrollTop(); var ot = jconfirm.lastFocused.offset().top; var wh = $(window).height(); if (!(ot > st && ot < (st + wh))) { var scrollTo = (ot - Math.round((wh / 3))); $("html, body").animate({ scrollTop: scrollTo }, that.animationSpeed, "swing", function () { $lf.focus(); }); } else { $lf.focus(); } } else { $lf.focus(); } jconfirm.lastFocused = false; } } if (typeof that.onDestroy === "function") { that.onDestroy(); } }, closeTimer * 0.4); }, 50); return true; }, open: function () { if (this.isOpen()) { return false; } this._buildHTML(); this._bindEvents(); this._open(); return true; }, setStartingPoint: function () { var el = false; if (this.animateFromElement !== true && this.animateFromElement) { el = this.animateFromElement; jconfirm.lastClicked = false; } else { if (jconfirm.lastClicked && this.animateFromElement === true) { el = jconfirm.lastClicked; jconfirm.lastClicked = false; } else { return false; } } if (!el) { return false; } var offset = el.offset(); var iTop = el.outerHeight() / 2; var iLeft = el.outerWidth() / 2; iTop -= this.$jconfirmBox.outerHeight() / 2; iLeft -= this.$jconfirmBox.outerWidth() / 2; var sourceTop = offset.top + iTop; sourceTop = sourceTop - this._scrollTop(); var sourceLeft = offset.left + iLeft; var wh = $(window).height() / 2; var ww = $(window).width() / 2; var targetH = wh - this.$jconfirmBox.outerHeight() / 2; var targetW = ww - this.$jconfirmBox.outerWidth() / 2; sourceTop -= targetH; sourceLeft -= targetW; if (Math.abs(sourceTop) > wh || Math.abs(sourceLeft) > ww) { return false; } this.$jconfirmBoxContainer.css("transform", "translate(" + sourceLeft + "px, " + sourceTop + "px)"); }, _open: function () { var that = this; if (typeof that.onOpenBefore === "function") { that.onOpenBefore(); } this.$body.removeClass(this.animationParsed); this.$jconfirmBg.removeClass("jconfirm-bg-h"); this.$body.focus(); that.$jconfirmBoxContainer.css("transform", "translate(" + 0 + "px, " + 0 + "px)"); setTimeout(function () { that.$body.css(that._getCSS(that.animationSpeed, 1)); that.$body.css({ "transition-property": that.$body.css("transition-property") + ", margin" }); that.$jconfirmBoxContainer.addClass("jconfirm-no-transition"); that._modalReady.resolve(); if (typeof that.onOpen === "function") { that.onOpen(); } that.$el.addClass(that.loadedClass); }, this.animationSpeed); }, loadedClass: "jconfirm-open", isClosed: function () { return !this.$el || this.$el.css("display") === ""; }, isOpen: function () { return !this.isClosed(); }, toggle: function () { if (!this.isOpen()) { this.open(); } else { this.close(); } } }; jconfirm.instances = []; jconfirm.lastFocused = false; jconfirm.pluginDefaults = { template: '<div class="jconfirm"><div class="jconfirm-bg jconfirm-bg-h"></div><div class="jconfirm-scrollpane"><div class="jconfirm-row"><div class="jconfirm-cell"><div class="jconfirm-holder"><div class="jc-bs3-container"><div class="jc-bs3-row"><div class="jconfirm-box-container jconfirm-animated"><div class="jconfirm-box" role="dialog" aria-labelledby="labelled" tabindex="-1"><div class="jconfirm-closeIcon">&times;</div><div class="jconfirm-title-c"><span class="jconfirm-icon-c"></span><span class="jconfirm-title"></span></div><div class="jconfirm-content-pane"><div class="jconfirm-content"></div></div><div class="jconfirm-buttons"></div><div class="jconfirm-clear"></div></div></div></div></div></div></div></div></div></div>', title: "Hello", titleClass: "", type: "default", typeAnimated: true, draggable: true, dragWindowGap: 15, dragWindowBorder: true, animateFromElement: true, alignMiddle: true, smoothContent: true, content: "Are you sure to continue?", buttons: {}, defaultButtons: { ok: { action: function () { } }, close: { action: function () { } } }, contentLoaded: function () { }, icon: "", lazyOpen: false, bgOpacity: null, theme: "light", animation: "scale", closeAnimation: "scale", animationSpeed: 400, animationBounce: 1, escapeKey: true, rtl: false, container: "body", containerFluid: false, backgroundDismiss: false, backgroundDismissAnimation: "shake", autoClose: false, closeIcon: null, closeIconClass: false, watchInterval: 100, columnClass: "col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 col-xs-10 col-xs-offset-1", boxWidth: "50%", scrollToPreviousElement: true, scrollToPreviousElementAnimate: true, useBootstrap: true, offsetTop: 40, offsetBottom: 40, bootstrapClasses: { container: "container", containerFluid: "container-fluid", row: "row" }, onContentReady: function () { }, onOpenBefore: function () { }, onOpen: function () { }, onClose: function () { }, onDestroy: function () { }, onAction: function () { } }; var keyDown = false; $(window).on("keydown", function (e) { if (!keyDown) { var $target = $(e.target); var pass = false; if ($target.closest(".jconfirm-box").length) { pass = true; } if (pass) { $(window).trigger("jcKeyDown"); } keyDown = true; } }); $(window).on("keyup", function () { keyDown = false; }); jconfirm.lastClicked = false; $(document).on("mousedown", "button, a", function () { jconfirm.lastClicked = $(this); }); })(jQuery, window);
//! moment.js
//! version : 2.9.0
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (undefined) {
    /************************************
        Constants
    ************************************/

    var moment,
        VERSION = '2.9.0',
        // the global-scope this is NOT the global object in Node.js
        globalScope = (typeof global !== 'undefined' && (typeof window === 'undefined' || window === global.window)) ? global : this,
        oldGlobalMoment,
        round = Math.round,
        hasOwnProperty = Object.prototype.hasOwnProperty,
        i,

        YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,

        // internal storage for locale config files
        locales = {},

        // extra moment internal properties (plugins register props here)
        momentProperties = [],

        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module && module.exports),

        // ASP.NET json date format regex
        aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,
        aspNetTimeSpanJsonRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,

        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        isoDurationRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,

        // format tokens
        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,

        // parsing token regexes
        parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
        parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
        parseTokenOneToFourDigits = /\d{1,4}/, // 0 - 9999
        parseTokenOneToSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999
        parseTokenDigits = /\d+/, // nonzero number of digits
        parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, // any word (or two) characters or numbers including two/three word month in arabic.
        parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
        parseTokenT = /T/i, // T (ISO separator)
        parseTokenOffsetMs = /[\+\-]?\d+/, // 1234567890123
        parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123

        //strict parsing regexes
        parseTokenOneDigit = /\d/, // 0 - 9
        parseTokenTwoDigits = /\d\d/, // 00 - 99
        parseTokenThreeDigits = /\d{3}/, // 000 - 999
        parseTokenFourDigits = /\d{4}/, // 0000 - 9999
        parseTokenSixDigits = /[+-]?\d{6}/, // -999,999 - 999,999
        parseTokenSignedNumber = /[+-]?\d+/, // -inf - inf

        // iso 8601 regex
        // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
        isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,

        isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',

        isoDates = [
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
            ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
            ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
            ['GGGG-[W]WW', /\d{4}-W\d{2}/],
            ['YYYY-DDD', /\d{4}-\d{3}/]
        ],

        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
            ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
            ['HH:mm', /(T| )\d\d:\d\d/],
            ['HH', /(T| )\d\d/]
        ],

        // timezone chunker '+10:00' > ['10', '00'] or '-1530' > ['-', '15', '30']
        parseTimezoneChunker = /([\+\-]|\d\d)/gi,

        // getter and setter names
        proxyGettersAndSetters = 'Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),
        unitMillisecondFactors = {
            'Milliseconds': 1,
            'Seconds': 1e3,
            'Minutes': 6e4,
            'Hours': 36e5,
            'Days': 864e5,
            'Months': 2592e6,
            'Years': 31536e6
        },

        unitAliases = {
            ms: 'millisecond',
            s: 'second',
            m: 'minute',
            h: 'hour',
            d: 'day',
            D: 'date',
            w: 'week',
            W: 'isoWeek',
            M: 'month',
            Q: 'quarter',
            y: 'year',
            DDD: 'dayOfYear',
            e: 'weekday',
            E: 'isoWeekday',
            gg: 'weekYear',
            GG: 'isoWeekYear'
        },

        camelFunctions = {
            dayofyear: 'dayOfYear',
            isoweekday: 'isoWeekday',
            isoweek: 'isoWeek',
            weekyear: 'weekYear',
            isoweekyear: 'isoWeekYear'
        },

        // format function strings
        formatFunctions = {},

        // default relative time thresholds
        relativeTimeThresholds = {
            s: 45,  // seconds to minute
            m: 45,  // minutes to hour
            h: 22,  // hours to day
            d: 26,  // days to month
            M: 11   // months to year
        },

        // tokens to ordinalize and pad
        ordinalizeTokens = 'DDD w W M D d'.split(' '),
        paddedTokens = 'M D H h m s w W'.split(' '),

        formatTokenFunctions = {
            M: function () {
                return this.month() + 1;
            },
            MMM: function (format) {
                return this.localeData().monthsShort(this, format);
            },
            MMMM: function (format) {
                return this.localeData().months(this, format);
            },
            D: function () {
                return this.date();
            },
            DDD: function () {
                return this.dayOfYear();
            },
            d: function () {
                return this.day();
            },
            dd: function (format) {
                return this.localeData().weekdaysMin(this, format);
            },
            ddd: function (format) {
                return this.localeData().weekdaysShort(this, format);
            },
            dddd: function (format) {
                return this.localeData().weekdays(this, format);
            },
            w: function () {
                return this.week();
            },
            W: function () {
                return this.isoWeek();
            },
            YY: function () {
                return leftZeroFill(this.year() % 100, 2);
            },
            YYYY: function () {
                return leftZeroFill(this.year(), 4);
            },
            YYYYY: function () {
                return leftZeroFill(this.year(), 5);
            },
            YYYYYY: function () {
                var y = this.year(), sign = y >= 0 ? '+' : '-';
                return sign + leftZeroFill(Math.abs(y), 6);
            },
            gg: function () {
                return leftZeroFill(this.weekYear() % 100, 2);
            },
            gggg: function () {
                return leftZeroFill(this.weekYear(), 4);
            },
            ggggg: function () {
                return leftZeroFill(this.weekYear(), 5);
            },
            GG: function () {
                return leftZeroFill(this.isoWeekYear() % 100, 2);
            },
            GGGG: function () {
                return leftZeroFill(this.isoWeekYear(), 4);
            },
            GGGGG: function () {
                return leftZeroFill(this.isoWeekYear(), 5);
            },
            e: function () {
                return this.weekday();
            },
            E: function () {
                return this.isoWeekday();
            },
            a: function () {
                return this.localeData().meridiem(this.hours(), this.minutes(), true);
            },
            A: function () {
                return this.localeData().meridiem(this.hours(), this.minutes(), false);
            },
            H: function () {
                return this.hours();
            },
            h: function () {
                return this.hours() % 12 || 12;
            },
            m: function () {
                return this.minutes();
            },
            s: function () {
                return this.seconds();
            },
            S: function () {
                return toInt(this.milliseconds() / 100);
            },
            SS: function () {
                return leftZeroFill(toInt(this.milliseconds() / 10), 2);
            },
            SSS: function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            SSSS: function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            Z: function () {
                var a = this.utcOffset(),
                    b = '+';
                if (a < 0) {
                    a = -a;
                    b = '-';
                }
                return b + leftZeroFill(toInt(a / 60), 2) + ':' + leftZeroFill(toInt(a) % 60, 2);
            },
            ZZ: function () {
                var a = this.utcOffset(),
                    b = '+';
                if (a < 0) {
                    a = -a;
                    b = '-';
                }
                return b + leftZeroFill(toInt(a / 60), 2) + leftZeroFill(toInt(a) % 60, 2);
            },
            z: function () {
                return this.zoneAbbr();
            },
            zz: function () {
                return this.zoneName();
            },
            x: function () {
                return this.valueOf();
            },
            X: function () {
                return this.unix();
            },
            Q: function () {
                return this.quarter();
            }
        },

        deprecations = {},

        lists = ['months', 'monthsShort', 'weekdays', 'weekdaysShort', 'weekdaysMin'],

        updateInProgress = false;

    // Pick the first defined of two or three arguments. dfl comes from
    // default.
    function dfl(a, b, c) {
        switch (arguments.length) {
            case 2: return a != null ? a : b;
            case 3: return a != null ? a : b != null ? b : c;
            default: throw new Error('Implement me');
        }
    }

    function hasOwnProp(a, b) {
        return hasOwnProperty.call(a, b);
    }

    function defaultParsingFlags() {
        // We need to deep clone this object, and es5 standard is not very
        // helpful.
        return {
            empty: false,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: false,
            invalidMonth: null,
            invalidFormat: false,
            userInvalidated: false,
            iso: false
        };
    }

    function printMsg(msg) {
        if (moment.suppressDeprecationWarnings === false &&
            typeof console !== 'undefined' && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;
        return extend(function () {
            if (firstTime) {
                printMsg(msg);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            printMsg(msg);
            deprecations[name] = true;
        }
    }

    function padToken(func, count) {
        return function (a) {
            return leftZeroFill(func.call(this, a), count);
        };
    }
    function ordinalizeToken(func, period) {
        return function (a) {
            return this.localeData().ordinal(func.call(this, a), period);
        };
    }

    function monthDiff(a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        return -(wholeMonthDiff + adjust);
    }

    while (ordinalizeTokens.length) {
        i = ordinalizeTokens.pop();
        formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i], i);
    }
    while (paddedTokens.length) {
        i = paddedTokens.pop();
        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
    }
    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);


    function meridiemFixWrap(locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // thie is not supposed to happen
            return hour;
        }
    }

    /************************************
        Constructors
    ************************************/

    function Locale() {
    }

    // Moment prototype object
    function Moment(config, skipOverflow) {
        if (skipOverflow !== false) {
            checkOverflow(config);
        }
        copyConfig(this, config);
        this._d = new Date(+config._d);
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            moment.updateOffset(this);
            updateInProgress = false;
        }
    }

    // Duration Constructor
    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = moment.localeData();

        this._bubble();
    }

    /************************************
        Helpers
    ************************************/


    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function copyConfig(to, from) {
        var i, prop, val;

        if (typeof from._isAMomentObject !== 'undefined') {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (typeof from._i !== 'undefined') {
            to._i = from._i;
        }
        if (typeof from._f !== 'undefined') {
            to._f = from._f;
        }
        if (typeof from._l !== 'undefined') {
            to._l = from._l;
        }
        if (typeof from._strict !== 'undefined') {
            to._strict = from._strict;
        }
        if (typeof from._tzm !== 'undefined') {
            to._tzm = from._tzm;
        }
        if (typeof from._isUTC !== 'undefined') {
            to._isUTC = from._isUTC;
        }
        if (typeof from._offset !== 'undefined') {
            to._offset = from._offset;
        }
        if (typeof from._pf !== 'undefined') {
            to._pf = from._pf;
        }
        if (typeof from._locale !== 'undefined') {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (typeof val !== 'undefined') {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    // left zero fill a number
    // see http://jsperf.com/left-zero-filling for performance comparison
    function leftZeroFill(number, targetLength, forceSign) {
        var output = '' + Math.abs(number),
            sign = number >= 0;

        while (output.length < targetLength) {
            output = '0' + output;
        }
        return (sign ? (forceSign ? '+' : '') : '-') + output;
    }

    function positiveMomentsDifference(base, other) {
        var res = { milliseconds: 0, months: 0 };

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        other = makeAs(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = moment.duration(val, period);
            addOrSubtractDurationFromMoment(this, dur, direction);
            return this;
        };
    }

    function addOrSubtractDurationFromMoment(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            rawSetter(mom, 'Date', rawGetter(mom, 'Date') + days * isAdding);
        }
        if (months) {
            rawMonthSetter(mom, rawGetter(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            moment.updateOffset(mom, days || months);
        }
    }

    // check if is an array
    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return Object.prototype.toString.call(input) === '[object Date]' ||
            input instanceof Date;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function normalizeUnits(units) {
        if (units) {
            var lowered = units.toLowerCase().replace(/(.)s$/, '$1');
            units = unitAliases[units] || camelFunctions[lowered] || lowered;
        }
        return units;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeList(field) {
        var count, setter;

        if (field.indexOf('week') === 0) {
            count = 7;
            setter = 'day';
        }
        else if (field.indexOf('month') === 0) {
            count = 12;
            setter = 'month';
        }
        else {
            return;
        }

        moment[field] = function (format, index) {
            var i, getter,
                method = moment._locale[field],
                results = [];

            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            getter = function (i) {
                var m = moment().utc().set(setter, i);
                return method.call(moment._locale, m, format || '');
            };

            if (index != null) {
                return getter(index);
            }
            else {
                for (i = 0; i < count; i++) {
                    results.push(getter(i));
                }
                return results;
            }
        };
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            if (coercedNumber >= 0) {
                value = Math.floor(coercedNumber);
            } else {
                value = Math.ceil(coercedNumber);
            }
        }

        return value;
    }

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    function weeksInYear(year, dow, doy) {
        return weekOfYear(moment([year, 11, 31 + dow - doy]), dow, doy).week;
    }

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function checkOverflow(m) {
        var overflow;
        if (m._a && m._pf.overflow === -2) {
            overflow =
                m._a[MONTH] < 0 || m._a[MONTH] > 11 ? MONTH :
                    m._a[DATE] < 1 || m._a[DATE] > daysInMonth(m._a[YEAR], m._a[MONTH]) ? DATE :
                        m._a[HOUR] < 0 || m._a[HOUR] > 24 ||
                            (m._a[HOUR] === 24 && (m._a[MINUTE] !== 0 ||
                                m._a[SECOND] !== 0 ||
                                m._a[MILLISECOND] !== 0)) ? HOUR :
                            m._a[MINUTE] < 0 || m._a[MINUTE] > 59 ? MINUTE :
                                m._a[SECOND] < 0 || m._a[SECOND] > 59 ? SECOND :
                                    m._a[MILLISECOND] < 0 || m._a[MILLISECOND] > 999 ? MILLISECOND :
                                        -1;

            if (m._pf._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            m._pf.overflow = overflow;
        }
    }

    function isValid(m) {
        if (m._isValid == null) {
            m._isValid = !isNaN(m._d.getTime()) &&
                m._pf.overflow < 0 &&
                !m._pf.empty &&
                !m._pf.invalidMonth &&
                !m._pf.nullInput &&
                !m._pf.invalidFormat &&
                !m._pf.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    m._pf.charsLeftOver === 0 &&
                    m._pf.unusedTokens.length === 0 &&
                    m._pf.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        if (!locales[name] && hasModule) {
            try {
                oldLocale = moment.locale();
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we want to undo that for lazy loaded locales
                moment.locale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // Return a moment from input, that is local/utc/utcOffset equivalent to
    // model.
    function makeAs(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (moment.isMoment(input) || isDate(input) ?
                +input : +moment(input)) - (+res);
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(+res._d + diff);
            moment.updateOffset(res, false);
            return res;
        } else {
            return moment(input).local();
        }
    }

    /************************************
        Locale
    ************************************/


    extend(Locale.prototype, {

        set: function (config) {
            var prop, i;
            for (i in config) {
                prop = config[i];
                if (typeof prop === 'function') {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
            // Lenient ordinal parsing accepts just a number in addition to
            // number + (possibly) stuff coming from _ordinalParseLenient.
            this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + /\d{1,2}/.source);
        },

        _months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
        months: function (m) {
            return this._months[m.month()];
        },

        _monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
        monthsShort: function (m) {
            return this._monthsShort[m.month()];
        },

        monthsParse: function (monthName, format, strict) {
            var i, mom, regex;

            if (!this._monthsParse) {
                this._monthsParse = [];
                this._longMonthsParse = [];
                this._shortMonthsParse = [];
            }

            for (i = 0; i < 12; i++) {
                // make the regex if we don't have it already
                mom = moment.utc([2000, i]);
                if (strict && !this._longMonthsParse[i]) {
                    this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                    this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
                }
                if (!strict && !this._monthsParse[i]) {
                    regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                    this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                    return i;
                } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                    return i;
                } else if (!strict && this._monthsParse[i].test(monthName)) {
                    return i;
                }
            }
        },

        _weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
        weekdays: function (m) {
            return this._weekdays[m.day()];
        },

        _weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        weekdaysShort: function (m) {
            return this._weekdaysShort[m.day()];
        },

        _weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
        weekdaysMin: function (m) {
            return this._weekdaysMin[m.day()];
        },

        weekdaysParse: function (weekdayName) {
            var i, mom, regex;

            if (!this._weekdaysParse) {
                this._weekdaysParse = [];
            }

            for (i = 0; i < 7; i++) {
                // make the regex if we don't have it already
                if (!this._weekdaysParse[i]) {
                    mom = moment([2000, 1]).day(i);
                    regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                    this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._weekdaysParse[i].test(weekdayName)) {
                    return i;
                }
            }
        },

        _longDateFormat: {
            LTS: 'h:mm:ss A',
            LT: 'h:mm A',
            L: 'MM/DD/YYYY',
            LL: 'MMMM D, YYYY',
            LLL: 'MMMM D, YYYY LT',
            LLLL: 'dddd, MMMM D, YYYY LT'
        },
        longDateFormat: function (key) {
            var output = this._longDateFormat[key];
            if (!output && this._longDateFormat[key.toUpperCase()]) {
                output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
                    return val.slice(1);
                });
                this._longDateFormat[key] = output;
            }
            return output;
        },

        isPM: function (input) {
            // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
            // Using charAt should be more compatible.
            return ((input + '').toLowerCase().charAt(0) === 'p');
        },

        _meridiemParse: /[ap]\.?m?\.?/i,
        meridiem: function (hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? 'pm' : 'PM';
            } else {
                return isLower ? 'am' : 'AM';
            }
        },


        _calendar: {
            sameDay: '[Today at] LT',
            nextDay: '[Tomorrow at] LT',
            nextWeek: 'dddd [at] LT',
            lastDay: '[Yesterday at] LT',
            lastWeek: '[Last] dddd [at] LT',
            sameElse: 'L'
        },
        calendar: function (key, mom, now) {
            var output = this._calendar[key];
            return typeof output === 'function' ? output.apply(mom, [now]) : output;
        },

        _relativeTime: {
            future: 'in %s',
            past: '%s ago',
            s: 'a few seconds',
            m: 'a minute',
            mm: '%d minutes',
            h: 'an hour',
            hh: '%d hours',
            d: 'a day',
            dd: '%d days',
            M: 'a month',
            MM: '%d months',
            y: 'a year',
            yy: '%d years'
        },

        relativeTime: function (number, withoutSuffix, string, isFuture) {
            var output = this._relativeTime[string];
            return (typeof output === 'function') ?
                output(number, withoutSuffix, string, isFuture) :
                output.replace(/%d/i, number);
        },

        pastFuture: function (diff, output) {
            var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
            return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
        },

        ordinal: function (number) {
            return this._ordinal.replace('%d', number);
        },
        _ordinal: '%d',
        _ordinalParse: /\d{1,2}/,

        preparse: function (string) {
            return string;
        },

        postformat: function (string) {
            return string;
        },

        week: function (mom) {
            return weekOfYear(mom, this._week.dow, this._week.doy).week;
        },

        _week: {
            dow: 0, // Sunday is the first day of the week.
            doy: 6  // The week that contains Jan 1st is the first week of the year.
        },

        firstDayOfWeek: function () {
            return this._week.dow;
        },

        firstDayOfYear: function () {
            return this._week.doy;
        },

        _invalidDate: 'Invalid date',
        invalidDate: function () {
            return this._invalidDate;
        }
    });

    /************************************
        Formatting
    ************************************/


    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());

        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format);
        }

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }


    /************************************
        Parsing
    ************************************/


    // get the regex to find the next token
    function getParseRegexForToken(token, config) {
        var a, strict = config._strict;
        switch (token) {
            case 'Q':
                return parseTokenOneDigit;
            case 'DDDD':
                return parseTokenThreeDigits;
            case 'YYYY':
            case 'GGGG':
            case 'gggg':
                return strict ? parseTokenFourDigits : parseTokenOneToFourDigits;
            case 'Y':
            case 'G':
            case 'g':
                return parseTokenSignedNumber;
            case 'YYYYYY':
            case 'YYYYY':
            case 'GGGGG':
            case 'ggggg':
                return strict ? parseTokenSixDigits : parseTokenOneToSixDigits;
            case 'S':
                if (strict) {
                    return parseTokenOneDigit;
                }
            /* falls through */
            case 'SS':
                if (strict) {
                    return parseTokenTwoDigits;
                }
            /* falls through */
            case 'SSS':
                if (strict) {
                    return parseTokenThreeDigits;
                }
            /* falls through */
            case 'DDD':
                return parseTokenOneToThreeDigits;
            case 'MMM':
            case 'MMMM':
            case 'dd':
            case 'ddd':
            case 'dddd':
                return parseTokenWord;
            case 'a':
            case 'A':
                return config._locale._meridiemParse;
            case 'x':
                return parseTokenOffsetMs;
            case 'X':
                return parseTokenTimestampMs;
            case 'Z':
            case 'ZZ':
                return parseTokenTimezone;
            case 'T':
                return parseTokenT;
            case 'SSSS':
                return parseTokenDigits;
            case 'MM':
            case 'DD':
            case 'YY':
            case 'GG':
            case 'gg':
            case 'HH':
            case 'hh':
            case 'mm':
            case 'ss':
            case 'ww':
            case 'WW':
                return strict ? parseTokenTwoDigits : parseTokenOneOrTwoDigits;
            case 'M':
            case 'D':
            case 'd':
            case 'H':
            case 'h':
            case 'm':
            case 's':
            case 'w':
            case 'W':
            case 'e':
            case 'E':
                return parseTokenOneOrTwoDigits;
            case 'Do':
                return strict ? config._locale._ordinalParse : config._locale._ordinalParseLenient;
            default:
                a = new RegExp(regexpEscape(unescapeFormat(token.replace('\\', '')), 'i'));
                return a;
        }
    }

    function utcOffsetFromString(string) {
        string = string || '';
        var possibleTzMatches = (string.match(parseTokenTimezone) || []),
            tzChunk = possibleTzMatches[possibleTzMatches.length - 1] || [],
            parts = (tzChunk + '').match(parseTimezoneChunker) || ['-', 0, 0],
            minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? minutes : -minutes;
    }

    // function to convert string input to date
    function addTimeToArrayFromToken(token, input, config) {
        var a, datePartArray = config._a;

        switch (token) {
            // QUARTER
            case 'Q':
                if (input != null) {
                    datePartArray[MONTH] = (toInt(input) - 1) * 3;
                }
                break;
            // MONTH
            case 'M': // fall through to MM
            case 'MM':
                if (input != null) {
                    datePartArray[MONTH] = toInt(input) - 1;
                }
                break;
            case 'MMM': // fall through to MMMM
            case 'MMMM':
                a = config._locale.monthsParse(input, token, config._strict);
                // if we didn't find a month name, mark the date as invalid.
                if (a != null) {
                    datePartArray[MONTH] = a;
                } else {
                    config._pf.invalidMonth = input;
                }
                break;
            // DAY OF MONTH
            case 'D': // fall through to DD
            case 'DD':
                if (input != null) {
                    datePartArray[DATE] = toInt(input);
                }
                break;
            case 'Do':
                if (input != null) {
                    datePartArray[DATE] = toInt(parseInt(
                        input.match(/\d{1,2}/)[0], 10));
                }
                break;
            // DAY OF YEAR
            case 'DDD': // fall through to DDDD
            case 'DDDD':
                if (input != null) {
                    config._dayOfYear = toInt(input);
                }

                break;
            // YEAR
            case 'YY':
                datePartArray[YEAR] = moment.parseTwoDigitYear(input);
                break;
            case 'YYYY':
            case 'YYYYY':
            case 'YYYYYY':
                datePartArray[YEAR] = toInt(input);
                break;
            // AM / PM
            case 'a': // fall through to A
            case 'A':
                config._meridiem = input;
                // config._isPm = config._locale.isPM(input);
                break;
            // HOUR
            case 'h': // fall through to hh
            case 'hh':
                config._pf.bigHour = true;
            /* falls through */
            case 'H': // fall through to HH
            case 'HH':
                datePartArray[HOUR] = toInt(input);
                break;
            // MINUTE
            case 'm': // fall through to mm
            case 'mm':
                datePartArray[MINUTE] = toInt(input);
                break;
            // SECOND
            case 's': // fall through to ss
            case 'ss':
                datePartArray[SECOND] = toInt(input);
                break;
            // MILLISECOND
            case 'S':
            case 'SS':
            case 'SSS':
            case 'SSSS':
                datePartArray[MILLISECOND] = toInt(('0.' + input) * 1000);
                break;
            // UNIX OFFSET (MILLISECONDS)
            case 'x':
                config._d = new Date(toInt(input));
                break;
            // UNIX TIMESTAMP WITH MS
            case 'X':
                config._d = new Date(parseFloat(input) * 1000);
                break;
            // TIMEZONE
            case 'Z': // fall through to ZZ
            case 'ZZ':
                config._useUTC = true;
                config._tzm = utcOffsetFromString(input);
                break;
            // WEEKDAY - human
            case 'dd':
            case 'ddd':
            case 'dddd':
                a = config._locale.weekdaysParse(input);
                // if we didn't get a weekday name, mark the date as invalid
                if (a != null) {
                    config._w = config._w || {};
                    config._w['d'] = a;
                } else {
                    config._pf.invalidWeekday = input;
                }
                break;
            // WEEK, WEEK DAY - numeric
            case 'w':
            case 'ww':
            case 'W':
            case 'WW':
            case 'd':
            case 'e':
            case 'E':
                token = token.substr(0, 1);
            /* falls through */
            case 'gggg':
            case 'GGGG':
            case 'GGGGG':
                token = token.substr(0, 2);
                if (input) {
                    config._w = config._w || {};
                    config._w[token] = toInt(input);
                }
                break;
            case 'gg':
            case 'GG':
                config._w = config._w || {};
                config._w[token] = moment.parseTwoDigitYear(input);
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = dfl(w.GG, config._a[YEAR], weekOfYear(moment(), 1, 4).year);
            week = dfl(w.W, 1);
            weekday = dfl(w.E, 1);
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = dfl(w.gg, config._a[YEAR], weekOfYear(moment(), dow, doy).year);
            week = dfl(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < dow) {
                    ++week;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);

        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function dateFromConfig(config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = dfl(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                config._pf._overflowDayOfYear = true;
            }

            date = makeUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
            config._a[MINUTE] === 0 &&
            config._a[SECOND] === 0 &&
            config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? makeUTCDate : makeDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dateFromObject(config) {
        var normalizedInput;

        if (config._d) {
            return;
        }

        normalizedInput = normalizeObjectUnits(config._i);
        config._a = [
            normalizedInput.year,
            normalizedInput.month,
            normalizedInput.day || normalizedInput.date,
            normalizedInput.hour,
            normalizedInput.minute,
            normalizedInput.second,
            normalizedInput.millisecond
        ];

        dateFromConfig(config);
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate()
            ];
        } else {
            return [now.getFullYear(), now.getMonth(), now.getDate()];
        }
    }

    // date from string and format string
    function makeDateFromStringAndFormat(config) {
        if (config._f === moment.ISO_8601) {
            parseISO(config);
            return;
        }

        config._a = [];
        config._pf.empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    config._pf.unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    config._pf.empty = false;
                }
                else {
                    config._pf.unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                config._pf.unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        config._pf.charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            config._pf.unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (config._pf.bigHour === true && config._a[HOUR] <= 12) {
            config._pf.bigHour = undefined;
        }
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR],
            config._meridiem);
        dateFromConfig(config);
        checkOverflow(config);
    }

    function unescapeFormat(s) {
        return s.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        });
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function regexpEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    // date from string and array of format strings
    function makeDateFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            config._pf.invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._pf = defaultParsingFlags();
            tempConfig._f = config._f[i];
            makeDateFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += tempConfig._pf.charsLeftOver;

            //or tokens
            currentScore += tempConfig._pf.unusedTokens.length * 10;

            tempConfig._pf.score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    // date from iso format
    function parseISO(config) {
        var i, l,
            string = config._i,
            match = isoRegex.exec(string);

        if (match) {
            config._pf.iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    // match[5] should be 'T' or undefined
                    config._f = isoDates[i][0] + (match[6] || ' ');
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    config._f += isoTimes[i][0];
                    break;
                }
            }
            if (string.match(parseTokenTimezone)) {
                config._f += 'Z';
            }
            makeDateFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function makeDateFromString(config) {
        parseISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            moment.createFromInputFallback(config);
        }
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function makeDateFromInput(config) {
        var input = config._i, matched;
        if (input === undefined) {
            config._d = new Date();
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if ((matched = aspNetJsonRegex.exec(input)) !== null) {
            config._d = new Date(+matched[1]);
        } else if (typeof input === 'string') {
            makeDateFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            dateFromConfig(config);
        } else if (typeof (input) === 'object') {
            dateFromObject(config);
        } else if (typeof (input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            moment.createFromInputFallback(config);
        }
    }

    function makeDate(y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function makeUTCDate(y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    function parseWeekday(input, locale) {
        if (typeof input === 'string') {
            if (!isNaN(input)) {
                input = parseInt(input, 10);
            }
            else {
                input = locale.weekdaysParse(input);
                if (typeof input !== 'number') {
                    return null;
                }
            }
        }
        return input;
    }

    /************************************
        Relative Time
    ************************************/


    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime(posNegDuration, withoutSuffix, locale) {
        var duration = moment.duration(posNegDuration).abs(),
            seconds = round(duration.as('s')),
            minutes = round(duration.as('m')),
            hours = round(duration.as('h')),
            days = round(duration.as('d')),
            months = round(duration.as('M')),
            years = round(duration.as('y')),

            args = seconds < relativeTimeThresholds.s && ['s', seconds] ||
                minutes === 1 && ['m'] ||
                minutes < relativeTimeThresholds.m && ['mm', minutes] ||
                hours === 1 && ['h'] ||
                hours < relativeTimeThresholds.h && ['hh', hours] ||
                days === 1 && ['d'] ||
                days < relativeTimeThresholds.d && ['dd', days] ||
                months === 1 && ['M'] ||
                months < relativeTimeThresholds.M && ['MM', months] ||
                years === 1 && ['y'] || ['yy', years];

        args[2] = withoutSuffix;
        args[3] = +posNegDuration > 0;
        args[4] = locale;
        return substituteTimeAgo.apply({}, args);
    }


    /************************************
        Week of Year
    ************************************/


    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = moment(mom).add(daysToDayOfWeek, 'd');
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var d = makeUTCDate(year, 0, 1).getUTCDay(), daysToAdd, dayOfYear;

        d = d === 0 ? 7 : d;
        weekday = weekday != null ? weekday : firstDayOfWeek;
        daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0) - (d < firstDayOfWeek ? 7 : 0);
        dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ? dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    /************************************
        Top Level Functions
    ************************************/

    function makeMoment(config) {
        var input = config._i,
            format = config._f,
            res;

        config._locale = config._locale || moment.localeData(config._l);

        if (input === null || (format === undefined && input === '')) {
            return moment.invalid({ nullInput: true });
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (moment.isMoment(input)) {
            return new Moment(input, true);
        } else if (format) {
            if (isArray(format)) {
                makeDateFromStringAndArray(config);
            } else {
                makeDateFromStringAndFormat(config);
            }
        } else {
            makeDateFromInput(config);
        }

        res = new Moment(config);
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    moment = function (input, format, locale, strict) {
        var c;

        if (typeof (locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._i = input;
        c._f = format;
        c._l = locale;
        c._strict = strict;
        c._isUTC = false;
        c._pf = defaultParsingFlags();

        return makeMoment(c);
    };

    moment.suppressDeprecationWarnings = false;

    moment.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return moment();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    moment.min = function () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    };

    moment.max = function () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    };

    // creating with utc
    moment.utc = function (input, format, locale, strict) {
        var c;

        if (typeof (locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._useUTC = true;
        c._isUTC = true;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;
        c._pf = defaultParsingFlags();

        return makeMoment(c).utc();
    };

    // creating with unix timestamp (in seconds)
    moment.unix = function (input) {
        return moment(input * 1000);
    };

    // duration
    moment.duration = function (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            parseIso,
            diffRes;

        if (moment.isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetTimeSpanJsonRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = isoDurationRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            parseIso = function (inp) {
                // We'd normally use ~~inp for this, but unfortunately it also
                // converts floats to ints.
                // inp may be undefined, so careful calling replace on it.
                var res = inp && parseFloat(inp.replace(',', '.'));
                // apply sign while we're at it
                return (isNaN(res) ? 0 : res) * sign;
            };
            duration = {
                y: parseIso(match[2]),
                M: parseIso(match[3]),
                d: parseIso(match[4]),
                h: parseIso(match[5]),
                m: parseIso(match[6]),
                s: parseIso(match[7]),
                w: parseIso(match[8])
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' &&
            ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(moment(duration.from), moment(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (moment.isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    };

    // version number
    moment.version = VERSION;

    // default format
    moment.defaultFormat = isoFormat;

    // constant that refers to the ISO standard
    moment.ISO_8601 = function () { };

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    moment.momentProperties = momentProperties;

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    moment.updateOffset = function () { };

    // This function allows you to set a threshold for relative time strings
    moment.relativeTimeThreshold = function (threshold, limit) {
        if (relativeTimeThresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return relativeTimeThresholds[threshold];
        }
        relativeTimeThresholds[threshold] = limit;
        return true;
    };

    moment.lang = deprecate(
        'moment.lang is deprecated. Use moment.locale instead.',
        function (key, value) {
            return moment.locale(key, value);
        }
    );

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    moment.locale = function (key, values) {
        var data;
        if (key) {
            if (typeof (values) !== 'undefined') {
                data = moment.defineLocale(key, values);
            }
            else {
                data = moment.localeData(key);
            }

            if (data) {
                moment.duration._locale = moment._locale = data;
            }
        }

        return moment._locale._abbr;
    };

    moment.defineLocale = function (name, values) {
        if (values !== null) {
            values.abbr = name;
            if (!locales[name]) {
                locales[name] = new Locale();
            }
            locales[name].set(values);

            // backwards compat for now: also set the locale
            moment.locale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    };

    moment.langData = deprecate(
        'moment.langData is deprecated. Use moment.localeData instead.',
        function (key) {
            return moment.localeData(key);
        }
    );

    // returns locale data
    moment.localeData = function (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return moment._locale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    };

    // compare moment object
    moment.isMoment = function (obj) {
        return obj instanceof Moment ||
            (obj != null && hasOwnProp(obj, '_isAMomentObject'));
    };

    // for typechecking Duration objects
    moment.isDuration = function (obj) {
        return obj instanceof Duration;
    };

    for (i = lists.length - 1; i >= 0; --i) {
        makeList(lists[i]);
    }

    moment.normalizeUnits = function (units) {
        return normalizeUnits(units);
    };

    moment.invalid = function (flags) {
        var m = moment.utc(NaN);
        if (flags != null) {
            extend(m._pf, flags);
        }
        else {
            m._pf.userInvalidated = true;
        }

        return m;
    };

    moment.parseZone = function () {
        return moment.apply(null, arguments).parseZone();
    };

    moment.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    moment.isDate = isDate;

    /************************************
        Moment Prototype
    ************************************/


    extend(moment.fn = Moment.prototype, {

        clone: function () {
            return moment(this);
        },

        valueOf: function () {
            return +this._d - ((this._offset || 0) * 60000);
        },

        unix: function () {
            return Math.floor(+this / 1000);
        },

        toString: function () {
            return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
        },

        toDate: function () {
            return this._offset ? new Date(+this) : this._d;
        },

        toISOString: function () {
            var m = moment(this).utc();
            if (0 < m.year() && m.year() <= 9999) {
                if ('function' === typeof Date.prototype.toISOString) {
                    // native implementation is ~50x faster, use it when we can
                    return this.toDate().toISOString();
                } else {
                    return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
                }
            } else {
                return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        },

        toArray: function () {
            var m = this;
            return [
                m.year(),
                m.month(),
                m.date(),
                m.hours(),
                m.minutes(),
                m.seconds(),
                m.milliseconds()
            ];
        },

        isValid: function () {
            return isValid(this);
        },

        isDSTShifted: function () {
            if (this._a) {
                return this.isValid() && compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray()) > 0;
            }

            return false;
        },

        parsingFlags: function () {
            return extend({}, this._pf);
        },

        invalidAt: function () {
            return this._pf.overflow;
        },

        utc: function (keepLocalTime) {
            return this.utcOffset(0, keepLocalTime);
        },

        local: function (keepLocalTime) {
            if (this._isUTC) {
                this.utcOffset(0, keepLocalTime);
                this._isUTC = false;

                if (keepLocalTime) {
                    this.subtract(this._dateUtcOffset(), 'm');
                }
            }
            return this;
        },

        format: function (inputString) {
            var output = formatMoment(this, inputString || moment.defaultFormat);
            return this.localeData().postformat(output);
        },

        add: createAdder(1, 'add'),

        subtract: createAdder(-1, 'subtract'),

        diff: function (input, units, asFloat) {
            var that = makeAs(input, this),
                zoneDiff = (that.utcOffset() - this.utcOffset()) * 6e4,
                anchor, diff, output, daysAdjust;

            units = normalizeUnits(units);

            if (units === 'year' || units === 'month' || units === 'quarter') {
                output = monthDiff(this, that);
                if (units === 'quarter') {
                    output = output / 3;
                } else if (units === 'year') {
                    output = output / 12;
                }
            } else {
                diff = this - that;
                output = units === 'second' ? diff / 1e3 : // 1000
                    units === 'minute' ? diff / 6e4 : // 1000 * 60
                        units === 'hour' ? diff / 36e5 : // 1000 * 60 * 60
                            units === 'day' ? (diff - zoneDiff) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                                units === 'week' ? (diff - zoneDiff) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                                    diff;
            }
            return asFloat ? output : absRound(output);
        },

        from: function (time, withoutSuffix) {
            return moment.duration({ to: this, from: time }).locale(this.locale()).humanize(!withoutSuffix);
        },

        fromNow: function (withoutSuffix) {
            return this.from(moment(), withoutSuffix);
        },

        calendar: function (time) {
            // We want to compare the start of today, vs this.
            // Getting start-of-today depends on whether we're locat/utc/offset
            // or not.
            var now = time || moment(),
                sod = makeAs(now, this).startOf('day'),
                diff = this.diff(sod, 'days', true),
                format = diff < -6 ? 'sameElse' :
                    diff < -1 ? 'lastWeek' :
                        diff < 0 ? 'lastDay' :
                            diff < 1 ? 'sameDay' :
                                diff < 2 ? 'nextDay' :
                                    diff < 7 ? 'nextWeek' : 'sameElse';
            return this.format(this.localeData().calendar(format, this, moment(now)));
        },

        isLeapYear: function () {
            return isLeapYear(this.year());
        },

        isDST: function () {
            return (this.utcOffset() > this.clone().month(0).utcOffset() ||
                this.utcOffset() > this.clone().month(5).utcOffset());
        },

        day: function (input) {
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            if (input != null) {
                input = parseWeekday(input, this.localeData());
                return this.add(input - day, 'd');
            } else {
                return day;
            }
        },

        month: makeAccessor('Month', true),

        startOf: function (units) {
            units = normalizeUnits(units);
            // the following switch intentionally omits break keywords
            // to utilize falling through the cases.
            switch (units) {
                case 'year':
                    this.month(0);
                /* falls through */
                case 'quarter':
                case 'month':
                    this.date(1);
                /* falls through */
                case 'week':
                case 'isoWeek':
                case 'day':
                    this.hours(0);
                /* falls through */
                case 'hour':
                    this.minutes(0);
                /* falls through */
                case 'minute':
                    this.seconds(0);
                /* falls through */
                case 'second':
                    this.milliseconds(0);
                /* falls through */
            }

            // weeks are a special case
            if (units === 'week') {
                this.weekday(0);
            } else if (units === 'isoWeek') {
                this.isoWeekday(1);
            }

            // quarters are also special
            if (units === 'quarter') {
                this.month(Math.floor(this.month() / 3) * 3);
            }

            return this;
        },

        endOf: function (units) {
            units = normalizeUnits(units);
            if (units === undefined || units === 'millisecond') {
                return this;
            }
            return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
        },

        isAfter: function (input, units) {
            var inputMs;
            units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
            if (units === 'millisecond') {
                input = moment.isMoment(input) ? input : moment(input);
                return +this > +input;
            } else {
                inputMs = moment.isMoment(input) ? +input : +moment(input);
                return inputMs < +this.clone().startOf(units);
            }
        },

        isBefore: function (input, units) {
            var inputMs;
            units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
            if (units === 'millisecond') {
                input = moment.isMoment(input) ? input : moment(input);
                return +this < +input;
            } else {
                inputMs = moment.isMoment(input) ? +input : +moment(input);
                return +this.clone().endOf(units) < inputMs;
            }
        },

        isBetween: function (from, to, units) {
            return this.isAfter(from, units) && this.isBefore(to, units);
        },

        isSame: function (input, units) {
            var inputMs;
            units = normalizeUnits(units || 'millisecond');
            if (units === 'millisecond') {
                input = moment.isMoment(input) ? input : moment(input);
                return +this === +input;
            } else {
                inputMs = +moment(input);
                return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));
            }
        },

        min: deprecate(
            'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
            function (other) {
                other = moment.apply(null, arguments);
                return other < this ? this : other;
            }
        ),

        max: deprecate(
            'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
            function (other) {
                other = moment.apply(null, arguments);
                return other > this ? this : other;
            }
        ),

        zone: deprecate(
            'moment().zone is deprecated, use moment().utcOffset instead. ' +
            'https://github.com/moment/moment/issues/1779',
            function (input, keepLocalTime) {
                if (input != null) {
                    if (typeof input !== 'string') {
                        input = -input;
                    }

                    this.utcOffset(input, keepLocalTime);

                    return this;
                } else {
                    return -this.utcOffset();
                }
            }
        ),

        // keepLocalTime = true means only change the timezone, without
        // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
        // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
        // +0200, so we adjust the time as needed, to be valid.
        //
        // Keeping the time actually adds/subtracts (one hour)
        // from the actual represented time. That is why we call updateOffset
        // a second time. In case it wants us to change the offset again
        // _changeInProgress == true case, then we have to adjust, because
        // there is no such time in the given timezone.
        utcOffset: function (input, keepLocalTime) {
            var offset = this._offset || 0,
                localAdjust;
            if (input != null) {
                if (typeof input === 'string') {
                    input = utcOffsetFromString(input);
                }
                if (Math.abs(input) < 16) {
                    input = input * 60;
                }
                if (!this._isUTC && keepLocalTime) {
                    localAdjust = this._dateUtcOffset();
                }
                this._offset = input;
                this._isUTC = true;
                if (localAdjust != null) {
                    this.add(localAdjust, 'm');
                }
                if (offset !== input) {
                    if (!keepLocalTime || this._changeInProgress) {
                        addOrSubtractDurationFromMoment(this,
                            moment.duration(input - offset, 'm'), 1, false);
                    } else if (!this._changeInProgress) {
                        this._changeInProgress = true;
                        moment.updateOffset(this, true);
                        this._changeInProgress = null;
                    }
                }

                return this;
            } else {
                return this._isUTC ? offset : this._dateUtcOffset();
            }
        },

        isLocal: function () {
            return !this._isUTC;
        },

        isUtcOffset: function () {
            return this._isUTC;
        },

        isUtc: function () {
            return this._isUTC && this._offset === 0;
        },

        zoneAbbr: function () {
            return this._isUTC ? 'UTC' : '';
        },

        zoneName: function () {
            return this._isUTC ? 'Coordinated Universal Time' : '';
        },

        parseZone: function () {
            if (this._tzm) {
                this.utcOffset(this._tzm);
            } else if (typeof this._i === 'string') {
                this.utcOffset(utcOffsetFromString(this._i));
            }
            return this;
        },

        hasAlignedHourOffset: function (input) {
            if (!input) {
                input = 0;
            }
            else {
                input = moment(input).utcOffset();
            }

            return (this.utcOffset() - input) % 60 === 0;
        },

        daysInMonth: function () {
            return daysInMonth(this.year(), this.month());
        },

        dayOfYear: function (input) {
            var dayOfYear = round((moment(this).startOf('day') - moment(this).startOf('year')) / 864e5) + 1;
            return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
        },

        quarter: function (input) {
            return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
        },

        weekYear: function (input) {
            var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
            return input == null ? year : this.add((input - year), 'y');
        },

        isoWeekYear: function (input) {
            var year = weekOfYear(this, 1, 4).year;
            return input == null ? year : this.add((input - year), 'y');
        },

        week: function (input) {
            var week = this.localeData().week(this);
            return input == null ? week : this.add((input - week) * 7, 'd');
        },

        isoWeek: function (input) {
            var week = weekOfYear(this, 1, 4).week;
            return input == null ? week : this.add((input - week) * 7, 'd');
        },

        weekday: function (input) {
            var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
            return input == null ? weekday : this.add(input - weekday, 'd');
        },

        isoWeekday: function (input) {
            // behaves the same as moment#day except
            // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
            // as a setter, sunday should belong to the previous week.
            return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
        },

        isoWeeksInYear: function () {
            return weeksInYear(this.year(), 1, 4);
        },

        weeksInYear: function () {
            var weekInfo = this.localeData()._week;
            return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
        },

        get: function (units) {
            units = normalizeUnits(units);
            return this[units]();
        },

        set: function (units, value) {
            var unit;
            if (typeof units === 'object') {
                for (unit in units) {
                    this.set(unit, units[unit]);
                }
            }
            else {
                units = normalizeUnits(units);
                if (typeof this[units] === 'function') {
                    this[units](value);
                }
            }
            return this;
        },

        // If passed a locale key, it will set the locale for this
        // instance.  Otherwise, it will return the locale configuration
        // variables for this instance.
        locale: function (key) {
            var newLocaleData;

            if (key === undefined) {
                return this._locale._abbr;
            } else {
                newLocaleData = moment.localeData(key);
                if (newLocaleData != null) {
                    this._locale = newLocaleData;
                }
                return this;
            }
        },

        lang: deprecate(
            'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
            function (key) {
                if (key === undefined) {
                    return this.localeData();
                } else {
                    return this.locale(key);
                }
            }
        ),

        localeData: function () {
            return this._locale;
        },

        _dateUtcOffset: function () {
            // On Firefox.24 Date#getTimezoneOffset returns a floating point.
            // https://github.com/moment/moment/pull/1871
            return -Math.round(this._d.getTimezoneOffset() / 15) * 15;
        }

    });

    function rawMonthSetter(mom, value) {
        var dayOfMonth;

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(),
            daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function rawGetter(mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
    }

    function rawSetter(mom, unit, value) {
        if (unit === 'Month') {
            return rawMonthSetter(mom, value);
        } else {
            return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
        }
    }

    function makeAccessor(unit, keepTime) {
        return function (value) {
            if (value != null) {
                rawSetter(this, unit, value);
                moment.updateOffset(this, keepTime);
                return this;
            } else {
                return rawGetter(this, unit);
            }
        };
    }

    moment.fn.millisecond = moment.fn.milliseconds = makeAccessor('Milliseconds', false);
    moment.fn.second = moment.fn.seconds = makeAccessor('Seconds', false);
    moment.fn.minute = moment.fn.minutes = makeAccessor('Minutes', false);
    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    moment.fn.hour = moment.fn.hours = makeAccessor('Hours', true);
    // moment.fn.month is defined separately
    moment.fn.date = makeAccessor('Date', true);
    moment.fn.dates = deprecate('dates accessor is deprecated. Use date instead.', makeAccessor('Date', true));
    moment.fn.year = makeAccessor('FullYear', true);
    moment.fn.years = deprecate('years accessor is deprecated. Use year instead.', makeAccessor('FullYear', true));

    // add plural methods
    moment.fn.days = moment.fn.day;
    moment.fn.months = moment.fn.month;
    moment.fn.weeks = moment.fn.week;
    moment.fn.isoWeeks = moment.fn.isoWeek;
    moment.fn.quarters = moment.fn.quarter;

    // add aliased format methods
    moment.fn.toJSON = moment.fn.toISOString;

    // alias isUtc for dev-friendliness
    moment.fn.isUTC = moment.fn.isUtc;

    /************************************
        Duration Prototype
    ************************************/


    function daysToYears(days) {
        // 400 years have 146097 days (taking into account leap year rules)
        return days * 400 / 146097;
    }

    function yearsToDays(years) {
        // years * 365 + absRound(years / 4) -
        //     absRound(years / 100) + absRound(years / 400);
        return years * 146097 / 400;
    }

    extend(moment.duration.fn = Duration.prototype, {

        _bubble: function () {
            var milliseconds = this._milliseconds,
                days = this._days,
                months = this._months,
                data = this._data,
                seconds, minutes, hours, years = 0;

            // The following code bubbles up values, see the tests for
            // examples of what that means.
            data.milliseconds = milliseconds % 1000;

            seconds = absRound(milliseconds / 1000);
            data.seconds = seconds % 60;

            minutes = absRound(seconds / 60);
            data.minutes = minutes % 60;

            hours = absRound(minutes / 60);
            data.hours = hours % 24;

            days += absRound(hours / 24);

            // Accurately convert days to years, assume start from year 0.
            years = absRound(daysToYears(days));
            days -= absRound(yearsToDays(years));

            // 30 days to a month
            // TODO (iskren): Use anchor date (like 1st Jan) to compute this.
            months += absRound(days / 30);
            days %= 30;

            // 12 months -> 1 year
            years += absRound(months / 12);
            months %= 12;

            data.days = days;
            data.months = months;
            data.years = years;
        },

        abs: function () {
            this._milliseconds = Math.abs(this._milliseconds);
            this._days = Math.abs(this._days);
            this._months = Math.abs(this._months);

            this._data.milliseconds = Math.abs(this._data.milliseconds);
            this._data.seconds = Math.abs(this._data.seconds);
            this._data.minutes = Math.abs(this._data.minutes);
            this._data.hours = Math.abs(this._data.hours);
            this._data.months = Math.abs(this._data.months);
            this._data.years = Math.abs(this._data.years);

            return this;
        },

        weeks: function () {
            return absRound(this.days() / 7);
        },

        valueOf: function () {
            return this._milliseconds +
                this._days * 864e5 +
                (this._months % 12) * 2592e6 +
                toInt(this._months / 12) * 31536e6;
        },

        humanize: function (withSuffix) {
            var output = relativeTime(this, !withSuffix, this.localeData());

            if (withSuffix) {
                output = this.localeData().pastFuture(+this, output);
            }

            return this.localeData().postformat(output);
        },

        add: function (input, val) {
            // supports only 2.0-style add(1, 's') or add(moment)
            var dur = moment.duration(input, val);

            this._milliseconds += dur._milliseconds;
            this._days += dur._days;
            this._months += dur._months;

            this._bubble();

            return this;
        },

        subtract: function (input, val) {
            var dur = moment.duration(input, val);

            this._milliseconds -= dur._milliseconds;
            this._days -= dur._days;
            this._months -= dur._months;

            this._bubble();

            return this;
        },

        get: function (units) {
            units = normalizeUnits(units);
            return this[units.toLowerCase() + 's']();
        },

        as: function (units) {
            var days, months;
            units = normalizeUnits(units);

            if (units === 'month' || units === 'year') {
                days = this._days + this._milliseconds / 864e5;
                months = this._months + daysToYears(days) * 12;
                return units === 'month' ? months : months / 12;
            } else {
                // handle milliseconds separately because of floating point math errors (issue #1867)
                days = this._days + Math.round(yearsToDays(this._months / 12));
                switch (units) {
                    case 'week': return days / 7 + this._milliseconds / 6048e5;
                    case 'day': return days + this._milliseconds / 864e5;
                    case 'hour': return days * 24 + this._milliseconds / 36e5;
                    case 'minute': return days * 24 * 60 + this._milliseconds / 6e4;
                    case 'second': return days * 24 * 60 * 60 + this._milliseconds / 1000;
                    // Math.floor prevents floating point math errors here
                    case 'millisecond': return Math.floor(days * 24 * 60 * 60 * 1000) + this._milliseconds;
                    default: throw new Error('Unknown unit ' + units);
                }
            }
        },

        lang: moment.fn.lang,
        locale: moment.fn.locale,

        toIsoString: deprecate(
            'toIsoString() is deprecated. Please use toISOString() instead ' +
            '(notice the capitals)',
            function () {
                return this.toISOString();
            }
        ),

        toISOString: function () {
            // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
            var years = Math.abs(this.years()),
                months = Math.abs(this.months()),
                days = Math.abs(this.days()),
                hours = Math.abs(this.hours()),
                minutes = Math.abs(this.minutes()),
                seconds = Math.abs(this.seconds() + this.milliseconds() / 1000);

            if (!this.asSeconds()) {
                // this is the same as C#'s (Noda) and python (isodate)...
                // but not other JS (goog.date)
                return 'P0D';
            }

            return (this.asSeconds() < 0 ? '-' : '') +
                'P' +
                (years ? years + 'Y' : '') +
                (months ? months + 'M' : '') +
                (days ? days + 'D' : '') +
                ((hours || minutes || seconds) ? 'T' : '') +
                (hours ? hours + 'H' : '') +
                (minutes ? minutes + 'M' : '') +
                (seconds ? seconds + 'S' : '');
        },

        localeData: function () {
            return this._locale;
        },

        toJSON: function () {
            return this.toISOString();
        }
    });

    moment.duration.fn.toString = moment.duration.fn.toISOString;

    function makeDurationGetter(name) {
        moment.duration.fn[name] = function () {
            return this._data[name];
        };
    }

    for (i in unitMillisecondFactors) {
        if (hasOwnProp(unitMillisecondFactors, i)) {
            makeDurationGetter(i.toLowerCase());
        }
    }

    moment.duration.fn.asMilliseconds = function () {
        return this.as('ms');
    };
    moment.duration.fn.asSeconds = function () {
        return this.as('s');
    };
    moment.duration.fn.asMinutes = function () {
        return this.as('m');
    };
    moment.duration.fn.asHours = function () {
        return this.as('h');
    };
    moment.duration.fn.asDays = function () {
        return this.as('d');
    };
    moment.duration.fn.asWeeks = function () {
        return this.as('weeks');
    };
    moment.duration.fn.asMonths = function () {
        return this.as('M');
    };
    moment.duration.fn.asYears = function () {
        return this.as('y');
    };

    /************************************
        Default Locale
    ************************************/


    // Set default locale, other locale will inherit from English.
    moment.locale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                    (b === 1) ? 'st' :
                        (b === 2) ? 'nd' :
                            (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // moment.js locale configuration
    // locale : afrikaans (af)
    // author : Werner Mollentze : https://github.com/wernerm

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('af', {
            months: 'Januarie_Februarie_Maart_April_Mei_Junie_Julie_Augustus_September_Oktober_November_Desember'.split('_'),
            monthsShort: 'Jan_Feb_Mar_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Des'.split('_'),
            weekdays: 'Sondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrydag_Saterdag'.split('_'),
            weekdaysShort: 'Son_Maa_Din_Woe_Don_Vry_Sat'.split('_'),
            weekdaysMin: 'So_Ma_Di_Wo_Do_Vr_Sa'.split('_'),
            meridiemParse: /vm|nm/i,
            isPM: function (input) {
                return /^nm$/i.test(input);
            },
            meridiem: function (hours, minutes, isLower) {
                if (hours < 12) {
                    return isLower ? 'vm' : 'VM';
                } else {
                    return isLower ? 'nm' : 'NM';
                }
            },
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd, D MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[Vandag om] LT',
                nextDay: '[Môre om] LT',
                nextWeek: 'dddd [om] LT',
                lastDay: '[Gister om] LT',
                lastWeek: '[Laas] dddd [om] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'oor %s',
                past: '%s gelede',
                s: '\'n paar sekondes',
                m: '\'n minuut',
                mm: '%d minute',
                h: '\'n uur',
                hh: '%d ure',
                d: '\'n dag',
                dd: '%d dae',
                M: '\'n maand',
                MM: '%d maande',
                y: '\'n jaar',
                yy: '%d jaar'
            },
            ordinalParse: /\d{1,2}(ste|de)/,
            ordinal: function (number) {
                return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de'); // Thanks to Joris Röling : https://github.com/jjupiter
            },
            week: {
                dow: 1, // Maandag is die eerste dag van die week.
                doy: 4  // Die week wat die 4de Januarie bevat is die eerste week van die jaar.
            }
        });
    }));
    // moment.js locale configuration
    // locale : Moroccan Arabic (ar-ma)
    // author : ElFadili Yassine : https://github.com/ElFadiliY
    // author : Abdel Said : https://github.com/abdelsaid

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('ar-ma', {
            months: 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
            monthsShort: 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
            weekdays: 'الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
            weekdaysShort: 'احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت'.split('_'),
            weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd D MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[اليوم على الساعة] LT',
                nextDay: '[غدا على الساعة] LT',
                nextWeek: 'dddd [على الساعة] LT',
                lastDay: '[أمس على الساعة] LT',
                lastWeek: 'dddd [على الساعة] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'في %s',
                past: 'منذ %s',
                s: 'ثوان',
                m: 'دقيقة',
                mm: '%d دقائق',
                h: 'ساعة',
                hh: '%d ساعات',
                d: 'يوم',
                dd: '%d أيام',
                M: 'شهر',
                MM: '%d أشهر',
                y: 'سنة',
                yy: '%d سنوات'
            },
            week: {
                dow: 6, // Saturday is the first day of the week.
                doy: 12  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : Arabic Saudi Arabia (ar-sa)
    // author : Suhail Alkowaileet : https://github.com/xsoh

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var symbolMap = {
            '1': '١',
            '2': '٢',
            '3': '٣',
            '4': '٤',
            '5': '٥',
            '6': '٦',
            '7': '٧',
            '8': '٨',
            '9': '٩',
            '0': '٠'
        }, numberMap = {
            '١': '1',
            '٢': '2',
            '٣': '3',
            '٤': '4',
            '٥': '5',
            '٦': '6',
            '٧': '7',
            '٨': '8',
            '٩': '9',
            '٠': '0'
        };

        return moment.defineLocale('ar-sa', {
            months: 'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
            monthsShort: 'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
            weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
            weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
            weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'HH:mm:ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd D MMMM YYYY LT'
            },
            meridiemParse: /ص|م/,
            isPM: function (input) {
                return 'م' === input;
            },
            meridiem: function (hour, minute, isLower) {
                if (hour < 12) {
                    return 'ص';
                } else {
                    return 'م';
                }
            },
            calendar: {
                sameDay: '[اليوم على الساعة] LT',
                nextDay: '[غدا على الساعة] LT',
                nextWeek: 'dddd [على الساعة] LT',
                lastDay: '[أمس على الساعة] LT',
                lastWeek: 'dddd [على الساعة] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'في %s',
                past: 'منذ %s',
                s: 'ثوان',
                m: 'دقيقة',
                mm: '%d دقائق',
                h: 'ساعة',
                hh: '%d ساعات',
                d: 'يوم',
                dd: '%d أيام',
                M: 'شهر',
                MM: '%d أشهر',
                y: 'سنة',
                yy: '%d سنوات'
            },
            preparse: function (string) {
                return string.replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (match) {
                    return numberMap[match];
                }).replace(/،/g, ',');
            },
            postformat: function (string) {
                return string.replace(/\d/g, function (match) {
                    return symbolMap[match];
                }).replace(/,/g, '،');
            },
            week: {
                dow: 6, // Saturday is the first day of the week.
                doy: 12  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale  : Tunisian Arabic (ar-tn)

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('ar-tn', {
            months: 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
            monthsShort: 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
            weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
            weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
            weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd D MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[اليوم على الساعة] LT',
                nextDay: '[غدا على الساعة] LT',
                nextWeek: 'dddd [على الساعة] LT',
                lastDay: '[أمس على الساعة] LT',
                lastWeek: 'dddd [على الساعة] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'في %s',
                past: 'منذ %s',
                s: 'ثوان',
                m: 'دقيقة',
                mm: '%d دقائق',
                h: 'ساعة',
                hh: '%d ساعات',
                d: 'يوم',
                dd: '%d أيام',
                M: 'شهر',
                MM: '%d أشهر',
                y: 'سنة',
                yy: '%d سنوات'
            },
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4 // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // Locale: Arabic (ar)
    // Author: Abdel Said: https://github.com/abdelsaid
    // Changes in months, weekdays: Ahmed Elkhatib
    // Native plural forms: forabi https://github.com/forabi

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var symbolMap = {
            '1': '١',
            '2': '٢',
            '3': '٣',
            '4': '٤',
            '5': '٥',
            '6': '٦',
            '7': '٧',
            '8': '٨',
            '9': '٩',
            '0': '٠'
        }, numberMap = {
            '١': '1',
            '٢': '2',
            '٣': '3',
            '٤': '4',
            '٥': '5',
            '٦': '6',
            '٧': '7',
            '٨': '8',
            '٩': '9',
            '٠': '0'
        }, pluralForm = function (n) {
            return n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5;
        }, plurals = {
            s: ['أقل من ثانية', 'ثانية واحدة', ['ثانيتان', 'ثانيتين'], '%d ثوان', '%d ثانية', '%d ثانية'],
            m: ['أقل من دقيقة', 'دقيقة واحدة', ['دقيقتان', 'دقيقتين'], '%d دقائق', '%d دقيقة', '%d دقيقة'],
            h: ['أقل من ساعة', 'ساعة واحدة', ['ساعتان', 'ساعتين'], '%d ساعات', '%d ساعة', '%d ساعة'],
            d: ['أقل من يوم', 'يوم واحد', ['يومان', 'يومين'], '%d أيام', '%d يومًا', '%d يوم'],
            M: ['أقل من شهر', 'شهر واحد', ['شهران', 'شهرين'], '%d أشهر', '%d شهرا', '%d شهر'],
            y: ['أقل من عام', 'عام واحد', ['عامان', 'عامين'], '%d أعوام', '%d عامًا', '%d عام']
        }, pluralize = function (u) {
            return function (number, withoutSuffix, string, isFuture) {
                var f = pluralForm(number),
                    str = plurals[u][pluralForm(number)];
                if (f === 2) {
                    str = str[withoutSuffix ? 0 : 1];
                }
                return str.replace(/%d/i, number);
            };
        }, months = [
            'كانون الثاني يناير',
            'شباط فبراير',
            'آذار مارس',
            'نيسان أبريل',
            'أيار مايو',
            'حزيران يونيو',
            'تموز يوليو',
            'آب أغسطس',
            'أيلول سبتمبر',
            'تشرين الأول أكتوبر',
            'تشرين الثاني نوفمبر',
            'كانون الأول ديسمبر'
        ];

        return moment.defineLocale('ar', {
            months: months,
            monthsShort: months,
            weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
            weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
            weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'HH:mm:ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd D MMMM YYYY LT'
            },
            meridiemParse: /ص|م/,
            isPM: function (input) {
                return 'م' === input;
            },
            meridiem: function (hour, minute, isLower) {
                if (hour < 12) {
                    return 'ص';
                } else {
                    return 'م';
                }
            },
            calendar: {
                sameDay: '[اليوم عند الساعة] LT',
                nextDay: '[غدًا عند الساعة] LT',
                nextWeek: 'dddd [عند الساعة] LT',
                lastDay: '[أمس عند الساعة] LT',
                lastWeek: 'dddd [عند الساعة] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'بعد %s',
                past: 'منذ %s',
                s: pluralize('s'),
                m: pluralize('m'),
                mm: pluralize('m'),
                h: pluralize('h'),
                hh: pluralize('h'),
                d: pluralize('d'),
                dd: pluralize('d'),
                M: pluralize('M'),
                MM: pluralize('M'),
                y: pluralize('y'),
                yy: pluralize('y')
            },
            preparse: function (string) {
                return string.replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (match) {
                    return numberMap[match];
                }).replace(/،/g, ',');
            },
            postformat: function (string) {
                return string.replace(/\d/g, function (match) {
                    return symbolMap[match];
                }).replace(/,/g, '،');
            },
            week: {
                dow: 6, // Saturday is the first day of the week.
                doy: 12  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : azerbaijani (az)
    // author : topchiyev : https://github.com/topchiyev

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var suffixes = {
            1: '-inci',
            5: '-inci',
            8: '-inci',
            70: '-inci',
            80: '-inci',

            2: '-nci',
            7: '-nci',
            20: '-nci',
            50: '-nci',

            3: '-üncü',
            4: '-üncü',
            100: '-üncü',

            6: '-ncı',

            9: '-uncu',
            10: '-uncu',
            30: '-uncu',

            60: '-ıncı',
            90: '-ıncı'
        };
        return moment.defineLocale('az', {
            months: 'yanvar_fevral_mart_aprel_may_iyun_iyul_avqust_sentyabr_oktyabr_noyabr_dekabr'.split('_'),
            monthsShort: 'yan_fev_mar_apr_may_iyn_iyl_avq_sen_okt_noy_dek'.split('_'),
            weekdays: 'Bazar_Bazar ertəsi_Çərşənbə axşamı_Çərşənbə_Cümə axşamı_Cümə_Şənbə'.split('_'),
            weekdaysShort: 'Baz_BzE_ÇAx_Çər_CAx_Cüm_Şən'.split('_'),
            weekdaysMin: 'Bz_BE_ÇA_Çə_CA_Cü_Şə'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD.MM.YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd, D MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[bugün saat] LT',
                nextDay: '[sabah saat] LT',
                nextWeek: '[gələn həftə] dddd [saat] LT',
                lastDay: '[dünən] LT',
                lastWeek: '[keçən həftə] dddd [saat] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: '%s sonra',
                past: '%s əvvəl',
                s: 'birneçə saniyyə',
                m: 'bir dəqiqə',
                mm: '%d dəqiqə',
                h: 'bir saat',
                hh: '%d saat',
                d: 'bir gün',
                dd: '%d gün',
                M: 'bir ay',
                MM: '%d ay',
                y: 'bir il',
                yy: '%d il'
            },
            meridiemParse: /gecə|səhər|gündüz|axşam/,
            isPM: function (input) {
                return /^(gündüz|axşam)$/.test(input);
            },
            meridiem: function (hour, minute, isLower) {
                if (hour < 4) {
                    return 'gecə';
                } else if (hour < 12) {
                    return 'səhər';
                } else if (hour < 17) {
                    return 'gündüz';
                } else {
                    return 'axşam';
                }
            },
            ordinalParse: /\d{1,2}-(ıncı|inci|nci|üncü|ncı|uncu)/,
            ordinal: function (number) {
                if (number === 0) {  // special case for zero
                    return number + '-ıncı';
                }
                var a = number % 10,
                    b = number % 100 - a,
                    c = number >= 100 ? 100 : null;

                return number + (suffixes[a] || suffixes[b] || suffixes[c]);
            },
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : belarusian (be)
    // author : Dmitry Demidov : https://github.com/demidov91
    // author: Praleska: http://praleska.pro/
    // Author : Menelion Elensúle : https://github.com/Oire

    (function (factory) {
        factory(moment);
    }(function (moment) {
        function plural(word, num) {
            var forms = word.split('_');
            return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
        }

        function relativeTimeWithPlural(number, withoutSuffix, key) {
            var format = {
                'mm': withoutSuffix ? 'хвіліна_хвіліны_хвілін' : 'хвіліну_хвіліны_хвілін',
                'hh': withoutSuffix ? 'гадзіна_гадзіны_гадзін' : 'гадзіну_гадзіны_гадзін',
                'dd': 'дзень_дні_дзён',
                'MM': 'месяц_месяцы_месяцаў',
                'yy': 'год_гады_гадоў'
            };
            if (key === 'm') {
                return withoutSuffix ? 'хвіліна' : 'хвіліну';
            }
            else if (key === 'h') {
                return withoutSuffix ? 'гадзіна' : 'гадзіну';
            }
            else {
                return number + ' ' + plural(format[key], +number);
            }
        }

        function monthsCaseReplace(m, format) {
            var months = {
                'nominative': 'студзень_люты_сакавік_красавік_травень_чэрвень_ліпень_жнівень_верасень_кастрычнік_лістапад_снежань'.split('_'),
                'accusative': 'студзеня_лютага_сакавіка_красавіка_траўня_чэрвеня_ліпеня_жніўня_верасня_кастрычніка_лістапада_снежня'.split('_')
            },

                nounCase = (/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/).test(format) ?
                    'accusative' :
                    'nominative';

            return months[nounCase][m.month()];
        }

        function weekdaysCaseReplace(m, format) {
            var weekdays = {
                'nominative': 'нядзеля_панядзелак_аўторак_серада_чацвер_пятніца_субота'.split('_'),
                'accusative': 'нядзелю_панядзелак_аўторак_сераду_чацвер_пятніцу_суботу'.split('_')
            },

                nounCase = (/\[ ?[Вв] ?(?:мінулую|наступную)? ?\] ?dddd/).test(format) ?
                    'accusative' :
                    'nominative';

            return weekdays[nounCase][m.day()];
        }

        return moment.defineLocale('be', {
            months: monthsCaseReplace,
            monthsShort: 'студ_лют_сак_крас_трав_чэрв_ліп_жнів_вер_каст_ліст_снеж'.split('_'),
            weekdays: weekdaysCaseReplace,
            weekdaysShort: 'нд_пн_ат_ср_чц_пт_сб'.split('_'),
            weekdaysMin: 'нд_пн_ат_ср_чц_пт_сб'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD.MM.YYYY',
                LL: 'D MMMM YYYY г.',
                LLL: 'D MMMM YYYY г., LT',
                LLLL: 'dddd, D MMMM YYYY г., LT'
            },
            calendar: {
                sameDay: '[Сёння ў] LT',
                nextDay: '[Заўтра ў] LT',
                lastDay: '[Учора ў] LT',
                nextWeek: function () {
                    return '[У] dddd [ў] LT';
                },
                lastWeek: function () {
                    switch (this.day()) {
                        case 0:
                        case 3:
                        case 5:
                        case 6:
                            return '[У мінулую] dddd [ў] LT';
                        case 1:
                        case 2:
                        case 4:
                            return '[У мінулы] dddd [ў] LT';
                    }
                },
                sameElse: 'L'
            },
            relativeTime: {
                future: 'праз %s',
                past: '%s таму',
                s: 'некалькі секунд',
                m: relativeTimeWithPlural,
                mm: relativeTimeWithPlural,
                h: relativeTimeWithPlural,
                hh: relativeTimeWithPlural,
                d: 'дзень',
                dd: relativeTimeWithPlural,
                M: 'месяц',
                MM: relativeTimeWithPlural,
                y: 'год',
                yy: relativeTimeWithPlural
            },
            meridiemParse: /ночы|раніцы|дня|вечара/,
            isPM: function (input) {
                return /^(дня|вечара)$/.test(input);
            },
            meridiem: function (hour, minute, isLower) {
                if (hour < 4) {
                    return 'ночы';
                } else if (hour < 12) {
                    return 'раніцы';
                } else if (hour < 17) {
                    return 'дня';
                } else {
                    return 'вечара';
                }
            },

            ordinalParse: /\d{1,2}-(і|ы|га)/,
            ordinal: function (number, period) {
                switch (period) {
                    case 'M':
                    case 'd':
                    case 'DDD':
                    case 'w':
                    case 'W':
                        return (number % 10 === 2 || number % 10 === 3) && (number % 100 !== 12 && number % 100 !== 13) ? number + '-і' : number + '-ы';
                    case 'D':
                        return number + '-га';
                    default:
                        return number;
                }
            },

            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : bulgarian (bg)
    // author : Krasen Borisov : https://github.com/kraz

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('bg', {
            months: 'януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември'.split('_'),
            monthsShort: 'янр_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек'.split('_'),
            weekdays: 'неделя_понеделник_вторник_сряда_четвъртък_петък_събота'.split('_'),
            weekdaysShort: 'нед_пон_вто_сря_чет_пет_съб'.split('_'),
            weekdaysMin: 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
            longDateFormat: {
                LT: 'H:mm',
                LTS: 'LT:ss',
                L: 'D.MM.YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd, D MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[Днес в] LT',
                nextDay: '[Утре в] LT',
                nextWeek: 'dddd [в] LT',
                lastDay: '[Вчера в] LT',
                lastWeek: function () {
                    switch (this.day()) {
                        case 0:
                        case 3:
                        case 6:
                            return '[В изминалата] dddd [в] LT';
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return '[В изминалия] dddd [в] LT';
                    }
                },
                sameElse: 'L'
            },
            relativeTime: {
                future: 'след %s',
                past: 'преди %s',
                s: 'няколко секунди',
                m: 'минута',
                mm: '%d минути',
                h: 'час',
                hh: '%d часа',
                d: 'ден',
                dd: '%d дни',
                M: 'месец',
                MM: '%d месеца',
                y: 'година',
                yy: '%d години'
            },
            ordinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
            ordinal: function (number) {
                var lastDigit = number % 10,
                    last2Digits = number % 100;
                if (number === 0) {
                    return number + '-ев';
                } else if (last2Digits === 0) {
                    return number + '-ен';
                } else if (last2Digits > 10 && last2Digits < 20) {
                    return number + '-ти';
                } else if (lastDigit === 1) {
                    return number + '-ви';
                } else if (lastDigit === 2) {
                    return number + '-ри';
                } else if (lastDigit === 7 || lastDigit === 8) {
                    return number + '-ми';
                } else {
                    return number + '-ти';
                }
            },
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : Bengali (bn)
    // author : Kaushik Gandhi : https://github.com/kaushikgandhi

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var symbolMap = {
            '1': '১',
            '2': '২',
            '3': '৩',
            '4': '৪',
            '5': '৫',
            '6': '৬',
            '7': '৭',
            '8': '৮',
            '9': '৯',
            '0': '০'
        },
            numberMap = {
                '১': '1',
                '২': '2',
                '৩': '3',
                '৪': '4',
                '৫': '5',
                '৬': '6',
                '৭': '7',
                '৮': '8',
                '৯': '9',
                '০': '0'
            };

        return moment.defineLocale('bn', {
            months: 'জানুয়ারী_ফেবুয়ারী_মার্চ_এপ্রিল_মে_জুন_জুলাই_অগাস্ট_সেপ্টেম্বর_অক্টোবর_নভেম্বর_ডিসেম্বর'.split('_'),
            monthsShort: 'জানু_ফেব_মার্চ_এপর_মে_জুন_জুল_অগ_সেপ্ট_অক্টো_নভ_ডিসেম্'.split('_'),
            weekdays: 'রবিবার_সোমবার_মঙ্গলবার_বুধবার_বৃহস্পত্তিবার_শুক্রুবার_শনিবার'.split('_'),
            weekdaysShort: 'রবি_সোম_মঙ্গল_বুধ_বৃহস্পত্তি_শুক্রু_শনি'.split('_'),
            weekdaysMin: 'রব_সম_মঙ্গ_বু_ব্রিহ_শু_শনি'.split('_'),
            longDateFormat: {
                LT: 'A h:mm সময়',
                LTS: 'A h:mm:ss সময়',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY, LT',
                LLLL: 'dddd, D MMMM YYYY, LT'
            },
            calendar: {
                sameDay: '[আজ] LT',
                nextDay: '[আগামীকাল] LT',
                nextWeek: 'dddd, LT',
                lastDay: '[গতকাল] LT',
                lastWeek: '[গত] dddd, LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: '%s পরে',
                past: '%s আগে',
                s: 'কএক সেকেন্ড',
                m: 'এক মিনিট',
                mm: '%d মিনিট',
                h: 'এক ঘন্টা',
                hh: '%d ঘন্টা',
                d: 'এক দিন',
                dd: '%d দিন',
                M: 'এক মাস',
                MM: '%d মাস',
                y: 'এক বছর',
                yy: '%d বছর'
            },
            preparse: function (string) {
                return string.replace(/[১২৩৪৫৬৭৮৯০]/g, function (match) {
                    return numberMap[match];
                });
            },
            postformat: function (string) {
                return string.replace(/\d/g, function (match) {
                    return symbolMap[match];
                });
            },
            meridiemParse: /রাত|শকাল|দুপুর|বিকেল|রাত/,
            isPM: function (input) {
                return /^(দুপুর|বিকেল|রাত)$/.test(input);
            },
            //Bengali is a vast language its spoken
            //in different forms in various parts of the world.
            //I have just generalized with most common one used
            meridiem: function (hour, minute, isLower) {
                if (hour < 4) {
                    return 'রাত';
                } else if (hour < 10) {
                    return 'শকাল';
                } else if (hour < 17) {
                    return 'দুপুর';
                } else if (hour < 20) {
                    return 'বিকেল';
                } else {
                    return 'রাত';
                }
            },
            week: {
                dow: 0, // Sunday is the first day of the week.
                doy: 6  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : tibetan (bo)
    // author : Thupten N. Chakrishar : https://github.com/vajradog

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var symbolMap = {
            '1': '༡',
            '2': '༢',
            '3': '༣',
            '4': '༤',
            '5': '༥',
            '6': '༦',
            '7': '༧',
            '8': '༨',
            '9': '༩',
            '0': '༠'
        },
            numberMap = {
                '༡': '1',
                '༢': '2',
                '༣': '3',
                '༤': '4',
                '༥': '5',
                '༦': '6',
                '༧': '7',
                '༨': '8',
                '༩': '9',
                '༠': '0'
            };

        return moment.defineLocale('bo', {
            months: 'ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ'.split('_'),
            monthsShort: 'ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ'.split('_'),
            weekdays: 'གཟའ་ཉི་མ་_གཟའ་ཟླ་བ་_གཟའ་མིག་དམར་_གཟའ་ལྷག་པ་_གཟའ་ཕུར་བུ_གཟའ་པ་སངས་_གཟའ་སྤེན་པ་'.split('_'),
            weekdaysShort: 'ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་'.split('_'),
            weekdaysMin: 'ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་'.split('_'),
            longDateFormat: {
                LT: 'A h:mm',
                LTS: 'LT:ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY, LT',
                LLLL: 'dddd, D MMMM YYYY, LT'
            },
            calendar: {
                sameDay: '[དི་རིང] LT',
                nextDay: '[སང་ཉིན] LT',
                nextWeek: '[བདུན་ཕྲག་རྗེས་མ], LT',
                lastDay: '[ཁ་སང] LT',
                lastWeek: '[བདུན་ཕྲག་མཐའ་མ] dddd, LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: '%s ལ་',
                past: '%s སྔན་ལ',
                s: 'ལམ་སང',
                m: 'སྐར་མ་གཅིག',
                mm: '%d སྐར་མ',
                h: 'ཆུ་ཚོད་གཅིག',
                hh: '%d ཆུ་ཚོད',
                d: 'ཉིན་གཅིག',
                dd: '%d ཉིན་',
                M: 'ཟླ་བ་གཅིག',
                MM: '%d ཟླ་བ',
                y: 'ལོ་གཅིག',
                yy: '%d ལོ'
            },
            preparse: function (string) {
                return string.replace(/[༡༢༣༤༥༦༧༨༩༠]/g, function (match) {
                    return numberMap[match];
                });
            },
            postformat: function (string) {
                return string.replace(/\d/g, function (match) {
                    return symbolMap[match];
                });
            },
            meridiemParse: /མཚན་མོ|ཞོགས་ཀས|ཉིན་གུང|དགོང་དག|མཚན་མོ/,
            isPM: function (input) {
                return /^(ཉིན་གུང|དགོང་དག|མཚན་མོ)$/.test(input);
            },
            meridiem: function (hour, minute, isLower) {
                if (hour < 4) {
                    return 'མཚན་མོ';
                } else if (hour < 10) {
                    return 'ཞོགས་ཀས';
                } else if (hour < 17) {
                    return 'ཉིན་གུང';
                } else if (hour < 20) {
                    return 'དགོང་དག';
                } else {
                    return 'མཚན་མོ';
                }
            },
            week: {
                dow: 0, // Sunday is the first day of the week.
                doy: 6  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : breton (br)
    // author : Jean-Baptiste Le Duigou : https://github.com/jbleduigou

    (function (factory) {
        factory(moment);
    }(function (moment) {
        function relativeTimeWithMutation(number, withoutSuffix, key) {
            var format = {
                'mm': 'munutenn',
                'MM': 'miz',
                'dd': 'devezh'
            };
            return number + ' ' + mutation(format[key], number);
        }

        function specialMutationForYears(number) {
            switch (lastNumber(number)) {
                case 1:
                case 3:
                case 4:
                case 5:
                case 9:
                    return number + ' bloaz';
                default:
                    return number + ' vloaz';
            }
        }

        function lastNumber(number) {
            if (number > 9) {
                return lastNumber(number % 10);
            }
            return number;
        }

        function mutation(text, number) {
            if (number === 2) {
                return softMutation(text);
            }
            return text;
        }

        function softMutation(text) {
            var mutationTable = {
                'm': 'v',
                'b': 'v',
                'd': 'z'
            };
            if (mutationTable[text.charAt(0)] === undefined) {
                return text;
            }
            return mutationTable[text.charAt(0)] + text.substring(1);
        }

        return moment.defineLocale('br', {
            months: 'Genver_C\'hwevrer_Meurzh_Ebrel_Mae_Mezheven_Gouere_Eost_Gwengolo_Here_Du_Kerzu'.split('_'),
            monthsShort: 'Gen_C\'hwe_Meu_Ebr_Mae_Eve_Gou_Eos_Gwe_Her_Du_Ker'.split('_'),
            weekdays: 'Sul_Lun_Meurzh_Merc\'her_Yaou_Gwener_Sadorn'.split('_'),
            weekdaysShort: 'Sul_Lun_Meu_Mer_Yao_Gwe_Sad'.split('_'),
            weekdaysMin: 'Su_Lu_Me_Mer_Ya_Gw_Sa'.split('_'),
            longDateFormat: {
                LT: 'h[e]mm A',
                LTS: 'h[e]mm:ss A',
                L: 'DD/MM/YYYY',
                LL: 'D [a viz] MMMM YYYY',
                LLL: 'D [a viz] MMMM YYYY LT',
                LLLL: 'dddd, D [a viz] MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[Hiziv da] LT',
                nextDay: '[Warc\'hoazh da] LT',
                nextWeek: 'dddd [da] LT',
                lastDay: '[Dec\'h da] LT',
                lastWeek: 'dddd [paset da] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'a-benn %s',
                past: '%s \'zo',
                s: 'un nebeud segondennoù',
                m: 'ur vunutenn',
                mm: relativeTimeWithMutation,
                h: 'un eur',
                hh: '%d eur',
                d: 'un devezh',
                dd: relativeTimeWithMutation,
                M: 'ur miz',
                MM: relativeTimeWithMutation,
                y: 'ur bloaz',
                yy: specialMutationForYears
            },
            ordinalParse: /\d{1,2}(añ|vet)/,
            ordinal: function (number) {
                var output = (number === 1) ? 'añ' : 'vet';
                return number + output;
            },
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : bosnian (bs)
    // author : Nedim Cholich : https://github.com/frontyard
    // based on (hr) translation by Bojan Marković

    (function (factory) {
        factory(moment);
    }(function (moment) {
        function translate(number, withoutSuffix, key) {
            var result = number + ' ';
            switch (key) {
                case 'm':
                    return withoutSuffix ? 'jedna minuta' : 'jedne minute';
                case 'mm':
                    if (number === 1) {
                        result += 'minuta';
                    } else if (number === 2 || number === 3 || number === 4) {
                        result += 'minute';
                    } else {
                        result += 'minuta';
                    }
                    return result;
                case 'h':
                    return withoutSuffix ? 'jedan sat' : 'jednog sata';
                case 'hh':
                    if (number === 1) {
                        result += 'sat';
                    } else if (number === 2 || number === 3 || number === 4) {
                        result += 'sata';
                    } else {
                        result += 'sati';
                    }
                    return result;
                case 'dd':
                    if (number === 1) {
                        result += 'dan';
                    } else {
                        result += 'dana';
                    }
                    return result;
                case 'MM':
                    if (number === 1) {
                        result += 'mjesec';
                    } else if (number === 2 || number === 3 || number === 4) {
                        result += 'mjeseca';
                    } else {
                        result += 'mjeseci';
                    }
                    return result;
                case 'yy':
                    if (number === 1) {
                        result += 'godina';
                    } else if (number === 2 || number === 3 || number === 4) {
                        result += 'godine';
                    } else {
                        result += 'godina';
                    }
                    return result;
            }
        }

        return moment.defineLocale('bs', {
            months: 'januar_februar_mart_april_maj_juni_juli_august_septembar_oktobar_novembar_decembar'.split('_'),
            monthsShort: 'jan._feb._mar._apr._maj._jun._jul._aug._sep._okt._nov._dec.'.split('_'),
            weekdays: 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
            weekdaysShort: 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
            weekdaysMin: 'ne_po_ut_sr_če_pe_su'.split('_'),
            longDateFormat: {
                LT: 'H:mm',
                LTS: 'LT:ss',
                L: 'DD. MM. YYYY',
                LL: 'D. MMMM YYYY',
                LLL: 'D. MMMM YYYY LT',
                LLLL: 'dddd, D. MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[danas u] LT',
                nextDay: '[sutra u] LT',

                nextWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return '[u] [nedjelju] [u] LT';
                        case 3:
                            return '[u] [srijedu] [u] LT';
                        case 6:
                            return '[u] [subotu] [u] LT';
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return '[u] dddd [u] LT';
                    }
                },
                lastDay: '[jučer u] LT',
                lastWeek: function () {
                    switch (this.day()) {
                        case 0:
                        case 3:
                            return '[prošlu] dddd [u] LT';
                        case 6:
                            return '[prošle] [subote] [u] LT';
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return '[prošli] dddd [u] LT';
                    }
                },
                sameElse: 'L'
            },
            relativeTime: {
                future: 'za %s',
                past: 'prije %s',
                s: 'par sekundi',
                m: translate,
                mm: translate,
                h: translate,
                hh: translate,
                d: 'dan',
                dd: translate,
                M: 'mjesec',
                MM: translate,
                y: 'godinu',
                yy: translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: '%d.',
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : catalan (ca)
    // author : Juan G. Hurtado : https://github.com/juanghurtado

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('ca', {
            months: 'gener_febrer_març_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre'.split('_'),
            monthsShort: 'gen._febr._mar._abr._mai._jun._jul._ag._set._oct._nov._des.'.split('_'),
            weekdays: 'diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte'.split('_'),
            weekdaysShort: 'dg._dl._dt._dc._dj._dv._ds.'.split('_'),
            weekdaysMin: 'Dg_Dl_Dt_Dc_Dj_Dv_Ds'.split('_'),
            longDateFormat: {
                LT: 'H:mm',
                LTS: 'LT:ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd D MMMM YYYY LT'
            },
            calendar: {
                sameDay: function () {
                    return '[avui a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
                },
                nextDay: function () {
                    return '[demà a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
                },
                nextWeek: function () {
                    return 'dddd [a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
                },
                lastDay: function () {
                    return '[ahir a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
                },
                lastWeek: function () {
                    return '[el] dddd [passat a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
                },
                sameElse: 'L'
            },
            relativeTime: {
                future: 'en %s',
                past: 'fa %s',
                s: 'uns segons',
                m: 'un minut',
                mm: '%d minuts',
                h: 'una hora',
                hh: '%d hores',
                d: 'un dia',
                dd: '%d dies',
                M: 'un mes',
                MM: '%d mesos',
                y: 'un any',
                yy: '%d anys'
            },
            ordinalParse: /\d{1,2}(r|n|t|è|a)/,
            ordinal: function (number, period) {
                var output = (number === 1) ? 'r' :
                    (number === 2) ? 'n' :
                        (number === 3) ? 'r' :
                            (number === 4) ? 't' : 'è';
                if (period === 'w' || period === 'W') {
                    output = 'a';
                }
                return number + output;
            },
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : czech (cs)
    // author : petrbela : https://github.com/petrbela

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var months = 'leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec'.split('_'),
            monthsShort = 'led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro'.split('_');

        function plural(n) {
            return (n > 1) && (n < 5) && (~~(n / 10) !== 1);
        }

        function translate(number, withoutSuffix, key, isFuture) {
            var result = number + ' ';
            switch (key) {
                case 's':  // a few seconds / in a few seconds / a few seconds ago
                    return (withoutSuffix || isFuture) ? 'pár sekund' : 'pár sekundami';
                case 'm':  // a minute / in a minute / a minute ago
                    return withoutSuffix ? 'minuta' : (isFuture ? 'minutu' : 'minutou');
                case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
                    if (withoutSuffix || isFuture) {
                        return result + (plural(number) ? 'minuty' : 'minut');
                    } else {
                        return result + 'minutami';
                    }
                    break;
                case 'h':  // an hour / in an hour / an hour ago
                    return withoutSuffix ? 'hodina' : (isFuture ? 'hodinu' : 'hodinou');
                case 'hh': // 9 hours / in 9 hours / 9 hours ago
                    if (withoutSuffix || isFuture) {
                        return result + (plural(number) ? 'hodiny' : 'hodin');
                    } else {
                        return result + 'hodinami';
                    }
                    break;
                case 'd':  // a day / in a day / a day ago
                    return (withoutSuffix || isFuture) ? 'den' : 'dnem';
                case 'dd': // 9 days / in 9 days / 9 days ago
                    if (withoutSuffix || isFuture) {
                        return result + (plural(number) ? 'dny' : 'dní');
                    } else {
                        return result + 'dny';
                    }
                    break;
                case 'M':  // a month / in a month / a month ago
                    return (withoutSuffix || isFuture) ? 'měsíc' : 'měsícem';
                case 'MM': // 9 months / in 9 months / 9 months ago
                    if (withoutSuffix || isFuture) {
                        return result + (plural(number) ? 'měsíce' : 'měsíců');
                    } else {
                        return result + 'měsíci';
                    }
                    break;
                case 'y':  // a year / in a year / a year ago
                    return (withoutSuffix || isFuture) ? 'rok' : 'rokem';
                case 'yy': // 9 years / in 9 years / 9 years ago
                    if (withoutSuffix || isFuture) {
                        return result + (plural(number) ? 'roky' : 'let');
                    } else {
                        return result + 'lety';
                    }
                    break;
            }
        }

        return moment.defineLocale('cs', {
            months: months,
            monthsShort: monthsShort,
            monthsParse: (function (months, monthsShort) {
                var i, _monthsParse = [];
                for (i = 0; i < 12; i++) {
                    // use custom parser to solve problem with July (červenec)
                    _monthsParse[i] = new RegExp('^' + months[i] + '$|^' + monthsShort[i] + '$', 'i');
                }
                return _monthsParse;
            }(months, monthsShort)),
            weekdays: 'neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota'.split('_'),
            weekdaysShort: 'ne_po_út_st_čt_pá_so'.split('_'),
            weekdaysMin: 'ne_po_út_st_čt_pá_so'.split('_'),
            longDateFormat: {
                LT: 'H:mm',
                LTS: 'LT:ss',
                L: 'DD.MM.YYYY',
                LL: 'D. MMMM YYYY',
                LLL: 'D. MMMM YYYY LT',
                LLLL: 'dddd D. MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[dnes v] LT',
                nextDay: '[zítra v] LT',
                nextWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return '[v neděli v] LT';
                        case 1:
                        case 2:
                            return '[v] dddd [v] LT';
                        case 3:
                            return '[ve středu v] LT';
                        case 4:
                            return '[ve čtvrtek v] LT';
                        case 5:
                            return '[v pátek v] LT';
                        case 6:
                            return '[v sobotu v] LT';
                    }
                },
                lastDay: '[včera v] LT',
                lastWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return '[minulou neděli v] LT';
                        case 1:
                        case 2:
                            return '[minulé] dddd [v] LT';
                        case 3:
                            return '[minulou středu v] LT';
                        case 4:
                        case 5:
                            return '[minulý] dddd [v] LT';
                        case 6:
                            return '[minulou sobotu v] LT';
                    }
                },
                sameElse: 'L'
            },
            relativeTime: {
                future: 'za %s',
                past: 'před %s',
                s: translate,
                m: translate,
                mm: translate,
                h: translate,
                hh: translate,
                d: translate,
                dd: translate,
                M: translate,
                MM: translate,
                y: translate,
                yy: translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: '%d.',
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : chuvash (cv)
    // author : Anatoly Mironov : https://github.com/mirontoli

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('cv', {
            months: 'кăрлач_нарăс_пуш_ака_май_çĕртме_утă_çурла_авăн_юпа_чӳк_раштав'.split('_'),
            monthsShort: 'кăр_нар_пуш_ака_май_çĕр_утă_çур_ав_юпа_чӳк_раш'.split('_'),
            weekdays: 'вырсарникун_тунтикун_ытларикун_юнкун_кĕçнерникун_эрнекун_шăматкун'.split('_'),
            weekdaysShort: 'выр_тун_ытл_юн_кĕç_эрн_шăм'.split('_'),
            weekdaysMin: 'вр_тн_ыт_юн_кç_эр_шм'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD-MM-YYYY',
                LL: 'YYYY [çулхи] MMMM [уйăхĕн] D[-мĕшĕ]',
                LLL: 'YYYY [çулхи] MMMM [уйăхĕн] D[-мĕшĕ], LT',
                LLLL: 'dddd, YYYY [çулхи] MMMM [уйăхĕн] D[-мĕшĕ], LT'
            },
            calendar: {
                sameDay: '[Паян] LT [сехетре]',
                nextDay: '[Ыран] LT [сехетре]',
                lastDay: '[Ĕнер] LT [сехетре]',
                nextWeek: '[Çитес] dddd LT [сехетре]',
                lastWeek: '[Иртнĕ] dddd LT [сехетре]',
                sameElse: 'L'
            },
            relativeTime: {
                future: function (output) {
                    var affix = /сехет$/i.exec(output) ? 'рен' : /çул$/i.exec(output) ? 'тан' : 'ран';
                    return output + affix;
                },
                past: '%s каялла',
                s: 'пĕр-ик çеккунт',
                m: 'пĕр минут',
                mm: '%d минут',
                h: 'пĕр сехет',
                hh: '%d сехет',
                d: 'пĕр кун',
                dd: '%d кун',
                M: 'пĕр уйăх',
                MM: '%d уйăх',
                y: 'пĕр çул',
                yy: '%d çул'
            },
            ordinalParse: /\d{1,2}-мĕш/,
            ordinal: '%d-мĕш',
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : Welsh (cy)
    // author : Robert Allen

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('cy', {
            months: 'Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr'.split('_'),
            monthsShort: 'Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag'.split('_'),
            weekdays: 'Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn'.split('_'),
            weekdaysShort: 'Sul_Llun_Maw_Mer_Iau_Gwe_Sad'.split('_'),
            weekdaysMin: 'Su_Ll_Ma_Me_Ia_Gw_Sa'.split('_'),
            // time formats are the same as en-gb
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd, D MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[Heddiw am] LT',
                nextDay: '[Yfory am] LT',
                nextWeek: 'dddd [am] LT',
                lastDay: '[Ddoe am] LT',
                lastWeek: 'dddd [diwethaf am] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'mewn %s',
                past: '%s yn ôl',
                s: 'ychydig eiliadau',
                m: 'munud',
                mm: '%d munud',
                h: 'awr',
                hh: '%d awr',
                d: 'diwrnod',
                dd: '%d diwrnod',
                M: 'mis',
                MM: '%d mis',
                y: 'blwyddyn',
                yy: '%d flynedd'
            },
            ordinalParse: /\d{1,2}(fed|ain|af|il|ydd|ed|eg)/,
            // traditional ordinal numbers above 31 are not commonly used in colloquial Welsh
            ordinal: function (number) {
                var b = number,
                    output = '',
                    lookup = [
                        '', 'af', 'il', 'ydd', 'ydd', 'ed', 'ed', 'ed', 'fed', 'fed', 'fed', // 1af to 10fed
                        'eg', 'fed', 'eg', 'eg', 'fed', 'eg', 'eg', 'fed', 'eg', 'fed' // 11eg to 20fed
                    ];

                if (b > 20) {
                    if (b === 40 || b === 50 || b === 60 || b === 80 || b === 100) {
                        output = 'fed'; // not 30ain, 70ain or 90ain
                    } else {
                        output = 'ain';
                    }
                } else if (b > 0) {
                    output = lookup[b];
                }

                return number + output;
            },
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : danish (da)
    // author : Ulrik Nielsen : https://github.com/mrbase

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('da', {
            months: 'januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december'.split('_'),
            monthsShort: 'jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec'.split('_'),
            weekdays: 'søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag'.split('_'),
            weekdaysShort: 'søn_man_tir_ons_tor_fre_lør'.split('_'),
            weekdaysMin: 'sø_ma_ti_on_to_fr_lø'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD/MM/YYYY',
                LL: 'D. MMMM YYYY',
                LLL: 'D. MMMM YYYY LT',
                LLLL: 'dddd [d.] D. MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[I dag kl.] LT',
                nextDay: '[I morgen kl.] LT',
                nextWeek: 'dddd [kl.] LT',
                lastDay: '[I går kl.] LT',
                lastWeek: '[sidste] dddd [kl] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'om %s',
                past: '%s siden',
                s: 'få sekunder',
                m: 'et minut',
                mm: '%d minutter',
                h: 'en time',
                hh: '%d timer',
                d: 'en dag',
                dd: '%d dage',
                M: 'en måned',
                MM: '%d måneder',
                y: 'et år',
                yy: '%d år'
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: '%d.',
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : austrian german (de-at)
    // author : lluchs : https://github.com/lluchs
    // author: Menelion Elensúle: https://github.com/Oire
    // author : Martin Groller : https://github.com/MadMG

    (function (factory) {
        factory(moment);
    }(function (moment) {
        function processRelativeTime(number, withoutSuffix, key, isFuture) {
            var format = {
                'm': ['eine Minute', 'einer Minute'],
                'h': ['eine Stunde', 'einer Stunde'],
                'd': ['ein Tag', 'einem Tag'],
                'dd': [number + ' Tage', number + ' Tagen'],
                'M': ['ein Monat', 'einem Monat'],
                'MM': [number + ' Monate', number + ' Monaten'],
                'y': ['ein Jahr', 'einem Jahr'],
                'yy': [number + ' Jahre', number + ' Jahren']
            };
            return withoutSuffix ? format[key][0] : format[key][1];
        }

        return moment.defineLocale('de-at', {
            months: 'Jänner_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
            monthsShort: 'Jän._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
            weekdays: 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
            weekdaysShort: 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
            weekdaysMin: 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'HH:mm:ss',
                L: 'DD.MM.YYYY',
                LL: 'D. MMMM YYYY',
                LLL: 'D. MMMM YYYY LT',
                LLLL: 'dddd, D. MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[Heute um] LT [Uhr]',
                sameElse: 'L',
                nextDay: '[Morgen um] LT [Uhr]',
                nextWeek: 'dddd [um] LT [Uhr]',
                lastDay: '[Gestern um] LT [Uhr]',
                lastWeek: '[letzten] dddd [um] LT [Uhr]'
            },
            relativeTime: {
                future: 'in %s',
                past: 'vor %s',
                s: 'ein paar Sekunden',
                m: processRelativeTime,
                mm: '%d Minuten',
                h: processRelativeTime,
                hh: '%d Stunden',
                d: processRelativeTime,
                dd: processRelativeTime,
                M: processRelativeTime,
                MM: processRelativeTime,
                y: processRelativeTime,
                yy: processRelativeTime
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: '%d.',
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : german (de)
    // author : lluchs : https://github.com/lluchs
    // author: Menelion Elensúle: https://github.com/Oire

    (function (factory) {
        factory(moment);
    }(function (moment) {
        function processRelativeTime(number, withoutSuffix, key, isFuture) {
            var format = {
                'm': ['eine Minute', 'einer Minute'],
                'h': ['eine Stunde', 'einer Stunde'],
                'd': ['ein Tag', 'einem Tag'],
                'dd': [number + ' Tage', number + ' Tagen'],
                'M': ['ein Monat', 'einem Monat'],
                'MM': [number + ' Monate', number + ' Monaten'],
                'y': ['ein Jahr', 'einem Jahr'],
                'yy': [number + ' Jahre', number + ' Jahren']
            };
            return withoutSuffix ? format[key][0] : format[key][1];
        }

        return moment.defineLocale('de', {
            months: 'Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
            monthsShort: 'Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
            weekdays: 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
            weekdaysShort: 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
            weekdaysMin: 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'HH:mm:ss',
                L: 'DD.MM.YYYY',
                LL: 'D. MMMM YYYY',
                LLL: 'D. MMMM YYYY LT',
                LLLL: 'dddd, D. MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[Heute um] LT [Uhr]',
                sameElse: 'L',
                nextDay: '[Morgen um] LT [Uhr]',
                nextWeek: 'dddd [um] LT [Uhr]',
                lastDay: '[Gestern um] LT [Uhr]',
                lastWeek: '[letzten] dddd [um] LT [Uhr]'
            },
            relativeTime: {
                future: 'in %s',
                past: 'vor %s',
                s: 'ein paar Sekunden',
                m: processRelativeTime,
                mm: '%d Minuten',
                h: processRelativeTime,
                hh: '%d Stunden',
                d: processRelativeTime,
                dd: processRelativeTime,
                M: processRelativeTime,
                MM: processRelativeTime,
                y: processRelativeTime,
                yy: processRelativeTime
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: '%d.',
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : modern greek (el)
    // author : Aggelos Karalias : https://github.com/mehiel

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('el', {
            monthsNominativeEl: 'Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος'.split('_'),
            monthsGenitiveEl: 'Ιανουαρίου_Φεβρουαρίου_Μαρτίου_Απριλίου_Μαΐου_Ιουνίου_Ιουλίου_Αυγούστου_Σεπτεμβρίου_Οκτωβρίου_Νοεμβρίου_Δεκεμβρίου'.split('_'),
            months: function (momentToFormat, format) {
                if (/D/.test(format.substring(0, format.indexOf('MMMM')))) { // if there is a day number before 'MMMM'
                    return this._monthsGenitiveEl[momentToFormat.month()];
                } else {
                    return this._monthsNominativeEl[momentToFormat.month()];
                }
            },
            monthsShort: 'Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ'.split('_'),
            weekdays: 'Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο'.split('_'),
            weekdaysShort: 'Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ'.split('_'),
            weekdaysMin: 'Κυ_Δε_Τρ_Τε_Πε_Πα_Σα'.split('_'),
            meridiem: function (hours, minutes, isLower) {
                if (hours > 11) {
                    return isLower ? 'μμ' : 'ΜΜ';
                } else {
                    return isLower ? 'πμ' : 'ΠΜ';
                }
            },
            isPM: function (input) {
                return ((input + '').toLowerCase()[0] === 'μ');
            },
            meridiemParse: /[ΠΜ]\.?Μ?\.?/i,
            longDateFormat: {
                LT: 'h:mm A',
                LTS: 'h:mm:ss A',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd, D MMMM YYYY LT'
            },
            calendarEl: {
                sameDay: '[Σήμερα {}] LT',
                nextDay: '[Αύριο {}] LT',
                nextWeek: 'dddd [{}] LT',
                lastDay: '[Χθες {}] LT',
                lastWeek: function () {
                    switch (this.day()) {
                        case 6:
                            return '[το προηγούμενο] dddd [{}] LT';
                        default:
                            return '[την προηγούμενη] dddd [{}] LT';
                    }
                },
                sameElse: 'L'
            },
            calendar: function (key, mom) {
                var output = this._calendarEl[key],
                    hours = mom && mom.hours();

                if (typeof output === 'function') {
                    output = output.apply(mom);
                }

                return output.replace('{}', (hours % 12 === 1 ? 'στη' : 'στις'));
            },
            relativeTime: {
                future: 'σε %s',
                past: '%s πριν',
                s: 'λίγα δευτερόλεπτα',
                m: 'ένα λεπτό',
                mm: '%d λεπτά',
                h: 'μία ώρα',
                hh: '%d ώρες',
                d: 'μία μέρα',
                dd: '%d μέρες',
                M: 'ένας μήνας',
                MM: '%d μήνες',
                y: 'ένας χρόνος',
                yy: '%d χρόνια'
            },
            ordinalParse: /\d{1,2}η/,
            ordinal: '%dη',
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : australian english (en-au)

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('en-au', {
            months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
            monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
            weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
            weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
            weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
            longDateFormat: {
                LT: 'h:mm A',
                LTS: 'h:mm:ss A',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd, D MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[Today at] LT',
                nextDay: '[Tomorrow at] LT',
                nextWeek: 'dddd [at] LT',
                lastDay: '[Yesterday at] LT',
                lastWeek: '[Last] dddd [at] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'in %s',
                past: '%s ago',
                s: 'a few seconds',
                m: 'a minute',
                mm: '%d minutes',
                h: 'an hour',
                hh: '%d hours',
                d: 'a day',
                dd: '%d days',
                M: 'a month',
                MM: '%d months',
                y: 'a year',
                yy: '%d years'
            },
            ordinalParse: /\d{1,2}(st|nd|rd|th)/,
            ordinal: function (number) {
                var b = number % 10,
                    output = (~~(number % 100 / 10) === 1) ? 'th' :
                        (b === 1) ? 'st' :
                            (b === 2) ? 'nd' :
                                (b === 3) ? 'rd' : 'th';
                return number + output;
            },
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : canadian english (en-ca)
    // author : Jonathan Abourbih : https://github.com/jonbca

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('en-ca', {
            months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
            monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
            weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
            weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
            weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
            longDateFormat: {
                LT: 'h:mm A',
                LTS: 'h:mm:ss A',
                L: 'YYYY-MM-DD',
                LL: 'D MMMM, YYYY',
                LLL: 'D MMMM, YYYY LT',
                LLLL: 'dddd, D MMMM, YYYY LT'
            },
            calendar: {
                sameDay: '[Today at] LT',
                nextDay: '[Tomorrow at] LT',
                nextWeek: 'dddd [at] LT',
                lastDay: '[Yesterday at] LT',
                lastWeek: '[Last] dddd [at] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'in %s',
                past: '%s ago',
                s: 'a few seconds',
                m: 'a minute',
                mm: '%d minutes',
                h: 'an hour',
                hh: '%d hours',
                d: 'a day',
                dd: '%d days',
                M: 'a month',
                MM: '%d months',
                y: 'a year',
                yy: '%d years'
            },
            ordinalParse: /\d{1,2}(st|nd|rd|th)/,
            ordinal: function (number) {
                var b = number % 10,
                    output = (~~(number % 100 / 10) === 1) ? 'th' :
                        (b === 1) ? 'st' :
                            (b === 2) ? 'nd' :
                                (b === 3) ? 'rd' : 'th';
                return number + output;
            }
        });
    }));
    // moment.js locale configuration
    // locale : great britain english (en-gb)
    // author : Chris Gedrim : https://github.com/chrisgedrim

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('en-gb', {
            months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
            monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
            weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
            weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
            weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'HH:mm:ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd, D MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[Today at] LT',
                nextDay: '[Tomorrow at] LT',
                nextWeek: 'dddd [at] LT',
                lastDay: '[Yesterday at] LT',
                lastWeek: '[Last] dddd [at] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'in %s',
                past: '%s ago',
                s: 'a few seconds',
                m: 'a minute',
                mm: '%d minutes',
                h: 'an hour',
                hh: '%d hours',
                d: 'a day',
                dd: '%d days',
                M: 'a month',
                MM: '%d months',
                y: 'a year',
                yy: '%d years'
            },
            ordinalParse: /\d{1,2}(st|nd|rd|th)/,
            ordinal: function (number) {
                var b = number % 10,
                    output = (~~(number % 100 / 10) === 1) ? 'th' :
                        (b === 1) ? 'st' :
                            (b === 2) ? 'nd' :
                                (b === 3) ? 'rd' : 'th';
                return number + output;
            },
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : esperanto (eo)
    // author : Colin Dean : https://github.com/colindean
    // komento: Mi estas malcerta se mi korekte traktis akuzativojn en tiu traduko.
    //          Se ne, bonvolu korekti kaj avizi min por ke mi povas lerni!

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('eo', {
            months: 'januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro'.split('_'),
            monthsShort: 'jan_feb_mar_apr_maj_jun_jul_aŭg_sep_okt_nov_dec'.split('_'),
            weekdays: 'Dimanĉo_Lundo_Mardo_Merkredo_Ĵaŭdo_Vendredo_Sabato'.split('_'),
            weekdaysShort: 'Dim_Lun_Mard_Merk_Ĵaŭ_Ven_Sab'.split('_'),
            weekdaysMin: 'Di_Lu_Ma_Me_Ĵa_Ve_Sa'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'YYYY-MM-DD',
                LL: 'D[-an de] MMMM, YYYY',
                LLL: 'D[-an de] MMMM, YYYY LT',
                LLLL: 'dddd, [la] D[-an de] MMMM, YYYY LT'
            },
            meridiemParse: /[ap]\.t\.m/i,
            isPM: function (input) {
                return input.charAt(0).toLowerCase() === 'p';
            },
            meridiem: function (hours, minutes, isLower) {
                if (hours > 11) {
                    return isLower ? 'p.t.m.' : 'P.T.M.';
                } else {
                    return isLower ? 'a.t.m.' : 'A.T.M.';
                }
            },
            calendar: {
                sameDay: '[Hodiaŭ je] LT',
                nextDay: '[Morgaŭ je] LT',
                nextWeek: 'dddd [je] LT',
                lastDay: '[Hieraŭ je] LT',
                lastWeek: '[pasinta] dddd [je] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'je %s',
                past: 'antaŭ %s',
                s: 'sekundoj',
                m: 'minuto',
                mm: '%d minutoj',
                h: 'horo',
                hh: '%d horoj',
                d: 'tago',//ne 'diurno', ĉar estas uzita por proksimumo
                dd: '%d tagoj',
                M: 'monato',
                MM: '%d monatoj',
                y: 'jaro',
                yy: '%d jaroj'
            },
            ordinalParse: /\d{1,2}a/,
            ordinal: '%da',
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : spanish (es)
    // author : Julio Napurí : https://github.com/julionc

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var monthsShortDot = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_'),
            monthsShort = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');

        return moment.defineLocale('es', {
            months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
            monthsShort: function (m, format) {
                if (/-MMM-/.test(format)) {
                    return monthsShort[m.month()];
                } else {
                    return monthsShortDot[m.month()];
                }
            },
            weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
            weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
            weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sá'.split('_'),
            longDateFormat: {
                LT: 'H:mm',
                LTS: 'LT:ss',
                L: 'DD/MM/YYYY',
                LL: 'D [de] MMMM [de] YYYY',
                LLL: 'D [de] MMMM [de] YYYY LT',
                LLLL: 'dddd, D [de] MMMM [de] YYYY LT'
            },
            calendar: {
                sameDay: function () {
                    return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
                },
                nextDay: function () {
                    return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
                },
                nextWeek: function () {
                    return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
                },
                lastDay: function () {
                    return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
                },
                lastWeek: function () {
                    return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
                },
                sameElse: 'L'
            },
            relativeTime: {
                future: 'en %s',
                past: 'hace %s',
                s: 'unos segundos',
                m: 'un minuto',
                mm: '%d minutos',
                h: 'una hora',
                hh: '%d horas',
                d: 'un día',
                dd: '%d días',
                M: 'un mes',
                MM: '%d meses',
                y: 'un año',
                yy: '%d años'
            },
            ordinalParse: /\d{1,2}º/,
            ordinal: '%dº',
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : estonian (et)
    // author : Henry Kehlmann : https://github.com/madhenry
    // improvements : Illimar Tambek : https://github.com/ragulka

    (function (factory) {
        factory(moment);
    }(function (moment) {
        function processRelativeTime(number, withoutSuffix, key, isFuture) {
            var format = {
                's': ['mõne sekundi', 'mõni sekund', 'paar sekundit'],
                'm': ['ühe minuti', 'üks minut'],
                'mm': [number + ' minuti', number + ' minutit'],
                'h': ['ühe tunni', 'tund aega', 'üks tund'],
                'hh': [number + ' tunni', number + ' tundi'],
                'd': ['ühe päeva', 'üks päev'],
                'M': ['kuu aja', 'kuu aega', 'üks kuu'],
                'MM': [number + ' kuu', number + ' kuud'],
                'y': ['ühe aasta', 'aasta', 'üks aasta'],
                'yy': [number + ' aasta', number + ' aastat']
            };
            if (withoutSuffix) {
                return format[key][2] ? format[key][2] : format[key][1];
            }
            return isFuture ? format[key][0] : format[key][1];
        }

        return moment.defineLocale('et', {
            months: 'jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember'.split('_'),
            monthsShort: 'jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets'.split('_'),
            weekdays: 'pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev'.split('_'),
            weekdaysShort: 'P_E_T_K_N_R_L'.split('_'),
            weekdaysMin: 'P_E_T_K_N_R_L'.split('_'),
            longDateFormat: {
                LT: 'H:mm',
                LTS: 'LT:ss',
                L: 'DD.MM.YYYY',
                LL: 'D. MMMM YYYY',
                LLL: 'D. MMMM YYYY LT',
                LLLL: 'dddd, D. MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[Täna,] LT',
                nextDay: '[Homme,] LT',
                nextWeek: '[Järgmine] dddd LT',
                lastDay: '[Eile,] LT',
                lastWeek: '[Eelmine] dddd LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: '%s pärast',
                past: '%s tagasi',
                s: processRelativeTime,
                m: processRelativeTime,
                mm: processRelativeTime,
                h: processRelativeTime,
                hh: processRelativeTime,
                d: processRelativeTime,
                dd: '%d päeva',
                M: processRelativeTime,
                MM: processRelativeTime,
                y: processRelativeTime,
                yy: processRelativeTime
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: '%d.',
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : euskara (eu)
    // author : Eneko Illarramendi : https://github.com/eillarra

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('eu', {
            months: 'urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua'.split('_'),
            monthsShort: 'urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.'.split('_'),
            weekdays: 'igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata'.split('_'),
            weekdaysShort: 'ig._al._ar._az._og._ol._lr.'.split('_'),
            weekdaysMin: 'ig_al_ar_az_og_ol_lr'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'YYYY-MM-DD',
                LL: 'YYYY[ko] MMMM[ren] D[a]',
                LLL: 'YYYY[ko] MMMM[ren] D[a] LT',
                LLLL: 'dddd, YYYY[ko] MMMM[ren] D[a] LT',
                l: 'YYYY-M-D',
                ll: 'YYYY[ko] MMM D[a]',
                lll: 'YYYY[ko] MMM D[a] LT',
                llll: 'ddd, YYYY[ko] MMM D[a] LT'
            },
            calendar: {
                sameDay: '[gaur] LT[etan]',
                nextDay: '[bihar] LT[etan]',
                nextWeek: 'dddd LT[etan]',
                lastDay: '[atzo] LT[etan]',
                lastWeek: '[aurreko] dddd LT[etan]',
                sameElse: 'L'
            },
            relativeTime: {
                future: '%s barru',
                past: 'duela %s',
                s: 'segundo batzuk',
                m: 'minutu bat',
                mm: '%d minutu',
                h: 'ordu bat',
                hh: '%d ordu',
                d: 'egun bat',
                dd: '%d egun',
                M: 'hilabete bat',
                MM: '%d hilabete',
                y: 'urte bat',
                yy: '%d urte'
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: '%d.',
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : Persian (fa)
    // author : Ebrahim Byagowi : https://github.com/ebraminio

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var symbolMap = {
            '1': '۱',
            '2': '۲',
            '3': '۳',
            '4': '۴',
            '5': '۵',
            '6': '۶',
            '7': '۷',
            '8': '۸',
            '9': '۹',
            '0': '۰'
        }, numberMap = {
            '۱': '1',
            '۲': '2',
            '۳': '3',
            '۴': '4',
            '۵': '5',
            '۶': '6',
            '۷': '7',
            '۸': '8',
            '۹': '9',
            '۰': '0'
        };

        return moment.defineLocale('fa', {
            months: 'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split('_'),
            monthsShort: 'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split('_'),
            weekdays: 'یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه'.split('_'),
            weekdaysShort: 'یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه'.split('_'),
            weekdaysMin: 'ی_د_س_چ_پ_ج_ش'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd, D MMMM YYYY LT'
            },
            meridiemParse: /قبل از ظهر|بعد از ظهر/,
            isPM: function (input) {
                return /بعد از ظهر/.test(input);
            },
            meridiem: function (hour, minute, isLower) {
                if (hour < 12) {
                    return 'قبل از ظهر';
                } else {
                    return 'بعد از ظهر';
                }
            },
            calendar: {
                sameDay: '[امروز ساعت] LT',
                nextDay: '[فردا ساعت] LT',
                nextWeek: 'dddd [ساعت] LT',
                lastDay: '[دیروز ساعت] LT',
                lastWeek: 'dddd [پیش] [ساعت] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'در %s',
                past: '%s پیش',
                s: 'چندین ثانیه',
                m: 'یک دقیقه',
                mm: '%d دقیقه',
                h: 'یک ساعت',
                hh: '%d ساعت',
                d: 'یک روز',
                dd: '%d روز',
                M: 'یک ماه',
                MM: '%d ماه',
                y: 'یک سال',
                yy: '%d سال'
            },
            preparse: function (string) {
                return string.replace(/[۰-۹]/g, function (match) {
                    return numberMap[match];
                }).replace(/،/g, ',');
            },
            postformat: function (string) {
                return string.replace(/\d/g, function (match) {
                    return symbolMap[match];
                }).replace(/,/g, '،');
            },
            ordinalParse: /\d{1,2}م/,
            ordinal: '%dم',
            week: {
                dow: 6, // Saturday is the first day of the week.
                doy: 12 // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : finnish (fi)
    // author : Tarmo Aidantausta : https://github.com/bleadof

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var numbersPast = 'nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän'.split(' '),
            numbersFuture = [
                'nolla', 'yhden', 'kahden', 'kolmen', 'neljän', 'viiden', 'kuuden',
                numbersPast[7], numbersPast[8], numbersPast[9]
            ];

        function translate(number, withoutSuffix, key, isFuture) {
            var result = '';
            switch (key) {
                case 's':
                    return isFuture ? 'muutaman sekunnin' : 'muutama sekunti';
                case 'm':
                    return isFuture ? 'minuutin' : 'minuutti';
                case 'mm':
                    result = isFuture ? 'minuutin' : 'minuuttia';
                    break;
                case 'h':
                    return isFuture ? 'tunnin' : 'tunti';
                case 'hh':
                    result = isFuture ? 'tunnin' : 'tuntia';
                    break;
                case 'd':
                    return isFuture ? 'päivän' : 'päivä';
                case 'dd':
                    result = isFuture ? 'päivän' : 'päivää';
                    break;
                case 'M':
                    return isFuture ? 'kuukauden' : 'kuukausi';
                case 'MM':
                    result = isFuture ? 'kuukauden' : 'kuukautta';
                    break;
                case 'y':
                    return isFuture ? 'vuoden' : 'vuosi';
                case 'yy':
                    result = isFuture ? 'vuoden' : 'vuotta';
                    break;
            }
            result = verbalNumber(number, isFuture) + ' ' + result;
            return result;
        }

        function verbalNumber(number, isFuture) {
            return number < 10 ? (isFuture ? numbersFuture[number] : numbersPast[number]) : number;
        }

        return moment.defineLocale('fi', {
            months: 'tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu'.split('_'),
            monthsShort: 'tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu'.split('_'),
            weekdays: 'sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai'.split('_'),
            weekdaysShort: 'su_ma_ti_ke_to_pe_la'.split('_'),
            weekdaysMin: 'su_ma_ti_ke_to_pe_la'.split('_'),
            longDateFormat: {
                LT: 'HH.mm',
                LTS: 'HH.mm.ss',
                L: 'DD.MM.YYYY',
                LL: 'Do MMMM[ta] YYYY',
                LLL: 'Do MMMM[ta] YYYY, [klo] LT',
                LLLL: 'dddd, Do MMMM[ta] YYYY, [klo] LT',
                l: 'D.M.YYYY',
                ll: 'Do MMM YYYY',
                lll: 'Do MMM YYYY, [klo] LT',
                llll: 'ddd, Do MMM YYYY, [klo] LT'
            },
            calendar: {
                sameDay: '[tänään] [klo] LT',
                nextDay: '[huomenna] [klo] LT',
                nextWeek: 'dddd [klo] LT',
                lastDay: '[eilen] [klo] LT',
                lastWeek: '[viime] dddd[na] [klo] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: '%s päästä',
                past: '%s sitten',
                s: translate,
                m: translate,
                mm: translate,
                h: translate,
                hh: translate,
                d: translate,
                dd: translate,
                M: translate,
                MM: translate,
                y: translate,
                yy: translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: '%d.',
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : faroese (fo)
    // author : Ragnar Johannesen : https://github.com/ragnar123

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('fo', {
            months: 'januar_februar_mars_apríl_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
            monthsShort: 'jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_'),
            weekdays: 'sunnudagur_mánadagur_týsdagur_mikudagur_hósdagur_fríggjadagur_leygardagur'.split('_'),
            weekdaysShort: 'sun_mán_týs_mik_hós_frí_ley'.split('_'),
            weekdaysMin: 'su_má_tý_mi_hó_fr_le'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd D. MMMM, YYYY LT'
            },
            calendar: {
                sameDay: '[Í dag kl.] LT',
                nextDay: '[Í morgin kl.] LT',
                nextWeek: 'dddd [kl.] LT',
                lastDay: '[Í gjár kl.] LT',
                lastWeek: '[síðstu] dddd [kl] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'um %s',
                past: '%s síðani',
                s: 'fá sekund',
                m: 'ein minutt',
                mm: '%d minuttir',
                h: 'ein tími',
                hh: '%d tímar',
                d: 'ein dagur',
                dd: '%d dagar',
                M: 'ein mánaði',
                MM: '%d mánaðir',
                y: 'eitt ár',
                yy: '%d ár'
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: '%d.',
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : canadian french (fr-ca)
    // author : Jonathan Abourbih : https://github.com/jonbca

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('fr-ca', {
            months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
            monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
            weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
            weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
            weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'YYYY-MM-DD',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd D MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[Aujourd\'hui à] LT',
                nextDay: '[Demain à] LT',
                nextWeek: 'dddd [à] LT',
                lastDay: '[Hier à] LT',
                lastWeek: 'dddd [dernier à] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'dans %s',
                past: 'il y a %s',
                s: 'quelques secondes',
                m: 'une minute',
                mm: '%d minutes',
                h: 'une heure',
                hh: '%d heures',
                d: 'un jour',
                dd: '%d jours',
                M: 'un mois',
                MM: '%d mois',
                y: 'un an',
                yy: '%d ans'
            },
            ordinalParse: /\d{1,2}(er|)/,
            ordinal: function (number) {
                return number + (number === 1 ? 'er' : '');
            }
        });
    }));
    // moment.js locale configuration
    // locale : french (fr)
    // author : John Fischer : https://github.com/jfroffice

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('fr', {
            months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
            monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
            weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
            weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
            weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd D MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[Aujourd\'hui à] LT',
                nextDay: '[Demain à] LT',
                nextWeek: 'dddd [à] LT',
                lastDay: '[Hier à] LT',
                lastWeek: 'dddd [dernier à] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'dans %s',
                past: 'il y a %s',
                s: 'quelques secondes',
                m: 'une minute',
                mm: '%d minutes',
                h: 'une heure',
                hh: '%d heures',
                d: 'un jour',
                dd: '%d jours',
                M: 'un mois',
                MM: '%d mois',
                y: 'un an',
                yy: '%d ans'
            },
            ordinalParse: /\d{1,2}(er|)/,
            ordinal: function (number) {
                return number + (number === 1 ? 'er' : '');
            },
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : frisian (fy)
    // author : Robin van der Vliet : https://github.com/robin0van0der0v

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var monthsShortWithDots = 'jan._feb._mrt._apr._mai_jun._jul._aug._sep._okt._nov._des.'.split('_'),
            monthsShortWithoutDots = 'jan_feb_mrt_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_');

        return moment.defineLocale('fy', {
            months: 'jannewaris_febrewaris_maart_april_maaie_juny_july_augustus_septimber_oktober_novimber_desimber'.split('_'),
            monthsShort: function (m, format) {
                if (/-MMM-/.test(format)) {
                    return monthsShortWithoutDots[m.month()];
                } else {
                    return monthsShortWithDots[m.month()];
                }
            },
            weekdays: 'snein_moandei_tiisdei_woansdei_tongersdei_freed_sneon'.split('_'),
            weekdaysShort: 'si._mo._ti._wo._to._fr._so.'.split('_'),
            weekdaysMin: 'Si_Mo_Ti_Wo_To_Fr_So'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD-MM-YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd D MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[hjoed om] LT',
                nextDay: '[moarn om] LT',
                nextWeek: 'dddd [om] LT',
                lastDay: '[juster om] LT',
                lastWeek: '[ôfrûne] dddd [om] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'oer %s',
                past: '%s lyn',
                s: 'in pear sekonden',
                m: 'ien minút',
                mm: '%d minuten',
                h: 'ien oere',
                hh: '%d oeren',
                d: 'ien dei',
                dd: '%d dagen',
                M: 'ien moanne',
                MM: '%d moannen',
                y: 'ien jier',
                yy: '%d jierren'
            },
            ordinalParse: /\d{1,2}(ste|de)/,
            ordinal: function (number) {
                return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
            },
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : galician (gl)
    // author : Juan G. Hurtado : https://github.com/juanghurtado

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('gl', {
            months: 'Xaneiro_Febreiro_Marzo_Abril_Maio_Xuño_Xullo_Agosto_Setembro_Outubro_Novembro_Decembro'.split('_'),
            monthsShort: 'Xan._Feb._Mar._Abr._Mai._Xuñ._Xul._Ago._Set._Out._Nov._Dec.'.split('_'),
            weekdays: 'Domingo_Luns_Martes_Mércores_Xoves_Venres_Sábado'.split('_'),
            weekdaysShort: 'Dom._Lun._Mar._Mér._Xov._Ven._Sáb.'.split('_'),
            weekdaysMin: 'Do_Lu_Ma_Mé_Xo_Ve_Sá'.split('_'),
            longDateFormat: {
                LT: 'H:mm',
                LTS: 'LT:ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd D MMMM YYYY LT'
            },
            calendar: {
                sameDay: function () {
                    return '[hoxe ' + ((this.hours() !== 1) ? 'ás' : 'á') + '] LT';
                },
                nextDay: function () {
                    return '[mañá ' + ((this.hours() !== 1) ? 'ás' : 'á') + '] LT';
                },
                nextWeek: function () {
                    return 'dddd [' + ((this.hours() !== 1) ? 'ás' : 'a') + '] LT';
                },
                lastDay: function () {
                    return '[onte ' + ((this.hours() !== 1) ? 'á' : 'a') + '] LT';
                },
                lastWeek: function () {
                    return '[o] dddd [pasado ' + ((this.hours() !== 1) ? 'ás' : 'a') + '] LT';
                },
                sameElse: 'L'
            },
            relativeTime: {
                future: function (str) {
                    if (str === 'uns segundos') {
                        return 'nuns segundos';
                    }
                    return 'en ' + str;
                },
                past: 'hai %s',
                s: 'uns segundos',
                m: 'un minuto',
                mm: '%d minutos',
                h: 'unha hora',
                hh: '%d horas',
                d: 'un día',
                dd: '%d días',
                M: 'un mes',
                MM: '%d meses',
                y: 'un ano',
                yy: '%d anos'
            },
            ordinalParse: /\d{1,2}º/,
            ordinal: '%dº',
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : Hebrew (he)
    // author : Tomer Cohen : https://github.com/tomer
    // author : Moshe Simantov : https://github.com/DevelopmentIL
    // author : Tal Ater : https://github.com/TalAter

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('he', {
            months: 'ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר'.split('_'),
            monthsShort: 'ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳'.split('_'),
            weekdays: 'ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת'.split('_'),
            weekdaysShort: 'א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳'.split('_'),
            weekdaysMin: 'א_ב_ג_ד_ה_ו_ש'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD/MM/YYYY',
                LL: 'D [ב]MMMM YYYY',
                LLL: 'D [ב]MMMM YYYY LT',
                LLLL: 'dddd, D [ב]MMMM YYYY LT',
                l: 'D/M/YYYY',
                ll: 'D MMM YYYY',
                lll: 'D MMM YYYY LT',
                llll: 'ddd, D MMM YYYY LT'
            },
            calendar: {
                sameDay: '[היום ב־]LT',
                nextDay: '[מחר ב־]LT',
                nextWeek: 'dddd [בשעה] LT',
                lastDay: '[אתמול ב־]LT',
                lastWeek: '[ביום] dddd [האחרון בשעה] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'בעוד %s',
                past: 'לפני %s',
                s: 'מספר שניות',
                m: 'דקה',
                mm: '%d דקות',
                h: 'שעה',
                hh: function (number) {
                    if (number === 2) {
                        return 'שעתיים';
                    }
                    return number + ' שעות';
                },
                d: 'יום',
                dd: function (number) {
                    if (number === 2) {
                        return 'יומיים';
                    }
                    return number + ' ימים';
                },
                M: 'חודש',
                MM: function (number) {
                    if (number === 2) {
                        return 'חודשיים';
                    }
                    return number + ' חודשים';
                },
                y: 'שנה',
                yy: function (number) {
                    if (number === 2) {
                        return 'שנתיים';
                    } else if (number % 10 === 0 && number !== 10) {
                        return number + ' שנה';
                    }
                    return number + ' שנים';
                }
            }
        });
    }));
    // moment.js locale configuration
    // locale : hindi (hi)
    // author : Mayank Singhal : https://github.com/mayanksinghal

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var symbolMap = {
            '1': '१',
            '2': '२',
            '3': '३',
            '4': '४',
            '5': '५',
            '6': '६',
            '7': '७',
            '8': '८',
            '9': '९',
            '0': '०'
        },
            numberMap = {
                '१': '1',
                '२': '2',
                '३': '3',
                '४': '4',
                '५': '5',
                '६': '6',
                '७': '7',
                '८': '8',
                '९': '9',
                '०': '0'
            };

        return moment.defineLocale('hi', {
            months: 'जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितम्बर_अक्टूबर_नवम्बर_दिसम्बर'.split('_'),
            monthsShort: 'जन._फ़र._मार्च_अप्रै._मई_जून_जुल._अग._सित._अक्टू._नव._दिस.'.split('_'),
            weekdays: 'रविवार_सोमवार_मंगलवार_बुधवार_गुरूवार_शुक्रवार_शनिवार'.split('_'),
            weekdaysShort: 'रवि_सोम_मंगल_बुध_गुरू_शुक्र_शनि'.split('_'),
            weekdaysMin: 'र_सो_मं_बु_गु_शु_श'.split('_'),
            longDateFormat: {
                LT: 'A h:mm बजे',
                LTS: 'A h:mm:ss बजे',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY, LT',
                LLLL: 'dddd, D MMMM YYYY, LT'
            },
            calendar: {
                sameDay: '[आज] LT',
                nextDay: '[कल] LT',
                nextWeek: 'dddd, LT',
                lastDay: '[कल] LT',
                lastWeek: '[पिछले] dddd, LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: '%s में',
                past: '%s पहले',
                s: 'कुछ ही क्षण',
                m: 'एक मिनट',
                mm: '%d मिनट',
                h: 'एक घंटा',
                hh: '%d घंटे',
                d: 'एक दिन',
                dd: '%d दिन',
                M: 'एक महीने',
                MM: '%d महीने',
                y: 'एक वर्ष',
                yy: '%d वर्ष'
            },
            preparse: function (string) {
                return string.replace(/[१२३४५६७८९०]/g, function (match) {
                    return numberMap[match];
                });
            },
            postformat: function (string) {
                return string.replace(/\d/g, function (match) {
                    return symbolMap[match];
                });
            },
            // Hindi notation for meridiems are quite fuzzy in practice. While there exists
            // a rigid notion of a 'Pahar' it is not used as rigidly in modern Hindi.
            meridiemParse: /रात|सुबह|दोपहर|शाम/,
            meridiemHour: function (hour, meridiem) {
                if (hour === 12) {
                    hour = 0;
                }
                if (meridiem === 'रात') {
                    return hour < 4 ? hour : hour + 12;
                } else if (meridiem === 'सुबह') {
                    return hour;
                } else if (meridiem === 'दोपहर') {
                    return hour >= 10 ? hour : hour + 12;
                } else if (meridiem === 'शाम') {
                    return hour + 12;
                }
            },
            meridiem: function (hour, minute, isLower) {
                if (hour < 4) {
                    return 'रात';
                } else if (hour < 10) {
                    return 'सुबह';
                } else if (hour < 17) {
                    return 'दोपहर';
                } else if (hour < 20) {
                    return 'शाम';
                } else {
                    return 'रात';
                }
            },
            week: {
                dow: 0, // Sunday is the first day of the week.
                doy: 6  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : hrvatski (hr)
    // author : Bojan Marković : https://github.com/bmarkovic

    // based on (sl) translation by Robert Sedovšek

    (function (factory) {
        factory(moment);
    }(function (moment) {
        function translate(number, withoutSuffix, key) {
            var result = number + ' ';
            switch (key) {
                case 'm':
                    return withoutSuffix ? 'jedna minuta' : 'jedne minute';
                case 'mm':
                    if (number === 1) {
                        result += 'minuta';
                    } else if (number === 2 || number === 3 || number === 4) {
                        result += 'minute';
                    } else {
                        result += 'minuta';
                    }
                    return result;
                case 'h':
                    return withoutSuffix ? 'jedan sat' : 'jednog sata';
                case 'hh':
                    if (number === 1) {
                        result += 'sat';
                    } else if (number === 2 || number === 3 || number === 4) {
                        result += 'sata';
                    } else {
                        result += 'sati';
                    }
                    return result;
                case 'dd':
                    if (number === 1) {
                        result += 'dan';
                    } else {
                        result += 'dana';
                    }
                    return result;
                case 'MM':
                    if (number === 1) {
                        result += 'mjesec';
                    } else if (number === 2 || number === 3 || number === 4) {
                        result += 'mjeseca';
                    } else {
                        result += 'mjeseci';
                    }
                    return result;
                case 'yy':
                    if (number === 1) {
                        result += 'godina';
                    } else if (number === 2 || number === 3 || number === 4) {
                        result += 'godine';
                    } else {
                        result += 'godina';
                    }
                    return result;
            }
        }

        return moment.defineLocale('hr', {
            months: 'sječanj_veljača_ožujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac'.split('_'),
            monthsShort: 'sje._vel._ožu._tra._svi._lip._srp._kol._ruj._lis._stu._pro.'.split('_'),
            weekdays: 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
            weekdaysShort: 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
            weekdaysMin: 'ne_po_ut_sr_če_pe_su'.split('_'),
            longDateFormat: {
                LT: 'H:mm',
                LTS: 'LT:ss',
                L: 'DD. MM. YYYY',
                LL: 'D. MMMM YYYY',
                LLL: 'D. MMMM YYYY LT',
                LLLL: 'dddd, D. MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[danas u] LT',
                nextDay: '[sutra u] LT',

                nextWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return '[u] [nedjelju] [u] LT';
                        case 3:
                            return '[u] [srijedu] [u] LT';
                        case 6:
                            return '[u] [subotu] [u] LT';
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return '[u] dddd [u] LT';
                    }
                },
                lastDay: '[jučer u] LT',
                lastWeek: function () {
                    switch (this.day()) {
                        case 0:
                        case 3:
                            return '[prošlu] dddd [u] LT';
                        case 6:
                            return '[prošle] [subote] [u] LT';
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return '[prošli] dddd [u] LT';
                    }
                },
                sameElse: 'L'
            },
            relativeTime: {
                future: 'za %s',
                past: 'prije %s',
                s: 'par sekundi',
                m: translate,
                mm: translate,
                h: translate,
                hh: translate,
                d: 'dan',
                dd: translate,
                M: 'mjesec',
                MM: translate,
                y: 'godinu',
                yy: translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: '%d.',
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : hungarian (hu)
    // author : Adam Brunner : https://github.com/adambrunner

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var weekEndings = 'vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton'.split(' ');

        function translate(number, withoutSuffix, key, isFuture) {
            var num = number,
                suffix;

            switch (key) {
                case 's':
                    return (isFuture || withoutSuffix) ? 'néhány másodperc' : 'néhány másodperce';
                case 'm':
                    return 'egy' + (isFuture || withoutSuffix ? ' perc' : ' perce');
                case 'mm':
                    return num + (isFuture || withoutSuffix ? ' perc' : ' perce');
                case 'h':
                    return 'egy' + (isFuture || withoutSuffix ? ' óra' : ' órája');
                case 'hh':
                    return num + (isFuture || withoutSuffix ? ' óra' : ' órája');
                case 'd':
                    return 'egy' + (isFuture || withoutSuffix ? ' nap' : ' napja');
                case 'dd':
                    return num + (isFuture || withoutSuffix ? ' nap' : ' napja');
                case 'M':
                    return 'egy' + (isFuture || withoutSuffix ? ' hónap' : ' hónapja');
                case 'MM':
                    return num + (isFuture || withoutSuffix ? ' hónap' : ' hónapja');
                case 'y':
                    return 'egy' + (isFuture || withoutSuffix ? ' év' : ' éve');
                case 'yy':
                    return num + (isFuture || withoutSuffix ? ' év' : ' éve');
            }

            return '';
        }

        function week(isFuture) {
            return (isFuture ? '' : '[múlt] ') + '[' + weekEndings[this.day()] + '] LT[-kor]';
        }

        return moment.defineLocale('hu', {
            months: 'január_február_március_április_május_június_július_augusztus_szeptember_október_november_december'.split('_'),
            monthsShort: 'jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec'.split('_'),
            weekdays: 'vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat'.split('_'),
            weekdaysShort: 'vas_hét_kedd_sze_csüt_pén_szo'.split('_'),
            weekdaysMin: 'v_h_k_sze_cs_p_szo'.split('_'),
            longDateFormat: {
                LT: 'H:mm',
                LTS: 'LT:ss',
                L: 'YYYY.MM.DD.',
                LL: 'YYYY. MMMM D.',
                LLL: 'YYYY. MMMM D., LT',
                LLLL: 'YYYY. MMMM D., dddd LT'
            },
            meridiemParse: /de|du/i,
            isPM: function (input) {
                return input.charAt(1).toLowerCase() === 'u';
            },
            meridiem: function (hours, minutes, isLower) {
                if (hours < 12) {
                    return isLower === true ? 'de' : 'DE';
                } else {
                    return isLower === true ? 'du' : 'DU';
                }
            },
            calendar: {
                sameDay: '[ma] LT[-kor]',
                nextDay: '[holnap] LT[-kor]',
                nextWeek: function () {
                    return week.call(this, true);
                },
                lastDay: '[tegnap] LT[-kor]',
                lastWeek: function () {
                    return week.call(this, false);
                },
                sameElse: 'L'
            },
            relativeTime: {
                future: '%s múlva',
                past: '%s',
                s: translate,
                m: translate,
                mm: translate,
                h: translate,
                hh: translate,
                d: translate,
                dd: translate,
                M: translate,
                MM: translate,
                y: translate,
                yy: translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: '%d.',
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : Armenian (hy-am)
    // author : Armendarabyan : https://github.com/armendarabyan

    (function (factory) {
        factory(moment);
    }(function (moment) {
        function monthsCaseReplace(m, format) {
            var months = {
                'nominative': 'հունվար_փետրվար_մարտ_ապրիլ_մայիս_հունիս_հուլիս_օգոստոս_սեպտեմբեր_հոկտեմբեր_նոյեմբեր_դեկտեմբեր'.split('_'),
                'accusative': 'հունվարի_փետրվարի_մարտի_ապրիլի_մայիսի_հունիսի_հուլիսի_օգոստոսի_սեպտեմբերի_հոկտեմբերի_նոյեմբերի_դեկտեմբերի'.split('_')
            },

                nounCase = (/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/).test(format) ?
                    'accusative' :
                    'nominative';

            return months[nounCase][m.month()];
        }

        function monthsShortCaseReplace(m, format) {
            var monthsShort = 'հնվ_փտր_մրտ_ապր_մյս_հնս_հլս_օգս_սպտ_հկտ_նմբ_դկտ'.split('_');

            return monthsShort[m.month()];
        }

        function weekdaysCaseReplace(m, format) {
            var weekdays = 'կիրակի_երկուշաբթի_երեքշաբթի_չորեքշաբթի_հինգշաբթի_ուրբաթ_շաբաթ'.split('_');

            return weekdays[m.day()];
        }

        return moment.defineLocale('hy-am', {
            months: monthsCaseReplace,
            monthsShort: monthsShortCaseReplace,
            weekdays: weekdaysCaseReplace,
            weekdaysShort: 'կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ'.split('_'),
            weekdaysMin: 'կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD.MM.YYYY',
                LL: 'D MMMM YYYY թ.',
                LLL: 'D MMMM YYYY թ., LT',
                LLLL: 'dddd, D MMMM YYYY թ., LT'
            },
            calendar: {
                sameDay: '[այսօր] LT',
                nextDay: '[վաղը] LT',
                lastDay: '[երեկ] LT',
                nextWeek: function () {
                    return 'dddd [օրը ժամը] LT';
                },
                lastWeek: function () {
                    return '[անցած] dddd [օրը ժամը] LT';
                },
                sameElse: 'L'
            },
            relativeTime: {
                future: '%s հետո',
                past: '%s առաջ',
                s: 'մի քանի վայրկյան',
                m: 'րոպե',
                mm: '%d րոպե',
                h: 'ժամ',
                hh: '%d ժամ',
                d: 'օր',
                dd: '%d օր',
                M: 'ամիս',
                MM: '%d ամիս',
                y: 'տարի',
                yy: '%d տարի'
            },

            meridiemParse: /գիշերվա|առավոտվա|ցերեկվա|երեկոյան/,
            isPM: function (input) {
                return /^(ցերեկվա|երեկոյան)$/.test(input);
            },
            meridiem: function (hour) {
                if (hour < 4) {
                    return 'գիշերվա';
                } else if (hour < 12) {
                    return 'առավոտվա';
                } else if (hour < 17) {
                    return 'ցերեկվա';
                } else {
                    return 'երեկոյան';
                }
            },

            ordinalParse: /\d{1,2}|\d{1,2}-(ին|րդ)/,
            ordinal: function (number, period) {
                switch (period) {
                    case 'DDD':
                    case 'w':
                    case 'W':
                    case 'DDDo':
                        if (number === 1) {
                            return number + '-ին';
                        }
                        return number + '-րդ';
                    default:
                        return number;
                }
            },

            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : Bahasa Indonesia (id)
    // author : Mohammad Satrio Utomo : https://github.com/tyok
    // reference: http://id.wikisource.org/wiki/Pedoman_Umum_Ejaan_Bahasa_Indonesia_yang_Disempurnakan

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('id', {
            months: 'Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember'.split('_'),
            monthsShort: 'Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nov_Des'.split('_'),
            weekdays: 'Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu'.split('_'),
            weekdaysShort: 'Min_Sen_Sel_Rab_Kam_Jum_Sab'.split('_'),
            weekdaysMin: 'Mg_Sn_Sl_Rb_Km_Jm_Sb'.split('_'),
            longDateFormat: {
                LT: 'HH.mm',
                LTS: 'LT.ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY [pukul] LT',
                LLLL: 'dddd, D MMMM YYYY [pukul] LT'
            },
            meridiemParse: /pagi|siang|sore|malam/,
            meridiemHour: function (hour, meridiem) {
                if (hour === 12) {
                    hour = 0;
                }
                if (meridiem === 'pagi') {
                    return hour;
                } else if (meridiem === 'siang') {
                    return hour >= 11 ? hour : hour + 12;
                } else if (meridiem === 'sore' || meridiem === 'malam') {
                    return hour + 12;
                }
            },
            meridiem: function (hours, minutes, isLower) {
                if (hours < 11) {
                    return 'pagi';
                } else if (hours < 15) {
                    return 'siang';
                } else if (hours < 19) {
                    return 'sore';
                } else {
                    return 'malam';
                }
            },
            calendar: {
                sameDay: '[Hari ini pukul] LT',
                nextDay: '[Besok pukul] LT',
                nextWeek: 'dddd [pukul] LT',
                lastDay: '[Kemarin pukul] LT',
                lastWeek: 'dddd [lalu pukul] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'dalam %s',
                past: '%s yang lalu',
                s: 'beberapa detik',
                m: 'semenit',
                mm: '%d menit',
                h: 'sejam',
                hh: '%d jam',
                d: 'sehari',
                dd: '%d hari',
                M: 'sebulan',
                MM: '%d bulan',
                y: 'setahun',
                yy: '%d tahun'
            },
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : icelandic (is)
    // author : Hinrik Örn Sigurðsson : https://github.com/hinrik

    (function (factory) {
        factory(moment);
    }(function (moment) {
        function plural(n) {
            if (n % 100 === 11) {
                return true;
            } else if (n % 10 === 1) {
                return false;
            }
            return true;
        }

        function translate(number, withoutSuffix, key, isFuture) {
            var result = number + ' ';
            switch (key) {
                case 's':
                    return withoutSuffix || isFuture ? 'nokkrar sekúndur' : 'nokkrum sekúndum';
                case 'm':
                    return withoutSuffix ? 'mínúta' : 'mínútu';
                case 'mm':
                    if (plural(number)) {
                        return result + (withoutSuffix || isFuture ? 'mínútur' : 'mínútum');
                    } else if (withoutSuffix) {
                        return result + 'mínúta';
                    }
                    return result + 'mínútu';
                case 'hh':
                    if (plural(number)) {
                        return result + (withoutSuffix || isFuture ? 'klukkustundir' : 'klukkustundum');
                    }
                    return result + 'klukkustund';
                case 'd':
                    if (withoutSuffix) {
                        return 'dagur';
                    }
                    return isFuture ? 'dag' : 'degi';
                case 'dd':
                    if (plural(number)) {
                        if (withoutSuffix) {
                            return result + 'dagar';
                        }
                        return result + (isFuture ? 'daga' : 'dögum');
                    } else if (withoutSuffix) {
                        return result + 'dagur';
                    }
                    return result + (isFuture ? 'dag' : 'degi');
                case 'M':
                    if (withoutSuffix) {
                        return 'mánuður';
                    }
                    return isFuture ? 'mánuð' : 'mánuði';
                case 'MM':
                    if (plural(number)) {
                        if (withoutSuffix) {
                            return result + 'mánuðir';
                        }
                        return result + (isFuture ? 'mánuði' : 'mánuðum');
                    } else if (withoutSuffix) {
                        return result + 'mánuður';
                    }
                    return result + (isFuture ? 'mánuð' : 'mánuði');
                case 'y':
                    return withoutSuffix || isFuture ? 'ár' : 'ári';
                case 'yy':
                    if (plural(number)) {
                        return result + (withoutSuffix || isFuture ? 'ár' : 'árum');
                    }
                    return result + (withoutSuffix || isFuture ? 'ár' : 'ári');
            }
        }

        return moment.defineLocale('is', {
            months: 'janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember'.split('_'),
            monthsShort: 'jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des'.split('_'),
            weekdays: 'sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur'.split('_'),
            weekdaysShort: 'sun_mán_þri_mið_fim_fös_lau'.split('_'),
            weekdaysMin: 'Su_Má_Þr_Mi_Fi_Fö_La'.split('_'),
            longDateFormat: {
                LT: 'H:mm',
                LTS: 'LT:ss',
                L: 'DD/MM/YYYY',
                LL: 'D. MMMM YYYY',
                LLL: 'D. MMMM YYYY [kl.] LT',
                LLLL: 'dddd, D. MMMM YYYY [kl.] LT'
            },
            calendar: {
                sameDay: '[í dag kl.] LT',
                nextDay: '[á morgun kl.] LT',
                nextWeek: 'dddd [kl.] LT',
                lastDay: '[í gær kl.] LT',
                lastWeek: '[síðasta] dddd [kl.] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'eftir %s',
                past: 'fyrir %s síðan',
                s: translate,
                m: translate,
                mm: translate,
                h: 'klukkustund',
                hh: translate,
                d: translate,
                dd: translate,
                M: translate,
                MM: translate,
                y: translate,
                yy: translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: '%d.',
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : italian (it)
    // author : Lorenzo : https://github.com/aliem
    // author: Mattia Larentis: https://github.com/nostalgiaz

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('it', {
            months: 'gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre'.split('_'),
            monthsShort: 'gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic'.split('_'),
            weekdays: 'Domenica_Lunedì_Martedì_Mercoledì_Giovedì_Venerdì_Sabato'.split('_'),
            weekdaysShort: 'Dom_Lun_Mar_Mer_Gio_Ven_Sab'.split('_'),
            weekdaysMin: 'D_L_Ma_Me_G_V_S'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd, D MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[Oggi alle] LT',
                nextDay: '[Domani alle] LT',
                nextWeek: 'dddd [alle] LT',
                lastDay: '[Ieri alle] LT',
                lastWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return '[la scorsa] dddd [alle] LT';
                        default:
                            return '[lo scorso] dddd [alle] LT';
                    }
                },
                sameElse: 'L'
            },
            relativeTime: {
                future: function (s) {
                    return ((/^[0-9].+$/).test(s) ? 'tra' : 'in') + ' ' + s;
                },
                past: '%s fa',
                s: 'alcuni secondi',
                m: 'un minuto',
                mm: '%d minuti',
                h: 'un\'ora',
                hh: '%d ore',
                d: 'un giorno',
                dd: '%d giorni',
                M: 'un mese',
                MM: '%d mesi',
                y: 'un anno',
                yy: '%d anni'
            },
            ordinalParse: /\d{1,2}º/,
            ordinal: '%dº',
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : japanese (ja)
    // author : LI Long : https://github.com/baryon

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('ja', {
            months: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
            monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
            weekdays: '日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日'.split('_'),
            weekdaysShort: '日_月_火_水_木_金_土'.split('_'),
            weekdaysMin: '日_月_火_水_木_金_土'.split('_'),
            longDateFormat: {
                LT: 'Ah時m分',
                LTS: 'LTs秒',
                L: 'YYYY/MM/DD',
                LL: 'YYYY年M月D日',
                LLL: 'YYYY年M月D日LT',
                LLLL: 'YYYY年M月D日LT dddd'
            },
            meridiemParse: /午前|午後/i,
            isPM: function (input) {
                return input === '午後';
            },
            meridiem: function (hour, minute, isLower) {
                if (hour < 12) {
                    return '午前';
                } else {
                    return '午後';
                }
            },
            calendar: {
                sameDay: '[今日] LT',
                nextDay: '[明日] LT',
                nextWeek: '[来週]dddd LT',
                lastDay: '[昨日] LT',
                lastWeek: '[前週]dddd LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: '%s後',
                past: '%s前',
                s: '数秒',
                m: '1分',
                mm: '%d分',
                h: '1時間',
                hh: '%d時間',
                d: '1日',
                dd: '%d日',
                M: '1ヶ月',
                MM: '%dヶ月',
                y: '1年',
                yy: '%d年'
            }
        });
    }));
    // moment.js locale configuration
    // locale : Georgian (ka)
    // author : Irakli Janiashvili : https://github.com/irakli-janiashvili

    (function (factory) {
        factory(moment);
    }(function (moment) {
        function monthsCaseReplace(m, format) {
            var months = {
                'nominative': 'იანვარი_თებერვალი_მარტი_აპრილი_მაისი_ივნისი_ივლისი_აგვისტო_სექტემბერი_ოქტომბერი_ნოემბერი_დეკემბერი'.split('_'),
                'accusative': 'იანვარს_თებერვალს_მარტს_აპრილის_მაისს_ივნისს_ივლისს_აგვისტს_სექტემბერს_ოქტომბერს_ნოემბერს_დეკემბერს'.split('_')
            },

                nounCase = (/D[oD] *MMMM?/).test(format) ?
                    'accusative' :
                    'nominative';

            return months[nounCase][m.month()];
        }

        function weekdaysCaseReplace(m, format) {
            var weekdays = {
                'nominative': 'კვირა_ორშაბათი_სამშაბათი_ოთხშაბათი_ხუთშაბათი_პარასკევი_შაბათი'.split('_'),
                'accusative': 'კვირას_ორშაბათს_სამშაბათს_ოთხშაბათს_ხუთშაბათს_პარასკევს_შაბათს'.split('_')
            },

                nounCase = (/(წინა|შემდეგ)/).test(format) ?
                    'accusative' :
                    'nominative';

            return weekdays[nounCase][m.day()];
        }

        return moment.defineLocale('ka', {
            months: monthsCaseReplace,
            monthsShort: 'იან_თებ_მარ_აპრ_მაი_ივნ_ივლ_აგვ_სექ_ოქტ_ნოე_დეკ'.split('_'),
            weekdays: weekdaysCaseReplace,
            weekdaysShort: 'კვი_ორშ_სამ_ოთხ_ხუთ_პარ_შაბ'.split('_'),
            weekdaysMin: 'კვ_ორ_სა_ოთ_ხუ_პა_შა'.split('_'),
            longDateFormat: {
                LT: 'h:mm A',
                LTS: 'h:mm:ss A',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd, D MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[დღეს] LT[-ზე]',
                nextDay: '[ხვალ] LT[-ზე]',
                lastDay: '[გუშინ] LT[-ზე]',
                nextWeek: '[შემდეგ] dddd LT[-ზე]',
                lastWeek: '[წინა] dddd LT-ზე',
                sameElse: 'L'
            },
            relativeTime: {
                future: function (s) {
                    return (/(წამი|წუთი|საათი|წელი)/).test(s) ?
                        s.replace(/ი$/, 'ში') :
                        s + 'ში';
                },
                past: function (s) {
                    if ((/(წამი|წუთი|საათი|დღე|თვე)/).test(s)) {
                        return s.replace(/(ი|ე)$/, 'ის წინ');
                    }
                    if ((/წელი/).test(s)) {
                        return s.replace(/წელი$/, 'წლის წინ');
                    }
                },
                s: 'რამდენიმე წამი',
                m: 'წუთი',
                mm: '%d წუთი',
                h: 'საათი',
                hh: '%d საათი',
                d: 'დღე',
                dd: '%d დღე',
                M: 'თვე',
                MM: '%d თვე',
                y: 'წელი',
                yy: '%d წელი'
            },
            ordinalParse: /0|1-ლი|მე-\d{1,2}|\d{1,2}-ე/,
            ordinal: function (number) {
                if (number === 0) {
                    return number;
                }

                if (number === 1) {
                    return number + '-ლი';
                }

                if ((number < 20) || (number <= 100 && (number % 20 === 0)) || (number % 100 === 0)) {
                    return 'მე-' + number;
                }

                return number + '-ე';
            },
            week: {
                dow: 1,
                doy: 7
            }
        });
    }));
    // moment.js locale configuration
    // locale : khmer (km)
    // author : Kruy Vanna : https://github.com/kruyvanna

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('km', {
            months: 'មករា_កុម្ភៈ_មិនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ'.split('_'),
            monthsShort: 'មករា_កុម្ភៈ_មិនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ'.split('_'),
            weekdays: 'អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍'.split('_'),
            weekdaysShort: 'អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍'.split('_'),
            weekdaysMin: 'អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd, D MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[ថ្ងៃនៈ ម៉ោង] LT',
                nextDay: '[ស្អែក ម៉ោង] LT',
                nextWeek: 'dddd [ម៉ោង] LT',
                lastDay: '[ម្សិលមិញ ម៉ោង] LT',
                lastWeek: 'dddd [សប្តាហ៍មុន] [ម៉ោង] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: '%sទៀត',
                past: '%sមុន',
                s: 'ប៉ុន្មានវិនាទី',
                m: 'មួយនាទី',
                mm: '%d នាទី',
                h: 'មួយម៉ោង',
                hh: '%d ម៉ោង',
                d: 'មួយថ្ងៃ',
                dd: '%d ថ្ងៃ',
                M: 'មួយខែ',
                MM: '%d ខែ',
                y: 'មួយឆ្នាំ',
                yy: '%d ឆ្នាំ'
            },
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4 // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : korean (ko)
    //
    // authors
    //
    // - Kyungwook, Park : https://github.com/kyungw00k
    // - Jeeeyul Lee <jeeeyul@gmail.com>
    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('ko', {
            months: '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split('_'),
            monthsShort: '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split('_'),
            weekdays: '일요일_월요일_화요일_수요일_목요일_금요일_토요일'.split('_'),
            weekdaysShort: '일_월_화_수_목_금_토'.split('_'),
            weekdaysMin: '일_월_화_수_목_금_토'.split('_'),
            longDateFormat: {
                LT: 'A h시 m분',
                LTS: 'A h시 m분 s초',
                L: 'YYYY.MM.DD',
                LL: 'YYYY년 MMMM D일',
                LLL: 'YYYY년 MMMM D일 LT',
                LLLL: 'YYYY년 MMMM D일 dddd LT'
            },
            calendar: {
                sameDay: '오늘 LT',
                nextDay: '내일 LT',
                nextWeek: 'dddd LT',
                lastDay: '어제 LT',
                lastWeek: '지난주 dddd LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: '%s 후',
                past: '%s 전',
                s: '몇초',
                ss: '%d초',
                m: '일분',
                mm: '%d분',
                h: '한시간',
                hh: '%d시간',
                d: '하루',
                dd: '%d일',
                M: '한달',
                MM: '%d달',
                y: '일년',
                yy: '%d년'
            },
            ordinalParse: /\d{1,2}일/,
            ordinal: '%d일',
            meridiemParse: /오전|오후/,
            isPM: function (token) {
                return token === '오후';
            },
            meridiem: function (hour, minute, isUpper) {
                return hour < 12 ? '오전' : '오후';
            }
        });
    }));
    // moment.js locale configuration
    // locale : Luxembourgish (lb)
    // author : mweimerskirch : https://github.com/mweimerskirch, David Raison : https://github.com/kwisatz

    // Note: Luxembourgish has a very particular phonological rule ('Eifeler Regel') that causes the
    // deletion of the final 'n' in certain contexts. That's what the 'eifelerRegelAppliesToWeekday'
    // and 'eifelerRegelAppliesToNumber' methods are meant for

    (function (factory) {
        factory(moment);
    }(function (moment) {
        function processRelativeTime(number, withoutSuffix, key, isFuture) {
            var format = {
                'm': ['eng Minutt', 'enger Minutt'],
                'h': ['eng Stonn', 'enger Stonn'],
                'd': ['een Dag', 'engem Dag'],
                'M': ['ee Mount', 'engem Mount'],
                'y': ['ee Joer', 'engem Joer']
            };
            return withoutSuffix ? format[key][0] : format[key][1];
        }

        function processFutureTime(string) {
            var number = string.substr(0, string.indexOf(' '));
            if (eifelerRegelAppliesToNumber(number)) {
                return 'a ' + string;
            }
            return 'an ' + string;
        }

        function processPastTime(string) {
            var number = string.substr(0, string.indexOf(' '));
            if (eifelerRegelAppliesToNumber(number)) {
                return 'viru ' + string;
            }
            return 'virun ' + string;
        }

        /**
         * Returns true if the word before the given number loses the '-n' ending.
         * e.g. 'an 10 Deeg' but 'a 5 Deeg'
         *
         * @param number {integer}
         * @returns {boolean}
         */
        function eifelerRegelAppliesToNumber(number) {
            number = parseInt(number, 10);
            if (isNaN(number)) {
                return false;
            }
            if (number < 0) {
                // Negative Number --> always true
                return true;
            } else if (number < 10) {
                // Only 1 digit
                if (4 <= number && number <= 7) {
                    return true;
                }
                return false;
            } else if (number < 100) {
                // 2 digits
                var lastDigit = number % 10, firstDigit = number / 10;
                if (lastDigit === 0) {
                    return eifelerRegelAppliesToNumber(firstDigit);
                }
                return eifelerRegelAppliesToNumber(lastDigit);
            } else if (number < 10000) {
                // 3 or 4 digits --> recursively check first digit
                while (number >= 10) {
                    number = number / 10;
                }
                return eifelerRegelAppliesToNumber(number);
            } else {
                // Anything larger than 4 digits: recursively check first n-3 digits
                number = number / 1000;
                return eifelerRegelAppliesToNumber(number);
            }
        }

        return moment.defineLocale('lb', {
            months: 'Januar_Februar_Mäerz_Abrëll_Mee_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
            monthsShort: 'Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
            weekdays: 'Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg'.split('_'),
            weekdaysShort: 'So._Mé._Dë._Më._Do._Fr._Sa.'.split('_'),
            weekdaysMin: 'So_Mé_Dë_Më_Do_Fr_Sa'.split('_'),
            longDateFormat: {
                LT: 'H:mm [Auer]',
                LTS: 'H:mm:ss [Auer]',
                L: 'DD.MM.YYYY',
                LL: 'D. MMMM YYYY',
                LLL: 'D. MMMM YYYY LT',
                LLLL: 'dddd, D. MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[Haut um] LT',
                sameElse: 'L',
                nextDay: '[Muer um] LT',
                nextWeek: 'dddd [um] LT',
                lastDay: '[Gëschter um] LT',
                lastWeek: function () {
                    // Different date string for 'Dënschdeg' (Tuesday) and 'Donneschdeg' (Thursday) due to phonological rule
                    switch (this.day()) {
                        case 2:
                        case 4:
                            return '[Leschten] dddd [um] LT';
                        default:
                            return '[Leschte] dddd [um] LT';
                    }
                }
            },
            relativeTime: {
                future: processFutureTime,
                past: processPastTime,
                s: 'e puer Sekonnen',
                m: processRelativeTime,
                mm: '%d Minutten',
                h: processRelativeTime,
                hh: '%d Stonnen',
                d: processRelativeTime,
                dd: '%d Deeg',
                M: processRelativeTime,
                MM: '%d Méint',
                y: processRelativeTime,
                yy: '%d Joer'
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: '%d.',
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : Lithuanian (lt)
    // author : Mindaugas Mozūras : https://github.com/mmozuras

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var units = {
            'm': 'minutė_minutės_minutę',
            'mm': 'minutės_minučių_minutes',
            'h': 'valanda_valandos_valandą',
            'hh': 'valandos_valandų_valandas',
            'd': 'diena_dienos_dieną',
            'dd': 'dienos_dienų_dienas',
            'M': 'mėnuo_mėnesio_mėnesį',
            'MM': 'mėnesiai_mėnesių_mėnesius',
            'y': 'metai_metų_metus',
            'yy': 'metai_metų_metus'
        },
            weekDays = 'sekmadienis_pirmadienis_antradienis_trečiadienis_ketvirtadienis_penktadienis_šeštadienis'.split('_');

        function translateSeconds(number, withoutSuffix, key, isFuture) {
            if (withoutSuffix) {
                return 'kelios sekundės';
            } else {
                return isFuture ? 'kelių sekundžių' : 'kelias sekundes';
            }
        }

        function translateSingular(number, withoutSuffix, key, isFuture) {
            return withoutSuffix ? forms(key)[0] : (isFuture ? forms(key)[1] : forms(key)[2]);
        }

        function special(number) {
            return number % 10 === 0 || (number > 10 && number < 20);
        }

        function forms(key) {
            return units[key].split('_');
        }

        function translate(number, withoutSuffix, key, isFuture) {
            var result = number + ' ';
            if (number === 1) {
                return result + translateSingular(number, withoutSuffix, key[0], isFuture);
            } else if (withoutSuffix) {
                return result + (special(number) ? forms(key)[1] : forms(key)[0]);
            } else {
                if (isFuture) {
                    return result + forms(key)[1];
                } else {
                    return result + (special(number) ? forms(key)[1] : forms(key)[2]);
                }
            }
        }

        function relativeWeekDay(moment, format) {
            var nominative = format.indexOf('dddd HH:mm') === -1,
                weekDay = weekDays[moment.day()];

            return nominative ? weekDay : weekDay.substring(0, weekDay.length - 2) + 'į';
        }

        return moment.defineLocale('lt', {
            months: 'sausio_vasario_kovo_balandžio_gegužės_birželio_liepos_rugpjūčio_rugsėjo_spalio_lapkričio_gruodžio'.split('_'),
            monthsShort: 'sau_vas_kov_bal_geg_bir_lie_rgp_rgs_spa_lap_grd'.split('_'),
            weekdays: relativeWeekDay,
            weekdaysShort: 'Sek_Pir_Ant_Tre_Ket_Pen_Šeš'.split('_'),
            weekdaysMin: 'S_P_A_T_K_Pn_Š'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'YYYY-MM-DD',
                LL: 'YYYY [m.] MMMM D [d.]',
                LLL: 'YYYY [m.] MMMM D [d.], LT [val.]',
                LLLL: 'YYYY [m.] MMMM D [d.], dddd, LT [val.]',
                l: 'YYYY-MM-DD',
                ll: 'YYYY [m.] MMMM D [d.]',
                lll: 'YYYY [m.] MMMM D [d.], LT [val.]',
                llll: 'YYYY [m.] MMMM D [d.], ddd, LT [val.]'
            },
            calendar: {
                sameDay: '[Šiandien] LT',
                nextDay: '[Rytoj] LT',
                nextWeek: 'dddd LT',
                lastDay: '[Vakar] LT',
                lastWeek: '[Praėjusį] dddd LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'po %s',
                past: 'prieš %s',
                s: translateSeconds,
                m: translateSingular,
                mm: translate,
                h: translateSingular,
                hh: translate,
                d: translateSingular,
                dd: translate,
                M: translateSingular,
                MM: translate,
                y: translateSingular,
                yy: translate
            },
            ordinalParse: /\d{1,2}-oji/,
            ordinal: function (number) {
                return number + '-oji';
            },
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : latvian (lv)
    // author : Kristaps Karlsons : https://github.com/skakri

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var units = {
            'mm': 'minūti_minūtes_minūte_minūtes',
            'hh': 'stundu_stundas_stunda_stundas',
            'dd': 'dienu_dienas_diena_dienas',
            'MM': 'mēnesi_mēnešus_mēnesis_mēneši',
            'yy': 'gadu_gadus_gads_gadi'
        };

        function format(word, number, withoutSuffix) {
            var forms = word.split('_');
            if (withoutSuffix) {
                return number % 10 === 1 && number !== 11 ? forms[2] : forms[3];
            } else {
                return number % 10 === 1 && number !== 11 ? forms[0] : forms[1];
            }
        }

        function relativeTimeWithPlural(number, withoutSuffix, key) {
            return number + ' ' + format(units[key], number, withoutSuffix);
        }

        return moment.defineLocale('lv', {
            months: 'janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris'.split('_'),
            monthsShort: 'jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec'.split('_'),
            weekdays: 'svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena'.split('_'),
            weekdaysShort: 'Sv_P_O_T_C_Pk_S'.split('_'),
            weekdaysMin: 'Sv_P_O_T_C_Pk_S'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD.MM.YYYY',
                LL: 'YYYY. [gada] D. MMMM',
                LLL: 'YYYY. [gada] D. MMMM, LT',
                LLLL: 'YYYY. [gada] D. MMMM, dddd, LT'
            },
            calendar: {
                sameDay: '[Šodien pulksten] LT',
                nextDay: '[Rīt pulksten] LT',
                nextWeek: 'dddd [pulksten] LT',
                lastDay: '[Vakar pulksten] LT',
                lastWeek: '[Pagājušā] dddd [pulksten] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: '%s vēlāk',
                past: '%s agrāk',
                s: 'dažas sekundes',
                m: 'minūti',
                mm: relativeTimeWithPlural,
                h: 'stundu',
                hh: relativeTimeWithPlural,
                d: 'dienu',
                dd: relativeTimeWithPlural,
                M: 'mēnesi',
                MM: relativeTimeWithPlural,
                y: 'gadu',
                yy: relativeTimeWithPlural
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: '%d.',
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : macedonian (mk)
    // author : Borislav Mickov : https://github.com/B0k0

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('mk', {
            months: 'јануари_февруари_март_април_мај_јуни_јули_август_септември_октомври_ноември_декември'.split('_'),
            monthsShort: 'јан_фев_мар_апр_мај_јун_јул_авг_сеп_окт_ное_дек'.split('_'),
            weekdays: 'недела_понеделник_вторник_среда_четврток_петок_сабота'.split('_'),
            weekdaysShort: 'нед_пон_вто_сре_чет_пет_саб'.split('_'),
            weekdaysMin: 'нe_пo_вт_ср_че_пе_сa'.split('_'),
            longDateFormat: {
                LT: 'H:mm',
                LTS: 'LT:ss',
                L: 'D.MM.YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd, D MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[Денес во] LT',
                nextDay: '[Утре во] LT',
                nextWeek: 'dddd [во] LT',
                lastDay: '[Вчера во] LT',
                lastWeek: function () {
                    switch (this.day()) {
                        case 0:
                        case 3:
                        case 6:
                            return '[Во изминатата] dddd [во] LT';
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return '[Во изминатиот] dddd [во] LT';
                    }
                },
                sameElse: 'L'
            },
            relativeTime: {
                future: 'после %s',
                past: 'пред %s',
                s: 'неколку секунди',
                m: 'минута',
                mm: '%d минути',
                h: 'час',
                hh: '%d часа',
                d: 'ден',
                dd: '%d дена',
                M: 'месец',
                MM: '%d месеци',
                y: 'година',
                yy: '%d години'
            },
            ordinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
            ordinal: function (number) {
                var lastDigit = number % 10,
                    last2Digits = number % 100;
                if (number === 0) {
                    return number + '-ев';
                } else if (last2Digits === 0) {
                    return number + '-ен';
                } else if (last2Digits > 10 && last2Digits < 20) {
                    return number + '-ти';
                } else if (lastDigit === 1) {
                    return number + '-ви';
                } else if (lastDigit === 2) {
                    return number + '-ри';
                } else if (lastDigit === 7 || lastDigit === 8) {
                    return number + '-ми';
                } else {
                    return number + '-ти';
                }
            },
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : malayalam (ml)
    // author : Floyd Pink : https://github.com/floydpink

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('ml', {
            months: 'ജനുവരി_ഫെബ്രുവരി_മാർച്ച്_ഏപ്രിൽ_മേയ്_ജൂൺ_ജൂലൈ_ഓഗസ്റ്റ്_സെപ്റ്റംബർ_ഒക്ടോബർ_നവംബർ_ഡിസംബർ'.split('_'),
            monthsShort: 'ജനു._ഫെബ്രു._മാർ._ഏപ്രി._മേയ്_ജൂൺ_ജൂലൈ._ഓഗ._സെപ്റ്റ._ഒക്ടോ._നവം._ഡിസം.'.split('_'),
            weekdays: 'ഞായറാഴ്ച_തിങ്കളാഴ്ച_ചൊവ്വാഴ്ച_ബുധനാഴ്ച_വ്യാഴാഴ്ച_വെള്ളിയാഴ്ച_ശനിയാഴ്ച'.split('_'),
            weekdaysShort: 'ഞായർ_തിങ്കൾ_ചൊവ്വ_ബുധൻ_വ്യാഴം_വെള്ളി_ശനി'.split('_'),
            weekdaysMin: 'ഞാ_തി_ചൊ_ബു_വ്യാ_വെ_ശ'.split('_'),
            longDateFormat: {
                LT: 'A h:mm -നു',
                LTS: 'A h:mm:ss -നു',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY, LT',
                LLLL: 'dddd, D MMMM YYYY, LT'
            },
            calendar: {
                sameDay: '[ഇന്ന്] LT',
                nextDay: '[നാളെ] LT',
                nextWeek: 'dddd, LT',
                lastDay: '[ഇന്നലെ] LT',
                lastWeek: '[കഴിഞ്ഞ] dddd, LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: '%s കഴിഞ്ഞ്',
                past: '%s മുൻപ്',
                s: 'അൽപ നിമിഷങ്ങൾ',
                m: 'ഒരു മിനിറ്റ്',
                mm: '%d മിനിറ്റ്',
                h: 'ഒരു മണിക്കൂർ',
                hh: '%d മണിക്കൂർ',
                d: 'ഒരു ദിവസം',
                dd: '%d ദിവസം',
                M: 'ഒരു മാസം',
                MM: '%d മാസം',
                y: 'ഒരു വർഷം',
                yy: '%d വർഷം'
            },
            meridiemParse: /രാത്രി|രാവിലെ|ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി/i,
            isPM: function (input) {
                return /^(ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി)$/.test(input);
            },
            meridiem: function (hour, minute, isLower) {
                if (hour < 4) {
                    return 'രാത്രി';
                } else if (hour < 12) {
                    return 'രാവിലെ';
                } else if (hour < 17) {
                    return 'ഉച്ച കഴിഞ്ഞ്';
                } else if (hour < 20) {
                    return 'വൈകുന്നേരം';
                } else {
                    return 'രാത്രി';
                }
            }
        });
    }));
    // moment.js locale configuration
    // locale : Marathi (mr)
    // author : Harshad Kale : https://github.com/kalehv

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var symbolMap = {
            '1': '१',
            '2': '२',
            '3': '३',
            '4': '४',
            '5': '५',
            '6': '६',
            '7': '७',
            '8': '८',
            '9': '९',
            '0': '०'
        },
            numberMap = {
                '१': '1',
                '२': '2',
                '३': '3',
                '४': '4',
                '५': '5',
                '६': '6',
                '७': '7',
                '८': '8',
                '९': '9',
                '०': '0'
            };

        return moment.defineLocale('mr', {
            months: 'जानेवारी_फेब्रुवारी_मार्च_एप्रिल_मे_जून_जुलै_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर'.split('_'),
            monthsShort: 'जाने._फेब्रु._मार्च._एप्रि._मे._जून._जुलै._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.'.split('_'),
            weekdays: 'रविवार_सोमवार_मंगळवार_बुधवार_गुरूवार_शुक्रवार_शनिवार'.split('_'),
            weekdaysShort: 'रवि_सोम_मंगळ_बुध_गुरू_शुक्र_शनि'.split('_'),
            weekdaysMin: 'र_सो_मं_बु_गु_शु_श'.split('_'),
            longDateFormat: {
                LT: 'A h:mm वाजता',
                LTS: 'A h:mm:ss वाजता',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY, LT',
                LLLL: 'dddd, D MMMM YYYY, LT'
            },
            calendar: {
                sameDay: '[आज] LT',
                nextDay: '[उद्या] LT',
                nextWeek: 'dddd, LT',
                lastDay: '[काल] LT',
                lastWeek: '[मागील] dddd, LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: '%s नंतर',
                past: '%s पूर्वी',
                s: 'सेकंद',
                m: 'एक मिनिट',
                mm: '%d मिनिटे',
                h: 'एक तास',
                hh: '%d तास',
                d: 'एक दिवस',
                dd: '%d दिवस',
                M: 'एक महिना',
                MM: '%d महिने',
                y: 'एक वर्ष',
                yy: '%d वर्षे'
            },
            preparse: function (string) {
                return string.replace(/[१२३४५६७८९०]/g, function (match) {
                    return numberMap[match];
                });
            },
            postformat: function (string) {
                return string.replace(/\d/g, function (match) {
                    return symbolMap[match];
                });
            },
            meridiemParse: /रात्री|सकाळी|दुपारी|सायंकाळी/,
            meridiemHour: function (hour, meridiem) {
                if (hour === 12) {
                    hour = 0;
                }
                if (meridiem === 'रात्री') {
                    return hour < 4 ? hour : hour + 12;
                } else if (meridiem === 'सकाळी') {
                    return hour;
                } else if (meridiem === 'दुपारी') {
                    return hour >= 10 ? hour : hour + 12;
                } else if (meridiem === 'सायंकाळी') {
                    return hour + 12;
                }
            },
            meridiem: function (hour, minute, isLower) {
                if (hour < 4) {
                    return 'रात्री';
                } else if (hour < 10) {
                    return 'सकाळी';
                } else if (hour < 17) {
                    return 'दुपारी';
                } else if (hour < 20) {
                    return 'सायंकाळी';
                } else {
                    return 'रात्री';
                }
            },
            week: {
                dow: 0, // Sunday is the first day of the week.
                doy: 6  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : Bahasa Malaysia (ms-MY)
    // author : Weldan Jamili : https://github.com/weldan

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('ms-my', {
            months: 'Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember'.split('_'),
            monthsShort: 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis'.split('_'),
            weekdays: 'Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu'.split('_'),
            weekdaysShort: 'Ahd_Isn_Sel_Rab_Kha_Jum_Sab'.split('_'),
            weekdaysMin: 'Ah_Is_Sl_Rb_Km_Jm_Sb'.split('_'),
            longDateFormat: {
                LT: 'HH.mm',
                LTS: 'LT.ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY [pukul] LT',
                LLLL: 'dddd, D MMMM YYYY [pukul] LT'
            },
            meridiemParse: /pagi|tengahari|petang|malam/,
            meridiemHour: function (hour, meridiem) {
                if (hour === 12) {
                    hour = 0;
                }
                if (meridiem === 'pagi') {
                    return hour;
                } else if (meridiem === 'tengahari') {
                    return hour >= 11 ? hour : hour + 12;
                } else if (meridiem === 'petang' || meridiem === 'malam') {
                    return hour + 12;
                }
            },
            meridiem: function (hours, minutes, isLower) {
                if (hours < 11) {
                    return 'pagi';
                } else if (hours < 15) {
                    return 'tengahari';
                } else if (hours < 19) {
                    return 'petang';
                } else {
                    return 'malam';
                }
            },
            calendar: {
                sameDay: '[Hari ini pukul] LT',
                nextDay: '[Esok pukul] LT',
                nextWeek: 'dddd [pukul] LT',
                lastDay: '[Kelmarin pukul] LT',
                lastWeek: 'dddd [lepas pukul] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'dalam %s',
                past: '%s yang lepas',
                s: 'beberapa saat',
                m: 'seminit',
                mm: '%d minit',
                h: 'sejam',
                hh: '%d jam',
                d: 'sehari',
                dd: '%d hari',
                M: 'sebulan',
                MM: '%d bulan',
                y: 'setahun',
                yy: '%d tahun'
            },
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : Burmese (my)
    // author : Squar team, mysquar.com

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var symbolMap = {
            '1': '၁',
            '2': '၂',
            '3': '၃',
            '4': '၄',
            '5': '၅',
            '6': '၆',
            '7': '၇',
            '8': '၈',
            '9': '၉',
            '0': '၀'
        }, numberMap = {
            '၁': '1',
            '၂': '2',
            '၃': '3',
            '၄': '4',
            '၅': '5',
            '၆': '6',
            '၇': '7',
            '၈': '8',
            '၉': '9',
            '၀': '0'
        };
        return moment.defineLocale('my', {
            months: 'ဇန်နဝါရီ_ဖေဖော်ဝါရီ_မတ်_ဧပြီ_မေ_ဇွန်_ဇူလိုင်_သြဂုတ်_စက်တင်ဘာ_အောက်တိုဘာ_နိုဝင်ဘာ_ဒီဇင်ဘာ'.split('_'),
            monthsShort: 'ဇန်_ဖေ_မတ်_ပြီ_မေ_ဇွန်_လိုင်_သြ_စက်_အောက်_နို_ဒီ'.split('_'),
            weekdays: 'တနင်္ဂနွေ_တနင်္လာ_အင်္ဂါ_ဗုဒ္ဓဟူး_ကြာသပတေး_သောကြာ_စနေ'.split('_'),
            weekdaysShort: 'နွေ_လာ_င်္ဂါ_ဟူး_ကြာ_သော_နေ'.split('_'),
            weekdaysMin: 'နွေ_လာ_င်္ဂါ_ဟူး_ကြာ_သော_နေ'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'HH:mm:ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd D MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[ယနေ.] LT [မှာ]',
                nextDay: '[မနက်ဖြန်] LT [မှာ]',
                nextWeek: 'dddd LT [မှာ]',
                lastDay: '[မနေ.က] LT [မှာ]',
                lastWeek: '[ပြီးခဲ့သော] dddd LT [မှာ]',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'လာမည့် %s မှာ',
                past: 'လွန်ခဲ့သော %s က',
                s: 'စက္ကန်.အနည်းငယ်',
                m: 'တစ်မိနစ်',
                mm: '%d မိနစ်',
                h: 'တစ်နာရီ',
                hh: '%d နာရီ',
                d: 'တစ်ရက်',
                dd: '%d ရက်',
                M: 'တစ်လ',
                MM: '%d လ',
                y: 'တစ်နှစ်',
                yy: '%d နှစ်'
            },
            preparse: function (string) {
                return string.replace(/[၁၂၃၄၅၆၇၈၉၀]/g, function (match) {
                    return numberMap[match];
                });
            },
            postformat: function (string) {
                return string.replace(/\d/g, function (match) {
                    return symbolMap[match];
                });
            },
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4 // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : norwegian bokmål (nb)
    // authors : Espen Hovlandsdal : https://github.com/rexxars
    //           Sigurd Gartmann : https://github.com/sigurdga

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('nb', {
            months: 'januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
            monthsShort: 'jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_'),
            weekdays: 'søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag'.split('_'),
            weekdaysShort: 'søn_man_tirs_ons_tors_fre_lør'.split('_'),
            weekdaysMin: 'sø_ma_ti_on_to_fr_lø'.split('_'),
            longDateFormat: {
                LT: 'H.mm',
                LTS: 'LT.ss',
                L: 'DD.MM.YYYY',
                LL: 'D. MMMM YYYY',
                LLL: 'D. MMMM YYYY [kl.] LT',
                LLLL: 'dddd D. MMMM YYYY [kl.] LT'
            },
            calendar: {
                sameDay: '[i dag kl.] LT',
                nextDay: '[i morgen kl.] LT',
                nextWeek: 'dddd [kl.] LT',
                lastDay: '[i går kl.] LT',
                lastWeek: '[forrige] dddd [kl.] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'om %s',
                past: 'for %s siden',
                s: 'noen sekunder',
                m: 'ett minutt',
                mm: '%d minutter',
                h: 'en time',
                hh: '%d timer',
                d: 'en dag',
                dd: '%d dager',
                M: 'en måned',
                MM: '%d måneder',
                y: 'ett år',
                yy: '%d år'
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: '%d.',
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : nepali/nepalese
    // author : suvash : https://github.com/suvash

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var symbolMap = {
            '1': '१',
            '2': '२',
            '3': '३',
            '4': '४',
            '5': '५',
            '6': '६',
            '7': '७',
            '8': '८',
            '9': '९',
            '0': '०'
        },
            numberMap = {
                '१': '1',
                '२': '2',
                '३': '3',
                '४': '4',
                '५': '5',
                '६': '6',
                '७': '7',
                '८': '8',
                '९': '9',
                '०': '0'
            };

        return moment.defineLocale('ne', {
            months: 'जनवरी_फेब्रुवरी_मार्च_अप्रिल_मई_जुन_जुलाई_अगष्ट_सेप्टेम्बर_अक्टोबर_नोभेम्बर_डिसेम्बर'.split('_'),
            monthsShort: 'जन._फेब्रु._मार्च_अप्रि._मई_जुन_जुलाई._अग._सेप्ट._अक्टो._नोभे._डिसे.'.split('_'),
            weekdays: 'आइतबार_सोमबार_मङ्गलबार_बुधबार_बिहिबार_शुक्रबार_शनिबार'.split('_'),
            weekdaysShort: 'आइत._सोम._मङ्गल._बुध._बिहि._शुक्र._शनि.'.split('_'),
            weekdaysMin: 'आइ._सो._मङ्_बु._बि._शु._श.'.split('_'),
            longDateFormat: {
                LT: 'Aको h:mm बजे',
                LTS: 'Aको h:mm:ss बजे',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY, LT',
                LLLL: 'dddd, D MMMM YYYY, LT'
            },
            preparse: function (string) {
                return string.replace(/[१२३४५६७८९०]/g, function (match) {
                    return numberMap[match];
                });
            },
            postformat: function (string) {
                return string.replace(/\d/g, function (match) {
                    return symbolMap[match];
                });
            },
            meridiemParse: /राती|बिहान|दिउँसो|बेलुका|साँझ|राती/,
            meridiemHour: function (hour, meridiem) {
                if (hour === 12) {
                    hour = 0;
                }
                if (meridiem === 'राती') {
                    return hour < 3 ? hour : hour + 12;
                } else if (meridiem === 'बिहान') {
                    return hour;
                } else if (meridiem === 'दिउँसो') {
                    return hour >= 10 ? hour : hour + 12;
                } else if (meridiem === 'बेलुका' || meridiem === 'साँझ') {
                    return hour + 12;
                }
            },
            meridiem: function (hour, minute, isLower) {
                if (hour < 3) {
                    return 'राती';
                } else if (hour < 10) {
                    return 'बिहान';
                } else if (hour < 15) {
                    return 'दिउँसो';
                } else if (hour < 18) {
                    return 'बेलुका';
                } else if (hour < 20) {
                    return 'साँझ';
                } else {
                    return 'राती';
                }
            },
            calendar: {
                sameDay: '[आज] LT',
                nextDay: '[भोली] LT',
                nextWeek: '[आउँदो] dddd[,] LT',
                lastDay: '[हिजो] LT',
                lastWeek: '[गएको] dddd[,] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: '%sमा',
                past: '%s अगाडी',
                s: 'केही समय',
                m: 'एक मिनेट',
                mm: '%d मिनेट',
                h: 'एक घण्टा',
                hh: '%d घण्टा',
                d: 'एक दिन',
                dd: '%d दिन',
                M: 'एक महिना',
                MM: '%d महिना',
                y: 'एक बर्ष',
                yy: '%d बर्ष'
            },
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : dutch (nl)
    // author : Joris Röling : https://github.com/jjupiter

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var monthsShortWithDots = 'jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.'.split('_'),
            monthsShortWithoutDots = 'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_');

        return moment.defineLocale('nl', {
            months: 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split('_'),
            monthsShort: function (m, format) {
                if (/-MMM-/.test(format)) {
                    return monthsShortWithoutDots[m.month()];
                } else {
                    return monthsShortWithDots[m.month()];
                }
            },
            weekdays: 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
            weekdaysShort: 'zo._ma._di._wo._do._vr._za.'.split('_'),
            weekdaysMin: 'Zo_Ma_Di_Wo_Do_Vr_Za'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD-MM-YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd D MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[vandaag om] LT',
                nextDay: '[morgen om] LT',
                nextWeek: 'dddd [om] LT',
                lastDay: '[gisteren om] LT',
                lastWeek: '[afgelopen] dddd [om] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'over %s',
                past: '%s geleden',
                s: 'een paar seconden',
                m: 'één minuut',
                mm: '%d minuten',
                h: 'één uur',
                hh: '%d uur',
                d: 'één dag',
                dd: '%d dagen',
                M: 'één maand',
                MM: '%d maanden',
                y: 'één jaar',
                yy: '%d jaar'
            },
            ordinalParse: /\d{1,2}(ste|de)/,
            ordinal: function (number) {
                return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
            },
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : norwegian nynorsk (nn)
    // author : https://github.com/mechuwind

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('nn', {
            months: 'januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
            monthsShort: 'jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_'),
            weekdays: 'sundag_måndag_tysdag_onsdag_torsdag_fredag_laurdag'.split('_'),
            weekdaysShort: 'sun_mån_tys_ons_tor_fre_lau'.split('_'),
            weekdaysMin: 'su_må_ty_on_to_fr_lø'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD.MM.YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd D MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[I dag klokka] LT',
                nextDay: '[I morgon klokka] LT',
                nextWeek: 'dddd [klokka] LT',
                lastDay: '[I går klokka] LT',
                lastWeek: '[Føregåande] dddd [klokka] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'om %s',
                past: 'for %s sidan',
                s: 'nokre sekund',
                m: 'eit minutt',
                mm: '%d minutt',
                h: 'ein time',
                hh: '%d timar',
                d: 'ein dag',
                dd: '%d dagar',
                M: 'ein månad',
                MM: '%d månader',
                y: 'eit år',
                yy: '%d år'
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: '%d.',
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : polish (pl)
    // author : Rafal Hirsz : https://github.com/evoL

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var monthsNominative = 'styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień'.split('_'),
            monthsSubjective = 'stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia'.split('_');

        function plural(n) {
            return (n % 10 < 5) && (n % 10 > 1) && ((~~(n / 10) % 10) !== 1);
        }

        function translate(number, withoutSuffix, key) {
            var result = number + ' ';
            switch (key) {
                case 'm':
                    return withoutSuffix ? 'minuta' : 'minutę';
                case 'mm':
                    return result + (plural(number) ? 'minuty' : 'minut');
                case 'h':
                    return withoutSuffix ? 'godzina' : 'godzinę';
                case 'hh':
                    return result + (plural(number) ? 'godziny' : 'godzin');
                case 'MM':
                    return result + (plural(number) ? 'miesiące' : 'miesięcy');
                case 'yy':
                    return result + (plural(number) ? 'lata' : 'lat');
            }
        }

        return moment.defineLocale('pl', {
            months: function (momentToFormat, format) {
                if (/D MMMM/.test(format)) {
                    return monthsSubjective[momentToFormat.month()];
                } else {
                    return monthsNominative[momentToFormat.month()];
                }
            },
            monthsShort: 'sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru'.split('_'),
            weekdays: 'niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota'.split('_'),
            weekdaysShort: 'nie_pon_wt_śr_czw_pt_sb'.split('_'),
            weekdaysMin: 'N_Pn_Wt_Śr_Cz_Pt_So'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD.MM.YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd, D MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[Dziś o] LT',
                nextDay: '[Jutro o] LT',
                nextWeek: '[W] dddd [o] LT',
                lastDay: '[Wczoraj o] LT',
                lastWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return '[W zeszłą niedzielę o] LT';
                        case 3:
                            return '[W zeszłą środę o] LT';
                        case 6:
                            return '[W zeszłą sobotę o] LT';
                        default:
                            return '[W zeszły] dddd [o] LT';
                    }
                },
                sameElse: 'L'
            },
            relativeTime: {
                future: 'za %s',
                past: '%s temu',
                s: 'kilka sekund',
                m: translate,
                mm: translate,
                h: translate,
                hh: translate,
                d: '1 dzień',
                dd: '%d dni',
                M: 'miesiąc',
                MM: translate,
                y: 'rok',
                yy: translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: '%d.',
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : brazilian portuguese (pt-br)
    // author : Caio Ribeiro Pereira : https://github.com/caio-ribeiro-pereira

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('pt-br', {
            months: 'janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro'.split('_'),
            monthsShort: 'jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez'.split('_'),
            weekdays: 'domingo_segunda-feira_terça-feira_quarta-feira_quinta-feira_sexta-feira_sábado'.split('_'),
            weekdaysShort: 'dom_seg_ter_qua_qui_sex_sáb'.split('_'),
            weekdaysMin: 'dom_2ª_3ª_4ª_5ª_6ª_sáb'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD/MM/YYYY',
                LL: 'D [de] MMMM [de] YYYY',
                LLL: 'D [de] MMMM [de] YYYY [às] LT',
                LLLL: 'dddd, D [de] MMMM [de] YYYY [às] LT'
            },
            calendar: {
                sameDay: '[Hoje às] LT',
                nextDay: '[Amanhã às] LT',
                nextWeek: 'dddd [às] LT',
                lastDay: '[Ontem às] LT',
                lastWeek: function () {
                    return (this.day() === 0 || this.day() === 6) ?
                        '[Último] dddd [às] LT' : // Saturday + Sunday
                        '[Última] dddd [às] LT'; // Monday - Friday
                },
                sameElse: 'L'
            },
            relativeTime: {
                future: 'em %s',
                past: '%s atrás',
                s: 'segundos',
                m: 'um minuto',
                mm: '%d minutos',
                h: 'uma hora',
                hh: '%d horas',
                d: 'um dia',
                dd: '%d dias',
                M: 'um mês',
                MM: '%d meses',
                y: 'um ano',
                yy: '%d anos'
            },
            ordinalParse: /\d{1,2}º/,
            ordinal: '%dº'
        });
    }));
    // moment.js locale configuration
    // locale : portuguese (pt)
    // author : Jefferson : https://github.com/jalex79

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('pt', {
            months: 'janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro'.split('_'),
            monthsShort: 'jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez'.split('_'),
            weekdays: 'domingo_segunda-feira_terça-feira_quarta-feira_quinta-feira_sexta-feira_sábado'.split('_'),
            weekdaysShort: 'dom_seg_ter_qua_qui_sex_sáb'.split('_'),
            weekdaysMin: 'dom_2ª_3ª_4ª_5ª_6ª_sáb'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD/MM/YYYY',
                LL: 'D [de] MMMM [de] YYYY',
                LLL: 'D [de] MMMM [de] YYYY LT',
                LLLL: 'dddd, D [de] MMMM [de] YYYY LT'
            },
            calendar: {
                sameDay: '[Hoje às] LT',
                nextDay: '[Amanhã às] LT',
                nextWeek: 'dddd [às] LT',
                lastDay: '[Ontem às] LT',
                lastWeek: function () {
                    return (this.day() === 0 || this.day() === 6) ?
                        '[Último] dddd [às] LT' : // Saturday + Sunday
                        '[Última] dddd [às] LT'; // Monday - Friday
                },
                sameElse: 'L'
            },
            relativeTime: {
                future: 'em %s',
                past: 'há %s',
                s: 'segundos',
                m: 'um minuto',
                mm: '%d minutos',
                h: 'uma hora',
                hh: '%d horas',
                d: 'um dia',
                dd: '%d dias',
                M: 'um mês',
                MM: '%d meses',
                y: 'um ano',
                yy: '%d anos'
            },
            ordinalParse: /\d{1,2}º/,
            ordinal: '%dº',
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : romanian (ro)
    // author : Vlad Gurdiga : https://github.com/gurdiga
    // author : Valentin Agachi : https://github.com/avaly

    (function (factory) {
        factory(moment);
    }(function (moment) {
        function relativeTimeWithPlural(number, withoutSuffix, key) {
            var format = {
                'mm': 'minute',
                'hh': 'ore',
                'dd': 'zile',
                'MM': 'luni',
                'yy': 'ani'
            },
                separator = ' ';
            if (number % 100 >= 20 || (number >= 100 && number % 100 === 0)) {
                separator = ' de ';
            }

            return number + separator + format[key];
        }

        return moment.defineLocale('ro', {
            months: 'ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie'.split('_'),
            monthsShort: 'ian._febr._mart._apr._mai_iun._iul._aug._sept._oct._nov._dec.'.split('_'),
            weekdays: 'duminică_luni_marți_miercuri_joi_vineri_sâmbătă'.split('_'),
            weekdaysShort: 'Dum_Lun_Mar_Mie_Joi_Vin_Sâm'.split('_'),
            weekdaysMin: 'Du_Lu_Ma_Mi_Jo_Vi_Sâ'.split('_'),
            longDateFormat: {
                LT: 'H:mm',
                LTS: 'LT:ss',
                L: 'DD.MM.YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY H:mm',
                LLLL: 'dddd, D MMMM YYYY H:mm'
            },
            calendar: {
                sameDay: '[azi la] LT',
                nextDay: '[mâine la] LT',
                nextWeek: 'dddd [la] LT',
                lastDay: '[ieri la] LT',
                lastWeek: '[fosta] dddd [la] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'peste %s',
                past: '%s în urmă',
                s: 'câteva secunde',
                m: 'un minut',
                mm: relativeTimeWithPlural,
                h: 'o oră',
                hh: relativeTimeWithPlural,
                d: 'o zi',
                dd: relativeTimeWithPlural,
                M: 'o lună',
                MM: relativeTimeWithPlural,
                y: 'un an',
                yy: relativeTimeWithPlural
            },
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : russian (ru)
    // author : Viktorminator : https://github.com/Viktorminator
    // Author : Menelion Elensúle : https://github.com/Oire

    (function (factory) {
        factory(moment);
    }(function (moment) {
        function plural(word, num) {
            var forms = word.split('_');
            return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
        }

        function relativeTimeWithPlural(number, withoutSuffix, key) {
            var format = {
                'mm': withoutSuffix ? 'минута_минуты_минут' : 'минуту_минуты_минут',
                'hh': 'час_часа_часов',
                'dd': 'день_дня_дней',
                'MM': 'месяц_месяца_месяцев',
                'yy': 'год_года_лет'
            };
            if (key === 'm') {
                return withoutSuffix ? 'минута' : 'минуту';
            }
            else {
                return number + ' ' + plural(format[key], +number);
            }
        }

        function monthsCaseReplace(m, format) {
            var months = {
                'nominative': 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_'),
                'accusative': 'января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря'.split('_')
            },

                nounCase = (/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/).test(format) ?
                    'accusative' :
                    'nominative';

            return months[nounCase][m.month()];
        }

        function monthsShortCaseReplace(m, format) {
            var monthsShort = {
                'nominative': 'янв_фев_март_апр_май_июнь_июль_авг_сен_окт_ноя_дек'.split('_'),
                'accusative': 'янв_фев_мар_апр_мая_июня_июля_авг_сен_окт_ноя_дек'.split('_')
            },

                nounCase = (/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/).test(format) ?
                    'accusative' :
                    'nominative';

            return monthsShort[nounCase][m.month()];
        }

        function weekdaysCaseReplace(m, format) {
            var weekdays = {
                'nominative': 'воскресенье_понедельник_вторник_среда_четверг_пятница_суббота'.split('_'),
                'accusative': 'воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу'.split('_')
            },

                nounCase = (/\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/).test(format) ?
                    'accusative' :
                    'nominative';

            return weekdays[nounCase][m.day()];
        }

        return moment.defineLocale('ru', {
            months: monthsCaseReplace,
            monthsShort: monthsShortCaseReplace,
            weekdays: weekdaysCaseReplace,
            weekdaysShort: 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
            weekdaysMin: 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
            monthsParse: [/^янв/i, /^фев/i, /^мар/i, /^апр/i, /^ма[й|я]/i, /^июн/i, /^июл/i, /^авг/i, /^сен/i, /^окт/i, /^ноя/i, /^дек/i],
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD.MM.YYYY',
                LL: 'D MMMM YYYY г.',
                LLL: 'D MMMM YYYY г., LT',
                LLLL: 'dddd, D MMMM YYYY г., LT'
            },
            calendar: {
                sameDay: '[Сегодня в] LT',
                nextDay: '[Завтра в] LT',
                lastDay: '[Вчера в] LT',
                nextWeek: function () {
                    return this.day() === 2 ? '[Во] dddd [в] LT' : '[В] dddd [в] LT';
                },
                lastWeek: function (now) {
                    if (now.week() !== this.week()) {
                        switch (this.day()) {
                            case 0:
                                return '[В прошлое] dddd [в] LT';
                            case 1:
                            case 2:
                            case 4:
                                return '[В прошлый] dddd [в] LT';
                            case 3:
                            case 5:
                            case 6:
                                return '[В прошлую] dddd [в] LT';
                        }
                    } else {
                        if (this.day() === 2) {
                            return '[Во] dddd [в] LT';
                        } else {
                            return '[В] dddd [в] LT';
                        }
                    }
                },
                sameElse: 'L'
            },
            relativeTime: {
                future: 'через %s',
                past: '%s назад',
                s: 'несколько секунд',
                m: relativeTimeWithPlural,
                mm: relativeTimeWithPlural,
                h: 'час',
                hh: relativeTimeWithPlural,
                d: 'день',
                dd: relativeTimeWithPlural,
                M: 'месяц',
                MM: relativeTimeWithPlural,
                y: 'год',
                yy: relativeTimeWithPlural
            },

            meridiemParse: /ночи|утра|дня|вечера/i,
            isPM: function (input) {
                return /^(дня|вечера)$/.test(input);
            },

            meridiem: function (hour, minute, isLower) {
                if (hour < 4) {
                    return 'ночи';
                } else if (hour < 12) {
                    return 'утра';
                } else if (hour < 17) {
                    return 'дня';
                } else {
                    return 'вечера';
                }
            },

            ordinalParse: /\d{1,2}-(й|го|я)/,
            ordinal: function (number, period) {
                switch (period) {
                    case 'M':
                    case 'd':
                    case 'DDD':
                        return number + '-й';
                    case 'D':
                        return number + '-го';
                    case 'w':
                    case 'W':
                        return number + '-я';
                    default:
                        return number;
                }
            },

            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : slovak (sk)
    // author : Martin Minka : https://github.com/k2s
    // based on work of petrbela : https://github.com/petrbela

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var months = 'január_február_marec_apríl_máj_jún_júl_august_september_október_november_december'.split('_'),
            monthsShort = 'jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec'.split('_');

        function plural(n) {
            return (n > 1) && (n < 5);
        }

        function translate(number, withoutSuffix, key, isFuture) {
            var result = number + ' ';
            switch (key) {
                case 's':  // a few seconds / in a few seconds / a few seconds ago
                    return (withoutSuffix || isFuture) ? 'pár sekúnd' : 'pár sekundami';
                case 'm':  // a minute / in a minute / a minute ago
                    return withoutSuffix ? 'minúta' : (isFuture ? 'minútu' : 'minútou');
                case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
                    if (withoutSuffix || isFuture) {
                        return result + (plural(number) ? 'minúty' : 'minút');
                    } else {
                        return result + 'minútami';
                    }
                    break;
                case 'h':  // an hour / in an hour / an hour ago
                    return withoutSuffix ? 'hodina' : (isFuture ? 'hodinu' : 'hodinou');
                case 'hh': // 9 hours / in 9 hours / 9 hours ago
                    if (withoutSuffix || isFuture) {
                        return result + (plural(number) ? 'hodiny' : 'hodín');
                    } else {
                        return result + 'hodinami';
                    }
                    break;
                case 'd':  // a day / in a day / a day ago
                    return (withoutSuffix || isFuture) ? 'deň' : 'dňom';
                case 'dd': // 9 days / in 9 days / 9 days ago
                    if (withoutSuffix || isFuture) {
                        return result + (plural(number) ? 'dni' : 'dní');
                    } else {
                        return result + 'dňami';
                    }
                    break;
                case 'M':  // a month / in a month / a month ago
                    return (withoutSuffix || isFuture) ? 'mesiac' : 'mesiacom';
                case 'MM': // 9 months / in 9 months / 9 months ago
                    if (withoutSuffix || isFuture) {
                        return result + (plural(number) ? 'mesiace' : 'mesiacov');
                    } else {
                        return result + 'mesiacmi';
                    }
                    break;
                case 'y':  // a year / in a year / a year ago
                    return (withoutSuffix || isFuture) ? 'rok' : 'rokom';
                case 'yy': // 9 years / in 9 years / 9 years ago
                    if (withoutSuffix || isFuture) {
                        return result + (plural(number) ? 'roky' : 'rokov');
                    } else {
                        return result + 'rokmi';
                    }
                    break;
            }
        }

        return moment.defineLocale('sk', {
            months: months,
            monthsShort: monthsShort,
            monthsParse: (function (months, monthsShort) {
                var i, _monthsParse = [];
                for (i = 0; i < 12; i++) {
                    // use custom parser to solve problem with July (červenec)
                    _monthsParse[i] = new RegExp('^' + months[i] + '$|^' + monthsShort[i] + '$', 'i');
                }
                return _monthsParse;
            }(months, monthsShort)),
            weekdays: 'nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota'.split('_'),
            weekdaysShort: 'ne_po_ut_st_št_pi_so'.split('_'),
            weekdaysMin: 'ne_po_ut_st_št_pi_so'.split('_'),
            longDateFormat: {
                LT: 'H:mm',
                LTS: 'LT:ss',
                L: 'DD.MM.YYYY',
                LL: 'D. MMMM YYYY',
                LLL: 'D. MMMM YYYY LT',
                LLLL: 'dddd D. MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[dnes o] LT',
                nextDay: '[zajtra o] LT',
                nextWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return '[v nedeľu o] LT';
                        case 1:
                        case 2:
                            return '[v] dddd [o] LT';
                        case 3:
                            return '[v stredu o] LT';
                        case 4:
                            return '[vo štvrtok o] LT';
                        case 5:
                            return '[v piatok o] LT';
                        case 6:
                            return '[v sobotu o] LT';
                    }
                },
                lastDay: '[včera o] LT',
                lastWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return '[minulú nedeľu o] LT';
                        case 1:
                        case 2:
                            return '[minulý] dddd [o] LT';
                        case 3:
                            return '[minulú stredu o] LT';
                        case 4:
                        case 5:
                            return '[minulý] dddd [o] LT';
                        case 6:
                            return '[minulú sobotu o] LT';
                    }
                },
                sameElse: 'L'
            },
            relativeTime: {
                future: 'za %s',
                past: 'pred %s',
                s: translate,
                m: translate,
                mm: translate,
                h: translate,
                hh: translate,
                d: translate,
                dd: translate,
                M: translate,
                MM: translate,
                y: translate,
                yy: translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: '%d.',
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : slovenian (sl)
    // author : Robert Sedovšek : https://github.com/sedovsek

    (function (factory) {
        factory(moment);
    }(function (moment) {
        function translate(number, withoutSuffix, key) {
            var result = number + ' ';
            switch (key) {
                case 'm':
                    return withoutSuffix ? 'ena minuta' : 'eno minuto';
                case 'mm':
                    if (number === 1) {
                        result += 'minuta';
                    } else if (number === 2) {
                        result += 'minuti';
                    } else if (number === 3 || number === 4) {
                        result += 'minute';
                    } else {
                        result += 'minut';
                    }
                    return result;
                case 'h':
                    return withoutSuffix ? 'ena ura' : 'eno uro';
                case 'hh':
                    if (number === 1) {
                        result += 'ura';
                    } else if (number === 2) {
                        result += 'uri';
                    } else if (number === 3 || number === 4) {
                        result += 'ure';
                    } else {
                        result += 'ur';
                    }
                    return result;
                case 'dd':
                    if (number === 1) {
                        result += 'dan';
                    } else {
                        result += 'dni';
                    }
                    return result;
                case 'MM':
                    if (number === 1) {
                        result += 'mesec';
                    } else if (number === 2) {
                        result += 'meseca';
                    } else if (number === 3 || number === 4) {
                        result += 'mesece';
                    } else {
                        result += 'mesecev';
                    }
                    return result;
                case 'yy':
                    if (number === 1) {
                        result += 'leto';
                    } else if (number === 2) {
                        result += 'leti';
                    } else if (number === 3 || number === 4) {
                        result += 'leta';
                    } else {
                        result += 'let';
                    }
                    return result;
            }
        }

        return moment.defineLocale('sl', {
            months: 'januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december'.split('_'),
            monthsShort: 'jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.'.split('_'),
            weekdays: 'nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota'.split('_'),
            weekdaysShort: 'ned._pon._tor._sre._čet._pet._sob.'.split('_'),
            weekdaysMin: 'ne_po_to_sr_če_pe_so'.split('_'),
            longDateFormat: {
                LT: 'H:mm',
                LTS: 'LT:ss',
                L: 'DD. MM. YYYY',
                LL: 'D. MMMM YYYY',
                LLL: 'D. MMMM YYYY LT',
                LLLL: 'dddd, D. MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[danes ob] LT',
                nextDay: '[jutri ob] LT',

                nextWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return '[v] [nedeljo] [ob] LT';
                        case 3:
                            return '[v] [sredo] [ob] LT';
                        case 6:
                            return '[v] [soboto] [ob] LT';
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return '[v] dddd [ob] LT';
                    }
                },
                lastDay: '[včeraj ob] LT',
                lastWeek: function () {
                    switch (this.day()) {
                        case 0:
                        case 3:
                        case 6:
                            return '[prejšnja] dddd [ob] LT';
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return '[prejšnji] dddd [ob] LT';
                    }
                },
                sameElse: 'L'
            },
            relativeTime: {
                future: 'čez %s',
                past: '%s nazaj',
                s: 'nekaj sekund',
                m: translate,
                mm: translate,
                h: translate,
                hh: translate,
                d: 'en dan',
                dd: translate,
                M: 'en mesec',
                MM: translate,
                y: 'eno leto',
                yy: translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: '%d.',
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : Albanian (sq)
    // author : Flakërim Ismani : https://github.com/flakerimi
    // author: Menelion Elensúle: https://github.com/Oire (tests)
    // author : Oerd Cukalla : https://github.com/oerd (fixes)

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('sq', {
            months: 'Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_Nëntor_Dhjetor'.split('_'),
            monthsShort: 'Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_Nën_Dhj'.split('_'),
            weekdays: 'E Diel_E Hënë_E Martë_E Mërkurë_E Enjte_E Premte_E Shtunë'.split('_'),
            weekdaysShort: 'Die_Hën_Mar_Mër_Enj_Pre_Sht'.split('_'),
            weekdaysMin: 'D_H_Ma_Më_E_P_Sh'.split('_'),
            meridiemParse: /PD|MD/,
            isPM: function (input) {
                return input.charAt(0) === 'M';
            },
            meridiem: function (hours, minutes, isLower) {
                return hours < 12 ? 'PD' : 'MD';
            },
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd, D MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[Sot në] LT',
                nextDay: '[Nesër në] LT',
                nextWeek: 'dddd [në] LT',
                lastDay: '[Dje në] LT',
                lastWeek: 'dddd [e kaluar në] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'në %s',
                past: '%s më parë',
                s: 'disa sekonda',
                m: 'një minutë',
                mm: '%d minuta',
                h: 'një orë',
                hh: '%d orë',
                d: 'një ditë',
                dd: '%d ditë',
                M: 'një muaj',
                MM: '%d muaj',
                y: 'një vit',
                yy: '%d vite'
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: '%d.',
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : Serbian-cyrillic (sr-cyrl)
    // author : Milan Janačković<milanjanackovic@gmail.com> : https://github.com/milan-j

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var translator = {
            words: { //Different grammatical cases
                m: ['један минут', 'једне минуте'],
                mm: ['минут', 'минуте', 'минута'],
                h: ['један сат', 'једног сата'],
                hh: ['сат', 'сата', 'сати'],
                dd: ['дан', 'дана', 'дана'],
                MM: ['месец', 'месеца', 'месеци'],
                yy: ['година', 'године', 'година']
            },
            correctGrammaticalCase: function (number, wordKey) {
                return number === 1 ? wordKey[0] : (number >= 2 && number <= 4 ? wordKey[1] : wordKey[2]);
            },
            translate: function (number, withoutSuffix, key) {
                var wordKey = translator.words[key];
                if (key.length === 1) {
                    return withoutSuffix ? wordKey[0] : wordKey[1];
                } else {
                    return number + ' ' + translator.correctGrammaticalCase(number, wordKey);
                }
            }
        };

        return moment.defineLocale('sr-cyrl', {
            months: ['јануар', 'фебруар', 'март', 'април', 'мај', 'јун', 'јул', 'август', 'септембар', 'октобар', 'новембар', 'децембар'],
            monthsShort: ['јан.', 'феб.', 'мар.', 'апр.', 'мај', 'јун', 'јул', 'авг.', 'сеп.', 'окт.', 'нов.', 'дец.'],
            weekdays: ['недеља', 'понедељак', 'уторак', 'среда', 'четвртак', 'петак', 'субота'],
            weekdaysShort: ['нед.', 'пон.', 'уто.', 'сре.', 'чет.', 'пет.', 'суб.'],
            weekdaysMin: ['не', 'по', 'ут', 'ср', 'че', 'пе', 'су'],
            longDateFormat: {
                LT: 'H:mm',
                LTS: 'LT:ss',
                L: 'DD. MM. YYYY',
                LL: 'D. MMMM YYYY',
                LLL: 'D. MMMM YYYY LT',
                LLLL: 'dddd, D. MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[данас у] LT',
                nextDay: '[сутра у] LT',

                nextWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return '[у] [недељу] [у] LT';
                        case 3:
                            return '[у] [среду] [у] LT';
                        case 6:
                            return '[у] [суботу] [у] LT';
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return '[у] dddd [у] LT';
                    }
                },
                lastDay: '[јуче у] LT',
                lastWeek: function () {
                    var lastWeekDays = [
                        '[прошле] [недеље] [у] LT',
                        '[прошлог] [понедељка] [у] LT',
                        '[прошлог] [уторка] [у] LT',
                        '[прошле] [среде] [у] LT',
                        '[прошлог] [четвртка] [у] LT',
                        '[прошлог] [петка] [у] LT',
                        '[прошле] [суботе] [у] LT'
                    ];
                    return lastWeekDays[this.day()];
                },
                sameElse: 'L'
            },
            relativeTime: {
                future: 'за %s',
                past: 'пре %s',
                s: 'неколико секунди',
                m: translator.translate,
                mm: translator.translate,
                h: translator.translate,
                hh: translator.translate,
                d: 'дан',
                dd: translator.translate,
                M: 'месец',
                MM: translator.translate,
                y: 'годину',
                yy: translator.translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: '%d.',
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : Serbian-latin (sr)
    // author : Milan Janačković<milanjanackovic@gmail.com> : https://github.com/milan-j

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var translator = {
            words: { //Different grammatical cases
                m: ['jedan minut', 'jedne minute'],
                mm: ['minut', 'minute', 'minuta'],
                h: ['jedan sat', 'jednog sata'],
                hh: ['sat', 'sata', 'sati'],
                dd: ['dan', 'dana', 'dana'],
                MM: ['mesec', 'meseca', 'meseci'],
                yy: ['godina', 'godine', 'godina']
            },
            correctGrammaticalCase: function (number, wordKey) {
                return number === 1 ? wordKey[0] : (number >= 2 && number <= 4 ? wordKey[1] : wordKey[2]);
            },
            translate: function (number, withoutSuffix, key) {
                var wordKey = translator.words[key];
                if (key.length === 1) {
                    return withoutSuffix ? wordKey[0] : wordKey[1];
                } else {
                    return number + ' ' + translator.correctGrammaticalCase(number, wordKey);
                }
            }
        };

        return moment.defineLocale('sr', {
            months: ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'],
            monthsShort: ['jan.', 'feb.', 'mar.', 'apr.', 'maj', 'jun', 'jul', 'avg.', 'sep.', 'okt.', 'nov.', 'dec.'],
            weekdays: ['nedelja', 'ponedeljak', 'utorak', 'sreda', 'četvrtak', 'petak', 'subota'],
            weekdaysShort: ['ned.', 'pon.', 'uto.', 'sre.', 'čet.', 'pet.', 'sub.'],
            weekdaysMin: ['ne', 'po', 'ut', 'sr', 'če', 'pe', 'su'],
            longDateFormat: {
                LT: 'H:mm',
                LTS: 'LT:ss',
                L: 'DD. MM. YYYY',
                LL: 'D. MMMM YYYY',
                LLL: 'D. MMMM YYYY LT',
                LLLL: 'dddd, D. MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[danas u] LT',
                nextDay: '[sutra u] LT',

                nextWeek: function () {
                    switch (this.day()) {
                        case 0:
                            return '[u] [nedelju] [u] LT';
                        case 3:
                            return '[u] [sredu] [u] LT';
                        case 6:
                            return '[u] [subotu] [u] LT';
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return '[u] dddd [u] LT';
                    }
                },
                lastDay: '[juče u] LT',
                lastWeek: function () {
                    var lastWeekDays = [
                        '[prošle] [nedelje] [u] LT',
                        '[prošlog] [ponedeljka] [u] LT',
                        '[prošlog] [utorka] [u] LT',
                        '[prošle] [srede] [u] LT',
                        '[prošlog] [četvrtka] [u] LT',
                        '[prošlog] [petka] [u] LT',
                        '[prošle] [subote] [u] LT'
                    ];
                    return lastWeekDays[this.day()];
                },
                sameElse: 'L'
            },
            relativeTime: {
                future: 'za %s',
                past: 'pre %s',
                s: 'nekoliko sekundi',
                m: translator.translate,
                mm: translator.translate,
                h: translator.translate,
                hh: translator.translate,
                d: 'dan',
                dd: translator.translate,
                M: 'mesec',
                MM: translator.translate,
                y: 'godinu',
                yy: translator.translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: '%d.',
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : swedish (sv)
    // author : Jens Alm : https://github.com/ulmus

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('sv', {
            months: 'januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december'.split('_'),
            monthsShort: 'jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec'.split('_'),
            weekdays: 'söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag'.split('_'),
            weekdaysShort: 'sön_mån_tis_ons_tor_fre_lör'.split('_'),
            weekdaysMin: 'sö_må_ti_on_to_fr_lö'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'YYYY-MM-DD',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd D MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[Idag] LT',
                nextDay: '[Imorgon] LT',
                lastDay: '[Igår] LT',
                nextWeek: 'dddd LT',
                lastWeek: '[Förra] dddd[en] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'om %s',
                past: 'för %s sedan',
                s: 'några sekunder',
                m: 'en minut',
                mm: '%d minuter',
                h: 'en timme',
                hh: '%d timmar',
                d: 'en dag',
                dd: '%d dagar',
                M: 'en månad',
                MM: '%d månader',
                y: 'ett år',
                yy: '%d år'
            },
            ordinalParse: /\d{1,2}(e|a)/,
            ordinal: function (number) {
                var b = number % 10,
                    output = (~~(number % 100 / 10) === 1) ? 'e' :
                        (b === 1) ? 'a' :
                            (b === 2) ? 'a' :
                                (b === 3) ? 'e' : 'e';
                return number + output;
            },
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : tamil (ta)
    // author : Arjunkumar Krishnamoorthy : https://github.com/tk120404

    (function (factory) {
        factory(moment);
    }(function (moment) {
        /*var symbolMap = {
                '1': '௧',
                '2': '௨',
                '3': '௩',
                '4': '௪',
                '5': '௫',
                '6': '௬',
                '7': '௭',
                '8': '௮',
                '9': '௯',
                '0': '௦'
            },
            numberMap = {
                '௧': '1',
                '௨': '2',
                '௩': '3',
                '௪': '4',
                '௫': '5',
                '௬': '6',
                '௭': '7',
                '௮': '8',
                '௯': '9',
                '௦': '0'
            }; */

        return moment.defineLocale('ta', {
            months: 'ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்'.split('_'),
            monthsShort: 'ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்'.split('_'),
            weekdays: 'ஞாயிற்றுக்கிழமை_திங்கட்கிழமை_செவ்வாய்கிழமை_புதன்கிழமை_வியாழக்கிழமை_வெள்ளிக்கிழமை_சனிக்கிழமை'.split('_'),
            weekdaysShort: 'ஞாயிறு_திங்கள்_செவ்வாய்_புதன்_வியாழன்_வெள்ளி_சனி'.split('_'),
            weekdaysMin: 'ஞா_தி_செ_பு_வி_வெ_ச'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY, LT',
                LLLL: 'dddd, D MMMM YYYY, LT'
            },
            calendar: {
                sameDay: '[இன்று] LT',
                nextDay: '[நாளை] LT',
                nextWeek: 'dddd, LT',
                lastDay: '[நேற்று] LT',
                lastWeek: '[கடந்த வாரம்] dddd, LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: '%s இல்',
                past: '%s முன்',
                s: 'ஒரு சில விநாடிகள்',
                m: 'ஒரு நிமிடம்',
                mm: '%d நிமிடங்கள்',
                h: 'ஒரு மணி நேரம்',
                hh: '%d மணி நேரம்',
                d: 'ஒரு நாள்',
                dd: '%d நாட்கள்',
                M: 'ஒரு மாதம்',
                MM: '%d மாதங்கள்',
                y: 'ஒரு வருடம்',
                yy: '%d ஆண்டுகள்'
            },
            /*        preparse: function (string) {
                        return string.replace(/[௧௨௩௪௫௬௭௮௯௦]/g, function (match) {
                            return numberMap[match];
                        });
                    },
                    postformat: function (string) {
                        return string.replace(/\d/g, function (match) {
                            return symbolMap[match];
                        });
                    },*/
            ordinalParse: /\d{1,2}வது/,
            ordinal: function (number) {
                return number + 'வது';
            },


            // refer http://ta.wikipedia.org/s/1er1
            meridiemParse: /யாமம்|வைகறை|காலை|நண்பகல்|எற்பாடு|மாலை/,
            meridiem: function (hour, minute, isLower) {
                if (hour < 2) {
                    return ' யாமம்';
                } else if (hour < 6) {
                    return ' வைகறை';  // வைகறை
                } else if (hour < 10) {
                    return ' காலை'; // காலை
                } else if (hour < 14) {
                    return ' நண்பகல்'; // நண்பகல்
                } else if (hour < 18) {
                    return ' எற்பாடு'; // எற்பாடு
                } else if (hour < 22) {
                    return ' மாலை'; // மாலை
                } else {
                    return ' யாமம்';
                }
            },
            meridiemHour: function (hour, meridiem) {
                if (hour === 12) {
                    hour = 0;
                }
                if (meridiem === 'யாமம்') {
                    return hour < 2 ? hour : hour + 12;
                } else if (meridiem === 'வைகறை' || meridiem === 'காலை') {
                    return hour;
                } else if (meridiem === 'நண்பகல்') {
                    return hour >= 10 ? hour : hour + 12;
                } else {
                    return hour + 12;
                }
            },
            week: {
                dow: 0, // Sunday is the first day of the week.
                doy: 6  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : thai (th)
    // author : Kridsada Thanabulpong : https://github.com/sirn

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('th', {
            months: 'มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม'.split('_'),
            monthsShort: 'มกรา_กุมภา_มีนา_เมษา_พฤษภา_มิถุนา_กรกฎา_สิงหา_กันยา_ตุลา_พฤศจิกา_ธันวา'.split('_'),
            weekdays: 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์'.split('_'),
            weekdaysShort: 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์'.split('_'), // yes, three characters difference
            weekdaysMin: 'อา._จ._อ._พ._พฤ._ศ._ส.'.split('_'),
            longDateFormat: {
                LT: 'H นาฬิกา m นาที',
                LTS: 'LT s วินาที',
                L: 'YYYY/MM/DD',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY เวลา LT',
                LLLL: 'วันddddที่ D MMMM YYYY เวลา LT'
            },
            meridiemParse: /ก่อนเที่ยง|หลังเที่ยง/,
            isPM: function (input) {
                return input === 'หลังเที่ยง';
            },
            meridiem: function (hour, minute, isLower) {
                if (hour < 12) {
                    return 'ก่อนเที่ยง';
                } else {
                    return 'หลังเที่ยง';
                }
            },
            calendar: {
                sameDay: '[วันนี้ เวลา] LT',
                nextDay: '[พรุ่งนี้ เวลา] LT',
                nextWeek: 'dddd[หน้า เวลา] LT',
                lastDay: '[เมื่อวานนี้ เวลา] LT',
                lastWeek: '[วัน]dddd[ที่แล้ว เวลา] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'อีก %s',
                past: '%sที่แล้ว',
                s: 'ไม่กี่วินาที',
                m: '1 นาที',
                mm: '%d นาที',
                h: '1 ชั่วโมง',
                hh: '%d ชั่วโมง',
                d: '1 วัน',
                dd: '%d วัน',
                M: '1 เดือน',
                MM: '%d เดือน',
                y: '1 ปี',
                yy: '%d ปี'
            }
        });
    }));
    // moment.js locale configuration
    // locale : Tagalog/Filipino (tl-ph)
    // author : Dan Hagman

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('tl-ph', {
            months: 'Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre'.split('_'),
            monthsShort: 'Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis'.split('_'),
            weekdays: 'Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado'.split('_'),
            weekdaysShort: 'Lin_Lun_Mar_Miy_Huw_Biy_Sab'.split('_'),
            weekdaysMin: 'Li_Lu_Ma_Mi_Hu_Bi_Sab'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'MM/D/YYYY',
                LL: 'MMMM D, YYYY',
                LLL: 'MMMM D, YYYY LT',
                LLLL: 'dddd, MMMM DD, YYYY LT'
            },
            calendar: {
                sameDay: '[Ngayon sa] LT',
                nextDay: '[Bukas sa] LT',
                nextWeek: 'dddd [sa] LT',
                lastDay: '[Kahapon sa] LT',
                lastWeek: 'dddd [huling linggo] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'sa loob ng %s',
                past: '%s ang nakalipas',
                s: 'ilang segundo',
                m: 'isang minuto',
                mm: '%d minuto',
                h: 'isang oras',
                hh: '%d oras',
                d: 'isang araw',
                dd: '%d araw',
                M: 'isang buwan',
                MM: '%d buwan',
                y: 'isang taon',
                yy: '%d taon'
            },
            ordinalParse: /\d{1,2}/,
            ordinal: function (number) {
                return number;
            },
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : turkish (tr)
    // authors : Erhan Gundogan : https://github.com/erhangundogan,
    //           Burak Yiğit Kaya: https://github.com/BYK

    (function (factory) {
        factory(moment);
    }(function (moment) {
        var suffixes = {
            1: '\'inci',
            5: '\'inci',
            8: '\'inci',
            70: '\'inci',
            80: '\'inci',

            2: '\'nci',
            7: '\'nci',
            20: '\'nci',
            50: '\'nci',

            3: '\'üncü',
            4: '\'üncü',
            100: '\'üncü',

            6: '\'ncı',

            9: '\'uncu',
            10: '\'uncu',
            30: '\'uncu',

            60: '\'ıncı',
            90: '\'ıncı'
        };

        return moment.defineLocale('tr', {
            months: 'Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık'.split('_'),
            monthsShort: 'Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara'.split('_'),
            weekdays: 'Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi'.split('_'),
            weekdaysShort: 'Paz_Pts_Sal_Çar_Per_Cum_Cts'.split('_'),
            weekdaysMin: 'Pz_Pt_Sa_Ça_Pe_Cu_Ct'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD.MM.YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd, D MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[bugün saat] LT',
                nextDay: '[yarın saat] LT',
                nextWeek: '[haftaya] dddd [saat] LT',
                lastDay: '[dün] LT',
                lastWeek: '[geçen hafta] dddd [saat] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: '%s sonra',
                past: '%s önce',
                s: 'birkaç saniye',
                m: 'bir dakika',
                mm: '%d dakika',
                h: 'bir saat',
                hh: '%d saat',
                d: 'bir gün',
                dd: '%d gün',
                M: 'bir ay',
                MM: '%d ay',
                y: 'bir yıl',
                yy: '%d yıl'
            },
            ordinalParse: /\d{1,2}'(inci|nci|üncü|ncı|uncu|ıncı)/,
            ordinal: function (number) {
                if (number === 0) {  // special case for zero
                    return number + '\'ıncı';
                }
                var a = number % 10,
                    b = number % 100 - a,
                    c = number >= 100 ? 100 : null;

                return number + (suffixes[a] || suffixes[b] || suffixes[c]);
            },
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : Morocco Central Atlas Tamaziɣt in Latin (tzm-latn)
    // author : Abdel Said : https://github.com/abdelsaid

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('tzm-latn', {
            months: 'innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir'.split('_'),
            monthsShort: 'innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir'.split('_'),
            weekdays: 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
            weekdaysShort: 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
            weekdaysMin: 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd D MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[asdkh g] LT',
                nextDay: '[aska g] LT',
                nextWeek: 'dddd [g] LT',
                lastDay: '[assant g] LT',
                lastWeek: 'dddd [g] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'dadkh s yan %s',
                past: 'yan %s',
                s: 'imik',
                m: 'minuḍ',
                mm: '%d minuḍ',
                h: 'saɛa',
                hh: '%d tassaɛin',
                d: 'ass',
                dd: '%d ossan',
                M: 'ayowr',
                MM: '%d iyyirn',
                y: 'asgas',
                yy: '%d isgasn'
            },
            week: {
                dow: 6, // Saturday is the first day of the week.
                doy: 12  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : Morocco Central Atlas Tamaziɣt (tzm)
    // author : Abdel Said : https://github.com/abdelsaid

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('tzm', {
            months: 'ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ'.split('_'),
            monthsShort: 'ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ'.split('_'),
            weekdays: 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
            weekdaysShort: 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
            weekdaysMin: 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd D MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[ⴰⵙⴷⵅ ⴴ] LT',
                nextDay: '[ⴰⵙⴽⴰ ⴴ] LT',
                nextWeek: 'dddd [ⴴ] LT',
                lastDay: '[ⴰⵚⴰⵏⵜ ⴴ] LT',
                lastWeek: 'dddd [ⴴ] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s',
                past: 'ⵢⴰⵏ %s',
                s: 'ⵉⵎⵉⴽ',
                m: 'ⵎⵉⵏⵓⴺ',
                mm: '%d ⵎⵉⵏⵓⴺ',
                h: 'ⵙⴰⵄⴰ',
                hh: '%d ⵜⴰⵙⵙⴰⵄⵉⵏ',
                d: 'ⴰⵙⵙ',
                dd: '%d oⵙⵙⴰⵏ',
                M: 'ⴰⵢoⵓⵔ',
                MM: '%d ⵉⵢⵢⵉⵔⵏ',
                y: 'ⴰⵙⴳⴰⵙ',
                yy: '%d ⵉⵙⴳⴰⵙⵏ'
            },
            week: {
                dow: 6, // Saturday is the first day of the week.
                doy: 12  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : ukrainian (uk)
    // author : zemlanin : https://github.com/zemlanin
    // Author : Menelion Elensúle : https://github.com/Oire

    (function (factory) {
        factory(moment);
    }(function (moment) {
        function plural(word, num) {
            var forms = word.split('_');
            return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
        }

        function relativeTimeWithPlural(number, withoutSuffix, key) {
            var format = {
                'mm': 'хвилина_хвилини_хвилин',
                'hh': 'година_години_годин',
                'dd': 'день_дні_днів',
                'MM': 'місяць_місяці_місяців',
                'yy': 'рік_роки_років'
            };
            if (key === 'm') {
                return withoutSuffix ? 'хвилина' : 'хвилину';
            }
            else if (key === 'h') {
                return withoutSuffix ? 'година' : 'годину';
            }
            else {
                return number + ' ' + plural(format[key], +number);
            }
        }

        function monthsCaseReplace(m, format) {
            var months = {
                'nominative': 'січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень'.split('_'),
                'accusative': 'січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня'.split('_')
            },

                nounCase = (/D[oD]? *MMMM?/).test(format) ?
                    'accusative' :
                    'nominative';

            return months[nounCase][m.month()];
        }

        function weekdaysCaseReplace(m, format) {
            var weekdays = {
                'nominative': 'неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота'.split('_'),
                'accusative': 'неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу'.split('_'),
                'genitive': 'неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи'.split('_')
            },

                nounCase = (/(\[[ВвУу]\]) ?dddd/).test(format) ?
                    'accusative' :
                    ((/\[?(?:минулої|наступної)? ?\] ?dddd/).test(format) ?
                        'genitive' :
                        'nominative');

            return weekdays[nounCase][m.day()];
        }

        function processHoursFunction(str) {
            return function () {
                return str + 'о' + (this.hours() === 11 ? 'б' : '') + '] LT';
            };
        }

        return moment.defineLocale('uk', {
            months: monthsCaseReplace,
            monthsShort: 'січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд'.split('_'),
            weekdays: weekdaysCaseReplace,
            weekdaysShort: 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
            weekdaysMin: 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD.MM.YYYY',
                LL: 'D MMMM YYYY р.',
                LLL: 'D MMMM YYYY р., LT',
                LLLL: 'dddd, D MMMM YYYY р., LT'
            },
            calendar: {
                sameDay: processHoursFunction('[Сьогодні '),
                nextDay: processHoursFunction('[Завтра '),
                lastDay: processHoursFunction('[Вчора '),
                nextWeek: processHoursFunction('[У] dddd ['),
                lastWeek: function () {
                    switch (this.day()) {
                        case 0:
                        case 3:
                        case 5:
                        case 6:
                            return processHoursFunction('[Минулої] dddd [').call(this);
                        case 1:
                        case 2:
                        case 4:
                            return processHoursFunction('[Минулого] dddd [').call(this);
                    }
                },
                sameElse: 'L'
            },
            relativeTime: {
                future: 'за %s',
                past: '%s тому',
                s: 'декілька секунд',
                m: relativeTimeWithPlural,
                mm: relativeTimeWithPlural,
                h: 'годину',
                hh: relativeTimeWithPlural,
                d: 'день',
                dd: relativeTimeWithPlural,
                M: 'місяць',
                MM: relativeTimeWithPlural,
                y: 'рік',
                yy: relativeTimeWithPlural
            },

            // M. E.: those two are virtually unused but a user might want to implement them for his/her website for some reason

            meridiemParse: /ночі|ранку|дня|вечора/,
            isPM: function (input) {
                return /^(дня|вечора)$/.test(input);
            },
            meridiem: function (hour, minute, isLower) {
                if (hour < 4) {
                    return 'ночі';
                } else if (hour < 12) {
                    return 'ранку';
                } else if (hour < 17) {
                    return 'дня';
                } else {
                    return 'вечора';
                }
            },

            ordinalParse: /\d{1,2}-(й|го)/,
            ordinal: function (number, period) {
                switch (period) {
                    case 'M':
                    case 'd':
                    case 'DDD':
                    case 'w':
                    case 'W':
                        return number + '-й';
                    case 'D':
                        return number + '-го';
                    default:
                        return number;
                }
            },

            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 7  // The week that contains Jan 1st is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : uzbek (uz)
    // author : Sardor Muminov : https://github.com/muminoff

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('uz', {
            months: 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_'),
            monthsShort: 'янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек'.split('_'),
            weekdays: 'Якшанба_Душанба_Сешанба_Чоршанба_Пайшанба_Жума_Шанба'.split('_'),
            weekdaysShort: 'Якш_Душ_Сеш_Чор_Пай_Жум_Шан'.split('_'),
            weekdaysMin: 'Як_Ду_Се_Чо_Па_Жу_Ша'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'D MMMM YYYY, dddd LT'
            },
            calendar: {
                sameDay: '[Бугун соат] LT [да]',
                nextDay: '[Эртага] LT [да]',
                nextWeek: 'dddd [куни соат] LT [да]',
                lastDay: '[Кеча соат] LT [да]',
                lastWeek: '[Утган] dddd [куни соат] LT [да]',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'Якин %s ичида',
                past: 'Бир неча %s олдин',
                s: 'фурсат',
                m: 'бир дакика',
                mm: '%d дакика',
                h: 'бир соат',
                hh: '%d соат',
                d: 'бир кун',
                dd: '%d кун',
                M: 'бир ой',
                MM: '%d ой',
                y: 'бир йил',
                yy: '%d йил'
            },
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 7  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : vietnamese (vi)
    // author : Bang Nguyen : https://github.com/bangnk

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('vi', {
            months: 'tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12'.split('_'),
            monthsShort: 'Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12'.split('_'),
            weekdays: 'chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy'.split('_'),
            weekdaysShort: 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
            weekdaysMin: 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'LT:ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM [năm] YYYY',
                LLL: 'D MMMM [năm] YYYY LT',
                LLLL: 'dddd, D MMMM [năm] YYYY LT',
                l: 'DD/M/YYYY',
                ll: 'D MMM YYYY',
                lll: 'D MMM YYYY LT',
                llll: 'ddd, D MMM YYYY LT'
            },
            calendar: {
                sameDay: '[Hôm nay lúc] LT',
                nextDay: '[Ngày mai lúc] LT',
                nextWeek: 'dddd [tuần tới lúc] LT',
                lastDay: '[Hôm qua lúc] LT',
                lastWeek: 'dddd [tuần rồi lúc] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: '%s tới',
                past: '%s trước',
                s: 'vài giây',
                m: 'một phút',
                mm: '%d phút',
                h: 'một giờ',
                hh: '%d giờ',
                d: 'một ngày',
                dd: '%d ngày',
                M: 'một tháng',
                MM: '%d tháng',
                y: 'một năm',
                yy: '%d năm'
            },
            ordinalParse: /\d{1,2}/,
            ordinal: function (number) {
                return number;
            },
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : chinese (zh-cn)
    // author : suupic : https://github.com/suupic
    // author : Zeno Zeng : https://github.com/zenozeng

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('zh-cn', {
            months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
            monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
            weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
            weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
            weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
            longDateFormat: {
                LT: 'Ah点mm',
                LTS: 'Ah点m分s秒',
                L: 'YYYY-MM-DD',
                LL: 'YYYY年MMMD日',
                LLL: 'YYYY年MMMD日LT',
                LLLL: 'YYYY年MMMD日ddddLT',
                l: 'YYYY-MM-DD',
                ll: 'YYYY年MMMD日',
                lll: 'YYYY年MMMD日LT',
                llll: 'YYYY年MMMD日ddddLT'
            },
            meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
            meridiemHour: function (hour, meridiem) {
                if (hour === 12) {
                    hour = 0;
                }
                if (meridiem === '凌晨' || meridiem === '早上' ||
                    meridiem === '上午') {
                    return hour;
                } else if (meridiem === '下午' || meridiem === '晚上') {
                    return hour + 12;
                } else {
                    // '中午'
                    return hour >= 11 ? hour : hour + 12;
                }
            },
            meridiem: function (hour, minute, isLower) {
                var hm = hour * 100 + minute;
                if (hm < 600) {
                    return '凌晨';
                } else if (hm < 900) {
                    return '早上';
                } else if (hm < 1130) {
                    return '上午';
                } else if (hm < 1230) {
                    return '中午';
                } else if (hm < 1800) {
                    return '下午';
                } else {
                    return '晚上';
                }
            },
            calendar: {
                sameDay: function () {
                    return this.minutes() === 0 ? '[今天]Ah[点整]' : '[今天]LT';
                },
                nextDay: function () {
                    return this.minutes() === 0 ? '[明天]Ah[点整]' : '[明天]LT';
                },
                lastDay: function () {
                    return this.minutes() === 0 ? '[昨天]Ah[点整]' : '[昨天]LT';
                },
                nextWeek: function () {
                    var startOfWeek, prefix;
                    startOfWeek = moment().startOf('week');
                    prefix = this.unix() - startOfWeek.unix() >= 7 * 24 * 3600 ? '[下]' : '[本]';
                    return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
                },
                lastWeek: function () {
                    var startOfWeek, prefix;
                    startOfWeek = moment().startOf('week');
                    prefix = this.unix() < startOfWeek.unix() ? '[上]' : '[本]';
                    return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
                },
                sameElse: 'LL'
            },
            ordinalParse: /\d{1,2}(日|月|周)/,
            ordinal: function (number, period) {
                switch (period) {
                    case 'd':
                    case 'D':
                    case 'DDD':
                        return number + '日';
                    case 'M':
                        return number + '月';
                    case 'w':
                    case 'W':
                        return number + '周';
                    default:
                        return number;
                }
            },
            relativeTime: {
                future: '%s内',
                past: '%s前',
                s: '几秒',
                m: '1分钟',
                mm: '%d分钟',
                h: '1小时',
                hh: '%d小时',
                d: '1天',
                dd: '%d天',
                M: '1个月',
                MM: '%d个月',
                y: '1年',
                yy: '%d年'
            },
            week: {
                // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));
    // moment.js locale configuration
    // locale : traditional chinese (zh-tw)
    // author : Ben : https://github.com/ben-lin

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('zh-tw', {
            months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
            monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
            weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
            weekdaysShort: '週日_週一_週二_週三_週四_週五_週六'.split('_'),
            weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
            longDateFormat: {
                LT: 'Ah點mm',
                LTS: 'Ah點m分s秒',
                L: 'YYYY年MMMD日',
                LL: 'YYYY年MMMD日',
                LLL: 'YYYY年MMMD日LT',
                LLLL: 'YYYY年MMMD日ddddLT',
                l: 'YYYY年MMMD日',
                ll: 'YYYY年MMMD日',
                lll: 'YYYY年MMMD日LT',
                llll: 'YYYY年MMMD日ddddLT'
            },
            meridiemParse: /早上|上午|中午|下午|晚上/,
            meridiemHour: function (hour, meridiem) {
                if (hour === 12) {
                    hour = 0;
                }
                if (meridiem === '早上' || meridiem === '上午') {
                    return hour;
                } else if (meridiem === '中午') {
                    return hour >= 11 ? hour : hour + 12;
                } else if (meridiem === '下午' || meridiem === '晚上') {
                    return hour + 12;
                }
            },
            meridiem: function (hour, minute, isLower) {
                var hm = hour * 100 + minute;
                if (hm < 900) {
                    return '早上';
                } else if (hm < 1130) {
                    return '上午';
                } else if (hm < 1230) {
                    return '中午';
                } else if (hm < 1800) {
                    return '下午';
                } else {
                    return '晚上';
                }
            },
            calendar: {
                sameDay: '[今天]LT',
                nextDay: '[明天]LT',
                nextWeek: '[下]ddddLT',
                lastDay: '[昨天]LT',
                lastWeek: '[上]ddddLT',
                sameElse: 'L'
            },
            ordinalParse: /\d{1,2}(日|月|週)/,
            ordinal: function (number, period) {
                switch (period) {
                    case 'd':
                    case 'D':
                    case 'DDD':
                        return number + '日';
                    case 'M':
                        return number + '月';
                    case 'w':
                    case 'W':
                        return number + '週';
                    default:
                        return number;
                }
            },
            relativeTime: {
                future: '%s內',
                past: '%s前',
                s: '幾秒',
                m: '一分鐘',
                mm: '%d分鐘',
                h: '一小時',
                hh: '%d小時',
                d: '一天',
                dd: '%d天',
                M: '一個月',
                MM: '%d個月',
                y: '一年',
                yy: '%d年'
            }
        });
    }));

    moment.locale('en');


    /************************************
        Exposing Moment
    ************************************/

    function makeGlobal(shouldDeprecate) {
        /*global ender:false */
        if (typeof ender !== 'undefined') {
            return;
        }
        oldGlobalMoment = globalScope.moment;
        if (shouldDeprecate) {
            globalScope.moment = deprecate(
                'Accessing Moment through the global scope is ' +
                'deprecated, and will be removed in an upcoming ' +
                'release.',
                moment);
        } else {
            globalScope.moment = moment;
        }
    }

    // CommonJS module is defined
    if (hasModule) {
        module.exports = moment;
    } else if (typeof define === 'function' && define.amd) {
        define(function (require, exports, module) {
            if (module.config && module.config() && module.config().noGlobal === true) {
                // release the global variable
                globalScope.moment = oldGlobalMoment;
            }

            return moment;
        });
        makeGlobal(true);
    } else {
        makeGlobal();
    }
}).call(this);
/**
 * Bootstrap Multiselect (http://davidstutz.de/bootstrap-multiselect/)
 *
 * Apache License, Version 2.0:
 * Copyright (c) 2012 - 2018 David Stutz
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a
 * copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * BSD 3-Clause License:
 * Copyright (c) 2012 - 2018 David Stutz
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    - Redistributions of source code must retain the above copyright notice,
 *      this list of conditions and the following disclaimer.
 *    - Redistributions in binary form must reproduce the above copyright notice,
 *      this list of conditions and the following disclaimer in the documentation
 *      and/or other materials provided with the distribution.
 *    - Neither the name of David Stutz nor the names of its contributors may be
 *      used to endorse or promote products derived from this software without
 *      specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
(function (root, factory) {
    // check to see if 'knockout' AMD module is specified if using requirejs
    if (typeof define === 'function' && define.amd &&
        typeof require === 'function' && typeof require.specified === 'function' && require.specified('knockout')) {

        // AMD. Register as an anonymous module.
        define(['jquery', 'knockout'], factory);
    } else {
        // Browser globals
        factory(root.jQuery, root.ko);
    }
})(this, function ($, ko) {
    "use strict";// jshint ;_;

    if (typeof ko !== 'undefined' && ko.bindingHandlers && !ko.bindingHandlers.multiselect) {
        ko.bindingHandlers.multiselect = {
            after: ['options', 'value', 'selectedOptions', 'enable', 'disable'],

            init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
                var $element = $(element);
                var config = ko.toJS(valueAccessor());

                $element.multiselect(config);

                if (allBindings.has('options')) {
                    var options = allBindings.get('options');
                    if (ko.isObservable(options)) {
                        ko.computed({
                            read: function() {
                                options();
                                setTimeout(function() {
                                    var ms = $element.data('multiselect');
                                    if (ms)
                                        ms.updateOriginalOptions();//Not sure how beneficial this is.
                                    $element.multiselect('rebuild');
                                }, 1);
                            },
                            disposeWhenNodeIsRemoved: element
                        });
                    }
                }

                //value and selectedOptions are two-way, so these will be triggered even by our own actions.
                //It needs some way to tell if they are triggered because of us or because of outside change.
                //It doesn't loop but it's a waste of processing.
                if (allBindings.has('value')) {
                    var value = allBindings.get('value');
                    if (ko.isObservable(value)) {
                        ko.computed({
                            read: function() {
                                value();
                                setTimeout(function() {
                                    $element.multiselect('refresh');
                                }, 1);
                            },
                            disposeWhenNodeIsRemoved: element
                        }).extend({ rateLimit: 100, notifyWhenChangesStop: true });
                    }
                }

                //Switched from arrayChange subscription to general subscription using 'refresh'.
                //Not sure performance is any better using 'select' and 'deselect'.
                if (allBindings.has('selectedOptions')) {
                    var selectedOptions = allBindings.get('selectedOptions');
                    if (ko.isObservable(selectedOptions)) {
                        ko.computed({
                            read: function() {
                                selectedOptions();
                                setTimeout(function() {
                                    $element.multiselect('refresh');
                                }, 1);
                            },
                            disposeWhenNodeIsRemoved: element
                        }).extend({ rateLimit: 100, notifyWhenChangesStop: true });
                    }
                }

                var setEnabled = function (enable) {
                    setTimeout(function () {
                        if (enable)
                            $element.multiselect('enable');
                        else
                            $element.multiselect('disable');
                    });
                };

                if (allBindings.has('enable')) {
                    var enable = allBindings.get('enable');
                    if (ko.isObservable(enable)) {
                        ko.computed({
                            read: function () {
                                setEnabled(enable());
                            },
                            disposeWhenNodeIsRemoved: element
                        }).extend({ rateLimit: 100, notifyWhenChangesStop: true });
                    } else {
                        setEnabled(enable);
                    }
                }

                if (allBindings.has('disable')) {
                    var disable = allBindings.get('disable');
                    if (ko.isObservable(disable)) {
                        ko.computed({
                            read: function () {
                                setEnabled(!disable());
                            },
                            disposeWhenNodeIsRemoved: element
                        }).extend({ rateLimit: 100, notifyWhenChangesStop: true });
                    } else {
                        setEnabled(!disable);
                    }
                }

                ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                    $element.multiselect('destroy');
                });
            },

            update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
                var $element = $(element);
                var config = ko.toJS(valueAccessor());

                $element.multiselect('setOptions', config);
                $element.multiselect('rebuild');
            }
        };
    }

    function forEach(array, callback) {
        for (var index = 0; index < array.length; ++index) {
            callback(array[index], index);
        }
    }

    /**
     * Constructor to create a new multiselect using the given select.
     *
     * @param {jQuery} select
     * @param {Object} options
     * @returns {Multiselect}
     */
    function Multiselect(select, options) {

        this.$select = $(select);
        this.options = this.mergeOptions($.extend({}, options, this.$select.data()));

        // Placeholder via data attributes
        if (this.$select.attr("data-placeholder")) {
            this.options.nonSelectedText = this.$select.data("placeholder");
        }

        // Initialization.
        // We have to clone to create a new reference.
        this.originalOptions = this.$select.clone()[0].options;
        this.query = '';
        this.searchTimeout = null;
        this.lastToggledInput = null;

        this.options.multiple = this.$select.attr('multiple') === "multiple";
        this.options.onChange = $.proxy(this.options.onChange, this);
        this.options.onSelectAll = $.proxy(this.options.onSelectAll, this);
        this.options.onDeselectAll = $.proxy(this.options.onDeselectAll, this);
        this.options.onDropdownShow = $.proxy(this.options.onDropdownShow, this);
        this.options.onDropdownHide = $.proxy(this.options.onDropdownHide, this);
        this.options.onDropdownShown = $.proxy(this.options.onDropdownShown, this);
        this.options.onDropdownHidden = $.proxy(this.options.onDropdownHidden, this);
        this.options.onInitialized = $.proxy(this.options.onInitialized, this);
        this.options.onFiltering = $.proxy(this.options.onFiltering, this);

        // Build select all if enabled.
        this.buildContainer();
        this.buildButton();
        this.buildDropdown();
        this.buildReset();
        this.buildSelectAll();
        this.buildDropdownOptions();
        this.buildFilter();

        this.updateButtonText();
        this.updateSelectAll(true);

        if (this.options.enableClickableOptGroups && this.options.multiple) {
            this.updateOptGroups();
        }

        this.options.wasDisabled = this.$select.prop('disabled');
        if (this.options.disableIfEmpty && $('option', this.$select).length <= 0) {
            this.disable();
        }

        this.$select.wrap('<span class="multiselect-native-select" />').after(this.$container);
        this.options.onInitialized(this.$select, this.$container);
    }

    Multiselect.prototype = {

        defaults: {
            /**
             * Default text function will either print 'None selected' in case no
             * option is selected or a list of the selected options up to a length
             * of 3 selected options.
             *
             * @param {jQuery} options
             * @param {jQuery} select
             * @returns {String}
             */
            buttonText: function(options, select) {
                if (this.disabledText.length > 0
                        && (select.prop('disabled') || (options.length == 0 && this.disableIfEmpty)))  {

                    return this.disabledText;
                }
                else if (options.length === 0) {
                    return this.nonSelectedText;
                }
                else if (this.allSelectedText
                        && options.length === $('option', $(select)).length
                        && $('option', $(select)).length !== 1
                        && this.multiple) {

                    if (this.selectAllNumber) {
                        return this.allSelectedText + ' (' + options.length + ')';
                    }
                    else {
                        return this.allSelectedText;
                    }
                }
                else if (this.numberDisplayed != 0 && options.length > this.numberDisplayed) {
                    return options.length + ' ' + this.nSelectedText;
                }
                else {
                    var selected = '';
                    var delimiter = this.delimiterText;

                    options.each(function() {
                        var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).text();
                        selected += label + delimiter;
                    });

                    return selected.substr(0, selected.length - this.delimiterText.length);
                }
            },
            /**
             * Updates the title of the button similar to the buttonText function.
             *
             * @param {jQuery} options
             * @param {jQuery} select
             * @returns {@exp;selected@call;substr}
             */
            buttonTitle: function(options, select) {
                if (options.length === 0) {
                    return this.nonSelectedText;
                }
                else {
                    var selected = '';
                    var delimiter = this.delimiterText;

                    options.each(function () {
                        var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).text();
                        selected += label + delimiter;
                    });
                    return selected.substr(0, selected.length - this.delimiterText.length);
                }
            },
            checkboxName: function(option) {
                return false; // no checkbox name
            },
            /**
             * Create a label.
             *
             * @param {jQuery} element
             * @returns {String}
             */
            optionLabel: function(element){
                return $(element).attr('label') || $(element).text();
            },
            /**
             * Create a class.
             *
             * @param {jQuery} element
             * @returns {String}
             */
            optionClass: function(element) {
                return $(element).attr('class') || '';
            },
            /**
             * Triggered on change of the multiselect.
             *
             * Not triggered when selecting/deselecting options manually.
             *
             * @param {jQuery} option
             * @param {Boolean} checked
             */
            onChange : function(option, checked) {

            },
            /**
             * Triggered when the dropdown is shown.
             *
             * @param {jQuery} event
             */
            onDropdownShow: function(event) {

            },
            /**
             * Triggered when the dropdown is hidden.
             *
             * @param {jQuery} event
             */
            onDropdownHide: function(event) {

            },
            /**
             * Triggered after the dropdown is shown.
             *
             * @param {jQuery} event
             */
            onDropdownShown: function(event) {

            },
            /**
             * Triggered after the dropdown is hidden.
             *
             * @param {jQuery} event
             */
            onDropdownHidden: function(event) {

            },
            /**
             * Triggered on select all.
             */
            onSelectAll: function() {

            },
            /**
             * Triggered on deselect all.
             */
            onDeselectAll: function() {

            },
            /**
             * Triggered after initializing.
             *
             * @param {jQuery} $select
             * @param {jQuery} $container
             */
            onInitialized: function($select, $container) {

            },
            /**
             * Triggered on filtering.
             *
             * @param {jQuery} $filter
             */
            onFiltering: function($filter) {

            },
            enableHTML: false,
            buttonClass: 'btn btn-default',
            inheritClass: false,
            buttonWidth: 'auto',
            buttonContainer: '<div class="btn-group" />',
            dropRight: false,
            dropUp: false,
            selectedClass: 'active',
            // Maximum height of the dropdown menu.
            // If maximum height is exceeded a scrollbar will be displayed.
            maxHeight: false,
            includeSelectAllOption: false,
            includeSelectAllIfMoreThan: 0,
            selectAllText: ' Select all',
            selectAllValue: 'multiselect-all',
            selectAllName: false,
            selectAllNumber: true,
            selectAllJustVisible: true,
            enableFiltering: false,
            enableCaseInsensitiveFiltering: false,
            enableFullValueFiltering: false,
            enableClickableOptGroups: false,
            enableCollapsibleOptGroups: false,
            collapseOptGroupsByDefault: false,
            filterPlaceholder: 'Search',
            // possible options: 'text', 'value', 'both'
            filterBehavior: 'text',
            includeFilterClearBtn: true,
            preventInputChangeEvent: false,
            nonSelectedText: 'None selected',
            nSelectedText: 'selected',
            allSelectedText: 'All selected',
            numberDisplayed: 3,
            disableIfEmpty: false,
            disabledText: '',
            delimiterText: ', ',
            includeResetOption: false,
            includeResetDivider: false,
            resetText: 'Reset',
            templates: {
                button: '<button type="button" class="multiselect dropdown-toggle" data-toggle="dropdown" style="min-height: 30px;"><span class="multiselect-selected-text"></span> <b class="caret"></b></button>',
                ul: '<ul class="multiselect-container dropdown-menu smart-form" style="max-height: 250px; overflow: auto;"></ul>',
                filter: '<li class="multiselect-item multiselect-filter"><div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span><input class="form-control multiselect-search" type="text" /></div></li>',
                filterClearBtn: '<span class="input-group-btn"><button class="btn btn-default multiselect-clear-filter" type="button"><i class="glyphicon glyphicon-remove-circle"></i></button></span>',
                li: '<li><a tabindex="0"><label></label></a></li>',
                divider: '<li class="multiselect-item divider"></li>',
                liGroup: '<li class="multiselect-item multiselect-group"><label></label></li>',
                resetButton: '<li class="multiselect-reset text-center"><div class="input-group"><a class="btn btn-default btn-block"></a></div></li>'
            }
        },

        constructor: Multiselect,

        /**
         * Builds the container of the multiselect.
         */
        buildContainer: function() {
            this.$container = $(this.options.buttonContainer);
            this.$container.on('show.bs.dropdown', this.options.onDropdownShow);
            this.$container.on('hide.bs.dropdown', this.options.onDropdownHide);
            this.$container.on('shown.bs.dropdown', this.options.onDropdownShown);
            this.$container.on('hidden.bs.dropdown', this.options.onDropdownHidden);
        },

        /**
         * Builds the button of the multiselect.
         */
        buildButton: function() {
            this.$button = $(this.options.templates.button).addClass(this.options.buttonClass);
            if (this.$select.attr('class') && this.options.inheritClass) {
                this.$button.addClass(this.$select.attr('class'));
            }
            // Adopt active state.
            if (this.$select.prop('disabled')) {
                this.disable();
            }
            else {
                this.enable();
            }

            // Manually add button width if set.
            if (this.options.buttonWidth && this.options.buttonWidth !== 'auto') {
                this.$button.css({
                    'width' : '100%', //this.options.buttonWidth,
                    'overflow' : 'hidden',
                    'text-overflow' : 'ellipsis'
                });
                this.$container.css({
                    'width': this.options.buttonWidth
                });
            }

            // Keep the tab index from the select.
            var tabindex = this.$select.attr('tabindex');
            if (tabindex) {
                this.$button.attr('tabindex', tabindex);
            }

            this.$container.prepend(this.$button);
        },

        /**
         * Builds the ul representing the dropdown menu.
         */
        buildDropdown: function() {

            // Build ul.
            this.$ul = $(this.options.templates.ul);

            if (this.options.dropRight) {
                this.$ul.addClass('pull-right');
            }

            // Set max height of dropdown menu to activate auto scrollbar.
            if (this.options.maxHeight) {
                // TODO: Add a class for this option to move the css declarations.
                this.$ul.css({
                    'max-height': this.options.maxHeight + 'px',
                    'overflow-y': 'auto',
                    'overflow-x': 'hidden'
                });
            }

            if (this.options.dropUp) {

                var height = Math.min(this.options.maxHeight, $('option[data-role!="divider"]', this.$select).length*26 + $('option[data-role="divider"]', this.$select).length*19 + (this.options.includeSelectAllOption ? 26 : 0) + (this.options.enableFiltering || this.options.enableCaseInsensitiveFiltering ? 44 : 0));
                var moveCalc = height + 34;

                this.$ul.css({
                    'max-height': height + 'px',
                    'overflow-y': 'auto',
                    'overflow-x': 'hidden',
                    'margin-top': "-" + moveCalc + 'px'
                });
            }

            this.$container.append(this.$ul);
        },

        /**
         * Build the dropdown options and binds all necessary events.
         *
         * Uses createDivider and createOptionValue to create the necessary options.
         */
        buildDropdownOptions: function() {

            this.$select.children().each($.proxy(function(index, element) {

                var $element = $(element);
                // Support optgroups and options without a group simultaneously.
                var tag = $element.prop('tagName')
                    .toLowerCase();

                if ($element.prop('value') === this.options.selectAllValue) {
                    return;
                }

                if (tag === 'optgroup') {
                    this.createOptgroup(element);
                }
                else if (tag === 'option') {

                    if ($element.data('role') === 'divider') {
                        this.createDivider();
                    }
                    else {
                        this.createOptionValue(element);
                    }

                }

                // Other illegal tags will be ignored.
            }, this));

            // Bind the change event on the dropdown elements.
            $(this.$ul).off('change', 'li:not(.multiselect-group) input[type="checkbox"], li:not(.multiselect-group) input[type="radio"]');
            $(this.$ul).on('change', 'li:not(.multiselect-group) input[type="checkbox"], li:not(.multiselect-group) input[type="radio"]', $.proxy(function(event) {
                var $target = $(event.target);

                var checked = $target.prop('checked') || false;
                var isSelectAllOption = $target.val() === this.options.selectAllValue;

                // Apply or unapply the configured selected class.
                if (this.options.selectedClass) {
                    if (checked) {
                        $target.closest('li')
                            .addClass(this.options.selectedClass);
                    }
                    else {
                        $target.closest('li')
                            .removeClass(this.options.selectedClass);
                    }
                }

                // Get the corresponding option.
                var value = $target.val();
                var $option = this.getOptionByValue(value);

                var $optionsNotThis = $('option', this.$select).not($option);
                var $checkboxesNotThis = $('input', this.$container).not($target);

                if (isSelectAllOption) {

                    if (checked) {
                        this.selectAll(this.options.selectAllJustVisible, true);
                    }
                    else {
                        this.deselectAll(this.options.selectAllJustVisible, true);
                    }
                }
                else {
                    if (checked) {
                        $option.prop('selected', true);

                        if (this.options.multiple) {
                            // Simply select additional option.
                            $option.prop('selected', true);
                        }
                        else {
                            // Unselect all other options and corresponding checkboxes.
                            if (this.options.selectedClass) {
                                $($checkboxesNotThis).closest('li').removeClass(this.options.selectedClass);
                            }

                            $($checkboxesNotThis).prop('checked', false);
                            $optionsNotThis.prop('selected', false);

                            // It's a single selection, so close.
                            this.$button.click();
                        }

                        if (this.options.selectedClass === "active") {
                            $optionsNotThis.closest("a").css("outline", "");
                        }
                    }
                    else {
                        // Unselect option.
                        $option.prop('selected', false);
                    }

                    // To prevent select all from firing onChange: #575
                    this.options.onChange($option, checked);

                    // Do not update select all or optgroups on select all change!
                    this.updateSelectAll();

                    if (this.options.enableClickableOptGroups && this.options.multiple) {
                        this.updateOptGroups();
                    }
                }

                this.$select.change();
                this.updateButtonText();

                if(this.options.preventInputChangeEvent) {
                    return false;
                }
            }, this));

            $('li a', this.$ul).on('mousedown', function(e) {
                if (e.shiftKey) {
                    // Prevent selecting text by Shift+click
                    return false;
                }
            });

            $(this.$ul).on('touchstart click', 'li a', $.proxy(function(event) {
                event.stopPropagation();

                var $target = $(event.target);

                if (event.shiftKey && this.options.multiple) {
                    if($target.is("label")){ // Handles checkbox selection manually (see https://github.com/davidstutz/bootstrap-multiselect/issues/431)
                        event.preventDefault();
                        $target = $target.find("input");
                        $target.prop("checked", !$target.prop("checked"));
                    }
                    var checked = $target.prop('checked') || false;

                    if (this.lastToggledInput !== null && this.lastToggledInput !== $target) { // Make sure we actually have a range
                        var from = this.$ul.find("li:visible").index($target.parents("li"));
                        var to = this.$ul.find("li:visible").index(this.lastToggledInput.parents("li"));

                        if (from > to) { // Swap the indices
                            var tmp = to;
                            to = from;
                            from = tmp;
                        }

                        // Make sure we grab all elements since slice excludes the last index
                        ++to;

                        // Change the checkboxes and underlying options
                        var range = this.$ul.find("li").not(".multiselect-filter-hidden").slice(from, to).find("input");

                        range.prop('checked', checked);

                        if (this.options.selectedClass) {
                            range.closest('li')
                                .toggleClass(this.options.selectedClass, checked);
                        }

                        for (var i = 0, j = range.length; i < j; i++) {
                            var $checkbox = $(range[i]);

                            var $option = this.getOptionByValue($checkbox.val());

                            $option.prop('selected', checked);
                        }
                    }

                    // Trigger the select "change" event
                    $target.trigger("change");
                }

                // Remembers last clicked option
                if($target.is("input") && !$target.closest("li").is(".multiselect-item")){
                    this.lastToggledInput = $target;
                }

                $target.blur();
            }, this));

            // Keyboard support.
            this.$container.off('keydown.multiselect').on('keydown.multiselect', $.proxy(function(event) {
                if ($('input[type="text"]', this.$container).is(':focus')) {
                    return;
                }

                if (event.keyCode === 9 && this.$container.hasClass('open')) {
                    this.$button.click();
                }
                else {
                    var $items = $(this.$container).find("li:not(.divider):not(.disabled) a").filter(":visible");

                    if (!$items.length) {
                        return;
                    }

                    var index = $items.index($items.filter(':focus'));
                    
                    // Navigation up.
                    if (event.keyCode === 38 && index > 0) {
                        index--;
                    }
                    // Navigate down.
                    else if (event.keyCode === 40 && index < $items.length - 1) {
                        index++;
                    }
                    else if (!~index) {
                        index = 0;
                    }

                    var $current = $items.eq(index);
                    $current.focus();

                    if (event.keyCode === 32 || event.keyCode === 13) {
                        var $checkbox = $current.find('input');

                        $checkbox.prop("checked", !$checkbox.prop("checked"));
                        $checkbox.change();
                    }

                    event.stopPropagation();
                    event.preventDefault();
                }
            }, this));

            if (this.options.enableClickableOptGroups && this.options.multiple) {
                $("li.multiselect-group input", this.$ul).on("change", $.proxy(function(event) {
                    event.stopPropagation();

                    var $target = $(event.target);
                    var checked = $target.prop('checked') || false;

                    var $li = $(event.target).closest('li');
                    var $group = $li.nextUntil("li.multiselect-group")
                        .not('.multiselect-filter-hidden')
                        .not('.disabled');

                    var $inputs = $group.find("input");

                    var values = [];
                    var $options = [];

                    if (this.options.selectedClass) {
                        if (checked) {
                            $li.addClass(this.options.selectedClass);
                        }
                        else {
                            $li.removeClass(this.options.selectedClass);
                        }
                    }

                    $.each($inputs, $.proxy(function(index, input) {
                        var value = $(input).val();
                        var $option = this.getOptionByValue(value);

                        if (checked) {
                            $(input).prop('checked', true);
                            $(input).closest('li')
                                .addClass(this.options.selectedClass);

                            $option.prop('selected', true);
                        }
                        else {
                            $(input).prop('checked', false);
                            $(input).closest('li')
                                .removeClass(this.options.selectedClass);

                            $option.prop('selected', false);
                        }

                        $options.push(this.getOptionByValue(value));
                    }, this))

                    // Cannot use select or deselect here because it would call updateOptGroups again.

                    this.options.onChange($options, checked);

                    this.$select.change();
                    this.updateButtonText();
                    this.updateSelectAll();
                }, this));
            }

            if (this.options.enableCollapsibleOptGroups && this.options.multiple) {
                $("li.multiselect-group .caret-container", this.$ul).on("click", $.proxy(function(event) {
                    var $li = $(event.target).closest('li');
                    var $inputs = $li.nextUntil("li.multiselect-group")
                            .not('.multiselect-filter-hidden');

                    var visible = true;
                    $inputs.each(function() {
                        visible = visible && !$(this).hasClass('multiselect-collapsible-hidden');
                    });

                    if (visible) {
                        $inputs.hide()
                            .addClass('multiselect-collapsible-hidden');
                    }
                    else {
                        $inputs.show()
                            .removeClass('multiselect-collapsible-hidden');
                    }
                }, this));

                $("li.multiselect-all", this.$ul).css('background', '#f3f3f3').css('border-bottom', '1px solid #eaeaea');
                $("li.multiselect-all > a > label.checkbox", this.$ul).css('padding', '3px 20px 3px 35px');
                $("li.multiselect-group > a > input", this.$ul).css('margin', '4px 0px 5px -20px');
            }
        },

        /**
         * Create an option using the given select option.
         *
         * @param {jQuery} element
         */
        createOptionValue: function(element) {
            var $element = $(element);
            if ($element.is(':selected')) {
                $element.prop('selected', true);
            }

            // Support the label attribute on options.
            var label = this.options.optionLabel(element);
            var classes = this.options.optionClass(element);
            var value = $element.val();
            var inputType = this.options.multiple ? "checkbox" : "radio";

            var $li = $(this.options.templates.li);
            var $label = $('label', $li);
            $label.addClass(inputType);
            $label.attr("title", label);
            $li.addClass(classes);

            // Hide all children items when collapseOptGroupsByDefault is true
            if (this.options.collapseOptGroupsByDefault && $(element).parent().prop("tagName").toLowerCase() === "optgroup") {
                $li.addClass("multiselect-collapsible-hidden");
                $li.hide();
            }

            if (this.options.enableHTML) {
                $label.html(" " + label);
            }
            else {
                $label.text(" " + label);
            }

            var $checkbox = $('<input/>').attr('type', inputType);

            var name = this.options.checkboxName($element);
            if (name) {
                $checkbox.attr('name', name);
            }

            $label.prepend($checkbox);
            

            var selected = $element.prop('selected') || false;
            $checkbox.val(value);

            if (value === this.options.selectAllValue) {
                $li.addClass("multiselect-item multiselect-all");
                $checkbox.parent().parent()
                    .addClass('multiselect-all');
            }

            $label.attr('title', $element.attr('title'));

            this.$ul.append($li);

            if ($element.is(':disabled')) {
                $checkbox.attr('disabled', 'disabled')
                    .prop('disabled', true)
                    .closest('a')
                    .attr("tabindex", "-1")
                    .closest('li')
                    .addClass('disabled');
            }

            $checkbox.prop('checked', selected);

            $checkbox.after("<i></i>");

            if (selected && this.options.selectedClass) {
                $checkbox.closest('li')
                    .addClass(this.options.selectedClass);
            }
        },

        /**
         * Creates a divider using the given select option.
         *
         * @param {jQuery} element
         */
        createDivider: function(element) {
            var $divider = $(this.options.templates.divider);
            this.$ul.append($divider);
        },

        /**
         * Creates an optgroup.
         *
         * @param {jQuery} group
         */
        createOptgroup: function(group) {
            var label = $(group).attr("label");
            var value = $(group).attr("value");
            var $li = $('<li class="multiselect-item multiselect-group"><a href="javascript:void(0);"><label><b></b></label></a></li>');

            var classes = this.options.optionClass(group);
            $li.addClass(classes);

            if (this.options.enableHTML) {
                $('label b', $li).html(" " + label);
            }
            else {
                $('label b', $li).text(" " + label);
            }

            if (this.options.enableCollapsibleOptGroups && this.options.multiple) {
                $('a', $li).append('<span class="caret-container"><b class="caret"></b></span>');
            }

            if (this.options.enableClickableOptGroups && this.options.multiple) {
                $('a label', $li).prepend('<input type="checkbox" value="' + value + '"/>');
            }

            if ($(group).is(':disabled')) {
                $li.addClass('disabled');
            }

            this.$ul.append($li);

            $("option", group).each($.proxy(function($, group) {
                this.createOptionValue(group);
            }, this))
        },

        /**
         * Build the reset.
         *
         */
        buildReset: function() {
            if (this.options.includeResetOption) {

                // Check whether to add a divider after the reset.
                if (this.options.includeResetDivider) {
                    this.$ul.prepend($(this.options.templates.divider));
                }

                var $resetButton = $(this.options.templates.resetButton);

                if (this.options.enableHTML) {
                    $('a', $resetButton).html(this.options.resetText);
                }
                else {
                    $('a', $resetButton).text(this.options.resetText);
                }

                $('a', $resetButton).click($.proxy(function(){
                    this.clearSelection();
                }, this));

                this.$ul.prepend($resetButton);
            }
        },

        /**
         * Build the select all.
         *
         * Checks if a select all has already been created.
         */
        buildSelectAll: function() {
            if (typeof this.options.selectAllValue === 'number') {
                this.options.selectAllValue = this.options.selectAllValue.toString();
            }

            var alreadyHasSelectAll = this.hasSelectAll();

            if (!alreadyHasSelectAll && this.options.includeSelectAllOption && this.options.multiple
                    && $('option', this.$select).length > this.options.includeSelectAllIfMoreThan) {

                // Check whether to add a divider after the select all.
                if (this.options.includeSelectAllDivider) {
                    this.$ul.prepend($(this.options.templates.divider));
                }

                var $li = $(this.options.templates.li);
                $('label', $li).addClass("checkbox");

                if (this.options.enableHTML) {
                    $('label', $li).html(" " + this.options.selectAllText);
                }
                else {
                    $('label', $li).text(" " + this.options.selectAllText);
                }

                if (this.options.selectAllName) {
                    $('label', $li).prepend('<input type="checkbox" name="' + this.options.selectAllName + '" /><i></i>');
                }
                else {
                    $('label', $li).prepend('<input type="checkbox" /><i></i>');
                }

                var $checkbox = $('input', $li);
                $checkbox.val(this.options.selectAllValue);

                $li.addClass("multiselect-item multiselect-all");
                $checkbox.parent().parent()
                    .addClass('multiselect-all');

                this.$ul.prepend($li);

                $checkbox.prop('checked', false);
            }
        },

        /**
         * Builds the filter.
         */
        buildFilter: function() {

            // Build filter if filtering OR case insensitive filtering is enabled and the number of options exceeds (or equals) enableFilterLength.
            if (this.options.enableFiltering || this.options.enableCaseInsensitiveFiltering) {
                var enableFilterLength = Math.max(this.options.enableFiltering, this.options.enableCaseInsensitiveFiltering);

                if (this.$select.find('option').length >= enableFilterLength) {

                    this.$filter = $(this.options.templates.filter);
                    $('input', this.$filter).attr('placeholder', this.options.filterPlaceholder);

                    // Adds optional filter clear button
                    if(this.options.includeFilterClearBtn) {
                        var clearBtn = $(this.options.templates.filterClearBtn);
                        clearBtn.on('click', $.proxy(function(event){
                            clearTimeout(this.searchTimeout);

                            this.query = '';
                            this.$filter.find('.multiselect-search').val('');
                            $('li', this.$ul).show().removeClass('multiselect-filter-hidden');

                            this.updateSelectAll();

                            if (this.options.enableClickableOptGroups && this.options.multiple) {
                                this.updateOptGroups();
                            }

                        }, this));
                        this.$filter.find('.input-group').append(clearBtn);
                    }

                    this.$ul.prepend(this.$filter);

                    this.$filter.val(this.query).on('click', function(event) {
                        event.stopPropagation();
                    }).on('input keydown', $.proxy(function(event) {
                        // Cancel enter key default behaviour
                        if (event.which === 13) {
                          event.preventDefault();
                      }

                        // This is useful to catch "keydown" events after the browser has updated the control.
                        clearTimeout(this.searchTimeout);

                        this.searchTimeout = this.asyncFunction($.proxy(function() {

                            if (this.query !== event.target.value) {
                                this.query = event.target.value;

                                var currentGroup, currentGroupVisible;
                                $.each($('li', this.$ul), $.proxy(function(index, element) {
                                    var value = $('input', element).length > 0 ? $('input', element).val() : "";
                                    var text = $('label', element).text();

                                    var filterCandidate = '';
                                    if ((this.options.filterBehavior === 'text')) {
                                        filterCandidate = text;
                                    }
                                    else if ((this.options.filterBehavior === 'value')) {
                                        filterCandidate = value;
                                    }
                                    else if (this.options.filterBehavior === 'both') {
                                        filterCandidate = text + '\n' + value;
                                    }

                                    if (value !== this.options.selectAllValue && text) {

                                        // By default lets assume that element is not
                                        // interesting for this search.
                                        var showElement = false;

                                        if (this.options.enableCaseInsensitiveFiltering) {
                                            filterCandidate = filterCandidate.toLowerCase();
                                            this.query = this.query.toLowerCase();
                                        }

                                        if (this.options.enableFullValueFiltering && this.options.filterBehavior !== 'both') {
                                            var valueToMatch = filterCandidate.trim().substring(0, this.query.length);
                                            if (this.query.indexOf(valueToMatch) > -1) {
                                                showElement = true;
                                            }
                                        }
                                        else if (filterCandidate.indexOf(this.query) > -1) {
                                            showElement = true;
                                        }

                                        // Toggle current element (group or group item) according to showElement boolean.
                                        if(!showElement){
                                          $(element).css('display', 'none');
                                          $(element).addClass('multiselect-filter-hidden');
                                        }
                                        if(showElement){
                                          $(element).css('display', 'block');
                                          $(element).removeClass('multiselect-filter-hidden');
                                        }

                                        // Differentiate groups and group items.
                                        if ($(element).hasClass('multiselect-group')) {
                                            // Remember group status.
                                            currentGroup = element;
                                            currentGroupVisible = showElement;
                                        }
                                        else {
                                            // Show group name when at least one of its items is visible.
                                            if (showElement) {
                                                $(currentGroup).show()
                                                    .removeClass('multiselect-filter-hidden');
                                            }

                                            // Show all group items when group name satisfies filter.
                                            if (!showElement && currentGroupVisible) {
                                                $(element).show()
                                                    .removeClass('multiselect-filter-hidden');
                                            }
                                        }
                                    }
                                }, this));
                            }

                            this.updateSelectAll();

                            if (this.options.enableClickableOptGroups && this.options.multiple) {
                                this.updateOptGroups();
                            }

                            this.options.onFiltering(event.target);

                        }, this), 300, this);
                    }, this));
                }
            }
        },

        /**
         * Unbinds the whole plugin.
         */
        destroy: function() {
            this.$container.remove();
            this.$select.show();

            // reset original state
            this.$select.prop('disabled', this.options.wasDisabled);

            this.$select.data('multiselect', null);
        },

        /**
         * Refreshs the multiselect based on the selected options of the select.
         */
        refresh: function () {
            var inputs = {};
            $('li input', this.$ul).each(function() {
              inputs[$(this).val()] = $(this);
            });

            $('option', this.$select).each($.proxy(function (index, element) {
                var $elem = $(element);
                var $input = inputs[$(element).val()];

                if ($elem.is(':selected')) {
                    $input.prop('checked', true);

                    if (this.options.selectedClass) {
                        $input.closest('li')
                            .addClass(this.options.selectedClass);
                    }
                }
                else {
                    $input.prop('checked', false);

                    if (this.options.selectedClass) {
                        $input.closest('li')
                            .removeClass(this.options.selectedClass);
                    }
                }

                if ($elem.is(":disabled")) {
                    $input.attr('disabled', 'disabled')
                        .prop('disabled', true)
                        .closest('li')
                        .addClass('disabled');
                }
                else {
                    $input.prop('disabled', false)
                        .closest('li')
                        .removeClass('disabled');
                }
            }, this));

            this.updateButtonText();
            this.updateSelectAll();

            if (this.options.enableClickableOptGroups && this.options.multiple) {
                this.updateOptGroups();
            }
        },

        /**
         * Select all options of the given values.
         *
         * If triggerOnChange is set to true, the on change event is triggered if
         * and only if one value is passed.
         *
         * @param {Array} selectValues
         * @param {Boolean} triggerOnChange
         */
        select: function(selectValues, triggerOnChange) {
            if(!$.isArray(selectValues)) {
                selectValues = [selectValues];
            }

            for (var i = 0; i < selectValues.length; i++) {
                var value = selectValues[i];

                if (value === null || value === undefined) {
                    continue;
                }

                var $option = this.getOptionByValue(value);
                var $checkbox = this.getInputByValue(value);

                if($option === undefined || $checkbox === undefined) {
                    continue;
                }

                if (!this.options.multiple) {
                    this.deselectAll(false);
                }

                if (this.options.selectedClass) {
                    $checkbox.closest('li')
                        .addClass(this.options.selectedClass);
                }

                $checkbox.prop('checked', true);
                $option.prop('selected', true);

                if (triggerOnChange) {
                    this.options.onChange($option, true);
                }
            }

            this.updateButtonText();
            this.updateSelectAll();

            if (this.options.enableClickableOptGroups && this.options.multiple) {
                this.updateOptGroups();
            }
        },

        /**
         * Clears all selected items.
         */
        clearSelection: function () {
            this.deselectAll(false);
            this.updateButtonText();
            this.updateSelectAll();

            if (this.options.enableClickableOptGroups && this.options.multiple) {
                this.updateOptGroups();
            }
        },

        /**
         * Deselects all options of the given values.
         *
         * If triggerOnChange is set to true, the on change event is triggered, if
         * and only if one value is passed.
         *
         * @param {Array} deselectValues
         * @param {Boolean} triggerOnChange
         */
        deselect: function(deselectValues, triggerOnChange) {
            if(!$.isArray(deselectValues)) {
                deselectValues = [deselectValues];
            }

            for (var i = 0; i < deselectValues.length; i++) {
                var value = deselectValues[i];

                if (value === null || value === undefined) {
                    continue;
                }

                var $option = this.getOptionByValue(value);
                var $checkbox = this.getInputByValue(value);

                if($option === undefined || $checkbox === undefined) {
                    continue;
                }

                if (this.options.selectedClass) {
                    $checkbox.closest('li')
                        .removeClass(this.options.selectedClass);
                }

                $checkbox.prop('checked', false);
                $option.prop('selected', false);

                if (triggerOnChange) {
                    this.options.onChange($option, false);
                }
            }

            this.updateButtonText();
            this.updateSelectAll();

            if (this.options.enableClickableOptGroups && this.options.multiple) {
                this.updateOptGroups();
            }
        },

        /**
         * Selects all enabled & visible options.
         *
         * If justVisible is true or not specified, only visible options are selected.
         *
         * @param {Boolean} justVisible
         * @param {Boolean} triggerOnSelectAll
         */
        selectAll: function (justVisible, triggerOnSelectAll) {

            var justVisible = typeof justVisible === 'undefined' ? true : justVisible;
            var allLis = $("li:not(.divider):not(.disabled):not(.multiselect-group)", this.$ul);
            var visibleLis = $("li:not(.divider):not(.disabled):not(.multiselect-group):not(.multiselect-filter-hidden):not(.multiselect-collapisble-hidden)", this.$ul).filter(':visible');

            if(justVisible) {
                $('input:enabled' , visibleLis).prop('checked', true);
                visibleLis.addClass(this.options.selectedClass);

                $('input:enabled' , visibleLis).each($.proxy(function(index, element) {
                    var value = $(element).val();
                    var option = this.getOptionByValue(value);
                    $(option).prop('selected', true);
                }, this));
            }
            else {
                $('input:enabled' , allLis).prop('checked', true);
                allLis.addClass(this.options.selectedClass);

                $('input:enabled' , allLis).each($.proxy(function(index, element) {
                    var value = $(element).val();
                    var option = this.getOptionByValue(value);
                    $(option).prop('selected', true);
                }, this));
            }

            $('li input[value="' + this.options.selectAllValue + '"]', this.$ul).prop('checked', true);

            if (this.options.enableClickableOptGroups && this.options.multiple) {
                this.updateOptGroups();
            }

            if (triggerOnSelectAll) {
                this.options.onSelectAll();
            }
        },

        /**
         * Deselects all options.
         *
         * If justVisible is true or not specified, only visible options are deselected.
         *
         * @param {Boolean} justVisible
         */
        deselectAll: function (justVisible, triggerOnDeselectAll) {

            var justVisible = typeof justVisible === 'undefined' ? true : justVisible;
            var allLis = $("li:not(.divider):not(.disabled):not(.multiselect-group)", this.$ul);
            var visibleLis = $("li:not(.divider):not(.disabled):not(.multiselect-group):not(.multiselect-filter-hidden):not(.multiselect-collapisble-hidden)", this.$ul).filter(':visible');

            if(justVisible) {
                $('input[type="checkbox"]:enabled' , visibleLis).prop('checked', false);
                visibleLis.removeClass(this.options.selectedClass);

                $('input[type="checkbox"]:enabled' , visibleLis).each($.proxy(function(index, element) {
                    var value = $(element).val();
                    var option = this.getOptionByValue(value);
                    $(option).prop('selected', false);
                }, this));
            }
            else {
                $('input[type="checkbox"]:enabled' , allLis).prop('checked', false);
                allLis.removeClass(this.options.selectedClass);

                $('input[type="checkbox"]:enabled' , allLis).each($.proxy(function(index, element) {
                    var value = $(element).val();
                    var option = this.getOptionByValue(value);
                    $(option).prop('selected', false);
                }, this));
            }

            $('li input[value="' + this.options.selectAllValue + '"]', this.$ul).prop('checked', false);

            if (this.options.enableClickableOptGroups && this.options.multiple) {
                this.updateOptGroups();
            }

            if (triggerOnDeselectAll) {
                this.options.onDeselectAll();
            }
        },

        /**
         * Rebuild the plugin.
         *
         * Rebuilds the dropdown, the filter and the select all option.
         */
        rebuild: function() {
            this.$ul.html('');

            // Important to distinguish between radios and checkboxes.
            this.options.multiple = this.$select.attr('multiple') === "multiple";

            this.buildSelectAll();
            this.buildDropdownOptions();
            this.buildFilter();

            this.updateButtonText();
            this.updateSelectAll(true);

            if (this.options.enableClickableOptGroups && this.options.multiple) {
                this.updateOptGroups();
            }

            if (this.options.disableIfEmpty && $('option', this.$select).length <= 0) {
                this.disable();
            }
            else {
                this.enable();
            }

            if (this.options.dropRight) {
                this.$ul.addClass('pull-right');
            }
        },

        /**
         * The provided data will be used to build the dropdown.
         */
        dataprovider: function(dataprovider) {

            var groupCounter = 0;
            var $select = this.$select.empty();

            $.each(dataprovider, function (index, option) {
                var $tag;

                if ($.isArray(option.children)) { // create optiongroup tag
                    groupCounter++;

                    $tag = $('<optgroup/>').attr({
                        label: option.label || 'Group ' + groupCounter,
                        disabled: !!option.disabled,
                        value: option.value
                    });

                    forEach(option.children, function(subOption) { // add children option tags
                        var attributes = {
                            value: subOption.value,
                            label: subOption.label || subOption.value,
                            title: subOption.title,
                            selected: !!subOption.selected,
                            disabled: !!subOption.disabled
                        };

                        //Loop through attributes object and add key-value for each attribute
                       for (var key in subOption.attributes) {
                            attributes['data-' + key] = subOption.attributes[key];
                       }
                         //Append original attributes + new data attributes to option
                        $tag.append($('<option/>').attr(attributes));
                    });
                }
                else {

                    var attributes = {
                        'value': option.value,
                        'label': option.label || option.value,
                        'title': option.title,
                        'class': option['class'],
                        'selected': !!option['selected'],
                        'disabled': !!option['disabled']
                    };
                    //Loop through attributes object and add key-value for each attribute
                    for (var key in option.attributes) {
                      attributes['data-' + key] = option.attributes[key];
                    }
                    //Append original attributes + new data attributes to option
                    $tag = $('<option/>').attr(attributes);

                    $tag.text(option.label || option.value);
                }

                $select.append($tag);
            });

            this.rebuild();
        },

        /**
         * Enable the multiselect.
         */
        enable: function() {
            this.$select.prop('disabled', false);
            this.$button.prop('disabled', false)
                .removeClass('disabled');
        },

        /**
         * Disable the multiselect.
         */
        disable: function() {
            this.$select.prop('disabled', true);
            this.$button.prop('disabled', true)
                .addClass('disabled');
        },

        /**
         * Set the options.
         *
         * @param {Array} options
         */
        setOptions: function(options) {
            this.options = this.mergeOptions(options);
        },

        /**
         * Merges the given options with the default options.
         *
         * @param {Array} options
         * @returns {Array}
         */
        mergeOptions: function(options) {
            return $.extend(true, {}, this.defaults, this.options, options);
        },

        /**
         * Checks whether a select all checkbox is present.
         *
         * @returns {Boolean}
         */
        hasSelectAll: function() {
            return $('li.multiselect-all', this.$ul).length > 0;
        },

        /**
         * Update opt groups.
         */
        updateOptGroups: function() {
            var $groups = $('li.multiselect-group', this.$ul)
            var selectedClass = this.options.selectedClass;

            $groups.each(function() {
                var $options = $(this).nextUntil('li.multiselect-group')
                    .not('.multiselect-filter-hidden')
                    .not('.disabled');

                var checked = true;
                $options.each(function() {
                    var $input = $('input', this);

                    if (!$input.prop('checked')) {
                        checked = false;
                    }
                });

                if (selectedClass) {
                    if (checked) {
                        $(this).addClass(selectedClass);
                    }
                    else {
                        $(this).removeClass(selectedClass);
                    }
                }

                $('input', this).prop('checked', checked);
            });
        },

        /**
         * Updates the select all checkbox based on the currently displayed and selected checkboxes.
         */
        updateSelectAll: function(notTriggerOnSelectAll) {
            if (this.hasSelectAll()) {
                var allBoxes = $("li:not(.multiselect-item):not(.multiselect-filter-hidden):not(.multiselect-group):not(.disabled) input:enabled", this.$ul);
                var allBoxesLength = allBoxes.length;
                var checkedBoxesLength = allBoxes.filter(":checked").length;
                var selectAllLi  = $("li.multiselect-all", this.$ul);
                var selectAllInput = selectAllLi.find("input");

                if (checkedBoxesLength > 0 && checkedBoxesLength === allBoxesLength) {
                    selectAllInput.prop("checked", true);
                    selectAllLi.addClass(this.options.selectedClass);
                }
                else {
                    selectAllInput.prop("checked", false);
                    selectAllLi.removeClass(this.options.selectedClass);
                }
            }
        },

        /**
         * Update the button text and its title based on the currently selected options.
         */
        updateButtonText: function() {
            var options = this.getSelected();

            // First update the displayed button text.
            if (this.options.enableHTML) {
                $('.multiselect .multiselect-selected-text', this.$container).html(this.options.buttonText(options, this.$select));
            }
            else {
                $('.multiselect .multiselect-selected-text', this.$container).text(this.options.buttonText(options, this.$select));
            }

            // Now update the title attribute of the button.
            $('.multiselect', this.$container).attr('title', this.options.buttonTitle(options, this.$select));
        },

        /**
         * Get all selected options.
         *
         * @returns {jQUery}
         */
        getSelected: function() {
            return $('option', this.$select).filter(":selected");
        },

        /**
         * Gets a select option by its value.
         *
         * @param {String} value
         * @returns {jQuery}
         */
        getOptionByValue: function (value) {

            var options = $('option', this.$select);
            var valueToCompare = value.toString();

            for (var i = 0; i < options.length; i = i + 1) {
                var option = options[i];
                if (option.value === valueToCompare) {
                    return $(option);
                }
            }
        },

        /**
         * Get the input (radio/checkbox) by its value.
         *
         * @param {String} value
         * @returns {jQuery}
         */
        getInputByValue: function (value) {

            var checkboxes = $('li input:not(.multiselect-search)', this.$ul);
            var valueToCompare = value.toString();

            for (var i = 0; i < checkboxes.length; i = i + 1) {
                var checkbox = checkboxes[i];
                if (checkbox.value === valueToCompare) {
                    return $(checkbox);
                }
            }
        },

        /**
         * Used for knockout integration.
         */
        updateOriginalOptions: function() {
            this.originalOptions = this.$select.clone()[0].options;
        },

        asyncFunction: function(callback, timeout, self) {
            var args = Array.prototype.slice.call(arguments, 3);
            return setTimeout(function() {
                callback.apply(self || window, args);
            }, timeout);
        },

        setAllSelectedText: function(allSelectedText) {
            this.options.allSelectedText = allSelectedText;
            this.updateButtonText();
        }
    };

    $.fn.multiselect = function(option, parameter, extraOptions) {
        return this.each(function() {
            var data = $(this).data('multiselect');
            var options = typeof option === 'object' && option;

            // Initialize the multiselect.
            if (!data) {
                data = new Multiselect(this, options);
                $(this).data('multiselect', data);
            }

            // Call multiselect method.
            if (typeof option === 'string') {
                data[option](parameter, extraOptions);

                if (option === 'destroy') {
                    $(this).data('multiselect', false);
                }
            }
        });
    };

    $.fn.multiselect.Constructor = Multiselect;

    $(function() {
        $("select[data-role=multiselect]").multiselect();
    });

});
/**!
 * easy-pie-chart
 * Lightweight plugin to render simple, animated and retina optimized pie charts
 *
 * @license 
 * @author Robert Fleischmann <rendro87@gmail.com> (http://robert-fleischmann.de)
 * @version 2.1.7
 **/

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define(["jquery"], function (a0) {
      return (factory(a0));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"));
  } else {
    factory(jQuery);
  }
}(this, function ($) {

/**
 * Renderer to render the chart on a canvas object
 * @param {DOMElement} el      DOM element to host the canvas (root of the plugin)
 * @param {object}     options options object of the plugin
 */
var CanvasRenderer = function(el, options) {
	var cachedBackground;
	var canvas = document.createElement('canvas');

	el.appendChild(canvas);

	if (typeof(G_vmlCanvasManager) === 'object') {
		G_vmlCanvasManager.initElement(canvas);
	}

	var ctx = canvas.getContext('2d');

	canvas.width = canvas.height = options.size;

	// canvas on retina devices
	var scaleBy = 1;
	if (window.devicePixelRatio > 1) {
		scaleBy = window.devicePixelRatio;
		canvas.style.width = canvas.style.height = [options.size, 'px'].join('');
		canvas.width = canvas.height = options.size * scaleBy;
		ctx.scale(scaleBy, scaleBy);
	}

	// move 0,0 coordinates to the center
	ctx.translate(options.size / 2, options.size / 2);

	// rotate canvas -90deg
	ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI);

	var radius = (options.size - options.lineWidth) / 2;
	if (options.scaleColor && options.scaleLength) {
		radius -= options.scaleLength + 2; // 2 is the distance between scale and bar
	}

	// IE polyfill for Date
	Date.now = Date.now || function() {
		return +(new Date());
	};

	/**
	 * Draw a circle around the center of the canvas
	 * @param {strong} color     Valid CSS color string
	 * @param {number} lineWidth Width of the line in px
	 * @param {number} percent   Percentage to draw (float between -1 and 1)
	 */
	var drawCircle = function(color, lineWidth, percent) {
		percent = Math.min(Math.max(-1, percent || 0), 1);
		var isNegative = percent <= 0 ? true : false;

		ctx.beginPath();
		ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, isNegative);

		ctx.strokeStyle = color;
		ctx.lineWidth = lineWidth;

		ctx.stroke();
	};

	/**
	 * Draw the scale of the chart
	 */
	var drawScale = function() {
		var offset;
		var length;

		ctx.lineWidth = 1;
		ctx.fillStyle = options.scaleColor;

		ctx.save();
		for (var i = 24; i > 0; --i) {
			if (i % 6 === 0) {
				length = options.scaleLength;
				offset = 0;
			} else {
				length = options.scaleLength * 0.6;
				offset = options.scaleLength - length;
			}
			ctx.fillRect(-options.size/2 + offset, 0, length, 1);
			ctx.rotate(Math.PI / 12);
		}
		ctx.restore();
	};

	/**
	 * Request animation frame wrapper with polyfill
	 * @return {function} Request animation frame method or timeout fallback
	 */
	var reqAnimationFrame = (function() {
		return  window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				function(callback) {
					window.setTimeout(callback, 1000 / 60);
				};
	}());

	/**
	 * Draw the background of the plugin including the scale and the track
	 */
	var drawBackground = function() {
		if(options.scaleColor) drawScale();
		if(options.trackColor) drawCircle(options.trackColor, options.trackWidth || options.lineWidth, 1);
	};

  /**
    * Canvas accessor
   */
  this.getCanvas = function() {
    return canvas;
  };

  /**
    * Canvas 2D context 'ctx' accessor
   */
  this.getCtx = function() {
    return ctx;
  };

	/**
	 * Clear the complete canvas
	 */
	this.clear = function() {
		ctx.clearRect(options.size / -2, options.size / -2, options.size, options.size);
	};

	/**
	 * Draw the complete chart
	 * @param {number} percent Percent shown by the chart between -100 and 100
	 */
	this.draw = function(percent) {
		// do we need to render a background
		if (!!options.scaleColor || !!options.trackColor) {
			// getImageData and putImageData are supported
			if (ctx.getImageData && ctx.putImageData) {
				if (!cachedBackground) {
					drawBackground();
					cachedBackground = ctx.getImageData(0, 0, options.size * scaleBy, options.size * scaleBy);
				} else {
					ctx.putImageData(cachedBackground, 0, 0);
				}
			} else {
				this.clear();
				drawBackground();
			}
		} else {
			this.clear();
		}

		ctx.lineCap = options.lineCap;

		// if barcolor is a function execute it and pass the percent as a value
		var color;
		if (typeof(options.barColor) === 'function') {
			color = options.barColor(percent);
		} else {
			color = options.barColor;
		}

		// draw bar
		drawCircle(color, options.lineWidth, percent / 100);
	}.bind(this);

	/**
	 * Animate from some percent to some other percentage
	 * @param {number} from Starting percentage
	 * @param {number} to   Final percentage
	 */
	this.animate = function(from, to) {
		var startTime = Date.now();
		options.onStart(from, to);
		var animation = function() {
			var process = Math.min(Date.now() - startTime, options.animate.duration);
			var currentValue = options.easing(this, process, from, to - from, options.animate.duration);
			this.draw(currentValue);
			options.onStep(from, to, currentValue);
			if (process >= options.animate.duration) {
				options.onStop(from, to);
			} else {
				reqAnimationFrame(animation);
			}
		}.bind(this);

		reqAnimationFrame(animation);
	}.bind(this);
};

var EasyPieChart = function(el, opts) {
	var defaultOptions = {
		barColor: '#ef1e25',
		trackColor: '#f9f9f9',
		scaleColor: '#dfe0e0',
		scaleLength: 5,
		lineCap: 'round',
		lineWidth: 3,
		trackWidth: undefined,
		size: 110,
		rotate: 0,
		animate: {
			duration: 1000,
			enabled: true
		},
		easing: function (x, t, b, c, d) { // more can be found here: http://gsgd.co.uk/sandbox/jquery/easing/
			t = t / (d/2);
			if (t < 1) {
				return c / 2 * t * t + b;
			}
			return -c/2 * ((--t)*(t-2) - 1) + b;
		},
		onStart: function(from, to) {
			return;
		},
		onStep: function(from, to, currentValue) {
			return;
		},
		onStop: function(from, to) {
			return;
		}
	};

	// detect present renderer
	if (typeof(CanvasRenderer) !== 'undefined') {
		defaultOptions.renderer = CanvasRenderer;
	} else if (typeof(SVGRenderer) !== 'undefined') {
		defaultOptions.renderer = SVGRenderer;
	} else {
		throw new Error('Please load either the SVG- or the CanvasRenderer');
	}

	var options = {};
	var currentValue = 0;

	/**
	 * Initialize the plugin by creating the options object and initialize rendering
	 */
	var init = function() {
		this.el = el;
		this.options = options;

		// merge user options into default options
		for (var i in defaultOptions) {
			if (defaultOptions.hasOwnProperty(i)) {
				options[i] = opts && typeof(opts[i]) !== 'undefined' ? opts[i] : defaultOptions[i];
				if (typeof(options[i]) === 'function') {
					options[i] = options[i].bind(this);
				}
			}
		}

		// check for jQuery easing
		if (typeof(options.easing) === 'string' && typeof(jQuery) !== 'undefined' && jQuery.isFunction(jQuery.easing[options.easing])) {
			options.easing = jQuery.easing[options.easing];
		} else {
			options.easing = defaultOptions.easing;
		}

		// process earlier animate option to avoid bc breaks
		if (typeof(options.animate) === 'number') {
			options.animate = {
				duration: options.animate,
				enabled: true
			};
		}

		if (typeof(options.animate) === 'boolean' && !options.animate) {
			options.animate = {
				duration: 1000,
				enabled: options.animate
			};
		}

		// create renderer
		this.renderer = new options.renderer(el, options);

		// initial draw
		this.renderer.draw(currentValue);

		// initial update
		if (el.dataset && el.dataset.percent) {
			this.update(parseFloat(el.dataset.percent));
		} else if (el.getAttribute && el.getAttribute('data-percent')) {
			this.update(parseFloat(el.getAttribute('data-percent')));
		}
	}.bind(this);

	/**
	 * Update the value of the chart
	 * @param  {number} newValue Number between 0 and 100
	 * @return {object}          Instance of the plugin for method chaining
	 */
	this.update = function(newValue) {
		newValue = parseFloat(newValue);
		if (options.animate.enabled) {
			this.renderer.animate(currentValue, newValue);
		} else {
			this.renderer.draw(newValue);
		}
		currentValue = newValue;
		return this;
	}.bind(this);

	/**
	 * Disable animation
	 * @return {object} Instance of the plugin for method chaining
	 */
	this.disableAnimation = function() {
		options.animate.enabled = false;
		return this;
	};

	/**
	 * Enable animation
	 * @return {object} Instance of the plugin for method chaining
	 */
	this.enableAnimation = function() {
		options.animate.enabled = true;
		return this;
	};

	init();
};

$.fn.easyPieChart = function(options) {
	return this.each(function() {
		var instanceOptions;

		if (!$.data(this, 'easyPieChart')) {
			instanceOptions = $.extend({}, options, $(this).data());
			$.data(this, 'easyPieChart', new EasyPieChart(this, instanceOptions));
		}
	});
};


}));

document.addEventListener('DOMContentLoaded', function () {
	/* 	Easy pie chart Snippet
		DOC: make sure to include this snippet in your project to be able to use the easy 
		configurations without any jquery implementations
	 */
	$('.js-easy-pie-chart').each(function() {

		var $this = $(this),
			barcolor = $this.css('color') || color.primary._700,
			trackcolor = $this.data('trackcolor') || 'rgba(0,0,0,0.04)',
			size = parseInt($this.data('piesize')) || 50,
			scalecolor =   $this.data('scalecolor') || $this.css('color'),
			scalelength = parseInt($this.data('scalelength')) || 0,
			linewidth = parseInt($this.data('linewidth')) ||  parseInt(size / 8.5),
			linecap = $this.data('linecap') || 'butt'; //butt, round and square.
			
		$this.easyPieChart({
			size : size,
			barColor : barcolor,
			trackColor : trackcolor,
			scaleColor: scalecolor,
			scaleLength: scalelength, //Length of the scale lines (reduces the radius of the chart).
			lineCap : linecap, //Defines how the ending of the bar line looks like. Possible values are: butt, round and square.
			lineWidth : linewidth,
			animate: {
				duration: 1500,
				enabled: true
			},
			onStep: function(from, to, percent) {
				$(this.el).find('.js-percent').text(Math.round(percent));
			}
		});

		$this = null;
	});
});
/*! Select2 4.1.0-rc.0 | https://github.com/select2/select2/blob/master/LICENSE.md */
!function (n) { "function" == typeof define && define.amd ? define(["jquery"], n) : "object" == typeof module && module.exports ? module.exports = function (e, t) { return void 0 === t && (t = "undefined" != typeof window ? require("jquery") : require("jquery")(e)), n(t), t } : n(jQuery) }(function (t) { var e, n, s, p, r, o, h, f, g, m, y, v, i, a, _, s = ((u = t && t.fn && t.fn.select2 && t.fn.select2.amd ? t.fn.select2.amd : u) && u.requirejs || (u ? n = u : u = {}, g = {}, m = {}, y = {}, v = {}, i = Object.prototype.hasOwnProperty, a = [].slice, _ = /\.js$/, h = function (e, t) { var n, s, i = c(e), r = i[0], t = t[1]; return e = i[1], r && (n = x(r = l(r, t))), r ? e = n && n.normalize ? n.normalize(e, (s = t, function (e) { return l(e, s) })) : l(e, t) : (r = (i = c(e = l(e, t)))[0], e = i[1], r && (n = x(r))), { f: r ? r + "!" + e : e, n: e, pr: r, p: n } }, f = { require: function (e) { return w(e) }, exports: function (e) { var t = g[e]; return void 0 !== t ? t : g[e] = {} }, module: function (e) { return { id: e, uri: "", exports: g[e], config: (t = e, function () { return y && y.config && y.config[t] || {} }) }; var t } }, r = function (e, t, n, s) { var i, r, o, a, l, c = [], u = typeof n, d = A(s = s || e); if ("undefined" == u || "function" == u) { for (t = !t.length && n.length ? ["require", "exports", "module"] : t, a = 0; a < t.length; a += 1)if ("require" === (r = (o = h(t[a], d)).f)) c[a] = f.require(e); else if ("exports" === r) c[a] = f.exports(e), l = !0; else if ("module" === r) i = c[a] = f.module(e); else if (b(g, r) || b(m, r) || b(v, r)) c[a] = x(r); else { if (!o.p) throw new Error(e + " missing " + r); o.p.load(o.n, w(s, !0), function (t) { return function (e) { g[t] = e } }(r), {}), c[a] = g[r] } u = n ? n.apply(g[e], c) : void 0, e && (i && i.exports !== p && i.exports !== g[e] ? g[e] = i.exports : u === p && l || (g[e] = u)) } else e && (g[e] = n) }, e = n = o = function (e, t, n, s, i) { if ("string" == typeof e) return f[e] ? f[e](t) : x(h(e, A(t)).f); if (!e.splice) { if ((y = e).deps && o(y.deps, y.callback), !t) return; t.splice ? (e = t, t = n, n = null) : e = p } return t = t || function () { }, "function" == typeof n && (n = s, s = i), s ? r(p, e, t, n) : setTimeout(function () { r(p, e, t, n) }, 4), o }, o.config = function (e) { return o(e) }, e._defined = g, (s = function (e, t, n) { if ("string" != typeof e) throw new Error("See almond README: incorrect module build, no module name"); t.splice || (n = t, t = []), b(g, e) || b(m, e) || (m[e] = [e, t, n]) }).amd = { jQuery: !0 }, u.requirejs = e, u.require = n, u.define = s), u.define("almond", function () { }), u.define("jquery", [], function () { var e = t || $; return null == e && console && console.error && console.error("Select2: An instance of jQuery or a jQuery-compatible library was not found. Make sure that you are including jQuery before Select2 on your web page."), e }), u.define("select2/utils", ["jquery"], function (r) { var s = {}; function c(e) { var t, n = e.prototype, s = []; for (t in n) "function" == typeof n[t] && "constructor" !== t && s.push(t); return s } s.Extend = function (e, t) { var n, s = {}.hasOwnProperty; function i() { this.constructor = e } for (n in t) s.call(t, n) && (e[n] = t[n]); return i.prototype = t.prototype, e.prototype = new i, e.__super__ = t.prototype, e }, s.Decorate = function (s, i) { var e = c(i), t = c(s); function r() { var e = Array.prototype.unshift, t = i.prototype.constructor.length, n = s.prototype.constructor; 0 < t && (e.call(arguments, s.prototype.constructor), n = i.prototype.constructor), n.apply(this, arguments) } i.displayName = s.displayName, r.prototype = new function () { this.constructor = r }; for (var n = 0; n < t.length; n++) { var o = t[n]; r.prototype[o] = s.prototype[o] } for (var a = 0; a < e.length; a++) { var l = e[a]; r.prototype[l] = function (e) { var t = function () { }; e in r.prototype && (t = r.prototype[e]); var n = i.prototype[e]; return function () { return Array.prototype.unshift.call(arguments, t), n.apply(this, arguments) } }(l) } return r }; function e() { this.listeners = {} } e.prototype.on = function (e, t) { this.listeners = this.listeners || {}, e in this.listeners ? this.listeners[e].push(t) : this.listeners[e] = [t] }, e.prototype.trigger = function (e) { var t = Array.prototype.slice, n = t.call(arguments, 1); this.listeners = this.listeners || {}, 0 === (n = null == n ? [] : n).length && n.push({}), (n[0]._type = e) in this.listeners && this.invoke(this.listeners[e], t.call(arguments, 1)), "*" in this.listeners && this.invoke(this.listeners["*"], arguments) }, e.prototype.invoke = function (e, t) { for (var n = 0, s = e.length; n < s; n++)e[n].apply(this, t) }, s.Observable = e, s.generateChars = function (e) { for (var t = "", n = 0; n < e; n++)t += Math.floor(36 * Math.random()).toString(36); return t }, s.bind = function (e, t) { return function () { e.apply(t, arguments) } }, s._convertData = function (e) { for (var t in e) { var n = t.split("-"), s = e; if (1 !== n.length) { for (var i = 0; i < n.length; i++) { var r = n[i]; (r = r.substring(0, 1).toLowerCase() + r.substring(1)) in s || (s[r] = {}), i == n.length - 1 && (s[r] = e[t]), s = s[r] } delete e[t] } } return e }, s.hasScroll = function (e, t) { var n = r(t), s = t.style.overflowX, i = t.style.overflowY; return (s !== i || "hidden" !== i && "visible" !== i) && ("scroll" === s || "scroll" === i || (n.innerHeight() < t.scrollHeight || n.innerWidth() < t.scrollWidth)) }, s.escapeMarkup = function (e) { var t = { "\\": "&#92;", "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "/": "&#47;" }; return "string" != typeof e ? e : String(e).replace(/[&<>"'\/\\]/g, function (e) { return t[e] }) }, s.__cache = {}; var n = 0; return s.GetUniqueElementId = function (e) { var t = e.getAttribute("data-select2-id"); return null != t || (t = e.id ? "select2-data-" + e.id : "select2-data-" + (++n).toString() + "-" + s.generateChars(4), e.setAttribute("data-select2-id", t)), t }, s.StoreData = function (e, t, n) { e = s.GetUniqueElementId(e); s.__cache[e] || (s.__cache[e] = {}), s.__cache[e][t] = n }, s.GetData = function (e, t) { var n = s.GetUniqueElementId(e); return t ? s.__cache[n] && null != s.__cache[n][t] ? s.__cache[n][t] : r(e).data(t) : s.__cache[n] }, s.RemoveData = function (e) { var t = s.GetUniqueElementId(e); null != s.__cache[t] && delete s.__cache[t], e.removeAttribute("data-select2-id") }, s.copyNonInternalCssClasses = function (e, t) { var n = (n = e.getAttribute("class").trim().split(/\s+/)).filter(function (e) { return 0 === e.indexOf("select2-") }), t = (t = t.getAttribute("class").trim().split(/\s+/)).filter(function (e) { return 0 !== e.indexOf("select2-") }), t = n.concat(t); e.setAttribute("class", t.join(" ")) }, s }), u.define("select2/results", ["jquery", "./utils"], function (d, p) { function s(e, t, n) { this.$element = e, this.data = n, this.options = t, s.__super__.constructor.call(this) } return p.Extend(s, p.Observable), s.prototype.render = function () { var e = d('<ul class="select2-results__options" role="listbox"></ul>'); return this.options.get("multiple") && e.attr("aria-multiselectable", "true"), this.$results = e }, s.prototype.clear = function () { this.$results.empty() }, s.prototype.displayMessage = function (e) { var t = this.options.get("escapeMarkup"); this.clear(), this.hideLoading(); var n = d('<li role="alert" aria-live="assertive" class="select2-results__option"></li>'), s = this.options.get("translations").get(e.message); n.append(t(s(e.args))), n[0].className += " select2-results__message", this.$results.append(n) }, s.prototype.hideMessages = function () { this.$results.find(".select2-results__message").remove() }, s.prototype.append = function (e) { this.hideLoading(); var t = []; if (null != e.results && 0 !== e.results.length) { e.results = this.sort(e.results); for (var n = 0; n < e.results.length; n++) { var s = e.results[n], s = this.option(s); t.push(s) } this.$results.append(t) } else 0 === this.$results.children().length && this.trigger("results:message", { message: "noResults" }) }, s.prototype.position = function (e, t) { t.find(".select2-results").append(e) }, s.prototype.sort = function (e) { return this.options.get("sorter")(e) }, s.prototype.highlightFirstItem = function () { var e = this.$results.find(".select2-results__option--selectable"), t = e.filter(".select2-results__option--selected"); (0 < t.length ? t : e).first().trigger("mouseenter"), this.ensureHighlightVisible() }, s.prototype.setClasses = function () { var t = this; this.data.current(function (e) { var s = e.map(function (e) { return e.id.toString() }); t.$results.find(".select2-results__option--selectable").each(function () { var e = d(this), t = p.GetData(this, "data"), n = "" + t.id; null != t.element && t.element.selected || null == t.element && -1 < s.indexOf(n) ? (this.classList.add("select2-results__option--selected"), e.attr("aria-selected", "true")) : (this.classList.remove("select2-results__option--selected"), e.attr("aria-selected", "false")) }) }) }, s.prototype.showLoading = function (e) { this.hideLoading(); e = { disabled: !0, loading: !0, text: this.options.get("translations").get("searching")(e) }, e = this.option(e); e.className += " loading-results", this.$results.prepend(e) }, s.prototype.hideLoading = function () { this.$results.find(".loading-results").remove() }, s.prototype.option = function (e) { var t = document.createElement("li"); t.classList.add("select2-results__option"), t.classList.add("select2-results__option--selectable"); var n, s = { role: "option" }, i = window.Element.prototype.matches || window.Element.prototype.msMatchesSelector || window.Element.prototype.webkitMatchesSelector; for (n in (null != e.element && i.call(e.element, ":disabled") || null == e.element && e.disabled) && (s["aria-disabled"] = "true", t.classList.remove("select2-results__option--selectable"), t.classList.add("select2-results__option--disabled")), null == e.id && t.classList.remove("select2-results__option--selectable"), null != e._resultId && (t.id = e._resultId), e.title && (t.title = e.title), e.children && (s.role = "group", s["aria-label"] = e.text, t.classList.remove("select2-results__option--selectable"), t.classList.add("select2-results__option--group")), s) { var r = s[n]; t.setAttribute(n, r) } if (e.children) { var o = d(t), a = document.createElement("strong"); a.className = "select2-results__group", this.template(e, a); for (var l = [], c = 0; c < e.children.length; c++) { var u = e.children[c], u = this.option(u); l.push(u) } i = d("<ul></ul>", { class: "select2-results__options select2-results__options--nested", role: "none" }); i.append(l), o.append(a), o.append(i) } else this.template(e, t); return p.StoreData(t, "data", e), t }, s.prototype.bind = function (t, e) { var i = this, n = t.id + "-results"; this.$results.attr("id", n), t.on("results:all", function (e) { i.clear(), i.append(e.data), t.isOpen() && (i.setClasses(), i.highlightFirstItem()) }), t.on("results:append", function (e) { i.append(e.data), t.isOpen() && i.setClasses() }), t.on("query", function (e) { i.hideMessages(), i.showLoading(e) }), t.on("select", function () { t.isOpen() && (i.setClasses(), i.options.get("scrollAfterSelect") && i.highlightFirstItem()) }), t.on("unselect", function () { t.isOpen() && (i.setClasses(), i.options.get("scrollAfterSelect") && i.highlightFirstItem()) }), t.on("open", function () { i.$results.attr("aria-expanded", "true"), i.$results.attr("aria-hidden", "false"), i.setClasses(), i.ensureHighlightVisible() }), t.on("close", function () { i.$results.attr("aria-expanded", "false"), i.$results.attr("aria-hidden", "true"), i.$results.removeAttr("aria-activedescendant") }), t.on("results:toggle", function () { var e = i.getHighlightedResults(); 0 !== e.length && e.trigger("mouseup") }), t.on("results:select", function () { var e, t = i.getHighlightedResults(); 0 !== t.length && (e = p.GetData(t[0], "data"), t.hasClass("select2-results__option--selected") ? i.trigger("close", {}) : i.trigger("select", { data: e })) }), t.on("results:previous", function () { var e, t = i.getHighlightedResults(), n = i.$results.find(".select2-results__option--selectable"), s = n.index(t); s <= 0 || (e = s - 1, 0 === t.length && (e = 0), (s = n.eq(e)).trigger("mouseenter"), t = i.$results.offset().top, n = s.offset().top, s = i.$results.scrollTop() + (n - t), 0 === e ? i.$results.scrollTop(0) : n - t < 0 && i.$results.scrollTop(s)) }), t.on("results:next", function () { var e, t = i.getHighlightedResults(), n = i.$results.find(".select2-results__option--selectable"), s = n.index(t) + 1; s >= n.length || ((e = n.eq(s)).trigger("mouseenter"), t = i.$results.offset().top + i.$results.outerHeight(!1), n = e.offset().top + e.outerHeight(!1), e = i.$results.scrollTop() + n - t, 0 === s ? i.$results.scrollTop(0) : t < n && i.$results.scrollTop(e)) }), t.on("results:focus", function (e) { e.element[0].classList.add("select2-results__option--highlighted"), e.element[0].setAttribute("aria-selected", "true") }), t.on("results:message", function (e) { i.displayMessage(e) }), d.fn.mousewheel && this.$results.on("mousewheel", function (e) { var t = i.$results.scrollTop(), n = i.$results.get(0).scrollHeight - t + e.deltaY, t = 0 < e.deltaY && t - e.deltaY <= 0, n = e.deltaY < 0 && n <= i.$results.height(); t ? (i.$results.scrollTop(0), e.preventDefault(), e.stopPropagation()) : n && (i.$results.scrollTop(i.$results.get(0).scrollHeight - i.$results.height()), e.preventDefault(), e.stopPropagation()) }), this.$results.on("mouseup", ".select2-results__option--selectable", function (e) { var t = d(this), n = p.GetData(this, "data"); t.hasClass("select2-results__option--selected") ? i.options.get("multiple") ? i.trigger("unselect", { originalEvent: e, data: n }) : i.trigger("close", {}) : i.trigger("select", { originalEvent: e, data: n }) }), this.$results.on("mouseenter", ".select2-results__option--selectable", function (e) { var t = p.GetData(this, "data"); i.getHighlightedResults().removeClass("select2-results__option--highlighted").attr("aria-selected", "false"), i.trigger("results:focus", { data: t, element: d(this) }) }) }, s.prototype.getHighlightedResults = function () { return this.$results.find(".select2-results__option--highlighted") }, s.prototype.destroy = function () { this.$results.remove() }, s.prototype.ensureHighlightVisible = function () { var e, t, n, s, i = this.getHighlightedResults(); 0 !== i.length && (e = this.$results.find(".select2-results__option--selectable").index(i), s = this.$results.offset().top, t = i.offset().top, n = this.$results.scrollTop() + (t - s), s = t - s, n -= 2 * i.outerHeight(!1), e <= 2 ? this.$results.scrollTop(0) : (s > this.$results.outerHeight() || s < 0) && this.$results.scrollTop(n)) }, s.prototype.template = function (e, t) { var n = this.options.get("templateResult"), s = this.options.get("escapeMarkup"), e = n(e, t); null == e ? t.style.display = "none" : "string" == typeof e ? t.innerHTML = s(e) : d(t).append(e) }, s }), u.define("select2/keys", [], function () { return { BACKSPACE: 8, TAB: 9, ENTER: 13, SHIFT: 16, CTRL: 17, ALT: 18, ESC: 27, SPACE: 32, PAGE_UP: 33, PAGE_DOWN: 34, END: 35, HOME: 36, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, DELETE: 46 } }), u.define("select2/selection/base", ["jquery", "../utils", "../keys"], function (n, s, i) { function r(e, t) { this.$element = e, this.options = t, r.__super__.constructor.call(this) } return s.Extend(r, s.Observable), r.prototype.render = function () { var e = n('<span class="select2-selection" role="combobox"  aria-haspopup="true" aria-expanded="false"></span>'); return this._tabindex = 0, null != s.GetData(this.$element[0], "old-tabindex") ? this._tabindex = s.GetData(this.$element[0], "old-tabindex") : null != this.$element.attr("tabindex") && (this._tabindex = this.$element.attr("tabindex")), e.attr("title", this.$element.attr("title")), e.attr("tabindex", this._tabindex), e.attr("aria-disabled", "false"), this.$selection = e }, r.prototype.bind = function (e, t) { var n = this, s = e.id + "-results"; this.container = e, this.$selection.on("focus", function (e) { n.trigger("focus", e) }), this.$selection.on("blur", function (e) { n._handleBlur(e) }), this.$selection.on("keydown", function (e) { n.trigger("keypress", e), e.which === i.SPACE && e.preventDefault() }), e.on("results:focus", function (e) { n.$selection.attr("aria-activedescendant", e.data._resultId) }), e.on("selection:update", function (e) { n.update(e.data) }), e.on("open", function () { n.$selection.attr("aria-expanded", "true"), n.$selection.attr("aria-owns", s), n._attachCloseHandler(e) }), e.on("close", function () { n.$selection.attr("aria-expanded", "false"), n.$selection.removeAttr("aria-activedescendant"), n.$selection.removeAttr("aria-owns"), n.$selection.trigger("focus"), n._detachCloseHandler(e) }), e.on("enable", function () { n.$selection.attr("tabindex", n._tabindex), n.$selection.attr("aria-disabled", "false") }), e.on("disable", function () { n.$selection.attr("tabindex", "-1"), n.$selection.attr("aria-disabled", "true") }) }, r.prototype._handleBlur = function (e) { var t = this; window.setTimeout(function () { document.activeElement == t.$selection[0] || n.contains(t.$selection[0], document.activeElement) || t.trigger("blur", e) }, 1) }, r.prototype._attachCloseHandler = function (e) { n(document.body).on("mousedown.select2." + e.id, function (e) { var t = n(e.target).closest(".select2"); n(".select2.select2-container--open").each(function () { this != t[0] && s.GetData(this, "element").select2("close") }) }) }, r.prototype._detachCloseHandler = function (e) { n(document.body).off("mousedown.select2." + e.id) }, r.prototype.position = function (e, t) { t.find(".selection").append(e) }, r.prototype.destroy = function () { this._detachCloseHandler(this.container) }, r.prototype.update = function (e) { throw new Error("The `update` method must be defined in child classes.") }, r.prototype.isEnabled = function () { return !this.isDisabled() }, r.prototype.isDisabled = function () { return this.options.get("disabled") }, r }), u.define("select2/selection/single", ["jquery", "./base", "../utils", "../keys"], function (e, t, n, s) { function i() { i.__super__.constructor.apply(this, arguments) } return n.Extend(i, t), i.prototype.render = function () { var e = i.__super__.render.call(this); return e[0].classList.add("select2-selection--single"), e.html('<span class="select2-selection__rendered"></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span>'), e }, i.prototype.bind = function (t, e) { var n = this; i.__super__.bind.apply(this, arguments); var s = t.id + "-container"; this.$selection.find(".select2-selection__rendered").attr("id", s).attr("role", "textbox").attr("aria-readonly", "true"), this.$selection.attr("aria-labelledby", s), this.$selection.attr("aria-controls", s), this.$selection.on("mousedown", function (e) { 1 === e.which && n.trigger("toggle", { originalEvent: e }) }), this.$selection.on("focus", function (e) { }), this.$selection.on("blur", function (e) { }), t.on("focus", function (e) { t.isOpen() || n.$selection.trigger("focus") }) }, i.prototype.clear = function () { var e = this.$selection.find(".select2-selection__rendered"); e.empty(), e.removeAttr("title") }, i.prototype.display = function (e, t) { var n = this.options.get("templateSelection"); return this.options.get("escapeMarkup")(n(e, t)) }, i.prototype.selectionContainer = function () { return e("<span></span>") }, i.prototype.update = function (e) { var t, n; 0 !== e.length ? (n = e[0], t = this.$selection.find(".select2-selection__rendered"), e = this.display(n, t), t.empty().append(e), (n = n.title || n.text) ? t.attr("title", n) : t.removeAttr("title")) : this.clear() }, i }), u.define("select2/selection/multiple", ["jquery", "./base", "../utils"], function (i, e, c) { function r(e, t) { r.__super__.constructor.apply(this, arguments) } return c.Extend(r, e), r.prototype.render = function () { var e = r.__super__.render.call(this); return e[0].classList.add("select2-selection--multiple"), e.html('<ul class="select2-selection__rendered"></ul>'), e }, r.prototype.bind = function (e, t) { var n = this; r.__super__.bind.apply(this, arguments); var s = e.id + "-container"; this.$selection.find(".select2-selection__rendered").attr("id", s), this.$selection.on("click", function (e) { n.trigger("toggle", { originalEvent: e }) }), this.$selection.on("click", ".select2-selection__choice__remove", function (e) { var t; n.isDisabled() || (t = i(this).parent(), t = c.GetData(t[0], "data"), n.trigger("unselect", { originalEvent: e, data: t })) }), this.$selection.on("keydown", ".select2-selection__choice__remove", function (e) { n.isDisabled() || e.stopPropagation() }) }, r.prototype.clear = function () { var e = this.$selection.find(".select2-selection__rendered"); e.empty(), e.removeAttr("title") }, r.prototype.display = function (e, t) { var n = this.options.get("templateSelection"); return this.options.get("escapeMarkup")(n(e, t)) }, r.prototype.selectionContainer = function () { return i('<li class="select2-selection__choice"><button type="button" class="select2-selection__choice__remove" tabindex="-1"><span aria-hidden="true">&times;</span></button><span class="select2-selection__choice__display"></span></li>') }, r.prototype.update = function (e) { if (this.clear(), 0 !== e.length) { for (var t = [], n = this.$selection.find(".select2-selection__rendered").attr("id") + "-choice-", s = 0; s < e.length; s++) { var i = e[s], r = this.selectionContainer(), o = this.display(i, r), a = n + c.generateChars(4) + "-"; i.id ? a += i.id : a += c.generateChars(4), r.find(".select2-selection__choice__display").append(o).attr("id", a); var l = i.title || i.text; l && r.attr("title", l); o = this.options.get("translations").get("removeItem"), l = r.find(".select2-selection__choice__remove"); l.attr("title", o()), l.attr("aria-label", o()), l.attr("aria-describedby", a), c.StoreData(r[0], "data", i), t.push(r) } this.$selection.find(".select2-selection__rendered").append(t) } }, r }), u.define("select2/selection/placeholder", [], function () { function e(e, t, n) { this.placeholder = this.normalizePlaceholder(n.get("placeholder")), e.call(this, t, n) } return e.prototype.normalizePlaceholder = function (e, t) { return t = "string" == typeof t ? { id: "", text: t } : t }, e.prototype.createPlaceholder = function (e, t) { var n = this.selectionContainer(); n.html(this.display(t)), n[0].classList.add("select2-selection__placeholder"), n[0].classList.remove("select2-selection__choice"); t = t.title || t.text || n.text(); return this.$selection.find(".select2-selection__rendered").attr("title", t), n }, e.prototype.update = function (e, t) { var n = 1 == t.length && t[0].id != this.placeholder.id; if (1 < t.length || n) return e.call(this, t); this.clear(); t = this.createPlaceholder(this.placeholder); this.$selection.find(".select2-selection__rendered").append(t) }, e }), u.define("select2/selection/allowClear", ["jquery", "../keys", "../utils"], function (i, s, a) { function e() { } return e.prototype.bind = function (e, t, n) { var s = this; e.call(this, t, n), null == this.placeholder && this.options.get("debug") && window.console && console.error && console.error("Select2: The `allowClear` option should be used in combination with the `placeholder` option."), this.$selection.on("mousedown", ".select2-selection__clear", function (e) { s._handleClear(e) }), t.on("keypress", function (e) { s._handleKeyboardClear(e, t) }) }, e.prototype._handleClear = function (e, t) { if (!this.isDisabled()) { var n = this.$selection.find(".select2-selection__clear"); if (0 !== n.length) { t.stopPropagation(); var s = a.GetData(n[0], "data"), i = this.$element.val(); this.$element.val(this.placeholder.id); var r = { data: s }; if (this.trigger("clear", r), r.prevented) this.$element.val(i); else { for (var o = 0; o < s.length; o++)if (r = { data: s[o] }, this.trigger("unselect", r), r.prevented) return void this.$element.val(i); this.$element.trigger("input").trigger("change"), this.trigger("toggle", {}) } } } }, e.prototype._handleKeyboardClear = function (e, t, n) { n.isOpen() || t.which != s.DELETE && t.which != s.BACKSPACE || this._handleClear(t) }, e.prototype.update = function (e, t) { var n, s; e.call(this, t), this.$selection.find(".select2-selection__clear").remove(), this.$selection[0].classList.remove("select2-selection--clearable"), 0 < this.$selection.find(".select2-selection__placeholder").length || 0 === t.length || (n = this.$selection.find(".select2-selection__rendered").attr("id"), s = this.options.get("translations").get("removeAllItems"), (e = i('<button type="button" class="select2-selection__clear" tabindex="-1"><span aria-hidden="true">&times;</span></button>')).attr("title", s()), e.attr("aria-label", s()), e.attr("aria-describedby", n), a.StoreData(e[0], "data", t), this.$selection.prepend(e), this.$selection[0].classList.add("select2-selection--clearable")) }, e }), u.define("select2/selection/search", ["jquery", "../utils", "../keys"], function (s, a, l) { function e(e, t, n) { e.call(this, t, n) } return e.prototype.render = function (e) { var t = this.options.get("translations").get("search"), n = s('<span class="select2-search select2-search--inline"><textarea class="select2-search__field" type="search" tabindex="-1" autocorrect="off" autocapitalize="none" spellcheck="false" role="searchbox" aria-autocomplete="list" ></textarea></span>'); this.$searchContainer = n, this.$search = n.find("textarea"), this.$search.prop("autocomplete", this.options.get("autocomplete")), this.$search.attr("aria-label", t()); e = e.call(this); return this._transferTabIndex(), e.append(this.$searchContainer), e }, e.prototype.bind = function (e, t, n) { var s = this, i = t.id + "-results", r = t.id + "-container"; e.call(this, t, n), s.$search.attr("aria-describedby", r), t.on("open", function () { s.$search.attr("aria-controls", i), s.$search.trigger("focus") }), t.on("close", function () { s.$search.val(""), s.resizeSearch(), s.$search.removeAttr("aria-controls"), s.$search.removeAttr("aria-activedescendant"), s.$search.trigger("focus") }), t.on("enable", function () { s.$search.prop("disabled", !1), s._transferTabIndex() }), t.on("disable", function () { s.$search.prop("disabled", !0) }), t.on("focus", function (e) { s.$search.trigger("focus") }), t.on("results:focus", function (e) { e.data._resultId ? s.$search.attr("aria-activedescendant", e.data._resultId) : s.$search.removeAttr("aria-activedescendant") }), this.$selection.on("focusin", ".select2-search--inline", function (e) { s.trigger("focus", e) }), this.$selection.on("focusout", ".select2-search--inline", function (e) { s._handleBlur(e) }), this.$selection.on("keydown", ".select2-search--inline", function (e) { var t; e.stopPropagation(), s.trigger("keypress", e), s._keyUpPrevented = e.isDefaultPrevented(), e.which !== l.BACKSPACE || "" !== s.$search.val() || 0 < (t = s.$selection.find(".select2-selection__choice").last()).length && (t = a.GetData(t[0], "data"), s.searchRemoveChoice(t), e.preventDefault()) }), this.$selection.on("click", ".select2-search--inline", function (e) { s.$search.val() && e.stopPropagation() }); var t = document.documentMode, o = t && t <= 11; this.$selection.on("input.searchcheck", ".select2-search--inline", function (e) { o ? s.$selection.off("input.search input.searchcheck") : s.$selection.off("keyup.search") }), this.$selection.on("keyup.search input.search", ".select2-search--inline", function (e) { var t; o && "input" === e.type ? s.$selection.off("input.search input.searchcheck") : (t = e.which) != l.SHIFT && t != l.CTRL && t != l.ALT && t != l.TAB && s.handleSearch(e) }) }, e.prototype._transferTabIndex = function (e) { this.$search.attr("tabindex", this.$selection.attr("tabindex")), this.$selection.attr("tabindex", "-1") }, e.prototype.createPlaceholder = function (e, t) { this.$search.attr("placeholder", t.text) }, e.prototype.update = function (e, t) { var n = this.$search[0] == document.activeElement; this.$search.attr("placeholder", ""), e.call(this, t), this.resizeSearch(), n && this.$search.trigger("focus") }, e.prototype.handleSearch = function () { var e; this.resizeSearch(), this._keyUpPrevented || (e = this.$search.val(), this.trigger("query", { term: e })), this._keyUpPrevented = !1 }, e.prototype.searchRemoveChoice = function (e, t) { this.trigger("unselect", { data: t }), this.$search.val(t.text), this.handleSearch() }, e.prototype.resizeSearch = function () { this.$search.css("width", "25px"); var e = "100%"; "" === this.$search.attr("placeholder") && (e = .75 * (this.$search.val().length + 1) + "em"), this.$search.css("width", e) }, e }), u.define("select2/selection/selectionCss", ["../utils"], function (n) { function e() { } return e.prototype.render = function (e) { var t = e.call(this), e = this.options.get("selectionCssClass") || ""; return -1 !== e.indexOf(":all:") && (e = e.replace(":all:", ""), n.copyNonInternalCssClasses(t[0], this.$element[0])), t.addClass(e), t }, e }), u.define("select2/selection/eventRelay", ["jquery"], function (o) { function e() { } return e.prototype.bind = function (e, t, n) { var s = this, i = ["open", "opening", "close", "closing", "select", "selecting", "unselect", "unselecting", "clear", "clearing"], r = ["opening", "closing", "selecting", "unselecting", "clearing"]; e.call(this, t, n), t.on("*", function (e, t) { var n; -1 !== i.indexOf(e) && (t = t || {}, n = o.Event("select2:" + e, { params: t }), s.$element.trigger(n), -1 !== r.indexOf(e) && (t.prevented = n.isDefaultPrevented())) }) }, e }), u.define("select2/translation", ["jquery", "require"], function (t, n) { function s(e) { this.dict = e || {} } return s.prototype.all = function () { return this.dict }, s.prototype.get = function (e) { return this.dict[e] }, s.prototype.extend = function (e) { this.dict = t.extend({}, e.all(), this.dict) }, s._cache = {}, s.loadPath = function (e) { var t; return e in s._cache || (t = n(e), s._cache[e] = t), new s(s._cache[e]) }, s }), u.define("select2/diacritics", [], function () { return { "?": "A", "?": "A", "�": "A", "�": "A", "�": "A", "?": "A", "?": "A", "?": "A", "?": "A", "�": "A", "?": "A", "?": "A", "?": "A", "?": "A", "?": "A", "?": "A", "?": "A", "?": "A", "�": "A", "?": "A", "?": "A", "�": "A", "?": "A", "?": "A", "?": "A", "?": "A", "?": "A", "?": "A", "?": "A", "?": "A", "?": "A", "?": "A", "?": "A", "?": "AA", "�": "AE", "?": "AE", "?": "AE", "?": "AO", "?": "AU", "?": "AV", "?": "AV", "?": "AY", "?": "B", "?": "B", "?": "B", "?": "B", "?": "B", "?": "B", "?": "B", "?": "B", "?": "C", "?": "C", "?": "C", "?": "C", "?": "C", "?": "C", "�": "C", "?": "C", "?": "C", "?": "C", "?": "C", "?": "D", "?": "D", "?": "D", "?": "D", "?": "D", "?": "D", "?": "D", "?": "D", "?": "D", "?": "D", "?": "D", "?": "D", "?": "D", "?": "DZ", "?": "DZ", "?": "Dz", "?": "Dz", "?": "E", "?": "E", "�": "E", "�": "E", "�": "E", "?": "E", "?": "E", "?": "E", "?": "E", "?": "E", "?": "E", "?": "E", "?": "E", "?": "E", "?": "E", "�": "E", "?": "E", "?": "E", "?": "E", "?": "E", "?": "E", "?": "E", "?": "E", "?": "E", "?": "E", "?": "E", "?": "E", "?": "E", "?": "E", "?": "F", "?": "F", "?": "F", "?": "F", "?": "F", "?": "G", "?": "G", "?": "G", "?": "G", "?": "G", "?": "G", "?": "G", "?": "G", "?": "G", "?": "G", "?": "G", "?": "G", "?": "G", "?": "G", "?": "H", "?": "H", "?": "H", "?": "H", "?": "H", "?": "H", "?": "H", "?": "H", "?": "H", "?": "H", "?": "H", "?": "H", "?": "H", "?": "I", "?": "I", "�": "I", "�": "I", "�": "I", "?": "I", "?": "I", "?": "I", "?": "I", "�": "I", "?": "I", "?": "I", "?": "I", "?": "I", "?": "I", "?": "I", "?": "I", "?": "I", "?": "I", "?": "J", "?": "J", "?": "J", "?": "J", "?": "K", "?": "K", "?": "K", "?": "K", "?": "K", "?": "K", "?": "K", "?": "K", "?": "K", "?": "K", "?": "K", "?": "K", "?": "K", "?": "L", "?": "L", "?": "L", "?": "L", "?": "L", "?": "L", "?": "L", "?": "L", "?": "L", "?": "L", "?": "L", "?": "L", "?": "L", "?": "L", "?": "L", "?": "L", "?": "L", "?": "LJ", "?": "Lj", "?": "M", "?": "M", "?": "M", "?": "M", "?": "M", "?": "M", "?": "M", "?": "N", "?": "N", "?": "N", "?": "N", "�": "N", "?": "N", "?": "N", "?": "N", "?": "N", "?": "N", "?": "N", "?": "N", "?": "N", "?": "N", "?": "N", "?": "NJ", "?": "Nj", "?": "O", "?": "O", "�": "O", "�": "O", "�": "O", "?": "O", "?": "O", "?": "O", "?": "O", "�": "O", "?": "O", "?": "O", "?": "O", "?": "O", "?": "O", "?": "O", "?": "O", "?": "O", "?": "O", "�": "O", "?": "O", "?": "O", "?": "O", "?": "O", "?": "O", "?": "O", "?": "O", "?": "O", "?": "O", "?": "O", "?": "O", "?": "O", "?": "O", "?": "O", "?": "O", "?": "O", "�": "O", "?": "O", "?": "O", "?": "O", "?": "O", "?": "O", "�": "OE", "?": "OI", "?": "OO", "?": "OU", "?": "P", "?": "P", "?": "P", "?": "P", "?": "P", "?": "P", "?": "P", "?": "P", "?": "P", "?": "Q", "?": "Q", "?": "Q", "?": "Q", "?": "Q", "?": "R", "?": "R", "?": "R", "?": "R", "?": "R", "?": "R", "?": "R", "?": "R", "?": "R", "?": "R", "?": "R", "?": "R", "?": "R", "?": "R", "?": "R", "?": "R", "?": "S", "?": "S", "?": "S", "?": "S", "?": "S", "?": "S", "?": "S", "�": "S", "?": "S", "?": "S", "?": "S", "?": "S", "?": "S", "?": "S", "?": "S", "?": "S", "?": "T", "?": "T", "?": "T", "?": "T", "?": "T", "?": "T", "?": "T", "?": "T", "?": "T", "?": "T", "?": "T", "?": "T", "?": "T", "?": "T", "?": "TZ", "?": "U", "?": "U", "�": "U", "�": "U", "�": "U", "?": "U", "?": "U", "?": "U", "?": "U", "?": "U", "�": "U", "?": "U", "?": "U", "?": "U", "?": "U", "?": "U", "?": "U", "?": "U", "?": "U", "?": "U", "?": "U", "?": "U", "?": "U", "?": "U", "?": "U", "?": "U", "?": "U", "?": "U", "?": "U", "?": "U", "?": "U", "?": "U", "?": "U", "?": "V", "?": "V", "?": "V", "?": "V", "?": "V", "?": "V", "?": "V", "?": "VY", "?": "W", "?": "W", "?": "W", "?": "W", "?": "W", "?": "W", "?": "W", "?": "W", "?": "W", "?": "X", "?": "X", "?": "X", "?": "X", "?": "Y", "?": "Y", "?": "Y", "�": "Y", "?": "Y", "?": "Y", "?": "Y", "?": "Y", "�": "Y", "?": "Y", "?": "Y", "?": "Y", "?": "Y", "?": "Y", "?": "Z", "?": "Z", "?": "Z", "?": "Z", "?": "Z", "�": "Z", "?": "Z", "?": "Z", "?": "Z", "?": "Z", "?": "Z", "?": "Z", "?": "Z", "?": "a", "?": "a", "?": "a", "�": "a", "�": "a", "�": "a", "?": "a", "?": "a", "?": "a", "?": "a", "�": "a", "?": "a", "?": "a", "?": "a", "?": "a", "?": "a", "?": "a", "?": "a", "?": "a", "�": "a", "?": "a", "?": "a", "�": "a", "?": "a", "?": "a", "?": "a", "?": "a", "?": "a", "?": "a", "?": "a", "?": "a", "?": "a", "?": "a", "?": "a", "?": "aa", "�": "ae", "?": "ae", "?": "ae", "?": "ao", "?": "au", "?": "av", "?": "av", "?": "ay", "?": "b", "?": "b", "?": "b", "?": "b", "?": "b", "?": "b", "?": "b", "?": "b", "?": "c", "?": "c", "?": "c", "?": "c", "?": "c", "?": "c", "�": "c", "?": "c", "?": "c", "?": "c", "?": "c", "?": "c", "?": "d", "?": "d", "?": "d", "?": "d", "?": "d", "?": "d", "?": "d", "?": "d", "?": "d", "?": "d", "?": "d", "?": "d", "?": "d", "?": "dz", "?": "dz", "?": "e", "?": "e", "�": "e", "�": "e", "�": "e", "?": "e", "?": "e", "?": "e", "?": "e", "?": "e", "?": "e", "?": "e", "?": "e", "?": "e", "?": "e", "�": "e", "?": "e", "?": "e", "?": "e", "?": "e", "?": "e", "?": "e", "?": "e", "?": "e", "?": "e", "?": "e", "?": "e", "?": "e", "?": "e", "?": "e", "?": "f", "?": "f", "?": "f", "�": "f", "?": "f", "?": "g", "?": "g", "?": "g", "?": "g", "?": "g", "?": "g", "?": "g", "?": "g", "?": "g", "?": "g", "?": "g", "?": "g", "?": "g", "?": "g", "?": "h", "?": "h", "?": "h", "?": "h", "?": "h", "?": "h", "?": "h", "?": "h", "?": "h", "?": "h", "?": "h", "?": "h", "?": "h", "?": "h", "?": "hv", "?": "i", "?": "i", "�": "i", "�": "i", "�": "i", "?": "i", "?": "i", "?": "i", "�": "i", "?": "i", "?": "i", "?": "i", "?": "i", "?": "i", "?": "i", "?": "i", "?": "i", "?": "i", "?": "i", "?": "j", "?": "j", "?": "j", "?": "j", "?": "j", "?": "k", "?": "k", "?": "k", "?": "k", "?": "k", "?": "k", "?": "k", "?": "k", "?": "k", "?": "k", "?": "k", "?": "k", "?": "k", "?": "l", "?": "l", "?": "l", "?": "l", "?": "l", "?": "l", "?": "l", "?": "l", "?": "l", "?": "l", "?": "l", "?": "l", "?": "l", "?": "l", "?": "l", "?": "l", "?": "l", "?": "l", "?": "lj", "?": "m", "?": "m", "?": "m", "?": "m", "?": "m", "?": "m", "?": "m", "?": "n", "?": "n", "?": "n", "?": "n", "�": "n", "?": "n", "?": "n", "?": "n", "?": "n", "?": "n", "?": "n", "?": "n", "?": "n", "?": "n", "?": "n", "?": "n", "?": "nj", "?": "o", "?": "o", "�": "o", "�": "o", "�": "o", "?": "o", "?": "o", "?": "o", "?": "o", "�": "o", "?": "o", "?": "o", "?": "o", "?": "o", "?": "o", "?": "o", "?": "o", "?": "o", "?": "o", "�": "o", "?": "o", "?": "o", "?": "o", "?": "o", "?": "o", "?": "o", "?": "o", "?": "o", "?": "o", "?": "o", "?": "o", "?": "o", "?": "o", "?": "o", "?": "o", "?": "o", "�": "o", "?": "o", "?": "o", "?": "o", "?": "o", "?": "o", "�": "oe", "?": "oi", "?": "ou", "?": "oo", "?": "p", "?": "p", "?": "p", "?": "p", "?": "p", "?": "p", "?": "p", "?": "p", "?": "p", "?": "q", "?": "q", "?": "q", "?": "q", "?": "q", "?": "r", "?": "r", "?": "r", "?": "r", "?": "r", "?": "r", "?": "r", "?": "r", "?": "r", "?": "r", "?": "r", "?": "r", "?": "r", "?": "r", "?": "r", "?": "r", "?": "s", "?": "s", "�": "s", "?": "s", "?": "s", "?": "s", "?": "s", "�": "s", "?": "s", "?": "s", "?": "s", "?": "s", "?": "s", "?": "s", "?": "s", "?": "s", "?": "s", "?": "t", "?": "t", "?": "t", "?": "t", "?": "t", "?": "t", "?": "t", "?": "t", "?": "t", "?": "t", "?": "t", "?": "t", "?": "t", "?": "t", "?": "t", "?": "tz", "?": "u", "?": "u", "�": "u", "�": "u", "�": "u", "?": "u", "?": "u", "?": "u", "?": "u", "?": "u", "�": "u", "?": "u", "?": "u", "?": "u", "?": "u", "?": "u", "?": "u", "?": "u", "?": "u", "?": "u", "?": "u", "?": "u", "?": "u", "?": "u", "?": "u", "?": "u", "?": "u", "?": "u", "?": "u", "?": "u", "?": "u", "?": "u", "?": "u", "?": "v", "?": "v", "?": "v", "?": "v", "?": "v", "?": "v", "?": "v", "?": "vy", "?": "w", "?": "w", "?": "w", "?": "w", "?": "w", "?": "w", "?": "w", "?": "w", "?": "w", "?": "w", "?": "x", "?": "x", "?": "x", "?": "x", "?": "y", "?": "y", "?": "y", "�": "y", "?": "y", "?": "y", "?": "y", "?": "y", "�": "y", "?": "y", "?": "y", "?": "y", "?": "y", "?": "y", "?": "y", "?": "z", "?": "z", "?": "z", "?": "z", "?": "z", "�": "z", "?": "z", "?": "z", "?": "z", "?": "z", "?": "z", "?": "z", "?": "z", "?": "?", "?": "?", "?": "?", "?": "?", "?": "?", "?": "?", "?": "?", "?": "?", "?": "?", "?": "?", "?": "?", "?": "?", "?": "?", "?": "?", "?": "?", "?": "?", "?": "?", "?": "?", "?": "?", "?": "?", "?": "?", "�": "'" } }), u.define("select2/data/base", ["../utils"], function (n) { function s(e, t) { s.__super__.constructor.call(this) } return n.Extend(s, n.Observable), s.prototype.current = function (e) { throw new Error("The `current` method must be defined in child classes.") }, s.prototype.query = function (e, t) { throw new Error("The `query` method must be defined in child classes.") }, s.prototype.bind = function (e, t) { }, s.prototype.destroy = function () { }, s.prototype.generateResultId = function (e, t) { e = e.id + "-result-"; return e += n.generateChars(4), null != t.id ? e += "-" + t.id.toString() : e += "-" + n.generateChars(4), e }, s }), u.define("select2/data/select", ["./base", "../utils", "jquery"], function (e, a, l) { function n(e, t) { this.$element = e, this.options = t, n.__super__.constructor.call(this) } return a.Extend(n, e), n.prototype.current = function (e) { var t = this; e(Array.prototype.map.call(this.$element[0].querySelectorAll(":checked"), function (e) { return t.item(l(e)) })) }, n.prototype.select = function (i) { var e, r = this; if (i.selected = !0, null != i.element && "option" === i.element.tagName.toLowerCase()) return i.element.selected = !0, void this.$element.trigger("input").trigger("change"); this.$element.prop("multiple") ? this.current(function (e) { var t = []; (i = [i]).push.apply(i, e); for (var n = 0; n < i.length; n++) { var s = i[n].id; -1 === t.indexOf(s) && t.push(s) } r.$element.val(t), r.$element.trigger("input").trigger("change") }) : (e = i.id, this.$element.val(e), this.$element.trigger("input").trigger("change")) }, n.prototype.unselect = function (i) { var r = this; if (this.$element.prop("multiple")) { if (i.selected = !1, null != i.element && "option" === i.element.tagName.toLowerCase()) return i.element.selected = !1, void this.$element.trigger("input").trigger("change"); this.current(function (e) { for (var t = [], n = 0; n < e.length; n++) { var s = e[n].id; s !== i.id && -1 === t.indexOf(s) && t.push(s) } r.$element.val(t), r.$element.trigger("input").trigger("change") }) } }, n.prototype.bind = function (e, t) { var n = this; (this.container = e).on("select", function (e) { n.select(e.data) }), e.on("unselect", function (e) { n.unselect(e.data) }) }, n.prototype.destroy = function () { this.$element.find("*").each(function () { a.RemoveData(this) }) }, n.prototype.query = function (t, e) { var n = [], s = this; this.$element.children().each(function () { var e; "option" !== this.tagName.toLowerCase() && "optgroup" !== this.tagName.toLowerCase() || (e = l(this), e = s.item(e), null !== (e = s.matches(t, e)) && n.push(e)) }), e({ results: n }) }, n.prototype.addOptions = function (e) { this.$element.append(e) }, n.prototype.option = function (e) { var t; e.children ? (t = document.createElement("optgroup")).label = e.text : void 0 !== (t = document.createElement("option")).textContent ? t.textContent = e.text : t.innerText = e.text, void 0 !== e.id && (t.value = e.id), e.disabled && (t.disabled = !0), e.selected && (t.selected = !0), e.title && (t.title = e.title); e = this._normalizeItem(e); return e.element = t, a.StoreData(t, "data", e), l(t) }, n.prototype.item = function (e) { var t = {}; if (null != (t = a.GetData(e[0], "data"))) return t; var n = e[0]; if ("option" === n.tagName.toLowerCase()) t = { id: e.val(), text: e.text(), disabled: e.prop("disabled"), selected: e.prop("selected"), title: e.prop("title") }; else if ("optgroup" === n.tagName.toLowerCase()) { t = { text: e.prop("label"), children: [], title: e.prop("title") }; for (var s = e.children("option"), i = [], r = 0; r < s.length; r++) { var o = l(s[r]), o = this.item(o); i.push(o) } t.children = i } return (t = this._normalizeItem(t)).element = e[0], a.StoreData(e[0], "data", t), t }, n.prototype._normalizeItem = function (e) { e !== Object(e) && (e = { id: e, text: e }); return null != (e = l.extend({}, { text: "" }, e)).id && (e.id = e.id.toString()), null != e.text && (e.text = e.text.toString()), null == e._resultId && e.id && null != this.container && (e._resultId = this.generateResultId(this.container, e)), l.extend({}, { selected: !1, disabled: !1 }, e) }, n.prototype.matches = function (e, t) { return this.options.get("matcher")(e, t) }, n }), u.define("select2/data/array", ["./select", "../utils", "jquery"], function (e, t, c) { function s(e, t) { this._dataToConvert = t.get("data") || [], s.__super__.constructor.call(this, e, t) } return t.Extend(s, e), s.prototype.bind = function (e, t) { s.__super__.bind.call(this, e, t), this.addOptions(this.convertToOptions(this._dataToConvert)) }, s.prototype.select = function (n) { var e = this.$element.find("option").filter(function (e, t) { return t.value == n.id.toString() }); 0 === e.length && (e = this.option(n), this.addOptions(e)), s.__super__.select.call(this, n) }, s.prototype.convertToOptions = function (e) { var t = this, n = this.$element.find("option"), s = n.map(function () { return t.item(c(this)).id }).get(), i = []; for (var r = 0; r < e.length; r++) { var o, a, l = this._normalizeItem(e[r]); 0 <= s.indexOf(l.id) ? (o = n.filter(function (e) { return function () { return c(this).val() == e.id } }(l)), a = this.item(o), a = c.extend(!0, {}, l, a), a = this.option(a), o.replaceWith(a)) : (a = this.option(l), l.children && (l = this.convertToOptions(l.children), a.append(l)), i.push(a)) } return i }, s }), u.define("select2/data/ajax", ["./array", "../utils", "jquery"], function (e, t, r) { function n(e, t) { this.ajaxOptions = this._applyDefaults(t.get("ajax")), null != this.ajaxOptions.processResults && (this.processResults = this.ajaxOptions.processResults), n.__super__.constructor.call(this, e, t) } return t.Extend(n, e), n.prototype._applyDefaults = function (e) { var t = { data: function (e) { return r.extend({}, e, { q: e.term }) }, transport: function (e, t, n) { e = r.ajax(e); return e.then(t), e.fail(n), e } }; return r.extend({}, t, e, !0) }, n.prototype.processResults = function (e) { return e }, n.prototype.query = function (t, n) { var s = this; null != this._request && ("function" == typeof this._request.abort && this._request.abort(), this._request = null); var i = r.extend({ type: "GET" }, this.ajaxOptions); function e() { var e = i.transport(i, function (e) { e = s.processResults(e, t); s.options.get("debug") && window.console && console.error && (e && e.results && Array.isArray(e.results) || console.error("Select2: The AJAX results did not return an array in the `results` key of the response.")), n(e) }, function () { "status" in e && (0 === e.status || "0" === e.status) || s.trigger("results:message", { message: "errorLoading" }) }); s._request = e } "function" == typeof i.url && (i.url = i.url.call(this.$element, t)), "function" == typeof i.data && (i.data = i.data.call(this.$element, t)), this.ajaxOptions.delay && null != t.term ? (this._queryTimeout && window.clearTimeout(this._queryTimeout), this._queryTimeout = window.setTimeout(e, this.ajaxOptions.delay)) : e() }, n }), u.define("select2/data/tags", ["jquery"], function (t) { function e(e, t, n) { var s = n.get("tags"), i = n.get("createTag"); void 0 !== i && (this.createTag = i); i = n.get("insertTag"); if (void 0 !== i && (this.insertTag = i), e.call(this, t, n), Array.isArray(s)) for (var r = 0; r < s.length; r++) { var o = s[r], o = this._normalizeItem(o), o = this.option(o); this.$element.append(o) } } return e.prototype.query = function (e, c, u) { var d = this; this._removeOldTags(), null != c.term && null == c.page ? e.call(this, c, function e(t, n) { for (var s = t.results, i = 0; i < s.length; i++) { var r = s[i], o = null != r.children && !e({ results: r.children }, !0); if ((r.text || "").toUpperCase() === (c.term || "").toUpperCase() || o) return !n && (t.data = s, void u(t)) } if (n) return !0; var a, l = d.createTag(c); null != l && ((a = d.option(l)).attr("data-select2-tag", "true"), d.addOptions([a]), d.insertTag(s, l)), t.results = s, u(t) }) : e.call(this, c, u) }, e.prototype.createTag = function (e, t) { if (null == t.term) return null; t = t.term.trim(); return "" === t ? null : { id: t, text: t } }, e.prototype.insertTag = function (e, t, n) { t.unshift(n) }, e.prototype._removeOldTags = function (e) { this.$element.find("option[data-select2-tag]").each(function () { this.selected || t(this).remove() }) }, e }), u.define("select2/data/tokenizer", ["jquery"], function (c) { function e(e, t, n) { var s = n.get("tokenizer"); void 0 !== s && (this.tokenizer = s), e.call(this, t, n) } return e.prototype.bind = function (e, t, n) { e.call(this, t, n), this.$search = t.dropdown.$search || t.selection.$search || n.find(".select2-search__field") }, e.prototype.query = function (e, t, n) { var s = this; t.term = t.term || ""; var i = this.tokenizer(t, this.options, function (e) { var t, n = s._normalizeItem(e); s.$element.find("option").filter(function () { return c(this).val() === n.id }).length || ((t = s.option(n)).attr("data-select2-tag", !0), s._removeOldTags(), s.addOptions([t])), t = n, s.trigger("select", { data: t }) }); i.term !== t.term && (this.$search.length && (this.$search.val(i.term), this.$search.trigger("focus")), t.term = i.term), e.call(this, t, n) }, e.prototype.tokenizer = function (e, t, n, s) { for (var i = n.get("tokenSeparators") || [], r = t.term, o = 0, a = this.createTag || function (e) { return { id: e.term, text: e.term } }; o < r.length;) { var l = r[o]; -1 !== i.indexOf(l) ? (l = r.substr(0, o), null != (l = a(c.extend({}, t, { term: l }))) ? (s(l), r = r.substr(o + 1) || "", o = 0) : o++) : o++ } return { term: r } }, e }), u.define("select2/data/minimumInputLength", [], function () { function e(e, t, n) { this.minimumInputLength = n.get("minimumInputLength"), e.call(this, t, n) } return e.prototype.query = function (e, t, n) { t.term = t.term || "", t.term.length < this.minimumInputLength ? this.trigger("results:message", { message: "inputTooShort", args: { minimum: this.minimumInputLength, input: t.term, params: t } }) : e.call(this, t, n) }, e }), u.define("select2/data/maximumInputLength", [], function () { function e(e, t, n) { this.maximumInputLength = n.get("maximumInputLength"), e.call(this, t, n) } return e.prototype.query = function (e, t, n) { t.term = t.term || "", 0 < this.maximumInputLength && t.term.length > this.maximumInputLength ? this.trigger("results:message", { message: "inputTooLong", args: { maximum: this.maximumInputLength, input: t.term, params: t } }) : e.call(this, t, n) }, e }), u.define("select2/data/maximumSelectionLength", [], function () { function e(e, t, n) { this.maximumSelectionLength = n.get("maximumSelectionLength"), e.call(this, t, n) } return e.prototype.bind = function (e, t, n) { var s = this; e.call(this, t, n), t.on("select", function () { s._checkIfMaximumSelected() }) }, e.prototype.query = function (e, t, n) { var s = this; this._checkIfMaximumSelected(function () { e.call(s, t, n) }) }, e.prototype._checkIfMaximumSelected = function (e, t) { var n = this; this.current(function (e) { e = null != e ? e.length : 0; 0 < n.maximumSelectionLength && e >= n.maximumSelectionLength ? n.trigger("results:message", { message: "maximumSelected", args: { maximum: n.maximumSelectionLength } }) : t && t() }) }, e }), u.define("select2/dropdown", ["jquery", "./utils"], function (t, e) { function n(e, t) { this.$element = e, this.options = t, n.__super__.constructor.call(this) } return e.Extend(n, e.Observable), n.prototype.render = function () { var e = t('<span class="select2-dropdown"><span class="select2-results"></span></span>'); return e.attr("dir", this.options.get("dir")), this.$dropdown = e }, n.prototype.bind = function () { }, n.prototype.position = function (e, t) { }, n.prototype.destroy = function () { this.$dropdown.remove() }, n }), u.define("select2/dropdown/search", ["jquery"], function (r) { function e() { } return e.prototype.render = function (e) { var t = e.call(this), n = this.options.get("translations").get("search"), e = r('<span class="select2-search select2-search--dropdown"><input class="select2-search__field" type="search" tabindex="-1" autocorrect="off" autocapitalize="none" spellcheck="false" role="searchbox" aria-autocomplete="list" /></span>'); return this.$searchContainer = e, this.$search = e.find("input"), this.$search.prop("autocomplete", this.options.get("autocomplete")), this.$search.attr("aria-label", n()), t.prepend(e), t }, e.prototype.bind = function (e, t, n) { var s = this, i = t.id + "-results"; e.call(this, t, n), this.$search.on("keydown", function (e) { s.trigger("keypress", e), s._keyUpPrevented = e.isDefaultPrevented() }), this.$search.on("input", function (e) { r(this).off("keyup") }), this.$search.on("keyup input", function (e) { s.handleSearch(e) }), t.on("open", function () { s.$search.attr("tabindex", 0), s.$search.attr("aria-controls", i), s.$search.trigger("focus"), window.setTimeout(function () { s.$search.trigger("focus") }, 0) }), t.on("close", function () { s.$search.attr("tabindex", -1), s.$search.removeAttr("aria-controls"), s.$search.removeAttr("aria-activedescendant"), s.$search.val(""), s.$search.trigger("blur") }), t.on("focus", function () { t.isOpen() || s.$search.trigger("focus") }), t.on("results:all", function (e) { null != e.query.term && "" !== e.query.term || (s.showSearch(e) ? s.$searchContainer[0].classList.remove("select2-search--hide") : s.$searchContainer[0].classList.add("select2-search--hide")) }), t.on("results:focus", function (e) { e.data._resultId ? s.$search.attr("aria-activedescendant", e.data._resultId) : s.$search.removeAttr("aria-activedescendant") }) }, e.prototype.handleSearch = function (e) { var t; this._keyUpPrevented || (t = this.$search.val(), this.trigger("query", { term: t })), this._keyUpPrevented = !1 }, e.prototype.showSearch = function (e, t) { return !0 }, e }), u.define("select2/dropdown/hidePlaceholder", [], function () { function e(e, t, n, s) { this.placeholder = this.normalizePlaceholder(n.get("placeholder")), e.call(this, t, n, s) } return e.prototype.append = function (e, t) { t.results = this.removePlaceholder(t.results), e.call(this, t) }, e.prototype.normalizePlaceholder = function (e, t) { return t = "string" == typeof t ? { id: "", text: t } : t }, e.prototype.removePlaceholder = function (e, t) { for (var n = t.slice(0), s = t.length - 1; 0 <= s; s--) { var i = t[s]; this.placeholder.id === i.id && n.splice(s, 1) } return n }, e }), u.define("select2/dropdown/infiniteScroll", ["jquery"], function (n) { function e(e, t, n, s) { this.lastParams = {}, e.call(this, t, n, s), this.$loadingMore = this.createLoadingMore(), this.loading = !1 } return e.prototype.append = function (e, t) { this.$loadingMore.remove(), this.loading = !1, e.call(this, t), this.showLoadingMore(t) && (this.$results.append(this.$loadingMore), this.loadMoreIfNeeded()) }, e.prototype.bind = function (e, t, n) { var s = this; e.call(this, t, n), t.on("query", function (e) { s.lastParams = e, s.loading = !0 }), t.on("query:append", function (e) { s.lastParams = e, s.loading = !0 }), this.$results.on("scroll", this.loadMoreIfNeeded.bind(this)) }, e.prototype.loadMoreIfNeeded = function () { var e = n.contains(document.documentElement, this.$loadingMore[0]); !this.loading && e && (e = this.$results.offset().top + this.$results.outerHeight(!1), this.$loadingMore.offset().top + this.$loadingMore.outerHeight(!1) <= e + 50 && this.loadMore()) }, e.prototype.loadMore = function () { this.loading = !0; var e = n.extend({}, { page: 1 }, this.lastParams); e.page++, this.trigger("query:append", e) }, e.prototype.showLoadingMore = function (e, t) { return t.pagination && t.pagination.more }, e.prototype.createLoadingMore = function () { var e = n('<li class="select2-results__option select2-results__option--load-more"role="option" aria-disabled="true"></li>'), t = this.options.get("translations").get("loadingMore"); return e.html(t(this.lastParams)), e }, e }), u.define("select2/dropdown/attachBody", ["jquery", "../utils"], function (u, o) { function e(e, t, n) { this.$dropdownParent = u(n.get("dropdownParent") || document.body), e.call(this, t, n) } return e.prototype.bind = function (e, t, n) { var s = this; e.call(this, t, n), t.on("open", function () { s._showDropdown(), s._attachPositioningHandler(t), s._bindContainerResultHandlers(t) }), t.on("close", function () { s._hideDropdown(), s._detachPositioningHandler(t) }), this.$dropdownContainer.on("mousedown", function (e) { e.stopPropagation() }) }, e.prototype.destroy = function (e) { e.call(this), this.$dropdownContainer.remove() }, e.prototype.position = function (e, t, n) { t.attr("class", n.attr("class")), t[0].classList.remove("select2"), t[0].classList.add("select2-container--open"), t.css({ position: "absolute", top: -999999 }), this.$container = n }, e.prototype.render = function (e) { var t = u("<span></span>"), e = e.call(this); return t.append(e), this.$dropdownContainer = t }, e.prototype._hideDropdown = function (e) { this.$dropdownContainer.detach() }, e.prototype._bindContainerResultHandlers = function (e, t) { var n; this._containerResultsHandlersBound || (n = this, t.on("results:all", function () { n._positionDropdown(), n._resizeDropdown() }), t.on("results:append", function () { n._positionDropdown(), n._resizeDropdown() }), t.on("results:message", function () { n._positionDropdown(), n._resizeDropdown() }), t.on("select", function () { n._positionDropdown(), n._resizeDropdown() }), t.on("unselect", function () { n._positionDropdown(), n._resizeDropdown() }), this._containerResultsHandlersBound = !0) }, e.prototype._attachPositioningHandler = function (e, t) { var n = this, s = "scroll.select2." + t.id, i = "resize.select2." + t.id, r = "orientationchange.select2." + t.id, t = this.$container.parents().filter(o.hasScroll); t.each(function () { o.StoreData(this, "select2-scroll-position", { x: u(this).scrollLeft(), y: u(this).scrollTop() }) }), t.on(s, function (e) { var t = o.GetData(this, "select2-scroll-position"); u(this).scrollTop(t.y) }), u(window).on(s + " " + i + " " + r, function (e) { n._positionDropdown(), n._resizeDropdown() }) }, e.prototype._detachPositioningHandler = function (e, t) { var n = "scroll.select2." + t.id, s = "resize.select2." + t.id, t = "orientationchange.select2." + t.id; this.$container.parents().filter(o.hasScroll).off(n), u(window).off(n + " " + s + " " + t) }, e.prototype._positionDropdown = function () { var e = u(window), t = this.$dropdown[0].classList.contains("select2-dropdown--above"), n = this.$dropdown[0].classList.contains("select2-dropdown--below"), s = null, i = this.$container.offset(); i.bottom = i.top + this.$container.outerHeight(!1); var r = { height: this.$container.outerHeight(!1) }; r.top = i.top, r.bottom = i.top + r.height; var o = this.$dropdown.outerHeight(!1), a = e.scrollTop(), l = e.scrollTop() + e.height(), c = a < i.top - o, e = l > i.bottom + o, a = { left: i.left, top: r.bottom }, l = this.$dropdownParent; "static" === l.css("position") && (l = l.offsetParent()); i = { top: 0, left: 0 }; (u.contains(document.body, l[0]) || l[0].isConnected) && (i = l.offset()), a.top -= i.top, a.left -= i.left, t || n || (s = "below"), e || !c || t ? !c && e && t && (s = "below") : s = "above", ("above" == s || t && "below" !== s) && (a.top = r.top - i.top - o), null != s && (this.$dropdown[0].classList.remove("select2-dropdown--below"), this.$dropdown[0].classList.remove("select2-dropdown--above"), this.$dropdown[0].classList.add("select2-dropdown--" + s), this.$container[0].classList.remove("select2-container--below"), this.$container[0].classList.remove("select2-container--above"), this.$container[0].classList.add("select2-container--" + s)), this.$dropdownContainer.css(a) }, e.prototype._resizeDropdown = function () { var e = { width: this.$container.outerWidth(!1) + "px" }; this.options.get("dropdownAutoWidth") && (e.minWidth = e.width, e.position = "relative", e.width = "auto"), this.$dropdown.css(e) }, e.prototype._showDropdown = function (e) { this.$dropdownContainer.appendTo(this.$dropdownParent), this._positionDropdown(), this._resizeDropdown() }, e }), u.define("select2/dropdown/minimumResultsForSearch", [], function () { function e(e, t, n, s) { this.minimumResultsForSearch = n.get("minimumResultsForSearch"), this.minimumResultsForSearch < 0 && (this.minimumResultsForSearch = 1 / 0), e.call(this, t, n, s) } return e.prototype.showSearch = function (e, t) { return !(function e(t) { for (var n = 0, s = 0; s < t.length; s++) { var i = t[s]; i.children ? n += e(i.children) : n++ } return n }(t.data.results) < this.minimumResultsForSearch) && e.call(this, t) }, e }), u.define("select2/dropdown/selectOnClose", ["../utils"], function (s) { function e() { } return e.prototype.bind = function (e, t, n) { var s = this; e.call(this, t, n), t.on("close", function (e) { s._handleSelectOnClose(e) }) }, e.prototype._handleSelectOnClose = function (e, t) { if (t && null != t.originalSelect2Event) { var n = t.originalSelect2Event; if ("select" === n._type || "unselect" === n._type) return } n = this.getHighlightedResults(); n.length < 1 || (null != (n = s.GetData(n[0], "data")).element && n.element.selected || null == n.element && n.selected || this.trigger("select", { data: n })) }, e }), u.define("select2/dropdown/closeOnSelect", [], function () { function e() { } return e.prototype.bind = function (e, t, n) { var s = this; e.call(this, t, n), t.on("select", function (e) { s._selectTriggered(e) }), t.on("unselect", function (e) { s._selectTriggered(e) }) }, e.prototype._selectTriggered = function (e, t) { var n = t.originalEvent; n && (n.ctrlKey || n.metaKey) || this.trigger("close", { originalEvent: n, originalSelect2Event: t }) }, e }), u.define("select2/dropdown/dropdownCss", ["../utils"], function (n) { function e() { } return e.prototype.render = function (e) { var t = e.call(this), e = this.options.get("dropdownCssClass") || ""; return -1 !== e.indexOf(":all:") && (e = e.replace(":all:", ""), n.copyNonInternalCssClasses(t[0], this.$element[0])), t.addClass(e), t }, e }), u.define("select2/dropdown/tagsSearchHighlight", ["../utils"], function (s) { function e() { } return e.prototype.highlightFirstItem = function (e) { var t = this.$results.find(".select2-results__option--selectable:not(.select2-results__option--selected)"); if (0 < t.length) { var n = t.first(), t = s.GetData(n[0], "data").element; if (t && t.getAttribute && "true" === t.getAttribute("data-select2-tag")) return void n.trigger("mouseenter") } e.call(this) }, e }), u.define("select2/i18n/en", [], function () { return { errorLoading: function () { return "The results could not be loaded." }, inputTooLong: function (e) { var t = e.input.length - e.maximum, e = "Please delete " + t + " character"; return 1 != t && (e += "s"), e }, inputTooShort: function (e) { return "Please enter " + (e.minimum - e.input.length) + " or more characters" }, loadingMore: function () { return "Loading more results�" }, maximumSelected: function (e) { var t = "You can only select " + e.maximum + " item"; return 1 != e.maximum && (t += "s"), t }, noResults: function () { return "No results found" }, searching: function () { return "Searching�" }, removeAllItems: function () { return "Remove all items" }, removeItem: function () { return "Remove item" }, search: function () { return "Search" } } }), u.define("select2/defaults", ["jquery", "./results", "./selection/single", "./selection/multiple", "./selection/placeholder", "./selection/allowClear", "./selection/search", "./selection/selectionCss", "./selection/eventRelay", "./utils", "./translation", "./diacritics", "./data/select", "./data/array", "./data/ajax", "./data/tags", "./data/tokenizer", "./data/minimumInputLength", "./data/maximumInputLength", "./data/maximumSelectionLength", "./dropdown", "./dropdown/search", "./dropdown/hidePlaceholder", "./dropdown/infiniteScroll", "./dropdown/attachBody", "./dropdown/minimumResultsForSearch", "./dropdown/selectOnClose", "./dropdown/closeOnSelect", "./dropdown/dropdownCss", "./dropdown/tagsSearchHighlight", "./i18n/en"], function (l, r, o, a, c, u, d, p, h, f, g, t, m, y, v, _, b, $, w, x, A, D, S, E, O, C, L, T, q, I, e) { function n() { this.reset() } return n.prototype.apply = function (e) { var t; null == (e = l.extend(!0, {}, this.defaults, e)).dataAdapter && (null != e.ajax ? e.dataAdapter = v : null != e.data ? e.dataAdapter = y : e.dataAdapter = m, 0 < e.minimumInputLength && (e.dataAdapter = f.Decorate(e.dataAdapter, $)), 0 < e.maximumInputLength && (e.dataAdapter = f.Decorate(e.dataAdapter, w)), 0 < e.maximumSelectionLength && (e.dataAdapter = f.Decorate(e.dataAdapter, x)), e.tags && (e.dataAdapter = f.Decorate(e.dataAdapter, _)), null == e.tokenSeparators && null == e.tokenizer || (e.dataAdapter = f.Decorate(e.dataAdapter, b))), null == e.resultsAdapter && (e.resultsAdapter = r, null != e.ajax && (e.resultsAdapter = f.Decorate(e.resultsAdapter, E)), null != e.placeholder && (e.resultsAdapter = f.Decorate(e.resultsAdapter, S)), e.selectOnClose && (e.resultsAdapter = f.Decorate(e.resultsAdapter, L)), e.tags && (e.resultsAdapter = f.Decorate(e.resultsAdapter, I))), null == e.dropdownAdapter && (e.multiple ? e.dropdownAdapter = A : (t = f.Decorate(A, D), e.dropdownAdapter = t), 0 !== e.minimumResultsForSearch && (e.dropdownAdapter = f.Decorate(e.dropdownAdapter, C)), e.closeOnSelect && (e.dropdownAdapter = f.Decorate(e.dropdownAdapter, T)), null != e.dropdownCssClass && (e.dropdownAdapter = f.Decorate(e.dropdownAdapter, q)), e.dropdownAdapter = f.Decorate(e.dropdownAdapter, O)), null == e.selectionAdapter && (e.multiple ? e.selectionAdapter = a : e.selectionAdapter = o, null != e.placeholder && (e.selectionAdapter = f.Decorate(e.selectionAdapter, c)), e.allowClear && (e.selectionAdapter = f.Decorate(e.selectionAdapter, u)), e.multiple && (e.selectionAdapter = f.Decorate(e.selectionAdapter, d)), null != e.selectionCssClass && (e.selectionAdapter = f.Decorate(e.selectionAdapter, p)), e.selectionAdapter = f.Decorate(e.selectionAdapter, h)), e.language = this._resolveLanguage(e.language), e.language.push("en"); for (var n = [], s = 0; s < e.language.length; s++) { var i = e.language[s]; -1 === n.indexOf(i) && n.push(i) } return e.language = n, e.translations = this._processTranslations(e.language, e.debug), e }, n.prototype.reset = function () { function a(e) { return e.replace(/[^\u0000-\u007E]/g, function (e) { return t[e] || e }) } this.defaults = { amdLanguageBase: "./i18n/", autocomplete: "off", closeOnSelect: !0, debug: !1, dropdownAutoWidth: !1, escapeMarkup: f.escapeMarkup, language: {}, matcher: function e(t, n) { if (null == t.term || "" === t.term.trim()) return n; if (n.children && 0 < n.children.length) { for (var s = l.extend(!0, {}, n), i = n.children.length - 1; 0 <= i; i--)null == e(t, n.children[i]) && s.children.splice(i, 1); return 0 < s.children.length ? s : e(t, s) } var r = a(n.text).toUpperCase(), o = a(t.term).toUpperCase(); return -1 < r.indexOf(o) ? n : null }, minimumInputLength: 0, maximumInputLength: 0, maximumSelectionLength: 0, minimumResultsForSearch: 0, selectOnClose: !1, scrollAfterSelect: !1, sorter: function (e) { return e }, templateResult: function (e) { return e.text }, templateSelection: function (e) { return e.text }, theme: "default", width: "resolve" } }, n.prototype.applyFromElement = function (e, t) { var n = e.language, s = this.defaults.language, i = t.prop("lang"), t = t.closest("[lang]").prop("lang"), t = Array.prototype.concat.call(this._resolveLanguage(i), this._resolveLanguage(n), this._resolveLanguage(s), this._resolveLanguage(t)); return e.language = t, e }, n.prototype._resolveLanguage = function (e) { if (!e) return []; if (l.isEmptyObject(e)) return []; if (l.isPlainObject(e)) return [e]; for (var t, n = Array.isArray(e) ? e : [e], s = [], i = 0; i < n.length; i++)s.push(n[i]), "string" == typeof n[i] && 0 < n[i].indexOf("-") && (t = n[i].split("-")[0], s.push(t)); return s }, n.prototype._processTranslations = function (e, t) { for (var n = new g, s = 0; s < e.length; s++) { var i = new g, r = e[s]; if ("string" == typeof r) try { i = g.loadPath(r) } catch (e) { try { r = this.defaults.amdLanguageBase + r, i = g.loadPath(r) } catch (e) { t && window.console && console.warn && console.warn('Select2: The language file for "' + r + '" could not be automatically loaded. A fallback will be used instead.') } } else i = l.isPlainObject(r) ? new g(r) : r; n.extend(i) } return n }, n.prototype.set = function (e, t) { var n = {}; n[l.camelCase(e)] = t; n = f._convertData(n); l.extend(!0, this.defaults, n) }, new n }), u.define("select2/options", ["jquery", "./defaults", "./utils"], function (c, n, u) { function e(e, t) { this.options = e, null != t && this.fromElement(t), null != t && (this.options = n.applyFromElement(this.options, t)), this.options = n.apply(this.options) } return e.prototype.fromElement = function (e) { var t = ["select2"]; null == this.options.multiple && (this.options.multiple = e.prop("multiple")), null == this.options.disabled && (this.options.disabled = e.prop("disabled")), null == this.options.autocomplete && e.prop("autocomplete") && (this.options.autocomplete = e.prop("autocomplete")), null == this.options.dir && (e.prop("dir") ? this.options.dir = e.prop("dir") : e.closest("[dir]").prop("dir") ? this.options.dir = e.closest("[dir]").prop("dir") : this.options.dir = "ltr"), e.prop("disabled", this.options.disabled), e.prop("multiple", this.options.multiple), u.GetData(e[0], "select2Tags") && (this.options.debug && window.console && console.warn && console.warn('Select2: The `data-select2-tags` attribute has been changed to use the `data-data` and `data-tags="true"` attributes and will be removed in future versions of Select2.'), u.StoreData(e[0], "data", u.GetData(e[0], "select2Tags")), u.StoreData(e[0], "tags", !0)), u.GetData(e[0], "ajaxUrl") && (this.options.debug && window.console && console.warn && console.warn("Select2: The `data-ajax-url` attribute has been changed to `data-ajax--url` and support for the old attribute will be removed in future versions of Select2."), e.attr("ajax--url", u.GetData(e[0], "ajaxUrl")), u.StoreData(e[0], "ajax-Url", u.GetData(e[0], "ajaxUrl"))); var n = {}; function s(e, t) { return t.toUpperCase() } for (var i = 0; i < e[0].attributes.length; i++) { var r = e[0].attributes[i].name, o = "data-"; r.substr(0, o.length) == o && (r = r.substring(o.length), o = u.GetData(e[0], r), n[r.replace(/-([a-z])/g, s)] = o) } c.fn.jquery && "1." == c.fn.jquery.substr(0, 2) && e[0].dataset && (n = c.extend(!0, {}, e[0].dataset, n)); var a, l = c.extend(!0, {}, u.GetData(e[0]), n); for (a in l = u._convertData(l)) -1 < t.indexOf(a) || (c.isPlainObject(this.options[a]) ? c.extend(this.options[a], l[a]) : this.options[a] = l[a]); return this }, e.prototype.get = function (e) { return this.options[e] }, e.prototype.set = function (e, t) { this.options[e] = t }, e }), u.define("select2/core", ["jquery", "./options", "./utils", "./keys"], function (t, i, r, s) { var o = function (e, t) { null != r.GetData(e[0], "select2") && r.GetData(e[0], "select2").destroy(), this.$element = e, this.id = this._generateId(e), t = t || {}, this.options = new i(t, e), o.__super__.constructor.call(this); var n = e.attr("tabindex") || 0; r.StoreData(e[0], "old-tabindex", n), e.attr("tabindex", "-1"); t = this.options.get("dataAdapter"); this.dataAdapter = new t(e, this.options); n = this.render(); this._placeContainer(n); t = this.options.get("selectionAdapter"); this.selection = new t(e, this.options), this.$selection = this.selection.render(), this.selection.position(this.$selection, n); t = this.options.get("dropdownAdapter"); this.dropdown = new t(e, this.options), this.$dropdown = this.dropdown.render(), this.dropdown.position(this.$dropdown, n); n = this.options.get("resultsAdapter"); this.results = new n(e, this.options, this.dataAdapter), this.$results = this.results.render(), this.results.position(this.$results, this.$dropdown); var s = this; this._bindAdapters(), this._registerDomEvents(), this._registerDataEvents(), this._registerSelectionEvents(), this._registerDropdownEvents(), this._registerResultsEvents(), this._registerEvents(), this.dataAdapter.current(function (e) { s.trigger("selection:update", { data: e }) }), e[0].classList.add("select2-hidden-accessible"), e.attr("aria-hidden", "true"), this._syncAttributes(), r.StoreData(e[0], "select2", this), e.data("select2", this) }; return r.Extend(o, r.Observable), o.prototype._generateId = function (e) { return "select2-" + (null != e.attr("id") ? e.attr("id") : null != e.attr("name") ? e.attr("name") + "-" + r.generateChars(2) : r.generateChars(4)).replace(/(:|\.|\[|\]|,)/g, "") }, o.prototype._placeContainer = function (e) { e.insertAfter(this.$element); var t = this._resolveWidth(this.$element, this.options.get("width")); null != t && e.css("width", t) }, o.prototype._resolveWidth = function (e, t) { var n = /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i; if ("resolve" == t) { var s = this._resolveWidth(e, "style"); return null != s ? s : this._resolveWidth(e, "element") } if ("element" == t) { s = e.outerWidth(!1); return s <= 0 ? "auto" : s + "px" } if ("style" != t) return "computedstyle" != t ? t : window.getComputedStyle(e[0]).width; e = e.attr("style"); if ("string" != typeof e) return null; for (var i = e.split(";"), r = 0, o = i.length; r < o; r += 1) { var a = i[r].replace(/\s/g, "").match(n); if (null !== a && 1 <= a.length) return a[1] } return null }, o.prototype._bindAdapters = function () { this.dataAdapter.bind(this, this.$container), this.selection.bind(this, this.$container), this.dropdown.bind(this, this.$container), this.results.bind(this, this.$container) }, o.prototype._registerDomEvents = function () { var t = this; this.$element.on("change.select2", function () { t.dataAdapter.current(function (e) { t.trigger("selection:update", { data: e }) }) }), this.$element.on("focus.select2", function (e) { t.trigger("focus", e) }), this._syncA = r.bind(this._syncAttributes, this), this._syncS = r.bind(this._syncSubtree, this), this._observer = new window.MutationObserver(function (e) { t._syncA(), t._syncS(e) }), this._observer.observe(this.$element[0], { attributes: !0, childList: !0, subtree: !1 }) }, o.prototype._registerDataEvents = function () { var n = this; this.dataAdapter.on("*", function (e, t) { n.trigger(e, t) }) }, o.prototype._registerSelectionEvents = function () { var n = this, s = ["toggle", "focus"]; this.selection.on("toggle", function () { n.toggleDropdown() }), this.selection.on("focus", function (e) { n.focus(e) }), this.selection.on("*", function (e, t) { -1 === s.indexOf(e) && n.trigger(e, t) }) }, o.prototype._registerDropdownEvents = function () { var n = this; this.dropdown.on("*", function (e, t) { n.trigger(e, t) }) }, o.prototype._registerResultsEvents = function () { var n = this; this.results.on("*", function (e, t) { n.trigger(e, t) }) }, o.prototype._registerEvents = function () { var n = this; this.on("open", function () { n.$container[0].classList.add("select2-container--open") }), this.on("close", function () { n.$container[0].classList.remove("select2-container--open") }), this.on("enable", function () { n.$container[0].classList.remove("select2-container--disabled") }), this.on("disable", function () { n.$container[0].classList.add("select2-container--disabled") }), this.on("blur", function () { n.$container[0].classList.remove("select2-container--focus") }), this.on("query", function (t) { n.isOpen() || n.trigger("open", {}), this.dataAdapter.query(t, function (e) { n.trigger("results:all", { data: e, query: t }) }) }), this.on("query:append", function (t) { this.dataAdapter.query(t, function (e) { n.trigger("results:append", { data: e, query: t }) }) }), this.on("keypress", function (e) { var t = e.which; n.isOpen() ? t === s.ESC || t === s.UP && e.altKey ? (n.close(e), e.preventDefault()) : t === s.ENTER || t === s.TAB ? (n.trigger("results:select", {}), e.preventDefault()) : t === s.SPACE && e.ctrlKey ? (n.trigger("results:toggle", {}), e.preventDefault()) : t === s.UP ? (n.trigger("results:previous", {}), e.preventDefault()) : t === s.DOWN && (n.trigger("results:next", {}), e.preventDefault()) : (t === s.ENTER || t === s.SPACE || t === s.DOWN && e.altKey) && (n.open(), e.preventDefault()) }) }, o.prototype._syncAttributes = function () { this.options.set("disabled", this.$element.prop("disabled")), this.isDisabled() ? (this.isOpen() && this.close(), this.trigger("disable", {})) : this.trigger("enable", {}) }, o.prototype._isChangeMutation = function (e) { var t = this; if (e.addedNodes && 0 < e.addedNodes.length) { for (var n = 0; n < e.addedNodes.length; n++)if (e.addedNodes[n].selected) return !0 } else { if (e.removedNodes && 0 < e.removedNodes.length) return !0; if (Array.isArray(e)) return e.some(function (e) { return t._isChangeMutation(e) }) } return !1 }, o.prototype._syncSubtree = function (e) { var e = this._isChangeMutation(e), t = this; e && this.dataAdapter.current(function (e) { t.trigger("selection:update", { data: e }) }) }, o.prototype.trigger = function (e, t) { var n = o.__super__.trigger, s = { open: "opening", close: "closing", select: "selecting", unselect: "unselecting", clear: "clearing" }; if (void 0 === t && (t = {}), e in s) { var i = s[e], s = { prevented: !1, name: e, args: t }; if (n.call(this, i, s), s.prevented) return void (t.prevented = !0) } n.call(this, e, t) }, o.prototype.toggleDropdown = function () { this.isDisabled() || (this.isOpen() ? this.close() : this.open()) }, o.prototype.open = function () { this.isOpen() || this.isDisabled() || this.trigger("query", {}) }, o.prototype.close = function (e) { this.isOpen() && this.trigger("close", { originalEvent: e }) }, o.prototype.isEnabled = function () { return !this.isDisabled() }, o.prototype.isDisabled = function () { return this.options.get("disabled") }, o.prototype.isOpen = function () { return this.$container[0].classList.contains("select2-container--open") }, o.prototype.hasFocus = function () { return this.$container[0].classList.contains("select2-container--focus") }, o.prototype.focus = function (e) { this.hasFocus() || (this.$container[0].classList.add("select2-container--focus"), this.trigger("focus", {})) }, o.prototype.enable = function (e) { this.options.get("debug") && window.console && console.warn && console.warn('Select2: The `select2("enable")` method has been deprecated and will be removed in later Select2 versions. Use $element.prop("disabled") instead.'); e = !(e = null == e || 0 === e.length ? [!0] : e)[0]; this.$element.prop("disabled", e) }, o.prototype.data = function () { this.options.get("debug") && 0 < arguments.length && window.console && console.warn && console.warn('Select2: Data can no longer be set using `select2("data")`. You should consider setting the value instead using `$element.val()`.'); var t = []; return this.dataAdapter.current(function (e) { t = e }), t }, o.prototype.val = function (e) { if (this.options.get("debug") && window.console && console.warn && console.warn('Select2: The `select2("val")` method has been deprecated and will be removed in later Select2 versions. Use $element.val() instead.'), null == e || 0 === e.length) return this.$element.val(); e = e[0]; Array.isArray(e) && (e = e.map(function (e) { return e.toString() })), this.$element.val(e).trigger("input").trigger("change") }, o.prototype.destroy = function () { r.RemoveData(this.$container[0]), this.$container.remove(), this._observer.disconnect(), this._observer = null, this._syncA = null, this._syncS = null, this.$element.off(".select2"), this.$element.attr("tabindex", r.GetData(this.$element[0], "old-tabindex")), this.$element[0].classList.remove("select2-hidden-accessible"), this.$element.attr("aria-hidden", "false"), r.RemoveData(this.$element[0]), this.$element.removeData("select2"), this.dataAdapter.destroy(), this.selection.destroy(), this.dropdown.destroy(), this.results.destroy(), this.dataAdapter = null, this.selection = null, this.dropdown = null, this.results = null }, o.prototype.render = function () { var e = t('<span class="select2 select2-container"><span class="selection"></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>'); return e.attr("dir", this.options.get("dir")), this.$container = e, this.$container[0].classList.add("select2-container--" + this.options.get("theme")), r.StoreData(e[0], "element", this.$element), e }, o }), u.define("jquery-mousewheel", ["jquery"], function (e) { return e }), u.define("jquery.select2", ["jquery", "jquery-mousewheel", "./select2/core", "./select2/defaults", "./select2/utils"], function (i, e, r, t, o) { var a; return null == i.fn.select2 && (a = ["open", "close", "destroy"], i.fn.select2 = function (t) { if ("object" == typeof (t = t || {})) return this.each(function () { var e = i.extend(!0, {}, t); new r(i(this), e) }), this; if ("string" != typeof t) throw new Error("Invalid arguments for Select2: " + t); var n, s = Array.prototype.slice.call(arguments, 1); return this.each(function () { var e = o.GetData(this, "select2"); null == e && window.console && console.error && console.error("The select2('" + t + "') method was called on an element that is not using Select2."), n = e[t].apply(e, s) }), -1 < a.indexOf(t) ? this : n }), null == i.fn.select2.defaults && (i.fn.select2.defaults = t), r }), { define: u.define, require: u.require }); function b(e, t) { return i.call(e, t) } function l(e, t) { var n, s, i, r, o, a, l, c, u, d, p = t && t.split("/"), h = y.map, f = h && h["*"] || {}; if (e) { for (t = (e = e.split("/")).length - 1, y.nodeIdCompat && _.test(e[t]) && (e[t] = e[t].replace(_, "")), "." === e[0].charAt(0) && p && (e = p.slice(0, p.length - 1).concat(e)), c = 0; c < e.length; c++)"." === (d = e[c]) ? (e.splice(c, 1), --c) : ".." === d && (0 === c || 1 === c && ".." === e[2] || ".." === e[c - 1] || 0 < c && (e.splice(c - 1, 2), c -= 2)); e = e.join("/") } if ((p || f) && h) { for (c = (n = e.split("/")).length; 0 < c; --c) { if (s = n.slice(0, c).join("/"), p) for (u = p.length; 0 < u; --u)if (i = h[p.slice(0, u).join("/")], i = i && i[s]) { r = i, o = c; break } if (r) break; !a && f && f[s] && (a = f[s], l = c) } !r && a && (r = a, o = l), r && (n.splice(0, o, r), e = n.join("/")) } return e } function w(t, n) { return function () { var e = a.call(arguments, 0); return "string" != typeof e[0] && 1 === e.length && e.push(null), o.apply(p, e.concat([t, n])) } } function x(e) { var t; if (b(m, e) && (t = m[e], delete m[e], v[e] = !0, r.apply(p, t)), !b(g, e) && !b(v, e)) throw new Error("No " + e); return g[e] } function c(e) { var t, n = e ? e.indexOf("!") : -1; return -1 < n && (t = e.substring(0, n), e = e.substring(n + 1, e.length)), [t, e] } function A(e) { return e ? c(e) : [] } var u = s.require("jquery.select2"); return t.fn.select2.amd = s, u });
var WebTour = (function () {
    'use strict';

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        return Constructor;
    }

    function _defineProperty(obj, key, value) {
        if (key in obj) {
            Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
            });
        } else {
            obj[key] = value;
        }

        return obj;
    }

    function ownKeys(object, enumerableOnly) {
        var keys = Object.keys(object);

        if (Object.getOwnPropertySymbols) {
            var symbols = Object.getOwnPropertySymbols(object);
            if (enumerableOnly) symbols = symbols.filter(function (sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
            keys.push.apply(keys, symbols);
        }

        return keys;
    }

    function _objectSpread2(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i] != null ? arguments[i] : {};

            if (i % 2) {
                ownKeys(Object(source), true).forEach(function (key) {
                    _defineProperty(target, key, source[key]);
                });
            } else if (Object.getOwnPropertyDescriptors) {
                Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
            } else {
                ownKeys(Object(source)).forEach(function (key) {
                    Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
                });
            }
        }

        return target;
    }

    function _slicedToArray(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }

    function _arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
    }

    function _iterableToArrayLimit(arr, i) {
        if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;

        try {
            for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                _arr.push(_s.value);

                if (i && _arr.length === i) break;
            }
        } catch (err) {
            _d = true;
            _e = err;
        } finally {
            try {
                if (!_n && _i["return"] != null) _i["return"]();
            } finally {
                if (_d) throw _e;
            }
        }

        return _arr;
    }

    function _unsupportedIterableToArray(o, minLen) {
        if (!o) return;
        if (typeof o === "string") return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor) n = o.constructor.name;
        if (n === "Map" || n === "Set") return Array.from(o);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }

    function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length) len = arr.length;

        for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

        return arr2;
    }

    function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var WebTour = function () {
        function WebTour() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, WebTour);

            if (!!this.constructor.instance) {
                return this.constructor.instance;
            }

            this.constructor.instance = this;
            this.options = _objectSpread2({
                animate: true,
                opacity: 0.5,
                offset: 20,
                borderRadius: 3,
                allowClose: true,
                highlight: true,
                highlightOffset: 5,
                keyboard: true,
                width: '300px',
                zIndex: 10050,
                removeArrow: false,
                onNext: function onNext() {
                    return null;
                },
                onPrevious: function onPrevious() {
                    return null;
                }
            }, options);
            this.steps = [];
            this.stepIndex = 0;
            this.isRunning = false;
            this.isPaused = false;
            this.window = window;
            this.document = document;
            this.onClick = this.onClick.bind(this);
            this.onResize = this.onResize.bind(this);
            this.onKeyUp = this.onKeyUp.bind(this);
            this.bind();
            return this;
        }

        _createClass(WebTour, [{
            key: "bind",
            value: function bind() {
                if (!('ontouchstart' in this.document.documentElement)) {
                    this.window.addEventListener('click', this.onClick, false);
                } else {
                    this.window.addEventListener('touchstart', this.onClick, false);
                }

                this.window.addEventListener('resize', this.onResize, false);
                this.window.addEventListener('keyup', this.onKeyUp, false);
            }
        }, {
            key: "onClick",
            value: function onClick(e) {
                e.stopPropagation();

                if (e.target.classList.contains('wt-btn-next')) {
                    this.onNext();
                    this.next();
                }

                if (e.target.classList.contains('wt-btn-back')) {
                    this.onPrevious();
                    this.previous();
                }

                if (e.target.classList.contains('wt-overlay')) {
                    if (this.options.allowClose) {
                        this.stop();
                    }
                }
            }
        }, {
            key: "onKeyUp",
            value: function onKeyUp(event) {
                if (!this.isRunning || !this.options.keyboard) {
                    return;
                }

                if (event.keyCode === 27 && this.options.allowClose) {
                    this.stop();
                    return;
                }

                if (event.keyCode === 39) {
                    this.onNext();
                    this.next();
                } else if (event.keyCode === 37) {
                    this.onPrevious();
                    this.previous();
                }
            }
        }, {
            key: "onResize",
            value: function onResize() {
                if (!this.isRunning) {
                    return;
                }

                this.clear();
                this.render(this.steps[this.stepIndex]);
            }
        }, {
            key: "setSteps",
            value: function setSteps(steps) {
                this.steps = null;
                this.steps = steps;
            }
        }, {
            key: "getSteps",
            value: function getSteps() {
                return this.steps;
            }
        }, {
            key: "highlight",
            value: function highlight(element) {
                var _this = this;

                var step = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
                return function (element) {
                    _this.isRunning = true;

                    var element = _this.document.querySelector(element);

                    if (element) {
                        if (step) {
                            _this.steps = null;
                            _this.stepIndex = 0;
                            _this.steps = step;

                            _this.render(_this.steps[_this.stepIndex]);
                        } else {
                            _this.createOverlay(element, step);
                        }
                    }
                }(element);
            }
        }, {
            key: "start",
            value: function start() {
                var startIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                this.isRunning = true;
                this.stepIndex = startIndex;
                this.render(this.steps[this.stepIndex]);
            }
        }, {
            key: "stop",
            value: function stop() {
                this.clear();
                this.isRunning = false;
            }
        }, {
            key: "showLoader",
            value: function showLoader() {
                var popover = this.document.querySelector('.wt-popover');
                var loader = this.document.createElement('div');
                loader.classList.add('wt-loader');
                loader.style.zIndex = this.options.zIndex + 10;
                popover.prepend(loader);
            }
        }, {
            key: "moveNext",
            value: function moveNext() {
                this.isPaused = false;
                this.next();
            }
        }, {
            key: "movePrevious",
            value: function movePrevious() {
                this.isPaused = false;
                this.previous();
            }
        }, {
            key: "onNext",
            value: function onNext() {
                if (this.isPaused) return;
                if (this.steps[this.stepIndex] && this.steps[this.stepIndex].onNext) this.steps[this.stepIndex].onNext();
            }
        }, {
            key: "onPrevious",
            value: function onPrevious() {
                if (this.isPaused) return;
                if (this.steps[this.stepIndex] && this.steps[this.stepIndex].onPrevious) this.steps[this.stepIndex].onPrevious();
            }
        }, {
            key: "next",
            value: function next() {
                if (this.isPaused) return;
                this.stepIndex++;
                this.clear();
                if (this.steps.length === 0) return false;

                if (this.stepIndex >= this.steps.length) {
                    this.stop();
                    return;
                }

                this.render(this.steps[this.stepIndex]);
            }
        }, {
            key: "previous",
            value: function previous() {
                if (this.isPaused) return;
                this.stepIndex--;
                this.clear();
                if (this.steps.length === 0) return false;

                if (this.stepIndex < 0) {
                    this.stop();
                    return;
                }

                this.render(this.steps[this.stepIndex]);
            }
        }, {
            key: "render",
            value: function render(step) {
                var element = step.element ? this.document.querySelector(step.element) : null;

                if (element) {
                    element.style.position = !element.style.position ? 'relative' : element.style.position;
                    var step_highlight = !step.highlight ? true : step.highlight;

                    if (this.options.highlight && step_highlight) {
                        element.setAttribute('wt-highlight', 'true');
                    }
                }

                var popover = this.document.createElement('div');
                popover.classList.add('wt-popover');
                popover.style.borderRadius = this.options.borderRadius + 'px';
                popover.style.zIndex = this.options.zIndex + 10;
                if (step.placement) popover.classList.add(step.placement);

                if (this.options.width) {
                    if (typeof this.options.width === 'string') {
                        popover.style.width = this.options.width;
                    } else if (this.options.width > 0) {
                        popover.style.width = this.options.width + 'px';
                    }
                }

                if (step.width) {
                    if (typeof step.width === 'string') {
                        popover.style.width = step.width;
                    } else if (step.width > 0) {
                        popover.style.width = step.width + 'px';
                    }
                }

                /*
                 * <div id="panel-6" class="panel">
			            <div class="panel-hdr bg-primary-700 bg-success-gradient">				
				            <h2>
					            Panel <span class="fw-300">Colors</span> 
				            </h2>
			            </div>
			            <div class="panel-container show">
				            <div class="panel-content">
					
					
				            </div>
			            </div>
		            </div>
                 */

                //NEW
                var popoverInner = this.document.createElement('div');
                popoverInner.id = 'panel-6';
                popoverInner.classList.add('panel');

                var popoverInner1 = this.document.createElement('div');                
                popoverInner1.classList.add('panel-hdr');
                popoverInner1.classList.add('bg-primary-700');
                popoverInner1.classList.add('bg-success-gradient');
                popoverInner.append(popoverInner1);

                var popoverInnerH2 = this.document.createElement('h2');                
                if (step.title) popoverInnerH2.innerHTML = step.title;
                popoverInner1.append(popoverInnerH2);

                var popoverInner2 = this.document.createElement('div');
                popoverInner2.classList.add('panel-container');                
                popoverInner2.classList.add('show');
                popoverInner.append(popoverInner2);                

                var panelContent = this.document.createElement('div');
                panelContent.classList.add('panel-content');
                popoverInner2.append(panelContent);

                var popoverInnerFooter = this.document.createElement('div');
                popoverInnerFooter.classList.add('panel-content');
                popoverInnerFooter.classList.add('d-flex');
                popoverInnerFooter.classList.add('py-2');
                popoverInnerFooter.classList.add('rounded-bottom');
                popoverInnerFooter.classList.add('border-faded');
                popoverInnerFooter.classList.add('border-left-0');
                popoverInnerFooter.classList.add('border-right-0');
                popoverInnerFooter.classList.add('border-bottom-0');
                popoverInnerFooter.classList.add('text-muted');
                popoverInner2.append(popoverInnerFooter);

                //form-check-inline ml-auto
                var popoverInnerFooterButton = this.document.createElement('div');
                popoverInnerFooterButton.classList.add('form-check-inline');
                popoverInnerFooterButton.classList.add('ml-auto');
                popoverInnerFooter.append(popoverInnerFooterButton);

                //custom-control custom-radio
                var popoverInnerFooterButton2 = this.document.createElement('div');
                popoverInnerFooterButton2.classList.add('custom-control');                
                popoverInnerFooterButton.append(popoverInnerFooterButton2);

                

                var panelContentP = this.document.createElement('p');
                panelContentP.innerHTML = step.content;
                panelContent.append(panelContentP);

               
                

                var showBtns = step.showBtns == null || step.showBtns == 'undefined' ? true : Boolean(step.showBtns);

                if (showBtns) {
                    //var btnNext = this.document.createElement('button');
                    var btnBack = this.document.createElement('button');
                    //btnNext.classList.add('wt-btns', 'wt-btn-next');
                    btnBack.classList.add('wt-btns', 'wt-btn-back');
                    //btnNext.innerHTML = step.btnNext && step.btnNext.text ? step.btnNext.text : this.stepIndex == this.steps.length - 1 ? 'Done' : 'Next &#8594;';
                    btnBack.innerHTML = step.btnBack && step.btnBack.text ? step.btnBack.text : this.stepIndex == 0 ? 'Close' : '	&#8592; Back';
                    //btnNext.style.backgroundColor = step.btnNext && step.btnNext.backgroundColor ? step.btnNext.backgroundColor : '#7cd1f9';
                    //btnNext.style.color = step.btnNext && step.btnNext.textColor ? step.btnNext.textColor : '#fff';
                    btnBack.style.backgroundColor = step.btnBack && step.btnBack.backgroundColor ? step.btnBack.backgroundColor : '#efefef;';
                    btnBack.style.color = step.btnBack && step.btnBack.textColor ? step.btnBack.textColor : '#555';
                    //popoverInner.append(btnNext);

                    

                    if (1 < this.steps.length) {
                        var btnNext = this.document.createElement('button');
                        btnNext.classList.add('wt-btns', 'wt-btn-next');
                        btnNext.innerHTML = step.btnNext && step.btnNext.text ? step.btnNext.text : this.stepIndex == this.steps.length - 1 ? 'Done' : 'Next &#8594;';
                        btnNext.style.backgroundColor = step.btnNext && step.btnNext.backgroundColor ? step.btnNext.backgroundColor : '#7cd1f9';
                        btnNext.style.color = step.btnNext && step.btnNext.textColor ? step.btnNext.textColor : '#fff';
                        popoverInnerFooterButton2.append(btnNext);
                    }
                    popoverInnerFooterButton2.append(btnBack);
                    
                }
                //NEW END

                
                //var popoverInner = this.document.createElement('div');
                //popoverInner.classList.add('wt-popover-inner');
                //var title = this.document.createElement('div');
                //title.classList.add('wt-title');
                //if (step.title) popoverInner.append(title);
                //if (step.title) title.innerText = step.title;
                //var content = this.document.createElement('div');
                //content.classList.add('wt-content');
                //popoverInner.append(content);
                //content.innerHTML = step.content ? step.content : '';

                ////popoverMain.append(popoverInner);

                //var showBtns = step.showBtns == null || step.showBtns == 'undefined' ? true : Boolean(step.showBtns);

                //if (showBtns) {
                //    //var btnNext = this.document.createElement('button');
                //    var btnBack = this.document.createElement('button');
                //    //btnNext.classList.add('wt-btns', 'wt-btn-next');
                //    btnBack.classList.add('wt-btns', 'wt-btn-back');
                //    //btnNext.innerHTML = step.btnNext && step.btnNext.text ? step.btnNext.text : this.stepIndex == this.steps.length - 1 ? 'Done' : 'Next &#8594;';
                //    btnBack.innerHTML = step.btnBack && step.btnBack.text ? step.btnBack.text : this.stepIndex == 0 ? 'Close' : '	&#8592; Back';
                //    //btnNext.style.backgroundColor = step.btnNext && step.btnNext.backgroundColor ? step.btnNext.backgroundColor : '#7cd1f9';
                //    //btnNext.style.color = step.btnNext && step.btnNext.textColor ? step.btnNext.textColor : '#fff';
                //    btnBack.style.backgroundColor = step.btnBack && step.btnBack.backgroundColor ? step.btnBack.backgroundColor : '#efefef;';
                //    btnBack.style.color = step.btnBack && step.btnBack.textColor ? step.btnBack.textColor : '#555';
                //    //popoverInner.append(btnNext);

                //    if (1 < this.steps.length) {
                //        var btnNext = this.document.createElement('button');
                //        btnNext.classList.add('wt-btns', 'wt-btn-next');
                //        btnNext.innerHTML = step.btnNext && step.btnNext.text ? step.btnNext.text : this.stepIndex == this.steps.length - 1 ? 'Done' : 'Next &#8594;';
                //        btnNext.style.backgroundColor = step.btnNext && step.btnNext.backgroundColor ? step.btnNext.backgroundColor : '#7cd1f9';
                //        btnNext.style.color = step.btnNext && step.btnNext.textColor ? step.btnNext.textColor : '#fff';
                //        popoverInner.append(btnNext);
                //    }

                //    popoverInner.append(btnBack);


                //}

                var arrow = this.document.createElement('div');
                arrow.classList.add('wt-arrow');
                arrow.setAttribute('data-popper-arrow', 'true');
                popover.append(arrow);
                popover.append(popoverInner);
                this.document.body.appendChild(popover);

                if (element) {
                    this.positionPopover(element, popover, arrow, step);

                    if (this.options.highlight) {
                        this.createOverlay(element, step);
                    }
                } else {
                    popover.classList.add('wt-slides');
                    popover.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                        inline: "center"
                    });

                    if (this.options.highlight) {
                        var overlay = document.createElement('div');
                        overlay.classList.add('wt-overlay', 'open');
                        overlay.style.zIndex = this.options.zIndex - 10;
                        overlay.style.position = 'fixed';
                        overlay.style.top = 0;
                        overlay.style.left = 0;
                        overlay.style.right = 0;
                        overlay.style.bottom = 0;
                        this.document.body.appendChild(overlay);
                    }

                    arrow.remove();
                }

                if (this.options.removeArrow) {
                    arrow.remove();
                }
            }
        }, {
            key: "clear",
            value: function clear() {
                var popup = this.document.querySelector('.wt-popover');
                var loader = this.document.querySelector('.wt-loader');
                if (popup) popup.remove();
                if (loader) loader.remove();
                this.document.querySelectorAll('.wt-overlay').forEach(function (element) {
                    element.remove();
                });
                this.document.querySelectorAll('*[wt-highlight]').forEach(function (element) {
                    element.removeAttribute('wt-highlight');
                });
            }
        }, {
            key: "getWindowOffset",
            value: function getWindowOffset() {
                return {
                    height: this.window.innerHeight - (this.window.innerHeight - this.document.documentElement.clientHeight),
                    width: this.window.innerWidth - (this.window.innerWidth - this.document.documentElement.clientWidth)
                };
            }
        }, {
            key: "getOffset",
            value: function getOffset(el) {
                var _x = 0;
                var _y = 0;
                var rect = el.getBoundingClientRect();

                while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
                    _x += el.offsetLeft - el.scrollLeft;
                    _y += el.offsetTop - el.scrollTop;
                    el = el.offsetParent;
                }

                _y = parseInt(rect.y) > parseInt(_y) ? rect.y : _y;
                _x = parseInt(rect.x) > parseInt(_x) ? rect.x : _x;
                return {
                    top: _y,
                    left: _x
                };
            }
        }, {
            key: "getTranslateXY",
            value: function getTranslateXY(element) {
                var style = window.getComputedStyle(element);
                var matrix = new DOMMatrixReadOnly(style.transform);
                return {
                    translateX: Math.abs(element.offsetWidth * (matrix.m41 / 100)),
                    translateY: Math.abs(element.offsetHeight * (matrix.m42 / 100))
                };
            }
        }, {
            key: "getTranslate3D",
            value: function getTranslate3D(element) {
                var transform = window.getComputedStyle(element, null).getPropertyValue('-webkit-transform');
                var results = transform.match(/matrix(?:(3d)\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))(?:, (-{0,1}\d+)), -{0,1}\d+\)|\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}.+))(?:, (-{0,1}.+))\))/);
                var x, y, z;

                if (!results) {
                    return {
                        X: 0,
                        Y: 0,
                        Z: 0
                    };
                }

                if (results[1] == '3d') {
                    var _results$slice = results.slice(2, 5);

                    var _results$slice2 = _slicedToArray(_results$slice, 3);

                    x = _results$slice2[0];
                    y = _results$slice2[1];
                    z = _results$slice2[2];
                    return {
                        X: x,
                        Y: y,
                        Z: z
                    };
                }

                results.push(0);

                var _results$slice3 = results.slice(5, 8);

                var _results$slice4 = _slicedToArray(_results$slice3, 3);

                x = _results$slice4[0];
                y = _results$slice4[1];
                z = _results$slice4[2];
                return {
                    X: x,
                    Y: y,
                    Z: z
                };
            }
        }, {
            key: "getElementPosition",
            value: function getElementPosition(element) {
                return {
                    top: this.getOffset(element).top + this.getTranslate3D(element).Y - (element.style.transform ? this.getTranslateXY(element).translateY : 0),
                    left: this.getOffset(element).left + this.getTranslate3D(element).X - (element.style.transform ? this.getTranslateXY(element).translateX : 0)
                };
            }
        }, {
            key: "positionPopover",
            value: function positionPopover(element, popover, arrow, step) {
                var placement = step.placement || 'auto';
                var strategy = step.strategy || 'absolute';
                popover.style.position = strategy;
                arrow.style.position = 'absolute';
                var el_top, el_left;
                el_top = this.getElementPosition(element).top;
                el_left = this.getElementPosition(element).left;

                if (placement == 'auto' || placement == 'auto-start' || placement == 'auto-end') {
                    var _arrow = placement.replace('auto', '').trim();

                    var new_arrow = '';

                    if (el_top + (popover.offsetHeight + this.options.offset) > this.window.innerHeight - 100) {
                        if (el_left < this.window.innerWidth / 3) {
                            new_arrow = _arrow.length > 0 ? _arrow : '-start';
                        } else if (el_left > this.window.innerWidth - this.window.innerWidth / 3) {
                            new_arrow = _arrow.length > 0 ? _arrow : '-end';
                        }

                        placement = 'top' + new_arrow;
                    }

                    if (el_left + element.offsetWidth + popover.offsetWidth > this.window.innerWidth) {
                        if (el_top < this.window.innerHeight / 3) {
                            new_arrow = _arrow.length > 0 ? _arrow : '-start';
                        } else if (el_top > this.window.innerHeight - this.window.innerHeight / 3) {
                            new_arrow = _arrow.length > 0 ? _arrow : '-start';
                        }

                        placement = 'left' + new_arrow;
                    }

                    if (el_left < popover.offsetWidth && element.offsetWidth + popover.offsetWidth < this.window.innerWidth) {
                        if (el_top < this.window.innerHeight / 3) {
                            new_arrow = _arrow.length > 0 ? _arrow : '-start';
                        } else if (el_top > this.window.innerHeight - this.window.innerHeight / 3) {
                            new_arrow = _arrow.length > 0 ? _arrow : '-start';
                        }

                        placement = 'right' + new_arrow;
                    }

                    if (el_top < popover.offsetHeight + this.options.offset || el_top < 100) {
                        if (el_left < this.window.innerWidth / 3) {
                            new_arrow = _arrow.length > 0 ? _arrow : '-start';
                        } else if (el_left > this.window.innerWidth - this.window.innerWidth / 3) {
                            new_arrow = _arrow.length > 0 ? _arrow : '-end';
                        }

                        placement = 'bottom' + new_arrow;
                    }

                    popover.classList.add(placement);
                }

                if (placement == 'top') {
                    popover.style.top = el_top - (popover.offsetHeight + this.options.offset) + 'px';
                    popover.style.left = el_left + (element.offsetWidth / 2 - popover.offsetWidth / 2) + 'px';
                } else if (placement == 'top-start') {
                    popover.style.top = el_top - (popover.offsetHeight + this.options.offset) + 'px';
                    popover.style.left = el_left - this.options.highlightOffset + 'px';
                } else if (placement == 'top-end') {
                    popover.style.top = el_top - (popover.offsetHeight + this.options.offset) + 'px';
                    popover.style.left = el_left + element.offsetWidth + this.options.highlightOffset - popover.offsetWidth + 'px';
                } else if (placement == 'bottom') {
                    popover.style.top = el_top + element.offsetHeight + this.options.offset + 'px';
                    popover.style.left = el_left + element.offsetWidth / 2 - popover.offsetWidth / 2 + 'px';
                } else if (placement == 'bottom-start') {
                    popover.style.top = el_top + element.offsetHeight + this.options.offset + 'px';
                    popover.style.left = el_left - this.options.highlightOffset + 'px';
                } else if (placement == 'bottom-end') {
                    popover.style.top = el_top + element.offsetHeight + this.options.offset + 'px';
                    popover.style.left = el_left + element.offsetWidth + this.options.highlightOffset - popover.offsetWidth + 'px';
                } else if (placement == 'right') {
                    popover.style.top = el_top + Math.abs(popover.offsetHeight - element.offsetHeight) / 2 + 'px';
                    popover.style.left = el_left + (element.offsetWidth + this.options.offset) + 'px';
                } else if (placement == 'right-start') {
                    popover.style.top = el_top - this.options.highlightOffset + 'px';
                    popover.style.left = el_left + (element.offsetWidth + this.options.offset) + 'px';
                } else if (placement == 'right-end') {
                    popover.style.top = el_top + element.offsetHeight - popover.offsetHeight + this.options.highlightOffset + 'px';
                    popover.style.left = el_left + (element.offsetWidth + this.options.offset) + 'px';
                } else if (placement == 'left') {
                    popover.style.top = el_top + Math.abs(popover.offsetHeight - element.offsetHeight) / 2 + 'px';
                    popover.style.left = el_left - (popover.offsetWidth + this.options.offset) + 'px';
                } else if (placement == 'left-start') {
                    popover.style.top = el_top - this.options.highlightOffset + 'px';
                    popover.style.left = el_left - (popover.offsetWidth + this.options.offset) + 'px';
                } else if (placement == 'left-end') {
                    popover.style.top = el_top + element.offsetHeight - popover.offsetHeight + this.options.highlightOffset + 'px';
                    popover.style.left = el_left - (popover.offsetWidth + this.options.offset) + 'px';
                }

                if (strategy === 'fixed') {
                    this.window.scrollTo(0, 0);
                } else {
                    popover.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                        inline: "nearest"
                    });
                }
            }
        }, {
            key: "createOverlay",
            value: function createOverlay(element) {
                var step = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
                var strategy = step && step.strategy ? step.strategy : 'absolute';
                var overlay1 = document.createElement('div');
                overlay1.classList.add('wt-overlay', 'open', 'overlay1');
                overlay1.style.zIndex = this.options.zIndex - 10;
                var overlay2 = document.createElement('div');
                overlay2.classList.add('wt-overlay', 'open', 'overlay2');
                overlay2.style.zIndex = this.options.zIndex - 10;
                var overlay3 = document.createElement('div');
                overlay3.classList.add('wt-overlay', 'open', 'overlay3');
                overlay3.style.zIndex = this.options.zIndex - 10;
                var overlay4 = document.createElement('div');
                overlay4.classList.add('wt-overlay', 'open', 'overlay4');
                overlay4.style.zIndex = this.options.zIndex - 10;
                this.document.body.appendChild(overlay1);
                this.document.body.appendChild(overlay2);
                this.document.body.appendChild(overlay3);
                this.document.body.appendChild(overlay4);
                var el_top, el_left;
                el_top = this.getElementPosition(element).top;
                el_left = this.getElementPosition(element).left;
                var highlight_offset = this.options.highlightOffset;
                overlay1.style.position = strategy;
                overlay1.style.top = 0;
                overlay1.style.width = el_left - highlight_offset + 'px';
                overlay1.style.height = el_top + element.offsetHeight + highlight_offset + 'px';
                overlay1.style.left = 0;
                overlay2.style.position = strategy;
                overlay2.style.top = 0;
                overlay2.style.right = 0;
                overlay2.style.height = el_top - highlight_offset + 'px';
                overlay2.style.left = el_left - highlight_offset + 'px';
                overlay3.style.position = strategy;
                overlay3.style.top = el_top - highlight_offset + 'px';
                overlay3.style.right = 0;
                overlay3.style.bottom = 0 - (this.document.body.offsetHeight - this.window.innerHeight) + 'px';
                overlay3.style.left = el_left + element.offsetWidth + highlight_offset + 'px';
                overlay4.style.position = strategy;
                overlay4.style.top = el_top + element.offsetHeight + highlight_offset + 'px';
                overlay4.style.width = el_left + element.offsetWidth + highlight_offset + 'px';
                overlay4.style.bottom = 0 - (this.document.body.offsetHeight - this.window.innerHeight) + 'px';
                overlay4.style.left = 0;
            }
        }]);

        return WebTour;
    }();

    return WebTour;

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VidG91ci5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYlRvdXIgeyAgICBcclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xyXG4gICAgICAgIGlmICghIXRoaXMuY29uc3RydWN0b3IuaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuaW5zdGFuY2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLmluc3RhbmNlID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0ge1xyXG4gICAgICAgICAgICBhbmltYXRlOiB0cnVlLFxyXG4gICAgICAgICAgICBvcGFjaXR5OiAwLjUsXHJcbiAgICAgICAgICAgIG9mZnNldDogMjAsXHJcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogMyxcclxuICAgICAgICAgICAgYWxsb3dDbG9zZTogdHJ1ZSxcclxuICAgICAgICAgICAgaGlnaGxpZ2h0OiB0cnVlLFxyXG4gICAgICAgICAgICBoaWdobGlnaHRPZmZzZXQ6IDUsXHJcbiAgICAgICAgICAgIGtleWJvYXJkOiB0cnVlLFxyXG4gICAgICAgICAgICB3aWR0aDogJzMwMHB4JyxcclxuICAgICAgICAgICAgekluZGV4OiAxMDA1MCxcclxuICAgICAgICAgICAgcmVtb3ZlQXJyb3c6IGZhbHNlLFxyXG4gICAgICAgICAgICBvbk5leHQ6ICgpID0+IG51bGwsXHJcbiAgICAgICAgICAgIG9uUHJldmlvdXM6ICgpID0+IG51bGwsXHJcbiAgICAgICAgICAgIC4uLm9wdGlvbnMsXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnN0ZXBzID0gW107XHJcbiAgICAgICAgdGhpcy5zdGVwSW5kZXggPSAwO1xyXG4gICAgICAgIHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5pc1BhdXNlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvL2VsZW1lbnRzXHJcbiAgICAgICAgdGhpcy53aW5kb3cgPSB3aW5kb3c7XHJcbiAgICAgICAgdGhpcy5kb2N1bWVudCA9IGRvY3VtZW50O1xyXG5cclxuICAgICAgICAvL2V2ZW50c1xyXG4gICAgICAgIHRoaXMub25DbGljayA9IHRoaXMub25DbGljay5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMub25SZXNpemUgPSB0aGlzLm9uUmVzaXplLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5vbktleVVwID0gdGhpcy5vbktleVVwLmJpbmQodGhpcyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5iaW5kKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBiaW5kKCkge1xyXG4gICAgICAgIGlmICghKCdvbnRvdWNoc3RhcnQnIGluIHRoaXMuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSkge1xyXG4gICAgICAgICAgICB0aGlzLndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25DbGljaywgZmFsc2UpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLm9uQ2xpY2ssIGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMub25SZXNpemUsIGZhbHNlKTtcclxuICAgICAgICB0aGlzLndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMub25LZXlVcCwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQ2xpY2soZSkge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnd3QtYnRuLW5leHQnKSkge1xyXG4gICAgICAgICAgICB0aGlzLm9uTmV4dCgpO1xyXG4gICAgICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3d0LWJ0bi1iYWNrJykpIHtcclxuICAgICAgICAgICAgdGhpcy5vblByZXZpb3VzKCk7XHJcbiAgICAgICAgICAgIHRoaXMucHJldmlvdXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3d0LW92ZXJsYXknKSkge1xyXG4gICAgICAgICAgICAvL2lmIGFsbG93Q2xvc2UgPSB0cnVlIGNsb3NlIHdoZW4gYmFja2Ryb3AgaXMgY2xpY2tcclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hbGxvd0Nsb3NlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbktleVVwKGV2ZW50KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzUnVubmluZyB8fCAhdGhpcy5vcHRpb25zLmtleWJvYXJkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSAyNyAmJiB0aGlzLm9wdGlvbnMuYWxsb3dDbG9zZSkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9yaWdodCBrZXkgZm9yIG5leHRcclxuICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzkpIHtcclxuICAgICAgICAgICAgdGhpcy5vbk5leHQoKTtcclxuICAgICAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICAgICAvL2xlZnQga2V5IGZvciBiYWNrXHJcbiAgICAgICAgZWxzZSBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzcgKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25QcmV2aW91cygpO1xyXG4gICAgICAgICAgICB0aGlzLnByZXZpb3VzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vcGFnZSBpcyByZXNpemUgdXBkYXRlIHBvcG92ZXJcclxuICAgIG9uUmVzaXplKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pc1J1bm5pbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKHRoaXMuc3RlcHNbdGhpcy5zdGVwSW5kZXhdKTtcclxuICAgIH1cclxuXHJcbiAgICAvL3NldCB3ZWIgdG91ciBzdGVwc1xyXG4gICAgc2V0U3RlcHMoc3RlcHMpIHtcclxuICAgICAgICB0aGlzLnN0ZXBzID0gbnVsbDtcclxuICAgICAgICB0aGlzLnN0ZXBzID0gc3RlcHM7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldFN0ZXBzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN0ZXBzO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZ2hsaWdodChlbGVtZW50LCBzdGVwID0gbnVsbCl7XHJcbiAgICAgICAgdGhpcy5pc1J1bm5pbmcgPSB0cnVlO1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gdGhpcy5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsZW1lbnQpO1xyXG4gICAgICAgIGlmIChlbGVtZW50KXtcclxuICAgICAgICAgICAgaWYgKHN0ZXApe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGVwcyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0ZXBJbmRleCA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0ZXBzID0gc3RlcDtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKHRoaXMuc3RlcHNbdGhpcy5zdGVwSW5kZXhdKTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZU92ZXJsYXkoZWxlbWVudCwgc3RlcCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvL3N0YXJ0IHRoZSB3ZWIgdG91clxyXG4gICAgc3RhcnQoc3RhcnRJbmRleCA9IDApIHtcclxuICAgICAgICB0aGlzLmlzUnVubmluZyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5zdGVwSW5kZXggPSBzdGFydEluZGV4O1xyXG4gICAgICAgIHRoaXMucmVuZGVyKHRoaXMuc3RlcHNbdGhpcy5zdGVwSW5kZXhdKTtcclxuICAgIH1cclxuXHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIHRoaXMuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vc2hvdyBsb2FkZXIgcHJvZ3Jlc3NcclxuICAgIHNob3dMb2FkZXIoKSB7XHJcbiAgICAgICAgY29uc3QgcG9wb3ZlciA9IHRoaXMuZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnd0LXBvcG92ZXInKTtcclxuICAgICAgICBjb25zdCBsb2FkZXIgPSB0aGlzLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGxvYWRlci5jbGFzc0xpc3QuYWRkKCd3dC1sb2FkZXInKTtcclxuICAgICAgICBsb2FkZXIuc3R5bGUuekluZGV4ID0gdGhpcy5vcHRpb25zLnpJbmRleCArIDEwO1xyXG4gICAgICAgIHBvcG92ZXIucHJlcGVuZChsb2FkZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdmVOZXh0KCkge1xyXG4gICAgICAgIHRoaXMuaXNQYXVzZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlUHJldmlvdXMoKSB7XHJcbiAgICAgICAgdGhpcy5pc1BhdXNlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucHJldmlvdXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk5leHQoKXtcclxuICAgICAgICBpZiAodGhpcy5pc1BhdXNlZCkgcmV0dXJuO1xyXG4gICAgICAgIC8vZXhlY3V0ZSBvbk5leHQgZnVuY3Rpb24oKVxyXG4gICAgICAgIGlmICh0aGlzLnN0ZXBzW3RoaXMuc3RlcEluZGV4XSAmJiB0aGlzLnN0ZXBzW3RoaXMuc3RlcEluZGV4XS5vbk5leHQpIHRoaXMuc3RlcHNbdGhpcy5zdGVwSW5kZXhdLm9uTmV4dCgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uUHJldmlvdXMoKXtcclxuICAgICAgICBpZiAodGhpcy5pc1BhdXNlZCkgcmV0dXJuO1xyXG4gICAgICAgIC8vZXhlY3V0ZSBvbkJhY2sgZnVuY3Rpb24oKVxyXG4gICAgICAgIGlmICh0aGlzLnN0ZXBzW3RoaXMuc3RlcEluZGV4XSAmJiB0aGlzLnN0ZXBzW3RoaXMuc3RlcEluZGV4XS5vblByZXZpb3VzKSB0aGlzLnN0ZXBzW3RoaXMuc3RlcEluZGV4XS5vblByZXZpb3VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqZ28gdG8gbmV4dCBzdGVwICovXHJcbiAgICBuZXh0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzUGF1c2VkKSByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMuc3RlcEluZGV4Kys7XHJcbiAgICAgICAgdGhpcy5jbGVhcigpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGVwcy5sZW5ndGggPT09IDApIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RlcEluZGV4ID49IHRoaXMuc3RlcHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJlbmRlcih0aGlzLnN0ZXBzW3RoaXMuc3RlcEluZGV4XSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJldmlvdXMoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNQYXVzZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy5zdGVwSW5kZXgtLTtcclxuICAgICAgICB0aGlzLmNsZWFyKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0ZXBzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGVwSW5kZXggPCAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJlbmRlcih0aGlzLnN0ZXBzW3RoaXMuc3RlcEluZGV4XSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9hZGQgdGhlIHBvcG92ZXIgdG8gZG9jdW1lbnRcclxuICAgIHJlbmRlcihzdGVwKSB7XHJcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBzdGVwLmVsZW1lbnQgPyB0aGlzLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc3RlcC5lbGVtZW50KSA6IG51bGw7XHJcblxyXG4gICAgICAgIC8vY2hlY2sgaWYgZWxlbWVudCBpcyBwcmVzZW50IGlmIG5vdCBtYWtlIGl0IGZsb2F0aW5nXHJcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICFlbGVtZW50LnN0eWxlLnBvc2l0aW9uID8gJ3JlbGF0aXZlJyA6IGVsZW1lbnQuc3R5bGUucG9zaXRpb247XHJcbiAgICAgICAgICAgIGNvbnN0IHN0ZXBfaGlnaGxpZ2h0ID0gIXN0ZXAuaGlnaGxpZ2h0ID8gdHJ1ZSA6IHN0ZXAuaGlnaGxpZ2h0OyAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgLy9oaWdobGlnaHQgaXMgc2V0IHRvIHRydWVcclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5oaWdobGlnaHQgJiYgc3RlcF9oaWdobGlnaHQgKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnd3QtaGlnaGxpZ2h0JywgJ3RydWUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9wb3BvdmVyXHJcbiAgICAgICAgY29uc3QgcG9wb3ZlciA9IHRoaXMuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7ICAgICAgICBcclxuICAgICAgICBwb3BvdmVyLmNsYXNzTGlzdC5hZGQoJ3d0LXBvcG92ZXInKTtcclxuICAgICAgICBwb3BvdmVyLnN0eWxlLmJvcmRlclJhZGl1cyA9IHRoaXMub3B0aW9ucy5ib3JkZXJSYWRpdXMgKyAncHgnO1xyXG4gICAgICAgIHBvcG92ZXIuc3R5bGUuekluZGV4ID0gdGhpcy5vcHRpb25zLnpJbmRleCArIDEwO1xyXG4gICAgICAgIGlmIChzdGVwLnBsYWNlbWVudCkgcG9wb3Zlci5jbGFzc0xpc3QuYWRkKHN0ZXAucGxhY2VtZW50KTsgLy9hZGQgdXNlciBkZWZpbmUgcGxhY2VtZW50IHRvIGNsYXNzIGZvciBwb3NpdGlvbiBpbiBjc3NcclxuXHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy53aWR0aCkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy53aWR0aCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgIHBvcG92ZXIuc3R5bGUud2lkdGggPSB0aGlzLm9wdGlvbnMud2lkdGg7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLndpZHRoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgcG9wb3Zlci5zdHlsZS53aWR0aCA9IHRoaXMub3B0aW9ucy53aWR0aCArICdweCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzdGVwLndpZHRoKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc3RlcC53aWR0aCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgIHBvcG92ZXIuc3R5bGUud2lkdGggPSBzdGVwLndpZHRoO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN0ZXAud2lkdGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBwb3BvdmVyLnN0eWxlLndpZHRoID0gc3RlcC53aWR0aCArICdweCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vcG9wb3ZlciBpbm5lciBjb250YWluZXJcclxuICAgICAgICBjb25zdCBwb3BvdmVySW5uZXIgPSB0aGlzLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHBvcG92ZXJJbm5lci5jbGFzc0xpc3QuYWRkKCd3dC1wb3BvdmVyLWlubmVyJyk7XHJcbiAgICAgICBcclxuICAgICAgICAvL3RpdGxlXHJcbiAgICAgICAgY29uc3QgdGl0bGUgPSB0aGlzLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHRpdGxlLmNsYXNzTGlzdC5hZGQoJ3d0LXRpdGxlJyk7XHJcbiAgICAgICAgaWYgKHN0ZXAudGl0bGUpIHBvcG92ZXJJbm5lci5hcHBlbmQodGl0bGUpO1xyXG4gICAgICAgIGlmIChzdGVwLnRpdGxlKSB0aXRsZS5pbm5lclRleHQgPSBzdGVwLnRpdGxlO1xyXG5cclxuICAgICAgICAvL2NvbnRlbnRcclxuICAgICAgICBjb25zdCBjb250ZW50ID0gdGhpcy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjb250ZW50LmNsYXNzTGlzdC5hZGQoJ3d0LWNvbnRlbnQnKTtcclxuICAgICAgICBwb3BvdmVySW5uZXIuYXBwZW5kKGNvbnRlbnQpO1xyXG4gICAgICAgIGNvbnRlbnQuaW5uZXJIVE1MID0gKHN0ZXAuY29udGVudCA/IHN0ZXAuY29udGVudCA6ICcnKTtcclxuICAgICAgICBcclxuICAgICAgICAvL2J1dHRvbnNcclxuICAgICAgICBjb25zdCBzaG93QnRucyA9IChzdGVwLnNob3dCdG5zID09IG51bGwgfHwgc3RlcC5zaG93QnRucyA9PSAndW5kZWZpbmVkJykgPyB0cnVlIDogQm9vbGVhbihzdGVwLnNob3dCdG5zKTtcclxuXHJcbiAgICAgICAgaWYgKHNob3dCdG5zKXtcclxuICAgICAgICAgICAgY29uc3QgYnRuTmV4dCA9IHRoaXMuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ0bkJhY2sgPSB0aGlzLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG5cclxuICAgICAgICAgICAgYnRuTmV4dC5jbGFzc0xpc3QuYWRkKCd3dC1idG5zJywgJ3d0LWJ0bi1uZXh0Jyk7XHJcbiAgICAgICAgICAgIGJ0bkJhY2suY2xhc3NMaXN0LmFkZCgnd3QtYnRucycsICd3dC1idG4tYmFjaycpO1xyXG5cclxuICAgICAgICAgICAgYnRuTmV4dC5pbm5lckhUTUwgPSAoc3RlcC5idG5OZXh0ICYmIHN0ZXAuYnRuTmV4dC50ZXh0ID8gc3RlcC5idG5OZXh0LnRleHQgOiAodGhpcy5zdGVwSW5kZXggPT0gdGhpcy5zdGVwcy5sZW5ndGggLSAxID8gJ0RvbmUnIDogJ05leHQgJiM4NTk0OycpKTtcclxuICAgICAgICAgICAgYnRuQmFjay5pbm5lckhUTUwgPSAoc3RlcC5idG5CYWNrICYmIHN0ZXAuYnRuQmFjay50ZXh0ID8gc3RlcC5idG5CYWNrLnRleHQgOiAodGhpcy5zdGVwSW5kZXggPT0gMCA/ICdDbG9zZScgOiAnXHQmIzg1OTI7IEJhY2snKSk7XHJcblxyXG4gICAgICAgICAgICAvL2FkZCBzdHlsZXNcclxuICAgICAgICAgICAgYnRuTmV4dC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAoc3RlcC5idG5OZXh0ICYmIHN0ZXAuYnRuTmV4dC5iYWNrZ3JvdW5kQ29sb3IgPyBzdGVwLmJ0bk5leHQuYmFja2dyb3VuZENvbG9yIDogJyM3Y2QxZjknKTtcclxuICAgICAgICAgICAgYnRuTmV4dC5zdHlsZS5jb2xvciA9IChzdGVwLmJ0bk5leHQgJiYgc3RlcC5idG5OZXh0LnRleHRDb2xvciA/IHN0ZXAuYnRuTmV4dC50ZXh0Q29sb3IgOiAnI2ZmZicpO1xyXG5cclxuICAgICAgICAgICAgYnRuQmFjay5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAoc3RlcC5idG5CYWNrICYmIHN0ZXAuYnRuQmFjay5iYWNrZ3JvdW5kQ29sb3IgPyBzdGVwLmJ0bkJhY2suYmFja2dyb3VuZENvbG9yIDogJyNlZmVmZWY7Jyk7XHJcbiAgICAgICAgICAgIGJ0bkJhY2suc3R5bGUuY29sb3IgPSAoc3RlcC5idG5CYWNrICYmIHN0ZXAuYnRuQmFjay50ZXh0Q29sb3IgPyBzdGVwLmJ0bkJhY2sudGV4dENvbG9yIDogJyM1NTUnKTtcclxuICAgICAgICAgICAgcG9wb3ZlcklubmVyLmFwcGVuZChidG5OZXh0KTtcclxuICAgICAgICAgICAgcG9wb3ZlcklubmVyLmFwcGVuZChidG5CYWNrKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vcG9wb3ZlciBhcnJvd1xyXG4gICAgICAgIGNvbnN0IGFycm93ID0gdGhpcy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBhcnJvdy5jbGFzc0xpc3QuYWRkKCd3dC1hcnJvdycpO1xyXG4gICAgICAgIGFycm93LnNldEF0dHJpYnV0ZSgnZGF0YS1wb3BwZXItYXJyb3cnLCAndHJ1ZScpO1xyXG4gICAgICAgIHBvcG92ZXIuYXBwZW5kKGFycm93KTtcclxuXHJcbiAgICAgICAgLy9wb3BvdmVyIGlubmVyIGNvbnRhaW5lclxyXG4gICAgICAgIHBvcG92ZXIuYXBwZW5kKHBvcG92ZXJJbm5lcik7XHJcblxyXG4gICAgICAgIC8vYXBwZW5kIHBvcG92ZXIgdG8gYm9keVxyXG4gICAgICAgIHRoaXMuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChwb3BvdmVyKTtcclxuXHJcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvblBvcG92ZXIoZWxlbWVudCwgcG9wb3ZlciwgYXJyb3csIHN0ZXApO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmhpZ2hsaWdodCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZU92ZXJsYXkoZWxlbWVudCwgc3RlcCk7XHJcbiAgICAgICAgICAgIH0gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiBObyBlbGVtZW50IGlzIGRlZmluZVxyXG4gICAgICAgICogTWFrZSBwb3BvdmVyIGZsb2F0aW5nIChwb3NpdGlvbiBjZW50ZXIpXHJcbiAgICAgICAgKi9cclxuICAgICAgICBlbHNlIHsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHBvcG92ZXIuY2xhc3NMaXN0LmFkZCgnd3Qtc2xpZGVzJyk7XHJcbiAgICAgICAgICAgIHBvcG92ZXIuc2Nyb2xsSW50b1ZpZXcoe2JlaGF2aW9yOiBcInNtb290aFwiLCBibG9jazogXCJjZW50ZXJcIiwgaW5saW5lOiBcImNlbnRlclwifSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmhpZ2hsaWdodCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgb3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICAgICAgb3ZlcmxheS5jbGFzc0xpc3QuYWRkKCd3dC1vdmVybGF5JywgJ29wZW4nKTtcclxuICAgICAgICAgICAgICAgIG92ZXJsYXkuc3R5bGUuekluZGV4ID0gdGhpcy5vcHRpb25zLnpJbmRleCAtIDEwO1xyXG4gICAgICAgICAgICAgICAgb3ZlcmxheS5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XHJcbiAgICAgICAgICAgICAgICBvdmVybGF5LnN0eWxlLnRvcCA9IDA7XHJcbiAgICAgICAgICAgICAgICBvdmVybGF5LnN0eWxlLmxlZnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgb3ZlcmxheS5zdHlsZS5yaWdodCA9IDA7XHJcbiAgICAgICAgICAgICAgICBvdmVybGF5LnN0eWxlLmJvdHRvbSA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQob3ZlcmxheSk7XHJcbiAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBhcnJvdy5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vYWRkIG9wdGlvbiB0byByZW1vdmUgYXJyb3cgYmVjYXVzZSBwb3BwZXIgYXJyb3dzIGFyZSBub3QgcG9zaXRpb25pbmcgd2VsbFxyXG4gICAgICAgIC8vVE9ETzogZml4IHBvcHBlciBhcnJvd1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMucmVtb3ZlQXJyb3cpe1xyXG4gICAgICAgICAgICBhcnJvdy5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8vcmVtb3ZlIHBvcG92ZXJcclxuICAgIGNsZWFyKCkge1xyXG4gICAgICAgIHZhciBwb3B1cCA9IHRoaXMuZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnd0LXBvcG92ZXInKTtcclxuICAgICAgICB2YXIgbG9hZGVyID0gdGhpcy5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud3QtbG9hZGVyJyk7XHJcblxyXG4gICAgICAgIGlmIChwb3B1cCkgcG9wdXAucmVtb3ZlKCk7XHJcbiAgICAgICAgaWYgKGxvYWRlcikgbG9hZGVyLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53dC1vdmVybGF5JykuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHRoaXMuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnKlt3dC1oaWdobGlnaHRdJykuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnd3QtaGlnaGxpZ2h0Jyk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBnZXRXaW5kb3dPZmZzZXQoKXtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMud2luZG93LmlubmVySGVpZ2h0IC0gKHRoaXMud2luZG93LmlubmVySGVpZ2h0IC0gdGhpcy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0KSxcclxuICAgICAgICAgICAgd2lkdGg6IHRoaXMud2luZG93LmlubmVyV2lkdGggLSAodGhpcy53aW5kb3cuaW5uZXJXaWR0aCAtIHRoaXMuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoKSxcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0T2Zmc2V0KCBlbCApIHtcclxuICAgICAgICB2YXIgX3ggPSAwO1xyXG4gICAgICAgIHZhciBfeSA9IDA7XHJcbiAgICAgICAgdmFyIHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICAgICAgd2hpbGUoIGVsICYmICFpc05hTiggZWwub2Zmc2V0TGVmdCApICYmICFpc05hTiggZWwub2Zmc2V0VG9wICkgKSB7XHJcbiAgICAgICAgICAgIF94ICs9IGVsLm9mZnNldExlZnQgLSBlbC5zY3JvbGxMZWZ0O1xyXG4gICAgICAgICAgICBfeSArPSBlbC5vZmZzZXRUb3AgLSBlbC5zY3JvbGxUb3A7XHJcbiAgICAgICAgICAgIGVsID0gZWwub2Zmc2V0UGFyZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL2NvbnNvbGUubG9nKF95LCBfeCk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhwYXJzZUludChyZWN0LlkpLCBwYXJzZUludChyZWN0LlkpID4gcGFyc2VJbnQoX3kpKTtcclxuICAgICAgICBfeSA9IHBhcnNlSW50KHJlY3QueSkgPiBwYXJzZUludChfeSkgPyByZWN0LnkgOiBfeTtcclxuICAgICAgICBfeCA9IHBhcnNlSW50KHJlY3QueCkgPiBwYXJzZUludChfeCkgPyByZWN0LnggOiBfeDtcclxuICAgICAgIFxyXG4gICAgICAgIHJldHVybiB7IHRvcDogIF95ICwgbGVmdDogX3ggfTtcclxuICAgIH1cclxuXHJcbiAgICAvL2dldCBjc3MgdHJhbnNmb3JtIHByb3BlcnR5IHRvIGZpeGVkIGlzc3VlcyB3aXRoIHRyYW5zZm9ybSBlbGVtZW50c1xyXG4gICAgZ2V0VHJhbnNsYXRlWFkoZWxlbWVudCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudClcclxuICAgICAgICBjb25zdCBtYXRyaXggPSBuZXcgRE9NTWF0cml4UmVhZE9ubHkoc3R5bGUudHJhbnNmb3JtKVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0cmFuc2xhdGVYOiAgTWF0aC5hYnMoZWxlbWVudC5vZmZzZXRXaWR0aCAqIChtYXRyaXgubTQxIC8gMTAwKSksXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZVk6ICBNYXRoLmFicyhlbGVtZW50Lm9mZnNldEhlaWdodCAqIChtYXRyaXgubTQyIC8gMTAwKSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy9nZXQgY3NzIHRyYW5zZm9ybSBwcm9wZXJ0eSB0byBmaXhlZCBpc3N1ZXMgd2l0aCB0cmFuc2Zvcm0gZWxlbWVudHNcclxuICAgIGdldFRyYW5zbGF0ZTNEKGVsZW1lbnQpe1xyXG4gICAgICAgIHZhciB0cmFuc2Zvcm0gPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKCctd2Via2l0LXRyYW5zZm9ybScpO1xyXG4gICAgICAgIHZhciByZXN1bHRzID0gdHJhbnNmb3JtLm1hdGNoKC9tYXRyaXgoPzooM2QpXFwoLXswLDF9XFxkKyg/OiwgLXswLDF9XFxkKykqKD86LCAoLXswLDF9XFxkKykpKD86LCAoLXswLDF9XFxkKykpKD86LCAoLXswLDF9XFxkKykpLCAtezAsMX1cXGQrXFwpfFxcKC17MCwxfVxcZCsoPzosIC17MCwxfVxcZCspKig/OiwgKC17MCwxfS4rKSkoPzosICgtezAsMX0uKykpXFwpKS8pO1xyXG5cclxuICAgICAgICBsZXQgeCwgeSwgejtcclxuICAgICAgICBpZiAoIXJlc3VsdHMpIHsgICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHsgWDogMCwgWTogMCwgWjogMCB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVzdWx0c1sxXSA9PSAnM2QnKSB7XHJcbiAgICAgICAgICAgIFt4LCB5LCB6XSA9IHJlc3VsdHMuc2xpY2UoMiwgNSk7XHJcbiAgICAgICAgICAgIHJldHVybiB7IFg6IHgsIFk6IHksIFo6IHogfTsgICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlc3VsdHMucHVzaCgwKTtcclxuICAgICAgICBbeCwgeSwgel0gPSByZXN1bHRzLnNsaWNlKDUsIDgpO1xyXG4gICAgICAgIHJldHVybiB7IFg6IHgsIFk6IHksIFo6IHogfTsgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBnZXRFbGVtZW50UG9zaXRpb24oZWxlbWVudCl7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdG9wOiAodGhpcy5nZXRPZmZzZXQoZWxlbWVudCkudG9wICsgdGhpcy5nZXRUcmFuc2xhdGUzRChlbGVtZW50KS5ZKSAtIChlbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA/IHRoaXMuZ2V0VHJhbnNsYXRlWFkoZWxlbWVudCkudHJhbnNsYXRlWSA6IDApLFxyXG4gICAgICAgICAgICBsZWZ0OiAodGhpcy5nZXRPZmZzZXQoZWxlbWVudCkubGVmdCArIHRoaXMuZ2V0VHJhbnNsYXRlM0QoZWxlbWVudCkuWCkgLSggZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPyB0aGlzLmdldFRyYW5zbGF0ZVhZKGVsZW1lbnQpLnRyYW5zbGF0ZVggOiAwKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL3Bvc2l0aW9uIHBvcG92ZXJcclxuICAgIHBvc2l0aW9uUG9wb3ZlcihlbGVtZW50LCBwb3BvdmVyLCBhcnJvdywgc3RlcCkge1xyXG4gICAgICAgIHZhciBwbGFjZW1lbnQgPSBzdGVwLnBsYWNlbWVudCB8fCAnYXV0byc7XHJcbiAgICAgICAgdmFyIHN0cmF0ZWd5ID0gc3RlcC5zdHJhdGVneSB8fCAnYWJzb2x1dGUnO1xyXG5cclxuICAgICAgICBwb3BvdmVyLnN0eWxlLnBvc2l0aW9uID0gc3RyYXRlZ3k7XHJcbiAgICAgICAgYXJyb3cuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG5cclxuICAgICAgICAvL2VsZW1lbnQgdG9wICYgbGVmdFxyXG4gICAgICAgIHZhciBlbF90b3AsIGVsX2xlZnQ7XHJcbiAgICAgICAgZWxfdG9wID0gdGhpcy5nZXRFbGVtZW50UG9zaXRpb24oZWxlbWVudCkudG9wOyBcclxuICAgICAgICBlbF9sZWZ0ID0gdGhpcy5nZXRFbGVtZW50UG9zaXRpb24oZWxlbWVudCkubGVmdDsgXHJcbiAgICBcclxuICAgICAgICAvL2lmIHBsYWNlbWVudCBpcyBub3QgZGVmaW5lZCBvciBhdXRvIHRoZW4gY2FsY3VsYXRlIGxvY2F0aW9uXHJcbiAgICAgICAgaWYgKHBsYWNlbWVudCA9PSAnYXV0bycgfHwgcGxhY2VtZW50ID09ICdhdXRvLXN0YXJ0JyB8fCBwbGFjZW1lbnQgPT0gJ2F1dG8tZW5kJykge1xyXG4gICAgICAgICAgICBjb25zdCBhcnJvdyA9IHBsYWNlbWVudC5yZXBsYWNlKCdhdXRvJywgJycpLnRyaW0oKTtcclxuICAgICAgICAgICAgdmFyIG5ld19hcnJvdyA9ICcnO1xyXG5cclxuICAgICAgICAgICAgLy9lbGVtZW50IGlzIHBvc2l0aW9uIHRvIHRoZSBib3R0b20gb2YgdGhlIHNjcmVlblxyXG4gICAgICAgICAgICAvL3Bvc2l0aW9uIHBvcG92ZXIgdG8gdG9wXHJcbiAgICAgICAgICAgIGlmIChlbF90b3AgKyAocG9wb3Zlci5vZmZzZXRIZWlnaHQgKyB0aGlzLm9wdGlvbnMub2Zmc2V0KSA+IHRoaXMud2luZG93LmlubmVySGVpZ2h0IC0gMTAwKSB7XHJcbiAgICAgICAgICAgICAgICAvL2RpdmlkZSB0aGUgc2NyZWVuIGludG8gMyBzZWN0aW9uc1xyXG4gICAgICAgICAgICAgICAgLy9pZiBsZWZ0IGlzIHdpdGhpbiBzZWN0aW9uIDEvMyBvZiB0aGUgc2NyZWVuIHRoZW4gYXJyb3cgaXMgaW4gdGhlIHN0YXJ0IHBvc2l0aW9uXHJcbiAgICAgICAgICAgICAgICBpZiAoZWxfbGVmdCA8ICh0aGlzLndpbmRvdy5pbm5lcldpZHRoIC8gMykpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdfYXJyb3cgPSBhcnJvdy5sZW5ndGggPiAwID8gYXJyb3cgOiAnLXN0YXJ0JztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvL2lmIGxlZnQgaXMgd2l0aGluIHRoYXQgc2VjdGlvbiAzLzMgb2YgdGhlIHNjcmVlbiB0aGVuIGFycm93IGlzIGluIHRoZSBlbmQgcG9zaXRpb25cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGVsX2xlZnQgPiAodGhpcy53aW5kb3cuaW5uZXJXaWR0aCAtICh0aGlzLndpbmRvdy5pbm5lcldpZHRoIC8gMykpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3X2Fycm93ID0gYXJyb3cubGVuZ3RoID4gMCA/IGFycm93IDogJy1lbmQnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcGxhY2VtZW50ID0gJ3RvcCcgKyBuZXdfYXJyb3c7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vZWxlbWVudCBpcyBwb3NpdGlvbiB0byB0aGUgcmlnaHQgc2lkZSBvZiB0aGUgc2NyZWVuXHJcbiAgICAgICAgICAgIC8vcG9zaXRpb24gcG9wb3ZlciB0byB0aGUgbGVmdFxyXG4gICAgICAgICAgICBpZiAoKGVsX2xlZnQgKyBlbGVtZW50Lm9mZnNldFdpZHRoICsgcG9wb3Zlci5vZmZzZXRXaWR0aCkgPiB0aGlzLndpbmRvdy5pbm5lcldpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICAvL2RpdmlkZSB0aGUgc2NyZWVuIGludG8gMyBzZWN0aW9uc1xyXG4gICAgICAgICAgICAgICAgLy9pZiBsZWZ0IGlzIHdpdGhpbiBzZWN0aW9uIDEvMyBvZiB0aGUgc2NyZWVuIHRoZW4gYXJyb3cgaXMgaW4gdGhlIHN0YXJ0IHBvc2l0aW9uXHJcbiAgICAgICAgICAgICAgICBpZiAoZWxfdG9wIDwgKHRoaXMud2luZG93LmlubmVySGVpZ2h0IC8gMykpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdfYXJyb3cgPSBhcnJvdy5sZW5ndGggPiAwID8gYXJyb3cgOiAnLXN0YXJ0JztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvL2lmIGxlZnQgaXMgd2l0aGluIHRoYXQgc2VjdGlvbiAzLzMgb2YgdGhlIHNjcmVlbiB0aGVuIGFycm93IGlzIGluIHRoZSBlbmQgcG9zaXRpb25cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGVsX3RvcCA+ICh0aGlzLndpbmRvdy5pbm5lckhlaWdodCAtICh0aGlzLndpbmRvdy5pbm5lckhlaWdodCAvIDMpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld19hcnJvdyA9IGFycm93Lmxlbmd0aCA+IDAgPyBhcnJvdyA6ICctc3RhcnQnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcGxhY2VtZW50ID0gJ2xlZnQnICsgbmV3X2Fycm93O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2VsZW1lbnQgaXMgcG9zaXRpb24gdG8gdGhlIGxlZnQgc2lkZSBvZiB0aGUgc2NyZWVuXHJcbiAgICAgICAgICAgIC8vcG9zaXRpb24gcG9wb3ZlciB0byB0aGUgcmlnaHRcclxuICAgICAgICAgICAgaWYgKGVsX2xlZnQgPCBwb3BvdmVyLm9mZnNldFdpZHRoICYmIChlbGVtZW50Lm9mZnNldFdpZHRoICsgcG9wb3Zlci5vZmZzZXRXaWR0aCkgPCB0aGlzLndpbmRvdy5pbm5lcldpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICAvL2RpdmlkZSB0aGUgc2NyZWVuIGludG8gMyBzZWN0aW9uc1xyXG4gICAgICAgICAgICAgICAgLy9pZiBsZWZ0IGlzIHdpdGhpbiBzZWN0aW9uIDEvMyBvZiB0aGUgc2NyZWVuIHRoZW4gYXJyb3cgaXMgaW4gdGhlIHN0YXJ0IHBvc2l0aW9uXHJcbiAgICAgICAgICAgICAgICBpZiAoZWxfdG9wIDwgKHRoaXMud2luZG93LmlubmVySGVpZ2h0IC8gMykpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdfYXJyb3cgPSBhcnJvdy5sZW5ndGggPiAwID8gYXJyb3cgOiAnLXN0YXJ0JztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvL2lmIGxlZnQgaXMgd2l0aGluIHRoYXQgc2VjdGlvbiAzLzMgb2YgdGhlIHNjcmVlbiB0aGVuIGFycm93IGlzIGluIHRoZSBlbmQgcG9zaXRpb25cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGVsX3RvcCA+ICh0aGlzLndpbmRvdy5pbm5lckhlaWdodCAtICh0aGlzLndpbmRvdy5pbm5lckhlaWdodCAvIDMpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld19hcnJvdyA9IGFycm93Lmxlbmd0aCA+IDAgPyBhcnJvdyA6ICctc3RhcnQnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcGxhY2VtZW50ID0gJ3JpZ2h0JyArIG5ld19hcnJvdztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9lbGVtZW50IGlzIHBvc2l0aW9uIHRvIHRoZSB0b3Agb2YgdGhlIHNjcmVlblxyXG4gICAgICAgICAgICAvL3Bvc2l0aW9uIHBvcG92ZXIgdG8gYm90dG9tXHJcbiAgICAgICAgICAgIGlmIChlbF90b3AgPCAocG9wb3Zlci5vZmZzZXRIZWlnaHQgKyB0aGlzLm9wdGlvbnMub2Zmc2V0KSB8fCBlbF90b3AgPCAxMDApIHtcclxuICAgICAgICAgICAgICAgIC8vZGl2aWRlIHRoZSBzY3JlZW4gaW50byAzIHNlY3Rpb25zXHJcbiAgICAgICAgICAgICAgICAvL2lmIGxlZnQgaXMgd2l0aGluIHNlY3Rpb24gMS8zIG9mIHRoZSBzY3JlZW4gdGhlbiBhcnJvdyBpcyBpbiB0aGUgc3RhcnQgcG9zaXRpb25cclxuICAgICAgICAgICAgICAgIGlmIChlbF9sZWZ0IDwgKHRoaXMud2luZG93LmlubmVyV2lkdGggLyAzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld19hcnJvdyA9IGFycm93Lmxlbmd0aCA+IDAgPyBhcnJvdyA6ICctc3RhcnQnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vaWYgbGVmdCBpcyB3aXRoaW4gdGhhdCBzZWN0aW9uIDMvMyBvZiB0aGUgc2NyZWVuIHRoZW4gYXJyb3cgaXMgaW4gdGhlIGVuZCBwb3NpdGlvblxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZWxfbGVmdCA+ICh0aGlzLndpbmRvdy5pbm5lcldpZHRoIC0gKHRoaXMud2luZG93LmlubmVyV2lkdGggLyAzKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdfYXJyb3cgPSBhcnJvdy5sZW5ndGggPiAwID8gYXJyb3cgOiAnLWVuZCc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwbGFjZW1lbnQgPSAnYm90dG9tJyArIG5ld19hcnJvdztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9hZGQgdG8gY2xhc3MgZm9yIGNzc1xyXG4gICAgICAgICAgICBwb3BvdmVyLmNsYXNzTGlzdC5hZGQocGxhY2VtZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vdG9wXHJcbiAgICAgICAgaWYgKHBsYWNlbWVudCA9PSAndG9wJykge1xyXG4gICAgICAgICAgICBwb3BvdmVyLnN0eWxlLnRvcCA9IChlbF90b3AgLSAocG9wb3Zlci5vZmZzZXRIZWlnaHQgKyB0aGlzLm9wdGlvbnMub2Zmc2V0KSkgKyAncHgnO1xyXG4gICAgICAgICAgICBwb3BvdmVyLnN0eWxlLmxlZnQgPSAoZWxfbGVmdCArICgoZWxlbWVudC5vZmZzZXRXaWR0aCAvIDIpIC0gKHBvcG92ZXIub2Zmc2V0V2lkdGggLyAyKSkpICsgJ3B4JztcclxuICAgICAgICB9IGVsc2UgaWYgKHBsYWNlbWVudCA9PSAndG9wLXN0YXJ0Jykge1xyXG4gICAgICAgICAgICBwb3BvdmVyLnN0eWxlLnRvcCA9IChlbF90b3AgLSAocG9wb3Zlci5vZmZzZXRIZWlnaHQgKyB0aGlzLm9wdGlvbnMub2Zmc2V0KSkgKyAncHgnO1xyXG4gICAgICAgICAgICBwb3BvdmVyLnN0eWxlLmxlZnQgPSBlbF9sZWZ0IC0gdGhpcy5vcHRpb25zLmhpZ2hsaWdodE9mZnNldCArICdweCc7XHJcbiAgICAgICAgfSBlbHNlIGlmIChwbGFjZW1lbnQgPT0gJ3RvcC1lbmQnKSB7XHJcbiAgICAgICAgICAgIHBvcG92ZXIuc3R5bGUudG9wID0gKGVsX3RvcCAtIChwb3BvdmVyLm9mZnNldEhlaWdodCArIHRoaXMub3B0aW9ucy5vZmZzZXQpKSArICdweCc7XHJcbiAgICAgICAgICAgIHBvcG92ZXIuc3R5bGUubGVmdCA9ICgoZWxfbGVmdCArIGVsZW1lbnQub2Zmc2V0V2lkdGggKyB0aGlzLm9wdGlvbnMuaGlnaGxpZ2h0T2Zmc2V0KSAtIHBvcG92ZXIub2Zmc2V0V2lkdGgpICsgJ3B4JztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2JvdHRvbVxyXG4gICAgICAgIGVsc2UgaWYgKHBsYWNlbWVudCA9PSAnYm90dG9tJykge1xyXG4gICAgICAgICAgICBwb3BvdmVyLnN0eWxlLnRvcCA9IChlbF90b3AgKyBlbGVtZW50Lm9mZnNldEhlaWdodCkgKyB0aGlzLm9wdGlvbnMub2Zmc2V0ICsgJ3B4JztcclxuICAgICAgICAgICAgcG9wb3Zlci5zdHlsZS5sZWZ0ID0gKGVsX2xlZnQgKyAoZWxlbWVudC5vZmZzZXRXaWR0aCAvIDIpIC0gcG9wb3Zlci5vZmZzZXRXaWR0aCAvIDIpICsgJ3B4JztcclxuICAgICAgICB9IGVsc2UgaWYgKHBsYWNlbWVudCA9PSAnYm90dG9tLXN0YXJ0Jykge1xyXG4gICAgICAgICAgICBwb3BvdmVyLnN0eWxlLnRvcCA9IChlbF90b3AgKyBlbGVtZW50Lm9mZnNldEhlaWdodCkgKyB0aGlzLm9wdGlvbnMub2Zmc2V0ICsgJ3B4JztcclxuICAgICAgICAgICAgcG9wb3Zlci5zdHlsZS5sZWZ0ID0gKGVsX2xlZnQgLSB0aGlzLm9wdGlvbnMuaGlnaGxpZ2h0T2Zmc2V0KSArICdweCc7XHJcbiAgICAgICAgfSBlbHNlIGlmIChwbGFjZW1lbnQgPT0gJ2JvdHRvbS1lbmQnKSB7XHJcbiAgICAgICAgICAgIHBvcG92ZXIuc3R5bGUudG9wID0gKGVsX3RvcCArIGVsZW1lbnQub2Zmc2V0SGVpZ2h0KSArIHRoaXMub3B0aW9ucy5vZmZzZXQgKyAncHgnO1xyXG4gICAgICAgICAgICBwb3BvdmVyLnN0eWxlLmxlZnQgPSAoKGVsX2xlZnQgKyBlbGVtZW50Lm9mZnNldFdpZHRoICsgdGhpcy5vcHRpb25zLmhpZ2hsaWdodE9mZnNldCkgLSBwb3BvdmVyLm9mZnNldFdpZHRoKSArICdweCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9sZWZ0XHJcbiAgICAgICAgZWxzZSBpZiAocGxhY2VtZW50ID09ICdyaWdodCcpIHtcclxuICAgICAgICAgICAgcG9wb3Zlci5zdHlsZS50b3AgPSAoZWxfdG9wICsgKE1hdGguYWJzKHBvcG92ZXIub2Zmc2V0SGVpZ2h0IC0gZWxlbWVudC5vZmZzZXRIZWlnaHQpIC8gMikpICsgJ3B4JztcclxuICAgICAgICAgICAgcG9wb3Zlci5zdHlsZS5sZWZ0ID0gKGVsX2xlZnQgKyAoZWxlbWVudC5vZmZzZXRXaWR0aCArIHRoaXMub3B0aW9ucy5vZmZzZXQpKSArICdweCc7XHJcbiAgICAgICAgfSBlbHNlIGlmIChwbGFjZW1lbnQgPT0gJ3JpZ2h0LXN0YXJ0Jykge1xyXG4gICAgICAgICAgICBwb3BvdmVyLnN0eWxlLnRvcCA9IGVsX3RvcCAtIHRoaXMub3B0aW9ucy5oaWdobGlnaHRPZmZzZXQgKyAncHgnO1xyXG4gICAgICAgICAgICBwb3BvdmVyLnN0eWxlLmxlZnQgPSAoZWxfbGVmdCArIChlbGVtZW50Lm9mZnNldFdpZHRoICsgdGhpcy5vcHRpb25zLm9mZnNldCkpICsgJ3B4JztcclxuICAgICAgICB9IGVsc2UgaWYgKHBsYWNlbWVudCA9PSAncmlnaHQtZW5kJykge1xyXG4gICAgICAgICAgICBwb3BvdmVyLnN0eWxlLnRvcCA9ICgoZWxfdG9wICsgZWxlbWVudC5vZmZzZXRIZWlnaHQpIC0gcG9wb3Zlci5vZmZzZXRIZWlnaHQpICsgdGhpcy5vcHRpb25zLmhpZ2hsaWdodE9mZnNldCArICdweCc7XHJcbiAgICAgICAgICAgIHBvcG92ZXIuc3R5bGUubGVmdCA9IChlbF9sZWZ0ICsgKGVsZW1lbnQub2Zmc2V0V2lkdGggKyB0aGlzLm9wdGlvbnMub2Zmc2V0KSkgKyAncHgnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9yaWdodFxyXG4gICAgICAgIGVsc2UgaWYgKHBsYWNlbWVudCA9PSAnbGVmdCcpIHtcclxuICAgICAgICAgICAgcG9wb3Zlci5zdHlsZS50b3AgPSAoZWxfdG9wICsgKE1hdGguYWJzKHBvcG92ZXIub2Zmc2V0SGVpZ2h0IC0gZWxlbWVudC5vZmZzZXRIZWlnaHQpIC8gMikpICsgJ3B4JztcclxuICAgICAgICAgICAgcG9wb3Zlci5zdHlsZS5sZWZ0ID0gKGVsX2xlZnQgLSAocG9wb3Zlci5vZmZzZXRXaWR0aCArIHRoaXMub3B0aW9ucy5vZmZzZXQpKSArICdweCc7XHJcbiAgICAgICAgfSBlbHNlIGlmIChwbGFjZW1lbnQgPT0gJ2xlZnQtc3RhcnQnKSB7XHJcbiAgICAgICAgICAgIHBvcG92ZXIuc3R5bGUudG9wID0gZWxfdG9wIC0gdGhpcy5vcHRpb25zLmhpZ2hsaWdodE9mZnNldCArICdweCc7XHJcbiAgICAgICAgICAgIHBvcG92ZXIuc3R5bGUubGVmdCA9IChlbF9sZWZ0IC0gKHBvcG92ZXIub2Zmc2V0V2lkdGggKyB0aGlzLm9wdGlvbnMub2Zmc2V0KSkgKyAncHgnO1xyXG4gICAgICAgIH0gZWxzZSBpZiAocGxhY2VtZW50ID09ICdsZWZ0LWVuZCcpIHtcclxuICAgICAgICAgICAgcG9wb3Zlci5zdHlsZS50b3AgPSAoKGVsX3RvcCArIGVsZW1lbnQub2Zmc2V0SGVpZ2h0KSAtIHBvcG92ZXIub2Zmc2V0SGVpZ2h0KSArIHRoaXMub3B0aW9ucy5oaWdobGlnaHRPZmZzZXQgKyAncHgnO1xyXG4gICAgICAgICAgICBwb3BvdmVyLnN0eWxlLmxlZnQgPSAoZWxfbGVmdCAtIChwb3BvdmVyLm9mZnNldFdpZHRoICsgdGhpcy5vcHRpb25zLm9mZnNldCkpICsgJ3B4JztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vaWYgcG9zaXRpb24gaXMgZml4ZWQgc2Nyb2xsIHRvIHRvcFxyXG4gICAgICAgIGlmIChzdHJhdGVneSA9PT0gJ2ZpeGVkJyl7XHJcbiAgICAgICAgICAgIHRoaXMud2luZG93LnNjcm9sbFRvKDAsIDApO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBwb3BvdmVyLnNjcm9sbEludG9WaWV3KHtiZWhhdmlvcjogXCJzbW9vdGhcIiwgYmxvY2s6IFwiY2VudGVyXCIsIGlubGluZTogXCJuZWFyZXN0XCJ9KTtcclxuICAgICAgICB9ICAgICAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlT3ZlcmxheShlbGVtZW50LCBzdGVwID0gbnVsbCl7XHJcbiAgICAgICAgdmFyIHN0cmF0ZWd5ID0gKHN0ZXAgJiYgc3RlcC5zdHJhdGVneSkgPyBzdGVwLnN0cmF0ZWd5IDogJ2Fic29sdXRlJztcclxuXHJcbiAgICAgICAgdmFyIG92ZXJsYXkxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgb3ZlcmxheTEuY2xhc3NMaXN0LmFkZCgnd3Qtb3ZlcmxheScsICdvcGVuJywgJ292ZXJsYXkxJyk7XHJcbiAgICAgICAgb3ZlcmxheTEuc3R5bGUuekluZGV4ID0gdGhpcy5vcHRpb25zLnpJbmRleCAtIDEwO1xyXG5cclxuICAgICAgICB2YXIgb3ZlcmxheTIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBvdmVybGF5Mi5jbGFzc0xpc3QuYWRkKCd3dC1vdmVybGF5JywgJ29wZW4nLCAnb3ZlcmxheTInKTtcclxuICAgICAgICBvdmVybGF5Mi5zdHlsZS56SW5kZXggPSB0aGlzLm9wdGlvbnMuekluZGV4IC0gMTA7XHJcblxyXG4gICAgICAgIHZhciBvdmVybGF5MyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIG92ZXJsYXkzLmNsYXNzTGlzdC5hZGQoJ3d0LW92ZXJsYXknLCAnb3BlbicsICdvdmVybGF5MycpO1xyXG4gICAgICAgIG92ZXJsYXkzLnN0eWxlLnpJbmRleCA9IHRoaXMub3B0aW9ucy56SW5kZXggLSAxMDtcclxuXHJcbiAgICAgICAgdmFyIG92ZXJsYXk0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgb3ZlcmxheTQuY2xhc3NMaXN0LmFkZCgnd3Qtb3ZlcmxheScsICdvcGVuJywgJ292ZXJsYXk0Jyk7XHJcbiAgICAgICAgb3ZlcmxheTQuc3R5bGUuekluZGV4ID0gdGhpcy5vcHRpb25zLnpJbmRleCAtIDEwO1xyXG4gICAgXHJcbiAgICAgICAgLy9hcHBlbmQgdG8gYm9keVxyXG4gICAgICAgIHRoaXMuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChvdmVybGF5MSk7XHJcbiAgICAgICAgdGhpcy5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG92ZXJsYXkyKTtcclxuICAgICAgICB0aGlzLmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQob3ZlcmxheTMpO1xyXG4gICAgICAgIHRoaXMuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChvdmVybGF5NCk7XHJcblxyXG4gICAgICAgIC8vZWxlbWVudCB0b3AgJiBsZWZ0XHJcbiAgICAgICAgdmFyIGVsX3RvcCwgZWxfbGVmdDtcclxuICAgICAgICBlbF90b3AgPSB0aGlzLmdldEVsZW1lbnRQb3NpdGlvbihlbGVtZW50KS50b3A7IFxyXG4gICAgICAgIGVsX2xlZnQgPSB0aGlzLmdldEVsZW1lbnRQb3NpdGlvbihlbGVtZW50KS5sZWZ0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBoaWdobGlnaHRfb2Zmc2V0ID0gdGhpcy5vcHRpb25zLmhpZ2hsaWdodE9mZnNldDtcclxuXHJcbiAgICAgICAgLy9vdmVybGF5cyB0b3AtbGVmdFxyXG4gICAgICAgIG92ZXJsYXkxLnN0eWxlLnBvc2l0aW9uID0gc3RyYXRlZ3k7XHJcbiAgICAgICAgb3ZlcmxheTEuc3R5bGUudG9wID0gMDtcclxuICAgICAgICBvdmVybGF5MS5zdHlsZS53aWR0aCA9ICBlbF9sZWZ0IC0gaGlnaGxpZ2h0X29mZnNldCArICdweCc7XHJcbiAgICAgICAgb3ZlcmxheTEuc3R5bGUuaGVpZ2h0ID0gIChlbF90b3AgKyBlbGVtZW50Lm9mZnNldEhlaWdodCArIGhpZ2hsaWdodF9vZmZzZXQpICsgJ3B4JztcclxuICAgICAgICBvdmVybGF5MS5zdHlsZS5sZWZ0ID0gMDtcclxuXHJcbiAgICAgICAgLy9vdmVybGF5cyB0b3AtcmlnaHRcclxuICAgICAgICBvdmVybGF5Mi5zdHlsZS5wb3NpdGlvbiA9IHN0cmF0ZWd5O1xyXG4gICAgICAgIG92ZXJsYXkyLnN0eWxlLnRvcCA9IDA7XHJcbiAgICAgICAgb3ZlcmxheTIuc3R5bGUucmlnaHQgPSAwO1xyXG4gICAgICAgIG92ZXJsYXkyLnN0eWxlLmhlaWdodCA9IChlbF90b3AgLSBoaWdobGlnaHRfb2Zmc2V0KSArICdweCc7XHJcbiAgICAgICAgb3ZlcmxheTIuc3R5bGUubGVmdCA9IChlbF9sZWZ0IC0gaGlnaGxpZ2h0X29mZnNldCkgKyAncHgnO1xyXG5cclxuICAgICAgICAvL292ZXJsYXlzIGJvdHRvbS1yaWdodFxyXG4gICAgICAgIG92ZXJsYXkzLnN0eWxlLnBvc2l0aW9uID0gc3RyYXRlZ3k7XHJcbiAgICAgICAgb3ZlcmxheTMuc3R5bGUudG9wID0gKGVsX3RvcCAtIGhpZ2hsaWdodF9vZmZzZXQpICsgJ3B4JztcclxuICAgICAgICBvdmVybGF5My5zdHlsZS5yaWdodCA9IDA7XHJcbiAgICAgICAgb3ZlcmxheTMuc3R5bGUuYm90dG9tID0gMCAtICh0aGlzLmRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0IC0gdGhpcy53aW5kb3cuaW5uZXJIZWlnaHQpICsgJ3B4JztcclxuICAgICAgICBvdmVybGF5My5zdHlsZS5sZWZ0ID0gKGVsX2xlZnQgKyBlbGVtZW50Lm9mZnNldFdpZHRoICsgaGlnaGxpZ2h0X29mZnNldCkgKyAncHgnO1xyXG5cclxuICAgICAgICAvL292ZXJsYXlzIGJvdHRvbS1sZWZ0XHJcbiAgICAgICAgb3ZlcmxheTQuc3R5bGUucG9zaXRpb24gPSBzdHJhdGVneTtcclxuICAgICAgICBvdmVybGF5NC5zdHlsZS50b3AgPSAoZWxfdG9wICsgZWxlbWVudC5vZmZzZXRIZWlnaHQgKyBoaWdobGlnaHRfb2Zmc2V0KSArICdweCc7XHJcbiAgICAgICAgb3ZlcmxheTQuc3R5bGUud2lkdGggPSAgIGVsX2xlZnQgKyBlbGVtZW50Lm9mZnNldFdpZHRoICsgaGlnaGxpZ2h0X29mZnNldCAgKyAncHgnO1xyXG4gICAgICAgIG92ZXJsYXk0LnN0eWxlLmJvdHRvbSA9IDAgLSAodGhpcy5kb2N1bWVudC5ib2R5Lm9mZnNldEhlaWdodCAtIHRoaXMud2luZG93LmlubmVySGVpZ2h0KSArICdweCc7XHJcbiAgICAgICAgb3ZlcmxheTQuc3R5bGUubGVmdCA9IDA7XHJcbiAgICB9XHJcblxyXG59XHJcbiJdLCJuYW1lcyI6WyJXZWJUb3VyIiwib3B0aW9ucyIsImNvbnN0cnVjdG9yIiwiaW5zdGFuY2UiLCJhbmltYXRlIiwib3BhY2l0eSIsIm9mZnNldCIsImJvcmRlclJhZGl1cyIsImFsbG93Q2xvc2UiLCJoaWdobGlnaHQiLCJoaWdobGlnaHRPZmZzZXQiLCJrZXlib2FyZCIsIndpZHRoIiwiekluZGV4IiwicmVtb3ZlQXJyb3ciLCJvbk5leHQiLCJvblByZXZpb3VzIiwic3RlcHMiLCJzdGVwSW5kZXgiLCJpc1J1bm5pbmciLCJpc1BhdXNlZCIsIndpbmRvdyIsImRvY3VtZW50Iiwib25DbGljayIsImJpbmQiLCJvblJlc2l6ZSIsIm9uS2V5VXAiLCJkb2N1bWVudEVsZW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsInRhcmdldCIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwibmV4dCIsInByZXZpb3VzIiwic3RvcCIsImV2ZW50Iiwia2V5Q29kZSIsImNsZWFyIiwicmVuZGVyIiwiZWxlbWVudCIsInN0ZXAiLCJxdWVyeVNlbGVjdG9yIiwiY3JlYXRlT3ZlcmxheSIsInN0YXJ0SW5kZXgiLCJwb3BvdmVyIiwibG9hZGVyIiwiY3JlYXRlRWxlbWVudCIsImFkZCIsInN0eWxlIiwicHJlcGVuZCIsImxlbmd0aCIsInBvc2l0aW9uIiwic3RlcF9oaWdobGlnaHQiLCJzZXRBdHRyaWJ1dGUiLCJwbGFjZW1lbnQiLCJwb3BvdmVySW5uZXIiLCJ0aXRsZSIsImFwcGVuZCIsImlubmVyVGV4dCIsImNvbnRlbnQiLCJpbm5lckhUTUwiLCJzaG93QnRucyIsIkJvb2xlYW4iLCJidG5OZXh0IiwiYnRuQmFjayIsInRleHQiLCJiYWNrZ3JvdW5kQ29sb3IiLCJjb2xvciIsInRleHRDb2xvciIsImFycm93IiwiYm9keSIsImFwcGVuZENoaWxkIiwicG9zaXRpb25Qb3BvdmVyIiwic2Nyb2xsSW50b1ZpZXciLCJiZWhhdmlvciIsImJsb2NrIiwiaW5saW5lIiwib3ZlcmxheSIsInRvcCIsImxlZnQiLCJyaWdodCIsImJvdHRvbSIsInJlbW92ZSIsInBvcHVwIiwicXVlcnlTZWxlY3RvckFsbCIsImZvckVhY2giLCJyZW1vdmVBdHRyaWJ1dGUiLCJoZWlnaHQiLCJpbm5lckhlaWdodCIsImNsaWVudEhlaWdodCIsImlubmVyV2lkdGgiLCJjbGllbnRXaWR0aCIsImVsIiwiX3giLCJfeSIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJpc05hTiIsIm9mZnNldExlZnQiLCJvZmZzZXRUb3AiLCJzY3JvbGxMZWZ0Iiwic2Nyb2xsVG9wIiwib2Zmc2V0UGFyZW50IiwicGFyc2VJbnQiLCJ5IiwieCIsImdldENvbXB1dGVkU3R5bGUiLCJtYXRyaXgiLCJET01NYXRyaXhSZWFkT25seSIsInRyYW5zZm9ybSIsInRyYW5zbGF0ZVgiLCJNYXRoIiwiYWJzIiwib2Zmc2V0V2lkdGgiLCJtNDEiLCJ0cmFuc2xhdGVZIiwib2Zmc2V0SGVpZ2h0IiwibTQyIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInJlc3VsdHMiLCJtYXRjaCIsInoiLCJYIiwiWSIsIloiLCJzbGljZSIsInB1c2giLCJnZXRPZmZzZXQiLCJnZXRUcmFuc2xhdGUzRCIsImdldFRyYW5zbGF0ZVhZIiwic3RyYXRlZ3kiLCJlbF90b3AiLCJlbF9sZWZ0IiwiZ2V0RWxlbWVudFBvc2l0aW9uIiwicmVwbGFjZSIsInRyaW0iLCJuZXdfYXJyb3ciLCJzY3JvbGxUbyIsIm92ZXJsYXkxIiwib3ZlcmxheTIiLCJvdmVybGF5MyIsIm92ZXJsYXk0IiwiaGlnaGxpZ2h0X29mZnNldCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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


//**************************************************************************************************
// Name: VGLoginScript.js
// METHODS
//**************************************************************************************************

var mfaInterval;

function GetReturnUrl() {
    if (IsQueryStringExists('ReturnUrl')) {
        let returnUrl = FindQueryString();
        if (0 < returnUrl.length) {
            return returnUrl[1].toLowerCase();
        }
    }
    return '';
}

function ShowValidationSummaryError(errorMessage) {
    $("#validationSummary ul:first li:first").text(errorMessage);
    $('#validationSummary').addClass('validation-summary-errors');
    $('#validationSummary').removeClass('validation-summary-valid');
    $("#validationSummary ul:first li:first").show();
}

function HideValidationErrorSummary() {
    $('#validationSummary').removeClass('validation-summary-errors');
    $('#validationSummary').addClass('validation-summary-valid');
    $("#validationSummary ul:first li:first").hide();
}

function OnError(xhr) {
    let responseText;
    let errorMessage;

    try {
        if (typeof xhr.responseJSON !== 'undefined') {
            responseText = xhr.responseJSON.Message;
        }
        if (typeof xhr.responseText !== 'undefined') {
            responseText = jQuery.parseJSON(xhr.responseText);
        }

        if (!responseText || typeof responseText === 'undefined') {
            responseText = 'Some error has occurred';
        }

        errorMessage = responseText.Message;
    } catch (e) {
        errorMessage = xhr.responseText;
    }

    ShowValidationSummaryError(errorMessage);

    setTimeout(function () {
        $("#mfaLinkModal").modal("hide");
        $("#mfaOTPModal").modal("hide");
    }, 500);
}

function GetMFAExpirationTime(selectedMFAOption) {
    let expireTime;
    jQuery.ajaxSetup({ async: false });
    $.get("identity/account/login?handler=ExpirationTime", { mfaAuthMode: selectedMFAOption }, function (result) {
        expireTime = result;
    })
        .done(function () {
        })
        .fail(function () {
            console.error('Error');
        })
        .always(function () {
        });

    return expireTime;
}

function BindMFAAvailableList(selector, tasks) {
    let lstAvailableMFA = $(selector).dxList({
        dataSource: tasks,
        keyExpr: 'id',
        showSelectionControls: false,
        selectionMode: "single",
        itemTemplate(data) {
            const result = $('<div>').addClass('mfaDiv');
            $('<div>').html('<i class="fal fa-fw ' + data.img + '"></i>' + '&nbsp;' + data.text).appendTo(result);
            return result;
        },
    }).dxList('instance');
    lstAvailableMFA.selectItem(0);
}

function GetMFAAvailableListDataSource() {
    let mfaListInstance = GetDxListInstance('mfaAvailablesList');
    return mfaListInstance.option("dataSource");
}

function GetSelectedMFA() {
    let mfaListInstance = GetDxListInstance('mfaAvailablesList');
    let selectedMFAOptions = mfaListInstance.option("selectedItems");
    if (0 === selectedMFAOptions.length || 1 < selectedMFAOptions.length) {
        return;
    }
    let selectedMFAOption = selectedMFAOptions[0];

    let mfaSource = GetMFAAvailableListDataSource();
    return mfaSource.find(x => x.id === selectedMFAOption.id);
}

function ExecuteMFA() {
    try {
        //Get selected item id        
        let selectedItem = GetSelectedMFA();

        if (1 == selectedItem.mfaAuthMode) {
            $("#mfaLinkModalV2").modal("show");
        }
        else {
            $('#mfaAvailableSelection').modal('hide');
            ShowLoading('loadPanel', 'Sending OTP');
        }

        $.ajaxSetup({
            async: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("XSRF-TOKEN",
                    $('input:hidden[name="__RequestVerificationToken"]').val());
            }
        });
        $.post("identity/account/login?handler=AuthenticateMFAV2", { requestId: selectedItem.requestId, mfaAvailableId: selectedItem.id, authenticationMode: selectedItem.mfaAuthMode }, function (result) {

        })
            .done(function (result) {
                if (result.Success) {
                    if (result.IsRedirect) {
                        window.location.href = result.Data;
                    }
                    if (result.IsOTP) {
                        $("#mfaOTPModalV2").modal("show");                        
                    }
                }
            })
            .fail(function (response) {
                OnError(response);
            })
            .always(function () {
                HideLoading('loadPanel');
                $("#mfaLinkModalV2").modal("hide");
                $("#mfaAvailableSelection").modal("hide");
            });
    }
    catch (err) {
    }
}

//**************************************************************************************************
// EVENTS
//**************************************************************************************************


$(document).on("click", "#js-login-btn", function (e) {
    e.preventDefault();

    // Fetch form to apply custom Bootstrap validation
    var form = $("#js-login");

    if (form[0].checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
    }

    form.addClass('was-validated');
    ShowLoading('loadPanel');

    let authMode = $('#Input_AuthenticationMode').find(":selected").val();
    let userName = $("#Username").val();
    let password = $("#Password").val();
    let returnUrl = GetReturnUrl();
    let rememberMe = $("#chkRememberMe").is(":checked");

    HideValidationErrorSummary();

    let data = { authMode: authMode, userName: userName, password: password, returnUrl: returnUrl, rememberMe: rememberMe };
    $.ajaxSetup({
        async: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("XSRF-TOKEN",
                $('input:hidden[name="__RequestVerificationToken"]').val());
        }
    });
    $.post("identity/account/login?handler=Authentication", data, function (result, status, xhr) {


    }, "json")
        .done(function (result) {
            if (result.Success) {
                if (result.IsRedirect) {
                    if (result.PasswordDoesNotPassValidation) {
                        $.confirm({
                            title: 'Password policy changed',
                            content: 'Password policy is changed, so your password is not secure enough. Do you want to change your password?',
                            escapeKey: 'cancel',
                            backgroundDismiss: function () {
                                return 'cancel'; // the button will handle it
                            },
                            closeIcon: true,
                            theme: 'bootstrap',
                            buttons: {
                                confirm: {
                                    text: 'Ok',
                                    action: function () {                                        
                                        window.location.href = result.ChangePasswordUrl;
                                    }
                                },
                                cancel: {
                                    text: 'Cancel', // With spaces and symbols
                                    action: function () {
                                        window.location.href = result.Data;
                                    }
                                }
                            }
                        });
                    }
                    else {
                        ShowLoading('loadPanel', 'Redirecting...');
                        window.location.href = result.Data;
                    }
                }
                else {
                    //MFA
                    form.removeClass('was-validated');
                    let mfaList = result.Data;
                    let mfaDataSource = [];
                    $.each(mfaList, function (key, value) {
                        if (value.NeedEnrollment) {
                            value.MFAOptionMessage = '<a href="' + value.EnrollmentUrl + '">' + value.MFAOptionMessage + '</a>';
                            value.ImageIcon = 'fa-shield-alt';
                        }
                        mfaDataSource.push({ id: value.Id, text: value.MFAOptionMessage, selectedOptionText: value.MFASelectedOptionMessage, img: value.ImageIcon, requestId: value.RequestId, mfaAuthMode: value.AuthenticationMode });
                    });
                    BindMFAAvailableList('#mfaAvailablesList', mfaDataSource);

                    if (1 < mfaList.length) {
                        let loginPanelHeight = $("#loginPanel").height();                        
                        $("#divMFAAvailableSelectionBody").height(loginPanelHeight - 55);
                        $('#mfaAvailableSelection').modal('handleUpdate');
                        $('#mfaAvailableSelection').modal('show');                        
                    }
                    else {
                        //only 1 item in the list
                        ExecuteMFA();
                    }
                }
            }
            else {

            }
        })
        .fail(function (e) {
            console.error('Error');
            OnError(e);
        })
        .always(function (a) {
            HideLoading('loadPanel');
        });
});

function OnConfirmationCallAction(data) {
    window.location.href = data;
}

//#region -- MFA EVENTS

$(document).on("click", "#js-cancel-btn-mfa", function (e) {
    e.preventDefault();

    window.location.href = window.location.href;
});

$(document).on("click", "#js-login-btn-mfa", function (e) {
    e.preventDefault();

    ExecuteMFA();

    ////Get selected item id        
    //let selectedItem = GetSelectedMFA();

    //if (1 == selectedItem.mfaAuthMode) {
    //    $("#mfaLinkModalV2").modal("show");
    //}
    //else {
    //    $('#mfaAvailableSelection').modal('hide');
    //    ShowLoading('loadPanel', 'Sending OTP');
    //}

    //$.ajaxSetup({
    //    async: true,
    //    beforeSend: function (xhr) {
    //        xhr.setRequestHeader("XSRF-TOKEN",
    //            $('input:hidden[name="__RequestVerificationToken"]').val());
    //    }
    //});
    //$.post("identity/account/login?handler=AuthenticateMFAV2", { requestId: selectedItem.requestId, mfaAvailableId: selectedItem.id, authenticationMode: selectedItem.mfaAuthMode }, function (result) {

    //})
    //.done(function (result) {
    //    if (result.Success) {
    //        if (result.IsRedirect) {
    //            window.location.href = result.Data;
    //        }
    //        if (result.IsOTP) {
    //            $("#mfaOTPModalV2").modal("show");
    //        }
    //    }
    //})
    //.fail(function (response) {
    //    OnError(response);
    //})
    //.always(function () {
    //    HideLoading('loadPanel');
    //    $("#mfaLinkModalV2").modal("hide");
    //    $("#mfaAvailableSelection").modal("hide");
    //});
});

$(document).on("click", "#btnCancelMFALink", function (e) {
    e.preventDefault();

    ShowLoading('loadPanel');

    let selectedItem = GetSelectedMFA();
    let requestId = selectedItem.requestId;

    jQuery.ajaxSetup({ async: false });
    $.get("identity/account/login?handler=CancelMFAV2", { requestId: requestId }, function (result) {

    })
        .done(function (result) {

        })
        .fail(function (e) {
            console.error('Error');
            $("#mfaLinkModalV2").modal("hide");
            OnError(result);
        })
        .always(function (e) {
            HideLoading('loadPanel');
        });
});

$("#mfaLinkModalV2").on('show.bs.modal', function () {

    let selectedItem = GetSelectedMFA();
    $("#selectedOptionMessage").html(selectedItem.selectedOptionText);

    let linkMode = GetLinkMode();
    let timeExpire = GetMFAExpirationTime(linkMode);
    mfaInterval = null;
    $('.mfaLinkCountdown').html('');
    mfaInterval = setInterval(function () {
        var timer = timeExpire.split(':');

        //by parsing integer, I avoid all extra string processing
        var minutes = parseInt(timer[0], 10);
        var seconds = parseInt(timer[1], 10);
        --seconds;
        minutes = (seconds < 0) ? --minutes : minutes;
        if (minutes < 0) {
            $("#mfaOTPModalV2").modal("hide");
            $("#mfaLinkModalV2").modal("hide");
        }
        seconds = (seconds < 0) ? 59 : seconds;
        seconds = (seconds < 10) ? '0' + seconds : seconds;

        $('.mfaLinkCountdown').html(minutes + ':' + seconds);
        timeExpire = minutes + ':' + seconds;
    }, 1000);
});

//On Grant modal closing.
$("#mfaLinkModalV2").on('hidden.bs.modal', function () {
    clearInterval(mfaInterval);
    $("#mfaAvailableSelection").modal("hide");
});

$('#mfaSecureCode').keypress(function (e) {
    var key = e.which;
    if (key == 13) {
        $("#js-login-btnOTP").click();
        return true;
    }
});

$(document).on("click", "#js-cancel-btnOTP", function (e) {
    e.preventDefault();
    window.location.href = window.location.href;
});

$(document).on("click", "#js-login-btnOTP", function (e) {
    e.preventDefault();
        
    let otpCode = $("#mfaSecureCode").val();    
    if (otpCode.trim().length === 0) {
        return;
    }

    ShowLoading('loadPanel');
    let mfaListInstance = $("#mfaAvailablesList").dxList("instance");
    let selectedMFAOptions = mfaListInstance.option("selectedItems");
    if (0 === selectedMFAOptions.length || 1 < selectedMFAOptions.length) {
        return;
    }
    let selectedMFAOption = selectedMFAOptions[0];
    let mfaSource = mfaListInstance.option("dataSource");
    let selectedItem = mfaSource.find(x => x.id === selectedMFAOption.id);

    $.ajaxSetup({
        async: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("XSRF-TOKEN",
                $('input:hidden[name="__RequestVerificationToken"]').val());
        }
    });
    $.post("identity/account/login?handler=AuthenticateMFAOTP", { requestId: selectedItem.requestId, mfaAvailableId: selectedItem.id, secureCode: otpCode }, function (result) {
        //
    })
    .done(function (result) {
        if (result.Success) {
            if (result.IsRedirect) {
                ShowLoading('loadPanel', 'Redirecting...');
                window.location.href = result.Data;
            }
        }
    })
    .fail(function (response) {
        OnError(response);
        $("#mfaOTPModalV2").modal("hide");
        $("#mfaAvailableSelection").modal("hide");
    })
    .always(function () {
        HideLoading('loadPanel');
    });
});

//On modal loading
$("#mfaOTPModalV2").on('show.bs.modal', function () {

    let selectedItem = GetSelectedMFA();
    $("#selectedOTPMessage").html(selectedItem.selectedOptionText);

    let otpMode = GetOTPMode();;
    let timeExpire = GetMFAExpirationTime(otpMode);
    mfaInterval = null;
    $('.mfaOTPCountdown').html('');
    $('#mfaSecureCode').val('');
    mfaInterval = setInterval(function () {
        var timer = timeExpire.split(':');

        //by parsing integer, I avoid all extra string processing
        var minutes = parseInt(timer[0], 10);
        var seconds = parseInt(timer[1], 10);
        --seconds;
        minutes = (seconds < 0) ? --minutes : minutes;
        if (minutes < 0) {
            //Timeup
            //TimeoutExpired();
            $("#mfaOTPModalV2").modal("hide");
            $("#mfaLinkModalV2").modal("hide");
        }
        seconds = (seconds < 0) ? 59 : seconds;
        seconds = (seconds < 10) ? '0' + seconds : seconds;
        //minutes = (minutes < 10) ?  minutes : minutes;

        $('.mfaOTPCountdown').html(minutes + ':' + seconds);
        timeExpire = minutes + ':' + seconds;
    }, 1000);
});

//On Grant modal closing.
$("#mfaOTPModalV2").on('hidden.bs.modal', function () {
    clearInterval(mfaInterval);
    $("#mfaAvailableSelection").modal("hide");
});

//#endregion
