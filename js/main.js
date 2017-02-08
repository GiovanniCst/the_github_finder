//jQuery: Attende che il caricamento del documento sia completato e lancia la callback (funzione anonima)
$(document).ready(function() {

    // ### INIZIO - GESTIONE DI QUANTO STA SUCCEDENDO SUL FRONT-END - INIZIO ###

    //Debug
    console.log('Everything has loaded up')
        //Monìtora l'evento keyup all'interno del form con id #searchUser e lancia la callback (funzione anonima) a cui 
        //viene pasato l'evento
    $('#searchUser').on('keyup', function(event) {
        //Debug
        console.log('A key has now been released');
        //Debug
        console.log(event.target.value);
        //Preparo una variabile che contenga quanto viene digitato all' interno del form
        let nomeUtente = event.target.value;

        // ### FINE - GESTIONE DI QUANTO STA SUCCEDENDO SUL FRONT-END - FINE ###

        // ### INIZIO - INTERAZIONE CON GITHUB E PUBBLICAZIONE DELLE INFORMAZIONI - INIZIO ###

        //Ajax: Inoltra la prima richiesta a Github
        $.ajax({
            url: 'https://api.github.com/users/' + nomeUtente,
            data: {
                client_id: 'c0ac05c5c77e1a459876',
                client_secret: 'd3fddb21317b7a0570a8ef7dd8cb303a9c1b7971'
            }
            //La richiesta ajax restituisce una promessa. Quando la richiesta ajax è completata (.done) viene lanciata
            //la callback a cui viene passato l'oggetto generato a seguito della richiesta ajax
        }).done(function(utente) {
            //Aggiungo una seconda richiesta per ottenere l'oggetto che i dettagli relativi agli ultimi reposotories dell'utente
            $.ajax({
                url: 'https://api.github.com/users/' + nomeUtente + "/repos",
                data: {
                    client_id: 'c0ac05c5c77e1a459876',
                    client_secret: 'd3fddb21317b7a0570a8ef7dd8cb303a9c1b7971',
                    sort: 'created: asc',
                    per_page: 5
                }
            }).done(function(repositories) {
                //Debug
                console.log("Repos: " + repositories);
                $.each(repositories, function(index, repositories) {
                    $('#repos').append(`
                    <div class="well">
                        <div class="row">
                            <div class="col-md-7">
                                <strong>${repositories.name}</strong>: ${repositories.description};
                            </div>
                            <div class="col-md-3">
                            <span class="label label-primary">Forks: ${repositories.forks_count}</span>
                            <span class="label label-success">Osservato da: ${repositories.watchers_count}</span>
                            <span class="label label-info">Stelle: ${repositories.stargazers_count}</span>
                            </div>
                            <div class="col-md-2">
                            <a href="${repositories.html_url}" target="_blank" class="btn btn-default btn-sm">Pagina del Repo</a>
                            </div>
                        </div>
                    </div>
                    
                    `);

                });
            });

            //Debug
            console.log(utente);
            //jQuery: miro al div che ho preparato in index.html che è id="profiloGitHub" - (per includere l'accento grave ALT 0096)
            $('#profiloGitHub').html(
                //Con ${variabileDellOggettoGeneratoDallaChiamataAjax.Chiave} imposto le variabili che poi vengono inserite nell'html
                `
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">${utente.name}</h3>
                </div>
                <div class="panel-body">
                    <div class="row">
                        <div class="col-md-3">
                        <img class="thumbnail avatar" src="${utente.avatar_url}">
                        <a target="_blank" class="btn btn-primary btn-block" href="${utente.html_url}">Apri su GitHub</a>
                        </div>
                        <div class="col-md-9">
                        <span class="label label-primary">Repository pbblici: ${utente.public_repos}</span>
                        <span class="label label-success">Gists pubblici: ${utente.public_gists}</span>
                        <span class="label label-info">Seguarci: ${utente.followers}</span>
                        <span class="label label-warning">Segue: ${utente.following}</span>
                        <br><br>
                        <ul class="list-group">
                            <li class="list-group-item">Di: ${utente.location}</li>
                            <li class="list-group-item">Su GitHub dal: ${utente.created_at}</li>
                            <li class="list-group-item">Ultimo aggiornamento il: ${utente.updated_at}</li>
                            <li class="list-group-item">Azienda: ${utente.company}</li>
                            <li class="list-group-item">Sito / Blog: <a target="_blank" href="${utente.blog}">${utente.blog}</a></li>
                            <li class="list-group-item">Lo puoi ingaggiare? ${utente.hireable}</li>
                            <li class="list-group-item">Inidirizzo email: ${utente.email}</li>
                        </ul>
                        </div>
                    </div>
                </div>
            </div>
            <h3 class="page-header">I 5 Progetti più recenti</h3>
            <div id="repos"></div>
            
            
            `)

        })

    });
});