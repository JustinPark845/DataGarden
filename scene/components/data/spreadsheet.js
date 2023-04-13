// Fetch Survey Data
// const sheetId = '1gox1xb5YkkeU7pzFXxd1lkUeNh5GjMDobdEFzD1H77E';
const sheetId = '1Eo8AWLa8I-fT9ZmUFRmmOPeSSX0nhx2H2kZQ3_tS3Yc';
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;

async function fetchData() {
	const response = fetch(url)
	.then(res => res.text())
	.then(data => {
		const temp = data.substring(47).slice(0,-2);
		const json = JSON.parse(temp);
		return json;
	});
	return response;
}

export { fetchData };