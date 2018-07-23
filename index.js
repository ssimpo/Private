'use strict';

const undef = Symbol('Internal Undefined');


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

	get(ref, key, defaultValue=undef) {
		if (!super.has(ref)) super.set(ref, new this.Constructor(...this.constructorParams));
		if (!key) return super.get(ref);
		if (!Array.isArray(key)) {
			if (!super.get(ref).has(key) && (defaultValue !== undef)) this.set(ref, key, defaultValue);
			return super.get(ref).get(key);
		} else {
			const defaults = makeArray(defaultValue).map(value=>((value === undef)?undefined:value));
			return key.map((key, n)=>this.get(ref, key, defaults[n]));
		}
	}

	set(ref, key, value) {
		return this.get(ref).set(key, value);
	}

	link(ref1, ref2) {
		const values = new this.Constructor([...this.get(ref1).entries(), ...this.get(ref2).entries()]);
		super.set(ref1, values);
		super.set(ref2, values);
	}

	has(ref, key) {
		if (!key) return super.has(ref);
		if (super.has(ref)) return super.get(ref).has(key);
		return false;
	}

	delete(ref, key) {
		if (!key && super.has(ref)) return super.delete(ref);
		if (super.has(ref) && super.get(ref).has(ref)) return super.get(ref).delete(key);
		return false;
	}

	clear(ref) {
		if (!ref) throw new RangeError('A reference object must be supplied to the clear() method.');
		if (super.has(ref)) super.get(ref).clear();
	}

	values(ref) {
		if (!ref) throw new RangeError('A reference object must be supplied to the values() method.');
		return this.get(ref).values();
	}

	keys(ref) {
		if (!ref) throw new RangeError('A reference object must be supplied to the keys() method.');
		return this.get(ref).keys();
	}

	entries(ref) {
		if (!ref) throw new RangeError('A reference object must be supplied to the entries() method.');
		return this.get(ref).values();
	}

	toObject(ref) {
		if (!this.has(ref)) return {};
		return Object.assign({}, ...[...this.get(ref).keys()].map(key=>{
			return {[key]:this.get(ref,key)}
		}));
	}

	get [Symbol.toStringTag]() {
		return 'Private';
	}
}

Private.Constructor = Map;
Private.constructorParams = [];

module.exports = Private;