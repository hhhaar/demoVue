import axios from 'axios';

async function getMenu(){
	const res = await axios.get('/v1/selectMenuList')
	return res.data;
}

export default {getMenu}