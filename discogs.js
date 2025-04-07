
export default function makeDiscogService(){
	let urlBase = "https://api.discogs.com"
	let token = "lrlwYRYnTgqxWYBUvAadpGlEXlzBBMJCybpdajwE"

	
	let service = {
		doRequest,
        getItem
	};

    async function doRequest(search, type, page = 1) {
        let api = `${urlBase}/database/search?q=${encodeURIComponent(search)}&type=${type}&page=${page}&per_page=50&token=${token}`;


        try {
            const response = await fetch(api);
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            return await response.json(); 
        } catch (error) {
            console.error('Erreur lors de la requête :', error);
        }
    }

    async function getItem(type,id){

    try{
        const response = await fetch(`${urlBase}/${type}/${id}`,{
        headers: {
            "Authorization": `Discogs token=${token}`
        }});


        return await response.json(); 
    }
    catch (error) {
        console.error('Erreur lors de la requête :', error);
    }



    }


    return service;

}
