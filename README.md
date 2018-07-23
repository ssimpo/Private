# Private
ES6 classes provide no native way to implement private methods and classes.  This module provides a simple mechanism for achieving this. 

## Install

```bash
npm install --save
```

with [yarn](https://yarnpkg.com/lang/en/):

```bash
yarn add
```

with [pnpm](https://www.npmjs.com/package/pnpm) :

```bash
pnpm install --save
```

## Example

```javascript
const Private = new WeakMap();
const $private = new Private();


class My_Class() {
	doSomething() {
		// Get private value linked to this class instance.
		const value = $private.get(this, 'value'); 
		// ... do something with value
	}
}
```

## API
Private exports an extension to the native WeakMap class (this ensures data is garbage-collected after class instance goes out of scope).

### Static properties

**NB:** Changing these static properties will change the default on future created Private instances, so you might change behaviour in someone else's modules - beware! Better to change the instance version of this property.

#### Constructor

The default Map object used to store values against a given object / class instance.  Normally, this would not be changed but you might wish to supply a special extended Map or other class. The class should expose the methods normally expected on a Map() object.

#### constructorParams

The default parameters to use when creating a new Map object for your private values.  This defaults to an empty an array and should remain as-such unless you have a special reason for changing it.<br />
### Instance properties

#### Constructor

Map constructor used to create your internal values map.  Defaults to the static Constructor property of Private and is normally just Map.

#### constructorParams

The default parameters to use when creating a new Map object for your private values.  This defaults to an empty an array and should remain as-such unless you have a special reason for changing it.<br />

### Instance methods
 
#### clear()

Clear all private values set against a given reference object or class instance.<br /><br />

| Parameter  | Type | Default  | Description |
| ------------- | ------------- | ------------- | ------------- |
| reference  | Object  | - | Should be your class instance. This could be any JavaScript object that you wish to set private data on. Will throw if not supplied.|
| **returns**  | undefined  | - |   |

#### delete()

Delete a private value set against a given class instance.<br /><br />

| Parameter  | Type | Default  | Description |
| ------------- | ------------- | ------------- | ------------- |
| reference  | Object  | - | Should be your class instance. This could be any JavaScript object that you wish to set private data on. |
| key  | String \| Number \| String[] \| Number[]  | undefined | The value you wish to delete.  If a key is not supplied the entire Map relating to _reference_ is deleted. |
| **returns**  | Boolean \| *  | - | **The return value of delete() method on your private map. Will normally be a boolean, true when the value existed and was deleted and false if it did not exist.**  |

#### entries()

Return an iterator for all the entries set against a given reference.<br /><br />

| Parameter  | Type | Default  | Description |
| ------------- | ------------- | ------------- | ------------- |
| reference  | Object  | - | Should be your class instance. This could be any JavaScript object that you wish to set private data on. Will throw if not supplied. |
| **returns**  | iterator \| * | - | **The return value of entries() method on your private map. Will normally a new Map iterator object.**  |

#### get()

Get a private value set against a given class instance.<br /><br />

| Parameter  | Type | Default  | Description |
| ------------- | ------------- | ------------- | ------------- |
| reference  | Object  | - | Should be your class instance. This could be any JavaScript object that you wish to set private data on. |
| key  | String \| Number \| String[] \| Number[]  | undefined | The value you wish to get.  If a key is not supplied the entire Map relating to _reference_ is returned. If an array is given, get all the keys in the array and return an array. |
| default  | *  | undefined | The default value to return if value to set. Will set the value to this default if not found. Method will internally do an arguments count to see if this parameter is set, hence setting this value to _undefined_, explicitly sets the value to undefined (where-as not supplying a default does not). If an array _key_ was given, an array is expected here if it is supplied.|
| **returns**  | *  | **undefined** | **The value set for given _key_ against given _reference_.**  |

**NB:** You can also get private static values by supplying the constructor as the _reference_ object. Eg.

```javascript
$private.get(My_Class, 'value');
```

**Memory Leaks Warning:** Be careful when not supplying a key as this will return the Map object containing all private values.  If you hold onto this object it cannot be garbage collected when your class instance or object go out of scope.

### has()

Test for the existence of a given value set against the reference object.<br /><br />

| Parameter  | Type | Default  | Description |
| ------------- | ------------- | ------------- | ------------- |
| reference  | Object  | - | Should be your class instance. This could be any JavaScript object that you wish to set private data on. |
| key  | string  | undefined | The key you wish to test, if not set then then test for just the _reference_ object. |
| **returns**  | Boolean  | **false** | **The a value set for given _key_ against given _reference_.** |

### invoke()

Invoke a given private method, binding to the supplied reference object.<br /><br />

| Parameter  | Type | Default  | Description |
| ------------- | ------------- | ------------- | ------------- |
| reference  | Object  | - | Should be your class instance. This could be any JavaScript object that you wish to set private data on. |
| methodName  | string  | undefined | The method, you wish to invoke. |
| ...params  | *  | undefined | The parameters to use. |
| **returns**  | Boolean  | **false** | **The result of invoking the given method with supplied parameters.** |

**Example:**
```javascript
return $private(this, 'somePrivateMethod', value1, value2);
```

<br />

#### keys()

Return an iterator for all the keys set against a given reference.<br /><br />

| Parameter  | Type | Default  | Description |
| ------------- | ------------- | ------------- | ------------- |
| reference  | Object  | - | Should be your class instance. This could be any JavaScript object that you wish to set private data on. Will throw if not supplied. |
| **returns**  | iterator \| * | - | **The return value of keys() method on your private map. Will normally a new Map iterator object.**  |

**Example:**
```javascript
[...$private.keys(this)].forEach(key=>{
	// Do something
});
```
<br />

#### link()

Link two objects together so they share all their private values. This cannot be reversed.<br /><br />

| Parameter  | Type | Default  | Description |
| ------------- | ------------- | ------------- | ------------- |
| reference1  | Object  | - | The first object to link to. |
| reference2  | Object  | - | The second object to link to. |

**NB:** Will internally use the entries() method of your Map object to combine these.

#### set()

Set a private value against a given reference.<br /><br />

| Parameter  | Type | Default  | Description |
| ------------- | ------------- | ------------- | ------------- |
| reference  | Object  | - | Should be your class instance. This could be any JavaScript object that you wish to set private data on. |
| key  | string  | undefined | The key you wish to set. Will throw if not given.|
| value  | string  | undefined | The value to set it to. |
| **returns**  | Map \| *  | **Map** | **The return value of set() method on your private map. Will normally be the Map object if that is what you are using.** |

#### toObject()

Get an object containing all the key/values.  This is useful ass you can use destructing to get values, eg:

```javascript
const {value1, value2} = $private.toObject(this);
```
<br />

| Parameter  | Type | Default  | Description |
| ------------- | ------------- | ------------- | ------------- |
| reference  | Object  | - | Should be your class instance. This could be any JavaScript object that you wish to set private data on. |
| **returns** | Object | - | An object containing your key/value pairs. |

**NB:** Will internally use the Keys() method of your Map object.


#### values()

Return an iterator for all the values set against a given reference.<br /><br />

| Parameter  | Type | Default  | Description |
| ------------- | ------------- | ------------- | ------------- |
| reference  | Object  | - | Should be your class instance. This could be any JavaScript object that you wish to set private data on. Will throw if not supplied. |
| **returns**  | iterator \| * | - | **The return value of values() method on your private map. Will normally a new Map iterator object.**  |
