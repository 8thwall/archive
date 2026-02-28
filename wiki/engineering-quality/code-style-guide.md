# Code Style Guide

*A set of guidelines aimed at making development faster and easier.*

## TL;DR

Use this guide to help reduce the mental overhead of either reading someone else's code or writing your own. This is not intended to prescribe the right way to do everything, but is intended to communicate the general spirit of good coding habits that we would like to promote.

## General

These guidelines are language-agnostic and aimed to provide code-consistency across codebases and programming languages. This is in contrast to language-specific guides, where style rules need to be learned individually and deviate across languages. We rely on auto-formatters to format code, which removes much of the thinking about style, and can focus the remainder on substance.

## Comparison to the Google Style Guide

[Google style](https://google.github.io/styleguide/) consists of 15 style guides that deviate significantly across languages. Some examples of these differences include:

 * Some languages have variables and methods in `camelCase`, whereas others `use_underscores`
 * Sometimes constants are `IN_ALL_CAPS`, sometimes `kPrefixedAndCamelCased`
 * Some languages have 80 character line widths, some have 100 chars
 * Indenting is sometimes 2-spaces, sometimes 4 spaces. Sometimes it is both.
 * Some filenames `look-like-this.cc`, some `look_like_this.cc`, some `LookLikeThis.java`

In addition, there are some opinions that don't align with more modern practices:

 * Javascript/Typescript does not use automatic-semicolon-insertion (ASI) syntax, instead requiring semi-colons on all lines for a language that doesn't need it.
 * Namespace naming conventions cause long symbol names that cause too many line wraps.
 * C++ language syntax is limited to C++17, whereas we are using C++20.

## Comparison to the KJ Style Guide

This guide shares many similarities to the [KJ Style](https://github.com/capnproto/capnproto/blob/master/style-guide.md) guide in terms of keeping proscription to a minimum and focusing on ways to improve code, clarity and avoiding anti-patterns. The KJ Style guide is an excellent read for those familiar with Google Style -- it was written by Kenton Varda, the original author of Google's Protobuffers.

## Naming

 * **Type/Class names:** `TitleCase`
 * **Variable, member, function, and method names:** `camelCase`
 * **Constant and enumerant names:** `CAPITAL_WITH_UNDERSCORES`
 * **Macro names:** `CAPITAL_WITH_UNDERSCORES`, with an appropriate project-specific prefix like `NIA_` or `C8_`.
 * **Namespaces:** `oneword` and short. Namespaces should be kept short, because you'll have to type them a lot. Two-char or three-char namespaces encouraged. Use a nested namespace called `_` to contain package-private declarations.
 * **Prefix non-namespaced global symbols** with a one-word `prefix_` that matches the namespace rules. Useful for public 'C' interfaces. Examples:
   * `c8_myPublicMethod`, `C8_MY_PUBLIC_CONSTANT`, `C8_MY_MACRO`
 * **Files:** Use lowercase and hyphens `-`, avoid underscores.
   * C++: `module-name.cpp`, `module-name.h`, `module-name-test.cpp`
   * C: `module-name.c`, `module-name.h`, `module-name-test.c`
   * Java: `class-name.java`, `class-name-test.java`
   * ObjC: `module-name.m`, `module-name.h`, `module-name-test.m`
   * ObjC++: `module-name.mm`, `module-name.h`, `module-name-test.mm`
   * Python: `module-name.py`, `module-name-test.py`
   * Javascript: `module-name.js`, `module-name-test.js`
   * Typescript: `module-name.ts`, `module-name-test.ts`
 * **Directories:** Use lowercase and keep to `oneword` (no hyphens, no underscores).

## Formatting

 * Use auto-formatters to format code:
   * Use `clang-format` for C, C++, Java, C#, ObjC, ObjC++, Protobuf
     * Relevant rules specified in top-level `.clang-format` file in the repo
     * You can invoke it on a file on the command line with:
       ```bash
       clang-format -i reality/quality/codelab/pixels/yuv.cc
       ```
       or you can use a plugin for your favorite editor.
     * **Exceptions:** When clang-format would harm the readability of a specific block of code, you can use `// clang-format off` and `// clang-format on` to exempt only that block of code.
   * Use `eslint` for JavaScript and TypeScript
     * Relevant rules specified in top-level `.eslint` file in the repo
   * Use `buildifier` for `BUILD`, `BUILD.bazel`, `WORKSPACE`, and Starlark `*.bzl`
     * Follows Bazel's deterministic style for all of these files

### What the auto-formatters are doing

Here are some of the more important details in the `.clang-format`:

 * Start with Google style
 * Break lines at 100 characters
 * Always use 2 spaces for each level of indentation (no tabs, no 4-space indent on line continuation)
 * Align trailing comments

## Additional Guidelines

### No 'util' directories

Pick a more descriptive name for the directory that would discourage someone else from putting other irrelevant files into it. If you aren't sure what an irrelevant file would look like, use this to help motivate the right kind of name or whether this directory needs to exist in the first place.

### No commented-out code

Merging in commented-out code is a bad practice and should be avoided. It adds clutter to your files, making the code harder to read and understand. If you would like to keep a particular section of your code around in the codebase, consider wrapping it in a flag.

---

# Language-specific Guidelines

## Javascript

### Use `var` never, `let` rarely

`var` has been superseded by `let` and `const` in modern javascript. `const` is preferable, unless the value of a variable or which object it points to will change.

### Prefer lambdas (arrow functions) to functions

Whenever possible, prefer lambdas to functions, and prefer lambdas that return an object to calling `new function`. Functions in javascript have an implicit `this` object that enables implicit APIs, both internally (between methods of an object) and externally. Implicit APIs make code paths harder to discover, trace, search, and debug. Lambda functions require all shared internal state to be explicitly declared, and they provide a clean separation where internal data must be manipulated through explicit external APIs.

**Exception:** Some external frameworks require implicit data passing through `this` (e.g. aframe). Use a function instead of a lambda only if you will be referring to data passed in through `this`.

### Use single quotes in javascript, double quotes in HTML

Javascript strings often encode fragments of HTML. Because of this, it is often useful to have different string markers in javascript and HTML so that embedded quotes don't need to be escaped. For stylistic consistency, we use single quotes in javascript code, and double quotes in HTML.

### Rarely use `for`

Javascript has excellent list processing methods, like `forEach`, `map`, `filter`, `every`, `includes`, `find` and more. These methods often express your intent more cleanly and lead to less error-prone code. They also provide a loop iteration variable, which can get around the most common cases where you might think you'd really need a for loop.

**Exception:** Use a `for` loop if (a) it is demonstrably faster AND is performance critical (e.g. would lead to dropped animation frames otherwise), or (b) if no list processing method would lead to comprehensible code.

### Rarely use semicolons

Javascript uses ASI ("automatic semicolon insertion") to remove the need for semicolons in all non-ambiguous locations. If you find yourself writing ASI-ambiguous code, consider rewriting your code to be unambiguous.

### Rarely use setters and getters

Setters and getters allow you to write code that violates the caller's common expectations for how code will behave. (a) Accessing a variable can mutate state, (b) an apparently cheap operation can be expensive, and (c) non-trivial logic can be hidden, making the source of bugs harder to find. The mental model of member access should be a fast operation that returns a primitive or a pointer and has no logic or side effects.

**Exception 1:** Use of getters is encouraged for providing API deprecation warnings. The getter should print a console warning as a side effect (only on the first call), and it should return a pointer or primitive without further processing.

**Exception 2:** Use of setters is encouraged to enforce object immutability by throwing an error.

### Export a single object from a module, import its members

Place a single export statement in each module. Export an object with only members or methods you expect to be used externally. When importing a module, explicitly import only objects that are used in your js file. By collecting all exports in a single object, it is easier to identify and reason about a module's external API (you don't have to comb the file for exports). By explicitly importing members, it's easy for code search and other static analysis tools to identify which exports are actually used and where.

### Avoid side-effects at the top-level of modules

Users should be able to reason about import statements as no-ops, and startup order can be volatile depending on who imports what. Avoid code that affects global state (mutating `window`, registering aframe components, etc.) on import. Instead, export functions that explicitly mutate this state and call them when needed.

**Exception 1:** CSS modules are designed to affect global state by importing them.

**Exception 2:** The top level entrypoint for a web app needs to affect global state. That should be all that it does, delegating out any logic to libraries.

### Avoid external libraries for convenience functionality

If an external library provides a convenient function, consider implementing the function yourself instead of adding a new library dependency. Each npm dependency adds code bloat as well as risks for upgrading. We have had difficulty upgrading versions of node due to external dependency incompatibilities, as well as issues upgrading dependencies when they introduce breaking changes. Sometimes libraries that are well supported for many years stop being supported and immediately become an unanticipated large maintenance burden. The bar for adding a new npm dependency should be exceptionally high. For example, bringing in a framework, or a significant piece of hard-to-build functionality may be acceptable. Even in these cases, consider whether copying the source code of the library (assuming the license permits this) is preferable to bringing in the external library directly. It can be easier to enforce stability, fix bugs, or customize behavior on a source code copy than by patching a repo itself.

### Never embed code in `<script>` tags

Never embed things like `<script>/* some code */</script>` in HTML DOM, head, body or otherwise. Always embed code in javascript source code files. Code in `<script>` tags follows different scoping rules than in js source files, which can cause code to be unportable, or buggy in ways that are difficult to notice. It is not checked by the compiler (especially when using typescript). It cannot be minified, obfuscated, optimized or transpiled meaning that it is vulnerable to completely breaking a site on older browsers instead of gracefully degrading. It breaks the mental model that there is a single entry point and flow of execution for an application.

## C++

### Always use clang-format

### Always use `C8Log` instead of `printf` and `std::cout`

When printing output to the console, use `C8Log` instead of `printf` or `std::cout`. `C8Log` provides two main advantages: it prints uniformly across platforms (particularly on Android, which swallows stdout), and it gives us an easy way to disable console logging in production builds, which improves efficiency and helps protect IP.

### Rarely use `using namespace`

Explicitly refer to external libraries by their namespace, e.g. `std::array` or `ceres::AngleAxisRotatePoint`. In addition to avoiding ambiguities, this makes it easier throughout the codebase to identify use of external libraries by making it explicit. Use of `using namespace` in header files is considered harmful and should never be used, because it leaks those declarations to any dependencies.

**Exception:** In main C++ binary files where code is not included and does not need or have a namespace, use `using namespace c8` to get easier access to first-party libraries.

### Declare helper functions in a `.cc` file in an anonymous namespace

Focus header files on interfaces that are designed to be called externally. For implementation functionality, keep declarations inside of `.cc` files in an anonymous namespace so they are isolated from other compilation units.

**Exception:** When it would significantly reduce the complexity of code to have private member methods, they may be used.

### Consider static methods, or non-class methods

When in doubt, prefer static or non-class methods to member methods. Member methods have implicit mechanisms for inspecting and manipulating state, which makes their contracts less apparent.

### Prefer `std::map` (TreeMap) to `std::hash_map` (HashMap)

Use `std::map`, not `std::hash_map`. In practice `operator<` is often faster to compute than `std::hash<T>`, and for typical sized maps, the `log(n)` factor is not meaningful, so TreeMap is faster. It's also hard to implement good hash functions for arbitrary objects. Between these factors, TreeMap is a good default as a rule of thumb. It's usually just distracting to have to think about what kind of map is being used and why. Just use TreeMap.

**Exception:** If there is a performance-critical section of code and profiling shows HashMap is demonstrably more performant, HashMap is OK. Only use HashMap in performance-critical code for very large maps where you have done profiling and demonstrated that hashmap gives meaningful wins.
