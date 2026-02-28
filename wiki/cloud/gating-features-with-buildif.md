# Gating Features with BuildIf

BuildIf is a simple gating mechanism for both server and client side javascript code. It allows you to develop and submit features that are compiled out of the final product. The typical development idiom is:
```json
{ BuildIf.MY_AWESOME_FEATURE && <React.Fragment>
 <MyAwseomeDomElement />
 <MyOtherAwesomeDomElement />
</React.Fragment> }
```

Everything in the block is then scoped to development builds if:
```json
"MY_AWESOME_FEATURE": "isExperimental",
```

in buildif.ts. To have your feature included in the production build, replace `"isExperimental"` with `true`.

# Normal Usage

## Defining a New Feature

BuildIf features need unique names, since all code with the same name is gated together. First think of a descriptive name for what you are doing so that anyone on the team can understand exactly what's being gated, for example Camera Quick Start. Then to make things really specific (and to help us track down stale unlaunched features later) find today's date. Then make a feature name like `CAMERA_QUICK_START_20181206`.

Add your feature name to buildif.ts with the appropriate visibility, typically "isExperimental". As of Jan 2023, the valid values for buildif features are

 * true: this feature is included in all builds.

 * false: this feature is included in no builds.

 * 'isTest': True when running client-side tests.

 * 'isQa': True if in the QA data realm. Env params are preferred for server code.

 * 'isLocal': True if running locally.

 * 'isExperimental': Features that should only be visible for internal QA builds.

 * 'isMature': Features that aren't ready to launch, but ready for QA or prod testing.

Example:
```json
"CAMERA_QUICK_START_20181206": "isExperimental",
```

If your feature is in a really rough state and you think it would not be suitable for other developers even in development mode, you can set its value to `false` and then override its value locally for your own development.

## Develop your new feature

Idiomatic usage for buildif is:
```json
{BuildIf.CAMERA_QUICK_START_20181206 && <React.Fragment>
 <MyAwseomeDomElement />
 <MyOtherAwesomeDomElement />
</React.Fragment>}
```

This causes everything after your flag to be gated based on the flag. Adding a `<React.Fragment>` ensures that everything between the braces is gated by the flag.

Technically if you only have a single dom element or statement, `<React.Fragment>` is not needed, but it is good practice to always add it. First of all, it is less error prone and easier to be consistent. It leads to more success for people copying and pasting examples. And later if another developer adds another dom element to your block, they won't need to remember to go back and add the `<React.Fragment>`, or worse accidentally launch a component that they thought was gated but wasn't.

## Launch your feature

To launch your feature, replace `"isExperimental"` in buildif.ts to `true` for your feature.
```json
"CAMERA_QUICK_START_20181206": true,
```

Since BuildIf is a build-time construct, changes will take effect the next time `npm run dev` is used to produce a binary and that binary is pushed.

## Roll back your feature

To roll back your feature, change your feature's value back to "`isExperimental`" and push a new build.
```json
"CAMERA_QUICK_START_20181206": "isExperimental",
```

## Clean up your feature

After your feature is launched, you probably want to give it a little time to make sure there is no emergency reason to roll back. When you're sure your feature is here to stay, it's a good idea to clean up the gating logic. This should be easy to do by code-searching for your very-descriptive-feature-name which is hopefully unique in the codebase.

Find all instances of your feature, and remove the lines in bold:
```json
{BuildIf.CAMERA_QUICK_START_20181206 && <React.Fragment>
  <MyAwseomeDomElement />
  <MyOtherAwesomeDomElement />
</React.Fragment>}
```

You're left with:
```jsx
<MyAwseomeDomElement />
<MyOtherAwesomeDomElement />
```

Congratulations, your feature is launched and cleaned up!

## _**Special Features**_

Sometimes it's useful to have code that's only intended for development builds, and is not expected to ever launch or be cleaned up.  In cases like this you can use the special feature flags:
```
LOCAL_DEV: 'isLocalDev',
ALL_QA: 'isQa',
EXPERIMENTAL: 'isExperimental',
LOCAL: 'isLocal',
DISABLED: false,
FULL_ROLLOUT: true,
UI_TEST: 'isTest',
UNIT_TEST: false,
```

Example:
```json
{ BuildIf.ALL_QA && <React.Fragment>
    <Menu.Item as={Link} to='/' />[DEV_ONLY] First Visit</Menu.Item>
    <Menu.Item as={Link} to='/' />[DEV_ONLY] ToS</Menu.Item>
</React.Fragment> }
```

# **How it works**

BuildIf values are build-time rewrites that evaluate to booleans (true or false) at build time. The minifier then detects these as unchangeable constants and removes the relevant code.

## _**How it really works**_

The build process performs a search-and-replace for all defined BuildIf values and replaces them with the literal strings 'true' and 'false' in _gulpfile.ts_:

## _**Gotchas**_

Based on the above, there are a couple gotchas:

### **BuildIf doesn't really always strip code.**

Code stripping is achieved by the minifier. If the minifier does not run, the resulting fused code will look like
```json
{ false && <React.Fragment>
    <Menu.Item as={Link} to='/' />[DEV_ONLY] First Visit</Menu.Item>
    <Menu.Item as={Link} to='/' />[DEV_ONLY] ToS</Menu.Item>
</React.Fragment> }
```

The resulting code fragment will still be disabled, but it is still technically included in the build.

### **BuildIf will crash your build if you use an undefined feature.**

A syntax error will be added to the code to cause the build to fail.
```json
{ # BuildIf Error: Missing/invalid flag # .BAD_FEATURE_VALUE && <React.Fragment>
    <Menu.Item as={Link} to='/' />[DEV_ONLY] First Visit</Menu.Item>
    <Menu.Item as={Link} to='/' />[DEV_ONLY] ToS</Menu.Item>
</React.Fragment> }
```

We made a deliberate choice to do this as opposed to having the replace module replace all remaining buildif references with 'undefined', because the latter would appear to work correctly in some cases and might be hard to track down or lead to subtle bugs. Crashing your app is a much more obvious development time error than silent failure.
