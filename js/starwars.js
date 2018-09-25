// Seu javascript aqui :)
// Use a Star Wars API: https://swapi.co/
// para carregar:
//  - A lista de filmes
//  - A introdução de cada filme, quando ele for clicado
const audio = new Audio('star-wars-intro.mp3');
audio.loop = true;

// FONTE: https://www.selftaughtjs.com/algorithm-sundays-converting-roman-numerals/
function toRoman(num) {  
  let result = '';
  const decimal = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const roman = ["M", "CM","D","CD","C", "XC", "L", "XL", "X","IX","V","IV","I"];

  for (let i in decimal) {
    while (num % decimal[i] < num) {     
      result += roman[i];
      num -= decimal[i];
    }
  }

  return result;
}

$.ajax({
  url: 'https://swapi.co/api/films/',
  dataType: 'json',
  success: (resposta) => {
    const $ulFilmes = $('#movies ul');
    const $preCrawl = $('.flow pre');
    $ulFilmes.html('');

    resposta.results.sort((a, b) => {
      return a.episode_id - b.episode_id;
    });

    for (let movie of resposta.results) {
      const episode = 'Episode ' + toRoman(movie.episode_id);
      
      $('<li></li>')
        .data('episode-url', movie.url)
        .html(episode + ': ' + movie.title)
        .appendTo($ulFilmes[0])
        .click((event) => {
          $.ajax({
            url: $(event.target).data('episode-url'),
            dataType: 'json',
            success: (response) => {
              const episode = 'Episode ' + toRoman(response.episode_id);
              const $preCrawl = $('.flow pre');
              const $newPre = $preCrawl.clone(true);

              $newPre.html(`${episode}\n${response.title.toUpperCase()}\n\n${response.opening_crawl}`);
              // reinicia a animação
              $preCrawl.parent().append($newPre);
              $preCrawl.remove();
              // reinicia a música
              audio.currentTime = 0;
              audio.play();
            }
          });
        });
    }

    $('#movies ul li').first().click();
  }
});