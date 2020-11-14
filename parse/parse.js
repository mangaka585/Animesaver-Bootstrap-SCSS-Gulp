var fs = require('fs');
const RegExp1 = /\s/g;
const RegExp2 = /\'/g;
const RegExp3 = /\:/g;
const RegExp4 = /\(/g;
const RegExp5 = /\)/g;

const Parse = function(){
	let animeArray = [];
	fs.readFile('./kodikDB.json', 'utf8', function (err, data) {
	    if (err) console.log("Error!");
	    let animes = JSON.parse(data);
	    let results = animes.results;

	    function Season(
	    	number
	    	) {
	    	this.number = number;
	    }
		
		function Anime(
			id, 
			link,
			title, 
			title_orig,
			year, 
			last_season,
			last_episode,
			total_episodes,
			status,
			image,
			duration,
			genre_1,
			genre_2,
			genre_3,
			imdb,
			description,
			updated,
			seasons
			) {
		  this.id = id;
		  this.link = link;
		  this.title = title;
		  this.title_orig = title_orig;
		  this.year = year;
		  this.last_season = last_season;
		  this.last_episode = last_episode;
		  this.total_episodes = total_episodes;
		  this.status = status;
		  this.image = image;
		  this.duration = duration;
		  this.genre_1 = genre_1;
		  this.genre_2 = genre_2;
		  this.genre_3 = genre_3;
		  this.imdb = imdb;
		  this.description = description;
		  this.updated = updated;
		  this.seasons = seasons;
		};

		//Аниме
	    for (key in results) {
		  if (results.hasOwnProperty(key)) {
		    let obj = results[key];
		    let anime = new Anime(
		    	obj.id, 
		    	obj.material_data.title_en.replace(RegExp1, '-').replace(RegExp2,'').replace(RegExp3,'').replace(RegExp4,'').replace(RegExp5,''),
		    	obj.title, 
		    	obj.title_orig,
		    	obj.year, 
		    	obj.last_season,
		    	obj.last_episode,
		    	obj.episodes_count,
		    	obj.material_data.anime_status,
		    	obj.material_data.poster_url,
		    	obj.material_data.duration,
		    	obj.material_data.anime_genres[0],
		    	obj.material_data.anime_genres[1],
		    	obj.material_data.anime_genres[2],
		    	obj.material_data.imdb_rating,
		    	obj.material_data.description,
		    	obj.updated_at
		    	);

			//Его сезоны + эпизоды
			for (season in obj.seasons) {
			  if (obj.seasons.hasOwnProperty(season)) {
			  	let seasonObj = new Season(season);

			  	for (link in obj.seasons[season].episodes){
			  		let attrName = "episode-" + link;
			  		seasonObj[attrName] = obj.seasons[season].episodes[link].link;
			  	}

			  	anime.seasons = seasonObj;
			  }
			}
			//console.log(obj.material_data.directors[0]);

		    animeArray.push(anime);
		  } 
		}

		//Переводим в JSON
	    //console.log(animeArray);
	    let exp = JSON.stringify(animeArray);

		//Пишем результат в файл
		fs.writeFile("./resultDB.json", exp, function(err) {
		    if(err) {
		        return console.log("Ошибка!");
		    }
		    console.log("The file was saved!");
		});

	})
}

Parse();

/*global.fetch = require("node-fetch");
let request = function() {
    fetch('https://kodikapi.com/list?token=d0846c79e4bd6a60bc2ea6341dcf519e&types=anime-serial&with_episodes=true&with_episodes_data=true&with_material_data=true&limit=10')
      .then(response => console.log(response.json()))
      .catch(err => console.log(err));
     console.log("Ok");
}

request()*/