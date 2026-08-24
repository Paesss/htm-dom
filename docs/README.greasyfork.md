<h1>xhtm-dom</h1>
<p>A tiny, framework-free DOM helper for writing HTML-like templates in plain JavaScript or TypeScript.</p>
<p><code>xhtm-dom</code> combines the <a href="%5Bhttps://github.com/dy/xhtm%5D%28https://github.com/dy/xhtm%29"><code>xhtm</code></a> tagged-template parser with a native DOM adapter. It creates real browser <code>Element</code>, <code>SVGElement</code>, <code>DocumentFragment</code>, and <code>Text</code> nodes without a virtual DOM, JSX compiler, or rendering runtime.</p>
<h2>Features</h2>
<ul>
<li>Real DOM node creation through <code>html</code> and the internal <code>h</code> helper, without an intermediate HTML string.</li>
<li>Direct DOM property bindings with a leading dot, such as <code>.value</code> and <code>.disabled</code>.</li>
<li>Event listeners such as <code>onClick</code> and <code>onInput</code> attached directly with <code>addEventListener</code>.</li>
<li>Refs as callback functions or <code>{ current }</code> objects.</li>
<li>Function components with props and <code>children</code>.</li>
<li>Interpolated DOM nodes, children, and recursively flattened arrays.</li>
<li>HTML and SVG element creation, including mixed <code>foreignObject</code> content.</li>
<li>Object and string styles, plus <code>data-*</code> and <code>aria-*</code> attributes.</li>
<li>HTML-like tagged templates with <code>html</code>.</li>
<li>Fragments for returning multiple top-level nodes.</li>
<li>TypeScript types for DOM props, events, refs, styles, children, and components.</li>
<li>ES module, CommonJS, and UMD library builds.</li>
</ul>
<h2>The <code>html</code> function</h2>
<p><code>html</code> is a tagged-template function:</p>
<pre class="shiki github-dark-default" style="background-color:#0d1117;color:#e6edf3" tabindex="0"><code><span class="line"><span style="color:#FF7B72">const</span><span style="color:#79C0FF"> username</span><span style="color:#FF7B72"> =</span><span style="color:#A5D6FF"> "Yourname"</span><span style="color:#E6EDF3">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF7B72">const</span><span style="color:#79C0FF"> view</span><span style="color:#FF7B72"> =</span><span style="color:#79C0FF"> html</span><span style="color:#E6EDF3">`</span><span style="color:#E6EDF3">&#x3C;</span><span style="color:#7EE787">div</span><span style="color:#E6EDF3">>Hello </span><span style="color:#FF7B72">${</span><span style="color:#E6EDF3">username</span><span style="color:#FF7B72">}</span><span style="color:#E6EDF3">&#x3C;/</span><span style="color:#7EE787">div</span><span style="color:#E6EDF3">></span><span style="color:#E6EDF3">`</span><span style="color:#E6EDF3">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E6EDF3">document.body.</span><span style="color:#D2A8FF">appendChild</span><span style="color:#E6EDF3">(view);</span></span></code></pre>
<p>Use it by placing JavaScript expressions inside <code>${...}</code>. The template is parsed once by <code>xhtm</code>, then dynamic values are supplied to the DOM adapter.</p>
<h3>Why <code>html</code> does not cause HTML injection</h3>
<p>A regular JavaScript template string produces one complete string before it is parsed as HTML. If that string is passed to <code>innerHTML</code>, an interpolated value can become part of the HTML markup:</p>
<pre class="shiki github-dark-default" style="background-color:#0d1117;color:#e6edf3" tabindex="0"><code><span class="line"><span style="color:#8B949E">// ❌ Regular template string</span></span>
<span class="line"><span style="color:#FF7B72">const</span><span style="color:#79C0FF"> username</span><span style="color:#FF7B72"> =</span><span style="color:#A5D6FF"> '&#x3C;img src=x onerror="alert(</span><span style="color:#FF7B72">\'</span><span style="color:#A5D6FF">XSS</span><span style="color:#FF7B72">\'</span><span style="color:#A5D6FF">)">'</span><span style="color:#E6EDF3">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF7B72">const</span><span style="color:#79C0FF"> view</span><span style="color:#FF7B72"> =</span><span style="color:#A5D6FF"> `&#x3C;div>Hello ${</span><span style="color:#E6EDF3">username</span><span style="color:#A5D6FF">}&#x3C;/div>`</span><span style="color:#E6EDF3">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E6EDF3">document.body.innerHTML </span><span style="color:#FF7B72">=</span><span style="color:#E6EDF3"> view;</span></span></code></pre>
<p>The resulting string is effectively:</p>
<pre class="shiki github-dark-default" style="background-color:#0d1117;color:#e6edf3" tabindex="0"><code><span class="line"><span style="color:#E6EDF3">&#x3C;</span><span style="color:#7EE787">div</span><span style="color:#E6EDF3">>Hello &#x3C;</span><span style="color:#7EE787">img</span><span style="color:#79C0FF"> src</span><span style="color:#E6EDF3">=</span><span style="color:#A5D6FF">x</span><span style="color:#79C0FF"> onerror</span><span style="color:#E6EDF3">=</span><span style="color:#A5D6FF">"</span><span style="color:#D2A8FF">alert</span><span style="color:#A5D6FF">('XSS')"</span><span style="color:#E6EDF3">>&#x3C;/</span><span style="color:#7EE787">div</span><span style="color:#E6EDF3">></span></span></code></pre>
<p>When <code>innerHTML</code> parses the string, the <code>&lt;img&gt;</code> becomes an actual HTML element. The dynamic value has crossed from <strong>data into HTML</strong>, which can lead to HTML injection or XSS.</p>
<p>With <code>html</code>, the static template and dynamic values are handled separately:</p>
<pre class="shiki github-dark-default" style="background-color:#0d1117;color:#e6edf3" tabindex="0"><code><span class="line"><span style="color:#8B949E">// ✅ html tagged template</span></span>
<span class="line"><span style="color:#FF7B72">const</span><span style="color:#79C0FF"> username</span><span style="color:#FF7B72"> =</span><span style="color:#A5D6FF"> '&#x3C;img src=x onerror="alert(</span><span style="color:#FF7B72">\'</span><span style="color:#A5D6FF">XSS</span><span style="color:#FF7B72">\'</span><span style="color:#A5D6FF">)">'</span><span style="color:#E6EDF3">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF7B72">const</span><span style="color:#79C0FF"> view</span><span style="color:#FF7B72"> =</span><span style="color:#79C0FF"> html</span><span style="color:#E6EDF3">`</span><span style="color:#E6EDF3">&#x3C;</span><span style="color:#7EE787">div</span><span style="color:#E6EDF3">>Hello </span><span style="color:#FF7B72">${</span><span style="color:#E6EDF3">username</span><span style="color:#FF7B72">}</span><span style="color:#E6EDF3">&#x3C;/</span><span style="color:#7EE787">div</span><span style="color:#E6EDF3">></span><span style="color:#E6EDF3">`</span><span style="color:#E6EDF3">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E6EDF3">document.body.</span><span style="color:#D2A8FF">appendChild</span><span style="color:#E6EDF3">(view);</span></span></code></pre>
<p>The important difference is that <code>username</code> is treated as a <strong>dynamic value</strong>, rather than being concatenated into the HTML source.</p>
<p>Conceptually, the value is inserted as text:</p>
<pre class="shiki github-dark-default" style="background-color:#0d1117;color:#e6edf3" tabindex="0"><code><span class="line"><span style="color:#E6EDF3">&#x3C;</span><span style="color:#7EE787">div</span><span style="color:#E6EDF3">></span></span>
<span class="line"><span style="color:#E6EDF3">  Hello </span><span style="color:#FF7B72">&#x26;lt;</span><span style="color:#E6EDF3">img src=x onerror="alert('XSS')"</span><span style="color:#FF7B72">&#x26;gt;</span></span>
<span class="line"><span style="color:#E6EDF3">&#x3C;/</span><span style="color:#7EE787">div</span><span style="color:#E6EDF3">></span></span></code></pre>
<p>The browser therefore displays the value as text instead of creating an <code>&lt;img&gt;</code> element.</p>
<blockquote>
<p><strong>In short:</strong> regular template strings combine data and HTML into one string. <code>html</code> keeps the HTML structure and dynamic values separate, allowing the DOM adapter to insert dynamic values safely.</p>
</blockquote>
<p>This safety comes from how <code>xhtm</code> and the DOM adapter handle dynamic values, not from JavaScript template literals themselves. An explicit API for inserting raw HTML would need to be treated with the same care as <code>innerHTML</code>.</p>
<h2>Styles, data, and ARIA attributes</h2>
<p>Use a CSS string or an object for <code>style</code>:</p>
<pre class="shiki github-dark-default" style="background-color:#0d1117;color:#e6edf3" tabindex="0"><code><span class="line"><span style="color:#FF7B72">const</span><span style="color:#79C0FF"> css</span><span style="color:#FF7B72"> =</span><span style="color:#E6EDF3"> { color: </span><span style="color:#A5D6FF">"rebeccapurple"</span><span style="color:#E6EDF3">, padding: </span><span style="color:#A5D6FF">"1rem"</span><span style="color:#E6EDF3"> };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF7B72">const</span><span style="color:#79C0FF"> view</span><span style="color:#FF7B72"> =</span><span style="color:#79C0FF"> html</span><span style="color:#E6EDF3">`</span></span>
<span class="line"><span style="color:#E6EDF3">  &#x3C;</span><span style="color:#7EE787">div</span><span style="color:#79C0FF"> style</span><span style="color:#E6EDF3">=</span><span style="color:#A5D6FF">${css}</span><span style="color:#E6EDF3">></span></span>
<span class="line"><span style="color:#E6EDF3">    Styled content</span></span>
<span class="line"><span style="color:#E6EDF3">  &#x3C;/</span><span style="color:#7EE787">div</span><span style="color:#E6EDF3">></span></span>
<span class="line"><span style="color:#E6EDF3">`</span><span style="color:#E6EDF3">;</span></span></code></pre>
<p>The <code>dataset</code> helper converts camelCase keys to <code>data-*</code> attributes:</p>
<pre class="shiki github-dark-default" style="background-color:#0d1117;color:#e6edf3" tabindex="0"><code><span class="line"><span style="color:#FF7B72">const</span><span style="color:#79C0FF"> dataset</span><span style="color:#FF7B72"> =</span><span style="color:#E6EDF3"> { userId: </span><span style="color:#79C0FF">42</span><span style="color:#E6EDF3">, source: </span><span style="color:#A5D6FF">"inbox"</span><span style="color:#E6EDF3"> };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF7B72">const</span><span style="color:#79C0FF"> view</span><span style="color:#FF7B72"> =</span><span style="color:#79C0FF"> html</span><span style="color:#E6EDF3">`</span></span>
<span class="line"><span style="color:#E6EDF3">  &#x3C;</span><span style="color:#7EE787">div</span><span style="color:#79C0FF"> dataset</span><span style="color:#E6EDF3">=</span><span style="color:#A5D6FF">${dataset}</span><span style="color:#E6EDF3">></span></span>
<span class="line"><span style="color:#E6EDF3">    Message</span></span>
<span class="line"><span style="color:#E6EDF3">  &#x3C;/</span><span style="color:#7EE787">div</span><span style="color:#E6EDF3">></span></span>
<span class="line"><span style="color:#E6EDF3">`</span><span style="color:#E6EDF3">;</span></span></code></pre>
<p><code>data-*</code> and <code>aria-*</code> attributes can also be written directly in markup:</p>
<pre class="shiki github-dark-default" style="background-color:#0d1117;color:#e6edf3" tabindex="0"><code><span class="line"><span style="color:#FF7B72">const</span><span style="color:#79C0FF"> view</span><span style="color:#FF7B72"> =</span><span style="color:#79C0FF"> html</span><span style="color:#E6EDF3">`</span></span>
<span class="line"><span style="color:#E6EDF3">  &#x3C;</span><span style="color:#7EE787">button</span><span style="color:#79C0FF"> data-action</span><span style="color:#E6EDF3">=</span><span style="color:#A5D6FF">"save"</span><span style="color:#79C0FF"> aria-label</span><span style="color:#E6EDF3">=</span><span style="color:#A5D6FF">"Save document"</span><span style="color:#E6EDF3">></span></span>
<span class="line"><span style="color:#E6EDF3">    Save</span></span>
<span class="line"><span style="color:#E6EDF3">  &#x3C;/</span><span style="color:#7EE787">button</span><span style="color:#E6EDF3">></span></span>
<span class="line"><span style="color:#E6EDF3">`</span><span style="color:#E6EDF3">;</span></span></code></pre>
<p><code>html</code> returns a <code>Node</code>, so its result can be passed directly to <code>append</code>, <code>appendChild</code>, or other DOM APIs.</p>
<pre class="shiki github-dark-default" style="background-color:#0d1117;color:#e6edf3" tabindex="0"><code><span class="line"><span style="color:#FF7B72">const</span><span style="color:#79C0FF"> content</span><span style="color:#FF7B72"> =</span><span style="color:#79C0FF"> html</span><span style="color:#E6EDF3">`</span></span>
<span class="line"><span style="color:#E6EDF3">  &#x3C;</span><span style="color:#7EE787">h1</span><span style="color:#E6EDF3">>Dashboard&#x3C;/</span><span style="color:#7EE787">h1</span><span style="color:#E6EDF3">></span></span>
<span class="line"><span style="color:#E6EDF3">  &#x3C;</span><span style="color:#7EE787">p</span><span style="color:#E6EDF3">>Ready.&#x3C;/</span><span style="color:#7EE787">p</span><span style="color:#E6EDF3">></span></span>
<span class="line"><span style="color:#E6EDF3">`</span><span style="color:#E6EDF3">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E6EDF3">document.</span><span style="color:#D2A8FF">querySelector</span><span style="color:#E6EDF3">(</span><span style="color:#A5D6FF">"main"</span><span style="color:#E6EDF3">)?.</span><span style="color:#D2A8FF">append</span><span style="color:#E6EDF3">(content);</span></span></code></pre>
<p>When a template contains multiple top-level nodes, the result is a <code>DocumentFragment</code>. A scalar result is normalized to a <code>Text</code> node.</p>
<h3>Dynamic attributes</h3>
<p>Expressions can provide attribute values:</p>
<pre class="shiki github-dark-default" style="background-color:#0d1117;color:#e6edf3" tabindex="0"><code><span class="line"><span style="color:#FF7B72">const</span><span style="color:#79C0FF"> link</span><span style="color:#FF7B72"> =</span><span style="color:#A5D6FF"> "https://example.com"</span><span style="color:#E6EDF3">;</span></span>
<span class="line"><span style="color:#FF7B72">const</span><span style="color:#79C0FF"> label</span><span style="color:#FF7B72"> =</span><span style="color:#A5D6FF"> "Open example"</span><span style="color:#E6EDF3">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF7B72">const</span><span style="color:#79C0FF"> view</span><span style="color:#FF7B72"> =</span><span style="color:#79C0FF"> html</span><span style="color:#E6EDF3">`</span></span>
<span class="line"><span style="color:#E6EDF3">  &#x3C;</span><span style="color:#7EE787">a</span><span style="color:#79C0FF"> href</span><span style="color:#E6EDF3">=</span><span style="color:#A5D6FF">${link}</span><span style="color:#79C0FF"> aria-label</span><span style="color:#E6EDF3">=</span><span style="color:#A5D6FF">${label}</span><span style="color:#E6EDF3">></span></span>
<span class="line"><span style="color:#FF7B72">    ${</span><span style="color:#E6EDF3">label</span><span style="color:#FF7B72">}</span></span>
<span class="line"><span style="color:#E6EDF3">  &#x3C;/</span><span style="color:#7EE787">a</span><span style="color:#E6EDF3">></span></span>
<span class="line"><span style="color:#E6EDF3">`</span><span style="color:#E6EDF3">;</span></span></code></pre>
<p>Boolean values are useful for HTML boolean attributes:</p>
<pre class="shiki github-dark-default" style="background-color:#0d1117;color:#e6edf3" tabindex="0"><code><span class="line"><span style="color:#FF7B72">const</span><span style="color:#79C0FF"> isDisabled</span><span style="color:#FF7B72"> =</span><span style="color:#79C0FF"> true</span><span style="color:#E6EDF3">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF7B72">const</span><span style="color:#79C0FF"> view</span><span style="color:#FF7B72"> =</span><span style="color:#79C0FF"> html</span><span style="color:#E6EDF3">`</span></span>
<span class="line"><span style="color:#E6EDF3">  &#x3C;</span><span style="color:#7EE787">button</span><span style="color:#79C0FF"> disabled</span><span style="color:#E6EDF3">=</span><span style="color:#A5D6FF">${isDisabled}</span><span style="color:#E6EDF3">></span></span>
<span class="line"><span style="color:#E6EDF3">    Save</span></span>
<span class="line"><span style="color:#E6EDF3">  &#x3C;/</span><span style="color:#7EE787">button</span><span style="color:#E6EDF3">></span></span>
<span class="line"><span style="color:#E6EDF3">`</span><span style="color:#E6EDF3">;</span></span></code></pre>
<p><code>className</code> and <code>htmlFor</code> are accepted by the DOM adapter and become the HTML attributes <code>class</code> and <code>for</code> when used through <code>h</code> or through template props.</p>
<h3>Dynamic children and arrays</h3>
<p>DOM nodes, nested arrays, strings, numbers, and components can be used as children. Arrays are flattened recursively.</p>
<pre class="shiki github-dark-default" style="background-color:#0d1117;color:#e6edf3" tabindex="0"><code><span class="line"><span style="color:#FF7B72">const</span><span style="color:#79C0FF"> items</span><span style="color:#FF7B72"> =</span><span style="color:#E6EDF3"> [</span><span style="color:#A5D6FF">"One"</span><span style="color:#E6EDF3">, </span><span style="color:#A5D6FF">"Two"</span><span style="color:#E6EDF3">, </span><span style="color:#A5D6FF">"Three"</span><span style="color:#E6EDF3">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF7B72">const</span><span style="color:#79C0FF"> list</span><span style="color:#FF7B72"> =</span><span style="color:#79C0FF"> html</span><span style="color:#E6EDF3">`</span></span>
<span class="line"><span style="color:#E6EDF3">  &#x3C;</span><span style="color:#7EE787">ul</span><span style="color:#E6EDF3">></span></span>
<span class="line"><span style="color:#FF7B72">    ${</span><span style="color:#E6EDF3">items.</span><span style="color:#D2A8FF">map</span><span style="color:#E6EDF3">((</span><span style="color:#FFA657">item</span><span style="color:#E6EDF3">) </span><span style="color:#FF7B72">=></span><span style="color:#79C0FF"> html</span><span style="color:#E6EDF3">`</span><span style="color:#E6EDF3">&#x3C;</span><span style="color:#7EE787">li</span><span style="color:#E6EDF3">></span><span style="color:#FF7B72">${</span><span style="color:#E6EDF3">item</span><span style="color:#FF7B72">}</span><span style="color:#E6EDF3">&#x3C;/</span><span style="color:#7EE787">li</span><span style="color:#E6EDF3">></span><span style="color:#E6EDF3">`</span><span style="color:#E6EDF3">)</span><span style="color:#FF7B72">}</span></span>
<span class="line"><span style="color:#E6EDF3">  &#x3C;/</span><span style="color:#7EE787">ul</span><span style="color:#E6EDF3">></span></span>
<span class="line"><span style="color:#E6EDF3">`</span><span style="color:#E6EDF3">;</span></span></code></pre>
<p>The result of each nested <code>html</code> call is a node and can be inserted into another template. A <code>DocumentFragment</code> is consumed when it is appended, following normal DOM behavior.</p>
<h2>Components</h2>
<p>A component is a function that receives props and optional <code>children</code>, then returns a DOM node, fragment, text, or an array of supported children.</p>
<pre class="shiki github-dark-default" style="background-color:#0d1117;color:#e6edf3" tabindex="0"><code><span class="line"><span style="color:#FF7B72">const</span><span style="color:#D2A8FF"> Card</span><span style="color:#FF7B72"> =</span><span style="color:#E6EDF3"> ({ </span><span style="color:#FFA657">title</span><span style="color:#E6EDF3">, </span><span style="color:#FFA657">children</span><span style="color:#E6EDF3"> }) </span><span style="color:#FF7B72">=></span></span>
<span class="line"><span style="color:#79C0FF">  html</span><span style="color:#E6EDF3">`</span></span>
<span class="line"><span style="color:#E6EDF3">    &#x3C;</span><span style="color:#7EE787">article</span><span style="color:#79C0FF"> class</span><span style="color:#E6EDF3">=</span><span style="color:#A5D6FF">"card"</span><span style="color:#E6EDF3">></span></span>
<span class="line"><span style="color:#E6EDF3">      &#x3C;</span><span style="color:#7EE787">h2</span><span style="color:#E6EDF3">></span><span style="color:#FF7B72">${</span><span style="color:#E6EDF3">title</span><span style="color:#FF7B72">}</span><span style="color:#E6EDF3">&#x3C;/</span><span style="color:#7EE787">h2</span><span style="color:#E6EDF3">></span></span>
<span class="line"><span style="color:#FF7B72">      ${</span><span style="color:#E6EDF3">children</span><span style="color:#FF7B72">}</span></span>
<span class="line"><span style="color:#E6EDF3">    &#x3C;/</span><span style="color:#7EE787">article</span><span style="color:#E6EDF3">></span></span>
<span class="line"><span style="color:#E6EDF3">  `</span><span style="color:#E6EDF3">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF7B72">const</span><span style="color:#79C0FF"> view</span><span style="color:#FF7B72"> =</span><span style="color:#79C0FF"> html</span><span style="color:#E6EDF3">`</span></span>
<span class="line"><span style="color:#E6EDF3">  &#x3C;</span><span style="color:#FF7B72">${</span><span style="color:#E6EDF3">Card</span><span style="color:#FF7B72">}</span><span style="color:#E6EDF3"> title="View"></span></span>
<span class="line"><span style="color:#E6EDF3">    &#x3C;</span><span style="color:#7EE787">p</span><span style="color:#E6EDF3">>This is the card content.&#x3C;/</span><span style="color:#7EE787">p</span><span style="color:#E6EDF3">></span></span>
<span class="line"><span style="color:#E6EDF3">  &#x3C;/</span><span style="color:#FF7B72">${</span><span style="color:#E6EDF3">Card</span><span style="color:#FF7B72">}</span><span style="color:#E6EDF3">></span></span>
<span class="line"><span style="color:#E6EDF3">`</span><span style="color:#E6EDF3">;</span></span></code></pre>
<h2>DOM properties, events, and refs</h2>
<p>The adapter uses attributes by default. Prefix a prop with <code>.</code> to assign the corresponding DOM property directly:</p>
<pre class="shiki github-dark-default" style="background-color:#0d1117;color:#e6edf3" tabindex="0"><code><span class="line"><span style="color:#FF7B72">const</span><span style="color:#79C0FF"> input</span><span style="color:#FF7B72"> =</span><span style="color:#79C0FF"> html</span><span style="color:#E6EDF3">`</span></span>
<span class="line"><span style="color:#E6EDF3">  &#x3C;</span><span style="color:#7EE787">input</span><span style="color:#79C0FF"> value</span><span style="color:#E6EDF3">=</span><span style="color:#A5D6FF">"initial"</span><span style="color:#79C0FF"> .value</span><span style="color:#E6EDF3">=</span><span style="color:#A5D6FF">${</span><span style="color:#FFA198;font-style:italic">"live</span><span style="color:#79C0FF"> value</span><span style="color:#FFA198;font-style:italic">"}</span><span style="color:#79C0FF"> .disabled</span><span style="color:#E6EDF3">=</span><span style="color:#A5D6FF">${false}</span><span style="color:#E6EDF3"> /></span></span>
<span class="line"><span style="color:#E6EDF3">`</span><span style="color:#E6EDF3">;</span></span></code></pre>
<p>This distinction matters for live form state: <code>value=&quot;...&quot;</code> sets an attribute, while <code>.value=${...}</code> sets the current <code>HTMLInputElement.value</code> property.</p>
<p>Event props beginning with <code>on</code> are registered with <code>addEventListener</code>. Common handlers are typed, including <code>onClick</code>, <code>onInput</code>, <code>onChange</code>, and <code>onKeydown</code>:</p>
<pre class="shiki github-dark-default" style="background-color:#0d1117;color:#e6edf3" tabindex="0"><code><span class="line"><span style="color:#FF7B72">const</span><span style="color:#79C0FF"> view</span><span style="color:#FF7B72"> =</span><span style="color:#79C0FF"> html</span><span style="color:#E6EDF3">`</span></span>
<span class="line"><span style="color:#E6EDF3">  &#x3C;</span><span style="color:#7EE787">button</span><span style="color:#79C0FF"> onClick</span><span style="color:#E6EDF3">=</span><span style="color:#A5D6FF">${(event:</span><span style="color:#79C0FF"> MouseEvent)</span><span style="color:#E6EDF3"> => {</span></span>
<span class="line"><span style="color:#E6EDF3">    console.log(event.currentTarget);</span></span>
<span class="line"><span style="color:#E6EDF3">  }}></span></span>
<span class="line"><span style="color:#E6EDF3">    Click</span></span>
<span class="line"><span style="color:#E6EDF3">  &#x3C;/</span><span style="color:#7EE787">button</span><span style="color:#E6EDF3">></span></span>
<span class="line"><span style="color:#E6EDF3">`</span><span style="color:#E6EDF3">;</span></span></code></pre>
<p>A ref can be a callback or a mutable object:</p>
<pre class="shiki github-dark-default" style="background-color:#0d1117;color:#e6edf3" tabindex="0"><code><span class="line"><span style="color:#FF7B72">const</span><span style="color:#79C0FF"> inputRef</span><span style="color:#FF7B72"> =</span><span style="color:#E6EDF3"> { current: </span><span style="color:#79C0FF">null</span><span style="color:#FF7B72"> as</span><span style="color:#FFA657"> HTMLInputElement</span><span style="color:#FF7B72"> |</span><span style="color:#79C0FF"> null</span><span style="color:#E6EDF3"> };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF7B72">const</span><span style="color:#79C0FF"> view</span><span style="color:#FF7B72"> =</span><span style="color:#79C0FF"> html</span><span style="color:#E6EDF3">`</span></span>
<span class="line"><span style="color:#E6EDF3">  &#x3C;</span><span style="color:#7EE787">input</span><span style="color:#79C0FF"> ref</span><span style="color:#E6EDF3">=</span><span style="color:#A5D6FF">${inputRef}</span><span style="color:#E6EDF3"> /></span></span>
<span class="line"><span style="color:#E6EDF3">`</span><span style="color:#E6EDF3">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E6EDF3">inputRef.current?.</span><span style="color:#D2A8FF">focus</span><span style="color:#E6EDF3">();</span></span></code></pre>
<p>Refs are assigned while the element is created. This library does not manage ref cleanup or component lifecycles.</p>
<h3>Self-closing and optional-close tags</h3>
<p>XHTM accepts useful HTML shorthand:</p>
<pre class="shiki github-dark-default" style="background-color:#0d1117;color:#e6edf3" tabindex="0"><code><span class="line"><span style="color:#FF7B72">const</span><span style="color:#79C0FF"> controls</span><span style="color:#FF7B72"> =</span><span style="color:#79C0FF"> html</span><span style="color:#E6EDF3">`</span></span>
<span class="line"><span style="color:#E6EDF3">  &#x3C;</span><span style="color:#7EE787">input</span><span style="color:#79C0FF"> type</span><span style="color:#E6EDF3">=</span><span style="color:#A5D6FF">"search"</span><span style="color:#E6EDF3"> /></span></span>
<span class="line"><span style="color:#E6EDF3">  &#x3C;</span><span style="color:#7EE787">br</span><span style="color:#E6EDF3"> /></span></span>
<span class="line"><span style="color:#E6EDF3">`</span><span style="color:#E6EDF3">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF7B72">const</span><span style="color:#79C0FF"> paragraphs</span><span style="color:#FF7B72"> =</span><span style="color:#79C0FF"> html</span><span style="color:#E6EDF3">`</span><span style="color:#E6EDF3">&#x3C;</span><span style="color:#7EE787">p</span><span style="color:#E6EDF3">>First&#x3C;</span><span style="color:#7EE787">p</span><span style="color:#E6EDF3">>Second</span><span style="color:#E6EDF3">`</span><span style="color:#E6EDF3">;</span></span></code></pre>
<p>It also supports normal HTML directives such as <code>&lt;!doctype html&gt;</code> where the target DOM accepts them.</p>
<p>For reusable logic that needs typed props, a function component is usually clearer than a dynamic tag name.</p>
<h2>The <code>h</code> DOM adapter</h2>
<p>The lower-level helper has the shape:</p>
<pre class="shiki github-dark-default" style="background-color:#0d1117;color:#e6edf3" tabindex="0"><code><span class="line"><span style="color:#D2A8FF">h</span><span style="color:#E6EDF3">(tag, props</span><span style="color:#FF7B72">?</span><span style="color:#E6EDF3">, </span><span style="color:#FF7B72">...</span><span style="color:#E6EDF3">children)</span></span></code></pre>
<p>Examples:</p>
<pre class="shiki github-dark-default" style="background-color:#0d1117;color:#e6edf3" tabindex="0"><code><span class="line"><span style="color:#FF7B72">const</span><span style="color:#79C0FF"> button</span><span style="color:#FF7B72"> =</span><span style="color:#D2A8FF"> h</span><span style="color:#E6EDF3">(</span><span style="color:#A5D6FF">"button"</span><span style="color:#E6EDF3">, {</span></span>
<span class="line"><span style="color:#E6EDF3">  class: </span><span style="color:#A5D6FF">"primary"</span><span style="color:#E6EDF3">,</span></span>
<span class="line"><span style="color:#E6EDF3">  disabled: </span><span style="color:#79C0FF">false</span><span style="color:#E6EDF3">,</span></span>
<span class="line"><span style="color:#D2A8FF">  onClick</span><span style="color:#E6EDF3">: () </span><span style="color:#FF7B72">=></span><span style="color:#E6EDF3"> console.</span><span style="color:#D2A8FF">log</span><span style="color:#E6EDF3">(</span><span style="color:#A5D6FF">"saved"</span><span style="color:#E6EDF3">),</span></span>
<span class="line"><span style="color:#E6EDF3">}, </span><span style="color:#A5D6FF">"Save"</span><span style="color:#E6EDF3">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF7B72">const</span><span style="color:#79C0FF"> fragment</span><span style="color:#FF7B72"> =</span><span style="color:#D2A8FF"> h</span><span style="color:#E6EDF3">(</span><span style="color:#79C0FF">null</span><span style="color:#E6EDF3">, </span><span style="color:#79C0FF">null</span><span style="color:#E6EDF3">,</span></span>
<span class="line"><span style="color:#D2A8FF">  h</span><span style="color:#E6EDF3">(</span><span style="color:#A5D6FF">"span"</span><span style="color:#E6EDF3">, </span><span style="color:#79C0FF">null</span><span style="color:#E6EDF3">, </span><span style="color:#A5D6FF">"First"</span><span style="color:#E6EDF3">),</span></span>
<span class="line"><span style="color:#D2A8FF">  h</span><span style="color:#E6EDF3">(</span><span style="color:#A5D6FF">"span"</span><span style="color:#E6EDF3">, </span><span style="color:#79C0FF">null</span><span style="color:#E6EDF3">, </span><span style="color:#A5D6FF">"Second"</span><span style="color:#E6EDF3">),</span></span>
<span class="line"><span style="color:#E6EDF3">);</span></span></code></pre>
<p>Behavior includes:</p>
<ul>
<li>A string tag creates an HTML element, or a recognized SVG element in the SVG namespace.</li>
<li>A function tag calls the function with copied props and normalized <code>children</code>.</li>
<li>A missing tag (<code>null</code> or <code>undefined</code>) creates a <code>DocumentFragment</code>.</li>
<li><code>Node</code> children are appended directly, including nodes from another DOM realm.</li>
<li>Strings and numbers become text nodes.</li>
<li><code>null</code>, <code>undefined</code>, and booleans are skipped as children.</li>
<li><code>children</code> in the props object is ignored when explicit children are supplied to <code>h</code>.</li>
</ul>
<h2>Installation</h2>
<pre class="shiki github-dark-default" style="background-color:#0d1117;color:#e6edf3" tabindex="0"><code><span class="line"><span style="color:#FFA657">npm</span><span style="color:#A5D6FF"> install</span><span style="color:#A5D6FF"> xhtm-dom</span></span></code></pre>
<p>The package exposes compiled files from <code>dist</code>:</p>
<ul>
<li><code>import</code>: ES module</li>
<li><code>require</code>: CommonJS</li>
<li><code>default</code>/browser: UMD build</li>
<li><code>types</code>: generated TypeScript declarations</li>
</ul>
<p>The library expects a browser-like DOM. It is suitable for browser scripts, userscripts, and applications that already have <code>document</code> available.</p>
<h2>What this library does not do</h2>
<p><code>xhtm-dom</code> is a DOM construction utility, not a full UI framework:</p>
<ul>
<li>It does not diff or update an existing tree.</li>
<li>It does not provide state management, effects, routing, or lifecycle hooks.</li>
<li>Calling <code>html</code> creates new DOM nodes; it does not automatically reconcile prior output.</li>
<li>Event listeners are attached directly to the created elements.</li>
<li>Server-side rendering requires a DOM implementation such as <code>jsdom</code> and an appropriate environment setup.</li>
</ul>
<p>For updates, keep references to created nodes or replace/modify them with standard DOM APIs.</p>
<h2>Userscript build</h2>
<p>The Vite userscript entry point assigns the function to <code>globalThis.html</code>:</p>
<pre class="shiki github-dark-default" style="background-color:#0d1117;color:#e6edf3" tabindex="0"><code><span class="line"><span style="color:#FF7B72">const</span><span style="color:#79C0FF"> view</span><span style="color:#FF7B72"> =</span><span style="color:#79C0FF"> html</span><span style="color:#E6EDF3">`</span><span style="color:#E6EDF3">&#x3C;</span><span style="color:#7EE787">div</span><span style="color:#79C0FF"> class</span><span style="color:#E6EDF3">=</span><span style="color:#A5D6FF">"notice"</span><span style="color:#E6EDF3">>Loaded&#x3C;/</span><span style="color:#7EE787">div</span><span style="color:#E6EDF3">></span><span style="color:#E6EDF3">`</span><span style="color:#E6EDF3">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E6EDF3">document.body.</span><span style="color:#D2A8FF">append</span><span style="color:#E6EDF3">(view);</span></span></code></pre>
<p>The generated userscript bundles <code>xhtm</code> and can be used in a browser userscript manager. The current Vite match configuration targets all HTTP and HTTPS pages; adjust the userscript metadata before publishing a narrower script.</p>
<h2>Development</h2>
<pre class="shiki github-dark-default" style="background-color:#0d1117;color:#e6edf3" tabindex="0"><code><span class="line"><span style="color:#FFA657">npm</span><span style="color:#A5D6FF"> install</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFA657">npm</span><span style="color:#A5D6FF"> test</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFA657">npm</span><span style="color:#A5D6FF"> run</span><span style="color:#A5D6FF"> build</span></span></code></pre>
<p>Additional package commands:</p>
<pre class="shiki github-dark-default" style="background-color:#0d1117;color:#e6edf3" tabindex="0"><code><span class="line"><span style="color:#FFA657">npm</span><span style="color:#A5D6FF"> run</span><span style="color:#A5D6FF"> build:types</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFA657">npm</span><span style="color:#A5D6FF"> run</span><span style="color:#A5D6FF"> build:lib</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFA657">npm</span><span style="color:#A5D6FF"> run</span><span style="color:#A5D6FF"> build:package</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFA657">npm</span><span style="color:#A5D6FF"> run</span><span style="color:#A5D6FF"> dev</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFA657">npm</span><span style="color:#A5D6FF"> run</span><span style="color:#A5D6FF"> build:docs</span></span></code></pre>
<p><code>npm run build:docs</code> reads this README and writes a filled GitHub copy to <code>README.md</code> plus a fully rendered HTML copy to <code>docs/README.greasyfork.md</code>. It expands package metadata, converts Markdown to HTML, and renders fenced code blocks with Shiki. Run it again whenever the source README changes before publishing.</p>
<p>This source file uses Handlebars&#39; Mustache-style templates. Package metadata is available under <code>package</code>, so <code>xhtm-dom</code> and <code>0.0.0</code> are replaced from <code>package.json</code> during the build.</p>
<h2>License</h2>
<p>This project is licensed under the MIT License. The userscript build includes <code>xhtm</code>, which is also distributed under the MIT License.</p>
