var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i5 = decorators.length - 1, decorator; i5 >= 0; i5--)
    if (decorator = decorators[i5])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};

// node_modules/@lit/reactive-element/css-tag.js
var t = globalThis;
var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s = /* @__PURE__ */ Symbol();
var o = /* @__PURE__ */ new WeakMap();
var n = class {
  constructor(t4, e5, o6) {
    if (this._$cssResult$ = true, o6 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t4, this.t = e5;
  }
  get styleSheet() {
    let t4 = this.o;
    const s4 = this.t;
    if (e && void 0 === t4) {
      const e5 = void 0 !== s4 && 1 === s4.length;
      e5 && (t4 = o.get(s4)), void 0 === t4 && ((this.o = t4 = new CSSStyleSheet()).replaceSync(this.cssText), e5 && o.set(s4, t4));
    }
    return t4;
  }
  toString() {
    return this.cssText;
  }
};
var r = (t4) => new n("string" == typeof t4 ? t4 : t4 + "", void 0, s);
var i = (t4, ...e5) => {
  const o6 = 1 === t4.length ? t4[0] : e5.reduce((e6, s4, o7) => e6 + ((t5) => {
    if (true === t5._$cssResult$) return t5.cssText;
    if ("number" == typeof t5) return t5;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t5 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s4) + t4[o7 + 1], t4[0]);
  return new n(o6, t4, s);
};
var S = (s4, o6) => {
  if (e) s4.adoptedStyleSheets = o6.map((t4) => t4 instanceof CSSStyleSheet ? t4 : t4.styleSheet);
  else for (const e5 of o6) {
    const o7 = document.createElement("style"), n5 = t.litNonce;
    void 0 !== n5 && o7.setAttribute("nonce", n5), o7.textContent = e5.cssText, s4.appendChild(o7);
  }
};
var c = e ? (t4) => t4 : (t4) => t4 instanceof CSSStyleSheet ? ((t5) => {
  let e5 = "";
  for (const s4 of t5.cssRules) e5 += s4.cssText;
  return r(e5);
})(t4) : t4;

// node_modules/@lit/reactive-element/reactive-element.js
var { is: i2, defineProperty: e2, getOwnPropertyDescriptor: h, getOwnPropertyNames: r2, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object;
var a = globalThis;
var c2 = a.trustedTypes;
var l = c2 ? c2.emptyScript : "";
var p = a.reactiveElementPolyfillSupport;
var d = (t4, s4) => t4;
var u = { toAttribute(t4, s4) {
  switch (s4) {
    case Boolean:
      t4 = t4 ? l : null;
      break;
    case Object:
    case Array:
      t4 = null == t4 ? t4 : JSON.stringify(t4);
  }
  return t4;
}, fromAttribute(t4, s4) {
  let i5 = t4;
  switch (s4) {
    case Boolean:
      i5 = null !== t4;
      break;
    case Number:
      i5 = null === t4 ? null : Number(t4);
      break;
    case Object:
    case Array:
      try {
        i5 = JSON.parse(t4);
      } catch (t5) {
        i5 = null;
      }
  }
  return i5;
} };
var f = (t4, s4) => !i2(t4, s4);
var b = { attribute: true, type: String, converter: u, reflect: false, useDefault: false, hasChanged: f };
Symbol.metadata ?? (Symbol.metadata = /* @__PURE__ */ Symbol("metadata")), a.litPropertyMetadata ?? (a.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
var y = class extends HTMLElement {
  static addInitializer(t4) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t4);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t4, s4 = b) {
    if (s4.state && (s4.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t4) && ((s4 = Object.create(s4)).wrapped = true), this.elementProperties.set(t4, s4), !s4.noAccessor) {
      const i5 = /* @__PURE__ */ Symbol(), h3 = this.getPropertyDescriptor(t4, i5, s4);
      void 0 !== h3 && e2(this.prototype, t4, h3);
    }
  }
  static getPropertyDescriptor(t4, s4, i5) {
    const { get: e5, set: r6 } = h(this.prototype, t4) ?? { get() {
      return this[s4];
    }, set(t5) {
      this[s4] = t5;
    } };
    return { get: e5, set(s5) {
      const h3 = e5?.call(this);
      r6?.call(this, s5), this.requestUpdate(t4, h3, i5);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t4) {
    return this.elementProperties.get(t4) ?? b;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d("elementProperties"))) return;
    const t4 = n2(this);
    t4.finalize(), void 0 !== t4.l && (this.l = [...t4.l]), this.elementProperties = new Map(t4.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
      const t5 = this.properties, s4 = [...r2(t5), ...o2(t5)];
      for (const i5 of s4) this.createProperty(i5, t5[i5]);
    }
    const t4 = this[Symbol.metadata];
    if (null !== t4) {
      const s4 = litPropertyMetadata.get(t4);
      if (void 0 !== s4) for (const [t5, i5] of s4) this.elementProperties.set(t5, i5);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t5, s4] of this.elementProperties) {
      const i5 = this._$Eu(t5, s4);
      void 0 !== i5 && this._$Eh.set(i5, t5);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s4) {
    const i5 = [];
    if (Array.isArray(s4)) {
      const e5 = new Set(s4.flat(1 / 0).reverse());
      for (const s5 of e5) i5.unshift(c(s5));
    } else void 0 !== s4 && i5.push(c(s4));
    return i5;
  }
  static _$Eu(t4, s4) {
    const i5 = s4.attribute;
    return false === i5 ? void 0 : "string" == typeof i5 ? i5 : "string" == typeof t4 ? t4.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t4) => this.enableUpdating = t4), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t4) => t4(this));
  }
  addController(t4) {
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t4), void 0 !== this.renderRoot && this.isConnected && t4.hostConnected?.();
  }
  removeController(t4) {
    this._$EO?.delete(t4);
  }
  _$E_() {
    const t4 = /* @__PURE__ */ new Map(), s4 = this.constructor.elementProperties;
    for (const i5 of s4.keys()) this.hasOwnProperty(i5) && (t4.set(i5, this[i5]), delete this[i5]);
    t4.size > 0 && (this._$Ep = t4);
  }
  createRenderRoot() {
    const t4 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S(t4, this.constructor.elementStyles), t4;
  }
  connectedCallback() {
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), this._$EO?.forEach((t4) => t4.hostConnected?.());
  }
  enableUpdating(t4) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t4) => t4.hostDisconnected?.());
  }
  attributeChangedCallback(t4, s4, i5) {
    this._$AK(t4, i5);
  }
  _$ET(t4, s4) {
    const i5 = this.constructor.elementProperties.get(t4), e5 = this.constructor._$Eu(t4, i5);
    if (void 0 !== e5 && true === i5.reflect) {
      const h3 = (void 0 !== i5.converter?.toAttribute ? i5.converter : u).toAttribute(s4, i5.type);
      this._$Em = t4, null == h3 ? this.removeAttribute(e5) : this.setAttribute(e5, h3), this._$Em = null;
    }
  }
  _$AK(t4, s4) {
    const i5 = this.constructor, e5 = i5._$Eh.get(t4);
    if (void 0 !== e5 && this._$Em !== e5) {
      const t5 = i5.getPropertyOptions(e5), h3 = "function" == typeof t5.converter ? { fromAttribute: t5.converter } : void 0 !== t5.converter?.fromAttribute ? t5.converter : u;
      this._$Em = e5;
      const r6 = h3.fromAttribute(s4, t5.type);
      this[e5] = r6 ?? this._$Ej?.get(e5) ?? r6, this._$Em = null;
    }
  }
  requestUpdate(t4, s4, i5, e5 = false, h3) {
    if (void 0 !== t4) {
      const r6 = this.constructor;
      if (false === e5 && (h3 = this[t4]), i5 ?? (i5 = r6.getPropertyOptions(t4)), !((i5.hasChanged ?? f)(h3, s4) || i5.useDefault && i5.reflect && h3 === this._$Ej?.get(t4) && !this.hasAttribute(r6._$Eu(t4, i5)))) return;
      this.C(t4, s4, i5);
    }
    false === this.isUpdatePending && (this._$ES = this._$EP());
  }
  C(t4, s4, { useDefault: i5, reflect: e5, wrapped: h3 }, r6) {
    i5 && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t4) && (this._$Ej.set(t4, r6 ?? s4 ?? this[t4]), true !== h3 || void 0 !== r6) || (this._$AL.has(t4) || (this.hasUpdated || i5 || (s4 = void 0), this._$AL.set(t4, s4)), true === e5 && this._$Em !== t4 && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t4));
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t5) {
      Promise.reject(t5);
    }
    const t4 = this.scheduleUpdate();
    return null != t4 && await t4, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [t6, s5] of this._$Ep) this[t6] = s5;
        this._$Ep = void 0;
      }
      const t5 = this.constructor.elementProperties;
      if (t5.size > 0) for (const [s5, i5] of t5) {
        const { wrapped: t6 } = i5, e5 = this[s5];
        true !== t6 || this._$AL.has(s5) || void 0 === e5 || this.C(s5, void 0, i5, e5);
      }
    }
    let t4 = false;
    const s4 = this._$AL;
    try {
      t4 = this.shouldUpdate(s4), t4 ? (this.willUpdate(s4), this._$EO?.forEach((t5) => t5.hostUpdate?.()), this.update(s4)) : this._$EM();
    } catch (s5) {
      throw t4 = false, this._$EM(), s5;
    }
    t4 && this._$AE(s4);
  }
  willUpdate(t4) {
  }
  _$AE(t4) {
    this._$EO?.forEach((t5) => t5.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t4)), this.updated(t4);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t4) {
    return true;
  }
  update(t4) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t5) => this._$ET(t5, this[t5]))), this._$EM();
  }
  updated(t4) {
  }
  firstUpdated(t4) {
  }
};
y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[d("elementProperties")] = /* @__PURE__ */ new Map(), y[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: y }), (a.reactiveElementVersions ?? (a.reactiveElementVersions = [])).push("2.1.2");

// node_modules/lit-html/lit-html.js
var t2 = globalThis;
var i3 = (t4) => t4;
var s2 = t2.trustedTypes;
var e3 = s2 ? s2.createPolicy("lit-html", { createHTML: (t4) => t4 }) : void 0;
var h2 = "$lit$";
var o3 = `lit$${Math.random().toFixed(9).slice(2)}$`;
var n3 = "?" + o3;
var r3 = `<${n3}>`;
var l2 = document;
var c3 = () => l2.createComment("");
var a2 = (t4) => null === t4 || "object" != typeof t4 && "function" != typeof t4;
var u2 = Array.isArray;
var d2 = (t4) => u2(t4) || "function" == typeof t4?.[Symbol.iterator];
var f2 = "[ 	\n\f\r]";
var v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var _ = /-->/g;
var m = />/g;
var p2 = RegExp(`>|${f2}(?:([^\\s"'>=/]+)(${f2}*=${f2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var g = /'/g;
var $ = /"/g;
var y2 = /^(?:script|style|textarea|title)$/i;
var x = (t4) => (i5, ...s4) => ({ _$litType$: t4, strings: i5, values: s4 });
var b2 = x(1);
var w = x(2);
var T = x(3);
var E = /* @__PURE__ */ Symbol.for("lit-noChange");
var A = /* @__PURE__ */ Symbol.for("lit-nothing");
var C = /* @__PURE__ */ new WeakMap();
var P = l2.createTreeWalker(l2, 129);
function V(t4, i5) {
  if (!u2(t4) || !t4.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== e3 ? e3.createHTML(i5) : i5;
}
var N = (t4, i5) => {
  const s4 = t4.length - 1, e5 = [];
  let n5, l3 = 2 === i5 ? "<svg>" : 3 === i5 ? "<math>" : "", c4 = v;
  for (let i6 = 0; i6 < s4; i6++) {
    const s5 = t4[i6];
    let a3, u3, d3 = -1, f3 = 0;
    for (; f3 < s5.length && (c4.lastIndex = f3, u3 = c4.exec(s5), null !== u3); ) f3 = c4.lastIndex, c4 === v ? "!--" === u3[1] ? c4 = _ : void 0 !== u3[1] ? c4 = m : void 0 !== u3[2] ? (y2.test(u3[2]) && (n5 = RegExp("</" + u3[2], "g")), c4 = p2) : void 0 !== u3[3] && (c4 = p2) : c4 === p2 ? ">" === u3[0] ? (c4 = n5 ?? v, d3 = -1) : void 0 === u3[1] ? d3 = -2 : (d3 = c4.lastIndex - u3[2].length, a3 = u3[1], c4 = void 0 === u3[3] ? p2 : '"' === u3[3] ? $ : g) : c4 === $ || c4 === g ? c4 = p2 : c4 === _ || c4 === m ? c4 = v : (c4 = p2, n5 = void 0);
    const x2 = c4 === p2 && t4[i6 + 1].startsWith("/>") ? " " : "";
    l3 += c4 === v ? s5 + r3 : d3 >= 0 ? (e5.push(a3), s5.slice(0, d3) + h2 + s5.slice(d3) + o3 + x2) : s5 + o3 + (-2 === d3 ? i6 : x2);
  }
  return [V(t4, l3 + (t4[s4] || "<?>") + (2 === i5 ? "</svg>" : 3 === i5 ? "</math>" : "")), e5];
};
var S2 = class _S {
  constructor({ strings: t4, _$litType$: i5 }, e5) {
    let r6;
    this.parts = [];
    let l3 = 0, a3 = 0;
    const u3 = t4.length - 1, d3 = this.parts, [f3, v2] = N(t4, i5);
    if (this.el = _S.createElement(f3, e5), P.currentNode = this.el.content, 2 === i5 || 3 === i5) {
      const t5 = this.el.content.firstChild;
      t5.replaceWith(...t5.childNodes);
    }
    for (; null !== (r6 = P.nextNode()) && d3.length < u3; ) {
      if (1 === r6.nodeType) {
        if (r6.hasAttributes()) for (const t5 of r6.getAttributeNames()) if (t5.endsWith(h2)) {
          const i6 = v2[a3++], s4 = r6.getAttribute(t5).split(o3), e6 = /([.?@])?(.*)/.exec(i6);
          d3.push({ type: 1, index: l3, name: e6[2], strings: s4, ctor: "." === e6[1] ? I : "?" === e6[1] ? L : "@" === e6[1] ? z : H }), r6.removeAttribute(t5);
        } else t5.startsWith(o3) && (d3.push({ type: 6, index: l3 }), r6.removeAttribute(t5));
        if (y2.test(r6.tagName)) {
          const t5 = r6.textContent.split(o3), i6 = t5.length - 1;
          if (i6 > 0) {
            r6.textContent = s2 ? s2.emptyScript : "";
            for (let s4 = 0; s4 < i6; s4++) r6.append(t5[s4], c3()), P.nextNode(), d3.push({ type: 2, index: ++l3 });
            r6.append(t5[i6], c3());
          }
        }
      } else if (8 === r6.nodeType) if (r6.data === n3) d3.push({ type: 2, index: l3 });
      else {
        let t5 = -1;
        for (; -1 !== (t5 = r6.data.indexOf(o3, t5 + 1)); ) d3.push({ type: 7, index: l3 }), t5 += o3.length - 1;
      }
      l3++;
    }
  }
  static createElement(t4, i5) {
    const s4 = l2.createElement("template");
    return s4.innerHTML = t4, s4;
  }
};
function M(t4, i5, s4 = t4, e5) {
  if (i5 === E) return i5;
  let h3 = void 0 !== e5 ? s4._$Co?.[e5] : s4._$Cl;
  const o6 = a2(i5) ? void 0 : i5._$litDirective$;
  return h3?.constructor !== o6 && (h3?._$AO?.(false), void 0 === o6 ? h3 = void 0 : (h3 = new o6(t4), h3._$AT(t4, s4, e5)), void 0 !== e5 ? (s4._$Co ?? (s4._$Co = []))[e5] = h3 : s4._$Cl = h3), void 0 !== h3 && (i5 = M(t4, h3._$AS(t4, i5.values), h3, e5)), i5;
}
var R = class {
  constructor(t4, i5) {
    this._$AV = [], this._$AN = void 0, this._$AD = t4, this._$AM = i5;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t4) {
    const { el: { content: i5 }, parts: s4 } = this._$AD, e5 = (t4?.creationScope ?? l2).importNode(i5, true);
    P.currentNode = e5;
    let h3 = P.nextNode(), o6 = 0, n5 = 0, r6 = s4[0];
    for (; void 0 !== r6; ) {
      if (o6 === r6.index) {
        let i6;
        2 === r6.type ? i6 = new k(h3, h3.nextSibling, this, t4) : 1 === r6.type ? i6 = new r6.ctor(h3, r6.name, r6.strings, this, t4) : 6 === r6.type && (i6 = new Z(h3, this, t4)), this._$AV.push(i6), r6 = s4[++n5];
      }
      o6 !== r6?.index && (h3 = P.nextNode(), o6++);
    }
    return P.currentNode = l2, e5;
  }
  p(t4) {
    let i5 = 0;
    for (const s4 of this._$AV) void 0 !== s4 && (void 0 !== s4.strings ? (s4._$AI(t4, s4, i5), i5 += s4.strings.length - 2) : s4._$AI(t4[i5])), i5++;
  }
};
var k = class _k {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t4, i5, s4, e5) {
    this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t4, this._$AB = i5, this._$AM = s4, this.options = e5, this._$Cv = e5?.isConnected ?? true;
  }
  get parentNode() {
    let t4 = this._$AA.parentNode;
    const i5 = this._$AM;
    return void 0 !== i5 && 11 === t4?.nodeType && (t4 = i5.parentNode), t4;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t4, i5 = this) {
    t4 = M(this, t4, i5), a2(t4) ? t4 === A || null == t4 || "" === t4 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t4 !== this._$AH && t4 !== E && this._(t4) : void 0 !== t4._$litType$ ? this.$(t4) : void 0 !== t4.nodeType ? this.T(t4) : d2(t4) ? this.k(t4) : this._(t4);
  }
  O(t4) {
    return this._$AA.parentNode.insertBefore(t4, this._$AB);
  }
  T(t4) {
    this._$AH !== t4 && (this._$AR(), this._$AH = this.O(t4));
  }
  _(t4) {
    this._$AH !== A && a2(this._$AH) ? this._$AA.nextSibling.data = t4 : this.T(l2.createTextNode(t4)), this._$AH = t4;
  }
  $(t4) {
    const { values: i5, _$litType$: s4 } = t4, e5 = "number" == typeof s4 ? this._$AC(t4) : (void 0 === s4.el && (s4.el = S2.createElement(V(s4.h, s4.h[0]), this.options)), s4);
    if (this._$AH?._$AD === e5) this._$AH.p(i5);
    else {
      const t5 = new R(e5, this), s5 = t5.u(this.options);
      t5.p(i5), this.T(s5), this._$AH = t5;
    }
  }
  _$AC(t4) {
    let i5 = C.get(t4.strings);
    return void 0 === i5 && C.set(t4.strings, i5 = new S2(t4)), i5;
  }
  k(t4) {
    u2(this._$AH) || (this._$AH = [], this._$AR());
    const i5 = this._$AH;
    let s4, e5 = 0;
    for (const h3 of t4) e5 === i5.length ? i5.push(s4 = new _k(this.O(c3()), this.O(c3()), this, this.options)) : s4 = i5[e5], s4._$AI(h3), e5++;
    e5 < i5.length && (this._$AR(s4 && s4._$AB.nextSibling, e5), i5.length = e5);
  }
  _$AR(t4 = this._$AA.nextSibling, s4) {
    for (this._$AP?.(false, true, s4); t4 !== this._$AB; ) {
      const s5 = i3(t4).nextSibling;
      i3(t4).remove(), t4 = s5;
    }
  }
  setConnected(t4) {
    void 0 === this._$AM && (this._$Cv = t4, this._$AP?.(t4));
  }
};
var H = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t4, i5, s4, e5, h3) {
    this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t4, this.name = i5, this._$AM = e5, this.options = h3, s4.length > 2 || "" !== s4[0] || "" !== s4[1] ? (this._$AH = Array(s4.length - 1).fill(new String()), this.strings = s4) : this._$AH = A;
  }
  _$AI(t4, i5 = this, s4, e5) {
    const h3 = this.strings;
    let o6 = false;
    if (void 0 === h3) t4 = M(this, t4, i5, 0), o6 = !a2(t4) || t4 !== this._$AH && t4 !== E, o6 && (this._$AH = t4);
    else {
      const e6 = t4;
      let n5, r6;
      for (t4 = h3[0], n5 = 0; n5 < h3.length - 1; n5++) r6 = M(this, e6[s4 + n5], i5, n5), r6 === E && (r6 = this._$AH[n5]), o6 || (o6 = !a2(r6) || r6 !== this._$AH[n5]), r6 === A ? t4 = A : t4 !== A && (t4 += (r6 ?? "") + h3[n5 + 1]), this._$AH[n5] = r6;
    }
    o6 && !e5 && this.j(t4);
  }
  j(t4) {
    t4 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t4 ?? "");
  }
};
var I = class extends H {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t4) {
    this.element[this.name] = t4 === A ? void 0 : t4;
  }
};
var L = class extends H {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t4) {
    this.element.toggleAttribute(this.name, !!t4 && t4 !== A);
  }
};
var z = class extends H {
  constructor(t4, i5, s4, e5, h3) {
    super(t4, i5, s4, e5, h3), this.type = 5;
  }
  _$AI(t4, i5 = this) {
    if ((t4 = M(this, t4, i5, 0) ?? A) === E) return;
    const s4 = this._$AH, e5 = t4 === A && s4 !== A || t4.capture !== s4.capture || t4.once !== s4.once || t4.passive !== s4.passive, h3 = t4 !== A && (s4 === A || e5);
    e5 && this.element.removeEventListener(this.name, this, s4), h3 && this.element.addEventListener(this.name, this, t4), this._$AH = t4;
  }
  handleEvent(t4) {
    "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t4) : this._$AH.handleEvent(t4);
  }
};
var Z = class {
  constructor(t4, i5, s4) {
    this.element = t4, this.type = 6, this._$AN = void 0, this._$AM = i5, this.options = s4;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t4) {
    M(this, t4);
  }
};
var B = t2.litHtmlPolyfillSupport;
B?.(S2, k), (t2.litHtmlVersions ?? (t2.litHtmlVersions = [])).push("3.3.2");
var D = (t4, i5, s4) => {
  const e5 = s4?.renderBefore ?? i5;
  let h3 = e5._$litPart$;
  if (void 0 === h3) {
    const t5 = s4?.renderBefore ?? null;
    e5._$litPart$ = h3 = new k(i5.insertBefore(c3(), t5), t5, void 0, s4 ?? {});
  }
  return h3._$AI(t4), h3;
};

// node_modules/lit-element/lit-element.js
var s3 = globalThis;
var i4 = class extends y {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var _a;
    const t4 = super.createRenderRoot();
    return (_a = this.renderOptions).renderBefore ?? (_a.renderBefore = t4.firstChild), t4;
  }
  update(t4) {
    const r6 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t4), this._$Do = D(r6, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(true);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(false);
  }
  render() {
    return E;
  }
};
i4._$litElement$ = true, i4["finalized"] = true, s3.litElementHydrateSupport?.({ LitElement: i4 });
var o4 = s3.litElementPolyfillSupport;
o4?.({ LitElement: i4 });
(s3.litElementVersions ?? (s3.litElementVersions = [])).push("4.2.2");

// node_modules/@lit/reactive-element/decorators/custom-element.js
var t3 = (t4) => (e5, o6) => {
  void 0 !== o6 ? o6.addInitializer(() => {
    customElements.define(t4, e5);
  }) : customElements.define(t4, e5);
};

// node_modules/@lit/reactive-element/decorators/property.js
var o5 = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
var r4 = (t4 = o5, e5, r6) => {
  const { kind: n5, metadata: i5 } = r6;
  let s4 = globalThis.litPropertyMetadata.get(i5);
  if (void 0 === s4 && globalThis.litPropertyMetadata.set(i5, s4 = /* @__PURE__ */ new Map()), "setter" === n5 && ((t4 = Object.create(t4)).wrapped = true), s4.set(r6.name, t4), "accessor" === n5) {
    const { name: o6 } = r6;
    return { set(r7) {
      const n6 = e5.get.call(this);
      e5.set.call(this, r7), this.requestUpdate(o6, n6, t4, true, r7);
    }, init(e6) {
      return void 0 !== e6 && this.C(o6, void 0, t4, e6), e6;
    } };
  }
  if ("setter" === n5) {
    const { name: o6 } = r6;
    return function(r7) {
      const n6 = this[o6];
      e5.call(this, r7), this.requestUpdate(o6, n6, t4, true, r7);
    };
  }
  throw Error("Unsupported decorator location: " + n5);
};
function n4(t4) {
  return (e5, o6) => "object" == typeof o6 ? r4(t4, e5, o6) : ((t5, e6, o7) => {
    const r6 = e6.hasOwnProperty(o7);
    return e6.constructor.createProperty(o7, t5), r6 ? Object.getOwnPropertyDescriptor(e6, o7) : void 0;
  })(t4, e5, o6);
}

// node_modules/@lit/reactive-element/decorators/state.js
function r5(r6) {
  return n4({ ...r6, state: true, attribute: false });
}

// src/core/graph.ts
function findRootIds(nodes, rootId) {
  if (rootId) return [rootId];
  const ids = new Set(nodes.map((node) => node.id));
  return nodes.filter((node) => !node.parent || !ids.has(node.parent)).map((node) => node.id);
}
function buildChildrenMap(nodes) {
  const children = /* @__PURE__ */ new Map();
  for (const node of nodes) {
    children.set(node.id, []);
  }
  for (const node of nodes) {
    if (node.parent && children.has(node.parent)) {
      children.get(node.parent)?.push(node.id);
    }
  }
  return children;
}
function layoutTree(nodes, rootIds, childrenMap) {
  var _a;
  const levels = [];
  const visited = /* @__PURE__ */ new Set();
  const queue = rootIds.map((id) => ({ id, level: 0 }));
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || visited.has(current.id)) continue;
    visited.add(current.id);
    levels[_a = current.level] ?? (levels[_a] = []);
    levels[current.level].push(current.id);
    for (const childId of childrenMap.get(current.id) ?? []) {
      queue.push({ id: childId, level: current.level + 1 });
    }
  }
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      levels[levels.length] = [node.id];
    }
  }
  const width = 1e3;
  const height = Math.max(360, levels.reduce((max, level) => Math.max(max, level.length * 120), 0) + 80);
  const positions = /* @__PURE__ */ new Map();
  for (let levelIndex = 0; levelIndex < levels.length; levelIndex += 1) {
    const nodeIds = levels[levelIndex] ?? [];
    const x2 = levels.length === 1 ? width / 2 : 120 + levelIndex * (width - 240) / (levels.length - 1);
    for (let rowIndex = 0; rowIndex < nodeIds.length; rowIndex += 1) {
      const id = nodeIds[rowIndex];
      if (!id) continue;
      const y3 = nodeIds.length === 1 ? height / 2 : 60 + rowIndex * (height - 120) / (nodeIds.length - 1);
      positions.set(id, { x: x2, y: y3 });
    }
  }
  return { width, height, positions };
}

// src/core/ha.ts
function entityToNumber(hass, entityId) {
  if (!hass || !entityId) return null;
  const state = hass.states[entityId]?.state;
  if (state === void 0) return null;
  const value = Number(state);
  return Number.isFinite(value) ? value : null;
}
function entityToText(hass, entityId) {
  if (!hass || !entityId) return null;
  return hass.states[entityId]?.state ?? null;
}

// src/core/flow.ts
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function getEdgeFlow(node, minActivePower) {
  const power = node.computed.power;
  const current = node.computed.current;
  const state = (node.live.state ?? "").toLowerCase();
  const activeByPower = power !== null && Math.abs(power) >= minActivePower;
  const activeByCurrent = current !== null && Math.abs(current) > 0.01;
  const activeByState = ["on", "true", "1", "closed"].includes(state);
  const intensity = Math.max(Math.abs(power ?? 0), Math.abs((current ?? 0) * 230));
  const normalized = clamp(intensity / 8e3, 0, 1);
  const speedSeconds = 2.4 - normalized * 1.9;
  return {
    active: activeByPower || activeByCurrent || activeByState,
    reverse: power !== null && power < 0,
    speedSeconds,
    bidirectional: node.bidirectional_with_parent
  };
}

// src/styles/card-styles.ts
var cardStyles = i`
  :host {
    display: block;
    width: 100%;
  }

  ha-card {
    width: 100%;
  }

  .wrapper {
    padding: 14px;
    border-radius: 14px;
    background:
      radial-gradient(circle at 8% 0%, rgba(56, 189, 248, 0.18), transparent 35%),
      radial-gradient(circle at 90% 0%, rgba(16, 185, 129, 0.16), transparent 35%),
      linear-gradient(180deg, rgba(12, 16, 24, 0.04), rgba(12, 16, 24, 0.01));
  }

  .hero {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }

  .title {
    font-size: 22px;
    font-weight: 800;
    margin-bottom: 4px;
  }

  .subtitle {
    font-size: 12px;
    color: var(--secondary-text-color);
  }

  .toolbar {
    margin-bottom: 10px;
  }

  .edit-btn {
    border: 1px solid rgba(14, 165, 233, 0.35);
    background: rgba(14, 165, 233, 0.12);
    color: #0f172a;
    font-size: 12px;
    font-weight: 700;
    padding: 7px 12px;
    border-radius: 999px;
    cursor: pointer;
  }

  .kpis {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 8px;
    min-width: min(980px, 100%);
  }

  .kpi {
    border-radius: 10px;
    padding: 8px 10px;
    background: rgba(255, 255, 255, 0.75);
    border: 1px solid rgba(120, 130, 150, 0.22);
    box-shadow: 0 4px 10px rgba(15, 23, 42, 0.08);
  }

  .kpi.ok {
    border-color: rgba(16, 185, 129, 0.4);
  }

  .kpi.alert {
    border-color: rgba(239, 68, 68, 0.42);
    background: rgba(254, 242, 242, 0.92);
  }

  .kpi-label {
    font-size: 11px;
    color: var(--secondary-text-color);
    margin-bottom: 3px;
  }

  .kpi-value {
    font-size: 18px;
    font-weight: 800;
  }

  .phase-legend {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
    flex-wrap: wrap;
  }

  .phase-chip {
    display: inline-flex;
    padding: 4px 9px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
  }

  .phase-chip.l1 {
    background: rgba(239, 68, 68, 0.12);
    border: 1px solid rgba(239, 68, 68, 0.35);
  }

  .phase-chip.l2 {
    background: rgba(59, 130, 246, 0.12);
    border: 1px solid rgba(59, 130, 246, 0.35);
  }

  .phase-chip.l3 {
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.35);
  }

  .graph {
    position: relative;
    width: 100%;
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid rgba(120, 130, 150, 0.24);
    margin-bottom: 14px;
    background:
      linear-gradient(180deg, rgba(11, 17, 32, 0.07), rgba(11, 17, 32, 0.01)),
      repeating-linear-gradient(90deg, rgba(148, 163, 184, 0.05) 0, rgba(148, 163, 184, 0.05) 1px, transparent 1px, transparent 28px);
  }

  .graph-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 30% 15%, rgba(34, 197, 94, 0.1), transparent 30%);
    pointer-events: none;
  }

  svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .edge {
    fill: none;
    stroke: rgba(100, 116, 139, 0.45);
    stroke-linecap: round;
  }

  .edge.active {
    stroke-dasharray: 11 8;
    animation: flow 1s linear infinite;
    filter: drop-shadow(0 0 5px rgba(34, 197, 94, 0.65));
  }

  .phase-label {
    font-size: 10px;
    font-weight: 700;
    fill: rgba(15, 23, 42, 0.8);
    paint-order: stroke;
    stroke: rgba(255, 255, 255, 0.9);
    stroke-width: 3;
  }

  .edge.phase-l1,
  .panel-edge.phase-l1,
  .inter-edge.phase-l1 {
    stroke: rgba(239, 68, 68, 0.75);
  }

  .edge.phase-l2,
  .panel-edge.phase-l2,
  .inter-edge.phase-l2 {
    stroke: rgba(59, 130, 246, 0.75);
  }

  .edge.phase-l3,
  .panel-edge.phase-l3,
  .inter-edge.phase-l3 {
    stroke: rgba(16, 185, 129, 0.75);
  }

  .flow-dot {
    fill: #22c55e;
    filter: drop-shadow(0 0 4px rgba(34, 197, 94, 0.9));
  }

  .flow-dot.reverse {
    fill: #0ea5e9;
    filter: drop-shadow(0 0 4px rgba(14, 165, 233, 0.9));
  }

  .flow-dot.panel {
    fill: #f59e0b;
    filter: drop-shadow(0 0 3px rgba(245, 158, 11, 0.85));
  }

  .node {
    position: absolute;
    transform: translate(-50%, -50%);
    width: 200px;
    min-height: 74px;
    padding: 9px 10px;
    border-radius: 12px;
    border: 1px solid rgba(120, 130, 150, 0.4);
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 8px 16px rgba(15, 23, 42, 0.12);
    z-index: 2;
  }

  .node-head,
  .slot-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .node-name {
    font-size: 13px;
    font-weight: 800;
    margin-bottom: 4px;
  }

  .load-kind {
    font-size: 10px;
    font-weight: 700;
    color: #334155;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .node-metrics {
    font-size: 11px;
    line-height: 1.3;
    color: var(--secondary-text-color);
  }

  .status-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    display: inline-block;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.8);
  }

  .status-dot.on {
    background: #22c55e;
  }

  .status-dot.off {
    background: #94a3b8;
  }

  .status-dot.alert {
    background: #ef4444;
    box-shadow: 0 0 8px rgba(239, 68, 68, 0.8);
  }

  .interpanel {
    border: 1px solid rgba(120, 130, 150, 0.28);
    border-radius: 12px;
    background: rgba(248, 250, 252, 0.88);
    margin-bottom: 12px;
    padding: 8px;
  }

  .interpanel-title {
    font-size: 12px;
    font-weight: 800;
    margin-bottom: 6px;
  }

  .interpanel svg {
    position: relative;
    width: 100%;
    height: 130px;
  }

  .inter-edge {
    fill: none;
    stroke-width: 2.4;
    stroke-dasharray: 7 5;
  }

  .inter-label {
    font-size: 11px;
    fill: rgba(30, 41, 59, 0.85);
    font-weight: 700;
    text-anchor: middle;
  }

  .panels {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(520px, 1fr));
  }

  .panel {
    border: 1px solid rgba(120, 130, 150, 0.28);
    border-radius: 14px;
    padding: 10px;
    background: linear-gradient(160deg, rgba(255, 255, 255, 0.9), rgba(244, 248, 255, 0.86));
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
  }

  .panel-top {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 8px;
  }

  .panel-title {
    font-size: 14px;
    font-weight: 800;
  }

  .panel-usage {
    font-size: 12px;
    color: var(--secondary-text-color);
  }

  .usage-track {
    height: 6px;
    border-radius: 999px;
    background: rgba(148, 163, 184, 0.24);
    overflow: hidden;
    margin-bottom: 10px;
  }

  .usage-fill {
    height: 100%;
    background: linear-gradient(90deg, #22c55e, #0ea5e9);
  }

  .panel-shell {
    position: relative;
  }

  .panel-links {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
  }

  .panel-edge {
    fill: none;
    stroke-width: 2.2;
    stroke-dasharray: 6 5;
  }

  .panel-edge.active {
    stroke-width: 2.8;
    filter: drop-shadow(0 0 3px rgba(14, 165, 233, 0.7));
  }

  .terminal-dot {
    fill: #334155;
    opacity: 0.9;
  }

  .panel-grid {
    display: grid;
    gap: 8px;
    position: relative;
    z-index: 2;
  }

  .panel-slot {
    border: 1px solid rgba(120, 130, 150, 0.35);
    border-radius: 9px;
    padding: 8px;
    min-height: 82px;
    background: rgba(255, 255, 255, 0.92);
  }

  .panel-slot.draggable {
    cursor: grab;
  }

  .panel-slot.empty {
    opacity: 0.6;
    border-style: dashed;
  }

  .slot-label {
    font-size: 11px;
    font-weight: 700;
    color: var(--secondary-text-color);
    margin-bottom: 4px;
  }

  .slot-name {
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .slot-metrics,
  .slot-empty {
    font-size: 11px;
    color: var(--secondary-text-color);
    line-height: 1.25;
  }

  .yaml-preview {
    margin-top: 12px;
    border-radius: 12px;
    border: 1px solid rgba(120, 130, 150, 0.35);
    background: rgba(248, 250, 252, 0.92);
    overflow: hidden;
  }

  .yaml-title {
    font-size: 12px;
    font-weight: 800;
    padding: 8px 10px;
    border-bottom: 1px solid rgba(120, 130, 150, 0.22);
    background: rgba(226, 232, 240, 0.55);
  }

  .yaml-preview pre {
    margin: 0;
    padding: 10px;
    font-size: 11px;
    line-height: 1.4;
    overflow: auto;
    white-space: pre;
  }

  .node.main_breaker,
  .node.breaker,
  .node.input,
  .panel-slot.main_breaker,
  .panel-slot.breaker,
  .panel-slot.input {
    border-left: 5px solid #ef4444;
  }

  .node.grid,
  .node.line,
  .node.bus,
  .panel-slot.grid,
  .panel-slot.line,
  .panel-slot.bus {
    border-left: 5px solid #3b82f6;
  }

  .node.inverter,
  .node.load,
  .node.device,
  .node.relay,
  .panel-slot.inverter,
  .panel-slot.load,
  .panel-slot.device,
  .panel-slot.relay {
    border-left: 5px solid #22c55e;
  }

  .node.battery,
  .node.solar,
  .panel-slot.battery,
  .panel-slot.solar {
    border-left: 5px solid #f59e0b;
  }

  @keyframes flow {
    from {
      stroke-dashoffset: 0;
    }
    to {
      stroke-dashoffset: -38;
    }
  }

  @media (max-width: 1020px) {
    .panels {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 740px) {
    .node {
      width: 156px;
      min-height: 68px;
    }

    .kpis {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      min-width: 100%;
    }
  }
`;

// src/core/topology.ts
function sumOrNull(values) {
  const numeric = values.filter((value) => value !== null);
  if (!numeric.length) return null;
  return numeric.reduce((acc, value) => acc + value, 0);
}
function sumPositive(values) {
  const positive = values.filter((value) => value !== null && value > 0);
  if (!positive.length) return null;
  return positive.reduce((acc, value) => acc + value, 0);
}
function computeTopologyMetrics(nodes, childrenMap) {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const computedCache = /* @__PURE__ */ new Map();
  const dfs = (nodeId, stack) => {
    if (computedCache.has(nodeId)) return computedCache.get(nodeId);
    if (stack.has(nodeId)) {
      const node2 = nodeMap.get(nodeId);
      return {
        power: node2?.live.power ?? null,
        current: node2?.live.current ?? null
      };
    }
    stack.add(nodeId);
    const node = nodeMap.get(nodeId);
    if (!node) {
      stack.delete(nodeId);
      return { power: null, current: null };
    }
    const childIds = childrenMap.get(nodeId) ?? [];
    const childComputed = childIds.map((id) => dfs(id, stack));
    const childPowerSum = sumOrNull(childComputed.map((m2) => m2.power));
    const childCurrentSum = sumOrNull(childComputed.map((m2) => m2.current));
    const result = node.type === "grid" ? {
      power: sumPositive(childComputed.map((m2) => m2.power)) ?? 0,
      current: sumPositive(childComputed.map((m2) => m2.current)) ?? 0
    } : {
      power: node.live.power ?? childPowerSum,
      current: node.live.current ?? childCurrentSum
    };
    computedCache.set(nodeId, result);
    stack.delete(nodeId);
    return result;
  };
  for (const node of nodes) {
    dfs(node.id, /* @__PURE__ */ new Set());
  }
  return nodes.map((node) => {
    const computed = computedCache.get(node.id) ?? { power: node.live.power, current: node.live.current };
    return {
      ...node,
      computed
    };
  });
}

// src/house-power-flow-card.ts
var HousePowerFlowCard = class extends i4 {
  constructor() {
    super(...arguments);
    this.editMode = false;
    this.dragNodeId = null;
  }
  setConfig(config) {
    if (!config?.nodes?.length) {
      throw new Error("You need to define 'nodes' as a non-empty array.");
    }
    this.config = {
      title: config.title ?? "House Power Flow",
      root_id: config.root_id,
      min_active_power: Number.isFinite(config.min_active_power) ? config.min_active_power : 10,
      line_width: Number.isFinite(config.line_width) ? config.line_width : 4,
      max_expected_power: Number.isFinite(config.max_expected_power) ? config.max_expected_power : 15e3,
      panels: (config.panels ?? []).map((panel) => ({
        ...panel,
        slots: Math.max(1, panel.slots),
        columns: panel.columns && panel.columns > 0 ? Math.floor(panel.columns) : void 0
      })),
      nodes: config.nodes.map((node) => ({
        ...node,
        name: node.name ?? node.id,
        type: node.type ?? "load",
        load_kind: node.load_kind ?? "other",
        phase: node.phase ?? "L1",
        rated_power: Number.isFinite(node.rated_power) ? node.rated_power ?? null : null,
        bidirectional_with_parent: Boolean(node.bidirectional_with_parent),
        live: { power: null, current: null, voltage: null, state: null },
        computed: { power: null, current: null }
      }))
    };
  }
  getCardSize() {
    return 12;
  }
  phaseClass(phase) {
    return phase.toLowerCase();
  }
  formatMetrics(node) {
    const metrics = [];
    const power = node.live.power ?? node.computed.power;
    const current = node.live.current ?? node.computed.current;
    if (power !== null) metrics.push(`${power.toFixed(0)} W`);
    if (current !== null) metrics.push(`${current.toFixed(1)} A`);
    if (node.live.voltage !== null) metrics.push(`${node.live.voltage.toFixed(0)} V`);
    if (node.rated_power !== null) metrics.push(`Rated: ${node.rated_power} W`);
    if (node.live.state !== null) metrics.push(`State: ${node.live.state}`);
    return metrics;
  }
  nodeStateClass(node) {
    const state = (node.live.state ?? "").toLowerCase();
    const power = node.live.power ?? node.computed.power;
    if (["fault", "alarm", "trip", "error"].includes(state)) return "alert";
    if (power !== null && power > this.config.max_expected_power) return "alert";
    if (["off", "false", "0", "open"].includes(state)) return "off";
    return "on";
  }
  loadKindLabel(node) {
    if (node.type !== "load") return "";
    const map = {
      boiler: "Boiler",
      pump: "Pump",
      fridge: "Fridge",
      tv: "TV",
      router: "Router",
      heater: "Heater",
      lighting: "Lighting",
      socket: "Socket",
      other: "Load"
    };
    return map[node.load_kind] ?? "Load";
  }
  toggleEditMode() {
    this.editMode = !this.editMode;
  }
  onDragStart(nodeId) {
    if (!this.editMode) return;
    this.dragNodeId = nodeId;
  }
  onDrop(panelId, slot) {
    if (!this.config || !this.dragNodeId) return;
    const draggedNode = this.config.nodes.find((n5) => n5.id === this.dragNodeId);
    if (!draggedNode) return;
    const occupant = this.config.nodes.find((n5) => n5.panel_id === panelId && n5.panel_slot === slot);
    const prevPanel = draggedNode.panel_id;
    const prevSlot = draggedNode.panel_slot;
    draggedNode.panel_id = panelId;
    draggedNode.panel_slot = slot;
    if (occupant && occupant.id !== draggedNode.id) {
      occupant.panel_id = prevPanel;
      occupant.panel_slot = prevSlot;
    }
    this.dragNodeId = null;
    this.requestUpdate();
  }
  onDragOver(event) {
    if (!this.editMode) return;
    event.preventDefault();
  }
  generateYamlPreview() {
    if (!this.config) return "";
    const lines = [];
    lines.push("panels:");
    for (const panel of this.config.panels) {
      lines.push(`  - id: ${panel.id}`);
      lines.push(`    name: ${panel.name}`);
      lines.push(`    slots: ${panel.slots}`);
      if (panel.columns) lines.push(`    columns: ${panel.columns}`);
    }
    lines.push("");
    lines.push("nodes:");
    for (const node of this.config.nodes) {
      lines.push(`  - id: ${node.id}`);
      lines.push(`    name: ${node.name}`);
      lines.push(`    type: ${node.type}`);
      if (node.parent) lines.push(`    parent: ${node.parent}`);
      if (node.panel_id) lines.push(`    panel_id: ${node.panel_id}`);
      if (Number.isFinite(node.panel_slot)) lines.push(`    panel_slot: ${node.panel_slot}`);
      if (node.phase) lines.push(`    phase: ${node.phase}`);
      if (node.type === "load") lines.push(`    load_kind: ${node.load_kind}`);
      if (node.rated_power !== null) lines.push(`    rated_power: ${node.rated_power}`);
      if (node.bidirectional_with_parent) lines.push("    bidirectional_with_parent: true");
    }
    return lines.join("\n");
  }
  render() {
    if (!this.config) return b2``;
    const liveNodes = this.config.nodes.map((node) => ({
      ...node,
      live: {
        power: entityToNumber(this.hass, node.power),
        current: entityToNumber(this.hass, node.current),
        voltage: entityToNumber(this.hass, node.voltage),
        state: entityToText(this.hass, node.state)
      }
    }));
    const childrenMap = buildChildrenMap(liveNodes);
    const nodes = computeTopologyMetrics(liveNodes, childrenMap);
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));
    const rootIds = findRootIds(nodes, this.config.root_id).filter((id) => nodeMap.has(id));
    const layout = layoutTree(nodes, rootIds, buildChildrenMap(nodes));
    const panelNodeIds = new Set(nodes.filter((node) => node.panel_id && Number.isFinite(node.panel_slot)).map((node) => node.id));
    const freeNodes = nodes.filter((node) => !panelNodeIds.has(node.id));
    const graphHeight = Math.min(760, Math.max(340, layout.height + 20));
    const edges = nodes.filter((node) => node.parent && nodeMap.has(node.parent) && !panelNodeIds.has(node.id) && !panelNodeIds.has(node.parent)).map((node) => {
      const parentPosition = node.parent ? layout.positions.get(node.parent) : void 0;
      const childPosition = layout.positions.get(node.id);
      if (!parentPosition || !childPosition) return null;
      const flow = getEdgeFlow(node, this.config.min_active_power);
      const classes = ["edge", flow.active ? "active" : "", flow.reverse ? "reverse" : "", `phase-${this.phaseClass(node.phase)}`].filter(Boolean).join(" ");
      const pathId = `edge-${node.id}`;
      const x1 = parentPosition.x + 92;
      const y1 = parentPosition.y;
      const x2 = childPosition.x - 92;
      const y22 = childPosition.y;
      const midX = (x1 + x2) / 2;
      const d3 = `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y22} L ${x2} ${y22}`;
      return w`
          <path id=${pathId} class=${classes} style=${`stroke-width:${this.config.line_width}`} d=${d3} marker-end="url(#arrow)" />
          ${flow.active ? w`
                <circle class="flow-dot" r="4">
                  <animateMotion dur=${`${flow.speedSeconds}s`} repeatCount="indefinite" rotate="auto"><mpath href=${`#${pathId}`}></mpath></animateMotion>
                </circle>
              ` : w``}
          <text class="phase-label" x=${(parentPosition.x + childPosition.x) / 2} y=${(parentPosition.y + childPosition.y) / 2 - 8}>${node.phase}</text>
        `;
    });
    const totalPower = nodes.reduce((sum, node) => sum + (node.computed.power && node.computed.power > 0 ? node.computed.power : 0), 0);
    const pvGeneration = nodes.filter((n5) => n5.type === "solar").reduce((sum, n5) => sum + Math.max(0, n5.computed.power ?? 0), 0);
    const batteryPowerNet = nodes.filter((n5) => n5.type === "battery").reduce((sum, n5) => sum + (n5.computed.power ?? 0), 0);
    const batteryCharge = Math.max(0, -batteryPowerNet);
    const batteryDischarge = Math.max(0, batteryPowerNet);
    const gridNodes = nodes.filter((n5) => n5.type === "grid");
    const gridImport = gridNodes.reduce((sum, n5) => sum + Math.max(0, n5.computed.power ?? 0), 0);
    const gridExport = nodes.filter((n5) => n5.parent && gridNodes.some((g2) => g2.id === n5.parent)).reduce((sum, n5) => sum + Math.max(0, -(n5.computed.power ?? 0)), 0);
    const activeFlows = nodes.filter((node) => node.parent && getEdgeFlow(node, this.config.min_active_power).active).length;
    const alertCount = nodes.filter((node) => this.nodeStateClass(node) === "alert").length;
    const phaseTotals = { L1: 0, L2: 0, L3: 0 };
    for (const node of nodes) {
      if (node.computed.power && node.computed.power > 0) phaseTotals[node.phase] += node.computed.power;
    }
    const activePhases = Object.values(phaseTotals).filter((v2) => v2 > 0).length || 1;
    const avg = (phaseTotals.L1 + phaseTotals.L2 + phaseTotals.L3) / activePhases;
    const maxDev = Math.max(Math.abs(phaseTotals.L1 - avg), Math.abs(phaseTotals.L2 - avg), Math.abs(phaseTotals.L3 - avg));
    const phaseImbalancePct = avg > 0 ? maxDev / avg * 100 : 0;
    const interPanelConnections = nodes.filter((node) => node.parent).map((node) => ({ child: node, parent: node.parent ? nodeMap.get(node.parent) : void 0 })).filter((entry) => Boolean(entry.parent)).filter(({ child, parent }) => Boolean(child.panel_id && parent.panel_id && child.panel_id !== parent.panel_id));
    const panelOrder = new Map(this.config.panels.map((panel, idx) => [panel.id, idx]));
    const panelCanvasWidth = 1200;
    const panelCanvasHeight = Math.max(220, this.config.panels.length * 90);
    return b2`
      <ha-card>
        <div class="wrapper">
          <div class="hero">
            <div>
              <div class="title">${this.config.title}</div>
              <div class="subtitle">Live topology and switchboard monitoring</div>
            </div>
            <div class="kpis">
              <div class="kpi"><div class="kpi-label">Total Load</div><div class="kpi-value">${totalPower.toFixed(0)} W</div></div>
              <div class="kpi"><div class="kpi-label">PV Gen</div><div class="kpi-value">${pvGeneration.toFixed(0)} W</div></div>
              <div class="kpi"><div class="kpi-label">Battery +</div><div class="kpi-value">${batteryDischarge.toFixed(0)} W</div></div>
              <div class="kpi"><div class="kpi-label">Battery -</div><div class="kpi-value">${batteryCharge.toFixed(0)} W</div></div>
              <div class="kpi"><div class="kpi-label">Grid Import</div><div class="kpi-value">${gridImport.toFixed(0)} W</div></div>
              <div class="kpi"><div class="kpi-label">Grid Export</div><div class="kpi-value">${gridExport.toFixed(0)} W</div></div>
              <div class="kpi"><div class="kpi-label">Active Flows</div><div class="kpi-value">${activeFlows}</div></div>
              <div class="kpi"><div class="kpi-label">Phase Δ</div><div class="kpi-value">${phaseImbalancePct.toFixed(1)}%</div></div>
              <div class=${`kpi ${alertCount > 0 ? "alert" : "ok"}`}><div class="kpi-label">Alerts</div><div class="kpi-value">${alertCount}</div></div>
            </div>
          </div>

          <div class="toolbar">
            <button class="edit-btn" @click=${this.toggleEditMode}>${this.editMode ? "Exit Configurator" : "Open Configurator"}</button>
          </div>

          <div class="phase-legend">
            <span class="phase-chip l1">L1 ${phaseTotals.L1.toFixed(0)} W</span>
            <span class="phase-chip l2">L2 ${phaseTotals.L2.toFixed(0)} W</span>
            <span class="phase-chip l3">L3 ${phaseTotals.L3.toFixed(0)} W</span>
          </div>

          <div class="graph" style=${`height:${graphHeight}px`}>
            <div class="graph-glow"></div>
            <svg viewBox=${`0 0 ${layout.width} ${graphHeight}`} preserveAspectRatio="none">
              <defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--primary-text-color)" opacity="0.75" /></marker></defs>
              ${edges}
            </svg>

            ${freeNodes.map((node) => {
      const pos = layout.positions.get(node.id);
      if (!pos) return b2``;
      const metrics = this.formatMetrics(node);
      const statusClass = this.nodeStateClass(node);
      const loadKind = this.loadKindLabel(node);
      return b2`
                <div class=${`node ${node.type} ${statusClass}`} style=${`left:${pos.x}px; top:${pos.y}px;`}>
                  <div class="node-head"><div class="node-name">${node.name}</div><span class=${`status-dot ${statusClass}`}></span></div>
                  ${loadKind ? b2`<div class="load-kind">${loadKind}</div>` : b2``}
                  <div class="node-metrics">${metrics.length ? metrics.join(" | ") : "No data"}</div>
                </div>
              `;
    })}
          </div>

          ${interPanelConnections.length ? b2`
                <div class="interpanel">
                  <div class="interpanel-title">Inter-Panel Routing</div>
                  <svg viewBox=${`0 0 ${panelCanvasWidth} ${panelCanvasHeight}`} preserveAspectRatio="none">
                    ${interPanelConnections.map(({ child, parent }) => {
      const fromIndex = panelOrder.get(parent.panel_id ?? "") ?? 0;
      const toIndex = panelOrder.get(child.panel_id ?? "") ?? 0;
      const panelCount = Math.max(1, this.config.panels.length);
      const laneW = panelCanvasWidth / panelCount;
      const x1 = fromIndex * laneW + laneW / 2;
      const x2 = toIndex * laneW + laneW / 2;
      const y1 = 36 + (parent.panel_slot ?? 1) % 8 * 22;
      const y22 = 36 + (child.panel_slot ?? 1) % 8 * 22;
      const midX = (x1 + x2) / 2;
      const d3 = `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y22} L ${x2} ${y22}`;
      const pid = `inter-${parent.id}-${child.id}`;
      const flow = getEdgeFlow(child, this.config.min_active_power);
      return w`
                        <path id=${pid} class=${`inter-edge phase-${this.phaseClass(child.phase)}`} d=${d3}></path>
                        <text class="inter-label" x=${x1} y=${18}>${parent.panel_id}</text>
                        <text class="inter-label" x=${x2} y=${18}>${child.panel_id}</text>
                        ${flow.active ? w`<circle class="flow-dot panel" r="3"><animateMotion dur=${`${flow.speedSeconds}s`} repeatCount="indefinite" rotate="auto"><mpath href=${`#${pid}`}></mpath></animateMotion></circle>` : w``}
                      `;
    })}
                  </svg>
                </div>
              ` : b2``}

          ${this.config.panels.length ? b2`
                <div class="panels">
                  ${this.config.panels.map((panel) => {
      const panelNodes = nodes.filter((node) => node.panel_id === panel.id);
      const slotCount = panel.slots;
      const columns = panel.columns && panel.columns > 0 ? panel.columns : Math.min(slotCount, 4);
      const occupied = panelNodes.filter((node) => Number.isFinite(node.panel_slot)).length;
      const usage = Math.min(100, occupied / slotCount * 100);
      const slotNodeMap = new Map(panelNodes.map((node) => [node.panel_slot, node]));
      const panelEdges = panelNodes.filter((node) => node.parent && panelNodes.some((candidate) => candidate.id === node.parent));
      return b2`
                      <div class="panel">
                        <div class="panel-top"><div class="panel-title">${panel.name}</div><div class="panel-usage">${occupied}/${slotCount} slots</div></div>
                        <div class="usage-track"><div class="usage-fill" style=${`width:${usage}%`}></div></div>
                        <div class="panel-shell">
                          <svg class="panel-links" viewBox="0 0 1000 260" preserveAspectRatio="none">
                            ${panelEdges.map((node) => {
        const childSlot = node.panel_slot ?? 1;
        const parentNode = panelNodes.find((candidate) => candidate.id === node.parent);
        const parentSlot = parentNode?.panel_slot ?? childSlot;
        const flow = getEdgeFlow(node, this.config.min_active_power);
        const col = columns;
        const cellW = 1e3 / col;
        const rows = Math.ceil(slotCount / col);
        const cellH = 260 / Math.max(rows, 1);
        const pCol = (parentSlot - 1) % col;
        const pRow = Math.floor((parentSlot - 1) / col);
        const cCol = (childSlot - 1) % col;
        const cRow = Math.floor((childSlot - 1) / col);
        const x1 = pCol * cellW + cellW * 0.86;
        const y1 = pRow * cellH + cellH / 2;
        const x2 = cCol * cellW + cellW * 0.14;
        const y22 = cRow * cellH + cellH / 2;
        const midX = (x1 + x2) / 2;
        const d3 = `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y22} L ${x2} ${y22}`;
        const pid = `panel-edge-${panel.id}-${node.id}`;
        return w`
                                <path id=${pid} class=${`panel-edge ${flow.active ? "active" : ""} phase-${this.phaseClass(node.phase)}`} d=${d3}></path>
                                <circle cx=${x1} cy=${y1} r="2" class="terminal-dot"></circle>
                                <circle cx=${x2} cy=${y22} r="2" class="terminal-dot"></circle>
                                ${flow.active ? w`
                                      <circle class="flow-dot panel" r="3"><animateMotion dur=${`${flow.speedSeconds}s`} repeatCount="indefinite" rotate="auto"><mpath href=${`#${pid}`}></mpath></animateMotion></circle>
                                      ${flow.bidirectional ? w`<circle class="flow-dot panel reverse" r="3"><animateMotion dur=${`${flow.speedSeconds}s`} repeatCount="indefinite" rotate="auto-reverse"><mpath href=${`#${pid}`}></mpath></animateMotion></circle>` : w``}
                                    ` : w``}
                              `;
      })}
                          </svg>

                          <div class="panel-grid" style=${`grid-template-columns: repeat(${columns}, minmax(140px, 1fr));`}>
                            ${Array.from({ length: slotCount }, (_2, index) => {
        const slot = index + 1;
        const slotNode = slotNodeMap.get(slot);
        if (!slotNode) {
          return b2`<div class="panel-slot empty dropzone" @dragover=${this.onDragOver} @drop=${() => this.onDrop(panel.id, slot)}><div class="slot-label">Slot ${slot}</div><div class="slot-empty">empty</div></div>`;
        }
        const metrics = this.formatMetrics(slotNode);
        const statusClass = this.nodeStateClass(slotNode);
        const loadKind = this.loadKindLabel(slotNode);
        return b2`
                                <div
                                  class=${`panel-slot filled ${slotNode.type} ${statusClass} ${this.editMode ? "draggable" : ""}`}
                                  draggable=${this.editMode}
                                  @dragstart=${() => this.onDragStart(slotNode.id)}
                                  @dragover=${this.onDragOver}
                                  @drop=${() => this.onDrop(panel.id, slot)}
                                >
                                  <div class="slot-top"><div class="slot-label">Slot ${slot} · ${slotNode.phase}</div><span class=${`status-dot ${statusClass}`}></span></div>
                                  <div class="slot-name">${slotNode.name}</div>
                                  ${loadKind ? b2`<div class="load-kind">${loadKind}</div>` : b2``}
                                  <div class="slot-metrics">${metrics.length ? metrics.join(" | ") : "No data"}</div>
                                </div>
                              `;
      })}
                          </div>
                        </div>
                      </div>
                    `;
    })}
                </div>
              ` : b2``}

          ${this.editMode ? b2`
                <div class="yaml-preview">
                  <div class="yaml-title">Configurator YAML Preview</div>
                  <pre>${this.generateYamlPreview()}</pre>
                </div>
              ` : b2``}
        </div>
      </ha-card>
    `;
  }
};
HousePowerFlowCard.styles = cardStyles;
__decorateClass([
  n4({ attribute: false })
], HousePowerFlowCard.prototype, "hass", 2);
__decorateClass([
  r5()
], HousePowerFlowCard.prototype, "config", 2);
__decorateClass([
  r5()
], HousePowerFlowCard.prototype, "editMode", 2);
__decorateClass([
  r5()
], HousePowerFlowCard.prototype, "dragNodeId", 2);
HousePowerFlowCard = __decorateClass([
  t3("house-power-flow-card")
], HousePowerFlowCard);

// src/index.ts
window.customCards = window.customCards ?? [];
if (!window.customCards.find((card) => card.type === "house-power-flow-card")) {
  window.customCards.push({
    type: "house-power-flow-card",
    name: "House Power Flow Card",
    description: "Build your home electrical topology and show live power flow."
  });
}
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
@lit/reactive-element/decorators/custom-element.js:
@lit/reactive-element/decorators/property.js:
@lit/reactive-element/decorators/state.js:
@lit/reactive-element/decorators/event-options.js:
@lit/reactive-element/decorators/base.js:
@lit/reactive-element/decorators/query.js:
@lit/reactive-element/decorators/query-all.js:
@lit/reactive-element/decorators/query-async.js:
@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
