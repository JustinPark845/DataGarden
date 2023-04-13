function randVal(min, max) {
	return max ? Math.floor(Math.random() * (max - min + 1)) + min : Math.floor(Math.random() * (min + 1));
}

function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

export {randVal, getRandomArbitrary};