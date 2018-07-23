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

	clear(ref) {
		if (!ref) throw new RangeError('A reference object must be supplied to the clear() method.');
		if (super.has(ref)) super.get(ref).clear();
	}

	delete(ref, key) {
		if (!key && super.has(ref)) return super.delete(ref);
		if (super.has(ref) && super.get(ref).has(ref)) return super.get(ref).delete(key);
		return false;
	}

	entries(ref) {
		if (!ref) throw new RangeError('A reference object must be supplied to the entries() method.');
		return this.get(ref).values();
	}

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

	has(ref, key) {
		if (!key) return super.has(ref);
		if (super.has(ref)) return super.get(ref).has(key);
		return false;
	}

	keys(ref) {
		if (!ref) throw new RangeError('A reference object must be supplied to the keys() method.');
		return this.get(ref).keys();
	}

	link(ref1, ref2) {
		if (!ref1 || !ref2) throw new RangeError('Both reference objects should be supplied to link() methhod.');
		const values = new this.Constructor([...this.get(ref1).entries(), ...this.get(ref2).entries()]);
		super.set(ref1, values);
		super.set(ref2, values);
	}

	invoke(ref, methodName, ...params) {
		if (!ref) throw new RangeError('A reference object must be supplied to the invoke() method.');
		if (!methodName) throw new RangeError('A method name must be supplied to the invoke() method.');
		const method = this.get(ref, methodName, ()=>{});
		return method.bind(ref)(...params);
	}

	set(ref, key, value) {
		if (!key) throw new RangeError('A key must be supplied to the set() method.');
		return this.get(ref).set(key, value);
	}

	toObject(ref) {
		if (!this.has(ref)) return {};
		return Object.assign({}, ...[...this.get(ref).keys()].map(key=>{
			return {[key]:this.get(ref,key)}
		}));
	}

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