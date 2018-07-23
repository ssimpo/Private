'use strict';


function makeArray(ary) {
	if ((ary === undefined) || (ary === null) || Number.isNaN(ary)) return [];
	if (Array.isArray(ary)) return ary;
	if (ary instanceof Set) return [...ary.values()];
	return [ary];
}

class Private extends WeakMap {
	constructor(...params) {
		super(...params);
		this.Constructor = Private.Constructor;
		this.constructorParams = Private.constructorParams;
	}

	/**
	 * Clear all private values set against a given reference object or class instance.
	 *
	 * @public
	 * @param {Object} ref		The reference object / class instance.
	 * @returns undefined
	 */
	clear(ref) {
		if (!ref) throw new RangeError('A reference object must be supplied to the clear() method.');
		if (super.has(ref)) super.get(ref).clear();
	}

	/**
	 * Delete a private value set against a given class instance.
	 *
	 * @public
	 * @param {Object} ref				The reference object / class instance.
	 * @param {string|number} [key]		The key to delete.
	 * @returns undefined				The return value of delete() method on your private map. Will normally be a
	 * 									boolean, true when the value existed and was deleted and false if it
	 * 									did not exist.
	 */
	delete(ref, key) {
		if (!key && super.has(ref)) return super.delete(ref);
		if (super.has(ref) && super.get(ref).has(ref)) return super.get(ref).delete(key);
		return false;
	}

	/**
	 * Return an iterator for all the entries set against a given reference.
	 *
	 * @public
	 * @param {Object} ref		The reference object / class instance.
	 * @returns iterator		The return value of entries() method on your private map. Will normally a new Map
	 * 							iterator object.
	 */
	entries(ref) {
		if (!ref) throw new RangeError('A reference object must be supplied to the entries() method.');
		return this.get(ref).values();
	}

	/**
	 * Get a private value set against a given class instance.
	 *
	 * @public
	 * @param {Object} ref								The reference object / class instance.
	 * @param {string|string[]|number|number[]}	[key]	The value you wish to get.  If a key is not supplied the entire
	 * 													Map relating to _reference_ is returned. If an array is given,
	 * 													get all the keys in the array and return an array.
	 * @param {mixed} [default]							The default value to return if value to set. Will set the value
	 * 													to this default if not found. Method will internally do an
	 * 													arguments count to see if this parameter is set, hence setting
	 * 													this value to _undefined_, explicitly sets the value to
	 * 													undefined (where-as not supplying a default does not). If an
	 * 													array _key_ was given, an array is expected here if
	 * 													it is supplied.
	 * @returns mixed									The value set for given key against given reference
	 */
	get(ref, key, defaultValue) {
		if (!super.has(ref)) super.set(ref, new this.Constructor(...this.constructorParams));
		if (!key) return super.get(ref);
		if (!Array.isArray(key)) {
			if (!super.get(ref).has(key) && (arguments.length > 2)) this.set(ref, key, defaultValue);
			return super.get(ref).get(key);
		} else {
			const defaults = makeArray(defaultValue);
			return key.map((key, n)=>{
				if ((n+1) <= defaults.length) return this.get(ref, key, defaults[n]);
				return this.get(ref, key);
			});
		}
	}

	/**
	 * Get a new instance of this class.
	 *
	 * @static
	 * @param {mixed[]} [...params]		Parameters to supply to the constructor.
	 * @returns {Private}
	 */
	static getInstance(...params) {
		return new Private(...params);
	}

	/**
	 * Test for the existence of a given value set against the reference object.
	 *
	 * @public
	 * @param {Object} ref				The reference object / class instance.
	 * @param {string|number} [key]		The key you wish to test, if not set then then test for
	 * 									just the reference object.
	 * @returns boolean					Is the key set.
	 */
	has(ref, key) {
		if (!key) return super.has(ref);
		if (super.has(ref)) return super.get(ref).has(key);
		return false;
	}

	/**
	 * Invoke a given private method, binding to the supplied reference object.
	 *
	 * @public
	 * @param {Object} ref					The reference object / class instance.
	 * @param {string|number} methodName	The method, you wish to invoke.
	 * @param {Array} [...params=[]]		The parameters to use.
	 * @returns {mixed}						The result of invoking the given method with supplied parameters.
	 */
	invoke(ref, methodName, ...params) {
		if (!ref) throw new RangeError('A reference object must be supplied to the invoke() method.');
		if (!methodName) throw new RangeError('A method name must be supplied to the invoke() method.');
		const method = this.get(ref, methodName, ()=>{});
		return method.bind(ref)(...params);
	}

	/**
	 * Return an iterator for all the keys set against a given reference.
	 *
	 * @public
	 * @param {Object} ref		The reference object / class instance.
	 * @returns iterator		The return value of keys() method on your private map. Will normally a new Map
	 * 							iterator object.
	 */
	keys(ref) {
		if (!ref) throw new RangeError('A reference object must be supplied to the keys() method.');
		return this.get(ref).keys();
	}

	/**
	 * Link two objects together so they share all their private values. This cannot be reversed.
	 *
	 * @public
	 * @param {Object} ref1		The first object to link to.
	 * @param {Object} ref2		The second object to link to.
	 * @returns undefined
	 */
	link(ref1, ref2) {
		if (!ref1 || !ref2) throw new RangeError('Both reference objects should be supplied to link() methhod.');
		const values = new this.Constructor([...this.get(ref1).entries(), ...this.get(ref2).entries()]);
		super.set(ref1, values);
		super.set(ref2, values);
	}

	/**
	 * Set a private value against a given reference.
	 *
	 * @public
	 * @param {Object} ref				The reference object / class instance.
	 * @param key (string|number}		The key you wish to set. Will throw if not given.
	 * @param value {mixed}				The value to set it to.
	 * @returns {Map|*}					The return value of set() method on your private map. Will normally be the Map
	 * 									object if that is what you are using.
	 */
	set(ref, key, value) {
		if (!key) throw new RangeError('A key must be supplied to the set() method.');
		return this.get(ref).set(key, value);
	}

	/**
	 * Get an object containing all the key/values.
	 *
	 * @public
	 * @param {Object} ref		The reference object / class instance.
	 * @returns Object			An object containing your key/value pairs.
	 */
	toObject(ref) {
		if (!this.has(ref)) return {};
		return Object.assign({}, ...[...this.get(ref).keys()].map(key=>{
			return {[key]:this.get(ref,key)}
		}));
	}

	/**
	 * Return an iterator for all the values set against a given reference.
	 *
	 * @public
	 * @param {Object} ref		The reference object / class instance.
	 * @returns iterator		The return value of values() method on your private map. Will normally a new Map
	 * 							iterator object.
	 */
	values(ref) {
		if (!ref) throw new RangeError('A reference object must be supplied to the values() method.');
		return this.get(ref).values();
	}

	get [Symbol.toStringTag]() {
		return 'Private';
	}
}

Private.Constructor = Map;
Private.constructorParams = [];

module.exports = Private;